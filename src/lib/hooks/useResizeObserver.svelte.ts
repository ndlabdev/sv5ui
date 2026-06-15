type ElementTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined)

/**
 * Observe an element's size changes with a `ResizeObserver` and automatic cleanup.
 *
 * The target may be a value or a getter; when it is a getter that reads reactive
 * state, the observer re-attaches as the target changes. SSR-safe: a nullish
 * target is a no-op.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useResizeObserver } from 'sv5ui'
 *
 *   let el = $state<HTMLElement>()
 *   useResizeObserver(() => el, ([entry]) => {
 *     console.log(entry.contentRect.width)
 *   })
 * </script>
 *
 * <div bind:this={el}>resize me</div>
 * ```
 */
export function useResizeObserver(
    target: ElementTarget,
    callback: ResizeObserverCallback,
    options?: ResizeObserverOptions
): void {
    const resolveTarget = typeof target === 'function' ? target : () => target

    $effect(() => {
        const el = resolveTarget()
        if (!el) return

        const observer = new ResizeObserver(callback)
        observer.observe(el, options)

        return () => observer.disconnect()
    })
}

export interface UseElementSizeReturn {
    /** Current content-box width in pixels. */
    readonly width: number
    /** Current content-box height in pixels. */
    readonly height: number
}

/**
 * Track an element's content-box size reactively.
 *
 * Built on `useResizeObserver`. The size starts at `0` and updates on the
 * observer's initial callback and on every subsequent resize. SSR-safe.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useElementSize } from 'sv5ui'
 *
 *   let el = $state<HTMLElement>()
 *   const size = useElementSize(() => el)
 * </script>
 *
 * <div bind:this={el}>...</div>
 * <p>{size.width} × {size.height}</p>
 * ```
 */
export function useElementSize(target: ElementTarget): UseElementSizeReturn {
    let width = $state(0)
    let height = $state(0)

    useResizeObserver(target, (entries) => {
        const entry = entries[0]
        if (!entry) return
        width = entry.contentRect.width
        height = entry.contentRect.height
    })

    return {
        get width() {
            return width
        },
        get height() {
            return height
        }
    }
}
