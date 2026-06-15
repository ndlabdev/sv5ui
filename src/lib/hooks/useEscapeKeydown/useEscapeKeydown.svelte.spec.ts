import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEscapeKeydown } from './useEscapeKeydown.svelte.js'

describe('useEscapeKeydown', () => {
    let node: HTMLDivElement

    beforeEach(() => {
        node = document.createElement('div')
        document.body.appendChild(node)
    })

    afterEach(() => {
        node.remove()
    })

    it('should call the handler on Escape keydown', () => {
        const handler = vi.fn()
        const action = useEscapeKeydown(node, { handler })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        action?.destroy?.()
    })

    it('should not call the handler for other keys', () => {
        const handler = vi.fn()
        const action = useEscapeKeydown(node, { handler })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        action?.destroy?.()
    })

    it('should not call the handler when disabled', () => {
        const handler = vi.fn()
        const action = useEscapeKeydown(node, { handler, enabled: false })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        action?.destroy?.()
    })

    it('should react to enabled toggled via update', () => {
        const handler = vi.fn()
        const action = useEscapeKeydown(node, { handler, enabled: false })

        action?.update?.({ handler, enabled: true })
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        action?.destroy?.()
    })

    it('should stop calling the handler after destroy', () => {
        const handler = vi.fn()
        const action = useEscapeKeydown(node, { handler })

        action?.destroy?.()
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
    })
})
