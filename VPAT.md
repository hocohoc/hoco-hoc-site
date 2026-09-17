# HoCoHOC accessibility assessment

**Working draft — not a completed ACR or conformance certification.**

# HoCoHOC Accessibility Conformance Report

Accessibility assessment for HCPSS review

Based on VPAT® Version 2.5Rev with WCAG and Revised Section 508 tables

Name of Product/Version: Howard County Hour of Code / AI (HoCoHOC), web application version 0.1.0. Local September 17, 2026 revision of commit 4a8a9b7. Source SHA-256 1f148ec590b8312ed0bcf7942ac7a3e285eeb7d222f28f20395e326d620ae4e4. Public URL: https://hocohoc.org/. This assessment describes local changes, not a verified deployed release.

Report Date: September 17, 2026

Product Description: An educational website for Howard County students, with computer science and AI articles, quizzes, coding challenges, games, learning progress and school scoring.

Contact Information: HoCoHOC team, mdhocohoc@gmail.com. This is the existing contact published in the website footer.

Notes: This working report is not ready to be represented as a completed ACR or as evidence of full accessibility conformance. Pending verification is a workflow marker, not an ITI conformance rating. The report covers the student website and includes source observations of teacher and administrative authoring tools. Complete authenticated processes, published lesson content, and third-party services remain unverified. The report must be finalized against the intended deployed release after the remaining checks. No claim of COMAR or Section 508 compliance is made.

Evaluation Methods Used: Source inspection; isolated Chrome 151.0.7922.170 on macOS; axe-core 4.7.0 automated WCAG A/AA and best-practice checks on 22 signed-out routes; keyboard interaction checks; DOM measurement at 320 CSS pixels; seven sampled pages with WCAG text-spacing overrides and 200% root text size; local component fixtures; TypeScript, lint and production build. These checks do not replace testing with a screen reader. No VoiceOver, NVDA or JAWS test or authenticated end-to-end test was performed. Earlier September 11 checks are separately identified as historical local evidence.

## Applicable Standards

The assessment addresses WCAG 2.0 and 2.1 Levels A and AA and Revised Section 508. COMAR 13A.06.05.06 specifies WCAG 2.1 Level AA for digital learning resources. Inclusion is assessment coverage, not a claim of conformance. WCAG 2.2-only criteria and Level AAA are outside this report.

| Standard/Guideline | Included In Report |
| --- | --- |
| Web Content Accessibility Guidelines 2.0 and 2.1 | Levels A and AA: Yes (working assessment); Level AAA: No |
| Revised Section 508 standards | Yes (working assessment), Chapters 3, 5 and 6; hardware not applicable |

## Terms

The terms used in the Conformance Level information are defined as follows:

Supports: The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation.

Partially Supports: Some functionality of the product does not meet the criterion.

Does Not Support: The majority of product functionality does not meet the criterion.

Not Applicable: The criterion is not relevant to the product.

Pending verification: A draft marker indicating that available evidence is insufficient to assign a conformance level. It is not an ITI conformance rating and must be replaced in the completed report.

## WCAG 2 0 and 2 1 Assessment

Note: When reporting on conformance with the WCAG 2.x Success Criteria, they are scoped for full pages, complete processes, and accessibility-supported ways of using technology as documented in the WCAG 2.0 Conformance Requirements.

## Table 1 Success Criteria Level A

Notes: Supports ratings refer to reviewed first-party functionality and the evidence in each row. Pending verification remains unresolved. Full-page and complete-process conformance cannot be claimed until the remaining checks are complete.

