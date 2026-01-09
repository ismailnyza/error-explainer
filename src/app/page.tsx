"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorLog: userMessage }),
      });

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || data.error || data || "Something went wrong." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 md:px-0">
      {/* Header */}
      <header className="flex items-center justify-between py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-100">ErrorExplainer</span>
        </div>
        <div className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-zinc-400 border border-white/5">
          Beta
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto py-8 space-y-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-indigo-500/20 blur-xl rounded-full" />
                <Sparkles className="relative w-16 h-16 text-indigo-400" />
              </div>
              <div className="space-y-2 max-w-md">
                <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                  Stop pasting. Start learning.
                </h1>
                <p className="text-zinc-400 text-lg">
                  Paste your error log below. I won't just fix it—I'll help you understand <em>why</em> it broke.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={clsx(
                    "flex gap-4",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === "user" ? "bg-zinc-800" : "bg-indigo-500/20"
                  )}>
                    {msg.role === "user" ? (
                      <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                    ) : (
                      <Terminal className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  
                  <div className={clsx(
                    "rounded-2xl px-6 py-4 max-w-[80%] text-sm leading-relaxed shadow-sm border",
                    msg.role === "user" 
                      ? "bg-zinc-800 border-zinc-700/50 text-zinc-100" 
                      : "bg-zinc-900/50 border-white/5 text-zinc-300"
                  )}>
                    {msg.role === "user" ? (
                      <pre className="whitespace-pre-wrap font-mono text-xs opacity-90">{msg.content}</pre>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-7 prose-pre:bg-zinc-950/50 prose-pre:border prose-pre:border-white/10">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                   <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                   </div>
                   <div className="flex items-center gap-1 h-8">
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                   </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <div className="pb-6 pt-2 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent sticky bottom-0 z-10">
        <form 
          onSubmit={handleSubmit}
          className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/5 overflow-hidden ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all duration-300"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Paste your error stack trace here..."
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 px-4 py-4 min-h-[60px] max-h-[200px] resize-none focus:outline-none font-mono scrollbar-hide"
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3">
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-3">
          AI can make mistakes. Always verify critical information.
        </p>
      </div>
    </div>
  );
}