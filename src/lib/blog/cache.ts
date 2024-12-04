const CACHE_MAX_AGE = 3600 // 1 hour
const cache = new Map()

export function getCachedData<T>(key: string): T | null {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data
}

export function setCacheData<T>(key: string, data: T) {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_MAX_AGE * 1000
  })
}