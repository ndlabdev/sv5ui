import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { AlertVariantProps, AlertSlots } from './alert.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ButtonProps } from '../Button/button.types.js'

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'title'> & {
    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific alert slots.
     */
    ui?: Partial<Record<AlertSlots, ClassNameValue>>

    /**
     * Alert title text.
     */
    title?: string

    /**
     * Alert description text.
     */
    description?: string

    /**
     * Icon name to display (Iconify format).
     * Takes precedence over avatar.
     */
    icon?: string

    /**
     * Avatar props to display on the left side.
     * Only rendered if icon is not provided.
     */
    avatar?: AvatarProps

    /**
     * The color theme of the alert.
     * @default 'primary'
     */
    color?: NonNullable<AlertVariantProps['color']>

    /**
     * The visual style variant.
     * @default 'soft'
     */
    variant?: NonNullable<AlertVariantProps['variant']>

    /**
     * Layout orientation.
     * @default 'horizontal'
     */
    orientation?: NonNullable<AlertVariantProps['orientation']>

    /**
     * Whether the alert is visible.
     * @default true
     */
    open?: boolean

    /**
     * Show close button.
     * Pass ButtonProps to customize.
     * @default false
     */
    close?: boolean | ButtonProps

    /**
     * Close button icon name.
     * @default 'lucide:x'
     */
    closeIcon?: string

    /**
     * Action buttons configuration.
     */
    actions?: ButtonProps[]

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom leading content slot.
     * Replaces icon/avatar when provided.
     */
    leading?: Snippet

    /**
     * Custom title content slot.
     */
    titleSlot?: Snippet

    /**
     * Custom description content slot.
     */
    descriptionSlot?: Snippet

    /**
     * Custom actions content slot.
     */
    actionsSlot?: Snippet

    /**
     * Custom close button content slot.
     */
    closeSlot?: Snippet

    /**
     * Callback when close button is clicked.
     */
    onClose?: () => void
}
