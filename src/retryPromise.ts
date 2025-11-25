import { NetworkError } from "./apiSimulator";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function retryPromise<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number
): Promise<T> {
  return fn().catch(async (error) => {
    const shouldRetry =
      error instanceof NetworkError && retries > 1;

    if (!shouldRetry) {
      throw error;
    }

    console.log(
      `Retrying after error: ${error.message}. Remaining attempts: ${
        retries - 1
      }`
    );

    await delay(delayMs);

    return retryPromise(fn, retries - 1, delayMs);
  });
}
