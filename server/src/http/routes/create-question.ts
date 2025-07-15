import { and, eq, sql } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts';

import { createAuthMiddleware } from '../middlewares/auth.ts';

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  const authenticate = createAuthMiddleware(app);

  app.post(
    '/rooms/:roomId/questions',
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const embeddings = await generateEmbeddings(question);
      if (!embeddings) {
        throw new Error('Failed to generate embeddings for the question');
      }

      const embeddingsAsString = `[${embeddings.join(',')}]`;

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(3);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);
        answer = await generateAnswer(question, transcriptions);
      }

      const result = await db
        .insert(schema.questions)
        .values({ roomId, question, answer })
        .returning();

      const createdQuestion = result[0];

      if (!createdQuestion) {
        throw new Error('Failed to create new question');
      }

      return reply.status(201).send({ questionId: createdQuestion.id, answer });
    }
  );
};
