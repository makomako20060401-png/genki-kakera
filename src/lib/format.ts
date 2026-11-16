export function formatPrice(price: number | null) {
  if (price === null || price === undefined) return "時価";
  return `¥${price.toLocaleString("ja-JP")}`;
}

export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}
