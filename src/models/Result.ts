export function result(
  success: boolean,
  ..._args: Array<string | Error>
): Result {
  const newObj: Result = { success };
  for (const arg of _args) {
    if (typeof arg === 'string') {
      newObj.message = arg;
    } else {
      newObj.error = arg;
    }
  }
  return newObj;
}

export function dataResult<T>(
  success: boolean,
  data: T,
  ..._args: Array<string | Error>
): DataResult<T> {
  const newObj: DataResult<T> = { success, data };
  for (const arg of _args) {
    if (typeof arg === 'string') {
      newObj.message = arg;
    } else {
      newObj.error = arg;
    }
  }
  return newObj;
}

interface Result {
  success: boolean;
  message?: string;
  error?: Error;
}

export interface DataResult<T> extends Result {
  data?: T | null;
}

export default Result;
