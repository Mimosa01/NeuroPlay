export default function colorFromSignal(signalLevel: number): string {
  if (signalLevel < 0.3) return '#cbd5e1';    // slate-300
  if (signalLevel < 0.6) return '#fbbf24';    // yellow-400
  if (signalLevel < 0.9) return '#f97316';    // orange-500
  return '#ef4444';                           // red-500
}