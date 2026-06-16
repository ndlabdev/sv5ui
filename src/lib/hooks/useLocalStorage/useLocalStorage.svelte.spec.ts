import { flushSync } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage.svelte.js'

const KEY = 'sv5ui-test-key'

afterEach(() => {
    localStorage.clear()
})

describe('useLocalStorage', () => {
    it('returns the initial value when the key is absent', () => {
        let store: ReturnType<typeof useLocalStorage<string>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 'fallback')
        })
        flushSync()
        expect(store!.current).toBe('fallback')
        cleanup()
    })

    it('reads an existing stored value on mount', () => {
        localStorage.setItem(KEY, JSON.stringify({ count: 7 }))
        let store: ReturnType<typeof useLocalStorage<{ count: number }>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, { count: 0 })
        })
        flushSync()
        expect(store!.current).toEqual({ count: 7 })
        cleanup()
    })

    it('persists writes to localStorage', () => {
        let store: ReturnType<typeof useLocalStorage<number>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 1)
        })
        flushSync()
        store!.current = 42
        flushSync()
        expect(localStorage.getItem(KEY)).toBe('42')
        cleanup()
    })

    it('tolerates malformed stored JSON (falls back to initial)', () => {
        localStorage.setItem(KEY, '{not valid json')
        let store: ReturnType<typeof useLocalStorage<string>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 'safe')
        })
        expect(() => flushSync()).not.toThrow()
        expect(store!.current).toBe('safe')
        cleanup()
    })

    it('updates when another tab changes the key (syncTabs)', () => {
        let store: ReturnType<typeof useLocalStorage<string>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 'a')
        })
        flushSync()
        window.dispatchEvent(
            new StorageEvent('storage', {
                key: KEY,
                newValue: JSON.stringify('b'),
                storageArea: localStorage
            })
        )
        flushSync()
        expect(store!.current).toBe('b')
        cleanup()
    })

    it('resets to initial when the key is removed in another tab', () => {
        let store: ReturnType<typeof useLocalStorage<string>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 'init')
        })
        flushSync()
        store!.current = 'changed'
        flushSync()
        window.dispatchEvent(
            new StorageEvent('storage', { key: KEY, newValue: null, storageArea: localStorage })
        )
        flushSync()
        expect(store!.current).toBe('init')
        cleanup()
    })

    it('removes the storage listener on unmount with matching args (no leak)', () => {
        const addSpy = vi.spyOn(window, 'addEventListener')
        const removeSpy = vi.spyOn(window, 'removeEventListener')
        const cleanup = $effect.root(() => {
            useLocalStorage(KEY, 'x')
        })
        flushSync()
        const addCall = addSpy.mock.calls.find((c) => c[0] === 'storage')
        expect(addCall).toBeDefined()
        cleanup()
        const removeCall = removeSpy.mock.calls.find(
            (c) => c[0] === 'storage' && c[1] === addCall![1]
        )
        expect(removeCall).toBeDefined()
        addSpy.mockRestore()
        removeSpy.mockRestore()
    })

    it('does not add a storage listener when syncTabs is false', () => {
        const addSpy = vi.spyOn(window, 'addEventListener')
        const cleanup = $effect.root(() => {
            useLocalStorage(KEY, 'x', { syncTabs: false })
        })
        flushSync()
        expect(addSpy.mock.calls.some((c) => c[0] === 'storage')).toBe(false)
        addSpy.mockRestore()
        cleanup()
    })

    it('supports a custom serializer', () => {
        const serializer = {
            parse: (raw: string) => Number(raw),
            stringify: (value: number) => String(value)
        }
        let store: ReturnType<typeof useLocalStorage<number>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 0, { serializer })
        })
        flushSync()
        store!.current = 5
        flushSync()
        expect(localStorage.getItem(KEY)).toBe('5')
        cleanup()
    })

    it('does not write back to storage when synced from a storage event (no echo, objects)', () => {
        let store: ReturnType<typeof useLocalStorage<{ v: number }>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, { v: 0 })
        })
        flushSync()

        // Simulate another tab writing an object, then notifying via storage event.
        const next = JSON.stringify({ v: 1 })
        localStorage.setItem(KEY, next)
        const setSpy = vi.spyOn(Storage.prototype, 'setItem')
        window.dispatchEvent(
            new StorageEvent('storage', { key: KEY, newValue: next, storageArea: localStorage })
        )
        flushSync()

        expect(store!.current).toEqual({ v: 1 })
        // The write effect must NOT re-persist (value already matches storage) — else tabs echo.
        expect(setSpy.mock.calls.some((c) => c[0] === KEY)).toBe(false)
        setSpy.mockRestore()
        cleanup()
    })

    it('does not rewrite storage when set to an equal value', () => {
        localStorage.setItem(KEY, JSON.stringify('same'))
        let store: ReturnType<typeof useLocalStorage<string>>
        const cleanup = $effect.root(() => {
            store = useLocalStorage(KEY, 'init')
        })
        flushSync()
        const setSpy = vi.spyOn(Storage.prototype, 'setItem')
        store!.current = 'same'
        flushSync()
        expect(setSpy.mock.calls.some((c) => c[0] === KEY)).toBe(false)
        setSpy.mockRestore()
        cleanup()
    })
})
