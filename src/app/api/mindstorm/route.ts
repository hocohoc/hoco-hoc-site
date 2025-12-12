import { NextRequest, NextResponse } from "next/server";

type Difficulty = "easy" | "medium" | "hard";
type Language = "python" | "java" | "cpp" | "blockly" | "scratch";

const languageConfig: Record<
  Language,
  { name: string; example: string; output: string }
> = {
  python: {
    name: "Python",
    example: "print(5 + 3)",
    output: "8",
  },
  java: {
    name: "Java",
    example: "System.out.println(5 + 3);",
    output: "8",
  },
  cpp: {
    name: "C++",
    example: "std::cout << 5 + 3;",
    output: "8",
  },
  blockly: {
    name: "Blockly",
    example: "print 5 + 3",
    output: "8",
  },
  scratch: {
    name: "Scratch",
    example: "when green flag clicked\nsay (5 + 3)",
    output: "8",
  },
};

const difficultyInstructions: Record<Difficulty, string> = {
  easy: "Basic operations: arithmetic, strings, simple variables/blocks.",
  medium:
    "Intermediate: lists/arrays, loops, conditionals, string methods or equivalent blocks.",
  hard: "Advanced: functions, recursion, data structures, algorithms (or block-based equivalents).",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const difficulty = body.difficulty as Difficulty;
    const language = body.language as Language;

    if (!difficulty || !language) {
      return NextResponse.json(
        { error: "Missing difficulty or language" },
        { status: 400 }
      );
    }

    const config = languageConfig[language] ?? languageConfig.python;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

const prompt = `Generate a single ${config.name} coding challenge for ${difficulty} level students.

REQUIREMENTS:
- ${difficultyInstructions[difficulty]}
- For ${config.name}, use SHORT code: 1–3 lines OR 1–3 simple blocks
- Use normal ${config.name} formatting: 
  - put separate statements on separate lines
  - use indentation for blocks (like if/else, loops, functions)
  - you may include blank lines for readability
- Output must be EXACT and SIMPLE
- The code must have a clear, deterministic output on standard output (or "say" / equivalent in blocks)
- NO explanations, ONLY return valid JSON.
- Do NOT add any text before or after the JSON.
- Do NOT wrap the JSON in backticks or a code block.

Return ONLY this JSON format:
{
  "code": "the ${config.name} code snippet or block description",
  "output": "exact output as string"
}

Example for easy:
{
  "code": "${config.example}",
  "output": "${config.output}"
}`;

    // ✅ Use the Lite model
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 256,
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    const candidates = data.candidates ?? [];
    if (candidates.length === 0) {
      throw new Error("No candidates in Gemini response");
    }

    let combinedText = "";
    for (const part of candidates[0].content?.parts ?? []) {
      if (typeof part.text === "string") {
        combinedText += part.text;
      }
    }

    if (!combinedText.trim()) {
      throw new Error("No response text from Gemini API");
    }

    let cleaned = combinedText.trim();

    // Strip code fences if model insists on them
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/i, "").replace(/```$/, "").trim();
    }

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not find JSON in model response:", cleaned);
      throw new Error("Model did not return valid JSON");
    }

    const jsonText = jsonMatch[0];

    let challenge: { code?: string; output?: string };
    try {
      challenge = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("Failed to parse JSON:", jsonText, parseErr);
      throw new Error("Failed to parse JSON from model response");
    }

    if (!challenge.code || !challenge.output) {
      console.error("Invalid challenge object:", challenge);
      throw new Error("Invalid challenge format from AI");
    }

    const challengeId = `ai-${language}-${difficulty}-${Date.now()}`;
    const points =
      difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 8;

    return NextResponse.json({
      id: challengeId,
      code: challenge.code,
      output: challenge.output,
      points,
      difficulty,
      language,
    });
  } catch (error) {
    console.error("Error generating challenge:", error);
    return NextResponse.json(
      {
        error: "Failed to generate challenge",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
