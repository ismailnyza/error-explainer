import { classifyError, isLikelyErrorLog } from "@/lib/classifier";
import { askOpenAI } from "@/lib/openai";
import { isSafe } from "@/lib/guard";

export async function POST(req: Request) {
  try {
    const { errorLog } = await req.json();

    // 1. INPUT GUARD: Check if it's junk/spam/not an error
    if (!errorLog || !isLikelyErrorLog(errorLog)) {
      return Response.json(
        { 
          content: "That doesn't look like an error log. Please paste a real stack trace or error message so I can help you learn!" 
        }, 
        { status: 400 }
      );
    }

    // 2. CLASSIFY: Get metadata to help the AI (optional context)
    const ctx = classifyError(errorLog);

    // 3. AI CALL: Send to OpenAI with the strict prompt
    let reply = await askOpenAI(errorLog, JSON.stringify(ctx));

    // 4. OUTPUT GUARD: Double check the AI didn't hallucinate unsafe code
    if (!isSafe(reply)) {
      // If the AI tried to give code despite our prompt, we catch it here.
      return Response.json(
        { content: "I analyzed the error, but I cannot provide the specific code fix. Try reviewing the logic around the error line yourself!" },
        { status: 200 }
      );
    }

    return Response.json({ content: reply });

  } catch (e) {
    console.error(e);
    return Response.json({ content: "Server error processing your request." }, { status: 500 });
  }
}