import { toGetter } from '../utils.js'
import { useEventListener } from '../useEventListener/index.js'

export interface PointerDragContext {
    /** The pointer event that produced this update. */
    event: PointerEvent
    pointerId: number
    /** Current pointer position, in client coordinates. */
    x: number
    y: number
    /** Where the drag started, in client coordinates. */
    startX: number
    startY: number
    /** Distance from the start, after the axis lock. */
    dx: number
    dy: number
}

export type DragAxis = 'x' | 'y' | 'both'

export interface UsePointerDragOptions {
    /**
     * Called on the pointer down that starts a drag. Return exactly `false` to
     * reject the gesture, which releases the capture and leaves `active` false.
     *
     * The return type is `unknown` on purpose: a one line arrow such as
     * `onStart: () => (start = value)` returns the assigned value, and a
     * `boolean | void` signature would reject it.
     */
    onStart?: (context: PointerDragContext) => unknown

    /**
     * Called for every pointer move, coalesced to one call per frame unless
     * `throttle` is off.
     */
    onMove?: (context: PointerDragContext) => void

    /**
     * Called once the pointer is released or the gesture is cancelled, always with
     * the final position.
     */
    onEnd?: (context: PointerDragContext) => void

    /**
     * Lock the reported delta to one direction. May be a getter, for a component
     * whose orientation can change while it is mounted.
     * @default 'both'
     */
    axis?: DragAxis | (() => DragAxis)

    /**
     * Coalesce moves into one update per animation frame.
     * @default true
     */
    throttle?: boolean

    /**
     * Ignore pointer downs while this is true. May be a getter.
     * @default false
     */
    disabled?: boolean | (() => boolean)
}

export interface UsePointerDragHandlers {
    onpointerdown: (event: PointerEvent) => void
    onpointermove: (event: PointerEvent) => void
    onpointerup: (event: PointerEvent) => void
    onpointercancel: (event: PointerEvent) => void
}

export interface UsePointerDragReturn {
    /** Whether a drag is in flight. */
    readonly active: boolean

    /** Spread onto the element that starts the drag. */
    readonly handlers: UsePointerDragHandlers

    /** End the current drag as if the pointer had been released. */
    cancel: () => void
}

/**
 * Pointer dragging with the parts every component gets wrong: pointer capture with
 * a `window` fallback, moves coalesced to one update per frame, and the final
 * position always flushed on release so the result matches the pointer.
 *
 * Every update is computed from the position the drag started at, so the element
 * and window paths are idempotent and a dropped move never accumulates error.
 *
 * @example
 * ```svelte
 * <script>
 *   import { usePointerDrag } from 'sv5ui'
 *
 *   let width = $state(200)
 *   let start = 0
 *
 *   const drag = usePointerDrag({
 *     axis: 'x',
 *     onStart: () => (start = width),
 *     onMove: ({ dx }) => (width = start + dx)
 *   })
 * </script>
 *
 * <div {...drag.handlers} data-active={drag.active ? '' : undefined}></div>
 * ```
 */
export function usePointerDrag(options: UsePointerDragOptions = {}): UsePointerDragReturn {
    const { throttle = true } = options
    const resolveAxis = toGetter<DragAxis>(options.axis ?? 'both')
    const isDisabled = toGetter(options.disabled ?? false)

    let active = $state(false)
    let pointerId = -1
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let lastEvent: PointerEvent | null = null
    let target: HTMLElement | null = null
    let frame = 0

    function context(event: PointerEvent): PointerDragContext {
        const axis = resolveAxis()

        return {
            event,
            pointerId,
            x: lastX,
            y: lastY,
            startX,
            startY,
            dx: axis === 'y' ? 0 : lastX - startX,
            dy: axis === 'x' ? 0 : lastY - startY
        }
    }

    function capture(element: HTMLElement, id: number) {
        try {
            element.setPointerCapture(id)
        } catch {
            return
        }
    }

    function release() {
        if (!target) return

        try {
            if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId)
        } catch {
            return
        }
    }

    function cancelFrame() {
        if (!frame) return

        cancelAnimationFrame(frame)
        frame = 0
    }

    function stop(event: PointerEvent | null) {
        if (!active) return

        cancelFrame()
        release()
        active = false

        const source = event ?? lastEvent
        if (source) options.onEnd?.(context(source))

        target = null
        lastEvent = null
        pointerId = -1
    }

    function handlePointerDown(event: PointerEvent) {
        if (active || isDisabled()) return
        if (event.button !== 0 && event.pointerType === 'mouse') return

        target = event.currentTarget as HTMLElement
        pointerId = event.pointerId
        startX = event.clientX
        startY = event.clientY
        lastX = startX
        lastY = startY
        lastEvent = event

        capture(target, pointerId)
        active = true

        if (options.onStart?.(context(event)) === false) {
            release()
            active = false
            target = null
            lastEvent = null
            pointerId = -1
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!active || event.pointerId !== pointerId) return

        lastX = event.clientX
        lastY = event.clientY
        lastEvent = event

        if (!throttle) {
            options.onMove?.(context(event))
            return
        }

        if (frame) return
        frame = requestAnimationFrame(() => {
            frame = 0
            if (active && lastEvent) options.onMove?.(context(lastEvent))
        })
    }

    function handlePointerUp(event: PointerEvent) {
        if (!active || event.pointerId !== pointerId) return

        lastX = event.clientX
        lastY = event.clientY
        lastEvent = event
        cancelFrame()
        options.onMove?.(context(event))
        stop(event)
    }

    useEventListener(
        () => (active ? window : null),
        'pointermove',
        (event) => handlePointerMove(event as PointerEvent)
    )

    useEventListener(
        () => (active ? window : null),
        'pointerup',
        (event) => handlePointerUp(event as PointerEvent)
    )

    useEventListener(
        () => (active ? window : null),
        'pointercancel',
        (event) => handlePointerUp(event as PointerEvent)
    )

    $effect(() => {
        return () => cancelFrame()
    })

    return {
        get active() {
            return active
        },
        get handlers(): UsePointerDragHandlers {
            return {
                onpointerdown: handlePointerDown,
                onpointermove: handlePointerMove,
                onpointerup: handlePointerUp,
                onpointercancel: handlePointerUp
            }
        },
        cancel() {
            stop(null)
        }
    }
}
