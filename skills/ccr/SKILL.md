---
name: color-contrast-cli
description: Use @siluat/color-contrast-cli (`ccr`) for WCAG contrast ratios, AA/AAA checks, JSON output, suggestions, verbose color debugging, and batch checks.
---

# Color Contrast CLI

## Purpose

- Use `ccr` to check WCAG 2.1 contrast between a foreground color and background color.
- Use it for exact color pairs, palette pairs, CI pass/fail checks, and accessible foreground suggestions.
- Always pass foreground first and background second.
- Prefer `--json` when an agent or script needs to parse the result.

## Install

- Global install:

```bash
npm install -g @siluat/color-contrast-cli

- Run without install:
npx @siluat/color-contrast-cli '#000' '#fff'

- Global command after install:
ccr '#000' '#fff'

Basic Use

- Check a pair:
ccr '#000' '#fff'
- JSON output:
ccr '#333' '#fff' --json
- JSON shape:
{"ratio":12.63,"normalText":"AAA","largeText":"AAA"}

Result Meaning

- ratio is the WCAG contrast ratio, rounded to 2 decimals.
- normalText is the compliance grade for normal text.
- largeText is the compliance grade for large text.
- Possible grades are AAA, AA, and Fail.
- Ratio range is 1 to 21.

WCAG Thresholds

- AA normal text: 4.5:1.
- AA large text: 3:1.
- AAA normal text: 7:1.
- AAA large text: 4.5:1.
- Large text means at least 18pt / 24px regular.
- Large text also means at least 14pt / 18.66px bold.

Pass/Fail Checks

- Check AA for normal text:
ccr '#333' '#fff' --level AA
- Check AAA for normal text:
ccr '#333' '#fff' --level AAA
- Check AA for large text:
ccr '#777' '#fff' --level AA --size large
- Get JSON plus exit code:
ccr '#333' '#fff' --level AA --json

Exit Codes

- 0: command succeeded, or requested level passed.
- 1: requested level failed, or suggestion could not be produced.
- 2: invalid input or parse error.
- Treat exit code 1 as an accessibility result, not a crash.
- Treat exit code 2 as invalid input.

Suggestions

- Suggest an accessible foreground color:
ccr '#777' '#fff' --suggest --level AA
- Suggest with JSON:
ccr '#777' '#fff' --suggest --level AA --json
- Suggestion JSON shape:
{"original":{"ratio":4.48,"normalText":"Fail","largeText":"AA"},"suggested":{"color":"#767676","ratio":4.54,"normalText":"AA","largeText":"AAA"}}
- --suggest requires --level.
- Suggestions modify the foreground color.
- Suggestions preserve hue and saturation by adjusting OkLCH lightness.
- If the pair already passes, no suggestion is made.
- If the target cannot be met, exit code is 1.

Batch Mode

- Process multiple pairs from stdin:
printf '%s\n' '#000 #fff' '#333 #ccc' '#666 #999' | ccr --batch
- Batch JSON:
printf '%s\n' '#000 #fff' '#333 #ccc' | ccr --batch --json
- Batch pass/fail:
printf '%s\n' '#000 #fff' '#666 #999' | ccr --batch --level AA
- Batch suggestions:
printf '%s\n' '#777 #fff' '#333 #fff' | ccr --batch --suggest --level AA
- Batch input uses one foreground/background pair per line.
- Batch input accepts spaces or tabs between pair values.
- Batch input ignores blank lines.
- Batch input supports // comments.
- Batch input supports functional colors like rgb() and oklch().
- Batch continues after invalid lines.
- Batch returns exit code 2 if any line has an input error.
- Do not combine --batch with --verbose.

Verbose Mode

- Use verbose mode to debug parsing and conversions:
ccr 'oklch(60% 0.15 50)' 'white' --verbose
- Use verbose suggestions to inspect OkLCH adjustment:
ccr '#777' '#fff' --suggest --level AA --verbose
- --verbose shows parsed color values.
- --verbose shows color-space conversions.
- --verbose shows alpha compositing.
- --verbose shows relative luminance.
- --verbose shows the final contrast evaluation.
- Do not combine --verbose with --json.
- Do not combine --verbose with --batch.

Supported Color Formats

- HEX: #RGB, #RRGGBB, #RGBA, #RRGGBBAA.
- Named colors: red, navy, rebeccapurple, transparent.
- RGB: rgb(255 0 0), rgb(255 0 0 / 0.5), rgba(255, 0, 0, 0.5).
- HSL: hsl(120 100% 50%), hsl(120 100% 50% / 0.5), hsla(120, 100%, 50%, 0.5).
- HWB: hwb(120 0% 0%), hwb(120 0% 0% / 0.5).
- LAB: lab(50% 40 59.5), lab(50% 40 59.5 / 0.5).
- LCH: lch(52.2% 72.2 50), lch(52.2% 72.2 50 / 0.5).
- OKLAB: oklab(59% 0.1 0.1), oklab(59% 0.1 0.1 / 0.5).
- OKLCH: oklch(60% 0.15 50), oklch(60% 0.15 50 / 0.5).

Alpha And Gamut

- WCAG contrast is calculated between opaque sRGB colors.
- Alpha colors are composited before contrast is calculated.
- Background alpha is composited over white.
- Foreground alpha is composited over the resolved background.
- LAB, LCH, OKLAB, and OKLCH are resolved to sRGB.
- Out-of-gamut wide-gamut colors are gamut-mapped to sRGB.
- Use --verbose to inspect resolved sRGB values.

Error Handling

- Invalid colors print plain text errors to stderr.
- Invalid colors exit with code 2.
- Errors are not JSON, even when --json is used.
- Do not parse stderr as JSON.
- Fix invalid input before trusting results.

Agent Rules

- Use --json for machine-readable answers.
- Use --level AA unless the user asks for AAA.
- Use --size large only for large text.
- Use --suggest --level AA --json when a normal-text pair fails AA.
- Use --verbose only for debugging color parsing or conversion.
- Never combine --verbose with --json.
- Never combine --verbose with --batch.
- Always quote color arguments.
- Always preserve foreground/background order.
