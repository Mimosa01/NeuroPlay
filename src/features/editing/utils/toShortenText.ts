export default function toShortenText (text: string, max: number = 8): string {
  return text.slice(0, max) || '...'
}