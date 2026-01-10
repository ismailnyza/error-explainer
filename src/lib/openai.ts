import { SYSTEM_PROMPT } from "./prompt";

export async function askOpenAI(error: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o", // Upgraded to standard model for better reasoning
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Here is my error log:\n\n${error}`
        }
      ],
      temperature: 0.7 
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}