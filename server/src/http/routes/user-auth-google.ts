import { eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { z } from 'zod/v4';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

import {
  handleGoogleAuthError,
  handleGoogleAuthSuccess,
} from '../../services/google-oauth.ts';

export const userAuthGoogleRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/auth/google',
    {
      schema: {
        body: z.object({
          credential: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { credential } = request.body;

      try {
        const payload = await handleGoogleAuthSuccess(credential);

        if (!(payload?.email && payload?.name)) {
          return reply.status(401).send({
            error: 'INVALID TOKEN',
            message: 'Invalid Google token',
          });
        }

        const { name, email, picture, sub } = payload;

        const refreshToken = app.jwt.sign(
          { email, provider: 'google', providerId: sub },
          { expiresIn: '7d' }
        );

        const accessToken = app.jwt.sign(
          {
            email,
            name,
            avatarUrl: picture,
            provider: 'google',
            providerId: sub,
          },
          { expiresIn: '15m' }
        );

        const existingUser = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);

        if (existingUser.length > 0) {
          await db
            .update(schema.users)
            .set({
              name,
              provider: 'google',
              providerId: sub,
              avatarUrl: picture,
              accessToken,
              refreshToken,
              updatedAt: new Date(),
            })
            .where(eq(schema.users.email, email));
        } else {
          await db.insert(schema.users).values({
            name,
            email,
            provider: 'google',
            providerId: sub,
            avatarUrl: picture,
            accessToken,
            refreshToken,
          });
        }

        return reply.status(201).send({ accessToken, refreshToken });
      } catch (error) {
        console.error('Error auth google:', error);
        return handleGoogleAuthError(error, reply);
      }
    }
  );
};
