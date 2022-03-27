export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number';
}

export function isObject(val: unknown): val is Record<string, any> {
  return !isNull(val) && typeof val === 'object';
}

export function isBoolean(val: unknown) {
  return typeof val === 'boolean';
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isUndefined(val: unknown) {
  return typeof val === 'undefined';
}

export function exhaustiveCheck(_val: never) {
  return _val;
}
