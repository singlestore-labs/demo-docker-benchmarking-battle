export class CustomError<TName extends string = string> extends Error {
  constructor(
    public name: TName,
    message: Error["message"],
    options?: {
      cause?: Error["cause"];
    },
  ) {
    super(message, { cause: options?.cause });
  }

  toObject() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
