import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useEventListener } from './useEventListener.svelte.js'

describe('useEventListener', () => {
    it('binds a listener on a value target and fires on the event', () => {
        const el = document.createElement('div')
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(el, 'click', handler)
        })
        flushSync()
        el.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('accepts a getter target', () => {
        const el = document.createElement('div')
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(() => el, 'click', handler)
        })
        flushSync()
        el.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('binds multiple event types', () => {
        const el = document.createElement('div')
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(el, ['click', 'pointerdown'], handler)
        })
        flushSync()
        el.dispatchEvent(new MouseEvent('click'))
        el.dispatchEvent(new PointerEvent('pointerdown'))
        expect(handler).toHaveBeenCalledTimes(2)
        cleanup()
    })

    it('removes the listener on cleanup', () => {
        const el = document.createElement('div')
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(el, 'click', handler)
        })
        flushSync()
        cleanup()
        el.dispatchEvent(new MouseEvent('click'))
        expect(handler).not.toHaveBeenCalled()
    })

    it('is a no-op for a nullish target', () => {
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(null, 'click', handler)
        })
        expect(() => flushSync()).not.toThrow()
        cleanup()
    })

    it('respects listener options (once)', () => {
        const el = document.createElement('div')
        const handler = vi.fn()
        const cleanup = $effect.root(() => {
            useEventListener(el, 'click', handler, { once: true })
        })
        flushSync()
        el.dispatchEvent(new MouseEvent('click'))
        el.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('re-binds when a reactive getter target changes', () => {
        const a = document.createElement('div')
        const b = document.createElement('div')
        const handler = vi.fn()
        let current = $state(a)
        const cleanup = $effect.root(() => {
            useEventListener(() => current, 'click', handler)
        })
        flushSync()
        a.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(1)

        current = b
        flushSync()
        a.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(1)
        b.dispatchEvent(new MouseEvent('click'))
        expect(handler).toHaveBeenCalledTimes(2)
        cleanup()
    })

    it('does not leak: every addEventListener is matched by removeEventListener with identical args', () => {
        const el = document.createElement('div')
        const addSpy = vi.spyOn(el, 'addEventListener')
        const removeSpy = vi.spyOn(el, 'removeEventListener')
        const handler = vi.fn()
        const options = { capture: true }
        const cleanup = $effect.root(() => {
            useEventListener(el, ['click', 'keydown'], handler, options)
        })
        flushSync()
        expect(addSpy).toHaveBeenCalledTimes(2)
        cleanup()
        expect(removeSpy).toHaveBeenCalledTimes(2)
        expect(removeSpy.mock.calls).toEqual(addSpy.mock.calls)
    })

    it('binds once for a static target and does not re-bind on unrelated state changes', () => {
        const el = document.createElement('div')
        const addSpy = vi.spyOn(el, 'addEventListener')
        let unrelated = $state(0)
        let ticks = 0
        const cleanup = $effect.root(() => {
            useEventListener(el, 'click', () => {})
            $effect(() => {
                void unrelated
                ticks++
            })
        })
        flushSync()
        expect(addSpy).toHaveBeenCalledTimes(1)
        unrelated = 1
        flushSync()
        unrelated = 2
        flushSync()
        expect(ticks).toBeGreaterThan(1)
        expect(addSpy).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('on target change, removes the old target exactly once and binds the new one', () => {
        const a = document.createElement('div')
        const b = document.createElement('div')
        const aRemove = vi.spyOn(a, 'removeEventListener')
        const bAdd = vi.spyOn(b, 'addEventListener')
        let current = $state(a)
        const cleanup = $effect.root(() => {
            useEventListener(
                () => current,
                'click',
                () => {}
            )
        })
        flushSync()
        current = b
        flushSync()
        expect(aRemove).toHaveBeenCalledTimes(1)
        expect(bAdd).toHaveBeenCalledTimes(1)
        cleanup()
    })
})
