import { useEventListener } from '../useEventListener/index.js'

export interface UseLocalStorageSerializer<T> {
    parse: (raw: string) => T
    stringify: (value: T) => string
}

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
}

export interface UseLocalStorageReturn<T> {
    /** The persisted value. Read it, or assign to write through to `localStorage`. */
    current: T
}

const jsonSerializer = {
    parse: (raw: string) => JSON.parse(raw) as unknown,
    stringify: (value: unknown) => JSON.stringify(value)
}

/**
 * Reactive `localStorage`-backed value with cross-tab sync.
 *
 * Reads the stored value on mount (falling back to `initial`), writes through to
 * `localStorage` whenever `.current` changes, and — when `syncTabs` is on — updates
 * when another tab changes the same key. SSR-safe: renders `initial` on the server
 * and hydrates on mount; parse/quota errors are tolerated.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLocalStorage } from 'sv5ui'
 *
 *   const theme = useLocalStorage('theme', 'system')
 * </script>
 *
 * <button onclick={() => (theme.current = 'dark')}>{theme.current}</button>
 * ```
 */
export function useLocalStorage<T>(
    key: string,
    initial: T,
    options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
    const serializer = options.serializer ?? (jsonSerializer as UseLocalStorageSerializer<T>)
    const { syncTabs = true } = options

    let value = $state<T>(initial)

    $effect(() => {
        const raw = localStorage.getItem(key)
        if (raw !== null) {
            try {
                value = serializer.parse(raw)
            } catch {
                value = initial
            }
        }
    })

    $effect(() => {
        try {
            const serialized = serializer.stringify(value)
            if (localStorage.getItem(key) !== serialized) {
                localStorage.setItem(key, serialized)
            }
        } catch {
            // ignore serialization / quota errors
        }
    })

    useEventListener(
        () => (syncTabs ? window : null),
        'storage',
        (event) => {
            if (event.key !== key || event.storageArea !== localStorage) return
            if (event.newValue === null) {
                value = initial
                return
            }
            try {
                value = serializer.parse(event.newValue)
            } catch {
                // ignore malformed external writes
            }
        }
    )

    return {
        get current() {
            return value
        },
        set current(next: T) {
            value = next
        }
    }
}
