import { tv, type VariantProps } from 'tailwind-variants'
import type { InputVariantProps } from '../Input/input.variants.js'

const stepperButton = [
    'absolute flex items-center justify-center',
    'text-on-surface-variant/75 hover:text-on-surface',
    'disabled:opacity-75 disabled:pointer-events-none',
    'select-none touch-none focus:outline-none',
    'transition-colors'
]

export const inputNumberVariants = tv({
    slots: {
        root: 'relative w-full inline-flex items-center',
        base: 'tabular-nums',
        increment: stepperButton,
        decrement: stepperButton,
        incrementIcon: 'shrink-0',
        decrementIcon: 'shrink-0'
    },
    variants: {
        orientation: {
            horizontal: {
                base: 'text-center',
                increment: 'inset-y-0 end-0',
                decrement: 'inset-y-0 start-0'
            },
            vertical: {
                increment: 'top-0 bottom-1/2 end-0 items-end pb-0.5',
                decrement: 'top-1/2 bottom-0 end-0 items-start pt-0.5'
            }
        },
        size: {
            xs: {
                increment: 'w-7',
                decrement: 'w-7'
            },
            sm: {
                increment: 'w-8',
                decrement: 'w-8'
            },
            md: {
                increment: 'w-9',
                decrement: 'w-9'
            },
            lg: {
                increment: 'w-10',
                decrement: 'w-10'
            },
            xl: {
                increment: 'w-12',
                decrement: 'w-12'
            }
        }
    },
    compoundVariants: [
        // ========== HORIZONTAL ICON SIZES ==========
        {
            orientation: 'horizontal',
            size: 'xs',
            class: { incrementIcon: 'size-3.5', decrementIcon: 'size-3.5' }
        },
        {
            orientation: 'horizontal',
            size: 'sm',
            class: { incrementIcon: 'size-4', decrementIcon: 'size-4' }
        },
        {
            orientation: 'horizontal',
            size: 'md',
            class: { incrementIcon: 'size-5', decrementIcon: 'size-5' }
        },
        {
            orientation: 'horizontal',
            size: 'lg',
            class: { incrementIcon: 'size-5', decrementIcon: 'size-5' }
        },
        {
            orientation: 'horizontal',
            size: 'xl',
            class: { incrementIcon: 'size-6', decrementIcon: 'size-6' }
        },

        // ========== VERTICAL ICON SIZES ==========
        {
            orientation: 'vertical',
            size: 'xs',
            class: { incrementIcon: 'size-3', decrementIcon: 'size-3' }
        },
        {
            orientation: 'vertical',
            size: 'sm',
            class: { incrementIcon: 'size-3.5', decrementIcon: 'size-3.5' }
        },
        {
            orientation: 'vertical',
            size: 'md',
            class: { incrementIcon: 'size-4', decrementIcon: 'size-4' }
        },
        {
            orientation: 'vertical',
            size: 'lg',
            class: { incrementIcon: 'size-4', decrementIcon: 'size-4' }
        },
        {
            orientation: 'vertical',
            size: 'xl',
            class: { incrementIcon: 'size-5', decrementIcon: 'size-5' }
        }
    ],
    defaultVariants: {
        orientation: 'horizontal',
        size: 'md'
    }
})

export type InputNumberVariantProps = VariantProps<typeof inputNumberVariants>
export type InputNumberSlots = keyof ReturnType<typeof inputNumberVariants>

export const inputNumberDefaults = {
    defaultVariants: {
        ...inputNumberVariants.defaultVariants,
        variant: 'outline' as NonNullable<InputVariantProps['variant']>,
        color: 'primary' as NonNullable<InputVariantProps['color']>
    },
    slots: {} as Partial<Record<InputNumberSlots, string>>
}
