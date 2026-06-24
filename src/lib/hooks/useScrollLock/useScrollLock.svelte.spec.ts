import { flushSync } from 'svelte'
import { describe, expect, it } from 'vitest'
import { useScrollLock } from './useScrollLock.svelte.js'

describe('useScrollLock', () => {
    it('sets overflow hidden while locked (reactive getter)', () => {
        const el = document.createElement('div')
        let locked = $state(true)
        const cleanup = $effect.root(() => {
            useScrollLock(
                () => locked,
                () => el
            )
        })
        flushSync()
        expect(el.style.overflow).toBe('hidden')

        locked = false
        flushSync()
        expect(el.style.overflow).toBe('')
        cleanup()
    })

    it('restores the original overflow value on unlock', () => {
        const el = document.createElement('div')
        el.style.overflow = 'auto'
        let locked = $state(false)
        const cleanup = $effect.root(() => {
            useScrollLock(
                () => locked,
                () => el
            )
        })
        flushSync()
        expect(el.style.overflow).toBe('auto')

        locked = true
        flushSync()
        expect(el.style.overflow).toBe('hidden')

        locked = false
        flushSync()
        expect(el.style.overflow).toBe('auto')
        cleanup()
    })

    it('reference-counts nested locks on the same target', () => {
        const el = document.createElement('div')
        let a = $state(true)
        let b = $state(true)
        const c1 = $effect.root(() => {
            useScrollLock(
                () => a,
                () => el
            )
        })
        const c2 = $effect.root(() => {
            useScrollLock(
                () => b,
                () => el
            )
        })
        flushSync()
        expect(el.style.overflow).toBe('hidden')

        a = false
        flushSync()
        expect(el.style.overflow).toBe('hidden')

        b = false
        flushSync()
        expect(el.style.overflow).toBe('')
        c1()
        c2()
    })

    it('releases the lock on teardown', () => {
        const el = document.createElement('div')
        const cleanup = $effect.root(() => {
            useScrollLock(true, () => el)
        })
        flushSync()
        expect(el.style.overflow).toBe('hidden')
        cleanup()
        expect(el.style.overflow).toBe('')
    })

    it('is a no-op for a nullish target', () => {
        const cleanup = $effect.root(() => {
            useScrollLock(true, () => null)
        })
        expect(() => flushSync()).not.toThrow()
        cleanup()
    })

    it('supports imperative lock / unlock', () => {
        const el = document.createElement('div')
        let api: ReturnType<typeof useScrollLock>
        const cleanup = $effect.root(() => {
            api = useScrollLock(false, () => el)
        })
        flushSync()
        expect(el.style.overflow).toBe('')

        api!.lock()
        flushSync()
        expect(el.style.overflow).toBe('hidden')

        api!.unlock()
        flushSync()
        expect(el.style.overflow).toBe('')
        cleanup()
    })
})
