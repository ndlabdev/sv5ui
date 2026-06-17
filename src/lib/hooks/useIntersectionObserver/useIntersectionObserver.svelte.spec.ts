import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIntersectionObserver } from './useIntersectionObserver.svelte.js'

let observers: FakeObserver[] = []

class FakeObserver {
    callback: IntersectionObserverCallback
    options?: IntersectionObserverInit
    observed: Element[] = []
    disconnected = false

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback
        this.options = options
        observers.push(this)
    }

    observe(el: Element) {
        this.observed.push(el)
    }

    disconnect() {
        this.disconnected = true
    }

    unobserve() {}
    takeRecords() {
        return []
    }

    trigger(isIntersecting: boolean) {
        const entry = {
            isIntersecting,
            target: this.observed[0]
        } as IntersectionObserverEntry
        this.callback([entry], this as unknown as IntersectionObserver)
    }
}

describe('useIntersectionObserver', () => {
    let OriginalIO: typeof IntersectionObserver

    beforeEach(() => {
        observers = []
        OriginalIO = globalThis.IntersectionObserver
        globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver
    })

    afterEach(() => {
        globalThis.IntersectionObserver = OriginalIO
    })

    it('observes the target and defaults isIntersecting to false', () => {
        const el = document.createElement('div')
        let api: ReturnType<typeof useIntersectionObserver>
        const cleanup = $effect.root(() => {
            api = useIntersectionObserver(() => el)
        })
        flushSync()

        expect(observers).toHaveLength(1)
        expect(observers[0].observed[0]).toBe(el)
        expect(api!.isIntersecting).toBe(false)
        cleanup()
    })

    it('updates isIntersecting and invokes the callback when the observer fires', () => {
        const el = document.createElement('div')
        const cb = vi.fn()
        let api: ReturnType<typeof useIntersectionObserver>
        const cleanup = $effect.root(() => {
            api = useIntersectionObserver(() => el, cb)
        })
        flushSync()

        observers[0].trigger(true)
        flushSync()
        expect(api!.isIntersecting).toBe(true)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb.mock.calls[0][0].isIntersecting).toBe(true)

        observers[0].trigger(false)
        flushSync()
        expect(api!.isIntersecting).toBe(false)
        cleanup()
    })

    it('forwards options to the IntersectionObserver', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useIntersectionObserver(() => el, undefined, { rootMargin: '200px', threshold: 0.5 })
        })
        flushSync()

        expect(observers[0].options).toEqual({ rootMargin: '200px', threshold: 0.5 })
        cleanup()
    })

    it('disconnects on teardown (no leak)', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useIntersectionObserver(() => el)
        })
        flushSync()
        expect(observers[0].disconnected).toBe(false)

        cleanup()
        expect(observers[0].disconnected).toBe(true)
    })

    it('re-observes when the target getter changes', () => {
        const a = document.createElement('div')
        const b = document.createElement('div')
        let current = $state<Element>(a)
        const cleanup = $effect.root(() => {
            useIntersectionObserver(() => current)
        })
        flushSync()
        expect(observers).toHaveLength(1)
        expect(observers[0].observed[0]).toBe(a)

        current = b
        flushSync()
        expect(observers[0].disconnected).toBe(true)
        expect(observers).toHaveLength(2)
        expect(observers[1].observed[0]).toBe(b)
        cleanup()
    })

    it('is a no-op for a nullish target', () => {
        const cleanup = $effect.root(() => {
            useIntersectionObserver(() => null)
        })
        expect(() => flushSync()).not.toThrow()
        expect(observers).toHaveLength(0)
        cleanup()
    })
})
