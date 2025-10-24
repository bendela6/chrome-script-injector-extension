export function variant<T, K extends keyof T>(key: K, obj: T): T[K] {
  return obj[key];
}
