export type PresetAccent = {
  bg: string
  activeBg: string
  ring: string
  dot: string
}

export const PRESET_ACCENTS: Record<string, PresetAccent> = {
  classic:          { bg: 'bg-sky-400/[0.06]',    activeBg: 'bg-sky-400/[0.14]',    ring: 'ring-sky-400/25',    dot: 'bg-sky-400' },
  'deep-focus':     { bg: 'bg-violet-400/[0.06]', activeBg: 'bg-violet-400/[0.14]', ring: 'ring-violet-400/25', dot: 'bg-violet-400' },
  'quick-sprint':   { bg: 'bg-amber-400/[0.06]',  activeBg: 'bg-amber-400/[0.14]',  ring: 'ring-amber-400/25',  dot: 'bg-amber-400' },
  animedoro:        { bg: 'bg-rose-400/[0.06]',   activeBg: 'bg-rose-400/[0.14]',   ring: 'ring-rose-400/25',   dot: 'bg-rose-400' },
}

const CUSTOM_ACCENTS: PresetAccent[] = [
  { bg: 'bg-emerald-400/[0.06]', activeBg: 'bg-emerald-400/[0.14]', ring: 'ring-emerald-400/25', dot: 'bg-emerald-400' },
  { bg: 'bg-teal-400/[0.06]',    activeBg: 'bg-teal-400/[0.14]',    ring: 'ring-teal-400/25',    dot: 'bg-teal-400' },
  { bg: 'bg-cyan-400/[0.06]',    activeBg: 'bg-cyan-400/[0.14]',    ring: 'ring-cyan-400/25',    dot: 'bg-cyan-400' },
  { bg: 'bg-pink-400/[0.06]',    activeBg: 'bg-pink-400/[0.14]',    ring: 'ring-pink-400/25',    dot: 'bg-pink-400' },
  { bg: 'bg-orange-400/[0.06]',  activeBg: 'bg-orange-400/[0.14]',  ring: 'ring-orange-400/25',  dot: 'bg-orange-400' },
]

export function getAccent(id: string, index?: number): PresetAccent {
  if (PRESET_ACCENTS[id]) return PRESET_ACCENTS[id]
  return CUSTOM_ACCENTS[(index ?? 0) % CUSTOM_ACCENTS.length]
}
