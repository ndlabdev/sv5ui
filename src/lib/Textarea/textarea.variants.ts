import { tv, type VariantProps } from 'tailwind-variants'

export const textareaVariants = tv({
    slots: {
        root: 'relative w-full inline-flex items-start',
        base: [
            'w-full rounded-md border-0 bg-surface text-on-surface placeholder:text-on-surface-variant/50',
            'disabled:cursor-not-allowed disabled:opacity-75',
            'transition-colors',
            'focus:outline-none'
        ],
        leading: 'absolute start-0 flex items-start pointer-events-none',
        leadingIcon: 'shrink-0 text-on-surface-variant/75',
        trailing: 'absolute end-0 flex items-start pointer-events-none',
        trailingIcon: 'shrink-0 text-on-surface-variant/75'
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
                base: 'px-2 py-1 text-xs rounded',
                leading: 'ps-2 inset-y-1',
                leadingIcon: 'size-3.5',
                trailing: 'pe-2 inset-y-1',
                trailingIcon: 'size-3.5'
            },
            sm: {
                base: 'px-2.5 py-1.5 text-xs rounded-md',
                leading: 'ps-2.5 inset-y-1.5',
                leadingIcon: 'size-4',
                trailing: 'pe-2.5 inset-y-1.5',
                trailingIcon: 'size-4'
            },
            md: {
                base: 'px-3 py-2 text-sm rounded-md',
                leading: 'ps-3 inset-y-1.5',
                leadingIcon: 'size-5',
                trailing: 'pe-3 inset-y-1.5',
                trailingIcon: 'size-5'
            },
            lg: {
                base: 'px-4 py-2.5 text-sm rounded-md',
                leading: 'ps-4 inset-y-2',
                leadingIcon: 'size-5',
                trailing: 'pe-4 inset-y-2',
                trailingIcon: 'size-5'
            },
            xl: {
                base: 'px-5 py-3 text-base rounded-lg',
                leading: 'ps-5 inset-y-2',
                leadingIcon: 'size-6',
                trailing: 'pe-5 inset-y-2',
                trailingIcon: 'size-6'
            }
        },
        leading: {
            true: ''
        },
        trailing: {
            true: ''
        },
        loading: {
            true: ''
        },
        highlight: {
            true: ''
        },
        autoresize: {
            true: {
                base: 'resize-none'
            }
        }
    },
    compoundVariants: [
        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-info'
            }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-outline'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                base: 'bg-primary-container/50 focus:bg-primary-container/75 focus:ring-2 focus:ring-inset focus:ring-primary'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                base: 'bg-secondary-container/50 focus:bg-secondary-container/75 focus:ring-2 focus:ring-inset focus:ring-secondary'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                base: 'bg-tertiary-container/50 focus:bg-tertiary-container/75 focus:ring-2 focus:ring-inset focus:ring-tertiary'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                base: 'bg-success-container/50 focus:bg-success-container/75 focus:ring-2 focus:ring-inset focus:ring-success'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                base: 'bg-warning-container/50 focus:bg-warning-container/75 focus:ring-2 focus:ring-inset focus:ring-warning'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                base: 'bg-error-container/50 focus:bg-error-container/75 focus:ring-2 focus:ring-inset focus:ring-error'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                base: 'bg-info-container/50 focus:bg-info-container/75 focus:ring-2 focus:ring-inset focus:ring-info'
            }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: {
                base: 'bg-surface-container-highest/50 focus:bg-surface-container-highest/75 focus:ring-2 focus:ring-inset focus:ring-outline'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                base: 'ring ring-inset ring-primary/25 bg-primary-container/50 focus:ring-2 focus:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                base: 'ring ring-inset ring-secondary/25 bg-secondary-container/50 focus:ring-2 focus:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                base: 'ring ring-inset ring-tertiary/25 bg-tertiary-container/50 focus:ring-2 focus:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                base: 'ring ring-inset ring-success/25 bg-success-container/50 focus:ring-2 focus:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                base: 'ring ring-inset ring-warning/25 bg-warning-container/50 focus:ring-2 focus:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                base: 'ring ring-inset ring-error/25 bg-error-container/50 focus:ring-2 focus:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                base: 'ring ring-inset ring-info/25 bg-info-container/50 focus:ring-2 focus:ring-info'
            }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                base: 'ring ring-inset ring-outline-variant bg-surface-container-highest/50 focus:ring-2 focus:ring-outline'
            }
        },

        // ========== GHOST VARIANTS ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: {
                base: 'bg-transparent hover:bg-primary-container/50 focus:ring-2 focus:ring-inset focus:ring-primary'
            }
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: {
                base: 'bg-transparent hover:bg-secondary-container/50 focus:ring-2 focus:ring-inset focus:ring-secondary'
            }
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: {
                base: 'bg-transparent hover:bg-tertiary-container/50 focus:ring-2 focus:ring-inset focus:ring-tertiary'
            }
        },
        {
            variant: 'ghost',
            color: 'success',
            class: {
                base: 'bg-transparent hover:bg-success-container/50 focus:ring-2 focus:ring-inset focus:ring-success'
            }
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: {
                base: 'bg-transparent hover:bg-warning-container/50 focus:ring-2 focus:ring-inset focus:ring-warning'
            }
        },
        {
            variant: 'ghost',
            color: 'error',
            class: {
                base: 'bg-transparent hover:bg-error-container/50 focus:ring-2 focus:ring-inset focus:ring-error'
            }
        },
        {
            variant: 'ghost',
            color: 'info',
            class: {
                base: 'bg-transparent hover:bg-info-container/50 focus:ring-2 focus:ring-inset focus:ring-info'
            }
        },
        {
            variant: 'ghost',
            color: 'surface',
            class: {
                base: 'bg-transparent hover:bg-surface-container-highest/50 focus:ring-2 focus:ring-inset focus:ring-outline'
            }
        },

        // ========== NONE VARIANT ==========
        {
            variant: 'none',
            class: {
                base: 'bg-transparent focus:ring-0'
            }
        },

        // ========== HIGHLIGHT VARIANTS ==========
        {
            highlight: true,
            color: 'primary',
            class: { base: 'ring-2 ring-inset ring-primary' }
        },
        {
            highlight: true,
            color: 'secondary',
            class: { base: 'ring-2 ring-inset ring-secondary' }
        },
        {
            highlight: true,
            color: 'tertiary',
            class: { base: 'ring-2 ring-inset ring-tertiary' }
        },
        {
            highlight: true,
            color: 'success',
            class: { base: 'ring-2 ring-inset ring-success' }
        },
        {
            highlight: true,
            color: 'warning',
            class: { base: 'ring-2 ring-inset ring-warning' }
        },
        {
            highlight: true,
            color: 'error',
            class: { base: 'ring-2 ring-inset ring-error' }
        },
        {
            highlight: true,
            color: 'info',
            class: { base: 'ring-2 ring-inset ring-info' }
        },
        {
            highlight: true,
            color: 'surface',
            class: { base: 'ring-2 ring-inset ring-outline' }
        },

        // ========== LEADING PADDING ADJUSTMENTS ==========
        { leading: true, size: 'xs', class: { base: 'ps-7' } },
        { leading: true, size: 'sm', class: { base: 'ps-8' } },
        { leading: true, size: 'md', class: { base: 'ps-9' } },
        { leading: true, size: 'lg', class: { base: 'ps-10' } },
        { leading: true, size: 'xl', class: { base: 'ps-12' } },

        // ========== TRAILING PADDING ADJUSTMENTS ==========
        { trailing: true, size: 'xs', class: { base: 'pe-7' } },
        { trailing: true, size: 'sm', class: { base: 'pe-8' } },
        { trailing: true, size: 'md', class: { base: 'pe-9' } },
        { trailing: true, size: 'lg', class: { base: 'pe-10' } },
        { trailing: true, size: 'xl', class: { base: 'pe-12' } },

        // ========== LOADING ICON ANIMATION ==========
        {
            loading: true,
            leading: true,
            class: {
                leadingIcon: 'animate-spin'
            }
        },
        {
            loading: true,
            leading: false,
            trailing: true,
            class: {
                trailingIcon: 'animate-spin'
            }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md'
    }
})

export type TextareaVariantProps = VariantProps<typeof textareaVariants>
export type TextareaSlots = keyof ReturnType<typeof textareaVariants>

export const textareaDefaults = {
    defaultVariants: textareaVariants.defaultVariants,
    slots: {} as Partial<Record<TextareaSlots, string>>
}
