import { toGetter } from '../utils.js'

type MaybeGetter<T> = T | (() => T)

export interface UseIntervalOptions {
    /**
     * Whether the interval is paused. Accepts a value or a reactive getter.
     * @default false
     */
    paused?: boolean | (() => boolean)
}

interface UseIntervalReturn {
    /** Pause ticking. */
    pause(): void
    /** Resume ticking. */
    resume(): void
    /** Whether the interval is currently ticking. */
    readonly active: boolean
}

interface UseTimeoutReturn {
    /** Cancel the pending timeout, then schedule a fresh one. */
    restart(): void
    /** Cancel the pending timeout. */
    cancel(): void
}

/**
 * Run a callback on an interval with proper runes teardown.
 *
 * The delay may be a value or a getter; changing it restarts the interval with
 * the new period. A `null`/`undefined` or non-positive delay disables it, as
 * does `pause()` or the `paused` option. SSR-safe: no timer runs on the server.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useInterval } from 'sv5ui'
 *
 *   let count = $state(0)
 *   const timer = useInterval(() => count++, 1000)
 * </script>
 *
 * <button onclick={timer.pause}>Pause</button>
 * ```
 */
export function useInterval(
    callback: () => void,
    delay: MaybeGetter<number | null | undefined>,
    options: UseIntervalOptions = {}
): UseIntervalReturn {
    const resolveDelay = toGetter(delay)
    const resolvePaused = toGetter(options.paused ?? false)
    let manuallyPaused = $state(false)

    const active = $derived.by(() => {
        if (manuallyPaused || resolvePaused()) return false
        const ms = resolveDelay()
        return typeof ms === 'number' && ms > 0
    })

    $effect(() => {
        if (!active) return
        const ms = resolveDelay()
        if (typeof ms !== 'number' || ms <= 0) return
        const id = setInterval(callback, ms)
        return () => clearInterval(id)
    })

    return {
        pause() {
            manuallyPaused = true
        },
        resume() {
            manuallyPaused = false
        },
        get active() {
            return active
        }
    }
}

/**
 * Schedule a callback to run once after a delay, with proper runes teardown.
 *
 * Starts on mount. The delay may be a value or a getter; changing it restarts
 * the timer. A `null`/`undefined` or negative delay schedules nothing. SSR-safe:
 * no timer runs on the server.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTimeout } from 'sv5ui'
 *
 *   const timer = useTimeout(() => (visible = false), 3000)
 * </script>
 *
 * <button onclick={timer.restart}>Reset</button>
 * ```
 */
export function useTimeout(
    callback: () => void,
    delay: MaybeGetter<number | null | undefined>
): UseTimeoutReturn {
    const resolveDelay = toGetter(delay)
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let restartToken = $state(0)

    $effect(() => {
        void restartToken
        const ms = resolveDelay()
        if (typeof ms !== 'number' || ms < 0) return
        timeoutId = setTimeout(callback, ms)
        return () => clearTimeout(timeoutId)
    })

    return {
        restart() {
            restartToken++
        },
        cancel() {
            clearTimeout(timeoutId)
        }
    }
}
