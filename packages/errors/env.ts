import { CustomError } from "@repo/errors/custom";

export class EnvUndefinedError extends CustomError<"EnvUndefinedError"> {
  constructor(name: string) {
    super("EnvUndefinedError", `The ${name} environment variable is missing or undefined.`);
  }
}
