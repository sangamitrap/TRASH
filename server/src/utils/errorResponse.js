class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Creates .stack property on the object
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
