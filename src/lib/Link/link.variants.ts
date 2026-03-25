import { tv, type VariantProps } from 'tailwind-variants'

export const linkVariants = tv({
    slots: {
        base: 'focus-visible:outline-primary'
    },
    variants: {
        active: {
            true: {
                base: 'text-primary'
            },
            false: {
                base: 'text-on-surface-variant'
            }
        },
        disabled: {
            true: {
                base: 'cursor-not-allowed opacity-75'
            },
            false: ''
        },
        raw: {
            true: '',
            false: ''
        }
    },
    compoundVariants: [
        {
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'hover:text-on-surface transition-colors' }
        }
    ],
    defaultVariants: {
        active: false,
        disabled: false,
        raw: false
    }
})

export type LinkVariantProps = VariantProps<typeof linkVariants>
export type LinkSlots = keyof ReturnType<typeof linkVariants>

export const linkDefaults = {
    defaultVariants: linkVariants.defaultVariants,
    slots: {} as Partial<Record<LinkSlots, string>>
}
