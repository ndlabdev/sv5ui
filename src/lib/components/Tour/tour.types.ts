import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { Placement } from '@floating-ui/dom'
import type { TourSlots, TourVariantProps } from './tour.variants.js'

// ============================================================================
// Target
// ============================================================================

/**
 * What a step points at.
 * - `string`     → CSS selector, resolved lazily each time the step activates.
 * - `HTMLElement`→ used directly.
 * - `() => ...`  → getter, resolved on activation (reactive sources welcome).
 * - `null`/omit  → dialog mode: panel is centered, no spotlight anchor.
 */
export type TourTarget = string | HTMLElement | (() => HTMLElement | null) | null

// ============================================================================
// Step
// ============================================================================

/**
 * Configuration for a single step in the tour.
 *
 * @example
 * ```ts
 * const step: TourStep = {
 *   target: '#create-btn',
 *   title: 'Create',
 *   description: 'Click here to make your first item.',
 *   placement: 'right'
 * }
 * ```
 */
export interface TourStep {
    /**
     * Stable identifier. Enables `goTo('step-id')` and survives reordering.
     * Falls back to the step's zero-based index when omitted.
     */
    id?: string

    /**
     * Element the step highlights. See {@link TourTarget}.
     * Omit (or `null`) for a centered dialog step with no spotlight.
     */
    target?: TourTarget

    /**
     * Poll the DOM until the target appears (useful right after a route change
     * where the target hasn't rendered yet).
     * - `true`   → wait up to 2000ms.
     * - `number` → wait up to this many milliseconds.
     * @default inherits `TourProps.waitForTarget`
     */
    waitForTarget?: boolean | number

    /**
     * Heading shown at the top of the panel.
     */
    title?: string

    /**
     * Body text shown under the title.
     */
    description?: string

    /**
     * Custom body content. Replaces `title` + `description` rendering.
     */
    content?: Snippet<[TourStepSlotProps]>

    /**
     * Panel placement relative to the target. Overrides `TourProps.placement`.
     * @example 'bottom' | 'top-start' | 'right-end'
     */
    placement?: Placement

    /**
     * Gap in pixels between the target and the panel. Overrides `TourProps.sideOffset`.
     */
    sideOffset?: number

    /**
     * Extra pixels around the target inside the spotlight cut-out.
     * Overrides `TourProps.spotlightPadding`.
     */
    spotlightPadding?: number

    /**
     * Corner radius of the spotlight cut-out in pixels.
     * Overrides `TourProps.spotlightRadius`.
     */
    spotlightRadius?: number

    /**
     * Let pointer events reach the highlighted target (the dismiss backdrop is
     * dropped for this step). Useful for "try clicking this" steps.
     * Overrides `TourProps.spotlightInteractable`.
     */
    spotlightInteractable?: boolean

    /**
     * Hide the spotlight entirely for this step (intro / outro). The panel still
     * renders, centered when there is no target.
     * @default false
     */
    disableSpotlight?: boolean

    /**
     * Scroll the target into view before positioning. Overrides `TourProps.scrollIntoView`.
     */
    scrollIntoView?: boolean | ScrollIntoViewOptions

    /**
     * Label for the next button on this step (e.g. `'Try it'`).
     */
    nextLabel?: string

    /**
     * Label for the previous button on this step.
     */
    prevLabel?: string

    /**
     * Show the previous button on this step. Defaults to hidden on the first step.
     */
    showPrev?: boolean

    /**
     * Show the skip button on this step. Overrides `TourProps.showSkip`.
     */
    showSkip?: boolean

    /**
     * Guard run before advancing. Return `false` (or a rejecting/`false` promise)
     * to block the move — e.g. to validate a form first.
     */
    onBeforeNext?: () => boolean | Promise<boolean>

    /**
     * Guard run before going back. Return `false` to block the move.
     */
    onBeforePrev?: () => boolean | Promise<boolean>

    /**
     * Called when the step becomes active. May be async; the panel waits for it
     * to resolve before animating in.
     */
    onEnter?: () => void | Promise<void>

    /**
     * Skip this step. `next()` / `prev()` jump over it automatically.
     * @default false
     */
    disabled?: boolean

    /**
     * Route this step belongs to. Pure metadata — the component never navigates.
     * Read it in `onStepChange` to drive your router.
     */
    route?: string

    /**
     * Additional CSS classes for this step's panel.
     */
    class?: ClassNameValue

    /**
     * Per-step overrides for individual slot classes.
     */
    ui?: Partial<Record<TourSlots, ClassNameValue>>
}

// ============================================================================
// Slot Props
// ============================================================================

