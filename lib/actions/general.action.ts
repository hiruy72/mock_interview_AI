'use server';

import { db } from "@/firebase/admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { feedbackSchema } from "@/constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function createInterview(params: {
  role: string;
  level: string;
  type: string;
  techstack: string[];
  questions: string[];
  userId: string;
  finalized: boolean;
}) {
  const { role, level, type, techstack, questions, userId, finalized } = params;

  try {
    const interview = await db.collection("interviews").add({
      role,
      level,
      type,
      techstack,
      questions,
      userId,
      finalized,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      interviewId: interview.id,
    };
  } catch (error: unknown) {
    console.error("Error creating interview:", error);
    return {
      success: false,
      message: "Failed to create interview",
    };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();

    if (!interview.exists) return null;

    return {
      id: interview.id,
      ...interview.data(),
    } as Interview;
  } catch (error: unknown) {
    console.error("Error getting interview:", error);
    return null;
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error: unknown) {
    console.error("Error getting interviews:", error);
    return [];
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[]> {
  const { userId, limit = 20 } = params;

  try {
    const interviewsQuery = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit + 10) // Fetch a few more to account for filtering
      .get();

    const interviews = interviewsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    // Filter out the current user's interviews manually to avoid Firestore inequality+orderBy restriction
    return interviews
      .filter((interview) => interview.userId !== userId)
      .slice(0, limit);
  } catch (error: unknown) {
    console.error("Error getting latest interviews:", error);
    return [];
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return {
      id: feedbackDoc.id,
      ...feedbackDoc.data(),
    } as Feedback;
  } catch (error: unknown) {
    console.error("Error getting feedback:", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI interviewer analyzing a mock interview. Based on the transcript below, provide a structured evaluation in JSON format.

Transcript:
${formattedTranscript}

Please score the candidate from 0-100 in the following categories:
1. Communication Skills - Clarity, articulation, structured responses
2. Technical Knowledge - Understanding of core concepts and technologies
3. Problem Solving - Analytical thinking, approach to challenges
4. Cultural Fit - Teamwork, motivation, alignment with company values
5. Confidence and Clarity - Poise, conviction, ability to handle pressure

Return ONLY valid JSON in this exact format:
{
  "totalScore": <number 0-100>,
  "categoryScores": [
    { "name": "Communication Skills", "score": <number>, "comment": "<string>" },
    { "name": "Technical Knowledge", "score": <number>, "comment": "<string>" },
    { "name": "Problem Solving", "score": <number>, "comment": "<string>" },
    { "name": "Cultural Fit", "score": <number>, "comment": "<string>" },
    { "name": "Confidence and Clarity", "score": <number>, "comment": "<string>" }
  ],
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "areasForImprovement": ["<area1>", "<area2>", "<area3>"],  
  "finalAssessment": "<2-3 sentence overall assessment>"
}`,
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

    const feedbackData = JSON.parse(responseText);

    // Validate with zod
    const parsed = feedbackSchema.parse(feedbackData);

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set({
      interviewId,
      userId,
      ...parsed,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error: unknown) {
    console.error("Error creating feedback:", error);
    return {
      success: false,
      message: "Failed to generate feedback. Please try again.",
    };
  }
}

export async function generateInterviewAction(params: {
  userId: string;
  transcript: { role: string; content: string }[];
}) {
  const { userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI assistant helping to set up a mock interview. Based on the conversation transcript below, extract the interview details.

Transcript:
${formattedTranscript}

Please identify:
1. Job Role (e.g., Frontend Developer, Project Manager)
2. Level (e.g., Junior, Middle, Senior)
3. Interview Type (e.g., Technical, Behavioral, Mixed)
4. Tech Stack (List of relevant technologies mentioned)
5. Interview Questions (A list of 5-8 relevant interview questions for this role and level)

Return ONLY valid JSON in this exact format:
{
  "role": "<string>",
  "level": "<string>",
  "type": "<string>",
  "techstack": ["<string>", ...],
  "questions": ["<string>", ...]
}

If any information is missing, use your best judgment to provide sensible defaults based on the context of the conversation.`,
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

    const interviewData = JSON.parse(responseText);

    const resultCreate = await createInterview({
      ...interviewData,
      userId,
      finalized: true,
    });

    return resultCreate;
  } catch (error: unknown) {
    console.error("Error generating interview:", error);
    return {
      success: false,
      message: "Failed to generate interview. Please try again.",
    };
  }
}

export async function deleteInterview(id: string) {
  try {
    // Delete associated feedback first
    const feedbackQuery = await db
      .collection("feedback")
      .where("interviewId", "==", id)
      .get();

    const batch = db.batch();
    feedbackQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the interview
    batch.delete(db.collection("interviews").doc(id));

    await batch.commit();

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error deleting interview:", error);
    return {
      success: false,
      message: "Failed to delete interview",
    };
  }
}


