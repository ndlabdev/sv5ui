import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render } from 'vitest-browser-svelte'
import ImageCropper from './ImageCropper.svelte'
import ImageCropperTestWrapper from './ImageCropperTestWrapper.svelte'
import type {
    ImageCropperApi,
    ImageCropperResult,
    ImageCropperStatus
} from './image-cropper.types.js'

function makeImageUrl(width = 60, height = 40, color = '#ff0000') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')!
    context.fillStyle = color
    context.fillRect(0, 0, width, height)

    return canvas.toDataURL('image/png')
}

function makeSplitImage(orientation: 'vertical' | 'horizontal', size = 40) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')!
    context.fillStyle = '#ff0000'
    context.fillRect(0, 0, size, orientation === 'horizontal' ? size / 2 : size)
    context.fillStyle = '#0000ff'
    if (orientation === 'horizontal') context.fillRect(0, size / 2, size, size / 2)
    else context.fillRect(size / 2, 0, size / 2, size)

    return canvas.toDataURL('image/png')
}

async function readPixels(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const context = canvas.getContext('2d')!
    context.drawImage(bitmap, 0, 0)

    return {
        width: bitmap.width,
        height: bitmap.height,
        at: (x: number, y: number) => Array.from(context.getImageData(x, y, 1, 1).data)
    }
}

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

const isRed = (pixel: number[]) => pixel[0] > 200 && pixel[2] < 60
const isBlue = (pixel: number[]) => pixel[2] > 200 && pixel[0] < 60

const getStage = () => document.querySelector('[aria-label="Image cropper"]') as HTMLElement

function pointerEvent(type: string, x: number, y: number, pointerId = 1) {
    return new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId,
        isPrimary: pointerId === 1,
        button: 0,
        buttons: 1,
        pointerType: 'mouse'
    })
}

