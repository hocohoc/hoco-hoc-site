# HoCoHOC accessibility changes and verification

September 11, 2026. Local working changes based on commit `75f61e63b14f524357bc6999ad80844e6534614c`. These changes have not been deployed. The Word report is an updated draft, not a completed claim of WCAG conformance.

## Implemented changes

- Kept one main landmark per page, raised the skip link above navigation, and made its target focusable.
- Added a modal navigation menu with a close button, keyboard focus loop and focus restoration. Shared dialogs retain focus during parent rerenders and scroll within the viewport. Navigation height determines focus scroll offsets when text grows.
- Added persistent labels to registration, profile, answer, category and image-upload controls. Registration can close during saving; its message explains that saving continues. Profile and registration failures show recovery messages.
- Associated quiz groups with their questions, replaced clipped radio inputs with visible contrasting controls, added textual incorrect-answer explanations and a status summary, and retained focus for quiz completion.
- Added pressed-state semantics and border cues to game selectors. Corrected sampled difficulty-button and footer contrast, enlarged image-removal buttons, and fixed an invalid prize list.
- Documented and implemented Escape then Tab/Shift+Tab to leave the code editor. Replaced the transparent syntax overlay with visible resizable text so input and visual content stay aligned under spacing changes. Preserved indentation and smart Enter/Backspace handling. Added keyboard access to horizontally scrolling code/reference regions.
- Removed automatic feedback advancement from Hex Guesser, Binary Decoder and Mindstorm. Successful Write Code results now remain available instead of triggering an immediate next challenge. Solved sorting/color controls retain keyboard focus.
- Added RGB text alternatives in both Hex Guesser modes. Classifier image names identify the exercise/category and index; the visual tasks still need content-level accessibility review.
- Replaced the looping typewriter heading with static text. Limited completion confetti to four seconds and hid it when reduced motion is requested. Adjusted hero sizing, game spacing and wrapping for narrow screens.
- Added reusable article video rendering with optional English WebVTT captions, a transcript disclosure and a link to an audio-described version. Added matching article-editor fields. No actual lesson captions, transcripts or described video files were invented or published.

## Checks completed

`npx tsc --noEmit`, `npm run lint`, `npm run build`, and `git diff --check` passed. The production build generated 34 static pages. The first sandboxed build could not fetch existing Google Fonts; the authorized build with network access succeeded. Existing image-optimization and React hook-dependency lint warnings remain.

Local browser checks used the Codex in-app browser on macOS, signed out:

| Check | Result |
| --- | --- |
| Homepage skip link | Visible above navigation; activation followed by Tab reached View All Winners. |
| Navigation menu | Focus entered the menu, reverse Tab wrapped, Escape returned focus to the trigger. |
| Shared dialog fixture | Focus stayed on the activated button through a parent rerender; Escape returned to the opener. |
| Quiz component fixture | Space and arrow keys selected radios; question association, visible focus ring and incorrect-answer text were checked. |
| Write Code editor | Tab inserted indentation; Escape then Tab reached Run; Escape then Shift+Tab reached Reset. |
| Python execution | String Length and Remove Duplicates solutions passed all three test cases. Final Remove Duplicates result persisted, with focus on Run. |
| Algo Sorter | Completed a round using Space. Success appeared in a status region and focus stayed on the solved number button. |
| Hex Guesser | Answered through the keyboard; selected button retained focus; feedback used a status region; both modes exposed RGB values. |
| FlexiBot | Category fields and both training-image file inputs exposed their visible labels. No user images were uploaded. |
| Video fixture | Native player exposed a caption track and the transcript disclosure opened. Test assets were removed afterwards. |
| Narrow layouts | At 320 CSS pixels, homepage, sandbox, Algo Sorter, Hex Guesser, Binary Decoder, Mindstorm and classifier-upload states had a 305-pixel document width, excluding the scrollbar. |
| Text enlargement | At a 1280-pixel viewport with a 200% root font size, homepage and editor had no document-width overflow or clipped buttons in measured states. This is not an exhaustive zoom test. |
| Text spacing | Applied all four WCAG text-spacing overrides to sampled homepage, quiz and Hex Guesser states. A small swatch-button overflow was found and its fixed height was replaced by a minimum height. Full retesting across content remains necessary. |

## Automated scan results

Used the already-installed axe-core 4.7.0 with available `wcag2a`, `wcag2aa`, `wcag21aa` and `wcag22aa` tags. The engine version does not establish complete WCAG 2.2 rule coverage. Scans ran through a temporary local app control, removed before the production build.

Final settled-state scans reported zero automatic violations on the homepage; Algo Sorter; Hex Guesser; Binary Decoder; Mindstorm; FlexiBot category and upload states; Purr-ceptron labeling state; sandbox Predict Output and Write Code states; and a real-component quiz/dialog/video fixture. Several scans returned incomplete contrast checks; the media fixture also returned an incomplete inline-link check. Initial scans during fade-in transitions were repeated after content settled. A keyboard-scroll defect in the code preview was corrected and re-scanned.

## Remaining work before issuing a final ACR

1. Review every published video for accurate captions, meaningful audio/visual alternatives, and audio description where required. Populate the new media fields with verified assets. Review authored article images and visual classification tasks against the applicable requirements and test exception.
2. Test complete Google sign-in, registration, profile changes and article quiz flows using a permitted test account, including recovery and failed/stalled saves. Test with screen readers and record browser/assistive-technology versions.
3. Complete manual contrast, 200% text enlargement, reflow, spacing, target-size, language-change, flash and input/error-prevention checks across remaining pages and embedded content.
4. Deploy the intended release through the normal release process, recheck the deployed version and authored content, and replace all 20 Pending verification markers in the Word draft with evidence-backed conformance ratings.

The draft currently contains 32 Supports, 4 Not Applicable and 20 Pending verification entries. Pending verification is explicitly a drafting marker, not an ITI conformance rating. No full accessibility certification is claimed.

## Source identity

SHA-256 of the final `src` tree: `3bffb161d44a37a9e0d8b727f657925941e2b175e6c88c857cd879530a17923e`.

Fingerprint method: sort all files under `src` by path; hash each repository-relative path as UTF-8, a NUL byte, the file bytes, and another NUL byte. Temporary test pages, scan controls and spacing overrides were removed before calculating this value.

The original supplied DOCX was preserved. The updated report retains its report tables and links, removes the template instruction pages and out-of-scope AAA table, and distinguishes local changes from the historical public-site baseline.
