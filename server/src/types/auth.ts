import type { FastifyRequest } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    email: string;
    provider: string;
    providerId: string;
  };
}

export interface JWTPayload {
  email: string;
  provider: string;
  providerId: string;
  iat: number;
  exp: number;
}
