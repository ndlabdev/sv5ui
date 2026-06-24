export interface UseDebounceOptions {
    /**
     * Delay in milliseconds before the callback is executed.
     * @default 300
     */
    delay?: number
}

/**
 * Reactive debounce hook. Delays execution until a pause in calls.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDebounce } from 'sv5ui'
 *
 *   const debounce = useDebounce({ delay: 500 })
 *   let query = $state('')
 *
 *   function handleInput(e: Event) {
 *     query = e.currentTarget.value
 *     debounce.run(() => fetchResults(query))
 *   }
 * </script>
 *
 * <input oninput={handleInput} />
 * {#if debounce.pending}
 *   <Spinner />
 * {/if}
 * ```
 */
export function useDebounce(options: UseDebounceOptions = {}) {
    const { delay = 300 } = options

    let pending = $state(false)
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    function run(callback: () => void) {
        pending = true
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            pending = false
            callback()
        }, delay)
    }

    function cancel() {
        clearTimeout(timeoutId)
        pending = false
    }

    function flush(callback: () => void) {
        clearTimeout(timeoutId)
        pending = false
        callback()
    }

    $effect(() => {
        return () => clearTimeout(timeoutId)
    })

    return {
        get pending() {
            return pending
        },
        run,
        cancel,
        flush
    }
}
