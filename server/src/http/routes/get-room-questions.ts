import { desc, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';

import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

import { createAuthMiddleware } from '../middlewares/auth.ts';

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  const authenticate = createAuthMiddleware(app);

  app.get(
    '/rooms/:roomId/questions',
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt));

      return result;
    }
  );
};
