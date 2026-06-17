import { toGetter } from '../utils.js'

type ElementTarget = Element | null | undefined | (() => Element | null | undefined)

export type UseIntersectionObserverOptions = IntersectionObserverInit

interface UseIntersectionObserverReturn {
    /** Whether the target currently intersects the root, per the latest entry. */
    readonly isIntersecting: boolean
}

/**
 * Observe an element's intersection with the viewport (or a root) via
 * `IntersectionObserver`, with automatic cleanup.
 *
 * The target may be a value or a getter; when it is a getter that reads reactive
 * state, the observer re-attaches as the target changes. SSR-safe: a nullish
 * target is a no-op.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useIntersectionObserver } from 'sv5ui'
 *
 *   let el = $state<HTMLElement>()
 *   const io = useIntersectionObserver(() => el, (entry) => {
 *     if (entry.isIntersecting) loadImage()
 *   }, { rootMargin: '200px' })
 * </script>
 *
 * <div bind:this={el}>{io.isIntersecting ? 'visible' : 'hidden'}</div>
 * ```
 */
export function useIntersectionObserver(
    target: ElementTarget,
    callback?: (entry: IntersectionObserverEntry) => void,
    options?: UseIntersectionObserverOptions
): UseIntersectionObserverReturn {
    const resolveTarget = toGetter(target)
    let isIntersecting = $state(false)

    $effect(() => {
        const el = resolveTarget()
        if (!el) return

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[entries.length - 1]
            if (!entry) return
            isIntersecting = entry.isIntersecting
            callback?.(entry)
        }, options)
        observer.observe(el)

        return () => observer.disconnect()
    })

    return {
        get isIntersecting() {
            return isIntersecting
        }
    }
}
