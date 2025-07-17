import { createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../database/connection.ts';
import { schema } from '../../database/schema/index.ts';

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/auth/register',
    {
      schema: {
        body: z
          .object({
            email: z.email(),
            name: z.string().min(3),
            password: z.string().min(6),
            confirmPassword: z.string().min(6),
          })
          .refine((data) => data.password === data.confirmPassword, {
            message: 'and password does not match',
            path: ['confirmPassword'],
          }),
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body;

      try {
        const existingUser = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);

        if (existingUser.length > 0) {
          return reply.status(400).send({ error: 'Email is used already' });
        }

        const provider = {
          name: 'email-password',
          sub: createHash('sha256').update(email).digest('hex'),
        };

        const refreshToken = app.jwt.sign(
          { email, provider: provider.name, providerId: provider.sub },
          { expiresIn: '7d' }
        );

        const accessToken = app.jwt.sign(
          { email, provider: provider.name, providerId: provider.sub },
          { expiresIn: '15m' }
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(schema.users).values({
          name,
          email,
          password: hashedPassword,
          provider: provider.name,
          providerId: provider.sub,
          accessToken,
          refreshToken,
        });

        return reply.status(201).send({ message: 'User created successfully' });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        return reply.status(400).send({ error: message });
      }
    }
  );
};
