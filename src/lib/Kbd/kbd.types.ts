import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { KbdVariantProps } from './kbd.variants.js'

export type KeyboardShortcutCallback = (event: KeyboardEvent) => void

export interface UseKbdOptions {
    /**
     * Map of shortcut strings to callbacks. Supports getter for reactive shortcuts.
     * @example { 'ctrl+k': () => openSearch(), 'escape': () => close() }
     * @example () => mode === 'edit' ? editShortcuts : viewShortcuts
     */
    shortcuts?: Record<string, KeyboardShortcutCallback> | (() => Record<string, KeyboardShortcutCallback>)

    /**
     * Target element to attach listeners to. Supports getter for reactivity.
     * @default window
     */
    target?: HTMLElement | Window | null | (() => HTMLElement | Window | null)

    /**
     * Whether the hook is active. Supports getter for reactivity.
     * @default true
     */
    enabled?: boolean | (() => boolean)

    /**
     * Whether to call preventDefault() on matched shortcuts.
     * @default true
     */
    preventDefault?: boolean

    /**
     * Prevent modifier keys (Alt, Meta) from triggering browser default behavior
     * (e.g., Alt activating browser menu on Windows). Enables reliable modifier tracking.
     * @default false
     */
    captureModifiers?: boolean

    /**
     * Whether shortcut callbacks should fire repeatedly when a key is held down.
     * @default false
     */
    repeat?: boolean
}

export interface UseKbdReturn {
    /** Check if a specific key is currently pressed (case-insensitive) */
    isPressed: (key: string) => boolean

    /** Reactive set of currently pressed key names (lowercase) */
    readonly pressedKeys: ReadonlySet<string>
}

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
