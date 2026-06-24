export interface UseThrottleOptions {
    /**
     * Minimum time in milliseconds between invocations.
     * @default 200
     */
    delay?: number
}

/**
 * Reactive throttle hook. Caps how often a callback runs to at most once per
 * `delay`, with leading and trailing invocation.
 *
 * The companion to `useDebounce`: debounce waits for a pause, throttle
 * guarantees a steady maximum rate — ideal for scroll, resize, mousemove, and
 * drag handlers. The first call runs immediately; calls during the cooldown
 * window are coalesced into a single trailing call (latest wins). Any pending
 * timer is cleared on teardown.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useThrottle } from 'sv5ui'
 *
 *   const throttle = useThrottle({ delay: 100 })
 *
 *   function onScroll() {
 *     throttle.run(() => updatePosition(window.scrollY))
 *   }
 * </script>
 *
 * <svelte:window onscroll={onScroll} />
 * ```
 */
export function useThrottle(options: UseThrottleOptions = {}) {
    const { delay = 200 } = options

    let pending = $state(false)
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let trailing: (() => void) | undefined

    function start() {
        timeoutId = setTimeout(() => {
            if (trailing) {
                const callback = trailing
                trailing = undefined
                pending = false
                callback()
                start()
            } else {
                timeoutId = undefined
                pending = false
            }
        }, delay)
    }

    function run(callback: () => void) {
        if (timeoutId === undefined) {
            callback()
            start()
        } else {
            trailing = callback
            pending = true
        }
    }

    function cancel() {
        clearTimeout(timeoutId)
        timeoutId = undefined
        trailing = undefined
        pending = false
    }

    $effect(() => {
        return () => clearTimeout(timeoutId)
    })

    return {
        get pending() {
            return pending
        },
        run,
        cancel
    }
}
