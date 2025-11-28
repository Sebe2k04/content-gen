import { FastifyRequest } from "fastify";
import { UnauthorizedException } from "src/exceptions/http.exception";

export function currentUser(request: FastifyRequest) {
  if (!request.user) {
    throw new UnauthorizedException("No user found. Add JwtGuard()");
  }
  return request.user;
}
