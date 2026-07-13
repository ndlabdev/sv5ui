import { tv, type VariantProps } from 'tailwind-variants'

export const timeFieldVariants = tv({
    slots: {
        root: 'relative w-full inline-flex items-center',
        field: [
            'w-full inline-flex items-center rounded-md border-0 bg-surface text-on-surface',
            'select-none whitespace-nowrap',
            'data-disabled:cursor-not-allowed data-disabled:opacity-75',
            'data-invalid:ring-error',
            'transition-colors',
            'focus-within:outline-none'
        ],
        segment: [
            'rounded px-0.5 tabular-nums outline-none',
            'focus:outline-none',
            'aria-[valuetext=Empty]:text-on-surface-variant/50',
            'data-disabled:cursor-not-allowed',
            'transition-colors'
        ],
        literal: 'px-0.5 text-on-surface-variant/75',
        iconWrapper: [
            'absolute inset-y-0 end-0 flex items-center justify-center',
            'text-on-surface-variant/75 pointer-events-none'
        ],
        icon: 'shrink-0'
    },
    variants: {
        variant: {
            outline: '',
            soft: '',
            subtle: '',
            ghost: '',
            none: ''
        },
        color: {
            primary: {
                segment: 'focus:bg-primary/15 focus:text-primary'
            },
            secondary: {
                segment: 'focus:bg-secondary/15 focus:text-secondary'
            },
            tertiary: {
                segment: 'focus:bg-tertiary/15 focus:text-tertiary'
            },
            success: {
                segment: 'focus:bg-success/15 focus:text-success'
            },
            warning: {
                segment: 'focus:bg-warning/15 focus:text-warning'
            },
            error: {
                segment: 'focus:bg-error/15 focus:text-error'
            },
            info: {
                segment: 'focus:bg-info/15 focus:text-info'
            },
            surface: {
                segment: 'focus:bg-inverse-surface/15 focus:text-on-surface'
            }
        },
        size: {
            xs: {
                field: 'px-1.5 py-1 text-xs rounded',
                iconWrapper: 'pe-2 ps-1',
                icon: 'size-3.5'
            },
            sm: {
                field: 'px-2 py-1.5 text-xs rounded-md',
                iconWrapper: 'pe-2.5 ps-1',
                icon: 'size-4'
            },
            md: {
                field: 'px-2.5 py-2 text-sm rounded-md',
                iconWrapper: 'pe-3 ps-1.5',
                icon: 'size-5'
            },
            lg: {
                field: 'px-3.5 py-2.5 text-sm rounded-md',
                iconWrapper: 'pe-4 ps-1.5',
                icon: 'size-5'
            },
            xl: {
                field: 'px-4.5 py-3 text-base rounded-lg',
                iconWrapper: 'pe-5 ps-2',
                icon: 'size-6'
            }
        },
        icon: {
            true: ''
        },
        highlight: {
            true: ''
        }
    },
    compoundVariants: [
        // ========== ICON FIELD PADDING ==========
        { icon: true, size: 'xs', class: { field: 'pe-7' } },
        { icon: true, size: 'sm', class: { field: 'pe-8' } },
        { icon: true, size: 'md', class: { field: 'pe-10' } },
        { icon: true, size: 'lg', class: { field: 'pe-11' } },
        { icon: true, size: 'xl', class: { field: 'pe-13' } },

        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-info'
            }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-outline'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                field: 'bg-primary-container/50 focus-within:bg-primary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                field: 'bg-secondary-container/50 focus-within:bg-secondary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-secondary'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                field: 'bg-tertiary-container/50 focus-within:bg-tertiary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-tertiary'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                field: 'bg-success-container/50 focus-within:bg-success-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-success'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                field: 'bg-warning-container/50 focus-within:bg-warning-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-warning'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                field: 'bg-error-container/50 focus-within:bg-error-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-error'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                field: 'bg-info-container/50 focus-within:bg-info-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-info'
            }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: {
                field: 'bg-surface-container-highest/50 focus-within:bg-surface-container-highest/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-outline'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                field: 'ring ring-inset ring-primary/25 bg-primary-container/50 focus-within:ring-2 focus-within:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                field: 'ring ring-inset ring-secondary/25 bg-secondary-container/50 focus-within:ring-2 focus-within:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                field: 'ring ring-inset ring-tertiary/25 bg-tertiary-container/50 focus-within:ring-2 focus-within:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                field: 'ring ring-inset ring-success/25 bg-success-container/50 focus-within:ring-2 focus-within:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                field: 'ring ring-inset ring-warning/25 bg-warning-container/50 focus-within:ring-2 focus-within:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                field: 'ring ring-inset ring-error/25 bg-error-container/50 focus-within:ring-2 focus-within:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                field: 'ring ring-inset ring-info/25 bg-info-container/50 focus-within:ring-2 focus-within:ring-info'
            }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                field: 'ring ring-inset ring-outline-variant bg-surface-container-highest/50 focus-within:ring-2 focus-within:ring-outline'
            }
        },

        // ========== GHOST VARIANTS ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: {
                field: 'bg-transparent hover:bg-primary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary'
            }
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: {
                field: 'bg-transparent hover:bg-secondary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-secondary'
            }
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: {
                field: 'bg-transparent hover:bg-tertiary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-tertiary'
            }
        },
        {
            variant: 'ghost',
            color: 'success',
            class: {
                field: 'bg-transparent hover:bg-success-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-success'
            }
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: {
                field: 'bg-transparent hover:bg-warning-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-warning'
            }
        },
        {
            variant: 'ghost',
            color: 'error',
            class: {
                field: 'bg-transparent hover:bg-error-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-error'
            }
        },
        {
            variant: 'ghost',
            color: 'info',
            class: {
                field: 'bg-transparent hover:bg-info-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-info'
            }
        },
        {
            variant: 'ghost',
            color: 'surface',
            class: {
                field: 'bg-transparent hover:bg-surface-container-highest/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-outline'
            }
        },

        // ========== NONE VARIANT ==========
        {
            variant: 'none',
            class: {
                field: 'bg-transparent focus-within:ring-0'
            }
        },

        // ========== HIGHLIGHT VARIANTS ==========
        {
            highlight: true,
            color: 'primary',
            class: { field: 'ring-2 ring-inset ring-primary' }
        },
        {
            highlight: true,
            color: 'secondary',
            class: { field: 'ring-2 ring-inset ring-secondary' }
        },
        {
            highlight: true,
            color: 'tertiary',
            class: { field: 'ring-2 ring-inset ring-tertiary' }
        },
        {
            highlight: true,
            color: 'success',
            class: { field: 'ring-2 ring-inset ring-success' }
        },
        {
            highlight: true,
            color: 'warning',
            class: { field: 'ring-2 ring-inset ring-warning' }
        },
        {
            highlight: true,
            color: 'error',
            class: { field: 'ring-2 ring-inset ring-error' }
        },
        {
            highlight: true,
            color: 'info',
            class: { field: 'ring-2 ring-inset ring-info' }
        },
        {
            highlight: true,
            color: 'surface',
            class: { field: 'ring-2 ring-inset ring-outline' }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md',
        icon: true,
        highlight: false
    }
})

export type TimeFieldVariantProps = VariantProps<typeof timeFieldVariants>
export type TimeFieldSlots = keyof ReturnType<typeof timeFieldVariants>

export const timeFieldDefaults = {
    defaultVariants: timeFieldVariants.defaultVariants,
    slots: {} as Partial<Record<TimeFieldSlots, string>>
}