/**
 * Context passed to every Tour snippet (`header`, `footer`, `content`).
 */
export interface TourStepSlotProps {
    /** The current step's data. */
    step: TourStep
    /** Zero-based position in the `steps` array. */
    index: number
    /** Human-friendly one-based position (`index + 1`). */
    number: number
    /** Total number of steps. */
    total: number
    /** Whether this is the first step. */
    isFirst: boolean
    /** Whether this is the last step. */
    isLast: boolean
    /** The controller driving the tour. */
    controller: TourController
    /** Shorthand for `controller.next()`. */
    next: () => void
    /** Shorthand for `controller.prev()`. */
    prev: () => void
    /** Shorthand for `controller.stop()`. */
    stop: () => void
}

// ============================================================================
// Controller
// ============================================================================

/**
 * Imperative controller for a tour. Returned by both `useTour()` and the
 * component's `bind:api`. It is the single source of truth for tour state —
 * there is no `bind:open` / `bind:step`.
 *
 * @example
 * ```svelte
 * <script>
 *   let api = $state<TourController>()
 * </script>
 *
 * <Button onclick={() => api?.start()}>Start tour</Button>
 * <Tour {steps} bind:api />
 * ```
 */
export interface TourController {
    /**
     * Open the tour. Optionally start at a specific step (index or `id`).
     * Defaults to `defaultStep`.
     */
    start: (step?: number | string) => void

    /**
     * Close the tour. Does not fire `onComplete`.
     */
    stop: () => void

    /**
     * Advance to the next enabled step. On the last step this completes the tour
     * (fires `onComplete` and closes).
     */
    next: () => void

    /**
     * Go back to the previous enabled step. No-op on the first step.
     */
    prev: () => void

    /**
     * Jump to a step by index or `id`. Bypasses `onBeforeNext` / `onBeforePrev`.
     */
    goTo: (step: number | string) => void

    /** Whether the tour is currently open. */
    readonly isActive: boolean

    /** Current step's zero-based index, or `-1` when inactive. */
    readonly currentIndex: number

    /** Total number of steps. */
    readonly totalSteps: number

    /** Whether `prev()` would move back. */
    readonly hasPrev: boolean

    /** Whether `next()` would move forward (not on the last step). */
    readonly hasNext: boolean

    /** Whether the current step is the first one. */
    readonly isFirst: boolean

    /** Whether the current step is the last one. */
    readonly isLast: boolean

    /** The current step's data, or `undefined` when inactive. */
    readonly currentStepData: TourStep | undefined
}

// ============================================================================
// useTour
// ============================================================================

/**
 * Persistence configuration for `useTour`. Lets an in-progress tour survive a
 * page reload or SPA navigation.
 */
export interface TourPersistOptions {
    /**
     * Storage key.
     * @default 'sv5ui-tour'
     */
    key?: string

    /**
     * Which Web Storage to use.
     * @default 'local'
     */
    storage?: 'local' | 'session'
}

/**
 * Options for the `useTour` hook.
 *
 * @example
 * ```ts
 * const tour = useTour({
 *   steps,
 *   persist: true,
 *   onStepChange: (i) => { if (steps[i].route) goto(steps[i].route) }
 * })
 * ```
 */
export interface UseTourOptions {
    /**
     * The steps that make up the tour.
     */
    steps: TourStep[]

    /**
     * Step to open at when `start()` is called without an argument.
     * @default 0
     */
    defaultStep?: number

    /**
     * Persist `open` + current step so the tour resumes across reloads /
     * navigations. `true` uses the defaults in {@link TourPersistOptions}.
     * @default false
     */
    persist?: boolean | TourPersistOptions

    /**
     * Fired when the tour opens.
     */
    onStart?: () => void

    /**
     * Fired when the tour finishes (advancing past the last step).
     */
    onComplete?: () => void

    /**
     * Fired when the tour is skipped/closed before completing. Receives the
     * index it was on.
     */
    onSkip?: (index: number) => void

    /**
     * Fired whenever the active step changes. Receives the new and previous
     * indices. Use it to drive routing in multi-page tours.
     */
    onStepChange?: (index: number, prev: number) => void
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Tour component.
 *
 * The component always runs on a {@link TourController}: pass one via
 * `controller` (e.g. from `useTour()` for multi-page tours), or let the
 * component create one internally and read it back through `bind:api`.
 *
 * @example
 * ```svelte
 * <Tour {steps} bind:api onComplete={() => ...} />
 * ```
 */
export interface TourProps {
    /** Custom data attributes are forwarded to the panel element. */
    [key: `data-${string}`]: string | number | boolean | null | undefined

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * The steps that make up the tour.
     */
    steps: TourStep[]

