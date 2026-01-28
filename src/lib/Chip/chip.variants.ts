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
            '3xs': { base: 'size-1 text-[4px]' },
            '2xs': { base: 'size-1.5 text-[5px]' },
            xs: { base: 'size-2 text-[6px]' },
            sm: { base: 'size-2.5 text-[7px]' },
            md: { base: 'size-3 text-[8px]' },
            lg: { base: 'size-3.5 text-[9px]' },
            xl: { base: 'size-4 text-[10px]' },
            '2xl': { base: 'size-5 text-[11px]' },
            '3xl': { base: 'size-6 text-[12px]' }
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
        { position: 'top-right', inset: false, class: { base: '-translate-y-1/2 translate-x-1/2' } },
        { position: 'bottom-right', inset: false, class: { base: 'translate-y-1/2 translate-x-1/2' } },
        { position: 'top-left', inset: false, class: { base: '-translate-y-1/2 -translate-x-1/2' } },
        { position: 'bottom-left', inset: false, class: { base: 'translate-y-1/2 -translate-x-1/2' } }
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
