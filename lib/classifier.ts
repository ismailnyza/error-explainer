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

  return {
    category: "General Java runtime error",
    concepts: [
      "Stack traces",
      "Execution flow",
      "Runtime exceptions"
    ],
    docs: [
      "https://docs.oracle.com/javase/tutorial/essential/exceptions/"
    ]
  };
}
