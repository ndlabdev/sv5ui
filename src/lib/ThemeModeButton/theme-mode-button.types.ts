import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ButtonVariantProps } from '../Button/button.variants.js'
import type { ThemeModeButtonSlots } from './theme-mode-button.variants.js'

export type ThemeModeButtonProps = Omit<HTMLButtonAttributes, 'children'> & {
    /**
     * Controls the visual style of the button.
     * @default 'ghost'
     */
    variant?: NonNullable<ButtonVariantProps['variant']>

    /**
     * Sets the color scheme applied to the button.
     * @default 'surface'
     */
    color?: NonNullable<ButtonVariantProps['color']>

    /**
     * Controls the dimensions and text size of the button.
     * @default 'md'
     */
    size?: NonNullable<ButtonVariantProps['size']>

    /**
     * Icon displayed when light mode is active.
     * Supports any valid Iconify icon name.
     * @default 'lucide:sun'
     */
    lightIcon?: string

    /**
     * Icon displayed when dark mode is active.
     * Supports any valid Iconify icon name.
     * @default 'lucide:moon'
     */
    darkIcon?: string

    /**
     * Renders a loading spinner and disables interaction.
     * @default false
     */
    loading?: boolean

    /**
     * Forces equal width and height, ideal for icon-only buttons.
     * @default true
     */
    square?: boolean

    /**
     * Stretches the button to fill the full width of its container.
     * @default false
     */
    block?: boolean

    /**
     * Custom content rendered inside the button.
     * When provided, replaces the default icon rendering.
     */
    children?: Snippet<[{ isDark: boolean }]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific slots.
     */
    ui?: Partial<Record<ThemeModeButtonSlots, ClassNameValue>>
}
