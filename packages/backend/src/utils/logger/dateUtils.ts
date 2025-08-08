/**
 * 格式化日期为指定格式
 * @param date 日期对象，默认为当前时间
 * @param format 格式字符串，支持：YYYY, MM, DD, HH, mm, ss
 */
export function formatDate(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取当前日期字符串 (YYYY-MM-DD)
 */
export function getCurrentDate(): string {
  return formatDate(new Date(), 'YYYY-MM-DD');
}

/**
 * 计算两个日期之间的天数差
 * @param date1 第一个日期
 * @param date2 第二个日期，默认为当前时间
 */
export function getDaysDiff(date1: Date, date2 = new Date()): number {
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / oneDay);
}
