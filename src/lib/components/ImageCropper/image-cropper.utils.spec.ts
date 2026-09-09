import { describe, expect, it } from 'vitest'
import {
    applyTransform,
    centerFrameWithin,
    clamp,
    clampRectWithin,
    computeFrame,
    constrainCenter,
    containScale,
    coverScale,
    extensionFor,
    intersectRect,
    moveRect,
    normalizeRotation,
    outputFileName,
    renderCrop,
    resizeRect,
    resolveOutputScale,
    rotateSize,
    toCssTransform,
    toLocalPoint,
    toSourceArea,
    transformOps,
    type ImageTransform,
    type TransformOp
} from './image-cropper.utils.js'

const baseTransform: ImageTransform = {
    centerX: 100,
    centerY: 50,
    rotation: 0,
    scale: 1,
    flipX: false,
    flipY: false,
    natural: { width: 200, height: 100 }
}

describe('image cropper geometry', () => {
    it('clamps values into range', () => {
        expect(clamp(5, 0, 3)).toBe(3)
        expect(clamp(-5, 0, 3)).toBe(0)
        expect(clamp(2, 0, 3)).toBe(2)
    })

    it('normalizes rotation into 0-359', () => {
        expect(normalizeRotation(-90)).toBe(270)
        expect(normalizeRotation(450)).toBe(90)
    })

    it('swaps width and height when rotating by 90 degrees', () => {
        const rotated = rotateSize({ width: 200, height: 100 }, 90)

        expect(rotated.width).toBeCloseTo(100)
        expect(rotated.height).toBeCloseTo(200)
    })

    it('fits the image inside the area with containScale', () => {
        expect(containScale({ width: 200, height: 100 }, { width: 100, height: 100 }, 0)).toBe(0.5)
    })

    it('covers the crop area with coverScale', () => {
        expect(coverScale({ width: 200, height: 100 }, { width: 100, height: 100 }, 0)).toBe(1)
    })

    it('grows the cover scale by the safety margin', () => {
        const withMargin = coverScale(
            { width: 200, height: 100 },
            { width: 100, height: 100 },
            0,
            1
        )

        expect(withMargin).toBeCloseTo(1.02)
    })

    it('shrinks the pan range by the safety margin', () => {
        const transform = {
            centerX: 100,
            centerY: 50,
            rotation: 0,
            scale: 1,
            flipX: false,
            flipY: false,
            natural: { width: 200, height: 100 }
        }
        const crop = { x: 50, y: 25, width: 100, height: 50 }

        const free = constrainCenter({ ...transform, centerX: 0 }, crop)
        const tight = constrainCenter({ ...transform, centerX: 0 }, crop, 1)

        expect(tight.x).toBeGreaterThan(free.x)
    })

    it('accounts for rotation when covering the crop area', () => {
        const area = { width: 100, height: 50 }
        const natural = { width: 200, height: 100 }

        expect(coverScale(natural, area, 0)).toBeCloseTo(0.5)
        expect(coverScale(natural, area, 90)).toBeCloseTo(1)
    })
})

