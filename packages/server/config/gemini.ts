import './env';
import { GoogleGenAI } from '@google/genai';

const GeminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export { GeminiClient };
