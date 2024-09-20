export default function isFunction<T extends (...args: unknown[]) => unknown>(x: unknown): x is T {
  return typeof x === 'function';
}
