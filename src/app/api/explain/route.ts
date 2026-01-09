import { classifyError } from "@/lib/classifier";
import { askOpenAI } from "@/lib/openai";
import { isSafe } from "@/lib/guard";

export async function POST(req: Request) {
  const { errorLog } = await req.json();

  if (!errorLog || errorLog.length < 10) {
    return Response.json(
      { content: "Please paste a full error message." },
      { status: 400 }
    );
  }

  const ctx = classifyError(errorLog);

  let reply = await askOpenAI(errorLog, ctx);

  if (!isSafe(reply)) {
    reply = await askOpenAI(errorLog, ctx);
  }

  return Response.json({ content: reply });
}
