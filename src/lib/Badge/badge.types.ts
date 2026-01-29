import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { BadgeVariantProps, BadgeSlots } from './badge.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'class'> & {
    /**
     * Sets the HTML element type to render.
     * @default 'span'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific badge slots.
     * Available slots: base, label, leadingIcon, trailingIcon, leadingAvatar.
     */
    ui?: Partial<Record<BadgeSlots, ClassNameValue>>

    /**
     * Sets the text content displayed inside the badge.
     */
    label?: string | number

    /**
     * Sets the color scheme applied to the badge.
     * @default 'primary'
     */
    color?: NonNullable<BadgeVariantProps['color']>

    /**
     * Sets the visual style variant of the badge.
     * @default 'solid'
     */
    variant?: NonNullable<BadgeVariantProps['variant']>

    /**
     * Controls the size of the badge.
     * @default 'md'
     */
    size?: NonNullable<BadgeVariantProps['size']>

    /**
     * Renders the badge with equal padding for a square shape.
     * @default false
     */
    square?: boolean

    /**
     * Sets the icon for an icon-only badge.
     * Accepts any Iconify icon name.
     */
    icon?: string

    /**
     * Sets the icon displayed before the label.
     * Accepts any Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Sets the icon displayed after the label.
     * Accepts any Iconify icon name.
     */
    trailingIcon?: string

    /**
     * Configures the avatar displayed on the leading side.
     */
    avatar?: AvatarProps

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom leading content slot.
     * Takes precedence over avatar and leadingIcon.
     */
    leading?: Snippet

    /**
     * Custom trailing content slot.
     * Takes precedence over trailingIcon.
     */
    trailing?: Snippet
}
