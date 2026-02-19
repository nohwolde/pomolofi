import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { PomodoroPreset, DEFAULT_PRESETS, ORIGINAL_DEFAULTS_MAP } from '@/types/preset'

const PRESETS_KEY = 'pomodoroPresets'
const ACTIVE_PRESET_KEY = 'activePresetId'

export function getPresetsFromStorage(): PomodoroPreset[] {
  if (typeof window === 'undefined') return DEFAULT_PRESETS
  const raw = localStorage.getItem(PRESETS_KEY)
  if (!raw) return DEFAULT_PRESETS.map((p) => ({ ...p }))
  try {
    const parsed = JSON.parse(raw) as PomodoroPreset[]
    return parsed.length > 0 ? parsed : DEFAULT_PRESETS.map((p) => ({ ...p }))
  } catch {
    return DEFAULT_PRESETS.map((p) => ({ ...p }))
  }
}

export function savePresetsToStorage(presets: PomodoroPreset[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}

export function getActivePresetId(): string {
  if (typeof window === 'undefined') return DEFAULT_PRESETS[0].id
  return localStorage.getItem(ACTIVE_PRESET_KEY) || DEFAULT_PRESETS[0].id
}

export function saveActivePresetId(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACTIVE_PRESET_KEY, id)
}

export function getActiveDurations(presets: PomodoroPreset[], activeId: string) {
  const preset = presets.find((p) => p.id === activeId) || presets[0] || DEFAULT_PRESETS[0]
  return {
    pomodoro: preset.pomodoro,
    shortBreak: preset.shortBreak,
    longBreak: preset.longBreak,
  }
}

export function resetDefaultPresets(presets: PomodoroPreset[]): PomodoroPreset[] {
  const customPresets = presets.filter((p) => !p.isDefault)
  return [...DEFAULT_PRESETS.map((p) => ({ ...p })), ...customPresets]
}

// --- Firestore sync ---

const firestorePresetsPath = (userId: string) =>
  doc(db, 'users', userId, 'preferences', 'presets')

export async function savePresetsToFirestore(
  userId: string,
  presets: PomodoroPreset[],
  activePresetId: string
): Promise<void> {
  try {
    await setDoc(firestorePresetsPath(userId), { presets, activePresetId })
  } catch (error) {
    console.error('Error saving presets to Firestore:', error)
  }
}

async function getPresetsFromFirestore(
  userId: string
): Promise<{ presets: PomodoroPreset[]; activePresetId: string } | null> {
  try {
    const snap = await getDoc(firestorePresetsPath(userId))
    if (!snap.exists()) return null
    const data = snap.data() as { presets: PomodoroPreset[]; activePresetId: string }
    return data
  } catch (error) {
    console.error('Error reading presets from Firestore:', error)
    return null
  }
}

export async function syncPresetsOnLogin(userId: string): Promise<{
  presets: PomodoroPreset[]
  activePresetId: string
}> {
  const local = getPresetsFromStorage()
  const localActiveId = getActivePresetId()

  const remote = await getPresetsFromFirestore(userId)

  if (!remote) {
    // First login or no remote data — push local to Firestore
    await savePresetsToFirestore(userId, local, localActiveId)
    return { presets: local, activePresetId: localActiveId }
  }

  // Merge: Firestore wins on id conflicts, local-only presets get added
  const remoteMap = new Map(remote.presets.map((p) => [p.id, p]))
  const merged = [...remote.presets]

  for (const lp of local) {
    if (!remoteMap.has(lp.id)) {
      merged.push(lp)
    }
  }

  const activeId = remote.activePresetId || localActiveId

  // Write merged result to both stores
  savePresetsToStorage(merged)
  saveActivePresetId(activeId)
  await savePresetsToFirestore(userId, merged, activeId)

  return { presets: merged, activePresetId: activeId }
}

export async function persistPresets(
  presets: PomodoroPreset[],
  activePresetId: string,
  userId?: string | null
): Promise<void> {
  savePresetsToStorage(presets)
  saveActivePresetId(activePresetId)
  if (userId) {
    await savePresetsToFirestore(userId, presets, activePresetId)
  }
}
