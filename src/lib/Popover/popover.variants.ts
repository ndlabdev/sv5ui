import { tv, type VariantProps } from 'tailwind-variants'

export const popoverVariants = tv({
    slots: {
        content: [
            'z-50',
            'bg-surface-container-low text-on-surface',
            'rounded-md',
            '[--ui-border-color:var(--color-outline-variant)]',
            '[filter:drop-shadow(0_4px_6px_rgb(0_0_0/0.07))_drop-shadow(0_2px_4px_rgb(0_0_0/0.06))_drop-shadow(0_0_1px_var(--ui-border-color))]',
            'focus:outline-none pointer-events-auto'
        ],
        arrow: 'fill-surface-container-low text-surface-container-low'
    },
    variants: {
        side: {
            top: {
                content: 'data-[state=open]:animate-[slide-in-from-bottom_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-top_100ms_ease-in_reverse]'
            },
            right: {
                content: 'data-[state=open]:animate-[slide-in-from-left_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-right_100ms_ease-in_reverse]'
            },
            bottom: {
                content: 'data-[state=open]:animate-[slide-in-from-top_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-bottom_100ms_ease-in_reverse]'
            },
            left: {
                content: 'data-[state=open]:animate-[slide-in-from-right_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-left_100ms_ease-in_reverse]'
            }
        },
        transition: {
            true: {
                content: 'data-[state=open]:animate-[fade-in_150ms_ease-out,scale-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in,scale-out_100ms_ease-in]'
            }
        }
    },
    defaultVariants: {
        side: 'bottom',
        transition: true
    }
})

export type PopoverVariantProps = VariantProps<typeof popoverVariants>
export type PopoverSlots = keyof ReturnType<typeof popoverVariants>

export const popoverDefaults = {
    defaultVariants: popoverVariants.defaultVariants,
    slots: {} as Partial<Record<PopoverSlots, string>>
}
