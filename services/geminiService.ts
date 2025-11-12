
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        date: {
          type: Type.STRING,
          description: "Transaction date in YYYY-MM-DD format.",
        },
        description: {
          type: Type.STRING,
          description: "A brief description of the transaction.",
        },
        amount: {
          type: Type.NUMBER,
          description: "The transaction amount. Use negative numbers for debits/expenses and positive numbers for credits/income.",
        },
        category: {
          type: Type.STRING,
          enum: Object.values(TransactionCategory),
          description: "The category of the transaction.",
        },
      },
      required: ['date', 'description', 'amount', 'category'],
    },
};

export const extractAndCategorizeTransactions = async (
  base64Data: string,
  mimeType: string
): Promise<Transaction[]> => {
  const filePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };

  const textPart = {
      text: `You are an expert financial analyst. Analyze the provided bank statement PDF.
      Extract every transaction, including its date, description, and amount.
      For each transaction, determine if it is a credit (income) or a debit (expense).
      Finally, categorize each transaction into one of the specified categories.
      
      Provide the output as a valid JSON array of objects, conforming strictly to the provided schema.
      Ensure that amounts for expenses are represented as negative numbers, and income as positive numbers.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [filePart, textPart] },
    config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
    }
  });

  try {
    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    // Additional validation could be added here to ensure the structure matches Transaction[]
    return parsedJson as Transaction[];
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response:", response.text);
    throw new Error("The AI model returned an invalid format. Please try again.");
  }
};
