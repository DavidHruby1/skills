import { z } from 'zod';

const nonempty = z.string().min(1);
const strings = z.array(nonempty);
const phaseId = z.string().regex(/^phase-[0-9]+$/);

export const CommandSchema = z.strictObject({
  name: nonempty,
  argv: strings.nonempty(),
  cwd: nonempty,
  evidence: nonempty,
});

export const PhaseSchema = z.strictObject({
  title: nonempty,
  commitMessage: nonempty,
  objective: nonempty,
  specRefs: strings.nonempty(),
  readFirst: z.array(z.strictObject({ path: nonempty, symbols: strings, reason: nonempty })),
  ownedPaths: strings.nonempty(),
  steps: z.array(z.strictObject({
    order: z.number().int().positive(),
    action: nonempty,
    paths: strings.nonempty(),
    symbols: strings,
    contract: nonempty,
    constraints: strings,
  })).nonempty(),
  acceptance: strings.nonempty(),
  invariants: strings,
  safeIntermediateState: z.string(),
  estimatedLines: z.number().int().positive(),
  sizeRationale: z.string(),
});
export type Phase = z.infer<typeof PhaseSchema>;

export const PlanSchema = z.strictObject({
  repository: z.strictObject({ provider: z.enum(['github', 'gitlab']), remote: nonempty, identity: nonempty }),
  protectedPaths: strings.nonempty(),
  setup: z.array(CommandSchema),
  checks: z.array(CommandSchema).nonempty(),
  phases: z.array(PhaseSchema).nonempty(),
});
export type Plan = z.infer<typeof PlanSchema>;

export const PlannerResultSchema = z.strictObject({
  status: z.enum(['ready', 'blocked']),
  reason: z.string(),
  plan: PlanSchema.nullable(),
});

export const ExecutionSchema = PlanSchema.safeExtend({
  version: z.literal(1),
  taskId: z.string().regex(/^task-[0-9]+$/),
  proposalHash: z.string().regex(/^[a-f0-9]{64}$/),
  specHash: z.string().regex(/^[a-f0-9]{64}$/),
  integrationBranch: nonempty,
  baseSHA: z.string().regex(/^[a-f0-9]{40,64}$/),
  phases: z.array(PhaseSchema.safeExtend({
    id: phaseId,
    branch: nonempty,
    target: nonempty,
    worktree: nonempty,
  })).nonempty(),
});
export type Execution = z.infer<typeof ExecutionSchema>;
export type ExecutionPhase = Execution['phases'][number];

export const WorkerResultSchema = z.strictObject({
  status: z.enum(['done', 'blocked']),
  summary: z.string(),
  addressedFindingIds: strings,
});

export const FindingSchema = z.strictObject({
  id: nonempty,
  axis: z.enum(['Standards', 'Spec']),
  severity: z.enum(['high', 'medium', 'low']),
  phaseId,
  path: nonempty,
  problem: nonempty,
  evidence: nonempty,
  recommendedFix: nonempty,
});

