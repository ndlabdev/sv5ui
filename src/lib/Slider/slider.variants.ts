import { tv, type VariantProps } from 'tailwind-variants'

export const sliderVariants = tv({
    slots: {
        root: '',
        base: 'relative flex touch-none select-none items-center',
        track: 'relative grow overflow-hidden rounded-full bg-surface-container-highest',
        range: 'absolute rounded-full',
        thumb: [
            'block rounded-full bg-surface shadow-sm ring-2',
            'focus-visible:outline-none focus-visible:ring-4',
            'transition-[box-shadow] duration-150',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
        ],
        tooltip: [
            'rounded px-1.5 py-0.5 text-xs font-medium',
            'bg-on-surface text-surface shadow-sm',
            'pointer-events-none select-none whitespace-nowrap'
        ]
    },
    variants: {
        color: {
            primary: {
                range: 'bg-primary',
                thumb: 'ring-primary focus-visible:ring-primary/40'
            },
            secondary: {
                range: 'bg-secondary',
                thumb: 'ring-secondary focus-visible:ring-secondary/40'
            },
            tertiary: {
                range: 'bg-tertiary',
                thumb: 'ring-tertiary focus-visible:ring-tertiary/40'
            },
            success: {
                range: 'bg-success',
                thumb: 'ring-success focus-visible:ring-success/40'
            },
            warning: {
                range: 'bg-warning',
                thumb: 'ring-warning focus-visible:ring-warning/40'
            },
            error: {
                range: 'bg-error',
                thumb: 'ring-error focus-visible:ring-error/40'
            },
            info: {
                range: 'bg-info',
                thumb: 'ring-info focus-visible:ring-info/40'
            },
            surface: {
                range: 'bg-on-surface',
                thumb: 'ring-on-surface focus-visible:ring-on-surface/40'
            }
        },
        size: {
            xs: { thumb: 'size-3' },
            sm: { thumb: 'size-3.5' },
            md: { thumb: 'size-4' },
            lg: { thumb: 'size-4.5' },
            xl: { thumb: 'size-5' }
        },
        orientation: {
            horizontal: {
                base: 'w-full flex-row',
                range: 'h-full left-0'
            },
            vertical: {
                base: 'h-full flex-col',
                range: 'w-full bottom-0'
            }
        },
        disabled: {
            true: {
                base: 'opacity-50 cursor-not-allowed'
            }
        }
    },
    compoundVariants: [
        // Track thickness: size × orientation
        { size: 'xs', orientation: 'horizontal', class: { track: 'h-1' } },
        { size: 'sm', orientation: 'horizontal', class: { track: 'h-1.5' } },
        { size: 'md', orientation: 'horizontal', class: { track: 'h-2' } },
        { size: 'lg', orientation: 'horizontal', class: { track: 'h-2.5' } },
        { size: 'xl', orientation: 'horizontal', class: { track: 'h-3' } },
        { size: 'xs', orientation: 'vertical', class: { track: 'w-1' } },
        { size: 'sm', orientation: 'vertical', class: { track: 'w-1.5' } },
        { size: 'md', orientation: 'vertical', class: { track: 'w-2' } },
        { size: 'lg', orientation: 'vertical', class: { track: 'w-2.5' } },
        { size: 'xl', orientation: 'vertical', class: { track: 'w-3' } }
    ],
    defaultVariants: {
        color: 'primary',
        size: 'md',
        orientation: 'horizontal'
    }
})

export type SliderVariantProps = VariantProps<typeof sliderVariants>
export type SliderSlots = keyof ReturnType<typeof sliderVariants>

export const sliderDefaults = {
    defaultVariants: sliderVariants.defaultVariants,
    slots: {} as Partial<Record<SliderSlots, string>>
}