| Criteria | Conformance Level | Remarks and Explanations |
| --- | --- | --- |
| 1.1.1 Non-text Content (Level A) | Pending verification | Purr-ceptron now provides animal descriptions for the 26 built-in images; the educational objective is training a model rather than testing sight. FlexiBot training uploads have editable descriptions. Uploaded test images use filenames, which may not describe their content. Published article images and screenshots still need a content audit. [E3, E4, E11] |
| 1.2.1 Audio-only and Video-only (Prerecorded) (Level A) | Pending verification | Four nonempty local Scratch MP4s and two empty MP4s were found. Determine whether each nonempty video includes audio and supply an equivalent alternative where required. Empty files were removed from the authoring menu; existing lesson references still need correction. [E3, E11] |
| 1.2.2 Captions (Prerecorded) (Level A) | Pending verification | The product owner confirmed on September 17 that the videos have subtitles. This is owner-supplied evidence; embedded or burned-in subtitles need not appear as separate repository files. Subtitle accuracy, synchronization, speaker identification and meaningful non-speech sounds were not independently verified. The native player supports WebVTT captions. [E3, E11] |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) (Level A) | Pending verification | The player exposes an expandable transcript and an audio-description link. Existing lesson transcripts and equivalent coverage of visual/audio information remain unverified. A fixture verified the transcript disclosure, not the adequacy of lesson content. [E3, E11] |
| 1.3.1 Info and Relationships (Level A) | Pending verification | First-party fields use associated labels and quiz radio groups reference questions. This revision fixes heading order, teacher page-size labeling, and authoring fields. All 22 signed-out page scans had no automatic violations after fixes. Teacher/admin signed-in states and authored article structure still need evaluation. [E1, E2, E6, E11] |
| 1.3.2 Meaningful Sequence (Level A) | Supports | Reviewed navigation, article renderer and game components place instructions before controls and results in source order. The sampled browser accessibility trees follow that sequence. Database-authored content still requires content review. [E1, E3, E4, E9] |
| 1.3.3 Sensory Characteristics (Level A) | Supports | Hex Guesser presents numeric red, green and blue values in both modes, allowing the task to be understood without identifying a swatch visually. Reviewed navigation and answer instructions identify controls by their text. Image-classification content remains subject to the non-text-content review. [E4, E10] |
| 1.4.1 Use of Color (Level A) | Supports | Difficulty and mode buttons expose pressed state and an inset border. Quiz radios use a ring/dot shape. Game results include success/error text; Hex Guesser provides RGB text in both modes. Reviewed selections and results therefore have cues in addition to color. [E4, E6, E10] |
| 1.4.2 Audio Control (Level A) | Supports | Reviewed native article videos require the user to start playback; the YouTube embed configuration does not request autoplay. The sampled page trees exposed no audio player. Other embedded content requires separate verification. [E3, E9] |
| 2.1.1 Keyboard (Level A) | Supports | Reviewed controls use keyboard-operable buttons, inputs and radios. Local tests completed an Algo Sorter round with Space, selected quiz answers with arrow keys, answered Hex Guesser and ran Python code. Code/reference regions can receive focus for keyboard scrolling. Complete authentication and embedded-tool testing remains outstanding. [E4, E5, E6, E10] |
| 2.1.2 No Keyboard Trap (Level A) | Supports | The code editor documents and implements Escape followed by Tab or Shift+Tab to leave while retaining indentation shortcuts. Both exits passed local keyboard tests. Menu and shared dialog focus loops permit Escape dismissal and restore focus. Registration can close while a save continues; that authenticated scenario remains source-reviewed only. [E1, E2, E5, E10] |
| 2.1.4 Character Key Shortcuts (Level A 2.1) | Not Applicable | No application-wide single-letter, number or punctuation shortcuts were found in the reviewed first-party source. Enter submits answers; Tab indents within the code editor. These are not character-only shortcuts. [E5, E6] |
| 2.2.1 Timing Adjustable (Level A) | Supports | Hex Guesser, Binary Decoder and Mindstorm no longer automatically replace feedback after short delays. Next controls let the user choose when to continue. The write-code completion update also retains results until the user advances; a successful local run remained visible. Program execution timeouts do not limit answer-entry time. [E4, E5, E6, E10] |
| 2.2.2 Pause, Stop, Hide (Level A) | Pending verification | Static hero text, user-controlled game progression and four-second confetti are implemented. Live Help status no longer pulses. Some loading indicators and a reusable countdown remain in the source; verify long loading states, all live updates and published media before a full rating. [E1, E4, E11] |
| 2.3.1 Three Flashes or Below Threshold (Level A) | Pending verification | No rapid flashing was observed during the sampled interactions. Video content and all animation states have not been checked against flash thresholds; a full-product rating cannot yet be assigned. [E3, E9] |
| 2.4.1 Bypass Blocks (Level A) | Supports | The shared skip link now appears above navigation and targets the focusable main landmark. In the local homepage test, it was visibly focused; activation followed by Tab reached View All Winners, bypassing navigation. [E1, E10] |
| 2.4.2 Page Titled (Level A) | Supports | Route metadata supplies descriptive titles. Loaded article titles now update the browser title. All 22 scanned signed-out routes had titles. Verify live database article variants when completing the content audit. [E1, E3, E11] |
| 2.4.3 Focus Order (Level A) | Pending verification | Keyboard tests verified skip navigation, retained classification-button focus and focus on the classifier heading after a phase change. The quiz fixture verified completion focus. Teacher details move focus to their heading. Actual account, teacher and authoring workflows still require complete-process testing. [E2, E4, E6, E11] |
| 2.4.4 Link Purpose (In Context) (Level A) | Supports | Reviewed navigation and footer links have descriptive text; icon-only social links have accessible names. Back to Games and article/game links provide their purpose in context. Database-authored links remain subject to content review. [E1, E3, E9] |
| 2.5.1 Pointer Gestures (Level A 2.1) | Supports | Reviewed games use buttons, text entry and file inputs. Algo Sorter swaps values through two discrete selections; no multipoint or path-dependent gesture is required by that interaction. [E4, E9] |
| 2.5.2 Pointer Cancellation (Level A 2.1) | Supports | Reviewed first-party controls activate through native click handling. No pointer-down or touch-start handler completing an action was found. Native controls allow a pointer press to be abandoned before release. [E4, E5, E6] |
| 2.5.3 Label in Name (Level A 2.1) | Supports | Visible labels are associated with the reviewed registration, profile, answer, category and file inputs. Button names retain visible wording; Hex Guesser swatch names include the displayed RGB values. Browser inspection confirmed quiz and classifier input names. [E2, E4, E5, E6, E10] |
| 2.5.4 Motion Actuation (Level A 2.1) | Not Applicable | The reviewed application does not use device movement or user gestures detected by motion sensors to operate controls. Games use conventional buttons and text or file inputs. [E4, E6] |
| 3.1.1 Language of Page (Level A) | Supports | The root HTML element declares lang="en", identifying English for the first-party pages. [E1] |
| 3.2.1 On Focus (Level A) | Supports | Reviewed controls do not navigate, submit or open windows merely on focus. Navigation and submission require activation. The editor now provides a documented keyboard exit; moving focus does not run code. [E1, E2, E5, E6, E10] |
| 3.2.2 On Input (Level A) | Supports | Reviewed selection changes update the chosen option or local content. Profile creation, profile updates and quiz submissions use explicit buttons; merely changing a field does not submit the form. [E2, E6] |
| 3.3.1 Error Identification (Level A) | Pending verification | Quiz validation names unanswered questions; quiz transport errors release the submitting state and explain recovery. Classifier training/upload failures display status messages. Source and sample fixtures were checked; complete authenticated server failures and teacher/admin forms remain untested. [E2, E4, E6, E11] |
| 3.3.2 Labels or Instructions (Level A) | Supports | Visible labels identify first-party answer, upload, registration, profile, teacher page-size and authoring controls reviewed. Code-editor keyboard instructions are provided. Author guidance explains headings, image alternatives and video accessibility fields. Component fixtures verified the changed question and option labels. [E2, E5, E6, E11] |
| 4.1.1 Parsing (Level A) | Supports | For WCAG 2.0 and 2.1, the current ITI template instructs Supports following the September 2023 parsing errata. This is not an assertion that every runtime DOM state was checked. |
| 4.1.2 Name, Role, Value (Level A) | Pending verification | Standard controls expose names and selected states. Quiz and authoring fixtures passed automatic checks; author correct-answer buttons expose pressed state. Screen-reader behavior and third-party sign-in/embeds, plus authenticated authoring and teacher views, still need evaluation. [E1, E2, E6, E11] |

