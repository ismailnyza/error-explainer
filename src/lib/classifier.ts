export function isLikelyErrorLog(text: string): boolean {
  // 1. If it's too short, it's not a real log.
  if (text.length < 15) return false;

  // 2. Check for common error signatures
  const errorPatterns = [
    /error/i,                    // Generic "Error"
    /exception/i,                // Java/JS/Python "Exception"
    /panic:/i,                   // Go/Rust panics
    /at\s+.*\s+\(.*\:\d+\:\d+\)/, // JS/Java Stack trace "at func (file:10:5)"
    /\w+\.\w+\(.*\:\d+\)/,       // Python/Ruby trace "file.py:10"
    /\[.*\]\s+.*failed/,         // Logs like "[Error] Task failed"
    /Caused by:/i,               // Java nested exceptions
    /line\s+\d+/i,               // "Line 50" references
    /undefined/i,                // JS undefined errors
    /null pointer/i              // NullPointer
  ];

  // Must match at least one error pattern
  return errorPatterns.some(pattern => pattern.test(text));
}

export function classifyError(error: string) {
  if (error.includes("NullPointerException")) {
    return {
      category: "Null handling",
      concepts: [
        "Object initialization",
        "Optional",
        "Dependency injection lifecycle"
      ],
      docs: [
        "https://docs.oracle.com/javase/8/docs/api/java/lang/NullPointerException.html",
        "https://www.baeldung.com/java-nullpointerexception"
      ]
    };
  }

  if (error.includes("IndexOutOfBoundsException")) {
    return {
      category: "Collection bounds",
      concepts: [
        "Array vs List indexing",
        "Zero-based indexing"
      ],
      docs: [
        "https://docs.oracle.com/javase/8/docs/api/java/lang/IndexOutOfBoundsException.html"
      ]
    };
  }

  // Default fallback
  return {
    category: "General Runtime Error",
    concepts: [
      "Stack traces",
      "Execution flow",
      "Debugging strategies"
    ],
    docs: [
      "https://stackoverflow.com/"
    ]
  };
}