export interface Size {
    width: number
    height: number
}

export interface Point {
    x: number
    y: number
}

export interface Rect extends Point, Size {}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export interface ImageTransform {
    centerX: number
    centerY: number
    rotation: number
    scale: number
    flipX: boolean
    flipY: boolean
    natural: Size
}

export type TransformOp =
    | { type: 'translate'; x: number; y: number }
    | { type: 'rotate'; radians: number }
    | { type: 'scale'; x: number; y: number }

export interface TransformTarget {
    translate: (x: number, y: number) => void
    rotate: (radians: number) => void
    scale: (x: number, y: number) => void
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

export function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180
}

export function normalizeRotation(degrees: number): number {
    return ((degrees % 360) + 360) % 360
}

export function rotateSize(size: Size, rotation: number): Size {
    const radians = toRadians(rotation)
    const cos = Math.abs(Math.cos(radians))
    const sin = Math.abs(Math.sin(radians))

    return {
        width: size.width * cos + size.height * sin,
        height: size.width * sin + size.height * cos
    }
}

export function containScale(natural: Size, area: Size, rotation: number): number {
    const box = rotateSize(natural, rotation)
    if (box.width === 0 || box.height === 0) return 1

    return Math.min(area.width / box.width, area.height / box.height)
}

export const EDGE_MARGIN = 1

export const FREE_FRAME_SCALE = 0.8

function inflate(size: Size, margin: number): Size {
    return { width: size.width + margin * 2, height: size.height + margin * 2 }
}

export function coverScale(natural: Size, area: Size, rotation: number, margin = 0): number {
    const box = rotateSize(inflate(area, margin), rotation)
    if (natural.width === 0 || natural.height === 0) return 1

    return Math.max(box.width / natural.width, box.height / natural.height)
}

export function transformOps(transform: ImageTransform): TransformOp[] {
    const { natural, scale, flipX, flipY } = transform

    return [
        { type: 'translate', x: transform.centerX, y: transform.centerY },
        { type: 'rotate', radians: toRadians(transform.rotation) },
        { type: 'scale', x: scale * (flipX ? -1 : 1), y: scale * (flipY ? -1 : 1) },
        { type: 'translate', x: -natural.width / 2, y: -natural.height / 2 }
    ]
}

export function toCssTransform(ops: TransformOp[]): string {
    return ops
        .map((op) => {
            if (op.type === 'translate') return `translate(${op.x}px, ${op.y}px)`
            if (op.type === 'rotate') return `rotate(${op.radians}rad)`
            return `scale(${op.x}, ${op.y})`
        })
        .join(' ')
}

export function applyTransform(target: TransformTarget, ops: TransformOp[]): void {
    for (const op of ops) {
        if (op.type === 'translate') target.translate(op.x, op.y)
        else if (op.type === 'rotate') target.rotate(op.radians)
        else target.scale(op.x, op.y)
    }
}

export function toLocalPoint(transform: ImageTransform, point: Point): Point {
    const { natural, scale, flipX, flipY } = transform
    const radians = toRadians(transform.rotation)
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)

    const dx = point.x - transform.centerX
    const dy = point.y - transform.centerY
    const rx = dx * cos + dy * sin
    const ry = -dx * sin + dy * cos

    const sx = scale * (flipX ? -1 : 1)
    const sy = scale * (flipY ? -1 : 1)

    return {
        x: (sx === 0 ? 0 : rx / sx) + natural.width / 2,
        y: (sy === 0 ? 0 : ry / sy) + natural.height / 2
    }
}

export function toStagePoint(transform: ImageTransform, local: Point): Point {
    const { natural, scale, flipX, flipY } = transform
    const radians = toRadians(transform.rotation)
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)

    const dx = (local.x - natural.width / 2) * scale * (flipX ? -1 : 1)
    const dy = (local.y - natural.height / 2) * scale * (flipY ? -1 : 1)

    return {
        x: transform.centerX + dx * cos - dy * sin,
        y: transform.centerY + dx * sin + dy * cos
    }
}

export function toStageRect(transform: ImageTransform, source: Rect): Rect {
    const corners = [
        { x: source.x, y: source.y },
        { x: source.x + source.width, y: source.y },
        { x: source.x + source.width, y: source.y + source.height },
        { x: source.x, y: source.y + source.height }
    ].map((corner) => toStagePoint(transform, corner))

    const xs = corners.map((corner) => corner.x)
    const ys = corners.map((corner) => corner.y)
    const left = Math.min(...xs)
    const top = Math.min(...ys)

    return { x: left, y: top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}

export function scaleForArea(source: Size, crop: Size, rotation: number): number {
    const box = rotateSize(source, rotation)
    if (box.width === 0 || box.height === 0) return 1

    return Math.min(crop.width / box.width, crop.height / box.height)
}

export function centerForArea(transform: ImageTransform, source: Rect, crop: Rect): Point {
    const { natural, scale, flipX, flipY } = transform
    const radians = toRadians(transform.rotation)
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)

    const dx = (source.x + source.width / 2 - natural.width / 2) * scale * (flipX ? -1 : 1)
    const dy = (source.y + source.height / 2 - natural.height / 2) * scale * (flipY ? -1 : 1)

    return {
        x: crop.x + crop.width / 2 - (dx * cos - dy * sin),
        y: crop.y + crop.height / 2 - (dx * sin + dy * cos)
    }
}

