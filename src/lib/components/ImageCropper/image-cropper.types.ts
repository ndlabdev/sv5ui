import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ImageCropperVariantProps, ImageCropperSlots } from './image-cropper.variants.js'
import type { Rect } from './image-cropper.utils.js'

/**
 * A rectangle expressed in source-image pixels.
 *
 * When the image is rotated by an angle that is not a multiple of 90°, this is
 * the axis-aligned bounding box of the rotated crop region.
 */
export type ImageCropperArea = Rect

/**
 * Toolbar buttons rendered above the stage, in the given order.
 */
export type ImageCropperToolbarItem =
    | 'zoomOut'
    | 'zoomIn'
    | 'rotateLeft'
    | 'rotateRight'
    | 'flipHorizontal'
    | 'flipVertical'
    | 'reset'

/**
 * Reason a crop could not be produced.
 *
 * - `empty`: no image is loaded yet
 * - `load`: the image failed to load
 * - `tainted`: the canvas is tainted by a cross-origin image, so it cannot be exported
 * - `export`: the browser refused to encode the canvas
 */
export type ImageCropperErrorCode = 'empty' | 'load' | 'tainted' | 'export'

/**
 * What the stage is showing while there is no croppable image.
 *
 * - `empty`: no `src` was given
 * - `loading`: the image is still downloading or decoding
 * - `error`: the image failed to load
 */
export type ImageCropperStatus = 'empty' | 'loading' | 'error'

export interface ImageCropperError {
    code: ImageCropperErrorCode
    message: string
    cause?: unknown
}

/**
 * Encoding options for the exported image.
 */
export interface ImageCropperOutput {
    /**
     * MIME type of the produced blob.
     * @default 'image/png'
     */
    type?: 'image/png' | 'image/jpeg' | 'image/webp'

    /**
     * Encoder quality between `0` and `1`, for lossy types only.
     * @default 0.92
     */
    quality?: number

    /**
     * Maximum width of the exported image, in pixels. The crop is downscaled to
     * fit, never upscaled beyond the source resolution.
     */
    maxWidth?: number

    /**
     * Maximum height of the exported image, in pixels.
     */
    maxHeight?: number

    /**
     * Background painted behind the crop, useful when exporting a circular crop
     * or a transparent PNG to a format without an alpha channel.
     */
    background?: string
}

/**
 * The result of a crop operation.
 */
export interface ImageCropperResult {
    /** Encoded image data. */
    blob: Blob
    /** The same data wrapped in a `File`, ready for an upload payload. */
    file: File
    /** Width of the exported image in pixels. */
    width: number
    /** Height of the exported image in pixels. */
    height: number
    /** The cropped region in source-image pixels. */
    area: ImageCropperArea
    /** Rotation applied to the source image, in degrees. */
    rotation: number
    /** Zoom factor relative to the fitted image. */
    zoom: number
    /** Whether the source image was mirrored horizontally. */
    flipX: boolean
    /** Whether the source image was mirrored vertically. */
    flipY: boolean
}

/**
 * Imperative handle exposed through the `api` prop.
 */
export interface ImageCropperApi {
    /** Render the current selection and resolve with the encoded result. */
    crop: () => Promise<ImageCropperResult | null>
    /** Restore zoom, pan, rotation, flip and the crop frame to their initial state. */
    reset: () => void
    /** Zoom in by one `zoomStep`. */
    zoomIn: () => void
    /** Zoom out by one `zoomStep`. */
    zoomOut: () => void
    /** Set the zoom factor, clamped to `minZoom`/`maxZoom`. */
    zoomTo: (zoom: number) => void
    /** Rotate by a relative amount in degrees. */
    rotate: (degrees: number) => void
    /** Set the absolute rotation in degrees. */
    rotateTo: (degrees: number) => void
    /** Mirror the image along the given axis. */
    flip: (axis: 'horizontal' | 'vertical') => void
    /** The crop region in source-image pixels. */
    readonly area: ImageCropperArea
    readonly zoom: number
    readonly rotation: number
}

