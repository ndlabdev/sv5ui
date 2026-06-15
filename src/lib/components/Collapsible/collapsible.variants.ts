import { tv, type VariantProps } from 'tailwind-variants'

export const collapsibleVariants = tv({
    slots: {
        root: '',
        content:
            'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden'
    },
    variants: {
        disabled: {
            true: {
                root: 'opacity-75 cursor-not-allowed'
            }
        }
    },
    defaultVariants: {
        disabled: false
    }
})

export type CollapsibleVariantProps = VariantProps<typeof collapsibleVariants>
export type CollapsibleSlots = keyof ReturnType<typeof collapsibleVariants>

export const collapsibleDefaults = {
    defaultVariants: collapsibleVariants.defaultVariants,
    slots: {} as Partial<Record<CollapsibleSlots, string>>
}
