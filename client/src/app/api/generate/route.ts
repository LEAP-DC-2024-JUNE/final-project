// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(
//   "AIzaSyB4d-76yNMVjqvVyY_9e9uth5knVBKUKXI" || ""
// );

// export async function POST(req: Request) {
//   try {
//     const { content } = await req.json();

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(
//       `Generate a short, engaging course description based on this course title: "${content}". The description should be suitable for marketing and be 2-3 sentences long.`
//     );
//     console.log(result);
//     const generatedResponse = result.response.text();

//     return NextResponse.json({ generatedResponse });
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return NextResponse.json(
//       { error: "Failed to generate content" },
//       { status: 500 }
//     );
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyB4d-76yNMVjqvVyY_9e9uth5knVBKUKXI");

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `You are an expert online course marketer.
      
      Generate a short, engaging, and professional course description based on this course title: "${content}". 
      
      The description should be suitable for a course website landing page and be 2-3 sentences long.`
    );

    const generatedResponse = result.response.text().trim();

    return NextResponse.json({ generatedResponse });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
