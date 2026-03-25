import type { Snippet } from 'svelte'
import type { Avatar } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { AvatarVariantProps, AvatarSize, AvatarSlots } from './avatar.variants.js'

export type { AvatarSize }
export type AvatarRounded = NonNullable<AvatarVariantProps['rounded']>
export type AvatarStatusPosition = NonNullable<AvatarVariantProps['statusPosition']>

export type AvatarProps = Omit<Avatar.RootProps, 'children'> & {
    /**
     * Controls the dimensions of the avatar.
     * @default 'md'
     */
    size?: AvatarSize

    /**
     * Controls the border radius of the avatar.
     * Use `'lg'`, `'md'`, `'sm'` for square-ish avatars (e.g. organization logos).
     * @default 'full'
     */
    rounded?: AvatarRounded

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
     * Iconify icon name to display as fallback when no image or text is available.
     * @example 'lucide:user', 'mdi:account'
     */
    icon?: string

    /**
     * Status indicator color (renders a small dot on the avatar).
     * Use any CSS color value or Tailwind bg-* class.
     * @example 'bg-success', 'bg-error', 'bg-warning'
     */
    status?: string

    /**
     * Position of the status indicator.
     * @default 'bottom-right'
     */
    statusPosition?: AvatarStatusPosition

    /**
     * Image loading strategy.
     * Use `'lazy'` for avatars below the fold to improve page load performance.
     * @default 'eager'
     */
    loading?: 'lazy' | 'eager'

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific avatar slots.
     */
    ui?: Partial<Record<AvatarSlots, ClassNameValue>>

    /**
     * Custom fallback content to render when the image is unavailable.
     * Overrides text, initials, and icon fallback.
     */
    fallback?: Snippet

    /**
     * Custom content to render inside the avatar.
     * When provided, overrides the entire avatar content (image + fallback).
     */
    children?: Snippet
}
