import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { KbdVariantProps } from './kbd.variants.js'

export type KbdProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Sets the HTML element type to render.
     * @default 'kbd'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Key value to display. Supports special keys that auto-convert to symbols.
     * On macOS: meta → ⌘, ctrl → ⌃, alt → ⌥, shift → ⇧
     * On other OS: meta → Ctrl, ctrl → Ctrl, alt → Alt, shift → Shift
     * @example "meta", "shift", "K", "enter", "escape"
     */
    value?: string

    /**
     * Sets the color scheme applied to the kbd.
     * @default 'surface'
     */
    color?: NonNullable<KbdVariantProps['color']>

    /**
     * Controls the dimensions and text size of the kbd.
     * @default 'md'
     */
    size?: NonNullable<KbdVariantProps['size']>

    /**
     * Controls the visual style of the kbd.
     * @default 'outline'
     */
    variant?: NonNullable<KbdVariantProps['variant']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue
}