export function areaEquals(a: Rect, b: Rect, tolerance = 0.5): boolean {
    return (
        Math.abs(a.x - b.x) <= tolerance &&
        Math.abs(a.y - b.y) <= tolerance &&
        Math.abs(a.width - b.width) <= tolerance &&
        Math.abs(a.height - b.height) <= tolerance
    )
}

export function toSourceArea(transform: ImageTransform, crop: Rect): Rect {
    const corners: Point[] = [
        { x: crop.x, y: crop.y },
        { x: crop.x + crop.width, y: crop.y },
        { x: crop.x + crop.width, y: crop.y + crop.height },
        { x: crop.x, y: crop.y + crop.height }
    ].map((corner) => toLocalPoint(transform, corner))

    const xs = corners.map((corner) => corner.x)
    const ys = corners.map((corner) => corner.y)
    const left = clamp(Math.min(...xs), 0, transform.natural.width)
    const top = clamp(Math.min(...ys), 0, transform.natural.height)
    const right = clamp(Math.max(...xs), 0, transform.natural.width)
    const bottom = clamp(Math.max(...ys), 0, transform.natural.height)

    return { x: left, y: top, width: right - left, height: bottom - top }
}

export function constrainCenter(transform: ImageTransform, crop: Rect, margin = 0): Point {
    const radians = toRadians(transform.rotation)
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    const box = rotateSize(inflate(crop, margin), transform.rotation)

    const maxX = Math.max(0, (transform.natural.width * transform.scale - box.width) / 2)
    const maxY = Math.max(0, (transform.natural.height * transform.scale - box.height) / 2)

    const cropCenterX = crop.x + crop.width / 2
    const cropCenterY = crop.y + crop.height / 2
    const dx = cropCenterX - transform.centerX
    const dy = cropCenterY - transform.centerY

    const rx = clamp(dx * cos + dy * sin, -maxX, maxX)
    const ry = clamp(-dx * sin + dy * cos, -maxY, maxY)

    return {
        x: cropCenterX - (rx * cos - ry * sin),
        y: cropCenterY - (rx * sin + ry * cos)
    }
}

export function computeFrame(stage: Size, aspect: number | 'free', padding: number): Rect {
    const width = Math.max(0, stage.width - padding * 2)
    const height = Math.max(0, stage.height - padding * 2)
    if (width === 0 || height === 0) return { x: padding, y: padding, width, height }
    if (aspect === 'free') return { x: padding, y: padding, width, height }

    const ratio = aspect > 0 ? aspect : 1
    let frameWidth = width
    let frameHeight = width / ratio
    if (frameHeight > height) {
        frameHeight = height
        frameWidth = height * ratio
    }

    return {
        x: (stage.width - frameWidth) / 2,
        y: (stage.height - frameHeight) / 2,
        width: frameWidth,
        height: frameHeight
    }
}

export function clampRectWithin(rect: Rect, bounds: Rect): Rect {
    const width = Math.min(rect.width, bounds.width)
    const height = Math.min(rect.height, bounds.height)

    return {
        x: clamp(rect.x, bounds.x, bounds.x + bounds.width - width),
        y: clamp(rect.y, bounds.y, bounds.y + bounds.height - height),
        width,
        height
    }
}

export function centerFrameWithin(
    bounds: Rect,
    aspect: number | 'free',
    freeScale: number = FREE_FRAME_SCALE
): Rect {
    if (aspect === 'free' || aspect <= 0) {
        const freeWidth = bounds.width * freeScale
        const freeHeight = bounds.height * freeScale

        return {
            x: bounds.x + (bounds.width - freeWidth) / 2,
            y: bounds.y + (bounds.height - freeHeight) / 2,
            width: freeWidth,
            height: freeHeight
        }
    }

    let width = bounds.width
    let height = width / aspect
    if (height > bounds.height) {
        height = bounds.height
        width = height * aspect
    }

    return {
        x: bounds.x + (bounds.width - width) / 2,
        y: bounds.y + (bounds.height - height) / 2,
        width,
        height
    }
}

export function fitRectWithin(rect: Rect, bounds: Rect, aspect: number | 'free'): Rect {
    if (aspect === 'free' || aspect <= 0) return clampRectWithin(rect, bounds)

    let width = Math.min(rect.width, bounds.width)
    let height = width / aspect
    if (height > bounds.height) {
        height = bounds.height
        width = height * aspect
    }

    return clampRectWithin({ x: rect.x, y: rect.y, width, height }, bounds)
}

export function intersectRect(a: Rect, b: Rect): Rect {
    const left = Math.max(a.x, b.x)
    const top = Math.max(a.y, b.y)
    const right = Math.min(a.x + a.width, b.x + b.width)
    const bottom = Math.min(a.y + a.height, b.y + b.height)

    return { x: left, y: top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) }
}

