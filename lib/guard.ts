export function isSafe(text: string) {
  const badWords = [
    "replace",
    "fix by",
    "change this",
    "add this line"
  ];

  if (/[{};=]/.test(text)) return false;

  return !badWords.some(w =>
    text.toLowerCase().includes(w)
  );
}
