import { tv, type VariantProps } from 'tailwind-variants'

export const kbdVariants = tv({
    base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase',
    variants: {
        color: {
            primary: '',
            secondary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
            surface: ''
        },
        size: {
            sm: 'h-4 min-w-4 text-[10px]',
            md: 'h-5 min-w-5 text-[11px]',
            lg: 'h-6 min-w-6 text-[12px]'
        },
        variant: {
            solid: '',
            outline: 'ring ring-inset',
            soft: '',
            subtle: 'ring ring-inset'
        }
    },
    compoundVariants: [
        // Solid variants
        { color: 'primary', variant: 'solid', class: 'bg-primary text-on-primary' },
        { color: 'secondary', variant: 'solid', class: 'bg-secondary text-on-secondary' },
        { color: 'success', variant: 'solid', class: 'bg-success text-on-success' },
        { color: 'warning', variant: 'solid', class: 'bg-warning text-on-warning' },
        { color: 'error', variant: 'solid', class: 'bg-error text-on-error' },
        { color: 'info', variant: 'solid', class: 'bg-info text-on-info' },
        { color: 'surface', variant: 'solid', class: 'bg-inverse-surface text-inverse-on-surface' },

        // Outline variants
        { color: 'primary', variant: 'outline', class: 'ring-primary/50 text-primary' },
        { color: 'secondary', variant: 'outline', class: 'ring-secondary/50 text-secondary' },
        { color: 'success', variant: 'outline', class: 'ring-success/50 text-success' },
        { color: 'warning', variant: 'outline', class: 'ring-warning/50 text-warning' },
        { color: 'error', variant: 'outline', class: 'ring-error/50 text-error' },
        { color: 'info', variant: 'outline', class: 'ring-info/50 text-info' },
        {
            color: 'surface',
            variant: 'outline',
            class: 'ring-outline-variant text-on-surface-variant'
        },

        // Soft variants
        {
            color: 'primary',
            variant: 'soft',
            class: 'bg-primary-container text-on-primary-container'
        },
        {
            color: 'secondary',
            variant: 'soft',
            class: 'bg-secondary-container text-on-secondary-container'
        },
        {
            color: 'success',
            variant: 'soft',
            class: 'bg-success-container text-on-success-container'
        },
        {
            color: 'warning',
            variant: 'soft',
            class: 'bg-warning-container text-on-warning-container'
        },
        { color: 'error', variant: 'soft', class: 'bg-error-container text-on-error-container' },
        { color: 'info', variant: 'soft', class: 'bg-info-container text-on-info-container' },
        {
            color: 'surface',
            variant: 'soft',
            class: 'bg-surface-container-highest text-on-surface'
        },

        // Subtle variants
        {
            color: 'primary',
            variant: 'subtle',
            class: 'ring-primary/25 bg-primary-container text-on-primary-container'
        },
        {
            color: 'secondary',
            variant: 'subtle',
            class: 'ring-secondary/25 bg-secondary-container text-on-secondary-container'
        },
        {
            color: 'success',
            variant: 'subtle',
            class: 'ring-success/25 bg-success-container text-on-success-container'
        },
        {
            color: 'warning',
            variant: 'subtle',
            class: 'ring-warning/25 bg-warning-container text-on-warning-container'
        },
        {
            color: 'error',
            variant: 'subtle',
            class: 'ring-error/25 bg-error-container text-on-error-container'
        },
        {
            color: 'info',
            variant: 'subtle',
            class: 'ring-info/25 bg-info-container text-on-info-container'
        },
        {
            color: 'surface',
            variant: 'subtle',
            class: 'ring-outline-variant bg-surface-container-highest text-on-surface'
        }
    ],
    defaultVariants: {
        color: 'surface',
        size: 'md',
        variant: 'outline'
    }
})

/** Static key symbols (same across all platforms) */
export const kbdKeysMap: Record<string, string> = {
    command: '⌘',
    shift: '⇧',
    control: '⌃',
    option: '⌥',
    enter: '↵',
    delete: '⌦',
    backspace: '⌫',
    escape: 'Esc',
    tab: '⇥',
    capslock: '⇪',
    arrowup: '↑',
    arrowright: '→',
    arrowdown: '↓',
    arrowleft: '←',
    pageup: '⇞',
    pagedown: '⇟',
    home: '↖',
    end: '↘',
    space: '␣'
}

/** Platform-specific key mappings */
export const kbdKeysPlatformMap: Record<string, { mac: string; other: string }> = {
    meta: { mac: '⌘', other: 'Ctrl' },
    ctrl: { mac: '⌃', other: 'Ctrl' },
    alt: { mac: '⌥', other: 'Alt' }
}

export type KbdVariantProps = VariantProps<typeof kbdVariants>

export const kbdDefaults = {
    defaultVariants: kbdVariants.defaultVariants
}
