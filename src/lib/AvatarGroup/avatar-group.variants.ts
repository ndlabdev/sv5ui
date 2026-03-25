import { tv, type VariantProps } from 'tailwind-variants'

export const avatarGroupVariants = tv({
    slots: {
        root: 'inline-flex flex-row-reverse justify-end',
        base: 'relative ring-surface first:me-0'
    },
    variants: {
        size: {
            '3xs': { base: 'ring -me-0.5' },
            '2xs': { base: 'ring -me-0.5' },
            xs: { base: 'ring -me-0.5' },
            sm: { base: 'ring-2 -me-1.5' },
            md: { base: 'ring-2 -me-1.5' },
            lg: { base: 'ring-2 -me-1.5' },
            xl: { base: 'ring-3 -me-2' },
            '2xl': { base: 'ring-3 -me-2' },
            '3xl': { base: 'ring-3 -me-2' }
        },
        rounded: {
            full: { base: 'rounded-full' },
            lg: { base: 'rounded-lg' },
            md: { base: 'rounded-md' },
            sm: { base: 'rounded-sm' },
            none: { base: 'rounded-none' }
        }
    },
    defaultVariants: {
        size: 'md',
        rounded: 'full'
    }
})

export type AvatarGroupVariantProps = VariantProps<typeof avatarGroupVariants>
export type AvatarGroupSlots = keyof ReturnType<typeof avatarGroupVariants>

export const avatarGroupDefaults = {
    defaultVariants: avatarGroupVariants.defaultVariants,
    slots: {} as Partial<Record<AvatarGroupSlots, string>>
}
