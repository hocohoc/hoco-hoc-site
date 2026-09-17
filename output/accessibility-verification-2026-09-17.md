# Accessibility verification and remaining work

Report finalized as a working assessment on September 17, 2026. Code and browser checks were run during the September 16–17 session. This is a local release candidate; changes have not been deployed. The Word file still contains unresolved evaluation entries and is not a completed conformance certification.

## Implemented in this revision

- Public Accessibility page, persistent footer link, keyboard help, limitations, and email contact independent of Google Forms.
- Labels and selected-state semantics for question/option authoring; responsive article editor and accessibility publishing guidance.
- Quiz unanswered-question validation, review before confirmation, completion focus, and recovery from failed submissions.
- Profile review before confirming an immutable school selection.
- Text descriptions of built-in cat/fish training images, editable uploaded training-image descriptions, phase focus and classifier failure messages.
- Stronger text-input borders, corrected Help contrast and heading structure, responsive game cards, accessible teacher page-size control and scrollable tables.
- Per-article browser titles and video failure recovery, including cached failures before hydration.
- Empty Scratch files 2.mp4 and 3.mp4 removed from the editor menu. Existing authored references still need repair.

## Verified

TypeScript, lint and the final production build passed. Existing image-optimization and React hook-dependency warnings remain.

Chrome 151.0.7922.170 on macOS, signed out. axe-core 4.7.0 scans used wcag2a, wcag2aa, wcag21aa and best-practice tags. All 22 scanned routes reported zero automatic violations after fixes. Incomplete contrast and embedded-frame checks remain; this is not complete WCAG coverage.

All 22 scanned route states fit a 320 CSS-pixel document width. Seven sampled routes were also measured with 1.5 line height, 2em paragraph spacing, .12em letter spacing and .16em word spacing, and with 200% root text size at a 1280-pixel viewport. Those states had no document overflow. Root text size is an approximation, not exhaustive browser zoom testing.

Keyboard checks verified the initial skip link and its main-content target, retained focus after a classifier label, and focus on the next classifier phase. A repository sample image verified editable image descriptions. The sample-data fixture verified quiz validation, review/confirmation, completion focus, authoring labels, selected-answer state, option removal, native video failure recovery and transcript disclosure. Its automated scan reported zero violations, with incomplete contrast, link and caption checks. The temporary route was removed before the production build. No authenticated account data or scores were submitted.

## Owner supplied evidence

The owner confirmed on September 17 that videos have subtitles. Subtitles can be embedded or burned in, so the absence of separate local caption files does not establish that subtitles are missing. Accuracy, synchronization, speaker identification and meaningful non-speech sound coverage were not independently verified. Subtitle availability does not by itself establish audio-description or transcript conformance.

## Remaining validation

Use an approved student, teacher and administrator test account to complete authentication, registration, profile, quiz, teacher and authoring workflows, including errors and recovery. Test with a screen reader and record its version. Review every published instructional image and video, including existing subtitles and any required audio description. Repair references to the two empty local videos. Complete manual contrast, zoom and full-process checks. Deploy and recheck the intended public release, then resolve each remaining draft marker with evidence.

## Evidence files

- HoCoHOC_VPAT_ACR_2026-09-17.docx: 50 WCAG 2.0/2.1 A/AA criteria and Revised Section 508 chapters 3, 5 and 6.
- accessibility-results-2026-09-17.json: route scan, interaction and fixture results.
- VPAT.md: matching Markdown assessment, replacing the stale unsupported historical claims.

Source SHA-256: `1f148ec590b8312ed0bcf7942ac7a3e285eeb7d222f28f20395e326d620ae4e4`.

Fingerprint: sort repository-relative files under src; hash each UTF-8 path, NUL, file bytes and NUL in order.
