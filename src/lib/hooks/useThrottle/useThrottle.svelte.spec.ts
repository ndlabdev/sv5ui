import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useThrottle } from './useThrottle.svelte.js'

describe('useThrottle', () => {
    it('should default pending to false', () => {
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 20 })
        })
        expect(api!.pending).toBe(false)
        cleanup()
    })

    it('should run the callback immediately on the leading edge', () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        flushSync()
        expect(cb).toHaveBeenCalledTimes(1)
        expect(api!.pending).toBe(false)
        cleanup()
    })

    it('should coalesce calls within the window into one trailing call', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        api!.run(cb)
        api!.run(cb)
        flushSync()
        expect(cb).toHaveBeenCalledTimes(1)
        expect(api!.pending).toBe(true)

        await vi.waitFor(() => {
            flushSync()
            expect(cb).toHaveBeenCalledTimes(2)
        })
        flushSync()
        expect(api!.pending).toBe(false)
        cleanup()
    })

    it('should use the latest callback for the trailing call', async () => {
        const leading = vi.fn()
        const stale = vi.fn()
        const latest = vi.fn()
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 30 })
        })
        flushSync()

        api!.run(leading)
        api!.run(stale)
        api!.run(latest)

        await vi.waitFor(() => {
            expect(latest).toHaveBeenCalledTimes(1)
        })
        expect(leading).toHaveBeenCalledTimes(1)
        expect(stale).not.toHaveBeenCalled()
        cleanup()
    })

    it('should clear pending and prevent the trailing call on cancel', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        api!.run(cb)
        flushSync()
        expect(api!.pending).toBe(true)

        api!.cancel()
        flushSync()
        expect(api!.pending).toBe(false)

        await new Promise((resolve) => setTimeout(resolve, 60))
        expect(cb).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('should clear the pending timer on teardown (no leak)', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useThrottle>
        const cleanup = $effect.root(() => {
            api = useThrottle({ delay: 30 })
        })
        flushSync()

        api!.run(cb)
        api!.run(cb)
        cleanup()

        await new Promise((resolve) => setTimeout(resolve, 60))
        expect(cb).toHaveBeenCalledTimes(1)
    })
})
