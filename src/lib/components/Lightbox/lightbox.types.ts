import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { DialogRootPropsWithoutHTML, DialogContentPropsWithoutHTML } from 'bits-ui'
import type { LightboxSlots, LightboxVariantProps } from './lightbox.variants.js'

/**
 * The media kind rendered for a slide.
 * - `image`: an `<img>` element (default) with zoom/pan support.
 * - `video`: a native `<video>` element with controls.
 * - `iframe`: an embedded `<iframe>` (e.g. YouTube/Vimeo/maps).
 */
export type LightboxSlideType = 'image' | 'video' | 'iframe'

/**
 * A single media item displayed by the Lightbox.
 */
export interface LightboxSlide {
    /**
     * Source URL of the full-resolution media shown in the viewer.
     */
    src: string

    /**
     * Alternative text. Required for accessibility and SEO on image slides;
     * also used as the accessible label for the active slide.
     */
    alt: string

    /**
     * Media kind. Defaults to `'image'`.
     */
    type?: LightboxSlideType

    /**
     * Optional caption title shown in the overlay caption bar.
     */
    title?: string

    /**
     * Optional caption description shown below the title.
     */
    description?: string

    /**
     * Thumbnail URL used in the in-page gallery and the thumbnail strip.
     * Falls back to `src` when omitted.
     */
    thumb?: string

    /**
     * Responsive `srcset` applied to image slides and gallery thumbnails.
     */
    srcset?: string

    /**
     * Responsive `sizes` attribute paired with `srcset`.
     */
    sizes?: string

    /**
     * Intrinsic media width in pixels. Rendered on the gallery `<img>` to
     * reserve layout space (reduces CLS, better SEO/Core Web Vitals).
     */
    width?: number

    /**
     * Intrinsic media height in pixels. See `width`.
     */
    height?: number

    /**
     * Controls the toolbar download action for this slide.
     * - omitted: downloads `src` (fetched as a blob so cross-origin media saves
     *   correctly; falls back to opening in a new tab when CORS is blocked).
     * - string: an explicit URL to download instead of `src`.
     * - `false`: hides the download control for this slide.
     */
    download?: string | false

    /**
     * Poster image for `video` slides.
     */
    poster?: string

    /**
     * Extra attributes forwarded to the underlying `<video>`/`<iframe>` element
     * (e.g. `{ autoplay: true, allow: 'fullscreen' }`).
     */
    attrs?: Record<string, unknown>
}

/**
 * Toolbar buttons that can be individually toggled. Pass an array to show only
 * the listed controls, or `false` to hide the toolbar entirely.
 */
export type LightboxToolbarItem =
    | 'zoomIn'
    | 'zoomOut'
    | 'zoomReset'
    | 'rotate'
    | 'slideshow'
    | 'fullscreen'
    | 'download'
    | 'close'

/**
 * Icon overrides for the Lightbox controls.
 */
export interface LightboxIcons {
    prev?: string
    next?: string
    close?: string
    zoomIn?: string
    zoomOut?: string
    zoomReset?: string
    rotate?: string
    play?: string
    pause?: string
    fullscreenEnter?: string
    fullscreenExit?: string
    download?: string
}

/**
 * Slideshow / autoplay configuration. Pass `true` for defaults.
 */
export interface LightboxSlideshowOptions {
    /** Delay between slides in milliseconds. @default 4000 */
    delay?: number
    /** Start playing as soon as the viewer opens. @default false */
    playOnOpen?: boolean
}

/**
 * Props passed to the `trigger` snippet used to render the in-page gallery.
 */
export interface LightboxTriggerSlotProps {
    /** The slides array. */
    slides: LightboxSlide[]
    /** Open the viewer at a given slide index. */
    open: (index?: number) => void
}

/**
 * Props passed to the `slide` snippet for custom media rendering.
 */
export interface LightboxSlideSlotProps {
    /** The slide item. */
    slide: LightboxSlide
    /** Zero-based slide index. */
    index: number
    /** Whether this slide is the active one. */
    active: boolean
    /** Current zoom scale of the active slide (1 = fit). */
    scale: number
}

/**
 * Props passed to the `thumbnail` snippet for custom thumbnail rendering.
 */
export interface LightboxThumbnailSlotProps {
    slide: LightboxSlide
    index: number
    active: boolean
    select: () => void
}

/**
 * Props passed to the `caption` snippet.
 */
