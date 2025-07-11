import { GoogleGenAI } from '@google/genai';
import { env } from '../env.ts';

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = 'gemini-2.5-flash';

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: `You will receive an audio file in any spoken language.
Transcribe and translate it accurately into **US English**.
Always return the final result in natural-sounding, grammatically correct English.
Use proper punctuation and structure it in paragraphs when appropriate.
Do not return any other language.`,
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error('Transcription failed: No text returned from Gemini API');
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  });

  if (!response.embeddings?.[0].values) {
    throw new Error(
      'Embedding generation failed: No embeddings returned from Gemini API'
    );
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join('\n\n');

  const prompt = `
    Based on the text provided below as context, answer the question clearly and objectively, with maximum accuracy, the answer must always be in US American English.

    CONTEXT:
    ${context}


    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Provide a concise and accurate answer;
    - Do not include any additional information or explanations;
    - Always return the answer in natural-sounding, grammatically correct English;
    - Use only information contained in the submitted context;
    - If the answer is not found in context, just answer that you do not have enough information to answer the question;
    - Maintain an educational and professional tone;
    - Cite relevant quotations from the context, if necessary, to support the answer;
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error(
      'Answer generation failed: No answer returned from Gemini API'
    );
  }

  return response.text;
}
