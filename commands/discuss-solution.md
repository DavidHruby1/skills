---
description: Prověří návrh kontrariánským a steelman posouzením.
argument-hint: <insert idea or plan>
agent: build
---

# DiscussSolution

Návrh nebo plán uživatele:

```text
$ARGUMENTS
```

V jednom paralelním kroku spusť přes `task` přesně dva subagenty s `subagent_type: general` a žádné další subagenty:

1. **General task 1: Contrarian.** Tento subagent je pouze kontrarián. Prověř relevantní soubory a hledej výhradně negativa návrhu: chyby, rizika, slabé předpoklady, možné regrese a chybějící části. Nehledej, nehodnoť ani nezmiňuj jeho silné stránky. Vrať detailní report, kde má každý závěr důkaz a odkaz `path:line` na soubor. Nic neupravuj.
2. **General task 2: Steelman.** Tento subagent je pouze steelman. Prověř relevantní soubory a hledej výhradně pozitiva návrhu: silné stránky, správná rozhodnutí a podmínky, za kterých návrh funguje. Nehledej, nehodnoť ani nezmiňuj jeho chyby, rizika nebo slabiny. Vrať detailní report, kde má každý závěr důkaz a odkaz `path:line` na soubor. Nic neupravuj.

Po obdržení obou reportů samostatně znovu načti potřebné soubory a ověř jejich tvrzení; nespoléhej na reporty jako na zdroj pravdy. Znovu posuď původní návrh a předlož nejlepší výsledné řešení včetně ověřených trade-offů a přesných změn proti původnímu návrhu.
