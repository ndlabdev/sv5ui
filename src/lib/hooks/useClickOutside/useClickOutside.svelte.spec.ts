import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClickOutside } from './useClickOutside.svelte.js'

describe('useClickOutside', () => {
    let node: HTMLDivElement

    beforeEach(() => {
        node = document.createElement('div')
        document.body.appendChild(node)
    })

    afterEach(() => {
        node.remove()
    })

    it('should call the handler on a pointerdown outside the node', () => {
        const handler = vi.fn()
        const action = useClickOutside(node, { handler })

        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        action?.destroy?.()
    })

    it('should not call the handler on a pointerdown inside the node', () => {
        const handler = vi.fn()
        const action = useClickOutside(node, { handler })

        node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        action?.destroy?.()
    })

    it('should not call the handler when disabled', () => {
        const handler = vi.fn()
        const action = useClickOutside(node, { handler, enabled: false })

        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
        action?.destroy?.()
    })

    it('should react to enabled toggled via update', () => {
        const handler = vi.fn()
        const action = useClickOutside(node, { handler, enabled: false })

        action?.update?.({ handler, enabled: true })
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).toHaveBeenCalledTimes(1)
        action?.destroy?.()
    })

    it('should stop calling the handler after destroy', () => {
        const handler = vi.fn()
        const action = useClickOutside(node, { handler })

        action?.destroy?.()
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        expect(handler).not.toHaveBeenCalled()
    })
})
