import { tv, type VariantProps } from 'tailwind-variants'

export const checkboxGroupVariants = tv({
    slots: {
        root: '',
        fieldset: 'flex m-0 p-0 border-0 min-w-0',
        legend: 'w-full font-medium text-on-surface mb-1',
        item: 'flex items-start',
        container: 'flex items-center',
        wrapper: '',
        base: [
            'inline-flex items-center justify-center shrink-0 rounded-md border',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-colors duration-200',
            'border-outline-variant',
            'data-[state=unchecked]:bg-transparent'
        ],
        indicator: 'flex items-center justify-center',
        icon: 'shrink-0 text-surface',
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
                fieldset: 'gap-2',
                legend: 'text-xs',
                base: 'size-3.5 rounded',
                container: 'h-4',
                icon: 'size-2.5',
                wrapper: 'text-xs'
            },
            sm: {
                fieldset: 'gap-2.5',
                legend: 'text-xs',
                base: 'size-4 rounded',
                container: 'h-4',
                icon: 'size-3',
                wrapper: 'text-xs'
            },
            md: {
                fieldset: 'gap-3',
                legend: 'text-sm',
                base: 'size-4.5 rounded-md',
                container: 'h-5',
                icon: 'size-3.5',
                wrapper: 'text-sm'
            },
            lg: {
                fieldset: 'gap-3.5',
                legend: 'text-sm',
                base: 'size-5 rounded-md',
                container: 'h-5',
                icon: 'size-4',
                wrapper: 'text-sm'
            },
            xl: {
                fieldset: 'gap-4',
                legend: 'text-base',
                base: 'size-5.5 rounded-md',
                container: 'h-6',
                icon: 'size-4.5',
                wrapper: 'text-base'
            }
        },
        orientation: {
            horizontal: {
                fieldset: 'flex-row flex-wrap items-start'
            },
            vertical: {
                fieldset: 'flex-col'
            }
        },
        variant: {
            list: '',
            card: {
                item: 'border border-outline-variant rounded-lg cursor-pointer select-none'
            }
        },
        indicator: {
            start: {
                wrapper: 'ms-2'
            },
            end: {
                item: 'flex-row-reverse',
                wrapper: 'me-2'
            },
            hidden: {
                container: 'sr-only'
            }
        },
        loading: {
            true: {
                icon: 'animate-spin'
            }
        },
        required: {
            true: {
                legend: "after:content-['*'] after:ms-0.5 after:text-error"
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
        },
        // ========== CARD × SIZE (padding) ==========
        { variant: 'card', size: 'xs', class: { item: 'p-2' } },
        { variant: 'card', size: 'sm', class: { item: 'p-2.5' } },
        { variant: 'card', size: 'md', class: { item: 'p-3' } },
        { variant: 'card', size: 'lg', class: { item: 'p-3.5' } },
        { variant: 'card', size: 'xl', class: { item: 'p-4' } },
        // ========== CARD × COLOR (checked border) ==========
        {
            variant: 'card',
            color: 'primary',
            class: { item: 'has-[[data-state=checked]]:border-primary' }
        },
        {
            variant: 'card',
            color: 'secondary',
            class: { item: 'has-[[data-state=checked]]:border-secondary' }
        },
        {
            variant: 'card',
            color: 'tertiary',
            class: { item: 'has-[[data-state=checked]]:border-tertiary' }
        },
        {
            variant: 'card',
            color: 'success',
            class: { item: 'has-[[data-state=checked]]:border-success' }
        },
        {
            variant: 'card',
            color: 'warning',
            class: { item: 'has-[[data-state=checked]]:border-warning' }
        },
        {
            variant: 'card',
            color: 'error',
            class: { item: 'has-[[data-state=checked]]:border-error' }
        },
        {
            variant: 'card',
            color: 'info',
            class: { item: 'has-[[data-state=checked]]:border-info' }
        },
        {
            variant: 'card',
            color: 'surface',
            class: { item: 'has-[[data-state=checked]]:border-on-surface' }
        },
        // ========== CARD × DISABLED ==========
        { variant: 'card', disabled: true, class: { item: 'cursor-not-allowed' } }
    ],
    defaultVariants: {
        color: 'primary',
        size: 'md',
        variant: 'list',
        indicator: 'start',
        orientation: 'vertical'
    }
})

export type CheckboxGroupVariantProps = VariantProps<typeof checkboxGroupVariants>
export type CheckboxGroupSlots = keyof ReturnType<typeof checkboxGroupVariants>

export const checkboxGroupDefaults = {
    defaultVariants: checkboxGroupVariants.defaultVariants,
    slots: {} as Partial<Record<CheckboxGroupSlots, string>>
}
