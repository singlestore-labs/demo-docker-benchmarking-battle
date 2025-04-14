import { EnvUndefinedError } from "@repo/errors/env";

export function env<T extends string>(name: T) {
  const env = process.env[name];

  if (!env) {
    throw new EnvUndefinedError(name);
  }

  return env;
}
