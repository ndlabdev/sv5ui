<script lang="ts" module>
    import type { ImageCropperProps } from './image-cropper.types.js'

    export type Props = ImageCropperProps
</script>

<script lang="ts">
    import { untrack } from 'svelte'
    import { SvelteMap } from 'svelte/reactivity'
    import { imageCropperVariants, imageCropperDefaults } from './image-cropper.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { useElementSize } from '../../hooks/useResizeObserver/useResizeObserver.svelte.js'
    import { useEventListener } from '../../hooks/useEventListener/useEventListener.svelte.js'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'
    import Slider from '../Slider/Slider.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'
    import {
        areaEquals,
        centerForArea,
        centerFrameWithin,
        clamp,
        computeFrame,
        constrainCenter,
        EDGE_MARGIN,
        fitRectWithin,
        containScale,
        coverScale,
        intersectRect,
        moveRect,
        normalizeRotation,
        outputFileName,
        renderCrop,
        resizeRect,
        scaleForArea,
        resolveOutputScale,
        rotateSize,
        toCssTransform,
        toSourceArea,
        toStageRect,
        transformOps,
        type ImageTransform,
        type Point,
        type Rect,
        type ResizeHandle
    } from './image-cropper.utils.js'
    import type {
        ImageCropperApi,
        ImageCropperResult,
        ImageCropperStatus,
        ImageCropperToolbarItem
    } from './image-cropper.types.js'

    const config = getComponentConfig('imageCropper', imageCropperDefaults)
    const baseIcons = getComponentConfig('icons', iconsDefaults)

    const HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
    const CORNERS = ['nw', 'ne', 'se', 'sw'] as const

    const HANDLE_SHAPES: Record<ResizeHandle, string> = {
        nw: 'size-2.5 rounded-[2px] ring-1 ring-black/25 cursor-nwse-resize',
        ne: 'size-2.5 rounded-[2px] ring-1 ring-black/25 cursor-nesw-resize',
        se: 'size-2.5 rounded-[2px] ring-1 ring-black/25 cursor-nwse-resize',
        sw: 'size-2.5 rounded-[2px] ring-1 ring-black/25 cursor-nesw-resize',
        n: 'h-1 w-7 rounded-full cursor-ns-resize',
        s: 'h-1 w-7 rounded-full cursor-ns-resize',
        e: 'h-7 w-1 rounded-full cursor-ew-resize',
        w: 'h-7 w-1 rounded-full cursor-ew-resize'
    }

    const CORNER_SHAPES = {
        nw: 'border-r-0 border-b-0 rounded-tl-[5px]',
        ne: 'border-l-0 border-b-0 rounded-tr-[5px]',
        se: 'border-l-0 border-t-0 rounded-br-[5px]',
        sw: 'border-r-0 border-t-0 rounded-bl-[5px]'
    } as const

    let {
        ref = $bindable(null),
        src = null,
        alt = 'Image to crop',
        mode = config.defaultVariants.mode,
        aspect = 1,
        shape = config.defaultVariants.shape,
        zoom = $bindable(1),
        minZoom = 1,
        maxZoom = 3,
        zoomStep = 0.25,
        rotation = $bindable(0),
        flipX = $bindable(false),
        flipY = $bindable(false),
        area = $bindable(),
        value = $bindable(null),
        autoCrop = false,
        wheelZoom = 'always',
        padding = 16,
        minCropSize = 48,
        grid = false,
        toolbar = true,
        zoomSlider = true,
        rotationSlider = false,
        crossorigin = 'anonymous',
        output,
        api = $bindable(),
        onCrop,
        onLoad,
        onAreaChange,
        onCropStart,
        onCropEnd,
        onError,
        color = config.defaultVariants.color,
        size,
        disabled = false,
        icons,
        label = 'Image cropper',
        labels,
        placeholder,
        toolbarSlot,
        footer,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const resolvedIcons = $derived({
        zoomIn: icons?.zoomIn ?? baseIcons.zoomIn,
        zoomOut: icons?.zoomOut ?? 'lucide:zoom-out',
        rotateLeft: icons?.rotateLeft ?? 'lucide:rotate-ccw',
        rotateRight: icons?.rotateRight ?? 'lucide:rotate-cw',
        flipHorizontal: icons?.flipHorizontal ?? 'lucide:flip-horizontal-2',
        flipVertical: icons?.flipVertical ?? 'lucide:flip-vertical-2',
        reset: icons?.reset ?? 'lucide:refresh-cw',
        placeholder: icons?.placeholder ?? 'lucide:image',
        loading: icons?.loading ?? baseIcons.loading,
        error: icons?.error ?? 'lucide:image-off'
    })

    const resolvedLabels = $derived({
        zoomIn: labels?.zoomIn ?? 'Zoom in',
        zoomOut: labels?.zoomOut ?? 'Zoom out',
        rotateLeft: labels?.rotateLeft ?? 'Rotate left',
        rotateRight: labels?.rotateRight ?? 'Rotate right',
        flipHorizontal: labels?.flipHorizontal ?? 'Flip horizontally',
        flipVertical: labels?.flipVertical ?? 'Flip vertically',
        reset: labels?.reset ?? 'Reset',
        zoom: labels?.zoom ?? 'Zoom',
        rotation: labels?.rotation ?? 'Rotation',
        empty: labels?.empty ?? 'No image selected',
        loading: labels?.loading ?? 'Loading image',
        error: labels?.error ?? 'Could not load the image',
        hint: labels?.hint ?? 'Use the arrow keys to move, plus and minus to zoom, and R to rotate.'
    })

    const defaultToolbar: ImageCropperToolbarItem[] = [
        'zoomOut',
        'zoomIn',
        'rotateLeft',
        'rotateRight',
        'flipHorizontal',
        'flipVertical',
        'reset'
    ]

    const toolbarItems = $derived(
        toolbar === false ? [] : toolbar === true ? defaultToolbar : toolbar
    )

    let stageEl = $state<HTMLElement | null>(null)
    let imageEl = $state<HTMLImageElement | null>(null)
    let objectUrl = $state<string | null>(null)
    let natural = $state({ width: 0, height: 0 })
    let offset = $state<Point>({ x: 0, y: 0 })
    let boxRect = $state<Rect | null>(null)
    let dragging = $state(false)
    let failed = $state(false)

    const stage = useElementSize(() => stageEl)
    const stageSize = $derived({ width: stage.width, height: stage.height })

    $effect(() => {
        const source = src
        if (typeof source === 'string' || source === null || source === undefined) {
            objectUrl = null
            return
        }

        const url = URL.createObjectURL(source)
        objectUrl = url

        return () => URL.revokeObjectURL(url)
    })

    const resolvedSrc = $derived(typeof src === 'string' ? src : objectUrl)
    const loaded = $derived(natural.width > 0 && natural.height > 0)
    const status = $derived<ImageCropperStatus>(
        failed ? 'error' : resolvedSrc ? 'loading' : 'empty'
    )
    const resolvedAspect = $derived<number | 'free'>(shape === 'circle' ? 1 : aspect)

    const innerArea = $derived({
        width: Math.max(0, stageSize.width - padding * 2),
        height: Math.max(0, stageSize.height - padding * 2)
    })
    const fixedFrame: Rect = $derived(computeFrame(stageSize, resolvedAspect, padding))

    const baseScale: number = $derived.by(() => {
        if (!loaded) return 1
        if (mode === 'box') return containScale(natural, innerArea, rotation)
        return coverScale(natural, fixedFrame, rotation, EDGE_MARGIN)
    })
    const scale = $derived(baseScale * zoom)

    const transform = $derived<ImageTransform>({
        centerX: stageSize.width / 2 + offset.x,
        centerY: stageSize.height / 2 + offset.y,
        rotation,
        scale,
        flipX,
        flipY,
        natural
    })

    const imageRect: Rect = $derived.by(() => {
        const box = rotateSize(natural, rotation)
        const width = box.width * scale
        const height = box.height * scale

        return {
            x: transform.centerX - width / 2,
            y: transform.centerY - height / 2,
            width,
            height
        }
    })

    const cropBounds: Rect = $derived(
        intersectRect(imageRect, {
            x: 0,
            y: 0,
            width: stageSize.width,
            height: stageSize.height
        })
    )

    const boxFrame: Rect = $derived(centerFrameWithin(cropBounds, resolvedAspect))
    const cropRect: Rect = $derived(mode === 'box' ? (boxRect ?? boxFrame) : fixedFrame)

    let sliderRotation = $state(0)

    $effect(() => {
        const current = rotation

        untrack(() => {
            const signed = current > 180 ? current - 360 : current
            if (signed === sliderRotation) return
            if (signed === 180 && sliderRotation === -180) return
            sliderRotation = signed
        })
    })

    const resolvedMinCropSize = $derived(
        Math.max(
            1,
            Math.min(minCropSize, cropBounds.width || minCropSize, cropBounds.height || minCropSize)
        )
    )
    const currentArea = $derived(
        loaded ? toSourceArea(transform, cropRect) : { x: 0, y: 0, width: 0, height: 0 }
    )
    const imageStyle = $derived(
        `position: absolute; left: 0; top: 0; width: ${natural.width}px; height: ${natural.height}px; transform: ${toCssTransform(transformOps(transform))};`
    )
    const frameStyle = $derived(
        `position: absolute; left: ${cropRect.x}px; top: ${cropRect.y}px; width: ${cropRect.width}px; height: ${cropRect.height}px;`
    )
    const gridStyle = 'position: absolute; inset: 0;'

    function rectEquals(a: Rect, b: Rect) {
        return (
            Math.abs(a.x - b.x) < 0.01 &&
            Math.abs(a.y - b.y) < 0.01 &&
            Math.abs(a.width - b.width) < 0.01 &&
            Math.abs(a.height - b.height) < 0.01
        )
    }

    function normalizeBox() {
        if (mode !== 'box') {
            if (boxRect !== null) boxRect = null
            return
        }

        const current = boxRect ?? boxFrame
        const clamped = fitRectWithin(current, cropBounds, resolvedAspect)
        if (boxRect === null || !rectEquals(clamped, current)) boxRect = clamped
    }

    function normalize() {
        if (!loaded || stageSize.width === 0 || stageSize.height === 0) return

        normalizeBox()

        const center = constrainCenter(transform, cropRect, EDGE_MARGIN)
        const next = {
            x: center.x - stageSize.width / 2,
            y: center.y - stageSize.height / 2
        }
        if (Math.abs(next.x - offset.x) > 0.01 || Math.abs(next.y - offset.y) > 0.01) offset = next
    }

    $effect(() => {
        void [
            stageSize.width,
            stageSize.height,
            natural.width,
            natural.height,
            zoom,
            rotation,
            mode,
            resolvedAspect,
            padding
        ]
        untrack(() => {
            normalize()
            if (pendingArea) applyArea(pendingArea)
        })
    })

    let syncedArea: Rect | null = null
    let pendingArea: Rect | null = null

    function applyArea(source: Rect) {
        if (source.width <= 0 || source.height <= 0) return

        if (!loaded || cropRect.width === 0 || stageSize.width === 0) {
            pendingArea = source
            return
        }

        if (mode === 'box') {
            pendingArea = null
            boxRect = fitRectWithin(toStageRect(transform, source), cropBounds, resolvedAspect)
            normalize()
            return
        }

        pendingArea = null
        zoom = clamp(scaleForArea(source, cropRect, rotation) / baseScale, minZoom, maxZoom)

        const center = centerForArea(transform, source, cropRect)
        offset = { x: center.x - stageSize.width / 2, y: center.y - stageSize.height / 2 }
        normalize()
    }

    $effect(() => {
        const next = currentArea
        if (!loaded || next.width <= 0 || next.height <= 0) return

        untrack(() => {
            if (syncedArea && areaEquals(syncedArea, next)) return
            syncedArea = next
            area = next
            onAreaChange?.(next)
        })
    })

    $effect(() => {
        const incoming = area
        if (!incoming || !loaded) return

        untrack(() => {
            if (syncedArea && areaEquals(syncedArea, incoming)) return
            applyArea(incoming)
            syncedArea = currentArea
            area = syncedArea
        })
    })

    function applyNatural(image: HTMLImageElement) {
        const sameImage =
            loaded && natural.width === image.naturalWidth && natural.height === image.naturalHeight
        if (sameImage) return

        natural = { width: image.naturalWidth, height: image.naturalHeight }
        offset = { x: 0, y: 0 }
        boxRect = null
        failed = false
        zoom = clamp(zoom, minZoom, maxZoom)
        normalize()

        if (!syncedArea && area) applyArea(area)

        onLoad?.({ width: natural.width, height: natural.height })
    }

    function handleLoad(event: Event) {
        applyNatural(event.currentTarget as HTMLImageElement)
    }

    function handleImageError() {
        natural = { width: 0, height: 0 }
        failed = true
        onError?.({ code: 'load', message: 'The image failed to load' })
    }

    let seenSrc: string | null = null

    $effect(() => {
        const current = resolvedSrc

        untrack(() => {
            natural = { width: 0, height: 0 }
            offset = { x: 0, y: 0 }
            boxRect = null
            failed = false

            if (seenSrc !== null && seenSrc !== current) {
                zoom = clamp(1, minZoom, maxZoom)
                rotation = 0
                flipX = false
                flipY = false
            }

            seenSrc = current
        })
    })

    $effect(() => {
        const image = imageEl
        const ready = Boolean(image?.complete) && (image?.naturalWidth ?? 0) > 0

        untrack(() => {
            if (!image || !ready || natural.width > 0) return
            applyNatural(image)
        })
    })

    let syncedAspect: number | 'free' = untrack(() => resolvedAspect)

    $effect(() => {
        const next = resolvedAspect

        untrack(() => {
            if (next === syncedAspect) return
            syncedAspect = next
            boxRect = null
            normalize()
        })
    })

    $effect(() => {
        const current = zoom
        const min = minZoom
        const max = maxZoom

        untrack(() => {
            const clamped = clamp(current, min, max)
            if (clamped !== current) zoom = clamped
        })
    })

    function resetView() {
        zoom = clamp(1, minZoom, maxZoom)
        rotation = 0
        flipX = false
        flipY = false
        offset = { x: 0, y: 0 }
        boxRect = null
        normalize()
    }

    function zoomTo(next: number, origin?: Point) {
        if (disabled || !loaded) return

        const clamped = clamp(next, minZoom, maxZoom)
        if (origin && zoom > 0 && clamped !== zoom) {
            const ratio = clamped / zoom
            const x = origin.x - (origin.x - transform.centerX) * ratio
            const y = origin.y - (origin.y - transform.centerY) * ratio
            offset = { x: x - stageSize.width / 2, y: y - stageSize.height / 2 }
        }

        zoom = clamped
        normalize()
    }

    function zoomIn() {
        zoomTo(zoom + zoomStep)
    }

    function zoomOut() {
        zoomTo(zoom - zoomStep)
    }

    function rotateTo(degrees: number) {
        if (disabled || !loaded) return

        rotation = normalizeRotation(degrees)
        normalize()
    }

    function rotate(degrees: number) {
        rotateTo(rotation + degrees)
    }

    function flip(axis: 'horizontal' | 'vertical') {
        if (disabled || !loaded) return

        if (axis === 'horizontal') flipX = !flipX
        else flipY = !flipY
    }

    function stagePoint(event: PointerEvent): Point {
        const rect = stageEl?.getBoundingClientRect()
        if (!rect) return { x: event.clientX, y: event.clientY }

        return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }

    function containsPoint(rect: Rect, point: Point) {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        )
    }

    const pointers = new SvelteMap<number, Point>()
    let gesture: 'pan' | 'move' | 'resize' | 'pinch' | null = null
    let activeHandle: ResizeHandle | null = null
    let startPointer: Point = { x: 0, y: 0 }
    let startOffset: Point = { x: 0, y: 0 }
    let startRect: Rect = { x: 0, y: 0, width: 0, height: 0 }
    let lastPointer: Point = { x: 0, y: 0 }
    let pinchStartDistance = 0
    let pinchStartZoom = 1
    let rafId = 0

    function distance(a: Point, b: Point) {
        return Math.hypot(a.x - b.x, a.y - b.y)
    }

    function capturePointer(pointerId: number) {
        try {
            stageEl?.setPointerCapture(pointerId)
        } catch {
            return
        }
    }

    function resolveGesture(event: PointerEvent, handle: ResizeHandle | null) {
        if (mode !== 'box') return 'pan' as const
        if (handle) return 'resize' as const

        return containsPoint(cropRect, stagePoint(event)) ? ('move' as const) : ('pan' as const)
    }

    function startPinch() {
        const [first, second] = [...pointers.values()]
        pinchStartDistance = distance(first, second)
        pinchStartZoom = zoom
        gesture = 'pinch'
    }

    function handlePointerDown(event: PointerEvent) {
        if (disabled || !loaded) return
        if (event.button !== 0 && event.pointerType === 'mouse') return

        const target = event.target as HTMLElement
        const handle = (target.dataset.handle ?? null) as ResizeHandle | null

        capturePointer(event.pointerId)
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

        if (pointers.size === 2) {
            startPinch()
            return
        }

        startPointer = { x: event.clientX, y: event.clientY }
        lastPointer = { ...startPointer }
        startOffset = { ...offset }
        startRect = { ...cropRect }
        activeHandle = handle
        dragging = true
        gesture = resolveGesture(event, handle)
        onCropStart?.(currentArea)
    }

    function flushDrag() {
        applyDrag(lastPointer.x - startPointer.x, lastPointer.y - startPointer.y)
    }

    function applyDrag(dx: number, dy: number) {
        if (gesture === 'pan') {
            offset = { x: startOffset.x + dx, y: startOffset.y + dy }
            normalize()
        } else if (gesture === 'move') {
            boxRect = moveRect(startRect, { x: dx, y: dy }, cropBounds)
        } else if (gesture === 'resize' && activeHandle) {
            boxRect = resizeRect(
                startRect,
                activeHandle,
                { x: dx, y: dy },
                {
                    aspect: resolvedAspect,
                    minSize: resolvedMinCropSize,
                    bounds: cropBounds
                }
            )
            normalize()
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!pointers.has(event.pointerId)) return
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

        if (pointers.size === 2) {
            const [first, second] = [...pointers.values()]
            const current = distance(first, second)
            if (pinchStartDistance > 0) {
                const rect = stageEl?.getBoundingClientRect()
                const origin = rect
                    ? {
                          x: (first.x + second.x) / 2 - rect.left,
                          y: (first.y + second.y) / 2 - rect.top
                      }
                    : undefined
                zoomTo((pinchStartZoom * current) / pinchStartDistance, origin)
            }
            return
        }

        if (!gesture || gesture === 'pinch') return

        lastPointer = { x: event.clientX, y: event.clientY }

        if (rafId) return
        rafId = requestAnimationFrame(() => {
            rafId = 0
            flushDrag()
        })
    }

    function handlePointerUp(event: PointerEvent) {
        if (!pointers.has(event.pointerId)) return
        pointers.delete(event.pointerId)

        if (pointers.size < 2) pinchStartDistance = 0
        if (pointers.size > 0) return

        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = 0
        }

        if (gesture && gesture !== 'pinch') {
            lastPointer = { x: event.clientX, y: event.clientY }
            flushDrag()
        }

        dragging = false
        gesture = null
        activeHandle = null
        normalize()
        onCropEnd?.(currentArea)
    }

    function arrowDelta(event: KeyboardEvent): Point | null {
        const step = event.shiftKey ? 10 : 1

        if (event.key === 'ArrowLeft') return { x: -step, y: 0 }
        if (event.key === 'ArrowRight') return { x: step, y: 0 }
        if (event.key === 'ArrowUp') return { x: 0, y: -step }
        if (event.key === 'ArrowDown') return { x: 0, y: step }

        return null
    }

    function runShortcut(event: KeyboardEvent) {
        if (event.key === '+' || event.key === '=') zoomIn()
        else if (event.key === '-') zoomOut()
        else if (event.key === '0') resetView()
        else if (event.key === 'r' || event.key === 'R') rotate(event.shiftKey ? -90 : 90)
        else return false

        return true
    }

    function handleKeydown(event: KeyboardEvent) {
        if (disabled || !loaded) return

        const delta = arrowDelta(event)
        if (!delta) {
            if (runShortcut(event)) event.preventDefault()
            return
        }

        event.preventDefault()

        if (mode === 'box') {
            boxRect = moveRect(cropRect, delta, cropBounds)
            return
        }

        offset = { x: offset.x - delta.x, y: offset.y - delta.y }
        normalize()
    }

    function handleHandleKeydown(event: KeyboardEvent, handle: ResizeHandle) {
        if (disabled || !loaded || mode !== 'box') return

        const delta = arrowDelta(event)
        if (!delta) return

        event.preventDefault()
        event.stopPropagation()
        boxRect = resizeRect(cropRect, handle, delta, {
            aspect: resolvedAspect,
            minSize: resolvedMinCropSize,
            bounds: cropBounds
        })
        normalize()
    }

    $effect(() => {
        return () => {
            if (rafId) cancelAnimationFrame(rafId)
        }
    })

    const autoCropEnabled = $derived(autoCrop !== false)
    const autoCropDelay = $derived(typeof autoCrop === 'number' ? autoCrop : 300)

    $effect(() => {
        if (!autoCropEnabled || !loaded || disabled || dragging) return

        void currentArea
        void flipX
        void flipY

        const id = setTimeout(() => void crop(), autoCropDelay)

        return () => clearTimeout(id)
    })

    function handleDoubleClick(event: MouseEvent) {
        if (disabled || !loaded) return

        const target = event.target as HTMLElement
        if (target.dataset.handle) return

        const rect = stageEl?.getBoundingClientRect()
        const origin = rect
            ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
            : undefined

        zoomTo(zoom > minZoom ? minZoom : Math.min(2, maxZoom), origin)
    }

    function handleWheel(event: WheelEvent) {
        if (disabled || !loaded || wheelZoom === false) return
        if (wheelZoom === 'ctrl' && !event.ctrlKey && !event.metaKey) return

        event.preventDefault()
        const rect = stageEl?.getBoundingClientRect()
        const origin = rect
            ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
            : undefined
        const factor = event.deltaY < 0 ? 1 + zoomStep : 1 / (1 + zoomStep)
        zoomTo(zoom * factor, origin)
    }

    useEventListener(() => stageEl, 'wheel', handleWheel as EventListener, { passive: false })

    const outputOptions = $derived({
        type: output?.type ?? 'image/png',
        quality: output?.quality ?? 0.92,
        maxWidth: output?.maxWidth,
        maxHeight: output?.maxHeight,
        background: output?.background ?? (output?.type === 'image/jpeg' ? '#ffffff' : undefined)
    })

    function canCrop() {
        return Boolean(imageEl) && loaded && cropRect.width > 0 && cropRect.height > 0
    }

    function reportEmptyCrop() {
        onError?.({
            code: 'empty',
            message: loaded ? 'The crop area is empty' : 'No image is loaded'
        })
    }

    function reportExportError(error: unknown) {
        const tainted = error instanceof DOMException && error.name === 'SecurityError'
        onError?.({
            code: tainted ? 'tainted' : 'export',
            message: tainted
                ? 'The canvas is tainted by a cross-origin image'
                : 'Failed to export the crop',
            cause: error
        })
    }

    function paintCrop(canvas: HTMLCanvasElement, image: HTMLImageElement, outputScale: number) {
        const context = canvas.getContext('2d')
        if (!context) return false

        renderCrop(context, {
            image,
            transform,
            crop: cropRect,
            outputScale,
            width: canvas.width,
            height: canvas.height,
            circle: shape === 'circle',
            background: outputOptions.background
        })

        return true
    }

    export async function crop(): Promise<ImageCropperResult | null> {
        if (!canCrop()) {
            reportEmptyCrop()

            return null
        }

        const { type, quality } = outputOptions

        try {
            const outputScale = resolveOutputScale(cropRect, scale, {
                maxWidth: outputOptions.maxWidth,
                maxHeight: outputOptions.maxHeight
            })
            const canvas = document.createElement('canvas')
            canvas.width = Math.max(1, Math.round(cropRect.width * outputScale))
            canvas.height = Math.max(1, Math.round(cropRect.height * outputScale))

            if (!paintCrop(canvas, imageEl!, outputScale)) {
                onError?.({ code: 'export', message: 'Canvas 2D context is unavailable' })
                return null
            }

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, type, quality)
            )

            if (!blob) {
                onError?.({ code: 'export', message: 'The browser could not encode the crop' })
                return null
            }

            const sourceName = src instanceof File ? src.name : undefined
            const file = new File([blob], outputFileName(sourceName, type), { type })
            const result: ImageCropperResult = {
                blob,
                file,
                width: canvas.width,
                height: canvas.height,
                area: currentArea,
                rotation,
                zoom,
                flipX,
                flipY
            }

            value = file
            onCrop?.(result)
            emit.onChange()

            return result
        } catch (error) {
            reportExportError(error)

            return null
        }
    }

    export function reset() {
        resetView()
    }

    const currentApi = $derived<ImageCropperApi>({
        crop,
        reset: resetView,
        zoomIn,
        zoomOut,
        zoomTo: (next: number) => zoomTo(next),
        rotate,
        rotateTo,
        flip,
        get area() {
            return currentArea
        },
        get zoom() {
            return zoom
        },
        get rotation() {
            return rotation
        }
    })

    $effect(() => {
        api = currentApi
    })

    const variantSlots = $derived(
        imageCropperVariants({
            color: resolvedColor,
            size: resolvedSize,
            shape,
            mode,
            disabled,
            dragging
        })
    )

    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: variantSlots.root({ class: [config.slots.root, className, u.root] }),
            stage: variantSlots.stage({ class: [config.slots.stage, u.stage] }),
            image: variantSlots.image({ class: [config.slots.image, u.image] }),
            frame: variantSlots.frame({ class: [config.slots.frame, u.frame] }),
            grid: variantSlots.grid({ class: [config.slots.grid, u.grid] }),
            placeholder: variantSlots.placeholder({
                class: [config.slots.placeholder, u.placeholder]
            }),
            toolbar: variantSlots.toolbar({ class: [config.slots.toolbar, u.toolbar] }),
            control: variantSlots.control({ class: [config.slots.control, u.control] }),
            controls: variantSlots.controls({ class: [config.slots.controls, u.controls] }),
            sliderWrapper: variantSlots.sliderWrapper({
                class: [config.slots.sliderWrapper, u.sliderWrapper]
            }),
            sliderIcon: variantSlots.sliderIcon({ class: [config.slots.sliderIcon, u.sliderIcon] }),
            rotationRange: variantSlots.rotationRange({
                class: [config.slots.rotationRange, u.rotationRange]
            }),
            slider: variantSlots.slider({ class: [config.slots.slider, u.slider] }),
            hint: variantSlots.hint({ class: [config.slots.hint, u.hint] })
        }
    })

    const toolbarActions: Record<
        ImageCropperToolbarItem,
        { icon: string; label: string; action: () => void }
    > = $derived({
        zoomOut: { icon: resolvedIcons.zoomOut, label: resolvedLabels.zoomOut, action: zoomOut },
        zoomIn: { icon: resolvedIcons.zoomIn, label: resolvedLabels.zoomIn, action: zoomIn },
        rotateLeft: {
            icon: resolvedIcons.rotateLeft,
            label: resolvedLabels.rotateLeft,
            action: () => rotate(-90)
        },
        rotateRight: {
            icon: resolvedIcons.rotateRight,
            label: resolvedLabels.rotateRight,
            action: () => rotate(90)
        },
        flipHorizontal: {
            icon: resolvedIcons.flipHorizontal,
            label: resolvedLabels.flipHorizontal,
            action: () => flip('horizontal')
        },
        flipVertical: {
            icon: resolvedIcons.flipVertical,
            label: resolvedLabels.flipVertical,
            action: () => flip('vertical')
        },
        reset: { icon: resolvedIcons.reset, label: resolvedLabels.reset, action: resetView }
    })

    function handleClass(handle: ResizeHandle): string {
        return variantSlots.handle({
            class: [config.slots.handle, HANDLE_SHAPES[handle], ui?.handle]
        })
    }

    function cornerClass(corner: (typeof CORNERS)[number]): string {
        return variantSlots.corner({
            class: [config.slots.corner, CORNER_SHAPES[corner], ui?.corner]
        })
    }

    function cornerStyle(corner: (typeof CORNERS)[number]): string {
        const x = corner.includes('w') ? 'left: -1px;' : 'right: -1px;'
        const y = corner.includes('n') ? 'top: -1px;' : 'bottom: -1px;'

        return `position: absolute; ${x} ${y}`
    }

    function handleStyle(handle: ResizeHandle): string {
        const x = handle.includes('w') ? '0%' : handle.includes('e') ? '100%' : '50%'
        const y = handle.includes('n') ? '0%' : handle.includes('s') ? '100%' : '50%'

        return `position: absolute; left: ${x}; top: ${y}; transform: translate(-50%, -50%);`
    }

    function handleLabel(handle: ResizeHandle): string {
        const override = labels?.handles?.[handle]
        if (override) return override

        const vertical = handle.includes('n') ? 'top' : handle.includes('s') ? 'bottom' : ''
        const horizontal = handle.includes('w') ? 'left' : handle.includes('e') ? 'right' : ''

        return `Resize crop from ${[vertical, horizontal].filter(Boolean).join(' ')}`
    }

    const showHandles = $derived(mode === 'box' && shape === 'rect' && loaded && !disabled)
    const showCorners = $derived(shape === 'rect' && loaded && !showHandles)
