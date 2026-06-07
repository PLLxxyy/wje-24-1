export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatMoney(amount: number) {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
