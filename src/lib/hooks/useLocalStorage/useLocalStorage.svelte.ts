import { useEventListener } from '../useEventListener/index.js'
import { toGetter } from '../utils.js'

export interface UseLocalStorageSerializer<T> {
    parse: (raw: string) => T
    stringify: (value: T) => string
}

/** A storage key, or `null`/`undefined` to turn persistence off. */
export type StorageKey = string | null | undefined

export interface UseLocalStorageOptions<T> {
    /**
     * Custom serializer. Defaults to JSON.
     */
    serializer?: UseLocalStorageSerializer<T>

    /**
     * Update the value when another tab changes the same key (via the `storage` event).
     * @default true
     */
    syncTabs?: boolean

    /**
     * Which store to write to. `session` keeps the value for the life of the tab.
     * @default 'local'
     */
    storage?: 'local' | 'session'
}

export interface UseLocalStorageReturn<T> {
    /** The persisted value. Read it, or assign to write through to storage. */
    current: T

    /** Whether a key is active. `false` while the key is `null` or `undefined`. */
    readonly enabled: boolean

    /** Delete the stored entry and fall back to `initial` without writing it back. */
    remove: () => void
}

const jsonSerializer = {
    parse: (raw: string) => JSON.parse(raw) as unknown,
    stringify: (value: unknown) => JSON.stringify(value)
}

function getStore(kind: 'local' | 'session'): Storage | null {
    try {
        return kind === 'session' ? sessionStorage : localStorage
    } catch {
        return null
    }
}

/**
 * Reactive storage-backed value with cross-tab sync.
 *
 * Reads the stored value on mount (falling back to `initial`), writes through
 * whenever `.current` changes, and — when `syncTabs` is on — updates when another
 * tab changes the same key.
 *
 * The key may be a getter, so it can follow a route, a document id or a user. A
 * `null` or `undefined` key makes the hook inert: nothing is read or written and
 * `.current` behaves as ordinary state, which is what a component wants when
 * persistence is opt-in. SSR-safe: renders `initial` on the server and hydrates on
 * mount; parse, write and quota errors are tolerated.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLocalStorage } from 'sv5ui'
 *
 *   let { storageKey }: { storageKey?: string } = $props()
 *
 *   const theme = useLocalStorage('theme', 'system')
 *   const layout = useLocalStorage(() => storageKey, [50, 50])
 * </script>
 *
 * <button onclick={() => (theme.current = 'dark')}>{theme.current}</button>
 * <button onclick={theme.remove}>Reset</button>
 * ```
 */
export function useLocalStorage<T>(
    key: StorageKey | (() => StorageKey),
    initial: T,
    options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
    const serializer = options.serializer ?? (jsonSerializer as UseLocalStorageSerializer<T>)
    const { syncTabs = true, storage = 'local' } = options
    const resolveKey = toGetter(key)

    let value = $state<T>(initial)
    let suppressWrite = false

    const activeKey = $derived(resolveKey() ?? null)

    $effect(() => {
        const current = activeKey
        if (current === null) return

        const store = getStore(storage)
        const raw = store?.getItem(current) ?? null

        if (raw === null) {
            value = initial
            return
        }

        try {
            value = serializer.parse(raw)
        } catch {
            value = initial
        }
    })

    $effect(() => {
        const current = activeKey
        const next = value

        if (current === null) return
        if (suppressWrite) {
            suppressWrite = false
            return
        }

        try {
            const store = getStore(storage)
            const serialized = serializer.stringify(next)
            if (store && store.getItem(current) !== serialized) store.setItem(current, serialized)
        } catch {
            return
        }
    })

    useEventListener(
        () => (syncTabs ? window : null),
        'storage',
        (event) => {
            const current = activeKey
            if (current === null || event.key !== current) return
            if (event.storageArea !== getStore(storage)) return

            if (event.newValue === null) {
                value = initial
                return
            }

            try {
                value = serializer.parse(event.newValue)
            } catch {
                return
            }
        }
    )

    return {
        get current() {
            return value
        },
        set current(next: T) {
            suppressWrite = false
            value = next
        },
        get enabled() {
            return activeKey !== null
        },
        remove() {
            const current = activeKey

            if (current !== null) {
                try {
                    getStore(storage)?.removeItem(current)
                } catch {
                    // ignore storage errors
                }
            }

            suppressWrite = true
            value = initial
        }
    }
}

/**
 * The same hook backed by `sessionStorage`, so the value lives for the life of the
 * tab instead of persisting across sessions.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useSessionStorage } from 'sv5ui'
 *
 *   const draft = useSessionStorage('checkout-draft', { step: 1 })
 * </script>
 * ```
 */
export function useSessionStorage<T>(
    key: StorageKey | (() => StorageKey),
    initial: T,
    options: Omit<UseLocalStorageOptions<T>, 'storage'> = {}
): UseLocalStorageReturn<T> {
    return useLocalStorage(key, initial, { ...options, storage: 'session' })
}
