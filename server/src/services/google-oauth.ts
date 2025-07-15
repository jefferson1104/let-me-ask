import type { FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../env.ts';

export function handleGoogleAuthError(error: unknown, reply: FastifyReply) {
  if (error instanceof Error) {
    if (
      error.message.includes('Token used too late') ||
      error.message.includes('expired') ||
      error.message.includes('nbf')
    ) {
      return reply.status(401).send({
        error: 'GOOGLE_TOKEN_EXPIRED',
        message: 'Google token expired. Please login again.',
        code: 'GOOGLE_TOKEN_EXPIRED',
      });
    }
    if (
      error.message.includes('Invalid token') ||
      error.message.includes('invalid')
    ) {
      return reply.status(401).send({
        error: 'INVALID_GOOGLE_TOKEN',
        message: 'Invalid Google token. Please login again.',
        code: 'INVALID_GOOGLE_TOKEN',
      });
    }
  }
  return reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: 'Internal server error during authentication',
    code: 'INTERNAL_ERROR',
  });
}

export async function handleGoogleAuthSuccess(credential: string) {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const googleTokenPayload = ticket.getPayload();

  if (!googleTokenPayload) {
    throw new Error('Invalid Google token payload');
  }

  return googleTokenPayload;
}
