import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { z } from 'zod/v4';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const userAuthRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/auth',
    {
      schema: {
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const existingUser = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);

        if (!existingUser.length) {
          return reply.status(401).send({ message: 'Invalid credentials' });
        }

        if (existingUser.length > 0) {
          const passwordMatch =
            existingUser[0].password &&
            (await bcrypt.compare(password, existingUser[0].password));

          if (!passwordMatch) {
            return reply.status(401).send({ message: 'Invalid credentials' });
          }

          const refreshToken = app.jwt.sign(
            {
              email,
              provider: existingUser[0].provider,
              providerId: existingUser[0].providerId,
            },
            { expiresIn: '7d' }
          );

          const accessToken = app.jwt.sign(
            {
              email,
              name: existingUser[0].name,
              avatarUrl: '',
              provider: existingUser[0].provider,
              providerId: existingUser[0].providerId,
            },
            { expiresIn: '15m' }
          );

          await db
            .update(schema.users)
            .set({
              accessToken,
              refreshToken,
              updatedAt: new Date(),
            })
            .where(eq(schema.users.email, email));

          return reply.status(201).send({ accessToken, refreshToken });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        return reply.status(400).send({ error: message });
      }
    }
  );
};
