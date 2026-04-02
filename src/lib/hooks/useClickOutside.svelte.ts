import type { Action } from 'svelte/action'

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

    function handlePointerDown(event: PointerEvent) {
        if (currentOptions.enabled === false) return
        if (!node.contains(event.target as Node)) {
            currentOptions.handler(event)
        }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)

    return {
        update(newOptions) {
            currentOptions = newOptions
        },
        destroy() {
            document.removeEventListener('pointerdown', handlePointerDown, true)
        }
    }
}
