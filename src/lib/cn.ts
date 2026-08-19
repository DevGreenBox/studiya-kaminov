/** Мини-склейка классов без внешних зависимостей. */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}
