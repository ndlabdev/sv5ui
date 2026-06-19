import { useDebounce } from '../useDebounce/index.js'

interface UseDebouncedStateReturn<T> {
    /** The immediate value — read it or write it (bindable). */
    current: T
    /** The debounced value — settles `delay` ms after the last write. */
    readonly debounced: T
    /** Set both `current` and `debounced` now, cancelling any pending update. */
    setImmediate(value: T): void
}

/**
 * Reactive state whose `debounced` mirror lags behind `current` by `delay` ms.
 *
 * Combines a value with debouncing: write `current` (e.g. bound to an input)
 * and derive from `debounced` — no manual two-state + run wiring. Built on
 * `useDebounce`, so the pending timer is cleared on teardown. Use `setImmediate`
 * to skip the delay (e.g. on reset).
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDebouncedState } from 'sv5ui'
 *
 *   const search = useDebouncedState('', 200)
 *   const results = $derived(filter(items, search.debounced))
 * </script>
 *
 * <input bind:value={search.current} />
 * ```
 */
export function useDebouncedState<T>(initial: T, delay = 300): UseDebouncedStateReturn<T> {
    let current = $state(initial)
    let debounced = $state(initial)
    const debounce = useDebounce({ delay })

    return {
        get current() {
            return current
        },
        set current(value: T) {
            current = value
            debounce.run(() => {
                debounced = value
            })
        },
        get debounced() {
            return debounced
        },
        setImmediate(value: T) {
            debounce.cancel()
            current = value
            debounced = value
        }
    }
}