    // -------------------------------------------------------------------------
    // Controller
    // -------------------------------------------------------------------------

    /**
     * External controller (typically from `useTour()`). When provided, the
     * component reads all state from it and never creates its own. Required for
     * multi-page tours where state must outlive the component.
     */
    controller?: TourController

    /**
     * Bindable controller. Echoes the active controller (internal or external)
     * for imperative `start()` / `stop()` / `goTo()` from the parent.
     */
    api?: TourController

    /**
     * Step to open at when `start()` is called without an argument. Ignored when
     * a `controller` is supplied (configure it on the hook instead).
     * @default 0
     */
    defaultStep?: number

    // -------------------------------------------------------------------------
    // Callbacks
    // -------------------------------------------------------------------------

    /**
     * Fired when the tour opens or closes.
     */
    onOpenChange?: (open: boolean) => void

    /**
     * Fired whenever the active step changes. Receives new and previous indices.
     */
    onStepChange?: (index: number, prev: number) => void

    /**
     * Fired when the tour opens.
     */
    onStart?: () => void

    /**
     * Fired when the tour finishes (advancing past the last step).
     */
    onComplete?: () => void

    /**
     * Fired when the tour is skipped/closed before completing.
     */
    onSkip?: (index: number) => void

    // -------------------------------------------------------------------------
    // Positioning
    // -------------------------------------------------------------------------

    /**
     * Default panel placement relative to the target.
     * @default 'bottom'
     */
    placement?: Placement

    /**
     * Default gap in pixels between the target and the panel.
     * @default 12
     */
    sideOffset?: number

    // -------------------------------------------------------------------------
    // Spotlight
    // -------------------------------------------------------------------------

    /**
     * Render the spotlight cut-out highlighting the target.
     * @default true
     */
    spotlight?: boolean

    /**
     * Default extra pixels around the target inside the cut-out.
     * @default 8
     */
    spotlightPadding?: number

    /**
     * Default corner radius of the cut-out in pixels.
     * @default 8
     */
    spotlightRadius?: number

    /**
     * Default: let pointer events reach the highlighted target.
     * @default false
     */
    spotlightInteractable?: boolean

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Scroll the target into view before positioning each step.
     * @default true
     */
    scrollIntoView?: boolean | ScrollIntoViewOptions

    /**
     * Default DOM-poll timeout for targets that aren't rendered yet.
     * @default 2000
     */
    waitForTarget?: boolean | number

    /**
     * Allow closing the tour by clicking the backdrop or pressing Escape.
     * @default false
     */
    dismissible?: boolean

    /**
     * Render an arrow pointing from the panel to the target.
     * @default true
     */
    arrow?: boolean

    // -------------------------------------------------------------------------
    // Labels
    // -------------------------------------------------------------------------

    /**
     * Label for the previous button.
     * @default 'Back'
     */
    prevLabel?: string

    /**
     * Label for the next button.
     * @default 'Next'
     */
    nextLabel?: string

    /**
     * Label for the next button on the last step.
     * @default 'Done'
     */
    doneLabel?: string

    /**
     * Label for the skip button.
     * @default 'Skip'
     */
    skipLabel?: string

    // -------------------------------------------------------------------------
    // Display
    // -------------------------------------------------------------------------

    /**
     * Show the progress dots in the footer.
     * @default true
     */
    showProgress?: boolean

    /**
     * Show the skip button.
     * @default true
     */
    showSkip?: boolean

    /**
     * Size variant controlling the panel width.
     * @default 'md'
     */
    size?: NonNullable<TourVariantProps['size']>

    /**
     * Animate the panel and spotlight. Automatically disabled when the user
     * prefers reduced motion.
     * @default true
     */
    transition?: NonNullable<TourVariantProps['transition']>

    /**
     * Render the tour in a portal.
     * @default true
     */
    portal?: boolean

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the panel element.
     */
    class?: ClassNameValue

    /**
     * Override classes for component slots.
     */
    ui?: Partial<Record<TourSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Snippets
    // -------------------------------------------------------------------------

    /**
     * Custom panel header. Replaces the default title + close button.
     */
    header?: Snippet<[TourStepSlotProps]>

    /**
     * Custom panel footer. Replaces the default progress + navigation buttons.
     */
    footer?: Snippet<[TourStepSlotProps]>

    /**
     * Custom panel body. Replaces the entire content area (title, description,
     * and each step's `content`).
     */
    content?: Snippet<[TourStepSlotProps]>
}
