import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function gerarRespostaGemini(prompt: string) {
  const resposta = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: prompt,
  });

  return resposta.output_text;
}