</script>

<div {...restProps} bind:this={ref} class={classes.root} data-mode={mode}>
    {#if toolbarSlot}
        {@render toolbarSlot({ api: currentApi })}
    {:else if toolbarItems.length > 0}
        <div class={classes.toolbar}>
            {#each toolbarItems as item (item)}
                {@const entry = toolbarActions[item]}
                <Tooltip
                    text={entry.label}
                    side="bottom"
                    portal={false}
                    delayDuration={200}
                    ignoreNonKeyboardFocus
                    class="inline-flex"
                >
                    <Button
                        variant="ghost"
                        color="surface"
                        size={resolvedSize}
                        icon={entry.icon}
                        square
                        class={classes.control}
                        disabled={disabled || !loaded}
                        aria-label={entry.label}
                        onclick={entry.action}
                    />
                </Tooltip>
            {/each}
        </div>
    {/if}

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        bind:this={stageEl}
        class={classes.stage}
        style="position: relative;"
        role="group"
        tabindex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled ? true : undefined}
        aria-describedby={ariaDescribedBy}
        data-dragging={dragging ? '' : undefined}
        onpointerdown={handlePointerDown}
        onpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointercancel={handlePointerUp}
        ondblclick={handleDoubleClick}
        onkeydown={handleKeydown}
        onfocus={() => emit.onFocus()}
        onblur={() => emit.onBlur()}
    >
        {#if resolvedSrc}
            <img
                bind:this={imageEl}
                src={resolvedSrc}
                {alt}
                class={classes.image}
                style={imageStyle}
                crossorigin={crossorigin ?? undefined}
                draggable="false"
                hidden={!loaded}
                onload={handleLoad}
                onerror={handleImageError}
            />
        {/if}

        {#if loaded}
            <div class={classes.frame} style={frameStyle}>
                {#if grid}
                    <div data-crop-grid class={classes.grid} style={gridStyle}></div>
                {/if}

                {#if showCorners}
                    {#each CORNERS as corner (corner)}
                        <span class={cornerClass(corner)} style={cornerStyle(corner)}></span>
                    {/each}
                {/if}

                {#if showHandles}
                    {#each HANDLES as handle (handle)}
                        <button
                            type="button"
                            class={handleClass(handle)}
                            style={handleStyle(handle)}
                            data-handle={handle}
                            aria-label={handleLabel(handle)}
                            onkeydown={(event) => handleHandleKeydown(event, handle)}
                        ></button>
                    {/each}
                {/if}
            </div>
        {:else}
            <div class={classes.placeholder} style="position: absolute; inset: 0;">
                {#if placeholder}
                    {@render placeholder({ status })}
                {:else if status === 'loading'}
                    <Icon name={resolvedIcons.loading} class="size-8 animate-spin" />
                    <span>{resolvedLabels.loading}</span>
                {:else if status === 'error'}
                    <Icon name={resolvedIcons.error} class="size-8" />
                    <span>{resolvedLabels.error}</span>
                {:else}
                    <Icon name={resolvedIcons.placeholder} class="size-8" />
                    <span>{resolvedLabels.empty}</span>
                {/if}
            </div>
        {/if}

        <span class={classes.hint}>{resolvedLabels.hint}</span>
    </div>

    {#if zoomSlider || rotationSlider || footer}
        <div class={classes.controls}>
            {#if zoomSlider}
                <div class={classes.sliderWrapper}>
                    <Icon name={resolvedIcons.zoomOut} class={classes.sliderIcon} />
                    <Slider
                        value={zoom}
                        min={minZoom}
                        max={maxZoom}
                        step={0.01}
                        color={resolvedColor}
                        size={resolvedSize}
                        disabled={disabled || !loaded}
                        class={classes.slider}
                        aria-label={resolvedLabels.zoom}
                        onValueChange={(next) => zoomTo(typeof next === 'number' ? next : next[0])}
                    />
                    <Icon name={resolvedIcons.zoomIn} class={classes.sliderIcon} />
                </div>
            {/if}

            {#if rotationSlider}
                <div class={classes.sliderWrapper}>
                    <Icon name={resolvedIcons.rotateLeft} class={classes.sliderIcon} />
                    <Slider
                        value={sliderRotation}
                        min={-180}
                        max={180}
                        step={1}
                        color={resolvedColor}
                        size={resolvedSize}
                        disabled={disabled || !loaded}
                        class={classes.slider}
                        aria-label={resolvedLabels.rotation}
                        ui={{ range: classes.rotationRange }}
                        onValueChange={(next) => {
                            sliderRotation = typeof next === 'number' ? next : next[0]
                            rotateTo(sliderRotation)
                        }}
                    />
                    <Icon name={resolvedIcons.rotateRight} class={classes.sliderIcon} />
                </div>
            {/if}

            {#if footer}
                {@render footer({ api: currentApi })}
            {/if}
        </div>
    {/if}
</div>
