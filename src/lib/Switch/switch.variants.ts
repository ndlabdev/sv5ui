import { tv, type VariantProps } from 'tailwind-variants'

export const switchVariants = tv({
    slots: {
        root: 'relative flex items-start',
        base: [
            'inline-flex items-center shrink-0 rounded-full border-2 border-transparent',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-colors duration-200',
            'data-[state=unchecked]:bg-surface-container-highest'
        ],
        container: 'flex items-center',
        thumb: [
            'group pointer-events-none rounded-full bg-white shadow-lg ring-0',
            'flex items-center justify-center',
            'transition-transform duration-200',
            'data-[state=unchecked]:translate-x-0'
        ],
        icon: [
            'absolute shrink-0 opacity-0',
            'group-data-[state=unchecked]:text-on-surface-variant',
            'transition-[color,opacity] duration-200'
        ],
        wrapper: 'ms-2',
        label: 'block font-medium text-on-surface',
        description: 'text-on-surface-variant'
    },
    variants: {
        color: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
            surface: ''
        },
        size: {
            xs: {
                base: 'w-7',
                container: 'h-4',
                thumb: 'size-3 data-[state=checked]:translate-x-3',
                icon: 'size-2',
                wrapper: 'text-xs'
            },
            sm: {
                base: 'w-8',
                container: 'h-4',
                thumb: 'size-3.5 data-[state=checked]:translate-x-3.5',
                icon: 'size-2.5',
                wrapper: 'text-xs'
            },
            md: {
                base: 'w-9',
                container: 'h-5',
                thumb: 'size-4 data-[state=checked]:translate-x-4',
                icon: 'size-3',
                wrapper: 'text-sm'
            },
            lg: {
                base: 'w-10',
                container: 'h-5',
                thumb: 'size-4.5 data-[state=checked]:translate-x-4.5',
                icon: 'size-3.5',
                wrapper: 'text-sm'
            },
            xl: {
                base: 'w-11',
                container: 'h-6',
                thumb: 'size-5 data-[state=checked]:translate-x-5',
                icon: 'size-4',
                wrapper: 'text-base'
            }
        },
        checked: {
            true: {
                icon: 'group-data-[state=checked]:opacity-100'
            }
        },
        unchecked: {
            true: {
                icon: 'group-data-[state=unchecked]:opacity-100'
            }
        },
        loading: {
            true: {
                icon: 'animate-spin'
            }
        },
        required: {
            true: {
                label: "after:content-['*'] after:ms-0.5 after:text-error"
            }
        },
        disabled: {
            true: {
                root: 'opacity-75',
                base: 'cursor-not-allowed',
                label: 'cursor-not-allowed',
                description: 'cursor-not-allowed'
            }
        }
    },
    compoundVariants: [
        // ========== COLOR (checked bg + focus ring + icon color) ==========
        {
            color: 'primary',
            class: {
                base: 'data-[state=checked]:bg-primary focus-visible:outline-primary',
                icon: 'group-data-[state=checked]:text-primary'
            }
        },
        {
            color: 'secondary',
            class: {
                base: 'data-[state=checked]:bg-secondary focus-visible:outline-secondary',
                icon: 'group-data-[state=checked]:text-secondary'
            }
        },
        {
            color: 'tertiary',
            class: {
                base: 'data-[state=checked]:bg-tertiary focus-visible:outline-tertiary',
                icon: 'group-data-[state=checked]:text-tertiary'
            }
        },
        {
            color: 'success',
            class: {
                base: 'data-[state=checked]:bg-success focus-visible:outline-success',
                icon: 'group-data-[state=checked]:text-success'
            }
        },
        {
            color: 'warning',
            class: {
                base: 'data-[state=checked]:bg-warning focus-visible:outline-warning',
                icon: 'group-data-[state=checked]:text-warning'
            }
        },
        {
            color: 'error',
            class: {
                base: 'data-[state=checked]:bg-error focus-visible:outline-error',
                icon: 'group-data-[state=checked]:text-error'
            }
        },
        {
            color: 'info',
            class: {
                base: 'data-[state=checked]:bg-info focus-visible:outline-info',
                icon: 'group-data-[state=checked]:text-info'
            }
        },
        {
            color: 'surface',
            class: {
                base: 'data-[state=checked]:bg-on-surface focus-visible:outline-outline',
                icon: 'group-data-[state=checked]:text-on-surface'
            }
        }
    ],
    defaultVariants: {
        color: 'primary',
        size: 'md'
    }
})

export type SwitchVariantProps = VariantProps<typeof switchVariants>
export type SwitchSlots = keyof ReturnType<typeof switchVariants>

export const switchDefaults = {
    defaultVariants: switchVariants.defaultVariants,
    slots: {} as Partial<Record<SwitchSlots, string>>
}
