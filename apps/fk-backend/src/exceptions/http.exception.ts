export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly error?: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'The requested resource was not found', details?: Record<string, any>) {
    super(404, message, 'Not Found', details);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', details?: Record<string, any>) {
    super(400, message, 'Bad Request', details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized', details?: Record<string, any>) {
    super(401, message, 'Unauthorized', details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden', details?: Record<string, any>) {
    super(403, message, 'Forbidden', details);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error', details?: Record<string, any>) {
    super(500, message, 'Internal Server Error', details);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict', details?: Record<string, any>) {
    super(409, message, 'Conflict', details);
  }
}
