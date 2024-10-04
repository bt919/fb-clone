export abstract class ExceptionBase extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestException extends ExceptionBase {
  readonly statusCode = 400;
  readonly error = "Bad Request";
}

export class UnauthorizedException extends ExceptionBase {
  readonly statusCode = 401;
  readonly error = "Unauthorized";
}

export class InternalServerErrorException extends ExceptionBase {
  readonly statusCode = 500;
  static readonly message = "Internal server error";
  readonly error = "Internal server error";

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }
}

export class DatabaseErrorException extends ExceptionBase {
  statusCode = 500;
  static readonly message = "Database error";
  readonly error = "Internal server error";

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }
}
