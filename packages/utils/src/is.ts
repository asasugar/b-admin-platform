/**
 * 类型判断工具函数集合
 */

const toTypeString = Object.prototype.toString;

export function getTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toTypeString.call(value);
}

export function is(val: unknown, type: string): boolean {
  return toTypeString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val: T): val is NonNullable<T> {
  return typeof val !== 'undefined';
}

export function isUnDef(val: unknown): val is undefined {
  return !isDef(val);
}

export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && is(val, 'Object');
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function';
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  );
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray(val: unknown): val is any[] {
  return Array.isArray(val);
}

export function isElement(val: unknown): val is HTMLElement {
  return isObject(val) && !!(val as HTMLElement).tagName;
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export function isEmpty(val: unknown): boolean {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

/**
 * 判断是否是复杂类型（数组或对象）
 * @param map - 要检查的值
 * @returns 是否为复杂类型
 */
export function isValidMap(map: unknown): map is Record<string, any> | any[] {
  return isArray(map) || isObject(map);
}

/**
 * 判断一个字符串是否为JSON字符串
 * @param str - 要检查的字符串
 * @returns 是否为有效的JSON字符串
 */
export function isJsonStr(str: unknown): boolean {
  if (isString(str)) {
    try {
      const obj = JSON.parse(str);
      if (obj && isObject(obj)) {
        return true;
      }
      return false;
    } catch (e) {
      console.error('JSON parse error:', str, e);
      return false;
    }
  }
  return false;
}

/**
 * 判断是否为图片格式（img标签可打开的）
 * @param url - url链接
 * @returns 是否为图片链接
 */
export function isImage(url: string): boolean {
  const reg = /\.(png|jpg|gif|jpeg|webp)$/;
  return reg.test(url);
}

/**
 * 判断是否为json链接
 * @param url - url链接
 * @returns 是否为json链接
 */
export function isJsonUrl(url: string): boolean {
  const reg = /\.(json)$/;
  return reg.test(url);
}

export const isLocal: boolean = ['localhost', '127.0.0.1'].includes(location.hostname);
