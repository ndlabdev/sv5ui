import { flushSync } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFocusTrap } from './useFocusTrap.svelte.js'

const created: HTMLElement[] = []

function makeTrap() {
    const outside = document.createElement('button')
    outside.textContent = 'outside'
    const container = document.createElement('div')
    const a = document.createElement('button')
    a.textContent = 'a'
    const b = document.createElement('button')
    b.textContent = 'b'
    const c = document.createElement('button')
    c.textContent = 'c'
    container.append(a, b, c)
    document.body.append(outside, container)
    created.push(outside, container)
    return { outside, container, a, b, c }
}

function tab(shiftKey = false) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true }))
}

afterEach(() => {
    for (const el of created) el.remove()
    created.length = 0
})

describe('useFocusTrap', () => {
    it('focuses the first focusable element on activate', () => {
        const { container, a } = makeTrap()
        const cleanup = $effect.root(() => useFocusTrap(() => container))
        flushSync()
        expect(document.activeElement).toBe(a)
        cleanup()
    })

    it('respects an explicit initialFocus', () => {
        const { container, b } = makeTrap()
        const cleanup = $effect.root(() => useFocusTrap(() => container, { initialFocus: b }))
        flushSync()
        expect(document.activeElement).toBe(b)
        cleanup()
    })

    it('skips auto-focus when initialFocus is false', () => {
        const { outside, container } = makeTrap()
        outside.focus()
        const cleanup = $effect.root(() => useFocusTrap(() => container, { initialFocus: false }))
        flushSync()
        expect(document.activeElement).toBe(outside)
        cleanup()
    })

    it('wraps Tab from the last element to the first', () => {
        const { container, a, c } = makeTrap()
        const cleanup = $effect.root(() => useFocusTrap(() => container))
        flushSync()
        c.focus()
        tab()
        expect(document.activeElement).toBe(a)
        cleanup()
    })

    it('wraps Shift+Tab from the first element to the last', () => {
        const { container, a, c } = makeTrap()
        const cleanup = $effect.root(() => useFocusTrap(() => container))
        flushSync()
        a.focus()
        tab(true)
        expect(document.activeElement).toBe(c)
        cleanup()
    })

    it('restores focus on deactivate', () => {
        const { outside, container } = makeTrap()
        outside.focus()
        const cleanup = $effect.root(() => useFocusTrap(() => container))
        flushSync()
        expect(document.activeElement).not.toBe(outside)
        cleanup()
        expect(document.activeElement).toBe(outside)
    })

    it('does nothing when inactive', () => {
        const { outside, container } = makeTrap()
        outside.focus()
        const cleanup = $effect.root(() => useFocusTrap(() => container, { active: false }))
        flushSync()
        expect(document.activeElement).toBe(outside)
        cleanup()
    })

    it('is a no-op for a nullish target', () => {
        const cleanup = $effect.root(() => useFocusTrap(null))
        expect(() => flushSync()).not.toThrow()
        cleanup()
    })

    it('reacts to a reactive active getter', () => {
        const { outside, container, a } = makeTrap()
        outside.focus()
        let active = $state(false)
        const cleanup = $effect.root(() => useFocusTrap(() => container, { active: () => active }))
        flushSync()
        expect(document.activeElement).toBe(outside)

        active = true
        flushSync()
        expect(document.activeElement).toBe(a)
        cleanup()
    })

    it('removes the keydown listener on deactivate with matching args (no leak)', () => {
        const { container } = makeTrap()
        const addSpy = vi.spyOn(document, 'addEventListener')
        const removeSpy = vi.spyOn(document, 'removeEventListener')
        const cleanup = $effect.root(() => useFocusTrap(() => container))
        flushSync()
        const addCall = addSpy.mock.calls.find((c) => c[0] === 'keydown')
        expect(addCall).toBeDefined()
        cleanup()
        const removeCall = removeSpy.mock.calls.find(
            (c) => c[0] === 'keydown' && c[1] === addCall![1]
        )
        expect(removeCall).toBeDefined()
        expect(removeCall![2]).toEqual(addCall![2])
        addSpy.mockRestore()
        removeSpy.mockRestore()
    })

    it('stops trapping once active becomes false', () => {
        const { container, c } = makeTrap()
        let active = $state(true)
        const cleanup = $effect.root(() =>
            useFocusTrap(() => container, { active: () => active, restoreFocus: false })
        )
        flushSync()
        active = false
        flushSync()
        c.focus()
        tab()
        expect(document.activeElement).toBe(c)
        cleanup()
    })
})
