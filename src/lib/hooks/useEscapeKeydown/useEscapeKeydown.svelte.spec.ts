import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Action } from 'svelte/action'
import { useEscapeKeydown, type UseEscapeKeydownOptions } from './useEscapeKeydown.svelte.js'

describe('useEscapeKeydown', () => {
    let node: HTMLDivElement

    beforeEach(() => {
        node = document.createElement('div')
        document.body.appendChild(node)
    })

    afterEach(() => {
        node.remove()
    })

    function mount(options: UseEscapeKeydownOptions) {
        let action: ReturnType<Action<HTMLElement, UseEscapeKeydownOptions>>
        const cleanup = $effect.root(() => {
            action = useEscapeKeydown(node, options)
        })
        flushSync()
        return { action: action!, cleanup }
    }

    it('should call the handler on Escape keydown', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('should not call the handler for other keys', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        cleanup()
    })

    it('should not call the handler when disabled', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler, enabled: false })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        cleanup()
    })

    it('should react to enabled toggled via update', () => {
        const handler = vi.fn()
        const { action, cleanup } = mount({ handler, enabled: false })

        action?.update?.({ handler, enabled: true })
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('should stop calling the handler after the action is destroyed', () => {
        const handler = vi.fn()
        const { cleanup } = mount({ handler })

        cleanup()
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
    })
})
