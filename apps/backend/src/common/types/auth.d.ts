import { FastifyRequest } from 'fastify';
import { User } from '../../types/fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user: User; // User is guaranteed to exist for authenticated requests
}

export function isAuthenticatedRequest(
  request: FastifyRequest
): request is AuthenticatedRequest {
  return !!request.user?.id && !!request.user?.email;
}