## Table 2 Success Criteria Level AA

Notes: The same scope and evidence limitations apply. No claim of full Level AA conformance is made.

| Criteria | Conformance Level | Remarks and Explanations |
| --- | --- | --- |
| 1.2.4 Captions (Live) (Level AA) | Not Applicable | No live synchronized audio/video feature was found in the reviewed application. Article players are configured for prerecorded content. Reassess if live media is introduced. [E3] |
| 1.2.5 Audio Description (Prerecorded) (Level AA) | Pending verification | The article editor/player can link to a version with audio description. No described versions were created in this change. Review each synchronized lesson for meaningful visual information missing from its audio, then provide description where required. A transcript alone does not establish this criterion. [E3] |
| 1.3.4 Orientation (Level AA 2.1) | Supports | The reviewed source does not lock display orientation. Layout changes use responsive CSS rather than requiring a particular device orientation. Narrow-screen layout defects are reported under Reflow. [E1, E4] |
| 1.3.5 Identify Input Purpose (Level AA 2.1) | Pending verification | First-party registration obtains name/email from Google and requests school and programming language. No autocomplete attributes were found, but applicability depends on each field purpose. Review Google sign-in and embedded feedback fields before assigning a complete-process rating. [E2, E8] |
| 1.4.3 Contrast (Minimum) (Level AA) | Pending verification | Fixed Help badge contrast (previously measured 3.91:1) and Help status text (4.03:1), plus the game tag background. The final 22 signed-out scans reported no automatic violations, but gradient/image contrast checks remain incomplete. Manually check all active, hover, error and authenticated states and lesson media. [E11] |
| 1.4.4 Resize text (Level AA) | Pending verification | Seven sampled routes had no document overflow at a 1280-pixel viewport with 200% root text size and spacing overrides. This is a text-size approximation, not an exhaustive browser zoom test. Account dialogs, teacher/admin views and lesson content remain untested. [E11] |
| 1.4.5 Images of Text (Level AA) | Pending verification | Most interface text is real text, but the article asset library contains instructional screenshots and diagrams. Review actual usage and whether any images of text are essential or have suitable text presentation. [E3] |
| 1.4.10 Reflow (Level AA 2.1) | Pending verification | Fixed 320-pixel game hub overflow. All 22 signed-out routes fit the 320 CSS-pixel document width; seven sampled routes also fit with text-spacing overrides. Teacher tables have focusable scroll regions. Full authenticated, article and embedded-content coverage remains outstanding. [E11] |
| 1.4.11 Non-text Contrast (Level AA 2.1) | Pending verification | Shared text-field borders were increased to slate-500; quiz radio controls retain strong contrast and selected-state cues. Native and embedded media controls, images and all teacher/admin states still need manual contrast checks. [E1, E6, E11] |
| 1.4.12 Text Spacing (Level AA 2.1) | Pending verification | Test overrides used 1.5 line height, 2em paragraph spacing, .12em letter spacing and .16em word spacing. Seven sampled routes retained document width at 320 pixels; game hub and accessibility-page screenshots were inspected. Complete article, account, teacher and authoring content still requires checks. [E11] |
| 1.4.13 Content on Hover or Focus (Level AA 2.1) | Supports | Reviewed first-party navigation, buttons and FAQs do not reveal additional content solely on hover or focus. FAQ answers are opened by activating buttons. This finding does not cover third-party embeds. [E1] |
| 2.4.5 Multiple Ways (Level AA) | Supports | Reviewed article and game destinations can be reached through shared navigation, homepage links, indexes and the footer. More than one route is available for these page sets. [E1, E9] |
| 2.4.6 Headings and Labels (Level AA) | Supports | Reviewed headings identify the activity and controls use descriptive text such as Write Code, Next Challenge and Back to Games. Form labels are now associated with the controls they describe. [E1, E2, E4, E5, E6] |
| 2.4.7 Focus Visible (Level AA) | Supports | Shared focus-visible outlines cover native controls, summaries and focusable regions. Quiz radios are visible and their labels also display a focus ring. Local keyboard/screenshot checks verified the skip link, quiz radios, editor exits and game-button focus. [E1, E5, E6, E10] |
| 3.1.2 Language of Parts (Level AA) | Pending verification | Reviewed interface copy is English, but database-authored articles and third-party embeds have not been checked for passages in other languages. The Markdown renderer does not itself identify language changes. [E3, E8] |
| 3.2.3 Consistent Navigation (Level AA) | Supports | The root layout reuses one navigation component, with links in a stable order. Responsive layouts show a subset plus the sidebar; the shared navigation was consistent across the live pages checked. [E1, E9] |
| 3.2.4 Consistent Identification (Level AA) | Supports | Reviewed recurring article, game, login and feedback links are identified consistently. Context-specific variations such as Next Round and New Shuffle describe their current functions. [E1, E4, E9] |
| 3.3.3 Error Suggestion (Level AA) | Pending verification | Quiz validation identifies missing answers and source-reviewed submission errors provide next steps. Classifier errors suggest connection checks or a different image; training data remains available. All authenticated and authoring error cases still require tests. [E2, E4, E6, E11] |
| 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA) | Pending verification | Quiz submission now has Review answers followed by Confirm and submit; changing an answer restarts review. Registration likewise reviews school and language before creation. The local quiz fixture passed; actual profile creation, saved assessments, data changes and admin deletions need end-to-end verification. [E2, E6, E11] |
| 4.1.3 Status Messages (Level AA 2.1) | Pending verification | Quiz validation/results and classifier training/upload messages use status or alert semantics. Source and local fixtures verify those regions exist. Speech announcements, badges, all live updates and authenticated error paths have not been tested with a screen reader. [E4, E6, E11] |

