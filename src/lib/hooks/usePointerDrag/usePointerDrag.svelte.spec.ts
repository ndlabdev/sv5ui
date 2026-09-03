import { flushSync } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePointerDrag, type PointerDragContext } from './usePointerDrag.svelte.js'

let element: HTMLElement | null = null

function mount() {
    element = document.createElement('div')
    document.body.appendChild(element)

    return element
}

function pointer(type: string, x: number, y: number, init: PointerEventInit = {}) {
    return new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        isPrimary: true,
        button: 0,
        buttons: 1,
        pointerType: 'mouse',
        ...init
    })
}

function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
}

afterEach(() => {
    element?.remove()
    element = null
})

describe('usePointerDrag', () => {
    it('reports a delta from where the drag started', async () => {
        const moves: PointerDragContext[] = []
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onMove: (context) => moves.push({ ...context }) })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 100, 50))
        flushSync()
        expect(drag!.active).toBe(true)

        window.dispatchEvent(pointer('pointermove', 130, 70))
        await nextFrame()

        expect(moves.at(-1)?.dx).toBe(30)
        expect(moves.at(-1)?.dy).toBe(20)
        expect(moves.at(-1)?.startX).toBe(100)

        window.dispatchEvent(pointer('pointerup', 130, 70))
        flushSync()
        expect(drag!.active).toBe(false)
        cleanup()
    })

    it('always flushes the final position on release', () => {
        const moves: number[] = []
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onMove: ({ dx }) => moves.push(dx) })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()

        // no frame is allowed to run between the move and the release
        window.dispatchEvent(pointer('pointermove', 40, 0))
        window.dispatchEvent(pointer('pointerup', 55, 0))
        flushSync()

        expect(moves.at(-1)).toBe(55)
        cleanup()
    })

    it('locks the delta to one axis', async () => {
        let last: PointerDragContext | null = null
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ axis: 'x', onMove: (context) => (last = { ...context }) })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        window.dispatchEvent(pointer('pointermove', 30, 90))
        await nextFrame()

        expect(last!.dx).toBe(30)
        expect(last!.dy).toBe(0)
        cleanup()
    })

    it('coalesces several moves into one call per frame', async () => {
        const onMove = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onMove })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()

        window.dispatchEvent(pointer('pointermove', 10, 0))
        window.dispatchEvent(pointer('pointermove', 20, 0))
        window.dispatchEvent(pointer('pointermove', 30, 0))
        await nextFrame()

        expect(onMove).toHaveBeenCalledTimes(1)
        expect(onMove.mock.lastCall![0].dx).toBe(30)
        cleanup()
    })

    it('calls onMove for every event when throttling is off', () => {
        const onMove = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ throttle: false, onMove })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        window.dispatchEvent(pointer('pointermove', 10, 0))
        window.dispatchEvent(pointer('pointermove', 20, 0))

        expect(onMove).toHaveBeenCalledTimes(2)
        cleanup()
    })

    it('lets onStart reject a gesture', () => {
        const onMove = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onStart: () => false, onMove })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()

        expect(drag!.active).toBe(false)

        window.dispatchEvent(pointer('pointermove', 40, 0))
        expect(onMove).not.toHaveBeenCalled()
        cleanup()
    })

    it('ignores a pointer down while disabled', () => {
        let disabled = $state(true)
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ disabled: () => disabled })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        expect(drag!.active).toBe(false)

        disabled = false
        flushSync()
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        expect(drag!.active).toBe(true)
        cleanup()
    })

    it('ignores a secondary mouse button', () => {
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag()
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0, { button: 2 }))
        flushSync()

        expect(drag!.active).toBe(false)
        cleanup()
    })

    it('starts on a touch pointer whatever the button reports', () => {
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag()
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0, { button: -1, pointerType: 'touch' }))
        flushSync()

        expect(drag!.active).toBe(true)
        cleanup()
    })

    it('ends on pointercancel and reports the last position', () => {
        const onEnd = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onEnd })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 10, 10))
        flushSync()
        window.dispatchEvent(pointer('pointercancel', 45, 10))
        flushSync()

        expect(drag!.active).toBe(false)
        expect(onEnd).toHaveBeenCalledTimes(1)
        expect(onEnd.mock.lastCall![0].dx).toBe(35)
        cleanup()
    })

    it('can be cancelled programmatically', () => {
        const onEnd = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onEnd })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        drag!.cancel()
        flushSync()

        expect(drag!.active).toBe(false)
        expect(onEnd).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('ignores events from another pointer', async () => {
        const onMove = vi.fn()
        let drag: ReturnType<typeof usePointerDrag>
        const cleanup = $effect.root(() => {
            drag = usePointerDrag({ onMove })
        })
        flushSync()

        const node = mount()
        node.addEventListener('pointerdown', (event) =>
            drag.handlers.onpointerdown(event as PointerEvent)
        )
        node.dispatchEvent(pointer('pointerdown', 0, 0))
        flushSync()
        window.dispatchEvent(pointer('pointermove', 90, 0, { pointerId: 2 }))
        await nextFrame()

        expect(onMove).not.toHaveBeenCalled()
        cleanup()
    })
})
