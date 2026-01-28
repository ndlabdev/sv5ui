import { tv, type VariantProps } from 'tailwind-variants'

export const cardVariants = tv({
    slots: {
        root: 'rounded-lg overflow-hidden',
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
    },
    variants: {
        variant: {
            solid: {
                root: 'bg-inverse-surface text-inverse-on-surface'
            },
            outline: {
                root: 'bg-surface ring ring-outline-variant divide-y divide-outline-variant'
            },
            soft: {
                root: 'bg-surface-container divide-y divide-outline-variant'
            },
            subtle: {
                root: 'bg-surface-container ring ring-outline-variant divide-y divide-outline-variant'
            }
        }
    },
    defaultVariants: {
        variant: 'outline'
    }
})

export type CardVariantProps = VariantProps<typeof cardVariants>
export type CardSlots = keyof ReturnType<typeof cardVariants>

export const cardDefaults = cardVariants.defaultVariants