## Evidence and Remaining Verification

Source references identify the local snapshot on page 1. Paths are relative to src/app/ unless prefixed public/. E9 and E10 are historical observations from September 11; E11 records the new checks on September 16. Temporary fixtures use sample data and are removed before the final production build.

E1 Shared layout and navigation: layout.tsx; globals.css; seo.ts; components/navbar/navbar.tsx; components/footer/footer.tsx; components/hero/hero.tsx; components/about/about.tsx; components/faq/FaqQuestion/faqQuestion.tsx.

E2 Account and profile flows: components/auth-provider/authProvider.tsx; components/profile-editor/profileEditor.tsx; components/modal/modalContainer.tsx; me/settings/page.tsx; services/userService.ts.

E3 Articles and media: articles/read/page.tsx; components/article-renderer/articleRenderer.tsx; components/admin/articleEditor.tsx (media configuration only); components/article-renderer/articleVideo.tsx; services/articleService.ts; data/localVideos.ts; public/videos/scratch/1.mp4 through 6.mp4; public/articleimgs/.

E4 Games: game/HexGuesser/page.tsx; game/AlgoSorter/page.tsx; game/Flexibot/page.tsx; game/Purrceptron/page.tsx; components/games/CatTrainerGame.tsx; components/games/CustomTrainer.tsx.

