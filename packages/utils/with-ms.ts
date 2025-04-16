export async function withMS<T extends () => Promise<any>>(fn: T) {
  const start = performance.now();
  const value = await fn();
  const end = performance.now();
  const ms = Math.round(end - start);

  return { value, ms };
}