describe('image cropper transform', () => {
    it('builds the ops in render order', () => {
        const ops = transformOps({ ...baseTransform, scale: 2, rotation: 90 })

        expect(ops.map((op) => op.type)).toEqual(['translate', 'rotate', 'scale', 'translate'])
        expect(ops[0]).toEqual({ type: 'translate', x: 100, y: 50 })
        expect(ops[3]).toEqual({ type: 'translate', x: -100, y: -50 })
    })

    it('mirrors the scale for flipped axes', () => {
        const ops = transformOps({ ...baseTransform, scale: 2, flipX: true, flipY: true })

        expect(ops[2]).toEqual({ type: 'scale', x: -2, y: -2 })
    })

    it('serializes the ops to a css transform', () => {
        const css = toCssTransform([
            { type: 'translate', x: 1, y: 2 },
            { type: 'rotate', radians: 0.5 },
            { type: 'scale', x: 2, y: -2 }
        ] satisfies TransformOp[])

        expect(css).toBe('translate(1px, 2px) rotate(0.5rad) scale(2, -2)')
    })

    it('replays the same ops onto a canvas-like target', () => {
        const calls: string[] = []
        const target = {
            translate: (x: number, y: number) => calls.push(`translate:${x},${y}`),
            rotate: (radians: number) => calls.push(`rotate:${radians}`),
            scale: (x: number, y: number) => calls.push(`scale:${x},${y}`)
        }

        applyTransform(target, transformOps(baseTransform))

        expect(calls).toEqual(['translate:100,50', 'rotate:0', 'scale:1,1', 'translate:-100,-50'])
    })

    it('maps a stage point back to image coordinates', () => {
        expect(toLocalPoint(baseTransform, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
        expect(toLocalPoint(baseTransform, { x: 200, y: 100 })).toEqual({ x: 200, y: 100 })
    })

    it('maps a scaled crop rect to source pixels', () => {
        const area = toSourceArea(
            { ...baseTransform, scale: 2, centerX: 200, centerY: 100 },
            { x: 100, y: 50, width: 100, height: 50 }
        )

        expect(area.x).toBeCloseTo(50)
        expect(area.y).toBeCloseTo(25)
        expect(area.width).toBeCloseTo(50)
        expect(area.height).toBeCloseTo(25)
    })

    it('clips the source area to the image bounds', () => {
        const area = toSourceArea(baseTransform, { x: -1000, y: -1000, width: 4000, height: 4000 })

        expect(area).toEqual({ x: 0, y: 0, width: 200, height: 100 })
    })
})

describe('image cropper constraints', () => {
    it('keeps the crop rect covered by the image', () => {
        const crop = { x: 0, y: 0, width: 100, height: 100 }
        const center = constrainCenter(
            {
                ...baseTransform,
                centerX: 1000,
                centerY: 1000,
                natural: { width: 200, height: 200 }
            },
            crop
        )

        expect(center.x).toBeCloseTo(100)
        expect(center.y).toBeCloseTo(100)
    })

    it('leaves a centred image untouched', () => {
        const crop = { x: 50, y: 0, width: 100, height: 100 }
        const center = constrainCenter(
            { ...baseTransform, centerX: 100, centerY: 50, natural: { width: 200, height: 200 } },
            crop
        )

        expect(center.x).toBeCloseTo(100)
        expect(center.y).toBeCloseTo(50)
    })
})

describe('image cropper frame', () => {
    it('centres a square frame inside a wide stage', () => {
        const frame = computeFrame({ width: 400, height: 200 }, 1, 16)

        expect(frame).toEqual({ x: 116, y: 16, width: 168, height: 168 })
    })

    it('fills the padded stage when the aspect is free', () => {
        expect(computeFrame({ width: 400, height: 200 }, 'free', 20)).toEqual({
            x: 20,
            y: 20,
            width: 360,
            height: 160
        })
    })

    it('insets a free box frame so the image shows around it', () => {
        const bounds = { x: 10, y: 20, width: 400, height: 200 }

        expect(centerFrameWithin(bounds, 'free')).toEqual({
            x: 50,
            y: 40,
            width: 320,
            height: 160
        })
    })

    it('keeps a fixed aspect box frame centred inside the image', () => {
        const bounds = { x: 0, y: 0, width: 400, height: 200 }

        expect(centerFrameWithin(bounds, 1)).toEqual({ x: 100, y: 0, width: 200, height: 200 })
    })

    it('clamps a rect inside its bounds', () => {
        const bounds = { x: 0, y: 0, width: 100, height: 100 }

        expect(clampRectWithin({ x: 90, y: 90, width: 40, height: 40 }, bounds)).toEqual({
            x: 60,
            y: 60,
            width: 40,
            height: 40
        })
    })

    it('intersects two rects', () => {
        expect(
            intersectRect(
                { x: 0, y: 0, width: 100, height: 100 },
                { x: 50, y: 50, width: 100, height: 100 }
            )
        ).toEqual({ x: 50, y: 50, width: 50, height: 50 })
    })

    it('moves a rect without leaving the bounds', () => {
        const bounds = { x: 0, y: 0, width: 100, height: 100 }

        expect(
            moveRect({ x: 10, y: 10, width: 20, height: 20 }, { x: -100, y: 5 }, bounds)
        ).toEqual({
            x: 0,
            y: 15,
            width: 20,
            height: 20
        })
    })
})

describe('image cropper resize', () => {
    const bounds = { x: 0, y: 0, width: 200, height: 200 }
    const rect = { x: 50, y: 50, width: 100, height: 100 }

    it('resizes freely from the south east handle', () => {
        expect(
            resizeRect(rect, 'se', { x: 20, y: -30 }, { aspect: 'free', minSize: 10, bounds })
        ).toEqual({
            x: 50,
            y: 50,
            width: 120,
            height: 70
        })
    })

    it('keeps the aspect ratio when resizing', () => {
        const next = resizeRect(rect, 'se', { x: 40, y: 0 }, { aspect: 1, minSize: 10, bounds })

        expect(next.width).toBeCloseTo(140)
        expect(next.height).toBeCloseTo(140)
    })

    it('refuses an aspect-locked resize that would leave the bounds', () => {
        const next = resizeRect(
            { x: 0, y: 150, width: 100, height: 50 },
            'e',
            { x: 100, y: 0 },
            { aspect: 1, minSize: 10, bounds }
        )

        expect(next).toEqual({ x: 0, y: 150, width: 100, height: 50 })
    })

    it('never shrinks below the minimum size', () => {
        const next = resizeRect(
            rect,
            'se',
            { x: -200, y: -200 },
            { aspect: 'free', minSize: 24, bounds }
        )

        expect(next.width).toBe(24)
        expect(next.height).toBe(24)
    })
})

describe('image cropper output', () => {
    it('exports at the source resolution by default', () => {
        expect(resolveOutputScale({ width: 200, height: 200 }, 2)).toBe(0.5)
    })

    it('caps the output by the given limits', () => {
        expect(resolveOutputScale({ width: 200, height: 200 }, 1, { maxWidth: 100 })).toBe(0.5)
        expect(resolveOutputScale({ width: 200, height: 200 }, 1, { maxHeight: 50 })).toBe(0.25)
    })

    it('never upscales beyond the source resolution', () => {
        expect(resolveOutputScale({ width: 100, height: 100 }, 1, { maxWidth: 4000 })).toBe(1)
    })

    it('maps mime types to extensions', () => {
        expect(extensionFor('image/jpeg')).toBe('jpg')
        expect(extensionFor('image/webp')).toBe('webp')
        expect(extensionFor('image/png')).toBe('png')
    })

    it('derives the output file name from the source name', () => {
        expect(outputFileName('avatar.jpeg', 'image/png')).toBe('avatar-cropped.png')
        expect(outputFileName(undefined, 'image/jpeg')).toBe('crop.jpg')
    })
})

describe('image cropper rendering', () => {
    function makeContext() {
        const calls: string[] = []

        return {
            calls,
            context: {
                beginPath: () => calls.push('beginPath'),
                ellipse: (x: number, y: number, rx: number, ry: number) =>
                    calls.push(`ellipse:${x},${y},${rx},${ry}`),
                clip: () => calls.push('clip'),
                fillRect: (x: number, y: number, w: number, h: number) =>
                    calls.push(`fillRect:${x},${y},${w},${h}`),
                setTransform: (...matrix: number[]) =>
                    calls.push(`setTransform:${matrix.join(',')}`),
                translate: (x: number, y: number) => calls.push(`translate:${x},${y}`),
                rotate: (radians: number) => calls.push(`rotate:${radians}`),
                scale: (x: number, y: number) => calls.push(`scale:${x},${y}`),
                drawImage: (_image: unknown, ...box: number[]) =>
                    calls.push(`drawImage:${box.join(',')}`),
                fillStyle: ''
            }
        }
    }

    const renderOptions = {
        image: {} as CanvasImageSource,
        transform: baseTransform,
        crop: { x: 20, y: 10, width: 100, height: 50 },
        outputScale: 2,
        width: 200,
        height: 100
    }

    it('offsets the canvas by the crop origin and replays the image transform', () => {
        const { calls, context } = makeContext()

        renderCrop(context as unknown as CanvasRenderingContext2D, renderOptions)

        expect(calls).toEqual([
            'setTransform:2,0,0,2,-40,-20',
            'translate:100,50',
            'rotate:0',
            'scale:1,1',
            'translate:-100,-50',
            'drawImage:0,0,200,100'
        ])
    })

    it('clips to an ellipse before painting a circular crop', () => {
        const { calls, context } = makeContext()

        renderCrop(context as unknown as CanvasRenderingContext2D, {
            ...renderOptions,
            circle: true
        })

        expect(calls.slice(0, 3)).toEqual(['beginPath', 'ellipse:100,50,100,50', 'clip'])
    })

    it('fills the background before drawing', () => {
        const { calls, context } = makeContext()

        renderCrop(context as unknown as CanvasRenderingContext2D, {
            ...renderOptions,
            background: '#ffffff'
        })

        expect(context.fillStyle).toBe('#ffffff')
        expect(calls[0]).toBe('fillRect:0,0,200,100')
    })

    it('paints the background outside the circular clip so opaque formats keep it', () => {
        const { calls, context } = makeContext()

        renderCrop(context as unknown as CanvasRenderingContext2D, {
            ...renderOptions,
            circle: true,
            background: '#ffffff'
        })

        expect(calls.slice(0, 4)).toEqual([
            'fillRect:0,0,200,100',
            'beginPath',
            'ellipse:100,50,100,50',
            'clip'
        ])
    })
})
