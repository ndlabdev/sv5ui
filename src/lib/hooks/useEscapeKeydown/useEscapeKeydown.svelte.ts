import type { Action } from 'svelte/action'
import { useEventListener } from '../useEventListener/index.js'

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
export const useEscapeKeydown: Action<HTMLElement, UseEscapeKeydownOptions> = (
    _node,
    initialOptions
) => {
    let currentOptions = initialOptions!

    useEventListener(
        () => document,
        'keydown',
        (event) => {
            if (currentOptions.enabled === false) return
            if (event.key === 'Escape') {
                currentOptions.handler(event)
            }
        }
    )

    return {
        update(newOptions) {
            currentOptions = newOptions
        }
    }
}
