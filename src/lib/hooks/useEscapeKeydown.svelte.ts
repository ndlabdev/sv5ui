import type { Action } from 'svelte/action'

export interface UseEscapeKeydownOptions {
    /**
     * Callback fired when Escape is pressed.
     */
    handler: (event: KeyboardEvent) => void

    /**
     * Whether the listener is active.
     * @default true
     */
    enabled?: boolean
}

/**
 * Svelte action that listens for Escape keydown on an element or the document.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useEscapeKeydown } from 'sv5ui'
 *
 *   let open = $state(true)
 * </script>
 *
 * {#if open}
 *   <div use:useEscapeKeydown={{ handler: () => (open = false) }}>
 *     Press Escape to close
 *   </div>
 * {/if}
 * ```
 */
export const useEscapeKeydown: Action<HTMLElement, UseEscapeKeydownOptions> = (node, options) => {
    let currentOptions = options

    function handleKeydown(event: KeyboardEvent) {
        if (currentOptions.enabled === false) return
        if (event.key === 'Escape') {
            currentOptions.handler(event)
        }
    }

    document.addEventListener('keydown', handleKeydown)

    return {
        update(newOptions) {
            currentOptions = newOptions
        },
        destroy() {
            document.removeEventListener('keydown', handleKeydown)
        }
    }
}
