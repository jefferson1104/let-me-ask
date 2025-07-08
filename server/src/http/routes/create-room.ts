import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const createRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { name, description } = request.body;

      const result = await db
        .insert(schema.rooms)
        .values({ name, description })
        .returning();

      const createdRoom = result[0];

      if (!createdRoom) {
        throw new Error('Failed to create new room');
      }

      return reply.status(201).send({ roomId: createdRoom.id });
    }
  );
};
