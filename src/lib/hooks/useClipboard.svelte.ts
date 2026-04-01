export interface UseClipboardOptions {
    /**
     * Duration in milliseconds before `copied` resets to `false`.
     * @default 2000
     */
    timeout?: number
}

export interface UseClipboardReturn {
    /** Whether text was recently copied (resets after timeout) */
    readonly copied: boolean

    /** Copy text to clipboard */
    copy: (text: string) => Promise<void>
}

/**
 * Reactive clipboard hook. Copies text and tracks copied state.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useClipboard } from 'sv5ui'
 *
 *   const clipboard = useClipboard()
 * </script>
 *
 * <Button onclick={() => clipboard.copy('Hello!')}>
 *   {clipboard.copied ? 'Copied!' : 'Copy'}
 * </Button>
 * ```
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
    const { timeout = 2000 } = options

    let copied = $state(false)
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    async function copy(text: string): Promise<void> {
        if (typeof navigator === 'undefined' || !navigator.clipboard) return

        try {
            await navigator.clipboard.writeText(text)

            copied = true
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                copied = false
            }, timeout)
        } catch {
            copied = false
        }
    }

    $effect(() => {
        return () => clearTimeout(timeoutId)
    })

    return {
        get copied() {
            return copied
        },
        copy
    }
}
