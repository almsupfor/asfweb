---
target: src/pages/i-media.astro
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Dev\\asfweb\\src\\pages\\i-media.astro"
target_fingerprint: "sha256:86fcf597441e30dc8a829f99e3f5e374cf22c5ee22dfc7c3a634b7d6ffba92b1"
target_path: "C:\\Dev\\asfweb\\src\\pages\\i-media.astro"
timestamp: 2026-10-27T10-45-41Z
slug: src-pages-i-media-astro
---
Method: dual-agent (A: design review · B: detector + rendered facts; no browser)

Score: 20/32 (n/a: 7, 10). Acceptable.

Design specificity: interchangeable. On-system but not on-voice. Detector: 0 findings in i-media.astro, Base.astro, Mail.astro.

Priority issues
- [P1] Lead (i-media.astro:17) promises Damlaget/J20 sections; both are empty (0 of 18 items) and do not render. Fix: generic lead + jump row from non-empty sections, id="a-laget". /impeccable layout
- [P1] lagFor (media.ts:16-17): `dam-?` matches "dam" anywhere in title+URL (Adam, Amsterdam); `junior` over-matches; herr guard checks title only. Fix: word boundaries, title only, override table. /impeccable harden
- [P1] All links target=_blank with no cue; links color-only (no underline until hover); no :visited. Fix: hidden "(öppnas i ny flik)", arrow, focus underline, visited tone. /impeccable harden
- [P2] Each item is h3 (up to 120); `.list h2` rule in global.css:43 is dead; DESIGN.md Headline role mismatches markup. /impeccable typeset then document
- [P2] Flat hierarchy; freshness stamp buried at bottom; long dates repeated; podd rows lack source; no <time>. /impeccable clarify

Personas: Sam (heading nav, new tab, color-only links), Casey (no jump nav, new tab per tap), returning member (no "new since last").

Minor: podd titles carry list numbers; no show-more beyond slice(0,60); empty state only for A-lag; focus ring exists in Base.astro:90 (B's claim of none was wrong).
