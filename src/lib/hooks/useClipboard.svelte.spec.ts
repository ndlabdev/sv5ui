import { flushSync } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useClipboard } from './useClipboard.svelte.js'

describe('useClipboard', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should default copied to false', () => {
        let api: ReturnType<typeof useClipboard>
        const cleanup = $effect.root(() => {
            api = useClipboard()
        })
        expect(api!.copied).toBe(false)
        cleanup()
    })

    it('should set copied to true after a successful copy', async () => {
        const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
        let api: ReturnType<typeof useClipboard>
        const cleanup = $effect.root(() => {
            api = useClipboard({ timeout: 30 })
        })
        flushSync()

        await api!.copy('hello')
        flushSync()
        expect(spy).toHaveBeenCalledWith('hello')
        expect(api!.copied).toBe(true)
        cleanup()
    })

    it('should reset copied to false after the timeout', async () => {
        vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
        let api: ReturnType<typeof useClipboard>
        const cleanup = $effect.root(() => {
            api = useClipboard({ timeout: 30 })
        })
        flushSync()

        await api!.copy('hello')
        flushSync()
        expect(api!.copied).toBe(true)

        await vi.waitFor(() => {
            flushSync()
            expect(api!.copied).toBe(false)
        })
        cleanup()
    })

    it('should keep copied false when writeText rejects', async () => {
        vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
        let api: ReturnType<typeof useClipboard>
        const cleanup = $effect.root(() => {
            api = useClipboard({ timeout: 30 })
        })
        flushSync()

        await api!.copy('hello')
        flushSync()
        expect(api!.copied).toBe(false)
        cleanup()
    })

    it('should be a safe no-op when navigator.clipboard is missing', async () => {
        const original = navigator.clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true
        })

        let api: ReturnType<typeof useClipboard>
        const cleanup = $effect.root(() => {
            api = useClipboard()
        })

        await expect(api!.copy('hello')).resolves.toBeUndefined()
        expect(api!.copied).toBe(false)

        Object.defineProperty(navigator, 'clipboard', {
            value: original,
            configurable: true
        })
        cleanup()
    })
})