export function moveRect(rect: Rect, delta: Point, bounds: Rect): Rect {
    return clampRectWithin({ ...rect, x: rect.x + delta.x, y: rect.y + delta.y }, bounds)
}

interface RectEdges {
    left: number
    top: number
    right: number
    bottom: number
}

interface HandleAxes {
    left: boolean
    right: boolean
    top: boolean
    bottom: boolean
}

function handleAxes(handle: ResizeHandle): HandleAxes {
    return {
        left: handle.includes('w'),
        right: handle.includes('e'),
        top: handle.includes('n'),
        bottom: handle.includes('s')
    }
}

function moveEdges(
    rect: Rect,
    axes: HandleAxes,
    delta: Point,
    limits: { minSize: number; bounds: Rect }
): RectEdges {
    const { minSize, bounds } = limits
    const left = rect.x
    const top = rect.y
    const right = rect.x + rect.width
    const bottom = rect.y + rect.height

    return {
        left: axes.left ? clamp(left + delta.x, bounds.x, right - minSize) : left,
        right: axes.right ? clamp(right + delta.x, left + minSize, bounds.x + bounds.width) : right,
        top: axes.top ? clamp(top + delta.y, bounds.y, bottom - minSize) : top,
        bottom: axes.bottom
            ? clamp(bottom + delta.y, top + minSize, bounds.y + bounds.height)
            : bottom
    }
}

function applyAspect(edges: RectEdges, axes: HandleAxes, aspect: number): RectEdges {
    if (axes.left || axes.right) {
        const target = (edges.right - edges.left) / aspect
        if (axes.top) return { ...edges, top: edges.bottom - target }
        if (axes.bottom) return { ...edges, bottom: edges.top + target }

        const center = (edges.top + edges.bottom) / 2

        return { ...edges, top: center - target / 2, bottom: center + target / 2 }
    }

    const target = (edges.bottom - edges.top) * aspect
    if (axes.left) return { ...edges, left: edges.right - target }
    if (axes.right) return { ...edges, right: edges.left + target }

    const center = (edges.left + edges.right) / 2

    return { ...edges, left: center - target / 2, right: center + target / 2 }
}

function isWithin(rect: Rect, bounds: Rect): boolean {
    return (
        rect.x >= bounds.x - 0.01 &&
        rect.y >= bounds.y - 0.01 &&
        rect.x + rect.width <= bounds.x + bounds.width + 0.01 &&
        rect.y + rect.height <= bounds.y + bounds.height + 0.01
    )
}

export function resizeRect(
    rect: Rect,
    handle: ResizeHandle,
    delta: Point,
    options: { aspect: number | 'free'; minSize: number; bounds: Rect }
): Rect {
    const { aspect, minSize, bounds } = options
    const axes = handleAxes(handle)
    const moved = moveEdges(rect, axes, delta, { minSize, bounds })
    const locked = aspect === 'free' || aspect <= 0
    const edges = locked ? moved : applyAspect(moved, axes, aspect)
    const candidate: Rect = {
        x: edges.left,
        y: edges.top,
        width: Math.max(minSize, edges.right - edges.left),
        height: Math.max(minSize, edges.bottom - edges.top)
    }

    if (locked) return clampRectWithin(candidate, bounds)

    return isWithin(candidate, bounds) ? candidate : rect
}

export interface RenderCropOptions {
    image: CanvasImageSource
    transform: ImageTransform
    crop: Rect
    outputScale: number
    width: number
    height: number
    circle?: boolean
    background?: string
}

export function renderCrop(context: CanvasRenderingContext2D, options: RenderCropOptions): void {
    const { crop, outputScale, width, height, transform } = options

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'

    if (options.background) {
        context.fillStyle = options.background
        context.fillRect(0, 0, width, height)
    }

    if (options.circle) {
        context.beginPath()
        context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
        context.clip()
    }

    context.setTransform(
        outputScale,
        0,
        0,
        outputScale,
        -crop.x * outputScale,
        -crop.y * outputScale
    )
    applyTransform(context, transformOps(transform))
    context.drawImage(options.image, 0, 0, transform.natural.width, transform.natural.height)
}

export function resolveOutputScale(
    crop: Size,
    scale: number,
    limits?: { maxWidth?: number; maxHeight?: number }
): number {
    if (crop.width === 0 || crop.height === 0 || scale === 0) return 1

    let output = 1 / scale
    if (limits?.maxWidth) output = Math.min(output, limits.maxWidth / crop.width)
    if (limits?.maxHeight) output = Math.min(output, limits.maxHeight / crop.height)

    return output > 0 ? output : 1
}

export function extensionFor(type: string): string {
    if (type === 'image/jpeg') return 'jpg'
    if (type === 'image/webp') return 'webp'
    return 'png'
}

export function outputFileName(name: string | undefined, type: string): string {
    const extension = extensionFor(type)
    if (!name) return `crop.${extension}`

    const base = name.replace(/\.[^./\\]+$/, '') || 'crop'

    return `${base}-cropped.${extension}`
}
