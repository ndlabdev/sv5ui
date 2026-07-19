import { tv, type VariantProps } from 'tailwind-variants'

export const ratingVariants = tv({
    slots: {
        root: [
            'inline-flex items-center w-fit rounded-sm',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'data-disabled:opacity-75 data-disabled:cursor-not-allowed'
        ],
        item: 'relative shrink-0 cursor-pointer data-disabled:cursor-not-allowed data-readonly:cursor-default',
        icon: 'shrink-0 text-outline-variant transition-colors',
        iconActive: 'shrink-0 transition-colors',
        partial: 'absolute inset-y-0 start-0 w-1/2 overflow-hidden'
    },
    variants: {
        color: {
            primary: {
                root: 'focus-visible:outline-primary',
                iconActive: 'text-primary'
            },
            secondary: {
                root: 'focus-visible:outline-secondary',
                iconActive: 'text-secondary'
            },
            tertiary: {
                root: 'focus-visible:outline-tertiary',
                iconActive: 'text-tertiary'
            },
            success: {
                root: 'focus-visible:outline-success',
                iconActive: 'text-success'
            },
            warning: {
                root: 'focus-visible:outline-warning',
                iconActive: 'text-warning'
            },
            error: {
                root: 'focus-visible:outline-error',
                iconActive: 'text-error'
            },
            info: {
                root: 'focus-visible:outline-info',
                iconActive: 'text-info'
            },
            surface: {
                root: 'focus-visible:outline-outline',
                iconActive: 'text-on-surface'
            }
        },
        size: {
            xs: {
                root: 'gap-0.5',
                icon: 'size-4',
                iconActive: 'size-4'
            },
            sm: {
                root: 'gap-0.5',
                icon: 'size-5',
                iconActive: 'size-5'
            },
            md: {
                root: 'gap-1',
                icon: 'size-6',
                iconActive: 'size-6'
            },
            lg: {
                root: 'gap-1',
                icon: 'size-7',
                iconActive: 'size-7'
            },
            xl: {
                root: 'gap-1.5',
                icon: 'size-8',
                iconActive: 'size-8'
            }
        },
        orientation: {
            horizontal: {},
            vertical: {
                root: 'flex-col'
            }
        },
        fill: {
            true: {
                iconActive: '[&_path]:fill-current'
            },
            false: {}
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'md',
        orientation: 'horizontal',
        fill: true
    }
})

export type RatingVariantProps = VariantProps<typeof ratingVariants>
export type RatingSlots = keyof ReturnType<typeof ratingVariants>

export const ratingDefaults = {
    defaultVariants: ratingVariants.defaultVariants,
    slots: {} as Partial<Record<RatingSlots, string>>
}
