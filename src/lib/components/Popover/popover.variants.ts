import { tv, type VariantProps } from 'tailwind-variants'

export const popoverVariants = tv({
    slots: {
        content: [
            'z-50',
            'bg-surface-container-lowest text-on-surface ring ring-surface-container-highest',
            'rounded-md shadow-lg',
            'focus:outline-none pointer-events-auto'
        ],
        arrow: ''
    },
    variants: {
        transition: {
            true: {
                content: [
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
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

export type PopoverVariantProps = VariantProps<typeof popoverVariants>
export type PopoverSlots = keyof ReturnType<typeof popoverVariants>

export const popoverDefaults = {
    defaultVariants: popoverVariants.defaultVariants,
    slots: {} as Partial<Record<PopoverSlots, string>>
}
