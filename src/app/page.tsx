"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    setMessages(m => [...m, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errorLog: input })
    });

    const data = await res.json();

    setMessages(m => [...m, { role: "ai", content: data.content }]);
    setLoading(false);
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      <div className="flex-1 overflow-y-auto max-w-3xl mx-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-zinc-800 ml-auto"
                : "bg-emerald-900/20"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-zinc-500">Thinking…</div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <textarea
          className="flex-1 bg-zinc-900 p-3 rounded-lg"
          rows={2}
          placeholder="Paste your Java error here…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={send}
          className="bg-emerald-600 px-4 rounded-lg"
        >
          →
        </button>
      </div>
    </main>
  );
}
