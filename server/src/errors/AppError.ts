type SerializedAppError = {
  message: string;
};

export abstract class AppError extends Error {
  abstract statusCode: number;

  constructor (message: string) {
    super(message);
  }

  abstract serializeError: () => SerializedAppError;
}