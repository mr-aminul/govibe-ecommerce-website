/**
 * Approximate exterior bag sizes for the storefront size guide.
 */
export type SizeChartRow = {
  size: string
  fit: string
  widthCm: number
  heightCm: number
}

export const SIZE_CHART_ROWS: SizeChartRow[] = [
  { size: 'S', fit: 'Phone + wallet + keys', widthCm: 22, heightCm: 16 },
  { size: 'M', fit: 'Daily essentials + small bottle', widthCm: 28, heightCm: 20 },
  { size: 'L', fit: 'Tablet + layer + bottle', widthCm: 34, heightCm: 26 },
  { size: 'XL', fit: 'Laptop sleeve + gym extras', widthCm: 40, heightCm: 30 },
]
