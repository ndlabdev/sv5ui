import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useTour } from './useTour.svelte.js'
import type { TourStep } from '../../components/Tour/tour.types.js'

const steps: TourStep[] = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
    { id: 'three', title: 'Three' }
]

function setup(opts: Parameters<typeof useTour>[0]) {
    let api: ReturnType<typeof useTour>
    const cleanup = $effect.root(() => {
        api = useTour(opts)
    })
    flushSync()
    return { api: api!, cleanup }
}

describe('useTour', () => {
    it('is inactive before start', () => {
        const { api, cleanup } = setup({ steps })
        expect(api.isActive).toBe(false)
        expect(api.currentIndex).toBe(-1)
        expect(api.totalSteps).toBe(3)
        expect(api.currentStepData).toBeUndefined()
        cleanup()
    })

    it('starts, advances and goes back', () => {
        const { api, cleanup } = setup({ steps })

        api.start()
        flushSync()
        expect(api.isActive).toBe(true)
        expect(api.currentIndex).toBe(0)
        expect(api.isFirst).toBe(true)
        expect(api.hasPrev).toBe(false)

        api.next()
        flushSync()
        expect(api.currentIndex).toBe(1)
        expect(api.hasPrev).toBe(true)
        expect(api.hasNext).toBe(true)

        api.prev()
        flushSync()
        expect(api.currentIndex).toBe(0)
        cleanup()
    })

    it('starts at a given index or id', () => {
        const { api, cleanup } = setup({ steps })
        api.start(2)
        flushSync()
        expect(api.currentIndex).toBe(2)
        expect(api.isLast).toBe(true)

        api.goTo('one')
        flushSync()
        expect(api.currentIndex).toBe(0)
        cleanup()
    })

    it('completes (not skip) when advancing past the last step', () => {
        const onComplete = vi.fn()
        const onSkip = vi.fn()
        const { api, cleanup } = setup({ steps, onComplete, onSkip })

        api.start(2)
        flushSync()
        api.next()
        flushSync()

        expect(onComplete).toHaveBeenCalledTimes(1)
        expect(onSkip).not.toHaveBeenCalled()
        expect(api.isActive).toBe(false)
        cleanup()
    })

    it('fires onSkip when stopped before completing', () => {
        const onComplete = vi.fn()
        const onSkip = vi.fn()
        const { api, cleanup } = setup({ steps, onComplete, onSkip })

        api.start()
        flushSync()
        api.next()
        flushSync()
        api.stop()
        flushSync()

        expect(onSkip).toHaveBeenCalledWith(1)
        expect(onComplete).not.toHaveBeenCalled()
        cleanup()
    })

    it('reports step transitions through onStepChange', () => {
        const onStepChange = vi.fn()
        const { api, cleanup } = setup({ steps, onStepChange })

        api.start()
        flushSync()
        api.next()
        flushSync()

        expect(onStepChange).toHaveBeenLastCalledWith(1, 0)
        cleanup()
    })

    it('skips disabled steps in both directions', () => {
        const withDisabled: TourStep[] = [{ id: 'a' }, { id: 'b', disabled: true }, { id: 'c' }]
        const { api, cleanup } = setup({ steps: withDisabled })

        api.start()
        flushSync()
        api.next()
        flushSync()
        expect(api.currentIndex).toBe(2)

        api.prev()
        flushSync()
        expect(api.currentIndex).toBe(0)
        cleanup()
    })

    it('persists and restores across instances', () => {
        const key = `sv5ui-tour-test-${Math.random()}`
        localStorage.removeItem(key)

        const first = setup({ steps, persist: { key } })
        first.api.start()
        flushSync()
        first.api.next()
        flushSync()
        expect(localStorage.getItem(key)).toContain('"index":1')
        first.cleanup()

        const second = setup({ steps, persist: { key } })
        expect(second.api.isActive).toBe(true)
        expect(second.api.currentIndex).toBe(1)
        second.cleanup()

        localStorage.removeItem(key)
    })

    it('clears persisted state when the tour closes', () => {
        const key = `sv5ui-tour-test-${Math.random()}`
        const { api, cleanup } = setup({ steps, persist: { key } })

        api.start()
        flushSync()
        expect(localStorage.getItem(key)).not.toBeNull()

        api.stop()
        flushSync()
        expect(localStorage.getItem(key)).toBeNull()
        cleanup()
    })
})
