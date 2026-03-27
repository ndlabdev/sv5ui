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
                content: [
                    'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    'data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2'
                ]
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
