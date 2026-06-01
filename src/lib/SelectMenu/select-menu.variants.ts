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
        input: [
            'w-full border-0 border-b border-outline-variant bg-transparent',
            'text-on-surface placeholder:text-on-surface-variant/50',
            'focus:outline-none focus:ring-0'
        ],
        viewport: 'p-1 flex-1 overflow-y-auto scrollbar-thin',
        empty: 'text-center text-on-surface-variant',
        createItem: [
            'group relative flex items-center gap-2 w-full rounded-sm px-2 cursor-pointer select-none',
            'focus:outline-none',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'data-[highlighted]:bg-surface-container-highest'
        ],
        createItemIcon: 'shrink-0 text-primary',
        createItemLabel: 'flex-1 truncate text-on-surface'
    },
    variants: {
        size: {
            xs: {
                input: 'px-2 py-1 text-xs',
                empty: 'p-2 text-xs',
                createItem: 'py-1 text-xs',
                createItemIcon: 'size-3'
            },
            sm: {
                input: 'px-2.5 py-1.5 text-xs',
                empty: 'p-2.5 text-xs',
                createItem: 'py-1.5 text-xs',
                createItemIcon: 'size-3.5'
            },
            md: {
                input: 'px-3 py-2 text-sm',
                empty: 'p-2.5 text-sm',
                createItem: 'py-1.5 text-sm',
                createItemIcon: 'size-4'
            },
            lg: {
                input: 'px-4 py-2.5 text-sm',
                empty: 'p-3 text-sm',
                createItem: 'py-2 text-sm',
                createItemIcon: 'size-5'
            },
            xl: {
                input: 'px-5 py-3 text-base',
                empty: 'p-3 text-base',
                createItem: 'py-2.5 text-base',
                createItemIcon: 'size-5'
            }
        }
    }
})

export type SelectMenuVariantProps = VariantProps<typeof selectMenuVariants>
export type SelectMenuSlots = keyof ReturnType<typeof selectMenuVariants>

export const selectMenuDefaults = {
    defaultVariants: selectMenuVariants.defaultVariants,
    slots: {} as Partial<Record<SelectMenuSlots, string>>
}
