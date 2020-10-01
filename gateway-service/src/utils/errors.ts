type ErrorCode = 'LOGIN_FAILED' | 'UNKNOWN_USER';

export class GenericError extends Error {
  public static errorCodeMapper(code: ErrorCode) {
    switch (code) {
      case 'LOGIN_FAILED':
      case 'UNKNOWN_USER':
        return 401;
      default:
        return 500;
    }
  }

  constructor(public code: ErrorCode, message: string, public data?: object) {
    super(message);
    this.data = data;
  }
}
