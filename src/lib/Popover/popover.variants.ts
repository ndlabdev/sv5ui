import { tv, type VariantProps } from 'tailwind-variants'

export const popoverVariants = tv({
    slots: {
        content: [
            'z-50',
            'bg-inverse-surface text-inverse-on-surface',
            'rounded-md',
            '[--ui-border-color:rgb(255_255_255/0.1)]',
            '[filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.1))_drop-shadow(0_0_1px_var(--ui-border-color))]',
            'focus:outline-none pointer-events-auto'
        ],
        arrow: 'fill-inverse-surface text-inverse-surface'
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