export interface LightboxCaptionSlotProps {
    slide: LightboxSlide
    index: number
    total: number
}

/**
 * Imperative API exposed via `bind:api` for programmatic control.
 */
export interface LightboxApi {
    open: (index?: number) => void
    close: () => void
    next: () => void
    prev: () => void
    goTo: (index: number) => void
    zoomIn: () => void
    zoomOut: () => void
    resetZoom: () => void
    rotate: () => void
    toggleSlideshow: () => void
    readonly index: number
    readonly scale: number
    readonly isOpen: boolean
}

type RootProps = Pick<DialogRootPropsWithoutHTML, 'onOpenChangeComplete'>

type ContentProps = Pick<
    DialogContentPropsWithoutHTML,
    'trapFocus' | 'preventScroll' | 'onOpenAutoFocus' | 'onCloseAutoFocus'
>

export interface LightboxProps extends RootProps, ContentProps {
    // --- Data ---

    /**
     * The media items to display.
     */
    slides: LightboxSlide[]

    // --- State ---

    /**
     * Whether the viewer is open. Bindable.
     * @default false
     */
    open?: boolean

    /**
     * The active slide index. Bindable.
     * @default 0
     */
    index?: number

    /**
     * Imperative API handle. Bindable.
     */
    api?: LightboxApi

    /**
     * Called when the open state changes.
     */
    onOpenChange?: (open: boolean) => void

    /**
     * Called when the active index changes.
     */
    onIndexChange?: (index: number) => void

    // --- Behavior ---

    /**
     * Loop navigation from the last slide back to the first and vice versa.
     * @default true
     */
    loop?: boolean

    /**
     * Allow closing via Escape and clicking the backdrop.
     * @default true
     */
    dismissible?: boolean

    /**
     * Maximum zoom scale.
     * @default 5
     */
    maxScale?: number

    /**
     * Zoom multiplier applied per zoom-in/out step and wheel tick.
     * @default 0.5
     */
    zoomStep?: number

    /**
     * Enable pointer/wheel/double-click zoom on image slides.
     * @default true
     */
    zoom?: boolean

    /**
     * Slideshow autoplay. Pass `true` for defaults or an options object.
     * @default false
     */
    slideshow?: boolean | LightboxSlideshowOptions

    // --- UI toggles ---

    /**
     * Show the thumbnail strip. Automatically hidden on small screens.
     * @default true
     */
    thumbnails?: boolean

    /**
     * Show the slide counter (e.g. "3 / 12").
     * @default true
     */
    counter?: boolean

    /**
     * Show the caption bar with title/description.
     * @default true
     */
    caption?: boolean

    /**
     * Show the previous/next navigation arrows.
     * @default true
     */
    arrows?: boolean

    /**
     * Toolbar controls. `true` shows the default set, `false` hides the toolbar,
     * or pass an array to show only specific controls.
     * @default true
     */
    toolbar?: boolean | LightboxToolbarItem[]

    /**
     * Controls the open/close and slide-change animation.
     * - `'fade'` (default): cross-fade.
     * - `'scale'`: scale-in from the trigger.
     * - `'none'` / `false`: no animation.
     * Respects `prefers-reduced-motion`.
     * @default 'fade'
     */
    transition?: LightboxVariantProps['transition'] | boolean

    // --- Styling ---

    /**
     * Icon overrides for the controls.
     */
    icons?: LightboxIcons

    /**
     * Override classes for specific slots.
     */
    ui?: Partial<Record<LightboxSlots, ClassNameValue>>

    /**
     * Additional classes for the in-page gallery wrapper.
     */
    class?: ClassNameValue

    // --- Slots ---

    /**
     * In-page gallery renderer. Receives `open()` to launch the viewer.
     * When omitted, a responsive thumbnail grid is rendered from `slides`.
     * This content lives in the normal document flow so crawlers index it.
     */
    trigger?: Snippet<[LightboxTriggerSlotProps]>

    /**
     * Custom renderer for a slide's media. Overrides the default image/video/iframe.
     */
    slide?: Snippet<[LightboxSlideSlotProps]>

    /**
     * Custom thumbnail renderer for the strip.
     */
    thumbnail?: Snippet<[LightboxThumbnailSlotProps]>

    /**
     * Custom caption renderer.
     */
    captionSlot?: Snippet<[LightboxCaptionSlotProps]>

    /**
     * Extra content appended to the toolbar (before the close button).
     */
    toolbarExtra?: Snippet
}
