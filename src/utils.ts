interface Arrayish {
  length: number;
}

export function hasAny(obj: unknown) {
  if (!isArrayish(obj)) {
    return false;
  }
  if (obj.length > 0) {
    return true;
  }
  return false;
}

export function isArrayShape(
  obj: unknown,
): obj is Partial<Record<keyof Arrayish, unknown>> {
  return obj != null && typeof obj === 'object';
}

export function isArrayish(obj: unknown): obj is Arrayish {
  if (!isArrayShape(obj)) {
    return false;
  }
  if (typeof obj.length === 'number') {
    return true;
  }
  return false;
}

export function guardedTrim(obj: string | null | undefined): string {
  return obj ? obj.trim() : '';
}

export function unixDate(date: Date): number {
  return Math.floor(date.valueOf() / 1000);
}

export function unixDateNow(): number {
  return unixDate(new Date());
}

export function unixDateToday(): number {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return unixDate(date);
}

export function nowValue() {
  return new Date().valueOf();
}

export function firstOrDefault<T>(arr: T[], defaultValue: T | null = null) {
  if (!hasAny(arr)) {
    return defaultValue;
  }
  return arr[0];
}

export function nowYear() {
  return new Date().getFullYear();
}

export function noop() {
  return;
}

export function roundTo(raw: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(raw * factor) / factor;
}
