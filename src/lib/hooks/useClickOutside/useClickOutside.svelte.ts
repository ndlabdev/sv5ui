import type { Action } from 'svelte/action'
import { useEventListener } from '../useEventListener/index.js'

export interface UseClickOutsideOptions {
    /**
     * Callback fired when a click occurs outside the element.
     */
    handler: (event: PointerEvent) => void

    /**
     * Whether the listener is active.
     * @default true
     */
    enabled?: boolean
}

/**
 * Svelte action that detects clicks outside an element.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useClickOutside } from 'sv5ui'
 *
 *   let open = $state(false)
 * </script>
 *
 * {#if open}
 *   <div use:useClickOutside={{ handler: () => (open = false) }}>
 *     Dropdown content
 *   </div>
 * {/if}
 * ```
 */
export const useClickOutside: Action<HTMLElement, UseClickOutsideOptions> = (
    node,
    initialOptions
) => {
    let currentOptions = initialOptions!

    useEventListener(
        () => document,
        'pointerdown',
        (event) => {
            if (currentOptions.enabled === false) return
            if (!node.contains(event.target as Node)) {
                currentOptions.handler(event)
            }
        },
        true
    )

    return {
        update(newOptions) {
            currentOptions = newOptions
        }
    }
}
