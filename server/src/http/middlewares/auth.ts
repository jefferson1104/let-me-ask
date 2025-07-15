import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export function createAuthMiddleware(app: FastifyInstance) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({
          error: 'Unauthorized access',
        });
      }

      const token = authHeader.substring(7);
      const payload = await app.jwt.verify(token);

      request.user = payload;

      return;
    } catch (_err) {
      return reply.status(401).send({
        error: 'Invalid or expired token',
      });
    }
  };
}
