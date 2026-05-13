import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import type { CarouselSlots, CarouselVariantProps } from './carousel.variants.js'

/**
 * Re-export the Embla API type so consumers can type their `bind:api` value
 * without importing `embla-carousel` directly.
 */
export type CarouselApi = EmblaCarouselType

/**
 * Configuration for the autoplay plugin. When `true` the defaults are used;
 * pass an object to override individual settings.
 */
export interface CarouselAutoplayOptions {
    /** Delay between slides in milliseconds. @default 4000 */
    delay?: number
    /** Stop the autoplay timer permanently on user interaction. @default true */
    stopOnInteraction?: boolean
    /** Pause while the pointer is over the carousel. @default false */
    stopOnMouseEnter?: boolean
    /** Pause while keyboard focus is inside the carousel. @default true */
    stopOnFocusIn?: boolean
    /** Stop temporarily when the document tab is hidden. @default true */
    stopOnLastSnap?: boolean
    /** Whether the autoplay should start playing on init. @default true */
    playOnInit?: boolean
}

/**
 * Props passed to the `slide` snippet.
 */
export interface CarouselSlideSlotProps<T = unknown> {
    /** The current slide item from the `items` array. */
    item: T
    /** Zero-based slide index. */
    index: number
    /** Whether this slide is the currently selected one. */
    selected: boolean
}

/**
 * Props passed to the `dot` snippet for custom indicator rendering.
 */
export interface CarouselDotSlotProps {
    /** Zero-based dot index. */
    index: number
    /** Whether this dot represents the currently selected slide. */
    selected: boolean
    /** Imperative helper to jump to this slide. */
    select: () => void
}

/**
 * Props passed to the `prev` / `next` snippets for custom arrow rendering.
 */
export interface CarouselArrowSlotProps {
    /** Whether the corresponding direction can scroll (false at boundaries when `loop=false`). */
    canScroll: boolean
    /** Imperative helper to trigger the scroll. */
    scroll: () => void
}

/**
 * Props for the Carousel component.
 *
 * @example
 * ```svelte
 * <Carousel items={images} loop autoplay>
 *   {#snippet slide({ item })}
 *     <img src={item.url} alt={item.alt} />
 *   {/snippet}
 * </Carousel>
 * ```
 *
 * @see https://www.embla-carousel.com/
 */
export interface CarouselProps<T = unknown> {
    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------

    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Bindable Embla API. Use it to control the carousel imperatively, e.g.
     * `api.scrollTo(3)` or `api.plugins().autoplay.stop()`.
     */
    api?: EmblaCarouselType

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * Array of items to render as slides. If omitted, pass slide elements as
     * `children` instead.
     */
    items?: T[]

    /**
     * Currently selected slide index (zero-based). Supports two-way binding.
     * @default 0
     */
    index?: number

    /**
     * Callback fired when the selected slide changes.
     */
    onIndexChange?: (index: number) => void

    /**
     * Callback fired when the carousel settles after a scroll.
     */
    onSettle?: (api: EmblaCarouselType) => void

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Number of slides visible at once. Acts as a default that can be
     * overridden via `ui.slide` or responsive `breakpoints`.
     * @default 1
     */
    slidesToShow?: number

    /**
     * Wrap around to the first slide after the last (and vice versa).
     * @default false
     */
    loop?: boolean

    /**
     * Alignment of slides within the viewport.
     * @default 'start'
     */
    align?: 'start' | 'center' | 'end'

    /**
     * Layout axis.
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical'

    /**
     * Allow pointer/touch dragging to scroll between slides.
     * @default true
     */
    draggable?: boolean

    /**
     * Allow free-form dragging without snapping to slides.
     * @default false
     */
    dragFree?: boolean

    /**
     * Number of slides to advance per scroll action ('auto' lets Embla decide
     * based on viewport size).
     * @default 1
     */
    slidesToScroll?: number | 'auto'

    /**
     * Enable autoplay. Pass `true` for defaults or an object to customize.
     * @default false
     */
    autoplay?: boolean | CarouselAutoplayOptions

    /**
     * Use a fade transition between slides instead of sliding.
     * @default false
     */
    fade?: boolean

    /**
     * Apply Embla's helper class names (`is-snapped`, `is-in-view`,
     * `is-prev`, `is-next`, `is-selected`, `is-draggable`, `is-dragging`).
     * Useful for advanced styling.
     * @default false
     */
    classNames?: boolean

    /**
     * Responsive overrides keyed by media query. Each value is a partial Embla
     * options object that applies when the media query matches.
     *
     * @example
     * ```ts
     * { '(min-width: 768px)': { slidesToScroll: 2 } }
     * ```
     */
    breakpoints?: Record<string, Omit<EmblaOptionsType, 'breakpoints'>>

    /**
     * Additional Embla plugins. Use this to plug in `auto-scroll`, `wheel-gestures`,
     * or any third-party Embla plugin not covered by built-in props.
     */
    plugins?: EmblaPluginType[]

    /**
     * Escape hatch for setting any Embla option directly. Merged on top of
     * options derived from typed props above.
     */
    options?: Partial<EmblaOptionsType>

    // -------------------------------------------------------------------------
    // UI controls
    // -------------------------------------------------------------------------

    /**
     * Show prev/next arrow buttons.
     * @default true
     */
    arrows?: boolean

    /**
     * Show pagination dots below the carousel.
     * @default true
     */
    dots?: boolean

    /**
     * Icon for the "previous slide" arrow.
     * @default 'lucide:chevron-left' (or 'lucide:chevron-up' when vertical)
     */
    prevIcon?: string

    /**
     * Icon for the "next slide" arrow.
     * @default 'lucide:chevron-right' (or 'lucide:chevron-down' when vertical)
     */
    nextIcon?: string

    // -------------------------------------------------------------------------
    // Visual
    // -------------------------------------------------------------------------

    /**
     * Color scheme used for the active dot and the arrow buttons.
     * @default 'primary'
     */
    color?: NonNullable<CarouselVariantProps['color']>

    /**
     * Controls arrow and dot sizes.
     * @default 'md'
     */
    size?: NonNullable<CarouselVariantProps['size']>

    /**
     * Visual style of arrow buttons.
     * @default 'soft'
     */
    variant?: NonNullable<CarouselVariantProps['variant']>

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override classes for specific carousel slots.
     */
    ui?: Partial<Record<CarouselSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Per-slide renderer. Called for each item in `items`. Receives the item,
     * its index, and whether it is the currently selected slide.
     */
    slide?: Snippet<[CarouselSlideSlotProps<T>]>

    /**
     * Custom dot renderer. When omitted a default dot button is rendered.
     */
    dot?: Snippet<[CarouselDotSlotProps]>

    /**
     * Custom prev arrow renderer. When omitted a default `Button` with
     * `prevIcon` is rendered.
     */
    prevSlot?: Snippet<[CarouselArrowSlotProps]>

    /**
     * Custom next arrow renderer. When omitted a default `Button` with
     * `nextIcon` is rendered.
     */
    nextSlot?: Snippet<[CarouselArrowSlotProps]>

    /**
     * Fallback content for the slide container. Used when `items` is not
     * provided — pass `.embla__slide` elements directly.
     */
    children?: Snippet
}