E5 Code editor: sandbox/page.tsx, especially handleCodeKeyDown and the Write Code textarea. The editor preserves indentation shortcuts and documents Escape followed by Tab or Shift+Tab to move focus out.

E6 Quizzes and answers: components/quiz/QuizQuestion.tsx; components/quiz/Quiz.tsx; game/BinaryDecoder/page.tsx; game/Mindstorm/page.tsx; daily-challenge/page.tsx.

E8 Third-party content: feedback/page.tsx and article iframe integration. Google Forms, YouTube and Google authentication require separate end-to-end checks; their accessibility is not assumed.

E9 Earlier public-site baseline: https://hocohoc.org/; https://hocohoc.org/game/AlgoSorter/; https://hocohoc.org/sandbox/. Confirmed homepage skip navigation, sidebar opening and Escape dismissal, keyboard number swaps, code-editor focus trapping, and horizontal overflow at a 320 CSS-pixel viewport. The deployed version identifier was not verified; source-only findings must be checked against the intended release.

E10 Local verification September 11 2026: Local Next.js preview at http://127.0.0.1:3000. Keyboard checks: visible skip link and bypass; sidebar focus loop and Escape restoration; editor forward/reverse escape and successful Python execution with retained results; keyboard sorting and Hex Guesser answers. Real-component fixtures verified quiz arrow-key selection, visible focus and error text, stable dialog focus on rerender, and caption/transcript controls. axe-core 4.7.0 scans covered nine page/component surfaces, with both sandbox modes and classifier name/upload states. No automatic violations remained in sampled settled states; incomplete contrast and fixture link checks require review. TypeScript, lint and the production build passed. Existing image-optimization and React hook-dependency lint warnings remain. No account was created and no score was submitted as an authenticated user.

