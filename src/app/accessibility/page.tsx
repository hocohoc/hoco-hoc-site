import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
    <h1 className="text-4xl font-bold">Accessibility</h1>
    <p>We want students and staff to be able to learn with HoCoHOC using the tools and input methods that work for them. We are improving access across our lessons, quizzes, coding challenges, and games.</p>
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Using the website</h2>
      <ul className="list-disc pl-6 space-y-3">
        <li>Press Tab to move between links and controls. The first link skips navigation and moves to the main content. Press Enter to follow a link or activate a button; Space also activates buttons.</li>
        <li>Press Escape to close a menu or dialog. Focus returns to the control that opened it.</li>
        <li>In the Write Code editor, Tab indents your code. Press Escape, then Tab to leave the editor, or Escape, then Shift+Tab to move to the previous control.</li>
        <li>Use arrow keys to move between quiz answers. Review your selections before submitting.</li>
        <li>Games use buttons and text fields. Algo Sorter swaps two numbers by selecting each one. Hex Guesser provides numeric RGB values alongside colors.</li>
        <li>Use your browser zoom and your device’s reduced-motion preference. Game feedback stays available until you choose to continue.</li>
        <li>Where available, lesson videos include captions, a transcript, and a link to a version with audio description.</li>
      </ul>
    </section>
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Known limitations</h2>
      <p>The HoCoHOC team confirms that lesson videos have subtitles. Subtitle accuracy, coverage of meaningful sounds, transcripts, and audio description still need a complete accessibility review. Instructional images and uploaded classifier images may need fuller descriptions. Google sign-in, embedded forms, and embedded videos also need testing with assistive technology. We are not claiming full WCAG or Section 508 conformance at this time.</p>
      <p>If a lesson or activity is inaccessible, contact us with the lesson name and the information or format you need. You can send feedback by email if the <Link className="link" href="/feedback">feedback form</Link> is difficult to use.</p>
    </section>
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Get accessibility help</h2>
      <p>Email <a className="link" href="mailto:mdhocohoc@gmail.com">mdhocohoc@gmail.com</a>. Include the page address, what you were trying to do, and the barrier you encountered. If helpful, include your browser and assistive technology. Please do not include passwords or student records.</p>
    </section>
  </div>;
}
