/**
 * Voice Recording Storage Service using IndexedDB (100% Offline)
 * Stores microphone audio clips per AAC button and binary answers (SÍ / NO).
 */

const DB_NAME = 'vocalis_aac_audiodb'
const DB_VERSION = 1
const STORE_NAME = 'button_recordings'

interface StoredAudioRecord {
  key: string
  blob: Blob
  mimeType: string
  durationMs: number
  recordedAt: number
}

// In-memory cache of object URLs to avoid recreating them constantly
const objectUrlCache = new Map<string, string>()

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no está soportado en este entorno.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveRecordedAudio(
  buttonKey: string,
  blob: Blob,
  durationMs: number = 2000
): Promise<void> {
  const db = await openDB()

  // Revoke any previous cached URL
  const existingUrl = objectUrlCache.get(buttonKey)
  if (existingUrl) {
    URL.revokeObjectURL(existingUrl)
    objectUrlCache.delete(buttonKey)
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    const record: StoredAudioRecord = {
      key: buttonKey,
      blob,
      mimeType: blob.type || 'audio/webm',
      durationMs: Math.max(800, durationMs),
      recordedAt: Date.now(),
    }

    const req = store.put(record)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function getRecordedAudio(
  buttonKey: string
): Promise<{ blob: Blob; url: string; durationMs: number } | null> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(buttonKey)

    req.onsuccess = () => {
      const record = req.result as StoredAudioRecord | undefined
      if (!record || !record.blob) {
        resolve(null)
        return
      }

      let url = objectUrlCache.get(buttonKey)
      if (!url) {
        url = URL.createObjectURL(record.blob)
        objectUrlCache.set(buttonKey, url)
      }

      resolve({
        blob: record.blob,
        url,
        durationMs: record.durationMs || 2500,
      })
    }

    req.onerror = () => reject(req.error)
  })
}

export async function deleteRecordedAudio(buttonKey: string): Promise<void> {
  const db = await openDB()

  const existingUrl = objectUrlCache.get(buttonKey)
  if (existingUrl) {
    URL.revokeObjectURL(existingUrl)
    objectUrlCache.delete(buttonKey)
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(buttonKey)

    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function getAllRecordedAudioKeys(): Promise<string[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAllKeys()

      req.onsuccess = () => {
        resolve((req.result as string[]) || [])
      }
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}
