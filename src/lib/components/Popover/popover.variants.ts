import { tv, type VariantProps } from 'tailwind-variants'

export const popoverVariants = tv({
    slots: {
        content: [
            'z-50',
            'bg-surface-container-lowest text-on-surface ring ring-surface-container-highest',
            'rounded-md shadow-lg',
            'focus:outline-none pointer-events-auto'
        ],
        arrow: 'fill-surface-container-lowest text-surface-container-lowest',
        arrowBorder: 'stroke-surface-container-highest'
    },
    variants: {
        transition: {
            true: {
                content:
                    'data-[state=open]:animate-[scale-in_150ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in_forwards]'
            }
        }
    },
    defaultVariants: {
        transition: true
    }
})

export type PopoverVariantProps = VariantProps<typeof popoverVariants>
export type PopoverSlots = keyof ReturnType<typeof popoverVariants>

export const popoverDefaults = {
    defaultVariants: popoverVariants.defaultVariants,
    slots: {} as Partial<Record<PopoverSlots, string>>
}
