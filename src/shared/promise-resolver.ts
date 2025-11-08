export function withPromiseResolver<T = unknown>() {
  let resolve: (value: unknown) => void;
  let reject: (reason?: T) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}
