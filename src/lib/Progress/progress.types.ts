import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { Progress } from 'bits-ui'
import type { ProgressVariantProps, ProgressSlots } from './progress.variants.js'

export type ProgressProps = Omit<Progress.RootProps, 'max'> & {
    /**
     * The current progress value.
     * When undefined or null, displays an indeterminate state.
     */
    value?: number | null

    /**
     * The maximum value of the progress.
     * Accepts a number or an array of strings for step-based display.
     * @default 100
     */
    max?: number | string[]

    /**
     * Displays the status text showing current value relative to max.
     * @default false
     */
    status?: boolean

    /**
     * Sets the color scheme applied to the progress indicator.
     * @default 'primary'
     */
    color?: NonNullable<ProgressVariantProps['color']>

    /**
     * Controls the thickness of the progress bar.
     * @default 'md'
     */
    size?: NonNullable<ProgressVariantProps['size']>

    /**
     * Controls the layout direction of the progress bar.
     * @default 'horizontal'
     */
    orientation?: NonNullable<ProgressVariantProps['orientation']>

    /**
     * Inverts the fill direction of the progress bar.
     * @default false
     */
    inverted?: boolean

    /**
     * Sets the animation style for the indeterminate state.
     * @default 'carousel'
     */
    animation?: NonNullable<ProgressVariantProps['animation']>

    /**
     * Override styles for specific progress slots.
     * Available slots: root, base, indicator, status, steps.
     */
    ui?: Partial<Record<ProgressSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom content rendered in the status area.
     * Takes precedence over the default status display.
     */
    statusSlot?: Snippet<[{ percent: number }]>
}
