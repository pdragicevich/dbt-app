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
