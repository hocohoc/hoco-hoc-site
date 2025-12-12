import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { difficulty, language } = await request.json();
        
        // Validate inputs
        if (!difficulty || !language) {
            return NextResponse.json(
                { error: 'Missing difficulty or language' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        // Create language-specific prompts
        const languageConfig = {
            python: {
                name: 'Python',
                example: 'print(5 + 3)',
                output: '8'
            },
            java: {
                name: 'Java',
                example: 'System.out.println(5 + 3);',
                output: '8'
            },
            cpp: {
                name: 'C++',
                example: 'cout << 5 + 3;',
                output: '8'
            }
        };

        const config = languageConfig[language as keyof typeof languageConfig] || languageConfig.python;

        const difficultyInstructions = {
            easy: `Basic operations: arithmetic, strings, simple variables. Example: ${config.example}`,
            medium: `Intermediate: arrays/lists, loops, conditionals, string methods`,
            hard: `Advanced: functions, recursion, data structures, algorithms`
        };

        const prompt = `Generate a single ${config.name} coding challenge for ${difficulty} level students.

REQUIREMENTS:
- ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}
- Code must be SHORT (1-3 lines maximum)
- Output must be EXACT and SIMPLE
- For ${config.name}, use standard output functions
- NO explanations, ONLY return valid JSON

Return ONLY this JSON format:
{
  "code": "the ${config.name} code snippet",
  "output": "exact output as string"
}

Example for easy:
{
  "code": "${config.example}",
  "output": "${config.output}"
}`;

        // Call Google Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 256,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response from Gemini API');
        }

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const challenge = JSON.parse(jsonText);

        // Validate the response
        if (!challenge.code || !challenge.output) {
            throw new Error('Invalid challenge format from AI');
        }

        // Generate unique ID
        const challengeId = `ai-${language}-${difficulty}-${Date.now()}`;

        return NextResponse.json({
            id: challengeId,
            code: challenge.code,
            output: challenge.output,
            points: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8,
            difficulty: difficulty
        });

    } catch (error) {
        console.error('Error generating challenge:', error);
        return NextResponse.json(
            { error: 'Failed to generate challenge', details: String(error) },
            { status: 500 }
        );
    }
}
