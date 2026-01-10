import { SYSTEM_PROMPT } from "./prompt";

export async function askOpenAI(error: string, ctx: any) {
  // Safe defaults if context is missing
  const category = ctx?.category || "Unknown Error";
  const concepts = ctx?.concepts?.join(", ") || "General debugging";
  const docs = ctx?.docs?.join(", ") || "StackOverflow";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Using mini for cost/speed
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `
Error log:
${error}

Detected category: ${category}
Related concepts: ${concepts}
Suggested docs: ${docs}
`
        }
      ]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}