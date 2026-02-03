import { tv, type VariantProps } from 'tailwind-variants'

export const tooltipVariants = tv({
    slots: {
        content: [
            'z-50 flex items-center gap-1.5',
            'bg-inverse-surface text-inverse-on-surface',
            'shadow-sm rounded-md',
            'px-2.5 py-1.5 text-xs',
            'select-none pointer-events-auto'
        ],
        arrow: 'fill-inverse-surface text-inverse-surface',
        text: 'truncate',
        kbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5'
    },
    variants: {
        side: {
            top: {
                content: 'data-[state=delayed-open]:animate-[slide-in-from-bottom_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-top_100ms_ease-in_reverse]'
            },
            right: {
                content: 'data-[state=delayed-open]:animate-[slide-in-from-left_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-right_100ms_ease-in_reverse]'
            },
            bottom: {
                content: 'data-[state=delayed-open]:animate-[slide-in-from-top_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-bottom_100ms_ease-in_reverse]'
            },
            left: {
                content: 'data-[state=delayed-open]:animate-[slide-in-from-right_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-left_100ms_ease-in_reverse]'
            }
        },
        transition: {
            true: {
                content: 'data-[state=delayed-open]:animate-[fade-in_150ms_ease-out,zoom-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in,zoom-out_100ms_ease-in]'
            }
        }
    },
    defaultVariants: {
        side: 'bottom',
        transition: true
    }
})

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>
export type TooltipSlots = keyof ReturnType<typeof tooltipVariants>

export const tooltipDefaults = {
    defaultVariants: tooltipVariants.defaultVariants,
    slots: {} as Partial<Record<TooltipSlots, string>>
}
