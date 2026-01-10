"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Zap, BookOpen, Search, Youtube, AlertTriangle, ShieldAlert } from "lucide-react";
import clsx from "clsx";

// Type definition matches the JSON schema
type RoastResponse = {
  valid_request: boolean;
  error_tier?: string;
  category?: string;
  roast: string;
  explanation?: string;
  concept?: string;
  meme_keyword?: string; // For rejection state
  resources?: {
    google_query: string;
    official_docs_search: string;
    youtube_query: string;
  };
};

type Message = {
  role: "user" | "assistant";
  content: string | RoastResponse; // Content can now be an object
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorLog: userMsg }),
      });
      const data: RoastResponse = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERERS ---

  const renderRejection = (data: RoastResponse) => (
    <div className="bg-red-950/30 border border-red-500/50 p-6 rounded-xl flex flex-col items-center text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold text-red-400">ACCESS DENIED</h3>
        <p className="text-zinc-300 font-mono text-sm">{data.roast}</p>
        
        {/* The "Meme" - Using a placeholder for now, replace with local GIFs */}
        <div className="w-full h-48 bg-black rounded-lg flex items-center justify-center overflow-hidden border border-red-900/50 relative">
             <img 
               src={`https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY254Ym54Ym54Ym54Ym54Ym54Ym54Ym54Ym54Ym54/JIX9t2j0ZTN9S/giphy.gif`} // Generic "Nope" gif
               alt="Rejection Meme"
               className="opacity-80 object-cover w-full h-full"
             />
             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-2xl font-black text-white uppercase tracking-widest rotate-[-10deg] border-4 border-white px-4 py-2">
                    SKILL ISSUE
                </span>
             </div>
        </div>
    </div>
  );

  const renderSuccess = (data: RoastResponse) => (
    <div className="space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {data.category}
            </span>
            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold border uppercase", 
                data.error_tier?.includes("Senior") ? "bg-red-500/20 text-red-400 border-red-500/30" :
                data.error_tier?.includes("Mid") ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                "bg-green-500/20 text-green-400 border-green-500/30"
            )}>
                {data.error_tier}
            </span>
        </div>

        {/* The Roast */}
        <div className="text-lg font-bold text-white leading-relaxed">
            "{data.roast}"
        </div>

        {/* The Explanation */}
        <div className="bg-zinc-950/50 p-4 rounded-lg border-l-2 border-indigo-500">
            <p className="text-zinc-300 leading-relaxed text-sm">
                {data.explanation}
            </p>
        </div>

        {/* The Concept */}
        <div className="flex items-center gap-3 text-orange-400 bg-orange-950/10 p-3 rounded-lg border border-orange-900/30">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <span className="font-mono text-sm font-bold">MISSING CONCEPT: {data.concept}</span>
        </div>

        {/* Actionable Resources (The "Stuff to Read") */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {data.resources?.google_query && (
                <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(data.resources.google_query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group border border-zinc-700"
                >
                    <Search className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400 font-bold uppercase">Read Article</span>
                        <span className="text-xs text-zinc-200 truncate max-w-[150px]">"{data.resources.google_query}"</span>
                    </div>
                </a>
            )}
             {data.resources?.youtube_query && (
                <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(data.resources.youtube_query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group border border-zinc-700"
                >
                    <Youtube className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400 font-bold uppercase">Watch Tutorial</span>
                        <span className="text-xs text-zinc-200 truncate max-w-[150px]">"{data.resources.youtube_query}"</span>
                    </div>
                </a>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-indigo-500" />
          <span className="font-bold text-xl tracking-tighter">Error<span className="text-indigo-500">Roast</span></span>
        </div>
        <div className="text-xs font-mono text-zinc-600 bg-white/5 px-2 py-1 rounded">v3.0 Secure</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 opacity-50">
                <h1 className="text-4xl font-black text-zinc-700">FEED THE BEAST</h1>
                <p className="text-zinc-500">Paste code. Get roasted. Get smart.</p>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-10">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[95%] md:max-w-[85%] rounded-2xl p-1 ${
                    msg.role === "user" ? "bg-zinc-900" : "bg-gradient-to-b from-indigo-500/10 to-transparent"
                  }`}>
                    <div className={`rounded-xl p-5 ${
                        msg.role === "user" ? "bg-zinc-900 text-zinc-100 font-mono text-xs border border-zinc-800" : "bg-[#0A0A0A] border border-white/5"
                    }`}>
                        {msg.role === "user" 
                            ? (msg.content as string) 
                            : (msg.content as RoastResponse).valid_request 
                                ? renderSuccess(msg.content as RoastResponse)
                                : renderRejection(msg.content as RoastResponse)
                        }
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && <div className="text-center text-indigo-500 animate-pulse font-mono text-xs">ANALYZING CRINGE LEVEL...</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <div className="p-4 bg-black/80 border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
            <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste error log..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 px-6 rounded-lg text-white font-bold transition-colors">
                <Send className="w-4 h-4" />
            </button>
        </form>
      </div>
    </div>
  );
}