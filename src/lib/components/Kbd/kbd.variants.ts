import { tv, type VariantProps } from 'tailwind-variants'

export const kbdVariants = tv({
    slots: {
        base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase'
    },
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
            sm: { base: 'h-4 min-w-4 text-[10px]' },
            md: { base: 'h-5 min-w-5 text-[11px]' },
            lg: { base: 'h-6 min-w-6 text-[12px]' }
        },
        variant: {
            solid: '',
            outline: { base: 'ring ring-inset' },
            soft: '',
            subtle: { base: 'ring ring-inset' }
        }
    },
    compoundVariants: [
        // Solid variants
        { color: 'primary', variant: 'solid', class: { base: 'bg-primary text-on-primary' } },
        { color: 'secondary', variant: 'solid', class: { base: 'bg-secondary text-on-secondary' } },
        { color: 'success', variant: 'solid', class: { base: 'bg-success text-on-success' } },
        { color: 'warning', variant: 'solid', class: { base: 'bg-warning text-on-warning' } },
        { color: 'error', variant: 'solid', class: { base: 'bg-error text-on-error' } },
        { color: 'info', variant: 'solid', class: { base: 'bg-info text-on-info' } },
        {
            color: 'surface',
            variant: 'solid',
            class: { base: 'bg-inverse-surface text-inverse-on-surface' }
        },

        // Outline variants
        { color: 'primary', variant: 'outline', class: { base: 'ring-primary/50 text-primary' } },
        {
            color: 'secondary',
            variant: 'outline',
            class: { base: 'ring-secondary/50 text-secondary' }
        },
        { color: 'success', variant: 'outline', class: { base: 'ring-success/50 text-success' } },
        { color: 'warning', variant: 'outline', class: { base: 'ring-warning/50 text-warning' } },
        { color: 'error', variant: 'outline', class: { base: 'ring-error/50 text-error' } },
        { color: 'info', variant: 'outline', class: { base: 'ring-info/50 text-info' } },
        {
            color: 'surface',
            variant: 'outline',
            class: { base: 'ring-outline-variant text-on-surface-variant' }
        },

        // Soft variants
        {
            color: 'primary',
            variant: 'soft',
            class: { base: 'bg-primary-container text-on-primary-container' }
        },
        {
            color: 'secondary',
            variant: 'soft',
            class: { base: 'bg-secondary-container text-on-secondary-container' }
        },
        {
            color: 'success',
            variant: 'soft',
            class: { base: 'bg-success-container text-on-success-container' }
        },
        {
            color: 'warning',
            variant: 'soft',
            class: { base: 'bg-warning-container text-on-warning-container' }
        },
        {
            color: 'error',
            variant: 'soft',
            class: { base: 'bg-error-container text-on-error-container' }
        },
        {
            color: 'info',
            variant: 'soft',
            class: { base: 'bg-info-container text-on-info-container' }
        },
        {
            color: 'surface',
            variant: 'soft',
            class: { base: 'bg-surface-container-highest text-on-surface' }
        },

        // Subtle variants
        {
            color: 'primary',
            variant: 'subtle',
            class: { base: 'ring-primary/25 bg-primary-container text-on-primary-container' }
        },
        {
            color: 'secondary',
            variant: 'subtle',
            class: { base: 'ring-secondary/25 bg-secondary-container text-on-secondary-container' }
        },
        {
            color: 'success',
            variant: 'subtle',
            class: { base: 'ring-success/25 bg-success-container text-on-success-container' }
        },
        {
            color: 'warning',
            variant: 'subtle',
            class: { base: 'ring-warning/25 bg-warning-container text-on-warning-container' }
        },
        {
            color: 'error',
            variant: 'subtle',
            class: { base: 'ring-error/25 bg-error-container text-on-error-container' }
        },
        {
            color: 'info',
            variant: 'subtle',
            class: { base: 'ring-info/25 bg-info-container text-on-info-container' }
        },
        {
            color: 'surface',
            variant: 'subtle',
            class: { base: 'ring-outline-variant bg-surface-container-highest text-on-surface' }
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
    win: '⊞',
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
export type KbdSlots = keyof ReturnType<typeof kbdVariants>

export const kbdDefaults = {
    defaultVariants: kbdVariants.defaultVariants,
    slots: {} as Partial<Record<KbdSlots, string>>
}
