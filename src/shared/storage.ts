// shared/storage.ts — the "don't throw if storage is unavailable" wrapper only
// (NFR-7 / NFR-S4). Schemas, keys and validation stay mode-specific.

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Private browsing throws on access; callers then run stateless.
export function safeStorage(): StorageLike | null {
  try {
    const s = window.localStorage;
    const probe = '__cupofiq_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

// Returns the parsed JSON, or null when storage is absent, the key is missing,
// or the payload is corrupt. Validation is the caller's job.
export function readJson(storage: StorageLike | null, key: string): unknown {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Silent no-op when storage is absent or vanishes mid-session.
export function writeJson(storage: StorageLike | null, key: string, value: unknown): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage vanished mid-session — run stateless.
  }
}
