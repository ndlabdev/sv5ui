import { tv, type VariantProps } from 'tailwind-variants'

export const skeletonVariants = tv({
    slots: {
        root: 'animate-pulse rounded-md bg-surface-container-highest'
    },
    variants: {},
    defaultVariants: {}
})

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>
export type SkeletonSlots = keyof ReturnType<typeof skeletonVariants>

export const skeletonDefaults = {
    defaultVariants: skeletonVariants.defaultVariants,
    slots: {} as Partial<Record<SkeletonSlots, string>>
}
