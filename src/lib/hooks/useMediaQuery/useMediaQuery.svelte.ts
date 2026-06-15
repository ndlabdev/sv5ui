import { toGetter } from '../utils.js'

export interface UseMediaQueryOptions {
    /**
     * Initial value before the media query is evaluated (SSR-safe).
     * @default false
     */
    initialValue?: boolean
}

interface UseMediaQueryReturn {
    /** Whether the media query currently matches */
    readonly matches: boolean
}

/**
 * Reactive media query hook. Tracks whether a CSS media query matches.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useMediaQuery } from 'sv5ui'
 *
 *   const isMobile = useMediaQuery('(max-width: 640px)')
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 * </script>
 *
 * {#if isMobile.matches}
 *   <MobileLayout />
 * {:else}
 *   <DesktopLayout />
 * {/if}
 * ```
 */
export function useMediaQuery(
    query: string | (() => string),
    options: UseMediaQueryOptions = {}
): UseMediaQueryReturn {
    const { initialValue = false } = options
    const resolveQuery = toGetter(query)

    let matches = $state(initialValue)

    $effect(() => {
        const mediaQuery = window.matchMedia(resolveQuery())
        matches = mediaQuery.matches

        function handler(event: MediaQueryListEvent) {
            matches = event.matches
        }

        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    })

    return {
        get matches() {
            return matches
        }
    }
}
