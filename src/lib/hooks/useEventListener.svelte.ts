type MaybeGetter<T> = T | (() => T)

function toGetter<T>(value: MaybeGetter<T>): () => T {
    return typeof value === 'function' ? (value as () => T) : () => value
}

/**
 * Attach event listener(s) to a target with automatic cleanup.
 *
 * Binds inside an `$effect` and removes the listener(s) on teardown. The target
 * may be a value or a getter; when it is a getter that reads reactive state, the
 * listener re-binds as the target changes. SSR-safe: a nullish target is a no-op.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useEventListener } from 'sv5ui'
 *
 *   let el = $state<HTMLElement>()
 *
 *   // Window target (static)
 *   useEventListener(window, 'resize', () => console.log('resized'))
 *
 *   // Element target (reactive getter) + multiple event types
 *   useEventListener(() => el, ['pointerenter', 'focus'], () => console.log('active'))
 * </script>
 *
 * <div bind:this={el}>hover or focus me</div>
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
    target: MaybeGetter<Window | null | undefined>,
    type: K | K[],
    handler: (this: Window, event: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
): void
export function useEventListener<K extends keyof DocumentEventMap>(
    target: MaybeGetter<Document | null | undefined>,
    type: K | K[],
    handler: (this: Document, event: DocumentEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
): void
export function useEventListener<K extends keyof HTMLElementEventMap>(
    target: MaybeGetter<HTMLElement | null | undefined>,
    type: K | K[],
    handler: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
): void
export function useEventListener(
    target: MaybeGetter<EventTarget | null | undefined>,
    type: string | string[],
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
): void
export function useEventListener(
    target: MaybeGetter<EventTarget | null | undefined>,
    type: string | string[],
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
): void {
    const resolveTarget = toGetter(target)
    const types = Array.isArray(type) ? type : [type]

    $effect(() => {
        const el = resolveTarget()
        if (!el) return

        for (const t of types) el.addEventListener(t, handler, options)

        return () => {
            for (const t of types) el.removeEventListener(t, handler, options)
        }
    })
}
