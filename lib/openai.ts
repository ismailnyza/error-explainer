import { SYSTEM_PROMPT } from "./prompt";

export async function askOpenAI(error: string, ctx: any) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `
Language: Java

Error log:
${error}

Detected category: ${ctx.category}
Related concepts: ${ctx.concepts.join(", ")}
Suggested docs: ${ctx.docs.join(", ")}
`
        }
      ]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
