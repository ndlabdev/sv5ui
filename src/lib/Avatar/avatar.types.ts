import type { Snippet } from 'svelte'
import type { Avatar } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { AvatarVariantProps, AvatarSlots } from './avatar.variants.js'

export type AvatarSize = NonNullable<AvatarVariantProps['size']>

export type AvatarProps = Omit<Avatar.RootProps, 'children'> & {
    /**
     * Controls the dimensions of the avatar.
     * @default 'md'
     */
    size?: AvatarSize

    /**
     * URL of the image to display.
     * The image will be shown once it loads successfully.
     */
    src?: string

    /**
     * Alternative text describing the avatar image.
     * Used for accessibility and to auto-generate initials as fallback.
     */
    alt?: string

    /**
     * Text to display when no image is available.
     * Overrides auto-generated initials from `alt`.
     */
    text?: string

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific avatar slots.
     */
    ui?: Partial<Record<AvatarSlots, ClassNameValue>>

    /**
     * Custom content to render inside the avatar.
     * When provided, overrides image, text, and icon.
     */
    children?: Snippet
}
