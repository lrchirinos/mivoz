/**
 * Piper TTS Web Neural Speech Engine (WASM + ONNX Runtime)
 * Uses the Mexican Spanish Male model: es_MX-ald-medium.
 * Synthesized audio blobs are stored in IndexedDB for instant 0ms subsequent playback.
 */

import { TtsSession } from '@mintplex-labs/piper-tts-web'

const DB_NAME = 'mivoz_piper_cache'
const DB_VERSION = 1
const STORE_NAME = 'synthesized_phrases'

let activeTtsSession: TtsSession | null = null
let sessionInitPromise: Promise<TtsSession> | null = null
const inMemoryAudioUrlCache = new Map<string, string>()

function openCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no disponible'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'textKey' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function normalizeTextKey(text: string): string {
  return text.trim().toLowerCase().replace(/[¿?¡!.,]/g, '')
}

async function getCachedSynthesizedAudio(textKey: string): Promise<string | null> {
  if (inMemoryAudioUrlCache.has(textKey)) {
    return inMemoryAudioUrlCache.get(textKey)!
  }

  try {
    const db = await openCacheDB()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(textKey)
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const url = URL.createObjectURL(req.result.blob)
          inMemoryAudioUrlCache.set(textKey, url)
          resolve(url)
        } else {
          resolve(null)
        }
      }
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

async function saveSynthesizedAudio(textKey: string, blob: Blob): Promise<string> {
  const url = URL.createObjectURL(blob)
  inMemoryAudioUrlCache.set(textKey, url)

  try {
    const db = await openCacheDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ textKey, blob, createdAt: Date.now() })
  } catch {
    // Memory cache still works
  }

  return url
}

/**
 * Seeds browser OPFS directory with the bundled local Piper model from /piper/
 * so synthesis can occur 100% offline without hitting HuggingFace.
 */
export async function seedLocalPiperModelToOPFS(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return false

  try {
    const root = await navigator.storage.getDirectory()
    const dir = await root.getDirectoryHandle('piper', { create: true })

    // Check if onnx is already present in OPFS
    try {
      const fileHandle = await dir.getFileHandle('es_MX-ald-medium.onnx')
      const file = await fileHandle.getFile()
      if (file.size > 1000000) {
        return true
      }
    } catch {
      // File not present, proceed to seed
    }

    const base = import.meta.env.BASE_URL ? (import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`) : '/'

    // Copy JSON config
    const jsonRes = await fetch(`${base}piper/es_MX-ald-medium.onnx.json`)
    if (jsonRes.ok) {
      const jsonBlob = await jsonRes.blob()
      const jsonFile = await dir.getFileHandle('es_MX-ald-medium.onnx.json', { create: true })
      const writer = await jsonFile.createWritable()
      await writer.write(jsonBlob)
      await writer.close()
    }

    // Copy ONNX weights
    const onnxRes = await fetch(`${base}piper/es_MX-ald-medium.onnx`)
    if (onnxRes.ok) {
      const onnxBlob = await onnxRes.blob()
      const onnxFile = await dir.getFileHandle('es_MX-ald-medium.onnx', { create: true })
      const writer = await onnxFile.createWritable()
      await writer.write(onnxBlob)
      await writer.close()
    }

    return true
  } catch (err) {
    console.warn('OPFS local Piper seeding note:', err)
    return false
  }
}

/**
 * Initializes or returns the cached Piper TTS WASM Session
 */
async function getTtsSession(): Promise<TtsSession> {
  if (activeTtsSession) return activeTtsSession

  if (sessionInitPromise) return sessionInitPromise

  sessionInitPromise = (async () => {
    // Attempt local OPFS seeding first
    await seedLocalPiperModelToOPFS().catch(() => {})

    const session = await TtsSession.create({
      voiceId: 'es_MX-ald-medium',
    })
    activeTtsSession = session
    return session
  })()

  return sessionInitPromise
}

/**
 * Synthesizes speech using local Piper TTS (Male Spanish es_MX-ald-medium)
 * Returns Audio Object URL.
 */
export async function synthesizePiperMaleVoice(text: string): Promise<string> {
  const key = normalizeTextKey(text)

  // 1. Check cache first for 0ms latency
  const cachedUrl = await getCachedSynthesizedAudio(key)
  if (cachedUrl) return cachedUrl

  // 2. Synthesize using Piper Neural WASM
  const session = await getTtsSession()
  const audioBlob = await session.predict(text)

  // 3. Save to IndexedDB cache & return
  return await saveSynthesizedAudio(key, audioBlob)
}
