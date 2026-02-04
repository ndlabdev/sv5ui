import { tv, type VariantProps } from 'tailwind-variants'

export const chipVariants = tv({
    slots: {
        root: 'relative inline-flex items-center justify-center shrink-0',
        base: 'rounded-full ring ring-surface flex items-center justify-center font-medium whitespace-nowrap'
    },
    variants: {
        color: {
            primary: { base: 'bg-primary text-on-primary' },
            secondary: { base: 'bg-secondary text-on-secondary' },
            tertiary: { base: 'bg-tertiary text-on-tertiary' },
            success: { base: 'bg-success text-on-success' },
            warning: { base: 'bg-warning text-on-warning' },
            error: { base: 'bg-error text-on-error' },
            info: { base: 'bg-info text-on-info' },
            surface: { base: 'bg-inverse-surface text-inverse-on-surface' }
        },
        size: {
            '3xs': 'h-[4px] min-w-[4px] text-[4px]',
            '2xs': 'h-[5px] min-w-[5px] text-[5px]',
            xs: 'h-[6px] min-w-[6px] text-[6px]',
            sm: 'h-[7px] min-w-[7px] text-[7px]',
            md: 'h-[8px] min-w-[8px] text-[8px]',
            lg: 'h-[9px] min-w-[9px] text-[9px]',
            xl: 'h-[10px] min-w-[10px] text-[10px]',
            '2xl': 'h-[11px] min-w-[11px] text-[11px]',
            '3xl': 'h-[12px] min-w-[12px] text-[12px]'
        },
        position: {
            'top-right': { base: 'top-0 right-0' },
            'bottom-right': { base: 'bottom-0 right-0' },
            'top-left': { base: 'top-0 left-0' },
            'bottom-left': { base: 'bottom-0 left-0' }
        },
        inset: {
            false: {}
        },
        standalone: {
            true: {},
            false: { base: 'absolute' }
        }
    },
    compoundVariants: [
        {
            position: 'top-right',
            inset: false,
            class: { base: '-translate-y-1/2 translate-x-1/2' }
        },
        {
            position: 'bottom-right',
            inset: false,
            class: { base: 'translate-y-1/2 translate-x-1/2' }
        },
        {
            position: 'top-left',
            inset: false,
            class: { base: '-translate-y-1/2 -translate-x-1/2' }
        },
        {
            position: 'bottom-left',
            inset: false,
            class: { base: 'translate-y-1/2 -translate-x-1/2' }
        }
    ],
    defaultVariants: {
        size: 'md',
        color: 'primary',
        position: 'top-right'
    }
})

export type ChipVariantProps = VariantProps<typeof chipVariants>
export type ChipSlots = keyof ReturnType<typeof chipVariants>

export const chipDefaults = {
    defaultVariants: chipVariants.defaultVariants,
    slots: {} as Partial<Record<ChipSlots, string>>
}
