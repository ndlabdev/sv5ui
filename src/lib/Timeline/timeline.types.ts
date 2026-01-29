import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'
import type { TimelineVariantProps, TimelineSlots } from './timeline.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

/** State of a timeline item */
export type TimelineItemState = 'completed' | 'active' | 'pending'

/** Timeline item configuration */
export type TimelineItem = {
    /**
     * Unique identifier for the item.
     * Used for tracking active state.
     */
    value?: string | number

    /**
     * Date or time label for the event.
     */
    date?: string

    /**
     * Title/heading of the event.
     */
    title?: string

    /**
     * Description or details of the event.
     */
    description?: string

    /**
     * Icon to display in the indicator.
     * Accepts any Iconify icon name.
     */
    icon?: string

    /**
     * Avatar configuration to display in the indicator.
     * Takes precedence over icon.
     */
    avatar?: AvatarProps

    /**
     * Additional CSS classes for this item.
     */
    class?: ClassNameValue
}

export type TimelineProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific timeline slots.
     */
    ui?: Partial<Record<TimelineSlots, ClassNameValue>>

    /**
     * Array of timeline items to display.
     */
    items?: TimelineItem[]

    /**
     * Sets the color scheme for active/completed states.
     * @default 'primary'
     */
    color?: NonNullable<TimelineVariantProps['color']>

    /**
     * Controls the size of indicators and spacing.
     * @default 'md'
     */
    size?: NonNullable<TimelineVariantProps['size']>

    /**
     * Controls the layout direction.
     * @default 'vertical'
     */
    orientation?: NonNullable<TimelineVariantProps['orientation']>

    /**
     * Reverses the completion direction.
     * When true, items after active are completed.
     * @default false
     */
    reverse?: boolean

    /**
     * The currently active item value.
     * Items before this are marked as completed.
     */
    value?: string | number

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom indicator content for all items.
     * Takes precedence over icon and avatar.
     */
    indicator?: Snippet<[{ item: TimelineItem; index: number; state: TimelineItemState }]>

    /**
     * Custom date content for all items.
     * Takes precedence over item.date.
     */
    dateSlot?: Snippet<[{ item: TimelineItem; index: number; state: TimelineItemState }]>

    /**
     * Custom title content for all items.
     * Takes precedence over item.title.
     */
    titleSlot?: Snippet<[{ item: TimelineItem; index: number; state: TimelineItemState }]>

    /**
     * Custom description content for all items.
     * Takes precedence over item.description.
     */
    descriptionSlot?: Snippet<[{ item: TimelineItem; index: number; state: TimelineItemState }]>

    /**
     * Custom content rendered after each item.
     */
    content?: Snippet<[{ item: TimelineItem; index: number; state: TimelineItemState }]>
}
