import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpException } from '../../exceptions/http.exception';

export function httpExceptionHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof HttpException) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.error || 'Error',
      message: error.message,
      details: error.details,
    });
  }

  // Handle MikroORM's NotFoundError
  if (error.name === 'NotFoundError') {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: error.message,
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Validation failed',
      details: (error as any).errors,
    });
  }

  // Default error response
  console.error('Unhandled error:', error);
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
