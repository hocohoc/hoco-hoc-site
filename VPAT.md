# Voluntary Product Accessibility Template (VPAT®)

## WCAG 2.1 Edition

**Report Date:** February 2026
**Product Name:** Howard County Hour of Code / AI (HocoHOC)
**Product Version:** 2026
**Product Description:** A web-based educational platform for Howard County students to learn computer science and AI through interactive articles, quizzes, and games during the annual Hour of Code event.
**Contact Information:** HocoHOC Team
**Evaluation Methods Used:** Manual testing, automated scanning, keyboard navigation testing, screen reader testing

---

## Applicable Standards/Guidelines

This report covers the degree of conformance for the following accessibility standard/guidelines:

| Standard/Guideline | Included in Report |
|---|---|
| [Web Content Accessibility Guidelines 2.1](https://www.w3.org/TR/WCAG21/) | Level A – Yes |
| | Level AA – Yes |
| | Level AAA – Partial |
| [Revised Section 508 standards](https://www.access-board.gov/ict/) | Yes |

---

## Terms

The terms used in the Conformance Level information are defined as follows:

- **Supports**: The functionality of the product has at least one method that meets the criterion without known defects or meets with equivalent facilitation.
- **Partially Supports**: Some functionality of the product does not meet the criterion.
- **Does Not Support**: The majority of product functionality does not meet the criterion.
- **Not Applicable**: The criterion is not relevant to the product.
- **Not Evaluated**: The product has not been evaluated against the criterion. This can be used only in WCAG 2.1 Level AAA.

---

## WCAG 2.1 Report

### Table 1: Success Criteria, Level A

| Criteria | Conformance Level | Remarks and Explanations |
|---|---|---|
| **1.1.1 Non-text Content** | Partially Supports | Most images include alt text. Some decorative images (canvas-based hero graphics) use `aria-hidden="true"`. Game assets may need additional alt descriptions. |
| **1.2.1 Audio-only and Video-only (Prerecorded)** | Partially Supports | Video content in articles may not all have text alternatives. Effort is underway to provide transcripts. |
| **1.2.2 Captions (Prerecorded)** | Partially Supports | Some embedded videos rely on third-party captioning (e.g., YouTube auto-captions). Native video content may not have captions. |
| **1.2.3 Audio Description or Media Alternative (Prerecorded)** | Partially Supports | Articles provide text-based explanations alongside video content. Dedicated audio descriptions are not yet available. |
| **1.3.1 Info and Relationships** | Partially Supports | Semantic HTML used throughout (headings, landmarks, lists, nav). Some quiz and game components may need enhanced ARIA roles. |
| **1.3.2 Meaningful Sequence** | Supports | Content follows a logical reading order in the DOM. |
| **1.3.3 Sensory Characteristics** | Supports | Instructions do not rely solely on shape, size, visual location, or sound. |
| **1.4.1 Use of Color** | Supports | Color is not the sole means of conveying information. Status messages use text labels in addition to color. |
| **1.4.2 Audio Control** | Supports | No audio plays automatically on any page. |
| **2.1.1 Keyboard** | Partially Supports | Primary navigation, articles, and forms are keyboard-accessible. Some interactive game components (canvas-based games) may have limited keyboard support. |
| **2.1.2 No Keyboard Trap** | Supports | Modal dialogs and the mobile navigation menu support Escape key dismissal. Focus is managed correctly. |
| **2.1.4 Character Key Shortcuts** | Not Applicable | The application does not use single character key shortcuts. |
| **2.2.1 Timing Adjustable** | Supports | No time limits are imposed on content consumption. |
| **2.2.2 Pause, Stop, Hide** | Supports | No auto-updating or auto-scrolling content is present. |
| **2.3.1 Three Flashes or Below Threshold** | Supports | No content flashes more than three times per second. |
| **2.4.1 Bypass Blocks** | Partially Supports | Navigation is consistent. Skip-to-content link should be added for optimal support. |
| **2.4.2 Page Titled** | Supports | Each page has a descriptive title set via Next.js metadata. |
| **2.4.3 Focus Order** | Supports | Focus order follows the visual layout and is logical. |
| **2.4.4 Link Purpose (In Context)** | Supports | Links have descriptive text or are labeled by surrounding context. |
| **2.5.1 Pointer Gestures** | Supports | No multipoint or path-based gestures are required. |
| **2.5.2 Pointer Cancellation** | Supports | Click/tap actions use standard event handling with cancellation support. |
| **2.5.3 Label in Name** | Supports | Visible labels match accessible names for interactive controls. |
| **2.5.4 Motion Actuation** | Not Applicable | The application does not use device motion for input. |
| **3.1.1 Language of Page** | Supports | The `lang` attribute is set to "en" on the HTML element. |
| **3.2.1 On Focus** | Supports | No context changes occur on focus alone. |
| **3.2.2 On Input** | Supports | Form inputs do not cause unexpected context changes. |
| **3.3.1 Error Identification** | Supports | Form validation errors are described in text. |
| **3.3.2 Labels or Instructions** | Supports | Form fields have associated labels. |
| **4.1.1 Parsing** | Supports | Valid HTML is generated by React/Next.js. |
| **4.1.2 Name, Role, Value** | Partially Supports | Standard form elements and links have proper names/roles. Some custom game components may need additional ARIA attributes. |

### Table 2: Success Criteria, Level AA

| Criteria | Conformance Level | Remarks and Explanations |
|---|---|---|
| **1.2.4 Captions (Live)** | Not Applicable | No live audio content is present. |
| **1.2.5 Audio Description (Prerecorded)** | Partially Supports | Text alternatives accompany most video/media content. Formal audio descriptions are planned. |
| **1.3.4 Orientation** | Supports | Content is not restricted to a single display orientation. |
| **1.3.5 Identify Input Purpose** | Supports | Input fields for user profile and login use appropriate autocomplete attributes. |
| **1.4.3 Contrast (Minimum)** | Partially Supports | Primary content meets 4.5:1 contrast ratio. Some decorative/secondary text (e.g., `text-slate-400` on dark backgrounds) may fall below the threshold — under review. |
| **1.4.4 Resize Text** | Supports | Text can be resized up to 200% without loss of content or functionality. Responsive Tailwind CSS layout adapts. |
| **1.4.5 Images of Text** | Supports | Text is rendered as real text, not images. |
| **1.4.10 Reflow** | Supports | Content reflows for viewports as narrow as 320px (responsive design with Tailwind CSS). |
| **1.4.11 Non-text Contrast** | Partially Supports | Most UI components and borders meet 3:1 contrast. Some decorative borders may be below threshold. |
| **1.4.12 Text Spacing** | Supports | Content is readable and functional when text spacing is overridden by user styles. |
| **1.4.13 Content on Hover or Focus** | Supports | Hover/focus tooltips are dismissible and persistent. |
| **2.4.5 Multiple Ways** | Supports | Content is reachable via navigation, search, and direct links. |
| **2.4.6 Headings and Labels** | Supports | Pages use descriptive headings and labels. |
| **2.4.7 Focus Visible** | Partially Supports | Browser default focus indicators are present. Custom focus styles should be enhanced for better visibility. |
| **3.1.2 Language of Parts** | Not Applicable | All content is in English. |
| **3.2.3 Consistent Navigation** | Supports | Navigation is consistent across all pages via the persistent navbar. |
| **3.2.4 Consistent Identification** | Supports | Components with similar functionality are identified consistently. |
| **3.3.3 Error Suggestion** | Supports | Error messages include suggestions for correction where applicable. |
| **3.3.4 Error Prevention (Legal, Financial, Data)** | Not Applicable | The application does not involve legal, financial, or data transactions. |
| **4.1.3 Status Messages** | Partially Supports | Loading states and error messages are presented visually. ARIA live regions should be added for dynamic status updates. |

### Table 3: Success Criteria, Level AAA (Partial — Informational)

| Criteria | Conformance Level | Remarks and Explanations |
|---|---|---|
| **1.4.6 Contrast (Enhanced)** | Not Evaluated | Enhanced 7:1 contrast ratio not yet audited. |
| **2.4.8 Location** | Supports | Users can identify their location within the site via active nav links and page titles. |
| **2.4.9 Link Purpose (Link Only)** | Supports | Most links have self-descriptive text. |
| **2.4.10 Section Headings** | Supports | Content sections use heading elements to organize content. |
| **3.1.3 Unusual Words** | Partially Supports | Technical CS/AI terms are generally explained in article content but a glossary is not available. |
| **3.1.5 Reading Level** | Partially Supports | Content is targeted at middle/high school level readers. Simplified versions are not available. |

---

## Revised Section 508 Report

### Chapter 3: Functional Performance Criteria

| Criteria | Conformance Level | Remarks and Explanations |
|---|---|---|
| **302.1 Without Vision** | Partially Supports | Most content is screen-reader accessible. Canvas-based game and hero components need alternative text descriptions. |
| **302.2 With Limited Vision** | Supports | Text resizing and responsive layout support low-vision users. |
| **302.3 Without Perception of Color** | Supports | Color is not the sole indicator of meaning. |
| **302.4 Without Hearing** | Partially Supports | Text-based content is fully accessible. Some video content may lack captions. |
| **302.5 With Limited Hearing** | Partially Supports | See above regarding video captions. |
| **302.6 Without Speech** | Supports | No speech input is required. |
| **302.7 With Limited Manipulation** | Partially Supports | Standard form controls work with assistive technology. Game components may require fine motor control. |
| **302.8 With Limited Reach and Strength** | Supports | The web application can be used with any standard input device. |
| **302.9 With Limited Language, Cognitive, and Learning Abilities** | Partially Supports | Content uses clear language and consistent navigation. Some CS/AI concepts are inherently complex. |

### Chapter 5: Software (Web Application)

| Criteria | Conformance Level | Remarks and Explanations |
|---|---|---|
| **501.1 Scope — WCAG Conformance** | Partially Supports | See WCAG 2.1 Level A and AA tables above. |
| **502 Interoperability with Assistive Technology** | Partially Supports | Standard HTML and ARIA patterns used. Some custom interactive components are under review. |
| **503 Applications** | Supports | User preferences are stored and persisted. |
| **504 Authoring Tools** | Not Applicable | The product is not an authoring tool. |

---

## Known Issues and Remediation Plan

| Issue | Priority | Target Fix |
|---|---|---|
| Add skip-to-content link | High | Before 2026 event launch |
| Enhance focus indicators across all interactive elements | High | Before 2026 event launch |
| Add ARIA live regions for dynamic status messages (loading, errors) | Medium | Before 2026 event launch |
| Improve keyboard support for canvas-based games | Medium | 2026 event cycle |
| Add captions/transcripts for all video content | Medium | Ongoing |
| Audit all color contrast ratios (especially `text-slate-400` variants) | Medium | Before 2026 event launch |
| Add ARIA labels to custom game components | Medium | Before 2026 event launch |
| Consider providing a glossary for technical terms | Low | Future enhancement |

---

## Legal Disclaimer

This document is provided for informational purposes as a self-assessment of the accessibility conformance of the HocoHOC platform. Conformance levels are based on internal review and may change as the product evolves. This VPAT is not a certification of 100% accessibility compliance.

---

*This VPAT® follows the ITI VPAT® 2.4 Rev format (WCAG 2.1 Edition). Generated February 2026.*
