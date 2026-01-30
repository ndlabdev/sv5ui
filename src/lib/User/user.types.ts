import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { UserVariantProps, UserSlots } from './user.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ChipProps } from '../Chip/chip.types.js'
import type { LinkProps } from '../Link/link.types.js'

export type UserProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Sets the HTML element type to render.
     * Ignored when `href` is provided.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific user slots.
     * Available slots: root, wrapper, name, description, avatar.
     */
    ui?: Partial<Record<UserSlots, ClassNameValue>>

    /**
     * Sets the display name rendered as primary text.
     */
    name?: string

    /**
     * Sets the secondary text displayed below the name.
     */
    description?: string

    /**
     * Configures the avatar displayed on the leading side.
     * Passed directly to the Avatar component.
     */
    avatar?: AvatarProps

    /**
     * Configures a status chip wrapping the avatar.
     * Pass `true` for default chip or `ChipProps` to customize.
     * @default false
     */
    chip?: boolean | ChipProps

    /**
     * Controls the size of the component.
     * Affects text sizes and avatar size mapping.
     * @default 'md'
     */
    size?: NonNullable<UserVariantProps['size']>

    /**
     * Sets the layout orientation.
     * @default 'horizontal'
     */
    orientation?: NonNullable<UserVariantProps['orientation']>

    /**
     * Sets the destination URL.
     * Renders the component as an anchor via Link when provided.
     */
    href?: LinkProps['href']

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom avatar content slot.
     * Takes precedence over `avatar` prop.
     */
    avatarSlot?: Snippet

    /**
     * Custom name content slot.
     * Takes precedence over `name` prop.
     */
    nameSlot?: Snippet

    /**
     * Custom description content slot.
     * Takes precedence over `description` prop.
     */
    descriptionSlot?: Snippet
}
