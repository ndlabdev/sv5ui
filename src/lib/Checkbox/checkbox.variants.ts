import { tv, type VariantProps } from 'tailwind-variants'

export const checkboxVariants = tv({
    slots: {
        root: 'relative flex items-start',
        base: [
            'inline-flex items-center justify-center shrink-0 rounded-md border',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-colors duration-200',
            'border-outline-variant',
            'data-[state=unchecked]:bg-transparent'
        ],
        container: 'flex items-center',
        indicator: 'flex items-center justify-center',
        icon: 'shrink-0 text-white',
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
                base: 'size-3.5 rounded',
                container: 'h-4',
                icon: 'size-2.5',
                wrapper: 'text-xs'
            },
            sm: {
                base: 'size-4 rounded',
                container: 'h-4',
                icon: 'size-3',
                wrapper: 'text-xs'
            },
            md: {
                base: 'size-4.5 rounded-md',
                container: 'h-5',
                icon: 'size-3.5',
                wrapper: 'text-sm'
            },
            lg: {
                base: 'size-5 rounded-md',
                container: 'h-5',
                icon: 'size-4',
                wrapper: 'text-sm'
            },
            xl: {
                base: 'size-5.5 rounded-md',
                container: 'h-6',
                icon: 'size-4.5',
                wrapper: 'text-base'
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
        // ========== COLOR (checked bg + border + focus ring) ==========
        {
            color: 'primary',
            class: {
                base: 'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary focus-visible:outline-primary'
            }
        },
        {
            color: 'secondary',
            class: {
                base: 'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary focus-visible:outline-secondary'
            }
        },
        {
            color: 'tertiary',
            class: {
                base: 'data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary data-[state=indeterminate]:bg-tertiary data-[state=indeterminate]:border-tertiary focus-visible:outline-tertiary'
            }
        },
        {
            color: 'success',
            class: {
                base: 'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success focus-visible:outline-success'
            }
        },
        {
            color: 'warning',
            class: {
                base: 'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning focus-visible:outline-warning'
            }
        },
        {
            color: 'error',
            class: {
                base: 'data-[state=checked]:bg-error data-[state=checked]:border-error data-[state=indeterminate]:bg-error data-[state=indeterminate]:border-error focus-visible:outline-error'
            }
        },
        {
            color: 'info',
            class: {
                base: 'data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info focus-visible:outline-info'
            }
        },
        {
            color: 'surface',
            class: {
                base: 'data-[state=checked]:bg-on-surface data-[state=checked]:border-on-surface data-[state=indeterminate]:bg-on-surface data-[state=indeterminate]:border-on-surface focus-visible:outline-outline'
            }
        }
    ],
    defaultVariants: {
        color: 'primary',
        size: 'md'
    }
})

export type CheckboxVariantProps = VariantProps<typeof checkboxVariants>
export type CheckboxSlots = keyof ReturnType<typeof checkboxVariants>

export const checkboxDefaults = {
    defaultVariants: checkboxVariants.defaultVariants,
    slots: {} as Partial<Record<CheckboxSlots, string>>
}
