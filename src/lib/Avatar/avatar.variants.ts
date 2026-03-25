import { tv, type VariantProps } from 'tailwind-variants'

export const avatarVariants = tv({
    slots: {
        root: 'relative inline-flex items-center justify-center shrink-0 select-none align-middle bg-surface-container-highest',
        image: 'h-full w-full rounded-[inherit] object-cover',
        fallback: 'font-medium leading-none truncate text-on-surface-variant',
        icon: 'text-on-surface-variant',
        status: 'absolute block rounded-full ring-2 ring-surface'
    },
    variants: {
        size: {
            '3xs': {
                root: 'size-4 text-[8px]',
                icon: 'size-2.5',
                status: 'size-1.5'
            },
            '2xs': {
                root: 'size-5 text-[10px]',
                icon: 'size-3',
                status: 'size-1.5'
            },
            xs: {
                root: 'size-6 text-xs',
                icon: 'size-3.5',
                status: 'size-2'
            },
            sm: {
                root: 'size-7 text-sm',
                icon: 'size-4',
                status: 'size-2'
            },
            md: {
                root: 'size-8 text-base',
                icon: 'size-5',
                status: 'size-2.5'
            },
            lg: {
                root: 'size-9 text-lg',
                icon: 'size-5',
                status: 'size-2.5'
            },
            xl: {
                root: 'size-10 text-xl',
                icon: 'size-6',
                status: 'size-3'
            },
            '2xl': {
                root: 'size-11 text-[22px]',
                icon: 'size-7',
                status: 'size-3'
            },
            '3xl': {
                root: 'size-12 text-2xl',
                icon: 'size-8',
                status: 'size-3.5'
            }
        },
        rounded: {
            full: { root: 'rounded-full' },
            lg: { root: 'rounded-lg' },
            md: { root: 'rounded-md' },
            sm: { root: 'rounded-sm' },
            none: { root: 'rounded-none' }
        },
        statusPosition: {
            'top-right': { status: 'top-0 right-0' },
            'top-left': { status: 'top-0 left-0' },
            'bottom-right': { status: 'bottom-0 right-0' },
            'bottom-left': { status: 'bottom-0 left-0' }
        }
    },
    defaultVariants: {
        size: 'md',
        rounded: 'full',
        statusPosition: 'bottom-right'
    }
})

export type AvatarVariantProps = VariantProps<typeof avatarVariants>
export type AvatarSize = NonNullable<AvatarVariantProps['size']>
export type AvatarSlots = keyof ReturnType<typeof avatarVariants>

/** Tailwind size-4 through size-12 → (4 + index) × 4 pixels */
export const avatarSizePx = Object.fromEntries(
    (Object.keys(avatarVariants.variants.size) as AvatarSize[]).map((key, i) => [key, (4 + i) * 4])
) as Record<AvatarSize, number>

export const avatarDefaults = {
    defaultVariants: avatarVariants.defaultVariants,
    slots: {} as Partial<Record<AvatarSlots, string>>
}