E11 Local verification September 16 2026: Chrome 151.0.7922.170 on macOS, signed out; axe-core 4.7.0. Twenty-two route scans reported zero automatic violations after fixes, including WCAG 2.0 A/AA, available WCAG 2.1 AA tags and best practices. Incomplete contrast/frame checks remain. Keyboard checks verified skip target, classifier labeling and phase focus. Upload description editing was tested with a repository sample image. The local quiz/authoring/video fixture checked validation, review, completion focus, labels, pressed state, deletion, media failure and transcript disclosure. No fixture wrote to a user account. Seven routes were checked at 320 pixels with text-spacing overrides and at 200% root text size. Detailed evidence is in output/accessibility-verification-2026-09-17.md and output/accessibility-results-2026-09-17.json.

## Actions Before Issuing the Completed Report

Before issuing a final ACR, complete keyboard and screen-reader tests with approved student, teacher and administrator accounts, including sign-in/recovery, registration, profile updates, article completion and quiz submissions. Check the full process and verify correction or review of stored data and assessment submissions.

Review every published article and video. Two local Scratch files (2.mp4 and 3.mp4) contain zero bytes; they were removed from the editor selection list, but existing database references still require correction. The owner confirms that the videos have subtitles. Verify the existing subtitles for accuracy and meaningful sounds, confirm equivalent transcripts and audio description where required, and verify instructional image alternatives. Separate caption files are not required when suitable captions are embedded or burned in.

Deploy through the normal release process, repeat the checks on that release, and match the report to its version. Replace every Pending verification marker with an evidence-backed ITI rating. No remediation deadline or independent certification is promised in this report.

## Standards References

W3C WCAG 2.1: https://www.w3.org/TR/WCAG21/. ITI VPAT 2.5Rev: https://www.itic.org/policy/accessibility/vpat. Revised Section 508: https://www.access-board.gov/ict/. Maryland Education §7-910: https://mgaleg.maryland.gov/mgawebsite/laws/StatuteText?article=ged&section=7-910. COMAR 13A.06.05.06: https://regs.maryland.gov/us/md/exec/comar/13A.06.05.06. These sources define the requested assessment scope; this report does not determine HCPSS approval.

## Revised Section 508 Report

This section follows the criteria structure of ITI VPAT 2.5Rev. Web-only application criteria 502 and 503 are not applicable, as noted by the ITI template. Chapter 4 hardware is not applicable because HoCoHOC supplies no hardware. Authoring tools and support are addressed below; pending entries still prevent issue as a completed ACR.

## Chapter 3 Functional Performance Criteria

