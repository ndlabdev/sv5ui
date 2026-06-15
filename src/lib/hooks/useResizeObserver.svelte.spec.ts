import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResizeObserver, useElementSize } from './useResizeObserver.svelte.js'

describe('useResizeObserver / useElementSize', () => {
    class FakeRO {
        cb: ResizeObserverCallback
        observed: { el: Element; options?: ResizeObserverOptions }[] = []
        disconnected = 0
        constructor(cb: ResizeObserverCallback) {
            this.cb = cb
            instances.push(this)
        }
        observe(el: Element, options?: ResizeObserverOptions) {
            this.observed.push({ el, options })
        }
        unobserve() {}
        disconnect() {
            this.disconnected++
        }
        emit(entries: Partial<ResizeObserverEntry>[]) {
            this.cb(entries as ResizeObserverEntry[], this as unknown as ResizeObserver)
        }
    }

    let originalRO: typeof ResizeObserver
    let instances: FakeRO[]

    beforeEach(() => {
        originalRO = globalThis.ResizeObserver
        instances = []
        globalThis.ResizeObserver = FakeRO as unknown as typeof ResizeObserver
    })

    afterEach(() => {
        globalThis.ResizeObserver = originalRO
    })

    it('observes the target on mount', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useResizeObserver(el, () => {})
        })
        flushSync()
        expect(instances).toHaveLength(1)
        expect(instances[0].observed[0].el).toBe(el)
        cleanup()
    })

    it('invokes the callback when the observer fires', () => {
        const el = document.createElement('div')
        const cb = vi.fn()
        const cleanup = $effect.root(() => {
            useResizeObserver(el, cb)
        })
        flushSync()
        instances[0].emit([{ contentRect: { width: 100, height: 50 } as DOMRectReadOnly }])
        expect(cb).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('disconnects on cleanup', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useResizeObserver(el, () => {})
        })
        flushSync()
        expect(instances[0].disconnected).toBe(0)
        cleanup()
        expect(instances[0].disconnected).toBe(1)
    })

    it('accepts a getter target', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useResizeObserver(
                () => el,
                () => {}
            )
        })
        flushSync()
        expect(instances[0].observed[0].el).toBe(el)
        cleanup()
    })

    it('is a no-op for a nullish target', () => {
        const cleanup = $effect.root(() => {
            useResizeObserver(null, () => {})
        })
        flushSync()
        expect(instances).toHaveLength(0)
        cleanup()
    })

    it('re-observes when a reactive getter target changes', () => {
        const a = document.createElement('div')
        const b = document.createElement('div')
        let current = $state(a)
        const cleanup = $effect.root(() => {
            useResizeObserver(
                () => current,
                () => {}
            )
        })
        flushSync()
        expect(instances).toHaveLength(1)
        expect(instances[0].observed[0].el).toBe(a)

        current = b
        flushSync()
        expect(instances[0].disconnected).toBe(1)
        expect(instances).toHaveLength(2)
        expect(instances[1].observed[0].el).toBe(b)
        cleanup()
    })

    it('useElementSize reflects content-box size reactively', () => {
        const el = document.createElement('div')
        let size: ReturnType<typeof useElementSize>
        const cleanup = $effect.root(() => {
            size = useElementSize(el)
        })
        flushSync()
        expect(size!.width).toBe(0)
        expect(size!.height).toBe(0)

        instances[0].emit([{ contentRect: { width: 120, height: 80 } as DOMRectReadOnly }])
        flushSync()
        expect(size!.width).toBe(120)
        expect(size!.height).toBe(80)
        cleanup()
    })

    it('disconnects every observer it creates (no dangling observers)', () => {
        const a = document.createElement('div')
        const b = document.createElement('div')
        let current = $state(a)
        const cleanup = $effect.root(() => {
            useResizeObserver(
                () => current,
                () => {}
            )
        })
        flushSync()
        current = b
        flushSync()
        cleanup()
        expect(instances).toHaveLength(2)
        expect(instances.every((i) => i.disconnected === 1)).toBe(true)
    })

    it('observes once for a static target despite unrelated state changes', () => {
        const el = document.createElement('div')
        let unrelated = $state(0)
        let ticks = 0
        const cleanup = $effect.root(() => {
            useResizeObserver(el, () => {})
            $effect(() => {
                void unrelated
                ticks++
            })
        })
        flushSync()
        expect(instances).toHaveLength(1)
        unrelated = 1
        flushSync()
        unrelated = 2
        flushSync()
        expect(ticks).toBeGreaterThan(1)
        expect(instances).toHaveLength(1)
        cleanup()
    })

    it('useElementSize does not trigger updates when the size is unchanged', () => {
        const el = document.createElement('div')
        let renders = 0
        let size: ReturnType<typeof useElementSize>
        const cleanup = $effect.root(() => {
            size = useElementSize(el)
            $effect(() => {
                void size!.width
                void size!.height
                renders++
            })
        })
        flushSync()
        const initial = renders

        instances[0].emit([{ contentRect: { width: 100, height: 50 } as DOMRectReadOnly }])
        flushSync()
        const afterChange = renders
        expect(afterChange).toBeGreaterThan(initial)

        instances[0].emit([{ contentRect: { width: 100, height: 50 } as DOMRectReadOnly }])
        flushSync()
        expect(renders).toBe(afterChange)
        cleanup()
    })
})
