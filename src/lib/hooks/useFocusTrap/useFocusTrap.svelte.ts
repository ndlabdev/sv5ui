import { toGetter } from '../utils.js'
import { useEventListener } from '../useEventListener/index.js'

type ElementTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined)

export interface UseFocusTrapOptions {
    /**
     * Whether the trap is active. Accepts a value or a reactive getter.
     * @default true
     */
    active?: boolean | (() => boolean)

    /**
     * Element to focus when the trap activates. A getter is resolved on activate.
     * Pass `false` to skip auto-focus. Defaults to the first focusable element.
     */
    initialFocus?: HTMLElement | (() => HTMLElement | null) | false

    /**
     * Restore focus to the previously focused element when the trap deactivates.
     * @default true
     */
    restoreFocus?: boolean
}

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
    'details > summary:first-of-type'
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    )
}

/**
 * Trap keyboard focus within an element while active, and restore focus on exit.
 *
 * Cycles Tab / Shift+Tab among the focusable descendants of `target`, focuses an
 * initial element on activation, and (by default) returns focus to the previously
 * focused element when it deactivates or unmounts. The target and `active` may be
 * values or reactive getters. SSR-safe: a nullish/inactive target is a no-op.
 *
 * Intended for custom focus-scoped UI. Components built on bits-ui primitives
 * (Modal, Slideover, Drawer, Popover) already trap focus — do not double-wrap them.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useFocusTrap } from 'sv5ui'
 *
 *   let open = $state(false)
 *   let panel = $state<HTMLElement>()
 *   useFocusTrap(() => panel, { active: () => open })
 * </script>
 * ```
 */
export function useFocusTrap(target: ElementTarget, options: UseFocusTrapOptions = {}): void {
    const resolveTarget = toGetter(target)
    const resolveActive = toGetter(options.active ?? true)
    const { initialFocus, restoreFocus = true } = options

    $effect(() => {
        if (!resolveActive()) return
        const resolved = resolveTarget()
        if (!resolved) return
        const el: HTMLElement = resolved

        const previouslyFocused = document.activeElement as HTMLElement | null

        if (initialFocus !== false) {
            const initial = typeof initialFocus === 'function' ? initialFocus() : initialFocus
            ;(initial ?? getFocusable(el)[0] ?? el).focus()
        }

        return () => {
            if (restoreFocus && previouslyFocused && document.contains(previouslyFocused)) {
                previouslyFocused.focus()
            }
        }
    })

    useEventListener(
        () => (resolveActive() && resolveTarget() ? document : null),
        'keydown',
        (event) => {
            if (event.key !== 'Tab') return
            const el = resolveTarget()
            if (!el) return

            const focusable = getFocusable(el)
            if (focusable.length === 0) {
                event.preventDefault()
                return
            }
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement

            if (event.shiftKey) {
                if (active === first || !el.contains(active)) {
                    event.preventDefault()
                    last.focus()
                }
            } else if (active === last || !el.contains(active)) {
                event.preventDefault()
                first.focus()
            }
        },
        true
    )
}