| Criteria | Conformance Level | Remarks and Explanations |
| --- | --- | --- |
| 302.1 Without Vision | Pending verification | Keyboard access and text descriptions are implemented. Published images/media, uploaded test-image alternatives and screen-reader operation remain unverified. |
| 302.2 With Limited Vision | Pending verification | Sampled narrow layouts and text enlargement passed; full contrast, zoom and lesson content require review. |
| 302.3 Without Perception of Color | Supports | Reviewed answer feedback includes text; Hex Guesser supplies RGB values; selected controls expose state and border cues. Lesson graphics still require content review. |
| 302.4 Without Hearing | Pending verification | Text learning activities are available. The owner confirms video subtitles; their accuracy and complete alternatives for published audiovisual lessons have not been independently verified. |
| 302.5 With Limited Hearing | Pending verification | Native media controls allow volume adjustment. The owner confirms video subtitles. Their completeness and synchronized media alternatives remain independently unverified. |
| 302.6 Without Speech | Supports | Reviewed first-party functionality requires no speech input. Controls use keyboard, pointer or file selection. |
| 302.7 With Limited Manipulation | Pending verification | Keyboard-operated games, native controls and editor exits are implemented. Full authenticated processes and assistive-technology operation remain untested. |
| 302.8 With Limited Reach and Strength | Supports | Reviewed first-party functionality uses standard software controls and imposes no physical reach or strength requirement. No hardware is supplied. |
| 302.9 With Limited Language Cognitive and Learning Abilities | Pending verification | Plain instructions and persistent feedback support learning. All instructional content, error recovery and account flows still require assessment. |

## Chapter 5 Software

| Criteria | Conformance Level | Remarks and Explanations |
| --- | --- | --- |
| 501.1 Scope | See WCAG tables | WCAG 2.0 Level A and AA rows above address web software. Additional WCAG 2.1 criteria support the Maryland assessment. Pending ratings remain unresolved. |
| 502 Interoperability with Assistive Technology | Not Applicable | Web-only application; these non-web software requirements do not apply. Web assistive-technology compatibility is assessed through the WCAG criteria. |
| 503 Applications | Not Applicable | Web-only application; the ITI template permits summarizing 502 and 503 as not applicable. This does not waive web keyboard, media or other WCAG requirements. |
| 504.2 Content Creation or Editing | Partially Supports | Article authoring supports Markdown image alternatives, semantic headings and caption/transcript/description fields. Language-of-parts markup is not supported by the current Markdown renderer, and published output is not validated for accessibility. |
| 504.2.1 Preservation in Format Conversion | Pending verification | Article Markdown is rendered to HTML. Verify preservation of all required accessibility information through save, load and rendering with an approved author account. |
| 504.2.2 PDF Export | Not Applicable | The website authoring interface does not export PDF documents. |
| 504.3 Prompts | Partially Supports | The article editor now provides accessibility guidance and media fields. It does not detect and prompt for every missing image alternative, language change or inaccessible authored structure. |
| 504.4 Templates | Not Applicable | No selectable content templates are offered in the reviewed article authoring interface. |

## Chapter 6 Support Documentation and Services

| Criteria | Conformance Level | Remarks and Explanations |
| --- | --- | --- |
| 602.2 Accessibility and Compatibility Features | Supports | The new public Accessibility page describes keyboard navigation, editor exits, quiz controls, game alternatives, zoom, reduced motion, media features and known limitations. |
| 602.3 Electronic Support Documentation | Pending verification | The Accessibility page passed the automatic scan and sampled narrow/spacing checks. Help contrast was corrected. Complete manual and screen-reader evaluation of support pages and final distributable reports is still required. |
| 602.4 Alternate Formats for Non Electronic Support Documentation | Not Applicable | No non-electronic support documentation is supplied with this web-only product. |
| 603.2 Information on Accessibility and Compatibility Features | Pending verification | The footer, Feedback and Accessibility page provide the existing team email. Support staff knowledge, response procedures and provision of current accessibility information were not evaluated. |
| 603.3 Accommodation of Communication Needs | Pending verification | Email offers a text contact option independent of the embedded form. The support process for alternate formats and communication accommodations requires confirmation and evaluation. |
