import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { v4 as uuidv4 } from 'uuid'

export type FavoriteType = 'video' | 'playlist'

export interface FavoriteVideo {
  id: string
  videoId: string
  playlistId?: string
  type: FavoriteType
  title: string
  thumbnail: string
  addedAt: number
}

const FAVORITES_KEY = 'favoriteVideos'

export function buildThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    if (!res.ok) return 'Untitled Video'
    const data = await res.json()
    return data.title || 'Untitled Video'
  } catch {
    return 'Untitled Video'
  }
}

export async function fetchPlaylistInfo(playlistId: string): Promise<{ title: string; thumbnail: string }> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/playlist?list=${playlistId}&format=json`
    )
    if (!res.ok) return { title: 'Untitled Playlist', thumbnail: '' }
    const data = await res.json()
    return {
      title: data.title || 'Untitled Playlist',
      thumbnail: data.thumbnail_url || '',
    }
  } catch {
    return { title: 'Untitled Playlist', thumbnail: '' }
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function extractYouTubePlaylistId(url: string): string | null {
  const regex = /[?&]list=([a-zA-Z0-9_-]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Parses a YouTube URL and returns the type + relevant IDs.
 * Pure playlist URLs (no video ID) return type 'playlist'.
 * Video URLs (even with a list param) return type 'video'.
 */
export function parseYouTubeUrl(url: string): {
  type: FavoriteType
  videoId: string | null
  playlistId: string | null
} {
  const videoId = extractYouTubeVideoId(url)
  const playlistId = extractYouTubePlaylistId(url)

  if (!videoId && playlistId) {
    return { type: 'playlist', videoId: null, playlistId }
  }

  return { type: 'video', videoId, playlistId }
}

// --- localStorage ---

export function getFavoritesFromStorage(): FavoriteVideo[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(FAVORITES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as FavoriteVideo[]
    return parsed.map((f) => ({ ...f, type: f.type || 'video' }))
  } catch {
    return []
  }
}

export function saveFavoritesToStorage(favorites: FavoriteVideo[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

// --- Firestore ---

const firestoreFavoritesPath = (userId: string) =>
  doc(db, 'users', userId, 'preferences', 'favorites')

async function saveFavoritesToFirestore(
  userId: string,
  favorites: FavoriteVideo[]
): Promise<void> {
  try {
    await setDoc(firestoreFavoritesPath(userId), { favorites })
  } catch (error) {
    console.error('Error saving favorites to Firestore:', error)
  }
}

async function getFavoritesFromFirestore(
  userId: string
): Promise<FavoriteVideo[] | null> {
  try {
    const snap = await getDoc(firestoreFavoritesPath(userId))
    if (!snap.exists()) return null
    const data = snap.data() as { favorites: FavoriteVideo[] }
    return data.favorites.map((f) => ({ ...f, type: f.type || 'video' }))
  } catch (error) {
    console.error('Error reading favorites from Firestore:', error)
    return null
  }
}

// --- Unified API ---

export async function persistFavorites(
  favorites: FavoriteVideo[],
  userId?: string | null
): Promise<void> {
  saveFavoritesToStorage(favorites)
  if (userId) {
    await saveFavoritesToFirestore(userId, favorites)
  }
}

export async function syncFavoritesOnLogin(
  userId: string
): Promise<FavoriteVideo[]> {
  const local = getFavoritesFromStorage()
  const remote = await getFavoritesFromFirestore(userId)

  if (!remote) {
    await saveFavoritesToFirestore(userId, local)
    return local
  }

  const remoteKeys = new Set(
    remote.map((f) => (f.type === 'playlist' ? `pl:${f.playlistId}` : `v:${f.videoId}`))
  )
  const merged = [...remote]

  for (const lf of local) {
    const key = lf.type === 'playlist' ? `pl:${lf.playlistId}` : `v:${lf.videoId}`
    if (!remoteKeys.has(key)) {
      merged.push(lf)
    }
  }

  saveFavoritesToStorage(merged)
  await saveFavoritesToFirestore(userId, merged)

  return merged
}

export function createFavorite(
  videoId: string,
  title: string,
  type: FavoriteType = 'video',
  playlistId?: string,
  thumbnail?: string
): FavoriteVideo {
  return {
    id: uuidv4(),
    videoId,
    playlistId,
    type,
    title,
    thumbnail: thumbnail || (videoId ? buildThumbnailUrl(videoId) : ''),
    addedAt: Date.now(),
  }
}
