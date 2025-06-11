import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyB4d-76yNMVjqvVyY_9e9uth5knVBKUKXI" || "");

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // Generate summary


    // Generate quiz questions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Generate description based on this title: ${content}.`
    );
    console.log(result)
    const generatedResponse = result.response.text();
    // Clean up the response text to ensure it's valid JSON
    // const cleanedgeneratedResponse = generatedResponse.replace(/```json\n?|\n?```/g, "").trim();


    return NextResponse.json({ generatedResponse });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
