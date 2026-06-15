import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'
import type { StepperSlots, StepperVariantProps } from './stepper.variants.js'

// ============================================================================
// State Types
// ============================================================================

/** Lifecycle state of a single step relative to the active step. */
export type StepperItemState = 'pending' | 'active' | 'completed'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Configuration for an individual step inside the Stepper.
 *
 * @example
 * ```ts
 * const item: StepperItem = {
 *   value: 'shipping',
 *   title: 'Shipping',
 *   description: 'Where to deliver',
 *   icon: 'lucide:truck'
 * }
 * ```
 */
export interface StepperItem {
    /**
     * Unique identifier for this step.
     * Falls back to the item's zero-based index when omitted.
     */
    value?: string | number

    /**
     * Title shown next to (or below) the indicator.
     */
    title?: string

    /**
     * Sub-text rendered under the title.
     */
    description?: string

    /**
     * Iconify icon name rendered inside the indicator.
     * Overrides the default number/check fallback.
     */
    icon?: string

    /**
     * Whether this step cannot be activated by the user.
     * @default false
     */
    disabled?: boolean

    /**
     * Plain text body content for the active step's content panel.
     * For complex content, use the `body` snippet instead.
     */
    content?: string

    /**
     * Additional CSS classes applied to this step's wrapper element.
     */
    class?: ClassNameValue

    /**
     * Per-step overrides for individual slot classes.
     */
    ui?: Partial<
        Pick<
            Record<StepperSlots, ClassNameValue>,
            | 'item'
            | 'trigger'
            | 'container'
            | 'indicator'
            | 'separator'
            | 'wrapper'
            | 'title'
            | 'description'
            | 'content'
        >
    >
}

// ============================================================================
// Slot Props
// ============================================================================

/**
 * Context passed to every Stepper snippet (`indicator`, `titleSlot`,
 * `descriptionSlot`, `body`).
 */
export interface StepperSlotProps {
    /** The current step item data. */
    item: StepperItem
    /** Zero-based position in the `items` array. */
    index: number
    /** Human-friendly one-based position (`index + 1`). */
    number: number
    /** Lifecycle state of this step. */
    state: StepperItemState
    /** Convenience: whether this step is the active one. */
    active: boolean
}

// ============================================================================
// Imperative API
// ============================================================================

/**
 * Imperative API exposed via `bind:api`. Useful when driving the Stepper from
 * external buttons (e.g. wizard form with Back/Next).
 *
 * @example
 * ```svelte
 * <script>
 *   let api = $state<StepperApi>()
 * </script>
 *
 * <Stepper bind:api items={steps} bind:value={current} />
 *
 * <Button onclick={() => api?.prev()} disabled={!api?.hasPrev}>Back</Button>
 * <Button onclick={() => api?.next()} disabled={!api?.hasNext}>Next</Button>
 * ```
 */
export interface StepperApi {
    /**
     * Advance to the next step. Always bypasses the `linear` gating (the
     * caller is assumed to have validated already).
     */
    next: () => void

    /**
     * Move back to the previous step. No-op when already at the first step.
     */
    prev: () => void

    /**
     * Jump to a specific step by its `value`. Always bypasses gating.
     */
    goTo: (value: string | number) => void

    /** Whether `next()` would move forward. */
    readonly hasNext: boolean

    /** Whether `prev()` would move back. */
    readonly hasPrev: boolean

    /** Current active step's zero-based index, or `-1` when none matches. */
    readonly activeIndex: number
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Stepper component.
 *
 * Renders a horizontal or vertical progression indicator suitable for
 * multi-step wizards and form flows.
 *
 * @example
 * ```svelte
 * <Stepper
 *   items={steps}
 *   bind:value={current}
 *   bind:api
 *   color="primary"
 * />
 * ```
 */
export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * Array of steps to render.
     */
    items?: StepperItem[]

    // -------------------------------------------------------------------------
    // State (controlled / uncontrolled)
    // -------------------------------------------------------------------------

    /**
     * The currently active step's value. Use `bind:value` for two-way binding.
     * Falls back to `defaultValue` when omitted.
     */
    value?: string | number

    /**
     * Initial active value when uncontrolled. Defaults to the first item's
     * value (or `0` when items have no explicit `value`).
     */
    defaultValue?: string | number

    /**
     * Fired whenever the active step changes (via click, keyboard, or `api`).
     */
    onValueChange?: (value: string | number) => void

    // -------------------------------------------------------------------------
    // Imperative API
    // -------------------------------------------------------------------------

    /**
     * Bindable imperative controller. Useful for wiring up external Back/Next
     * buttons that bypass the `linear` gating.
     */
    api?: StepperApi

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * When `true`, clicking only allows advancing one step at a time. Already
     * completed steps remain freely navigable. The imperative `api.next()`
     * always bypasses this gate.
     * @default true
     */
    linear?: boolean

    /**
     * Whether all steps are disabled.
     * @default false
     */
    disabled?: boolean

    // -------------------------------------------------------------------------
    // Display
    // -------------------------------------------------------------------------

    /**
     * Layout direction.
     * - `'horizontal'`: indicators in a row, title/description below
     * - `'vertical'`: indicators in a column, title/description to the side
     * @default 'horizontal'
     */
    orientation?: NonNullable<StepperVariantProps['orientation']>

    /**
     * Size variant controlling indicator dimensions and text sizes.
     * @default 'md'
     */
    size?: NonNullable<StepperVariantProps['size']>

    /**
     * Color theme for active/completed indicators and separators.
     * @default 'primary'
     */
    color?: NonNullable<StepperVariantProps['color']>

    /**
     * Whether to render the content panel for the active step.
     * Disable when step content lives elsewhere in the layout.
     * @default true
     */
    content?: boolean

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override classes for component slots.
     */
    ui?: Partial<Record<StepperSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Snippets
    // -------------------------------------------------------------------------

    /**
     * Custom indicator content. Receives `{ item, index, number, state, active }`.
     * Replaces the default number/check/icon rendering.
     */
    indicator?: Snippet<[StepperSlotProps]>

    /**
     * Custom title renderer for every step.
     * Falls back to `item.title` when omitted.
     */
    titleSlot?: Snippet<[StepperSlotProps]>

    /**
     * Custom description renderer for every step.
     * Falls back to `item.description` when omitted.
     */
    descriptionSlot?: Snippet<[StepperSlotProps]>

    /**
     * Custom body content shown in the active step's content panel.
     * Falls back to `item.content` text when omitted.
     */
    body?: Snippet<[StepperSlotProps]>
}
