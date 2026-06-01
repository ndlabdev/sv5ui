import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce.svelte.js'

describe('useDebounce', () => {
    it('should default pending to false', () => {
        let api: ReturnType<typeof useDebounce>
        const cleanup = $effect.root(() => {
            api = useDebounce({ delay: 20 })
        })
        expect(api!.pending).toBe(false)
        cleanup()
    })

    it('should set pending true then run the callback and clear pending after delay', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useDebounce>
        const cleanup = $effect.root(() => {
            api = useDebounce({ delay: 20 })
        })
        flushSync()

        api!.run(cb)
        flushSync()
        expect(api!.pending).toBe(true)

        await vi.waitFor(() => {
            flushSync()
            expect(cb).toHaveBeenCalledTimes(1)
        })
        flushSync()
        expect(api!.pending).toBe(false)
        cleanup()
    })

    it('should debounce multiple calls into a single invocation', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useDebounce>
        const cleanup = $effect.root(() => {
            api = useDebounce({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        api!.run(cb)
        api!.run(cb)

        await vi.waitFor(() => {
            expect(cb).toHaveBeenCalledTimes(1)
        })
        cleanup()
    })

    it('should clear pending and prevent the callback on cancel', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useDebounce>
        const cleanup = $effect.root(() => {
            api = useDebounce({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        flushSync()
        expect(api!.pending).toBe(true)

        api!.cancel()
        flushSync()
        expect(api!.pending).toBe(false)

        await new Promise((resolve) => setTimeout(resolve, 60))
        expect(cb).not.toHaveBeenCalled()
        cleanup()
    })

    it('should run the callback immediately and clear pending on flush', () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useDebounce>
        const cleanup = $effect.root(() => {
            api = useDebounce({ delay: 1000 })
        })
        flushSync()

        api!.run(cb)
        flushSync()
        expect(api!.pending).toBe(true)

        api!.flush(cb)
        flushSync()
        expect(cb).toHaveBeenCalledTimes(1)
        expect(api!.pending).toBe(false)
        cleanup()
    })
})
