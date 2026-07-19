import { tv, type VariantProps } from 'tailwind-variants'
import { fieldGroupVariant } from '../FieldGroup/field-group.variants.js'
import { toggleVariants } from '../Toggle/toggle.variants.js'

export const toggleGroupVariants = tv({
    slots: {
        root: 'inline-flex items-center',
        item: ''
    },
    variants: {
        orientation: {
            horizontal: {},
            vertical: {
                root: 'flex-col items-stretch'
            }
        },
        attached: {
            true: {},
            false: {
                root: 'gap-1'
            }
        },
        block: {
            true: {
                root: 'flex w-full',
                item: 'flex-1'
            }
        }
    },
    compoundVariants: [
        {
            attached: true,
            orientation: 'horizontal',
            class: {
                root: '-space-x-px',
                item: fieldGroupVariant.fieldGroup.horizontal
            }
        },
        {
            attached: true,
            orientation: 'vertical',
            class: {
                root: '-space-y-px',
                item: fieldGroupVariant.fieldGroup.vertical
            }
        }
    ],
    defaultVariants: {
        orientation: 'horizontal',
        attached: false
    }
})

export type ToggleGroupVariantProps = VariantProps<typeof toggleGroupVariants>
export type ToggleGroupSlots =
    | keyof ReturnType<typeof toggleGroupVariants>
    | Exclude<keyof ReturnType<typeof toggleVariants>, 'base'>

export const toggleGroupDefaults = {
    defaultVariants: {
        ...toggleVariants.defaultVariants,
        ...toggleGroupVariants.defaultVariants
    },
    slots: {} as Partial<Record<ToggleGroupSlots, string>>
}
