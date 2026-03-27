import { tv, type VariantProps } from 'tailwind-variants'

export const radioGroupVariants = tv({
    slots: {
        root: '',
        fieldset: 'flex',
        legend: 'block font-medium text-on-surface mb-1',
        item: 'flex items-start',
        container: 'flex items-center',
        base: [
            'inline-flex items-center justify-center shrink-0 rounded-full border',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-colors duration-200',
            'border-outline-variant',
            'data-[state=unchecked]:bg-transparent'
        ],
        indicator: [
            'flex items-center justify-center rounded-full',
            'after:content-[""] after:block after:rounded-full after:bg-surface'
        ],
        loadingIcon: 'shrink-0 animate-spin text-surface',
        wrapper: '',
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
                base: 'size-3.5',
                container: 'h-4',
                indicator: 'size-3.5 after:size-1',
                loadingIcon: 'size-2',
                wrapper: 'text-xs'
            },
            sm: {
                fieldset: 'gap-2.5',
                base: 'size-4',
                container: 'h-4',
                indicator: 'size-4 after:size-1.5',
                loadingIcon: 'size-2.5',
                wrapper: 'text-xs'
            },
            md: {
                fieldset: 'gap-3',
                base: 'size-4.5',
                container: 'h-5',
                indicator: 'size-4.5 after:size-1.5',
                loadingIcon: 'size-3',
                wrapper: 'text-sm'
            },
            lg: {
                fieldset: 'gap-3.5',
                base: 'size-5',
                container: 'h-5',
                indicator: 'size-5 after:size-2',
                loadingIcon: 'size-3.5',
                wrapper: 'text-sm'
            },
            xl: {
                fieldset: 'gap-4',
                base: 'size-5.5',
                container: 'h-6',
                indicator: 'size-5.5 after:size-2.5',
                loadingIcon: 'size-4',
                wrapper: 'text-base'
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
        orientation: {
            horizontal: {
                fieldset: 'flex-row'
            },
            vertical: {
                fieldset: 'flex-col'
            }
        },
        loading: {
            true: ''
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
                base: 'data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:outline-primary'
            }
        },
        {
            color: 'secondary',
            class: {
                base: 'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary focus-visible:outline-secondary'
            }
        },
        {
            color: 'tertiary',
            class: {
                base: 'data-[state=checked]:bg-tertiary data-[state=checked]:border-tertiary focus-visible:outline-tertiary'
            }
        },
        {
            color: 'success',
            class: {
                base: 'data-[state=checked]:bg-success data-[state=checked]:border-success focus-visible:outline-success'
            }
        },
        {
            color: 'warning',
            class: {
                base: 'data-[state=checked]:bg-warning data-[state=checked]:border-warning focus-visible:outline-warning'
            }
        },
        {
            color: 'error',
            class: {
                base: 'data-[state=checked]:bg-error data-[state=checked]:border-error focus-visible:outline-error'
            }
        },
        {
            color: 'info',
            class: {
                base: 'data-[state=checked]:bg-info data-[state=checked]:border-info focus-visible:outline-info'
            }
        },
        {
            color: 'surface',
            class: {
                base: 'data-[state=checked]:bg-on-surface data-[state=checked]:border-on-surface focus-visible:outline-outline'
            }
        },
        // ========== CARD × SIZE (padding) ==========
        { variant: 'card', size: 'xs', class: { item: 'p-2' } },
        { variant: 'card', size: 'sm', class: { item: 'p-2.5' } },
        { variant: 'card', size: 'md', class: { item: 'p-3' } },
        { variant: 'card', size: 'lg', class: { item: 'p-3.5' } },
        { variant: 'card', size: 'xl', class: { item: 'p-4' } },
        // ========== CARD × COLOR (checked border) ==========
        { variant: 'card', color: 'primary', class: { item: 'has-[[data-state=checked]]:border-primary' } },
        { variant: 'card', color: 'secondary', class: { item: 'has-[[data-state=checked]]:border-secondary' } },
        { variant: 'card', color: 'tertiary', class: { item: 'has-[[data-state=checked]]:border-tertiary' } },
        { variant: 'card', color: 'success', class: { item: 'has-[[data-state=checked]]:border-success' } },
        { variant: 'card', color: 'warning', class: { item: 'has-[[data-state=checked]]:border-warning' } },
        { variant: 'card', color: 'error', class: { item: 'has-[[data-state=checked]]:border-error' } },
        { variant: 'card', color: 'info', class: { item: 'has-[[data-state=checked]]:border-info' } },
        { variant: 'card', color: 'surface', class: { item: 'has-[[data-state=checked]]:border-on-surface' } },
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

export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>
export type RadioGroupSlots = keyof ReturnType<typeof radioGroupVariants>

export const radioGroupDefaults = {
    defaultVariants: radioGroupVariants.defaultVariants,
    slots: {} as Partial<Record<RadioGroupSlots, string>>
}
