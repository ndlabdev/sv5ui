import { tv, type VariantProps } from 'tailwind-variants'

export const carouselVariants = tv({
    slots: {
        root: 'relative',
        viewport: 'overflow-hidden',
        container: 'flex',
        slide: 'shrink-0 grow-0 basis-[calc(100%/var(--sv-slides))]',
        arrow: 'absolute z-10 shadow-md',
        arrowPrev: '',
        arrowNext: '',
        dots: 'flex items-center justify-center gap-2',
        dot: [
            'rounded-full bg-on-surface/30 transition-all',
            'hover:bg-on-surface/50',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            'data-[selected]:bg-primary'
        ]
    },
    variants: {
        orientation: {
            horizontal: {
                viewport: 'w-full',
                container: 'flex-row touch-pan-y',
                slide: 'min-w-0 h-auto',
                dots: 'flex-row mt-4',
                arrowPrev: 'left-2 top-1/2 -translate-y-1/2',
                arrowNext: 'right-2 top-1/2 -translate-y-1/2'
            },
            vertical: {
                root: 'h-full',
                viewport: 'h-full w-full',
                container: 'flex-col h-full touch-pan-x',
                slide: 'min-h-0 w-auto',
                dots: 'flex-col absolute right-2 top-1/2 -translate-y-1/2',
                arrowPrev: 'top-2 left-1/2 -translate-x-1/2',
                arrowNext: 'bottom-2 left-1/2 -translate-x-1/2'
            }
        },
        size: {
            xs: { dot: 'size-1.5' },
            sm: { dot: 'size-2' },
            md: { dot: 'size-2.5' },
            lg: { dot: 'size-3' },
            xl: { dot: 'size-3.5' }
        },
        color: {
            primary: { dot: 'data-[selected]:bg-primary focus-visible:outline-primary' },
            secondary: { dot: 'data-[selected]:bg-secondary focus-visible:outline-secondary' },
            tertiary: { dot: 'data-[selected]:bg-tertiary focus-visible:outline-tertiary' },
            success: { dot: 'data-[selected]:bg-success focus-visible:outline-success' },
            warning: { dot: 'data-[selected]:bg-warning focus-visible:outline-warning' },
            error: { dot: 'data-[selected]:bg-error focus-visible:outline-error' },
            info: { dot: 'data-[selected]:bg-info focus-visible:outline-info' },
            surface: {
                dot: 'data-[selected]:bg-on-surface focus-visible:outline-on-surface'
            }
        },
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: '',
            ghost: ''
        }
    },
    compoundVariants: [
        { orientation: 'horizontal', size: 'xs', class: { dot: 'data-[selected]:w-4' } },
        { orientation: 'horizontal', size: 'sm', class: { dot: 'data-[selected]:w-5' } },
        { orientation: 'horizontal', size: 'md', class: { dot: 'data-[selected]:w-6' } },
        { orientation: 'horizontal', size: 'lg', class: { dot: 'data-[selected]:w-7' } },
        { orientation: 'horizontal', size: 'xl', class: { dot: 'data-[selected]:w-8' } },
        { orientation: 'vertical', size: 'xs', class: { dot: 'data-[selected]:h-4' } },
        { orientation: 'vertical', size: 'sm', class: { dot: 'data-[selected]:h-5' } },
        { orientation: 'vertical', size: 'md', class: { dot: 'data-[selected]:h-6' } },
        { orientation: 'vertical', size: 'lg', class: { dot: 'data-[selected]:h-7' } },
        { orientation: 'vertical', size: 'xl', class: { dot: 'data-[selected]:h-8' } }
    ],
    defaultVariants: {
        orientation: 'horizontal',
        size: 'md',
        color: 'primary',
        variant: 'soft'
    }
})

export type CarouselVariantProps = VariantProps<typeof carouselVariants>
export type CarouselSlots = keyof ReturnType<typeof carouselVariants>

export const carouselDefaults = {
    defaultVariants: carouselVariants.defaultVariants,
    slots: {} as Partial<Record<CarouselSlots, string>>
}
