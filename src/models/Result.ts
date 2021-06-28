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

interface Result {
  success: boolean;
  message?: string;
  error?: Error;
}
export default Result;
