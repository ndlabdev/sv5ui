import { tv, type VariantProps } from 'tailwind-variants'

export const tourVariants = tv({
    slots: {
        overlay: 'fixed inset-0 z-[var(--sv5ui-tour-overlay-z,100)]',
        spotlight: [
            'fixed top-0 left-0 z-[var(--sv5ui-tour-overlay-z,100)] pointer-events-none',
            'shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]'
        ],
        panel: [
            'z-[var(--sv5ui-tour-panel-z,101)] flex flex-col',
            'bg-surface-container-lowest text-on-surface ring ring-surface-container-highest',
            'rounded-xl shadow-xl focus:outline-none',
            'w-[var(--sv5ui-tour-w)] max-w-[calc(100vw-2rem)]'
        ],
        arrow: 'bg-surface-container-lowest border-surface-container-highest',
        header: 'relative flex items-start justify-between gap-2 p-4 pb-0',
        title: 'font-semibold text-sm leading-snug',
        description: 'text-sm text-on-surface-variant',
        body: 'px-4 py-3 text-sm text-on-surface-variant',
        footer: 'flex items-center justify-between gap-3 p-4 pt-0',
        progress: 'flex items-center gap-1.5',
        progressDot: 'size-1.5 rounded-full bg-on-surface-variant/30 transition-colors',
        nav: 'flex items-center gap-2 ml-auto',
        prevButton: '',
        nextButton: '',
        skipButton: 'text-on-surface-variant',
        closeButton: 'shrink-0 -mt-1 -mr-1'
    },
    variants: {
        size: {
            sm: { panel: '[--sv5ui-tour-w:280px]' },
            md: { panel: '[--sv5ui-tour-w:340px]' },
            lg: { panel: '[--sv5ui-tour-w:420px]' }
        },
        transition: {
            true: {
                panel: [
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                ],
                spotlight: 'transition-transform duration-300 ease-out'
            }
        },
        active: {
            true: { progressDot: 'bg-primary' }
        }
    },
    defaultVariants: {
        size: 'md',
        transition: true
    }
})

export type TourVariantProps = VariantProps<typeof tourVariants>
export type TourSlots = keyof ReturnType<typeof tourVariants>

export const tourDefaults = {
    defaultVariants: tourVariants.defaultVariants,
    slots: {} as Partial<Record<TourSlots, string>>
}
