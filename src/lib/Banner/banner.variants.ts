import { tv, type VariantProps } from 'tailwind-variants'

export const bannerVariants = tv({
    slots: {
        root: 'relative z-30 w-full transition-colors',
        container: 'flex items-center justify-between gap-3 min-h-12 px-4 py-2',
        left: 'hidden lg:flex lg:flex-1 lg:items-center',
        center: 'flex items-center gap-2 min-w-0',
        right: 'flex items-center justify-end gap-2 lg:flex-1',
        icon: 'size-5 shrink-0 pointer-events-none',
        title: 'text-sm font-medium truncate',
        actions: [
            'flex items-center gap-2 ms-2',
            '[&_button]:text-inherit [&_button]:border-current/30 [&_button]:hover:bg-current/10'
        ],
        close: 'shrink-0 text-inherit hover:bg-current/10'
    },
    variants: {
        color: {
            primary: {
                root: 'bg-primary text-on-primary',
                icon: 'text-on-primary',
                title: 'text-on-primary'
            },
            secondary: {
                root: 'bg-secondary text-on-secondary',
                icon: 'text-on-secondary',
                title: 'text-on-secondary'
            },
            tertiary: {
                root: 'bg-tertiary text-on-tertiary',
                icon: 'text-on-tertiary',
                title: 'text-on-tertiary'
            },
            success: {
                root: 'bg-success text-on-success',
                icon: 'text-on-success',
                title: 'text-on-success'
            },
            warning: {
                root: 'bg-warning text-on-warning',
                icon: 'text-on-warning',
                title: 'text-on-warning'
            },
            error: {
                root: 'bg-error text-on-error',
                icon: 'text-on-error',
                title: 'text-on-error'
            },
            info: {
                root: 'bg-info text-on-info',
                icon: 'text-on-info',
                title: 'text-on-info'
            },
            surface: {
                root: 'bg-inverse-surface text-inverse-on-surface',
                icon: 'text-inverse-on-surface',
                title: 'text-inverse-on-surface'
            }
        },
        to: {
            true: '',
            false: ''
        }
    },
    compoundVariants: [
        // -------------------------------------------------------------------
        // Hover effects when banner is clickable (`to` is set)
        // -------------------------------------------------------------------
        { color: 'primary', to: true, class: { root: 'hover:bg-primary/90' } },
        { color: 'secondary', to: true, class: { root: 'hover:bg-secondary/90' } },
        { color: 'tertiary', to: true, class: { root: 'hover:bg-tertiary/90' } },
        { color: 'success', to: true, class: { root: 'hover:bg-success/90' } },
        { color: 'warning', to: true, class: { root: 'hover:bg-warning/90' } },
        { color: 'error', to: true, class: { root: 'hover:bg-error/90' } },
        { color: 'info', to: true, class: { root: 'hover:bg-info/90' } },
        { color: 'surface', to: true, class: { root: 'hover:bg-inverse-surface/90' } }
    ],
    defaultVariants: {
        color: 'primary',
        to: false
    }
})

export type BannerVariantProps = VariantProps<typeof bannerVariants>
export type BannerSlots = keyof ReturnType<typeof bannerVariants>

export const bannerDefaults = {
    defaultVariants: bannerVariants.defaultVariants,
    slots: {} as Partial<Record<BannerSlots, string>>
}
