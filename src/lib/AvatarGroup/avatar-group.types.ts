import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { AvatarGroupSlots } from './avatar-group.variants.js'
import type { AvatarProps, AvatarSize } from '../Avatar/avatar.types.js'

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
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
     * Array of avatar props to render.
     * Use with `max` to limit visible count.
     */
    avatars?: Omit<AvatarProps, 'size' | 'children'>[]

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
}
