import { tv, type VariantProps } from 'tailwind-variants'
import { selectVariants } from '../Select/select.variants.js'

export const selectMenuVariants = tv({
    extend: selectVariants,
    slots: {
        content: [
            'z-50 max-h-60 w-(--bits-floating-anchor-width)',
            'bg-surface-container-low text-on-surface',
            'rounded-md',
            'ring ring-outline-variant/50',
            'shadow-lg',
            'focus:outline-none',
            'overflow-hidden',
            'flex flex-col'
        ],
        input: 'border-b border-outline-variant',
        viewport: 'p-1 flex-1 overflow-y-auto',
        empty: 'text-center text-on-surface-variant'
    },
    variants: {
        size: {
            xs: { empty: 'p-2 text-xs' },
            sm: { empty: 'p-2.5 text-xs' },
            md: { empty: 'p-2.5 text-sm' },
            lg: { empty: 'p-3 text-sm' },
            xl: { empty: 'p-3 text-base' }
        }
    }
})

export type SelectMenuVariantProps = VariantProps<typeof selectMenuVariants>
export type SelectMenuSlots = keyof ReturnType<typeof selectMenuVariants>

export const selectMenuDefaults = {
    defaultVariants: selectMenuVariants.defaultVariants,
    slots: {} as Partial<Record<SelectMenuSlots, string>>
}