function stageCenter() {
    const rect = getStage().getBoundingClientRect()

    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function drag(target: Element, from: { x: number; y: number }, dx: number, dy: number) {
    target.dispatchEvent(pointerEvent('pointerdown', from.x, from.y))
    target.dispatchEvent(pointerEvent('pointermove', from.x + dx, from.y + dy))
    target.dispatchEvent(pointerEvent('pointerup', from.x + dx, from.y + dy))
}
const getImage = () => document.querySelector('img') as HTMLImageElement | null
const getHandles = () => document.querySelectorAll('[data-handle]')
const getButton = (label: string) =>
    document.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement | null

async function renderLoaded(props: Record<string, unknown> = {}) {
    let api: ImageCropperApi | undefined
    render(ImageCropperTestWrapper, {
        props: {
            src: makeImageUrl(),
            onReady: (next: ImageCropperApi) => {
                api = next
            },
            ...props
        }
    })

    await vi.waitFor(() => {
        expect(api?.area.width).toBeGreaterThan(0)
    })

    return () => api!
}

describe('ImageCropper', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        const style = document.createElement('style')
        style.textContent = '[aria-label="Image cropper"] { width: 400px; height: 288px; }'
        document.head.appendChild(style)
    })

    describe('rendering', () => {
        it('should render the placeholder without a source', () => {
            render(ImageCropper)

            expect(document.body.textContent).toContain('No image selected')
            expect(getImage()).toBeNull()
        })

        it('should render the image once a source is given', async () => {
            await renderLoaded()

            expect(getImage()).not.toBeNull()
            expect(document.body.textContent).not.toContain('No image selected')
        })

        it('should render the default toolbar', async () => {
            await renderLoaded()

            expect(getButton('Zoom in')).not.toBeNull()
            expect(getButton('Rotate right')).not.toBeNull()
            expect(getButton('Flip vertically')).not.toBeNull()
            expect(getButton('Reset')).not.toBeNull()
        })

        it('should wire a tooltip to every toolbar button', async () => {
            await renderLoaded()
            const triggers = document.querySelectorAll('[data-tooltip-trigger]')

            expect(triggers).toHaveLength(7)
            expect(triggers[0].getAttribute('data-delay-duration')).toBe('200')
            expect(getButton('Rotate right')!.closest('[data-tooltip-trigger]')).not.toBeNull()
        })

        it('should render only the requested toolbar items', async () => {
            await renderLoaded({ toolbar: ['reset'] })

            expect(getButton('Reset')).not.toBeNull()
            expect(getButton('Zoom in')).toBeNull()
        })

        it('should expose the mode on the root element', () => {
            render(ImageCropper, { props: { mode: 'box' } })

            expect(document.querySelector('[data-mode="box"]')).not.toBeNull()
        })

        it('should render the rule-of-thirds grid on demand', async () => {
            await renderLoaded({ grid: true })

            expect(document.querySelector('[data-crop-grid]')).not.toBeNull()
        })
    })

    describe('crop frame', () => {
        it('should not render resize handles in fixed mode', async () => {
            await renderLoaded()

            expect(getHandles()).toHaveLength(0)
        })

        it('should render eight resize handles in box mode', async () => {
            await renderLoaded({ mode: 'box' })

            expect(getHandles()).toHaveLength(8)
        })

        it('should hide the handles for a circular crop', async () => {
            await renderLoaded({ mode: 'box', shape: 'circle' })

            expect(getHandles()).toHaveLength(0)
        })
    })

    describe('transform controls', () => {
        it('should rotate right by 90 degrees', async () => {
            const api = await renderLoaded()

            getButton('Rotate right')!.click()
            await vi.waitFor(() => expect(api().rotation).toBe(90))
        })

        it('should rotate left into a normalized angle', async () => {
            const api = await renderLoaded()

            getButton('Rotate left')!.click()
            await vi.waitFor(() => expect(api().rotation).toBe(270))
        })

        it('should zoom in and clamp at maxZoom', async () => {
            const api = await renderLoaded({ zoomStep: 1, maxZoom: 2 })

            getButton('Zoom in')!.click()
            await vi.waitFor(() => expect(api().zoom).toBe(2))

            getButton('Zoom in')!.click()
            await vi.waitFor(() => expect(api().zoom).toBe(2))
        })

        it('should clamp zooming out at minZoom', async () => {
            const api = await renderLoaded({ zoomStep: 1 })

            getButton('Zoom out')!.click()
            await vi.waitFor(() => expect(api().zoom).toBe(1))
        })

        it('should reset the transform', async () => {
            const api = await renderLoaded({ zoomStep: 0.5 })

            getButton('Zoom in')!.click()
            getButton('Rotate right')!.click()
            await vi.waitFor(() => expect(api().rotation).toBe(90))

            getButton('Reset')!.click()
            await vi.waitFor(() => {
                expect(api().rotation).toBe(0)
                expect(api().zoom).toBe(1)
            })
        })

        it('should zoom with the mouse wheel', async () => {
            const api = await renderLoaded({ zoomStep: 1 })

            getStage().dispatchEvent(
                new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true })
            )
            await vi.waitFor(() => expect(api().zoom).toBeGreaterThan(1))
        })

        it('should disable the toolbar when disabled', async () => {
            await renderLoaded({ disabled: true })

            expect(getButton('Zoom in')!.disabled).toBe(true)
        })
    })

    describe('crop area', () => {
        it('should report the crop area in source pixels', async () => {
            const onAreaChange = vi.fn()
            const api = await renderLoaded({ onAreaChange })

            expect(api().area.width).toBeCloseTo(40, 0)
            expect(api().area.height).toBeCloseTo(40, 0)
            expect(onAreaChange).toHaveBeenCalled()
        })

        it('should follow a non-square aspect ratio', async () => {
            const api = await renderLoaded({ aspect: 2 })

            expect(api().area.width / api().area.height).toBeCloseTo(2, 1)
        })
    })

    describe('source lifecycle', () => {
        it('should keep the initial zoom and rotation props when the image loads', async () => {
            const api = await renderLoaded({ rotation: 90, zoom: 1.5 })

            expect(api().rotation).toBe(90)
            expect(api().zoom).toBe(1.5)
        })

        it('should clamp a zoom that starts outside the allowed range', async () => {
            const api = await renderLoaded({ zoom: 10, maxZoom: 3 })

            expect(api().zoom).toBe(3)
        })

        it('should reset the transform when the source changes', async () => {
            let api: ImageCropperApi | undefined
            const onReady = (next: ImageCropperApi) => (api = next)
            const screen = render(ImageCropperTestWrapper, {
                props: { src: makeImageUrl(), onReady }
            })

            await vi.waitFor(() => expect(api?.area.width).toBeGreaterThan(0))
            api!.rotate(90)
            api!.zoomTo(2)
            await vi.waitFor(() => expect(api!.rotation).toBe(90))

            await screen.rerender({ src: makeImageUrl(80, 30, '#00ff00'), onReady })

            await vi.waitFor(() => {
                expect(api!.rotation).toBe(0)
                expect(api!.zoom).toBe(1)
            })
        })

        it('should fall back to the placeholder when the source is removed', async () => {
            let api: ImageCropperApi | undefined
            const onReady = (next: ImageCropperApi) => (api = next)
            const screen = render(ImageCropperTestWrapper, {
                props: { src: makeImageUrl(), onReady }
            })

            await vi.waitFor(() => expect(api?.area.width).toBeGreaterThan(0))
            await screen.rerender({ src: null, onReady })

            await vi.waitFor(() => {
                expect(getImage()).toBeNull()
                expect(document.body.textContent).toContain('No image selected')
            })
        })

        it('should reshape the crop frame when the aspect ratio changes', async () => {
            let api: ImageCropperApi | undefined
            const onReady = (next: ImageCropperApi) => (api = next)
            const screen = render(ImageCropperTestWrapper, {
                props: { src: makeImageUrl(), mode: 'box', aspect: 1, onReady }
            })

            await vi.waitFor(() => expect(api?.area.width).toBeGreaterThan(0))
            expect(api!.area.width / api!.area.height).toBeCloseTo(1, 1)

            await screen.rerender({ src: makeImageUrl(), mode: 'box', aspect: 2, onReady })

            await vi.waitFor(() => expect(api!.area.width / api!.area.height).toBeCloseTo(2, 1))
        })
    })

    describe('gestures', () => {
        it('should pan the image when dragging in fixed mode', async () => {
            const api = await renderLoaded()
            const before = { ...api().area }

            drag(getStage(), stageCenter(), 40, 0)

            expect(api().area.x).toBeLessThan(before.x)
            expect(api().area.width).toBeCloseTo(before.width, 1)
        })

        it('should keep the pan inside the image bounds', async () => {
            const api = await renderLoaded()

            drag(getStage(), stageCenter(), 5000, 5000)

            expect(api().area.x).toBeGreaterThanOrEqual(0)
            expect(api().area.y).toBeGreaterThanOrEqual(0)
        })

        it('should zoom when two pointers move apart', async () => {
            const api = await renderLoaded()
            const center = stageCenter()
            const stage = getStage()

            stage.dispatchEvent(pointerEvent('pointerdown', center.x - 50, center.y, 1))
            stage.dispatchEvent(pointerEvent('pointerdown', center.x + 50, center.y, 2))
            stage.dispatchEvent(pointerEvent('pointermove', center.x - 100, center.y, 1))

            expect(api().zoom).toBeGreaterThan(1)

            stage.dispatchEvent(pointerEvent('pointerup', center.x - 100, center.y, 1))
            stage.dispatchEvent(pointerEvent('pointerup', center.x + 50, center.y, 2))
        })

        it('should move the crop frame when dragging inside it in box mode', async () => {
            const api = await renderLoaded({ mode: 'box' })
            const before = { ...api().area }

            drag(getStage(), stageCenter(), 20, 0)

            expect(api().area.x).toBeGreaterThan(before.x)
        })

        it('should open a free frame inset from the image', async () => {
            const api = await renderLoaded({ mode: 'box', aspect: 'free' })

            expect(api().area.width).toBeLessThan(60)
            expect(api().area.height).toBeLessThan(40)
            expect(api().area.x).toBeGreaterThan(0)
        })

        it('should open on the whole image when initialFrame is full', async () => {
            const api = await renderLoaded({ mode: 'box', aspect: 'free', initialFrame: 'full' })

            expect(api().area.width).toBeCloseTo(60, 0)
            expect(api().area.height).toBeCloseTo(40, 0)
        })

        it('should resize the crop frame from a handle', async () => {
            const api = await renderLoaded({ mode: 'box', aspect: 'free' })
            const before = { ...api().area }
            const handle = document.querySelector('[data-handle="se"]') as HTMLElement
            const box = handle.getBoundingClientRect()

            drag(handle, { x: box.left + box.width / 2, y: box.top + box.height / 2 }, -40, -40)

            expect(api().area.width).toBeLessThan(before.width)
            expect(api().area.height).toBeLessThan(before.height)
        })

        it('should ignore gestures while disabled', async () => {
            const api = await renderLoaded({ disabled: true })
            const before = { ...api().area }

            drag(getStage(), stageCenter(), 40, 0)

            expect(api().area.x).toBeCloseTo(before.x, 1)
        })
    })

    describe('status', () => {
        it('should apply a cached image only once', async () => {
            const onLoad = vi.fn()
            const url = makeImageUrl()
            const api = await renderLoaded({ src: url, onLoad })

            api().zoomTo(2)
            const zoomed = { ...api().area }

            const second = await renderLoaded({ src: url, onLoad })
            await vi.waitFor(() => expect(second().area.width).toBeGreaterThan(0))

            expect(api().area.width).toBeCloseTo(zoomed.width, 1)
        })

        it('should show the error placeholder for a broken source', async () => {
            render(ImageCropper, { props: { src: 'data:image/png;base64,not-an-image' } })

            await vi.waitFor(() =>
                expect(document.body.textContent).toContain('Could not load the image')
            )
        })

        it('should report the intrinsic size through onLoad', async () => {
            const onLoad = vi.fn()
            await renderLoaded({ onLoad })

            expect(onLoad).toHaveBeenCalledWith({ width: 60, height: 40 })
        })
    })

    describe('wheel zoom', () => {
        function wheel(ctrlKey = false) {
            const event = new WheelEvent('wheel', {
                deltaY: -100,
                bubbles: true,
                cancelable: true,
                ctrlKey
            })
            getStage().dispatchEvent(event)

            return event
        }

        it('should not zoom without a modifier when wheelZoom is "ctrl"', async () => {
            const api = await renderLoaded({ wheelZoom: 'ctrl', zoomStep: 1 })

            const event = wheel()

            expect(api().zoom).toBe(1)
            expect(event.defaultPrevented).toBe(false)
        })

        it('should zoom with ctrl held when wheelZoom is "ctrl"', async () => {
            const api = await renderLoaded({ wheelZoom: 'ctrl', zoomStep: 1 })

            wheel(true)

            expect(api().zoom).toBeGreaterThan(1)
        })

        it('should never zoom when wheelZoom is false', async () => {
            const api = await renderLoaded({ wheelZoom: false, zoomStep: 1 })

            const event = wheel()

            expect(api().zoom).toBe(1)
            expect(event.defaultPrevented).toBe(false)
        })
    })

    describe('rotation slider', () => {
        it('should be hidden by default', async () => {
            await renderLoaded()

            expect(document.querySelector('[aria-label="Rotation"]')).toBeNull()
        })

        it('should render when enabled', async () => {
            await renderLoaded({ rotationSlider: true })

            expect(document.querySelector('[aria-label="Rotation"]')).not.toBeNull()
        })
    })

    describe('double click', () => {
        function doubleClick() {
            const center = stageCenter()
            getStage().dispatchEvent(
                new MouseEvent('dblclick', {
                    bubbles: true,
                    clientX: center.x,
                    clientY: center.y
                })
            )
        }

        it('should zoom in, then back out on the next double click', async () => {
            const api = await renderLoaded()

            doubleClick()
            expect(api().zoom).toBe(2)

            doubleClick()
            expect(api().zoom).toBe(1)
        })

        it('should do nothing while disabled', async () => {
            const api = await renderLoaded({ disabled: true })

            doubleClick()

            expect(api().zoom).toBe(1)
        })
    })

    describe('gesture callbacks', () => {
        it('should bracket a drag with onCropStart and onCropEnd', async () => {
            const onCropStart = vi.fn()
            const onCropEnd = vi.fn()
            await renderLoaded({ onCropStart, onCropEnd })

            drag(getStage(), stageCenter(), 20, 0)

            expect(onCropStart).toHaveBeenCalledTimes(1)
            expect(onCropEnd).toHaveBeenCalledTimes(1)
            expect(onCropEnd.mock.calls[0][0].width).toBeGreaterThan(0)
        })

        it('should not fire for toolbar changes', async () => {
            const onCropStart = vi.fn()
            const onCropEnd = vi.fn()
            await renderLoaded({ onCropStart, onCropEnd })

            getButton('Rotate right')!.click()

            expect(onCropStart).not.toHaveBeenCalled()
            expect(onCropEnd).not.toHaveBeenCalled()
        })
    })

    describe('area binding', () => {
        it('should restore a crop area given up front', async () => {
            const api = await renderLoaded({ area: { x: 10, y: 5, width: 20, height: 20 } })

            await vi.waitFor(() => {
                expect(api().area.x).toBeCloseTo(10, 0)
                expect(api().area.y).toBeCloseTo(5, 0)
                expect(api().area.width).toBeCloseTo(20, 0)
            })
        })

        it('should apply an area assigned after the image loaded', async () => {
            let api: ImageCropperApi | undefined
            const onReady = (next: ImageCropperApi) => (api = next)
            const screen = render(ImageCropperTestWrapper, {
                props: { src: makeImageUrl(), onReady }
            })

            await vi.waitFor(() => expect(api?.area.width).toBeGreaterThan(0))
            await screen.rerender({
                src: makeImageUrl(),
                area: { x: 20, y: 10, width: 20, height: 20 },
                onReady
            })

            await vi.waitFor(() => {
                expect(api!.area.x).toBeCloseTo(20, 0)
                expect(api!.area.width).toBeCloseTo(20, 0)
            })
        })

        it('should restore an area in box mode', async () => {
            const api = await renderLoaded({
                mode: 'box',
                aspect: 'free',
                area: { x: 10, y: 10, width: 30, height: 15 }
            })

            await vi.waitFor(() => {
                expect(api().area.x).toBeCloseTo(10, 0)
                expect(api().area.width).toBeCloseTo(30, 0)
                expect(api().area.height).toBeCloseTo(15, 0)
            })
        })
    })

    describe('shape', () => {
        it('should force a square crop for a circular shape', async () => {
            const api = await renderLoaded({ shape: 'circle', aspect: 2 })

            expect(api().area.width / api().area.height).toBeCloseTo(1, 1)
        })
    })

    describe('auto crop', () => {
        it('should crop automatically after the debounce', async () => {
            const onCrop = vi.fn()
            await renderLoaded({ autoCrop: 20, onCrop })

            await vi.waitFor(() => expect(onCrop).toHaveBeenCalled(), { timeout: 2000 })
        })

        it('should crop again after a transform change', async () => {
            const onCrop = vi.fn()
            const api = await renderLoaded({ autoCrop: 20, onCrop })

            await vi.waitFor(() => expect(onCrop).toHaveBeenCalledTimes(1), { timeout: 2000 })
            api().rotate(90)

            await vi.waitFor(() => expect(onCrop).toHaveBeenCalledTimes(2), { timeout: 2000 })
        })
    })

    describe('keyboard', () => {
        function press(key: string, shiftKey = false) {
            const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
            Object.defineProperty(event, 'shiftKey', { value: shiftKey })
            getStage().dispatchEvent(event)

            return event
        }

        it('should move the crop region right in fixed mode', async () => {
            const api = await renderLoaded()
            const before = { ...api().area }

            press('ArrowRight')

            expect(api().area.x).toBeGreaterThan(before.x)
        })

        it('should move the crop region right in box mode too', async () => {
            const api = await renderLoaded({ mode: 'box' })
            const before = { ...api().area }

            press('ArrowRight')

            expect(api().area.x).toBeGreaterThan(before.x)
        })

        it('should take bigger steps with shift held', async () => {
            const single = await renderLoaded()
            const start = single().area.x
            press('ArrowRight')
            const smallStep = single().area.x - start

            document.body.innerHTML = ''
            const shifted = await renderLoaded()
            const shiftedStart = shifted().area.x
            press('ArrowRight', true)
            const bigStep = shifted().area.x - shiftedStart

            expect(bigStep).toBeGreaterThan(smallStep)
        })

        it('should zoom with plus and minus', async () => {
            const api = await renderLoaded({ zoomStep: 1 })

            press('+')
            expect(api().zoom).toBe(2)

            press('-')
            expect(api().zoom).toBe(1)
        })

        it('should rotate with R and back with shift+R', async () => {
            const api = await renderLoaded()

            press('r')
            expect(api().rotation).toBe(90)

            press('R', true)
            expect(api().rotation).toBe(0)
        })

        it('should reset with 0', async () => {
            const api = await renderLoaded({ zoomStep: 1 })

            press('+')
            press('r')
            press('0')

            expect(api().zoom).toBe(1)
            expect(api().rotation).toBe(0)
        })

        it('should not swallow unrelated keys', async () => {
            await renderLoaded()

            expect(press('Tab').defaultPrevented).toBe(false)
        })

        it('should resize the frame from a focused handle', async () => {
            const api = await renderLoaded({ mode: 'box', aspect: 'free' })
            const before = { ...api().area }
            const handle = document.querySelector('[data-handle="se"]') as HTMLElement

            const event = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                bubbles: true,
                cancelable: true
            })
            Object.defineProperty(event, 'shiftKey', { value: true })
            handle.dispatchEvent(event)

            expect(api().area.width).toBeLessThan(before.width)
        })

        it('should ignore keys while disabled', async () => {
            const api = await renderLoaded({ disabled: true })
            const before = { ...api().area }

            press('ArrowRight')

            expect(api().area.x).toBeCloseTo(before.x, 1)
        })
    })

    describe('slots', () => {
        it('should replace the toolbar with the toolbarSlot', async () => {
            await renderLoaded({ toolbarSlot: snippet('<p>custom toolbar</p>') })

            expect(document.body.textContent).toContain('custom toolbar')
            expect(getButton('Rotate right')).toBeNull()
        })

        it('should render the footer snippet under the stage', async () => {
            await renderLoaded({ footer: snippet('<p>custom footer</p>') })

            expect(document.body.textContent).toContain('custom footer')
        })

        it('should hand the status to the placeholder snippet', async () => {
            const placeholder = createRawSnippet<[{ status: ImageCropperStatus }]>((props) => ({
                render: () => `<p>status: ${props().status}</p>`,
                setup: () => {}
            }))
            render(ImageCropper, { props: { placeholder } })

            expect(document.body.textContent).toContain('status: empty')
        })
    })

    describe('labels', () => {
        it('should override the toolbar labels', async () => {
            await renderLoaded({
                labels: { rotateRight: 'Xoay phai', reset: 'Dat lai' }
            })

            expect(getButton('Xoay phai')).not.toBeNull()
            expect(getButton('Dat lai')).not.toBeNull()
            expect(getButton('Rotate right')).toBeNull()
        })

        it('should override the placeholder wording', () => {
            render(ImageCropper, { props: { labels: { empty: 'Chua chon anh' } } })

            expect(document.body.textContent).toContain('Chua chon anh')
            expect(document.body.textContent).not.toContain('No image selected')
        })

        it('should override the resize handle labels', async () => {
            await renderLoaded({ mode: 'box', labels: { handles: { se: 'Keo goc duoi phai' } } })

            expect(getButton('Keo goc duoi phai')).not.toBeNull()
        })

        it('should override the slider labels', async () => {
            await renderLoaded({
                rotationSlider: true,
                labels: { zoom: 'Thu phong', rotation: 'Xoay' }
            })

            expect(document.querySelector('[aria-label="Thu phong"]')).not.toBeNull()
            expect(document.querySelector('[aria-label="Xoay"]')).not.toBeNull()
        })

        it('should hide the fill on the rotation slider', async () => {
            await renderLoaded({ rotationSlider: true })
            const slider = document.querySelector('[aria-label="Rotation"]') as HTMLElement

            expect(slider.querySelector('.hidden')).not.toBeNull()
        })
    })

    describe('feature interactions', () => {
        it('should not auto crop while a gesture is in flight', async () => {
            const onCrop = vi.fn()
            await renderLoaded({ autoCrop: 30, onCrop })
            await vi.waitFor(() => expect(onCrop).toHaveBeenCalledTimes(1), { timeout: 2000 })

            const center = stageCenter()
            const stage = getStage()
            stage.dispatchEvent(pointerEvent('pointerdown', center.x, center.y))
            stage.dispatchEvent(pointerEvent('pointermove', center.x + 30, center.y))
            await new Promise((resolve) => setTimeout(resolve, 120))

            expect(onCrop).toHaveBeenCalledTimes(1)

            stage.dispatchEvent(pointerEvent('pointerup', center.x + 30, center.y))
            await vi.waitFor(() => expect(onCrop).toHaveBeenCalledTimes(2), { timeout: 2000 })
        })

        it('should auto crop after an area is restored', async () => {
            const onCrop = vi.fn()
            let api: ImageCropperApi | undefined
            const onReady = (next: ImageCropperApi) => (api = next)
            const screen = render(ImageCropperTestWrapper, {
                props: { src: makeImageUrl(), autoCrop: 30, onCrop, onReady }
            })

            await vi.waitFor(() => expect(onCrop).toHaveBeenCalledTimes(1), { timeout: 2000 })
            await screen.rerender({
                src: makeImageUrl(),
                autoCrop: 30,
                onCrop,
                onReady,
                area: { x: 20, y: 10, width: 20, height: 20 }
            })

            await vi.waitFor(() => expect(onCrop.mock.calls.length).toBeGreaterThan(1), {
                timeout: 2000
            })
            expect(api!.area.x).toBeCloseTo(20, 0)
        })

        it('should keep the rotation slider in sync with the api', async () => {
            const api = await renderLoaded({ rotationSlider: true })

            api().rotate(90)
            await vi.waitFor(() =>
                expect(
                    document
                        .querySelector('[aria-label="Rotation"] [role="slider"]')
                        ?.getAttribute('aria-valuenow')
                ).toBe('90')
            )

            api().rotate(180)
            await vi.waitFor(() =>
                expect(
                    document
                        .querySelector('[aria-label="Rotation"] [role="slider"]')
                        ?.getAttribute('aria-valuenow')
                ).toBe('-90')
            )
        })

        it('should normalize a restored area to the locked aspect ratio', async () => {
            const api = await renderLoaded({
                mode: 'box',
                aspect: 1,
                area: { x: 0, y: 0, width: 40, height: 10 }
            })

            await vi.waitFor(() => expect(api().area.width / api().area.height).toBeCloseTo(1, 1))
        })

        it('should start at minZoom when it is above one', async () => {
            const api = await renderLoaded({ minZoom: 1.5, maxZoom: 4 })

            expect(api().zoom).toBe(1.5)
        })

        it('should shrink the crop frame as padding grows', async () => {
            const tight = await renderLoaded({ padding: 8 })
            const tightWidth = tight().area.width

            document.body.innerHTML = ''
            const loose = await renderLoaded({ padding: 64 })

            expect(loose().area.width).toBeLessThan(tightWidth)
        })

        it('should move a circular frame in box mode even without handles', async () => {
            const api = await renderLoaded({ mode: 'box', shape: 'circle' })
            const before = { ...api().area }

            expect(getHandles()).toHaveLength(0)
            drag(getStage(), stageCenter(), 20, 0)

            expect(api().area.x).toBeGreaterThan(before.x)
        })

        it('should expose the cropped file through bind:value', async () => {
            let value: File | null = null
            let api: ImageCropperApi | undefined
            render(ImageCropperTestWrapper, {
                props: {
                    src: makeImageUrl(),
                    value,
                    onCrop: (result: ImageCropperResult) => (value = result.file),
                    onReady: (next: ImageCropperApi) => (api = next)
                }
            })

            await vi.waitFor(() => expect(api?.area.width).toBeGreaterThan(0))
            await api!.crop()

            expect(value).toBeInstanceOf(File)
            expect(value!.type).toBe('image/png')
        })

        it('should forward the crossorigin attribute', async () => {
            await renderLoaded({ crossorigin: 'use-credentials' })

            expect(getImage()!.getAttribute('crossorigin')).toBe('use-credentials')
        })

        it('should apply ui overrides to the stage', async () => {
            await renderLoaded({ ui: { stage: 'ring-4' } })

            expect(getStage().className).toContain('ring-4')
        })

        it('should cap the export by both output limits', async () => {
            const api = await renderLoaded({ aspect: 2, output: { maxWidth: 40, maxHeight: 10 } })
            const result = (await api().crop()) as ImageCropperResult

            expect(result.width).toBeLessThanOrEqual(40)
            expect(result.height).toBeLessThanOrEqual(10)
        })
    })

    describe('exported pixels', () => {
        it('should keep a circular crop transparent outside the circle', async () => {
            const api = await renderLoaded({ shape: 'circle' })
            const result = (await api().crop()) as ImageCropperResult
            const pixels = await readPixels(result.blob)

            expect(pixels.at(0, 0)[3]).toBe(0)
            expect(pixels.at(Math.floor(pixels.width / 2), Math.floor(pixels.height / 2))[3]).toBe(
                255
            )
        })

        it('should paint the corners of a circular JPEG instead of leaving them black', async () => {
            const api = await renderLoaded({ shape: 'circle', output: { type: 'image/jpeg' } })
            const result = (await api().crop()) as ImageCropperResult
            const pixels = await readPixels(result.blob)
            const corner = pixels.at(0, 0)

            expect(corner[0]).toBeGreaterThan(230)
            expect(corner[1]).toBeGreaterThan(230)
            expect(corner[2]).toBeGreaterThan(230)
        })

        it('should mirror the image when flipped horizontally', async () => {
            const api = await renderLoaded({ src: makeSplitImage('vertical') })

            const plain = await readPixels(((await api().crop()) as ImageCropperResult).blob)
            const quarter = Math.floor(plain.width / 4)
            const threeQuarters = Math.floor((plain.width * 3) / 4)
            const middle = Math.floor(plain.height / 2)

            expect(isRed(plain.at(quarter, middle))).toBe(true)
            expect(isBlue(plain.at(threeQuarters, middle))).toBe(true)

            api().flip('horizontal')
            const flipped = await readPixels(((await api().crop()) as ImageCropperResult).blob)

            expect(isBlue(flipped.at(quarter, middle))).toBe(true)
            expect(isRed(flipped.at(threeQuarters, middle))).toBe(true)
        })

        it('should turn a horizontal split into a vertical one when rotated', async () => {
            const api = await renderLoaded({ src: makeSplitImage('horizontal') })

            api().rotate(90)
            const rotated = await readPixels(((await api().crop()) as ImageCropperResult).blob)
            const quarter = Math.floor(rotated.width / 4)
            const threeQuarters = Math.floor((rotated.width * 3) / 4)
            const middle = Math.floor(rotated.height / 2)
            const top = Math.floor(rotated.height / 4)
            const bottom = Math.floor((rotated.height * 3) / 4)
            const centerX = Math.floor(rotated.width / 2)

            expect(isRed(rotated.at(quarter, middle))).not.toBe(
                isRed(rotated.at(threeQuarters, middle))
            )
            expect(isRed(rotated.at(centerX, top))).toBe(isRed(rotated.at(centerX, bottom)))
        })

        it('should cover the whole crop after a quarter turn', async () => {
            const api = await renderLoaded()

            api().rotate(90)
            const pixels = await readPixels(((await api().crop()) as ImageCropperResult).blob)

            for (const [x, y] of [
                [0, 0],
                [pixels.width - 1, 0],
                [0, pixels.height - 1],
                [pixels.width - 1, pixels.height - 1]
            ]) {
                expect(pixels.at(x, y)[3]).toBe(255)
            }
        })

        it('should cover the whole crop at a free angle', async () => {
            const api = await renderLoaded()

            api().rotateTo(37)
            const pixels = await readPixels(((await api().crop()) as ImageCropperResult).blob)

            for (const [x, y] of [
                [0, 0],
                [pixels.width - 1, 0],
                [0, pixels.height - 1],
                [pixels.width - 1, pixels.height - 1]
            ]) {
                expect(pixels.at(x, y)[3]).toBe(255)
            }
        })
    })

    describe('export', () => {
        it('should export a square crop at the source resolution', async () => {
            const onCrop = vi.fn()
            const api = await renderLoaded({ onCrop })

            const result = (await api().crop()) as ImageCropperResult

            expect(result).not.toBeNull()
            expect(result.blob.type).toBe('image/png')
            expect(result.width).toBe(result.height)
            expect(result.width).toBeCloseTo(40, 0)
            expect(result.file).toBeInstanceOf(File)
            expect(onCrop).toHaveBeenCalledTimes(1)
        })

        it('should cap the exported size with output limits', async () => {
            const api = await renderLoaded({ output: { maxWidth: 20 } })

            const result = (await api().crop()) as ImageCropperResult

            expect(result.width).toBe(20)
            expect(result.height).toBe(20)
        })

        it('should honour the requested mime type', async () => {
            const api = await renderLoaded({ output: { type: 'image/jpeg', quality: 0.8 } })

            const result = (await api().crop()) as ImageCropperResult

            expect(result.blob.type).toBe('image/jpeg')
            expect(result.file.name).toBe('crop.jpg')
        })

        it('should report an empty error without an image', async () => {
            const onError = vi.fn()
            let api: ImageCropperApi | undefined
            render(ImageCropperTestWrapper, {
                props: {
                    onError,
                    onReady: (next: ImageCropperApi) => {
                        api = next
                    }
                }
            })

            await vi.waitFor(() => expect(api).toBeDefined())
            const result = await api!.crop()

            expect(result).toBeNull()
            expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'empty' }))
        })

        it('should report a load error for a broken source', async () => {
            const onError = vi.fn()
            render(ImageCropper, { props: { src: 'data:image/png;base64,not-an-image', onError } })

            await vi.waitFor(() =>
                expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'load' }))
            )
        })

        it('should not blame CORS for a same-origin failure', async () => {
            const onError = vi.fn()
            render(ImageCropper, { props: { src: 'data:image/png;base64,not-an-image', onError } })

            await vi.waitFor(() => expect(onError).toHaveBeenCalled())
            expect(onError.mock.calls[0][0].message).not.toContain('Access-Control-Allow-Origin')
        })

        it('should point at CORS when a cross-origin image fails to load', async () => {
            const onError = vi.fn()
            render(ImageCropper, { props: { src: 'http://127.0.0.1:1/missing.png', onError } })

            await vi.waitFor(() =>
                expect(onError).toHaveBeenCalledWith(
                    expect.objectContaining({
                        code: 'load',
                        message: expect.stringContaining('Access-Control-Allow-Origin')
                    })
                )
            )
        })
    })
})
