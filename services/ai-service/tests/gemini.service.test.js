jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () =>
              '{"category":"Feature Request","sentiment":"Positive","priority_score":8,"summary":"User wants dark mode","tags":["UI","Settings"]}'
          }
        })
      })
    }))
  };
});

const { analyzeFeedback, normalizeAiPayload } = require("../src/services/gemini.service");

test("normalizeAiPayload clamps and sanitizes fields", () => {
  const result = normalizeAiPayload({
    category: "Invalid Category",
    sentiment: "Bad",
    priority_score: 20,
    summary: 123,
    tags: ["A", 2]
  });

  expect(result.category).toBe("Other");
  expect(result.sentiment).toBe("Neutral");
  expect(result.priority_score).toBe(10);
  expect(result.summary).toBe("Summary unavailable");
  expect(result.tags).toEqual(["A", "2"]);
});

test("analyzeFeedback parses mocked Gemini response", async () => {
  process.env.GEMINI_API_KEY = "test-key";
  const result = await analyzeFeedback("Need dark mode", "Please add dark mode in dashboard settings.");

  expect(result.category).toBe("Feature Request");
  expect(result.sentiment).toBe("Positive");
  expect(result.priority_score).toBe(8);
  expect(result.tags).toContain("UI");
});
