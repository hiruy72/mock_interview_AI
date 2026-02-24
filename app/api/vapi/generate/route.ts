import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function GET() {
  return NextResponse.json({ success: true, data: "Thank you!" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, role, level, techstack, amount, userid } = body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstack}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only a JSON array of strings, each string being a question.
                Do not include any markdown formatting, code blocks, or extra text.
                Return ONLY the JSON array.`,
            },
          ],
        },
      ],
    });

    const responseText = result.response
      .text()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions: string[] = JSON.parse(responseText);

    const interview = await db.collection("interviews").add({
      role,
      type,
      level,
      techstack: typeof techstack === "string" ? techstack.split(",").map((s: string) => s.trim()) : techstack,
      questions,
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, interviewId: interview.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
