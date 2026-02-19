export type PomodoroPreset = {
  id: string
  name: string
  pomodoro: number
  shortBreak: number
  longBreak: number
  isDefault?: boolean
}

export const DEFAULT_PRESETS: PomodoroPreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    isDefault: true,
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    pomodoro: 50,
    shortBreak: 10,
    longBreak: 30,
    isDefault: true,
  },
  {
    id: 'quick-sprint',
    name: 'Quick Sprint',
    pomodoro: 10,
    shortBreak: 5,
    longBreak: 10,
    isDefault: true,
  },
  {
    id: 'animedoro',
    name: 'Animedoro',
    pomodoro: 40,
    shortBreak: 20,
    longBreak: 20,
    isDefault: true,
  },
]

export const ORIGINAL_DEFAULTS_MAP: Record<string, PomodoroPreset> = Object.fromEntries(
  DEFAULT_PRESETS.map((p) => [p.id, { ...p }])
)
