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
        kbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
        kbdsSize: 'sm'
    },
    variants: {
        transition: {
            true: {
                content:
                    'data-[state=delayed-open]:animate-[scale-in_150ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in_forwards]'
            }
        }
    },
    defaultVariants: {
        transition: true
    }
})

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>
export type TooltipSlots = keyof ReturnType<typeof tooltipVariants>

export const tooltipDefaults = {
    defaultVariants: tooltipVariants.defaultVariants,
    slots: {} as Partial<Record<TooltipSlots, string>>
}
