import { tv, type VariantProps } from 'tailwind-variants'

export const emptyVariants = tv({
    slots: {
        root: 'relative flex flex-col items-center justify-center gap-4 rounded-lg p-4 sm:p-6 lg:p-8 min-w-0',
        header: 'flex flex-col items-center gap-2 max-w-sm text-center',
        avatar: 'shrink-0 mb-2',
        title: 'text-on-surface text-pretty font-medium',
        description: 'text-balance text-center',
        body: 'flex flex-col items-center gap-4 max-w-sm',
        actions: 'flex flex-wrap justify-center gap-2 shrink-0',
        footer: 'flex flex-col items-center gap-2 max-w-sm'
    },
    variants: {
        size: {
            xs: {
                avatar: 'size-8 text-base',
                title: 'text-sm',
                description: 'text-xs'
            },
            sm: {
                avatar: 'size-9 text-lg',
                title: 'text-sm',
                description: 'text-xs'
            },
            md: {
                avatar: 'size-10 text-xl',
                title: 'text-base',
                description: 'text-sm'
            },
            lg: {
                avatar: 'size-11 text-[22px]',
                title: 'text-base',
                description: 'text-sm'
            },
            xl: {
                avatar: 'size-12 text-2xl',
                title: 'text-lg',
                description: 'text-base'
            }
        },
        variant: {
            solid: {
                root: 'bg-inverse-surface',
                avatar: 'text-inverse-on-surface/70',
                title: 'text-inverse-on-surface',
                description: 'text-inverse-on-surface/80'
            },
            outline: {
                root: 'ring ring-outline-variant',
                description: 'text-on-surface-variant'
            },
            soft: {
                root: 'bg-surface-container-highest/50',
                description: 'text-on-surface-variant'
            },
            subtle: {
                root: 'bg-surface-container-highest/50 ring ring-outline-variant',
                description: 'text-on-surface-variant'
            },
            naked: {
                description: 'text-on-surface-variant'
            }
        }
    },
    defaultVariants: {
        variant: 'outline',
        size: 'md'
    }
})

export type EmptyVariantProps = VariantProps<typeof emptyVariants>
export type EmptySlots = keyof ReturnType<typeof emptyVariants>

export const emptyDefaults = {
    defaultVariants: emptyVariants.defaultVariants,
    slots: {} as Partial<Record<EmptySlots, string>>
}
