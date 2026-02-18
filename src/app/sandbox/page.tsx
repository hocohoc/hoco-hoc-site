"use client";

import { useState } from "react";

type Language =
  | "html-css-js"
  | "python"
  | "java"
  | "cpp"
  | "sql"
  | "scratch-blockly";

export default function SandboxPage() {
  const [activeLanguage, setActiveLanguage] = useState<Language>("html-css-js");

  const [htmlCode, setHtmlCode] = useState(`<div class="container">
  <h1>Welcome to the Sandbox!</h1>
  <p>Edit the code to see live previews.</p>
</div>`);

  const [cssCode, setCssCode] = useState(`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
  color: #e0f2fe;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid #0c4a6e;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}

h1 {
  color: #7dd3fc;
  margin-bottom: 15px;
  font-size: 2em;
}

p {
  color: #cbd5e1;
  font-size: 1.1em;
}`);

  const [jsCode, setJsCode] = useState(`console.log("JavaScript is ready!");
// Try adding interactive code here
// Example: document.querySelector('h1').addEventListener('click', () => {
//   alert('You clicked the heading!');
// });`);

  const [previewKey, setPreviewKey] = useState(0);

  const languages = [
    { id: "html-css-js", label: "HTML/CSS/JS", icon: "🌐" },
    { id: "python", label: "Python", icon: "🐍" },
    { id: "java", label: "Java", icon: "☕" },
    { id: "cpp", label: "C++", icon: "⚙️" },
    { id: "sql", label: "SQL", icon: "🗄️" },
    { id: "scratch-blockly", label: "Scratch/Blockly", icon: "🧩" },
  ];

  const generatePreview = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
    return html;
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">
            Learn & Practice
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-mono font-bold text-sky-200">
            Integrated Code Sandbox
          </h1>
          <p className="mt-6 text-lg text-slate-200 leading-relaxed">
            Code in multiple programming languages without leaving the site.
            Test your HTML, CSS, JavaScript, Python, Java, C++, and SQL code
            with integrated editors and live execution. Practice the concepts
            you learn from our articles and games.
          </p>
        </header>

        {/* Language Tabs */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setActiveLanguage(lang.id as Language);
                  setPreviewKey((k) => k + 1);
                }}
                className={`py-3 px-4 rounded-lg font-mono font-bold text-sm transition-all duration-200 ${
                  activeLanguage === lang.id
                    ? "bg-sky-600 text-white border-2 border-sky-400"
                    : "bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-sky-500 hover:bg-slate-700"
                }`}
              >
                <div className="text-lg mb-1">{lang.icon}</div>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* HTML/CSS/JS Section */}
        {activeLanguage === "html-css-js" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editors */}
            <div className="space-y-4">
              {/* HTML Editor */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
                <label className="block text-sky-300 font-mono text-sm font-bold mb-2">
                  HTML
                </label>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-40 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="Enter HTML code..."
                  spellCheck="false"
                />
              </div>

              {/* CSS Editor */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
                <label className="block text-sky-300 font-mono text-sm font-bold mb-2">
                  CSS
                </label>
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="w-full h-40 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="Enter CSS code..."
                  spellCheck="false"
                />
              </div>

              {/* JavaScript Editor */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
                <label className="block text-sky-300 font-mono text-sm font-bold mb-2">
                  JavaScript
                </label>
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="w-full h-40 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="Enter JavaScript code..."
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
              <label className="block text-sky-300 font-mono text-sm font-bold mb-2">
                Preview
              </label>
              <div className="relative bg-slate-950 border border-slate-700 rounded-lg overflow-hidden h-[480px]">
                <iframe
                  key={previewKey}
                  srcDoc={generatePreview()}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                  title="Code Preview"
                />
              </div>
            </div>
          </div>
        )}

        {/* Python Section */}
        {activeLanguage === "python" && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <h2 className="text-xl font-mono font-bold text-sky-200 mb-4">
                🐍 Python Sandbox - Google Colab
              </h2>
              <p className="text-slate-200 leading-relaxed mb-4">
                Welcome to the Python sandbox powered by{" "}
                <strong>Google Colab</strong>! This is a free, cloud-based
                environment where you can:
              </p>
              <ul className="space-y-2 text-slate-200 mb-4">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Write and execute Python code instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>
                    Use popular libraries like NumPy, Pandas, and Matplotlib
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Practice algorithms and data structures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Save your notebooks for future practice</span>
                </li>
              </ul>
              <p className="text-slate-300 text-sm italic">
                💡 <strong>Tip:</strong> Click "New cell" to add code cells and
                run your Python scripts. You can write multiple cells and run
                them independently.
              </p>
            </div>

            {/* Colab Iframe */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
              <label className="block text-sky-300 font-mono text-sm font-bold mb-4">
                Interactive Python Environment
              </label>
              <iframe
                src="https://colab.research.google.com/"
                className="w-full h-[700px] border border-slate-700 rounded-lg"
                title="Google Colab Python Editor"
                loading="lazy"
              />
              <p className="text-xs text-slate-400 mt-4">
                Click inside the Colab environment to start coding. This is the
                same environment used by data scientists and programmers
                worldwide!
              </p>
            </div>
          </div>
        )}

        {/* Java Section */}
        {activeLanguage === "java" && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <h2 className="text-xl font-mono font-bold text-sky-200 mb-4">
                ☕ Java Sandbox - OnlineGDB
              </h2>
              <p className="text-slate-200 leading-relaxed mb-4">
                Practice Java programming in <strong>OnlineGDB</strong>, a
                powerful online compiler used by programmers worldwide. Write,
                test, and debug Java code instantly without any setup!
              </p>
              <ul className="space-y-2 text-slate-200 mb-4">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Instant feedback and error messages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Test object-oriented programming concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Work with libraries and packages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Save your projects for future reference</span>
                </li>
              </ul>
              <p className="text-slate-300 text-sm italic">
                💡 <strong>Tip:</strong> Click "Run" to compile and execute your
                Java code. You can create multiple files and use imports like
                you would in a full IDE.
              </p>
            </div>

            {/* Replit Iframe */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
              <label className="block text-sky-300 font-mono text-sm font-bold mb-4">
                Interactive Java Environment
              </label>
              <iframe
                src="https://www.onlinegdb.com/?language=java"
                className="w-full h-[700px] border border-slate-700 rounded-lg"
                title="OnlineGDB Java Editor"
                loading="lazy"
              />
              <p className="text-xs text-slate-400 mt-4">
                Start coding immediately. Click "Run" to compile and execute
                your Java code.
              </p>
            </div>
          </div>
        )}

        {/* C++ Section */}
        {activeLanguage === "cpp" && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <h2 className="text-xl font-mono font-bold text-sky-200 mb-4">
                ⚙️ C++ Sandbox - OnlineGDB
              </h2>
              <p className="text-slate-200 leading-relaxed mb-4">
                Master systems programming with <strong>OnlineGDB</strong>.
                Write efficient C++ code and see instant results with powerful
                debugging tools and real-time compilation.
              </p>
              <ul className="space-y-2 text-slate-200 mb-4">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Learn low-level system concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Practice memory management and pointers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Experiment with standard library (STL)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Compile with optimization flags</span>
                </li>
              </ul>
              <p className="text-slate-300 text-sm italic">
                💡 <strong>Tip:</strong> C++ requires compilation before
                running. Click "Run" to compile your code and see any
                compilation errors instantly.
              </p>
            </div>

            {/* Replit Iframe */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
              <label className="block text-sky-300 font-mono text-sm font-bold mb-4">
                Interactive C++ Environment
              </label>
              <iframe
                src="https://www.onlinegdb.com/?language=cpp"
                className="w-full h-[700px] border border-slate-700 rounded-lg"
                title="OnlineGDB C++ Editor"
                loading="lazy"
              />
              <p className="text-xs text-slate-400 mt-4">
                Start writing efficient code immediately. Click "Run" to compile
                and execute your C++ programs.
              </p>
            </div>
          </div>
        )}

        {/* SQL Section */}
        {activeLanguage === "sql" && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <h2 className="text-xl font-mono font-bold text-sky-200 mb-4">
                🗄️ SQL Sandbox - SQLFiddle
              </h2>
              <p className="text-slate-200 leading-relaxed mb-4">
                Learn database design and SQL queries with{" "}
                <strong>SQLFiddle</strong>, the industry-standard tool for
                testing SQL without requiring local database setup.
              </p>
              <ul className="space-y-2 text-slate-200 mb-4">
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>Create and manage database schemas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>
                    Write and test SELECT, INSERT, UPDATE, DELETE queries
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>
                    Support for multiple database systems (MySQL, PostgreSQL,
                    Oracle, etc.)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-400 mr-3 mt-0.5">✓</span>
                  <span>See query execution results instantly</span>
                </li>
              </ul>
              <p className="text-slate-300 text-sm italic">
                💡 <strong>Tip:</strong> On the left side, set up your database
                schema. On the right, write and execute your SQL queries. Great
                for practicing complex JOINs and aggregations!
              </p>
            </div>

            {/* SQLFiddle Iframe */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
              <label className="block text-sky-300 font-mono text-sm font-bold mb-4">
                Interactive SQL Environment
              </label>
              <iframe
                src="http://sqlfiddle.com/"
                className="w-full h-[700px] border border-slate-700 rounded-lg"
                title="SQLFiddle Editor"
                loading="lazy"
              />
              <p className="text-xs text-slate-400 mt-4">
                Create your database schema on the left panel and test SQL
                queries on the right. Click "Build" to create your tables and
                "Run SQL" to execute queries.
              </p>
            </div>
          </div>
        )}

        {/* Scratch/Blockly Section */}
        {activeLanguage === "scratch-blockly" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <label className="block text-sky-300 font-mono text-sm font-bold mb-4">
              Visual Programming Languages 🧩
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scratch */}
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-mono font-bold text-sky-300 mb-3">
                  Scratch
                </h3>
                <p className="text-slate-300 mb-4">
                  A visual programming language designed for beginners. Create
                  interactive stories, games, and animations!
                </p>
                <div className="space-y-2 mb-4 text-sm text-slate-400">
                  <p>• Create projects with visual blocks</p>
                  <p>• Add sprites and backgrounds</p>
                  <p>• Share projects with the community</p>
                </div>
                <a
                  href="https://scratch.mit.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold rounded transition-colors"
                >
                  Open Scratch →
                </a>
              </div>

              {/* Blockly */}
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-mono font-bold text-sky-300 mb-3">
                  Blockly
                </h3>
                <p className="text-slate-300 mb-4">
                  A visual coding library that makes programming accessible for
                  all ages. Drag blocks to code!
                </p>
                <div className="space-y-2 mb-4 text-sm text-slate-400">
                  <p>• Learn programming fundamentals</p>
                  <p>• Complete interactive games</p>
                  <p>• Convert to real code (Python, Java, C++)</p>
                </div>
                <a
                  href="https://blockly.games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold rounded transition-colors"
                >
                  Open Blockly →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-sky-200 mb-4">
            💡 Tips
          </h2>
          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                <strong>HTML/CSS/JS:</strong> Changes update automatically in
                the preview panel as you type.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                <strong>Python:</strong> Use Google Colab to write and execute
                Python scripts with access to powerful libraries like NumPy and
                Pandas.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                <strong>Java & C++:</strong> OnlineGDB is a powerful online
                compiler for testing and debugging Java and C++ code instantly.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                <strong>SQL:</strong> SQLFiddle lets you design databases and
                test complex SQL queries against multiple database systems.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                <strong>Scratch/Blockly:</strong> External links open in new
                tabs for these visual programming environments.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-400 mr-3 mt-1">→</span>
              <span>
                Experiment with code concepts from our articles and games.
                Practice is the key to mastering programming!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
