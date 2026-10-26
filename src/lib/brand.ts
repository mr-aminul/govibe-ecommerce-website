/** Default brand values — overridden by Website → Site settings when saved. */
export const BRAND = {
  name: 'GoVibe',
  tagline: "Men's bags. Everyday vibe.",
  phone: '01805-215181',
  whatsapp: '+8801805215181',
  email: 'hello@govibe.bd',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/profile.php?id=61572373118300',
  followers: '1.3K',
  recommend: '98%',
  city: 'Dhaka, Bangladesh',
  mapsUrl: 'https://maps.app.goo.gl/',
  /** Google Maps iframe embed (Share → Embed a map). */
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9!2d90.4125!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzM3LjEiTiA5MMKwMjQnNDUuMCJF!5e0!3m2!1sen!2sbd!4v1728320000000!5m2!1sen!2sbd',
} as const

/** Format BDT amounts with the ৳ symbol. */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`
}

/**
 * Percent off from compare-at → current price.
 * Returns null when there is no meaningful discount.
 */
export function discountPercent(
  price: number,
  compareAt: number | null | undefined,
): number | null {
  if (compareAt == null || !Number.isFinite(compareAt) || !Number.isFinite(price)) {
    return null
  }
  if (compareAt <= 0 || price < 0 || compareAt <= price) return null
  return Math.round(((compareAt - price) / compareAt) * 100)
}

/** Digits-only id for wa.me links. */
export function whatsappDigits(whatsapp: string): string {
  return whatsapp.replace(/\D/g, '')
}

export function whatsappHref(whatsapp: string, text?: string): string {
  const base = `https://wa.me/${whatsappDigits(whatsapp)}`
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}