export type ImageCropperProps = Omit<
    HTMLAttributes<HTMLElement>,
    'class' | 'children' | 'placeholder'
> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The image to crop. A `File` or `Blob` is turned into an object URL that is
     * revoked automatically when it is replaced or the component is destroyed.
     */
    src?: string | File | Blob | null

    /**
     * Alternative text forwarded to the underlying `<img>`.
     * @default 'Image to crop'
     */
    alt?: string

    /**
     * Interaction model.
     *
     * - `fixed`: the crop frame is centred and immovable; the user pans and zooms
     *   the image behind it. Best for avatars and covers, and on touch devices.
     * - `box`: the image stays fitted inside the stage; the user drags the crop
     *   frame and its handles. Dragging outside the frame still pans the image.
     *
     * @default 'fixed'
     */
    mode?: NonNullable<ImageCropperVariantProps['mode']>

    /**
     * Aspect ratio of the crop frame as `width / height`, or `'free'` to let the
     * user resize both axes independently (`box` mode only).
     *
     * Ignored when `shape` is `'circle'`, which always crops 1:1.
     *
     * @default 1
     */
    aspect?: number | 'free'

    /**
     * Shape of the crop frame. A circular frame is exported with a transparent
     * outside, so prefer `image/png` or set `output.background`.
     * @default 'rect'
     */
    shape?: NonNullable<ImageCropperVariantProps['shape']>

    /**
     * Current zoom factor, where `1` fits the image to the crop frame. Supports
     * two-way binding with `bind:zoom`.
     * @default 1
     */
    zoom?: number

    /**
     * Minimum zoom factor.
     * @default 1
     */
    minZoom?: number

    /**
     * Maximum zoom factor.
     * @default 3
     */
    maxZoom?: number

    /**
     * Zoom increment applied by the toolbar buttons and the mouse wheel.
     * @default 0.25
     */
    zoomStep?: number

    /**
     * The crop region in source-image pixels. Supports two-way binding: the
     * component writes the current region here, and assigning a region restores
     * it — zoom, pan and the crop frame are recomputed to match, so a crop saved
     * earlier can be reopened for editing.
     *
     * With a rotated image the region is matched through its bounding box.
     */
    area?: ImageCropperArea

    /**
     * Crop automatically after every change, without waiting for `crop()`.
     * Pass a number to set the debounce delay in milliseconds.
     *
     * @default false
     */
    autoCrop?: boolean | number

    /**
     * How the mouse wheel zooms.
     *
     * - `'always'`: the wheel always zooms, and page scrolling is suppressed
     *   while the pointer is over the stage
     * - `'ctrl'`: the wheel only zooms while Ctrl or Cmd is held, so the page
     *   keeps scrolling normally
     * - `false`: the wheel never zooms
     *
     * @default 'always'
     */
    wheelZoom?: 'always' | 'ctrl' | false

    /**
     * Current rotation in degrees. Supports two-way binding with `bind:rotation`.
     *
     * The toolbar rotates in quarter turns. Arbitrary angles are supported by
     * `api.rotateTo()`, but in `box` mode the crop frame is then bounded by the
     * rotated image's bounding box, so a frame pushed into a corner can include
     * transparent pixels.
     *
     * @default 0
     */
    rotation?: number

    /**
     * Mirror the image horizontally. Supports two-way binding.
     * @default false
     */
    flipX?: boolean

    /**
     * Mirror the image vertically. Supports two-way binding.
     * @default false
     */
    flipY?: boolean

    /**
     * The last cropped file. Set after every successful `crop()` so it can be
     * bound directly into form state with `bind:value`.
     *
     * Note: a `File` cannot travel through a hidden input, so this component does
     * not participate in native form submission — read the bound value instead.
     */
    value?: File | null

    /**
     * Space in pixels kept between the stage edges and the crop frame.
     * @default 16
     */
    padding?: number

    /**
     * Smallest allowed crop frame size in pixels (`box` mode only).
     * @default 48
     */
    minCropSize?: number

    /**
     * Show rule-of-thirds guides inside the crop frame.
     * @default false
     */
    grid?: boolean

    /**
     * Toolbar buttons, or `false` to hide the toolbar entirely.
     * @default true
     */
    toolbar?: boolean | ImageCropperToolbarItem[]

    /**
     * Show the zoom slider under the stage.
     * @default true
     */
    zoomSlider?: boolean

    /**
     * Show a rotation slider under the stage, for angles between -180° and 180°.
     *
     * Free angles are exact in `fixed` mode. In `box` mode the crop frame is
     * bounded by the rotated image's bounding box, so prefer quarter turns there.
     *
     * @default false
     */
    rotationSlider?: boolean

    /**
     * `crossorigin` attribute for the underlying `<img>`. Required when cropping
     * a remote image, otherwise the canvas is tainted and the export fails.
     * @default 'anonymous'
     */
    crossorigin?: 'anonymous' | 'use-credentials' | null

    /**
     * Encoding options for the exported image.
     */
    output?: ImageCropperOutput

    /**
     * Bindable imperative handle.
     */
    api?: ImageCropperApi

    /**
     * Callback fired after a successful crop.
     */
    onCrop?: (result: ImageCropperResult) => void

    /**
     * Callback fired once the image is decoded, with its intrinsic size.
     */
    onLoad?: (size: { width: number; height: number }) => void

    /**
     * Callback fired whenever the crop region changes, in source-image pixels.
     */
    onAreaChange?: (area: ImageCropperArea) => void

    /**
     * Callback fired when the user starts dragging or pinching the stage.
     */
    onCropStart?: (area: ImageCropperArea) => void

    /**
     * Callback fired when that gesture ends, after the region settles within its
     * constraints. Toolbar, slider and keyboard changes do not fire this pair.
     */
    onCropEnd?: (area: ImageCropperArea) => void

    /**
     * Callback fired when the image cannot be loaded or exported.
     */
    onError?: (error: ImageCropperError) => void

    /**
     * Color scheme applied to the focus ring and the resize handles.
     * @default 'primary'
     */
    color?: NonNullable<ImageCropperVariantProps['color']>

    /**
     * Size of the stage and its controls.
     * @default 'md'
     */
    size?: NonNullable<ImageCropperVariantProps['size']>

    /**
     * Disable every interaction.
     * @default false
     */
    disabled?: boolean

    /**
     * Icon overrides for the toolbar.
     */
    icons?: {
        zoomIn?: string
        zoomOut?: string
        rotateLeft?: string
        rotateRight?: string
        flipHorizontal?: string
        flipVertical?: string
        reset?: string
        placeholder?: string
        loading?: string
        error?: string
    }

    /**
     * Accessible label for the stage.
     * @default 'Image cropper'
     */
    label?: string

    /**
     * Text overrides for every string the component renders, for translation or
     * for wording that matches the surrounding app.
     */
    labels?: {
        zoomIn?: string
        zoomOut?: string
        rotateLeft?: string
        rotateRight?: string
        flipHorizontal?: string
        flipVertical?: string
        reset?: string
        zoom?: string
        rotation?: string
        empty?: string
        loading?: string
        error?: string
        /** Screen-reader instructions describing the keyboard shortcuts. */
        hint?: string
        /** Accessible label for each resize handle in `box` mode. */
        handles?: Partial<Record<'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w', string>>
    }

    /**
     * Content shown while there is no croppable image, for every `status`:
     * no source, a source that is still loading, or one that failed.
     */
    placeholder?: Snippet<[{ status: ImageCropperStatus }]>

    /**
     * Replaces the default toolbar. Receives the imperative handle.
     */
    toolbarSlot?: Snippet<[{ api: ImageCropperApi }]>

    /**
     * Rendered under the stage, after the zoom slider.
     */
    footer?: Snippet<[{ api: ImageCropperApi }]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific image cropper slots.
     */
    ui?: Partial<Record<ImageCropperSlots, ClassNameValue>>
}
