export function isLikelyErrorLog(text: string): boolean {
  // 1. Allow short errors like "Killed" or "Segfault"
  if (text.length < 5) return false;

  // 2. Expanded error signatures
  const errorPatterns = [
    /error/i,                    // Generic
    /exception/i,                // Java/JS/Python
    /panic:/i,                   // Go/Rust
    /at\s+.*\s+\(.*\:\d+\:\d+\)/,// JS/Java Stack trace
    /\w+\.\w+\(.*\:\d+\)/,       // Python/Ruby trace
    /\[.*\]\s+.*failed/,         // System logs
    /Caused by:/i,               // Java
    /line\s+\d+/i,               // Line references
    /undefined/i,                // JS
    /null pointer/i,             // NullPointer
    /segmentation fault/i,       // C/C++
    /killed/i,                   // Process kill
    /traceback/i                 // Python
  ];

  return errorPatterns.some(pattern => pattern.test(text));
}

export function classifyError(error: string) {
  // Simple keyword matching for context injection
  if (error.match(/NullPointer|undefined|NoneType/i)) {
    return {
      category: "Null/Undefined Reference",
      concepts: ["Object lifecycle", "Existence checks", "Optional Chaining"],
      docs: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined"]
    };
  }

  if (error.match(/IndexOutOfBounds|undefined index|key error/i)) {
    return {
      category: "Out of Bounds Access",
      concepts: ["Array indexing", "Map keys", "Boundary conditions"],
      docs: []
    };
  }

  if (error.match(/SyntaxError|unexpected token|indentation/i)) {
    return {
      category: "Syntax / Parsing Error",
      concepts: ["Linter setup", "Scope closures", "Typos"],
      docs: []
    };
  }

  // Generic fallback that works for ANY language
  return {
    category: "Runtime Error",
    concepts: ["Stack trace analysis", "State verification", "Debugging logic"],
    docs: []
  };
}