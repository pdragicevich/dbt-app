/* eslint-disable  @typescript-eslint/no-explicit-any */

export function hasAny(obj: any) {
  const len = obj?.length;
  if (typeof len !== 'number') {
    return false;
  }
  return len > 0;
}

export function guardedTrim(obj: any): string {
  if (obj == null) {
    return '';
  }
  return obj.toString().trim();
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
