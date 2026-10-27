---
target: src/pages/i-media.astro
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Dev\\asfweb\\src\\pages\\i-media.astro"
target_fingerprint: "sha256:1e00c1f164affdc2320d965efa8cb421c7b01fa10bc47f3a68c80819e48748d8"
target_path: "C:\\Dev\\asfweb\\src\\pages\\i-media.astro"
timestamp: 2026-10-27T15-08-52Z
slug: src-pages-i-media-astro
---
Method: dual-agent (A: design review · B: detector + rendered facts; no browser)

Score: 21/32 (n/a: 7, 10). Acceptable (66%).

Design specificity: mostly generic, honestly so. Detector: 0 findings.

Priority issues
- [P1] Wrong club in team sections: J18 holds "Seger för SSK U18 ..." (Lanstidningen Sodertalje). media.ts [ju]18 has no Almtuna anchor; A-lag is the default for anything unclear. Fix: require Almtuna for youth buckets, quiet bucket for unsure, LAG_OVERRIDES for current case. /impeccable harden
- [P2] Flat hierarchy: 38 h3, 26 identical red rows; dead `.list h2` rule. /impeccable typeset
- [P2] Freshness stamp last; chips show capped count; duplicate automation copy. /impeccable clarify
- [P2] :visited differs by hue only; underline only on hover/focus. /impeccable polish
- [P3] Empty/sparse sections vanish silently; U20 (2) and J18 (1) get full sections. /impeccable harden

Personas: Jordan (feed wall, wrong-club item), Sam (38 h3 each reading the new-tab hint), Casey (3-line titles, orphan arrow, no back-to-top), returning member (no new-since-last).

Minor: "ny flik" vs "nytt fonster" wording and duplicate .sr-only; jump nav and arrow missing from DESIGN.md; podd titles carry list numbers; long dates.
