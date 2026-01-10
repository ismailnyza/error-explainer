import { askOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { errorLog } = await req.json();

    if (!errorLog || errorLog.length < 5) {
        return Response.json({ 
            valid_request: false, 
            roast: "Bro typed 4 characters and expected a solution. 💀",
            meme_keyword: "clown"
        });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o", // Stronger logic for JSON enforcement
        messages: [
          { role: "system", content: require("@/lib/prompt").SYSTEM_PROMPT },
          { role: "user", content: `Here is the input: ${errorLog}` }
        ],
        response_format: { type: "json_object" }, // <--- THE SECURITY SHIELD
        temperature: 0.8
      })
    });

    const data = await res.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    return Response.json(content);

  } catch (e) {
    console.error(e);
    return Response.json({ 
        valid_request: false, 
        roast: "The server is cooked. Even I can't fix this.", 
        meme_keyword: "fire" 
    }, { status: 500 });
  }
}