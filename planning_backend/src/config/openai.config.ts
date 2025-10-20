import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
}

export const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "Multi-Agent Planning System"
  }
});

export const PLANNING_MODEL = "gemini-2.5-flash";

// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// if (!process.env.OPENROUTER_API_KEY) {
//   throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
// }

// export const openai = new OpenAI({
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
//   apiKey: process.env.GEMINI_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
//     "X-Title": "Multi-Agent Planning System"
//   }
// });

// export const PLANNING_MODEL = "gemini-2.5-flash-lite";
