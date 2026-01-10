import { classifyError, isLikelyErrorLog } from "@/lib/classifier";
import { askOpenAI } from "@/lib/openai";
import { isSafe } from "@/lib/guard";

export async function POST(req: Request) {
  try {
    const { errorLog } = await req.json();

    // 1. INPUT GUARD: Check if it's junk
    if (!errorLog || !isLikelyErrorLog(errorLog)) {
      return Response.json(
        { 
          content: "That doesn't look like an error log. Please paste a real stack trace (at least 10 chars) so I can help!" 
        }, 
        { status: 400 }
      );
    }

    // 2. CLASSIFY: Get metadata
    const ctx = classifyError(errorLog);

    // 3. AI CALL: Pass 'ctx' as an object, NOT stringified
    let reply = await askOpenAI(errorLog, ctx);

    // 4. OUTPUT GUARD
    if (!isSafe(reply)) {
      return Response.json(
        { content: "I analyzed the error, but I cannot provide a direct code fix. Please review the logic around the error line yourself!" },
        { status: 200 }
      );
    }

    return Response.json({ content: reply });

  } catch (e) {
    console.error(e);
    return Response.json({ content: "Server error processing your request." }, { status: 500 });
  }
}