type ElementTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined)

interface LockState {
    count: number
    overflow: string
    paddingRight: string
}

const registry = new WeakMap<HTMLElement, LockState>()

function scrollbarWidth(el: HTMLElement): number {
    if (el === document.body || el === document.documentElement) {
        return window.innerWidth - document.documentElement.clientWidth
    }
    return el.offsetWidth - el.clientWidth
}

function acquire(el: HTMLElement): void {
    let state = registry.get(el)
    if (!state) {
        state = { count: 0, overflow: el.style.overflow, paddingRight: el.style.paddingRight }
        registry.set(el, state)
    }
    if (state.count === 0) {
        const gap = scrollbarWidth(el)
        el.style.overflow = 'hidden'
        if (gap > 0) {
            const current = parseFloat(getComputedStyle(el).paddingRight) || 0
            el.style.paddingRight = `${current + gap}px`
        }
    }
    state.count++
}

function release(el: HTMLElement): void {
    const state = registry.get(el)
    if (!state) return
    state.count--
    if (state.count <= 0) {
        el.style.overflow = state.overflow
        el.style.paddingRight = state.paddingRight
        registry.delete(el)
    }
}

export interface UseScrollLockReturn {
    /** Lock the target scroll imperatively (overrides the reactive `locked` source). */
    lock: () => void
    /** Unlock the target scroll imperatively (overrides the reactive `locked` source). */
    unlock: () => void
}

/**
 * Lock scroll on an element (default `document.body`) while `locked` is true.
 *
 * Sets `overflow: hidden` and compensates for the scrollbar width to avoid a
 * layout jump. Reference-counted per target, so nested overlays locking the same
 * element do not unlock it prematurely. Original styles are restored when the
 * last lock releases or on teardown. SSR-safe: a nullish target is a no-op.
 *
 * Pass a reactive `() => open` getter for the common case, or use the returned
 * `lock` / `unlock` for imperative control (do not mix both on one instance).
 *
 * @example
 * ```svelte
 * <script>
 *   import { useScrollLock } from 'sv5ui'
 *
 *   let open = $state(false)
 *   useScrollLock(() => open)
 * </script>
 * ```
 */
export function useScrollLock(
    locked: boolean | (() => boolean),
    target?: ElementTarget
): UseScrollLockReturn {
    const resolveLocked = typeof locked === 'function' ? locked : () => locked
    const resolveTarget = typeof target === 'function' ? target : () => target ?? document.body

    let manual = $state<boolean | null>(null)
    const isLocked = $derived(manual ?? resolveLocked())

    $effect(() => {
        if (!isLocked) return
        const el = resolveTarget()
        if (!el) return

        acquire(el)
        return () => release(el)
    })

    return {
        lock() {
            manual = true
        },
        unlock() {
            manual = false
        }
    }
}
