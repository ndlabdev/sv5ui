import { tv, type VariantProps } from 'tailwind-variants'

export const pinInputVariants = tv({
    slots: {
        root: 'relative inline-flex items-center gap-1.5 align-top',
        base: [
            'relative flex items-center justify-center rounded-md',
            'select-none cursor-text transition-colors'
        ]
    },
    variants: {
        variant: {
            outline: {
                base: 'text-on-surface bg-surface ring-2 ring-inset ring-outline-variant'
            },
            soft: {
                base: 'text-on-surface bg-surface-container/50 data-[active]:bg-surface-container disabled:bg-surface-container/50'
            },
            subtle: {
                base: 'text-on-surface bg-surface-container ring-2 ring-inset ring-outline-variant'
            },
            ghost: {
                base: 'text-on-surface bg-transparent data-[active]:bg-surface-container'
            },
            none: {
                base: 'text-on-surface bg-transparent'
            }
        },
        color: {
            primary: {},
            secondary: {},
            tertiary: {},
            success: {},
            warning: {},
            error: {},
            info: {},
            surface: {}
        },
        size: {
            xs: { base: 'size-6 text-sm/4' },
            sm: { base: 'size-7 text-sm/4' },
            md: { base: 'size-8 text-base/5' },
            lg: { base: 'size-9 text-base/5' },
            xl: { base: 'size-10 text-base' }
        },
        highlight: {
            true: {}
        },
        fixed: {
            false: {}
        },
        disabled: {
            true: {
                root: 'opacity-75 cursor-not-allowed'
            }
        }
    },
    compoundVariants: [
        // outline + color → active cell ring
        {
            variant: 'outline',
            color: 'primary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: { base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-info' }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-on-surface'
            }
        },
        // subtle + color → active cell ring
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: { base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-info' }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                base: 'data-[active]:ring-2 data-[active]:ring-inset data-[active]:ring-on-surface'
            }
        },
        // highlight + color → all cells always show color ring
        { highlight: true, color: 'primary', class: { base: 'ring-2 ring-inset ring-primary' } },
        {
            highlight: true,
            color: 'secondary',
            class: { base: 'ring-2 ring-inset ring-secondary' }
        },
        { highlight: true, color: 'tertiary', class: { base: 'ring-2 ring-inset ring-tertiary' } },
        { highlight: true, color: 'success', class: { base: 'ring-2 ring-inset ring-success' } },
        { highlight: true, color: 'warning', class: { base: 'ring-2 ring-inset ring-warning' } },
        { highlight: true, color: 'error', class: { base: 'ring-2 ring-inset ring-error' } },
        { highlight: true, color: 'info', class: { base: 'ring-2 ring-inset ring-info' } },
        { highlight: true, color: 'surface', class: { base: 'ring-2 ring-inset ring-on-surface' } },
        // fixed=false → responsive text (smaller on mobile)
        { fixed: false, size: 'xs', class: { base: 'md:text-xs' } },
        { fixed: false, size: 'sm', class: { base: 'md:text-xs' } },
        { fixed: false, size: 'md', class: { base: 'md:text-sm' } },
        { fixed: false, size: 'lg', class: { base: 'md:text-sm' } }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md'
    }
})

export type PinInputVariantProps = VariantProps<typeof pinInputVariants>
export type PinInputSlots = keyof ReturnType<typeof pinInputVariants>

export const pinInputDefaults = {
    defaultVariants: pinInputVariants.defaultVariants,
    slots: {} as Partial<Record<PinInputSlots, string>>
}