export const ReviewSchema = z.strictObject({
  status: z.enum(['pass', 'rework', 'blocked']),
  summary: z.string(),
  standardsVerdict: z.enum(['pass', 'rework', 'blocked']),
  specVerdict: z.enum(['pass', 'rework', 'blocked']),
  findings: z.array(FindingSchema),
  resolutions: z.array(z.strictObject({
    id: nonempty,
    status: z.enum(['fixed', 'not_fixed', 'superseded']),
    reason: z.string(),
  })),
  blocker: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const DiagnosisSchema = z.strictObject({
  status: z.enum(['fix', 'blocked']),
  phaseId: z.string(),
  counterexample: z.string(),
  recommendedFix: z.string(),
  reason: z.string(),
});

export const TicketsSchema = z.strictObject({
  status: z.enum(['pass', 'partial', 'blocked', 'conflict']),
  summary: z.string(),
  issues: z.array(z.strictObject({ phaseId: z.string(), url: z.url() })),
});

export const PublicationSchema = z.strictObject({
  status: z.enum(['published', 'blocked']),
  url: z.url().nullable(),
  summary: z.string(),
});

// This is policy validation, not a sandbox for commands or a semantic review of a plan.
function safePath(path: string, glob = false, dot = false): boolean {
  if (dot && path === '.') return true;
  if (!path || path.startsWith('/') || path.includes('\\') || /[\x00-\x1f\x7f]/.test(path)) return false;
  const segments = path.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..' || segment === '.git' || segment === '.env' || segment.startsWith('.env.'))) return false;
  if (!glob && /[*?\[\]{}]/.test(path)) return false;
  return true;
}

export function validatePlan(plan: Plan, spec: string): void {
  const errors: string[] = [];
  const { repository } = plan;
  if (!/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)+$/.test(repository.identity) || repository.identity.split('/').some((part) => part === '.' || part === '..')) {
    errors.push('repository.identity must be host/namespace/project (nested groups allowed), without colon or query');
  }
  if (repository.remote.startsWith('-')) errors.push('repository.remote must not start with a dash');
  const patterns: Bun.Glob[] = [];
  plan.protectedPaths.forEach((path, i) => {
    if (!safePath(path, true)) errors.push(`protectedPaths[${i}] must be a safe relative POSIX glob`);
    else {
      try { patterns.push(new Bun.Glob(path)); }
      catch { errors.push(`protectedPaths[${i}] is not a valid glob`); }
    }
  });
  for (const [kind, commands] of [['setup', plan.setup], ['checks', plan.checks]] as const) {
    commands.forEach((command, i) => {
      if (!safePath(command.cwd, false, true)) errors.push(`${kind}[${i}].cwd must be a safe relative POSIX directory`);
      const executable = command.argv[0]?.split('/').pop()?.toLowerCase() ?? '';
      if (command.argv[0]?.startsWith('-') || /^(git|gh|glab|rm|sudo|sh|bash|zsh)$/.test(executable) || command.argv.some((arg) => arg === '-c')) {
        errors.push(`${kind}[${i}].argv must not invoke mutation/publication executables, shell interpreters, or -c`);
      }
      // evidence names a source for human inspection; argv screening is not a sandbox.
    });
  }
  plan.phases.forEach((phase, i) => {
    const label = `phases[${i}]`;
    const owned = new Set<string>();
    phase.ownedPaths.forEach((path) => {
      if (!safePath(path) || path === '.opencode' || path.startsWith('.opencode/') || /(^|\/)(__tests__|tests|test|fixtures|snapshots)(\/|$)|\.(test|spec)\.[^/]+$/i.test(path)) {
        errors.push(`${label}.ownedPaths: unsafe, task artifact, or test path: ${path}`);
      }
      if (owned.has(path)) errors.push(`${label}.ownedPaths: duplicate path: ${path}`);
      owned.add(path);
      if (patterns.some((pattern) => pattern.match(path))) errors.push(`${label}.ownedPaths: protected path: ${path}`);
    });
    phase.readFirst.forEach((entry, j) => {
      if (!safePath(entry.path)) errors.push(`${label}.readFirst[${j}].path must be a safe relative POSIX path`);
    });
    phase.steps.forEach((step, j) => {
      if (step.order !== j + 1) errors.push(`${label}.steps[${j}].order must be ${j + 1}`);
      step.paths.forEach((path) => {
        if (!safePath(path) || /(^|\/)(__tests__|tests|test|fixtures|snapshots)(\/|$)|\.(test|spec)\.[^/]+$/i.test(path) || !owned.has(path)) {
          errors.push(`${label}.steps[${j}].paths: unsafe, test, or unowned path: ${path}`);
        }
      });
    });
    phase.specRefs.forEach((excerpt, j) => {
      if (!spec.includes(excerpt)) errors.push(`${label}.specRefs[${j}] is not an exact SPEC.md excerpt`);
    });
    if (phase.estimatedLines > 500 && !phase.sizeRationale.trim()) errors.push(`${label}.sizeRationale is required above 500 estimated lines`);
  });
  if (errors.length) throw new Error(`Invalid plan:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}

export function validateReview(review: Review, execution: Execution, previous?: Review): void {
  const errors: string[] = [];
  const findings = new Set<string>();
  for (const finding of review.findings) {
    if (findings.has(finding.id)) errors.push(`duplicate finding id: ${finding.id}`);
    findings.add(finding.id);
    const phase = execution.phases.find((candidate) => candidate.id === finding.phaseId);
    if (!phase || !phase.ownedPaths.includes(finding.path)) errors.push(`finding ${finding.id}: path must belong to known phase ${finding.phaseId}`);
  }
  if (review.status === 'pass' && (review.findings.length || review.standardsVerdict !== 'pass' || review.specVerdict !== 'pass' || review.blocker)) errors.push('pass requires no findings, both axes pass, and empty blocker');
  if (review.status === 'rework' && (!review.findings.length || review.standardsVerdict === 'blocked' || review.specVerdict === 'blocked')) errors.push('rework requires findings and no blocked axis');
  if (review.status === 'blocked' && !review.blocker.trim()) errors.push('blocked requires a nonempty blocker');
  const resolutions = new Set<string>();
  for (const resolution of review.resolutions) {
    if (resolutions.has(resolution.id)) errors.push(`duplicate resolution id: ${resolution.id}`);
    resolutions.add(resolution.id);
    if (resolution.status === 'not_fixed' && !findings.has(resolution.id)) errors.push(`not_fixed finding ${resolution.id} must remain in findings`);
    if (resolution.status !== 'not_fixed' && findings.has(resolution.id)) errors.push(`${resolution.status} finding ${resolution.id} cannot remain under the same id`);
    if (resolution.status === 'superseded' && !resolution.reason.trim()) errors.push(`superseded finding ${resolution.id} must explain replacement`);
    if (review.status === 'pass' && resolution.status === 'not_fixed') errors.push(`pass cannot include not_fixed finding ${resolution.id}`);
  }
  if (previous) {
    for (const finding of previous.findings) {
      if (!resolutions.has(finding.id)) errors.push(`previous finding ${finding.id} requires explicit resolution`);
    }
  }
  if (errors.length) throw new Error(`Invalid review:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}
