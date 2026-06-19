import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useInterval, useTimeout } from './useTimers.svelte.js'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('useInterval', () => {
    it('ticks repeatedly', async () => {
        let count = 0
        const cleanup = $effect.root(() => {
            useInterval(() => count++, 20)
        })
        flushSync()

        await vi.waitFor(() => {
            expect(count).toBeGreaterThanOrEqual(2)
        })
        cleanup()
    })

    it('stops ticking on pause and resumes on resume', async () => {
        let count = 0
        let api: ReturnType<typeof useInterval>
        const cleanup = $effect.root(() => {
            api = useInterval(() => count++, 20)
        })
        flushSync()
        await vi.waitFor(() => expect(count).toBeGreaterThanOrEqual(1))

        api!.pause()
        flushSync()
        expect(api!.active).toBe(false)
        const snapshot = count
        await wait(60)
        expect(count).toBe(snapshot)

        api!.resume()
        flushSync()
        expect(api!.active).toBe(true)
        await vi.waitFor(() => expect(count).toBeGreaterThan(snapshot))
        cleanup()
    })

    it('respects the paused option getter', async () => {
        let count = 0
        let paused = $state(true)
        let api: ReturnType<typeof useInterval>
        const cleanup = $effect.root(() => {
            api = useInterval(() => count++, 20, { paused: () => paused })
        })
        flushSync()
        expect(api!.active).toBe(false)
        await wait(50)
        expect(count).toBe(0)

        paused = false
        flushSync()
        expect(api!.active).toBe(true)
        await vi.waitFor(() => expect(count).toBeGreaterThanOrEqual(1))
        cleanup()
    })

    it('is inactive for a null delay', async () => {
        let count = 0
        let api: ReturnType<typeof useInterval>
        const cleanup = $effect.root(() => {
            api = useInterval(() => count++, null)
        })
        flushSync()
        expect(api!.active).toBe(false)
        await wait(50)
        expect(count).toBe(0)
        cleanup()
    })

    it('clears the interval on teardown (no leak)', async () => {
        let count = 0
        const cleanup = $effect.root(() => {
            useInterval(() => count++, 20)
        })
        flushSync()
        await vi.waitFor(() => expect(count).toBeGreaterThanOrEqual(1))

        cleanup()
        const snapshot = count
        await wait(60)
        expect(count).toBe(snapshot)
    })
})

describe('useTimeout', () => {
    it('fires once after the delay', async () => {
        const cb = vi.fn()
        const cleanup = $effect.root(() => {
            useTimeout(cb, 20)
        })
        flushSync()
        expect(cb).not.toHaveBeenCalled()

        await vi.waitFor(() => expect(cb).toHaveBeenCalledTimes(1))
        await wait(40)
        expect(cb).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('cancel prevents firing', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useTimeout>
        const cleanup = $effect.root(() => {
            api = useTimeout(cb, 30)
        })
        flushSync()

        api!.cancel()
        await wait(60)
        expect(cb).not.toHaveBeenCalled()
        cleanup()
    })

    it('restart reschedules and fires once', async () => {
        const cb = vi.fn()
        let api: ReturnType<typeof useTimeout>
        const cleanup = $effect.root(() => {
            api = useTimeout(cb, 30)
        })
        flushSync()

        api!.restart()
        flushSync()
        await vi.waitFor(() => expect(cb).toHaveBeenCalledTimes(1))
        cleanup()
    })

    it('does not fire for a null delay', async () => {
        const cb = vi.fn()
        const cleanup = $effect.root(() => {
            useTimeout(cb, null)
        })
        flushSync()
        await wait(50)
        expect(cb).not.toHaveBeenCalled()
        cleanup()
    })

    it('clears the timeout on teardown (no leak)', async () => {
        const cb = vi.fn()
        const cleanup = $effect.root(() => {
            useTimeout(cb, 30)
        })
        flushSync()

        cleanup()
        await wait(60)
        expect(cb).not.toHaveBeenCalled()
    })
})
