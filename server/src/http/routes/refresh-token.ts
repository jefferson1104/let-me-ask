import { eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

import type { JWTPayload } from '../../types/auth.ts';

export const refreshTokenRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/auth/refresh-token',
    {
      schema: {
        body: z.object({
          refreshToken: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body;

      try {
        const payload = app.jwt.verify(refreshToken) as JWTPayload;

        const user = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, payload.email))
          .limit(1);

        if (!user.length || user[0].refreshToken !== refreshToken) {
          return reply.status(401).send({ error: 'Invalid refresh token' });
        }

        const accessToken = app.jwt.sign(
          {
            email: user[0].email,
            provider: 'google',
            providerId: user[0].providerId,
          },
          { expiresIn: '15m' }
        );

        const newRefreshToken = app.jwt.sign(
          {
            email: user[0].email,
            provider: 'google',
            providerId: user[0].providerId,
          },
          { expiresIn: '7d' }
        );

        await db
          .update(schema.users)
          .set({ refreshToken: newRefreshToken })
          .where(eq(schema.users.id, user[0].id));

        return reply.send({ accessToken, refreshToken: newRefreshToken });
      } catch (_err) {
        return reply
          .status(401)
          .send({ error: 'Invalid or expired refresh token' });
      }
    }
  );
};
