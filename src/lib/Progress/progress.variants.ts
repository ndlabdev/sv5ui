import { tv, type VariantProps } from 'tailwind-variants'

export const progressVariants = tv({
    slots: {
        root: 'gap-2',
        base: 'relative overflow-hidden rounded-full bg-surface-container-highest',
        indicator: 'rounded-full size-full transition-transform duration-200 ease-out',
        status: 'text-end transition-[width] duration-200 text-on-surface-variant',
        steps: 'flex justify-between'
    },
    variants: {
        animation: {
            carousel: '',
            'carousel-inverse': '',
            swing: '',
            elastic: ''
        },
        color: {
            primary: {
                indicator: 'bg-primary'
            },
            secondary: {
                indicator: 'bg-secondary'
            },
            tertiary: {
                indicator: 'bg-tertiary'
            },
            success: {
                indicator: 'bg-success'
            },
            warning: {
                indicator: 'bg-warning'
            },
            error: {
                indicator: 'bg-error'
            },
            info: {
                indicator: 'bg-info'
            },
            surface: {
                indicator: 'bg-on-surface'
            }
        },
        size: {
            '2xs': {
                status: 'text-xs',
                steps: 'text-xs'
            },
            xs: {
                status: 'text-xs',
                steps: 'text-xs'
            },
            sm: {
                status: 'text-sm',
                steps: 'text-sm'
            },
            md: {
                status: 'text-sm',
                steps: 'text-sm'
            },
            lg: {
                status: 'text-sm',
                steps: 'text-sm'
            },
            xl: {
                status: 'text-base',
                steps: 'text-base'
            },
            '2xl': {
                status: 'text-base',
                steps: 'text-base'
            }
        },
        step: {
            active: {
                steps: 'text-on-surface'
            },
            first: '',
            other: {
                steps: 'text-on-surface-variant'
            },
            last: ''
        },
        orientation: {
            horizontal: {
                root: 'flex flex-col',
                base: 'w-full'
            },
            vertical: {
                root: 'flex flex-row-reverse h-full',
                base: 'h-full'
            }
        },
        inverted: {
            true: {
                root: 'flex-col-reverse',
                status: 'text-start'
            }
        }
    },
    compoundVariants: [
        { orientation: 'horizontal', size: '2xs', class: { base: 'h-px' } },
        { orientation: 'horizontal', size: 'xs', class: { base: 'h-0.5' } },
        { orientation: 'horizontal', size: 'sm', class: { base: 'h-1' } },
        { orientation: 'horizontal', size: 'md', class: { base: 'h-2' } },
        { orientation: 'horizontal', size: 'lg', class: { base: 'h-3' } },
        { orientation: 'horizontal', size: 'xl', class: { base: 'h-4' } },
        { orientation: 'horizontal', size: '2xl', class: { base: 'h-5' } },
        { orientation: 'vertical', size: '2xs', class: { base: 'w-px' } },
        { orientation: 'vertical', size: 'xs', class: { base: 'w-0.5' } },
        { orientation: 'vertical', size: 'sm', class: { base: 'w-1' } },
        { orientation: 'vertical', size: 'md', class: { base: 'w-2' } },
        { orientation: 'vertical', size: 'lg', class: { base: 'w-3' } },
        { orientation: 'vertical', size: 'xl', class: { base: 'w-4' } },
        { orientation: 'vertical', size: '2xl', class: { base: 'w-5' } },
        {
            orientation: 'horizontal',
            animation: 'carousel',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'vertical',
            animation: 'carousel',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'horizontal',
            animation: 'carousel-inverse',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'vertical',
            animation: 'carousel-inverse',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'horizontal',
            animation: 'swing',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'vertical',
            animation: 'swing',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'horizontal',
            animation: 'elastic',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]'
            }
        }, {
            orientation: 'vertical',
            animation: 'elastic',
            class: {
                indicator: 'data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]'
            }
        },
        {
            inverted: true,
            orientation: 'horizontal',
            class: {
                step: 'text-start',
                status: 'flex-row-reverse'
            }
        }, {
            inverted: true,
            orientation: 'vertical',
            class: {
                steps: 'items-start',
                status: 'flex-col-reverse'
            }
        } 
    ],
    defaultVariants: {
        animation: 'carousel',
        color: 'primary',
        size: 'md',
        orientation: 'horizontal'
    }
})

export type ProgressVariantProps = VariantProps<typeof progressVariants>
export type ProgressSlots = keyof ReturnType<typeof progressVariants>

export const progressDefaults = {
    defaultVariants: progressVariants.defaultVariants,
    slots: {} as Partial<Record<ProgressSlots, string>>
}
