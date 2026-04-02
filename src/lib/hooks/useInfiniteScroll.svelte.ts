import type { Action } from 'svelte/action'

export interface UseInfiniteScrollOptions {
    /**
     * Callback fired when the user scrolls near the bottom.
     * Return a promise to automatically manage the loading state.
     */
    onLoad: () => void | Promise<void>

    /**
     * Distance in pixels from the bottom to trigger loading.
     * @default 100
     */
    threshold?: number

    /**
     * Whether the hook is active. Set to `false` when all data is loaded.
     * Supports getter function for reactive control.
     * @default true
     */
    enabled?: boolean | (() => boolean)
}

export interface UseInfiniteScrollReturn {
    /** Whether an async onLoad is currently in progress */
    readonly loading: boolean
}

/**
 * Reactive infinite scroll hook with Svelte action.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useInfiniteScroll } from 'sv5ui'
 *
 *   let items = $state([...])
 *   let hasMore = $state(true)
 *
 *   const scroll = useInfiniteScroll({
 *     onLoad: async () => {
 *       const next = await fetchMore()
 *       items.push(...next)
 *       if (next.length === 0) hasMore = false
 *     },
 *     enabled: () => hasMore
 *   })
 * </script>
 *
 * <div use:scroll.action>
 *   {#each items as item (item.id)}
 *     <div>{item.name}</div>
 *   {/each}
 *   {#if scroll.loading}
 *     <Spinner />
 *   {/if}
 * </div>
 * ```
 */
export function useInfiniteScroll(
    options: UseInfiniteScrollOptions
): UseInfiniteScrollReturn & { action: Action<HTMLElement> } {
    const { onLoad, threshold = 100 } = options

    let loading = $state(false)

    function getEnabled(): boolean {
        return typeof options.enabled === 'function' ? options.enabled() : (options.enabled ?? true)
    }

    async function check(el: HTMLElement) {
        if (loading || !getEnabled()) return

        const { scrollTop, scrollHeight, clientHeight } = el
        if (scrollHeight - scrollTop - clientHeight > threshold) return

        loading = true
        try {
            await onLoad()
        } finally {
            loading = false
        }
    }

    const action: Action<HTMLElement> = (node) => {
        function handleScroll() {
            check(node)
        }

        node.addEventListener('scroll', handleScroll, { passive: true })

        return {
            destroy() {
                node.removeEventListener('scroll', handleScroll)
            }
        }
    }

    return {
        get loading() {
            return loading
        },
        action
    }
}
