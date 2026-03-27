import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { AvatarGroupSlots } from './avatar-group.variants.js'
import type { AvatarProps, AvatarSize, AvatarRounded } from '../Avatar/avatar.types.js'

export type AvatarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Controls the size of all avatars in the group.
     * @default 'md'
     */
    size?: AvatarSize

    /**
     * Controls the border radius of all avatars in the group.
     * @default 'full'
     */
    rounded?: AvatarRounded

    /**
     * Array of avatar props to render.
     * Use with `max` to limit visible count.
     */
    avatars?: Omit<AvatarProps, 'size' | 'rounded' | 'children'>[]

    /**
     * Maximum visible avatars.
     * Excess displayed as a "+N" indicator.
     */
    max?: number

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific avatar group slots.
     */
    ui?: Partial<Record<AvatarGroupSlots, ClassNameValue>>

    /**
     * Custom content to render inside the group.
     * When provided, overrides the `avatars` prop.
     */
    children?: Snippet
}
