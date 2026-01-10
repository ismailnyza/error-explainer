export function isSafe(text: string) {
  const badWords = [
    "replace",
    "fix by",
    "change this",
    "add this line",
    "use this code"
  ];

  // 1. Allow punctuation like {};= in text explanations, 
  // but BLOCK generated markdown code blocks.
  if (text.includes("```")) return false;

  // 2. Scan for specific "solution giving" phrases
  return !badWords.some(w =>
    text.toLowerCase().includes(w)
  );
}