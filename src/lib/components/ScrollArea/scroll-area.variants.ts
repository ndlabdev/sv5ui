import { tv, type VariantProps } from 'tailwind-variants'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'
export type ScrollAreaType = 'hover' | 'scroll' | 'auto' | 'always'

export const scrollAreaVariants = tv({
    slots: {
        root: 'relative flex flex-col overflow-hidden',
        viewport:
            'w-full min-h-0 flex-1 max-h-[inherit] rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
        content: '',
        scrollbar: [
            'z-20 flex touch-none select-none p-px transition-colors duration-150',
            'data-[orientation=horizontal]:flex-col',
            'data-[state=hidden]:pointer-events-none'
        ],
        thumb: 'relative flex-1 rounded-full transition-colors duration-150',
        corner: 'bg-transparent'
    },
    variants: {
        color: {
            primary: { thumb: 'bg-primary/40 hover:bg-primary/70' },
            secondary: { thumb: 'bg-secondary/40 hover:bg-secondary/70' },
            tertiary: { thumb: 'bg-tertiary/40 hover:bg-tertiary/70' },
            success: { thumb: 'bg-success/40 hover:bg-success/70' },
            warning: { thumb: 'bg-warning/40 hover:bg-warning/70' },
            error: { thumb: 'bg-error/40 hover:bg-error/70' },
            info: { thumb: 'bg-info/40 hover:bg-info/70' },
            surface: { thumb: 'bg-outline-variant hover:bg-outline' }
        },
        size: {
            xs: {
                scrollbar: 'data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:h-1.5'
            },
            sm: {
                scrollbar: 'data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2'
            },
            md: {
                scrollbar: 'data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5'
            },
            lg: {
                scrollbar: 'data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3'
            }
        },
        track: {
            true: { scrollbar: 'bg-surface-container-highest/40' },
            false: { scrollbar: 'hover:bg-surface-container-highest/40' }
        },
        transition: {
            true: {
                scrollbar:
                    'data-[state=visible]:animate-[fade-in_150ms_ease-out] data-[state=hidden]:animate-[fade-out_150ms_ease-in]'
            },
            false: ''
        }
    },
    defaultVariants: {
        color: 'surface',
        size: 'sm',
        track: false,
        transition: true
    }
})

export type ScrollAreaVariantProps = VariantProps<typeof scrollAreaVariants>
export type ScrollAreaSlots = keyof ReturnType<typeof scrollAreaVariants>

export const scrollAreaDefaults = {
    defaultVariants: scrollAreaVariants.defaultVariants,
    slots: {} as Partial<Record<ScrollAreaSlots, string>>,
    orientation: 'vertical' as ScrollAreaOrientation,
    type: 'hover' as ScrollAreaType,
    scrollHideDelay: 600
}
