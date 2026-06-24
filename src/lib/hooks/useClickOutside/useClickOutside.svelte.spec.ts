import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Action } from 'svelte/action'
import { useClickOutside, type UseClickOutsideOptions } from './useClickOutside.svelte.js'

describe('useClickOutside', () => {
    let node: HTMLDivElement

    beforeEach(() => {
        node = document.createElement('div')
        document.body.appendChild(node)
    })

    afterEach(() => {
        node.remove()
    })

    function mount(options: UseClickOutsideOptions) {
        let action: ReturnType<Action<HTMLElement, UseClickOutsideOptions>>
        const cleanup = $effect.root(() => {
            action = useClickOutside(node, options)
        })
        flushSync()
        return { action: action!, cleanup }
    }

    it('should call the handler on a pointerdown outside the node', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('should not call the handler on a pointerdown inside the node', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        cleanup()
    })

    it('should not call the handler when disabled', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler, enabled: false })

        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        cleanup()
    })

    it('should react to enabled toggled via update', () => {
        const handler = vi.fn()
        const { action, cleanup } = mount({ handler, enabled: false })

        action?.update?.({ handler, enabled: true })
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('should stop calling the handler after the action is destroyed', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        cleanup()
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
    })
})
