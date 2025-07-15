import { count, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';
import { createAuthMiddleware } from '../middlewares/auth.ts';

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  const authenticate = createAuthMiddleware(app);

  app.get('/rooms', { preHandler: [authenticate] }, async (_request, reply) => {
    try {
      const results = await db
        .select({
          id: schema.rooms.id,
          name: schema.rooms.name,
          createdAt: schema.rooms.createdAt,
          questionsCount: count(schema.questions.id),
        })
        .from(schema.rooms)
        .leftJoin(
          schema.questions,
          eq(schema.questions.roomId, schema.rooms.id)
        )
        .groupBy(schema.rooms.id, schema.rooms.name, schema.rooms.createdAt)
        .orderBy(schema.rooms.createdAt);

      return reply.send(results);
    } catch (error) {
      console.error('Error in getRooms:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};
