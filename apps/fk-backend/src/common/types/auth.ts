import { FastifyRequest } from 'fastify';

export interface JwtUser {
  id: string;
  email: string;
}

export function isAuthenticatedRequest(
  request: FastifyRequest
): request is FastifyRequest & { user: JwtUser } {
  return !!request.user && 
         typeof request.user === 'object' && 
         'id' in request.user && 
         'email' in request.user;
}

export type AuthenticatedRequest = FastifyRequest & {
  user: JwtUser;
};
