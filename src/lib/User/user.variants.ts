import { tv, type VariantProps } from 'tailwind-variants'

export const userVariants = tv({
    slots: {
        root: 'relative inline-flex items-center',
        wrapper: 'min-w-0',
        name: 'font-medium text-on-surface truncate',
        description: 'text-on-surface-variant truncate',
        avatar: 'shrink-0'
    },
    variants: {
        size: {
            '3xs': {
                root: 'gap-1',
                wrapper: 'flex items-center gap-1',
                name: 'text-[10px]',
                description: 'text-[10px]'
            },
            '2xs': {
                root: 'gap-1.5',
                wrapper: 'flex items-center gap-1.5',
                name: 'text-[10px]',
                description: 'text-[10px]'
            },
            xs: {
                root: 'gap-1.5',
                wrapper: 'flex items-center gap-1.5',
                name: 'text-xs',
                description: 'text-[10px]'
            },
            sm: {
                root: 'gap-2',
                name: 'text-xs',
                description: 'text-xs'
            },
            md: {
                root: 'gap-2',
                name: 'text-sm',
                description: 'text-xs'
            },
            lg: {
                root: 'gap-2.5',
                name: 'text-sm',
                description: 'text-sm'
            },
            xl: {
                root: 'gap-2.5',
                name: 'text-base',
                description: 'text-sm'
            },
            '2xl': {
                root: 'gap-3',
                name: 'text-base',
                description: 'text-base'
            },
            '3xl': {
                root: 'gap-3',
                name: 'text-lg',
                description: 'text-base'
            }
        },
        orientation: {
            horizontal: {
                root: 'flex-row',
                wrapper: 'text-left'
            },
            vertical: {
                root: 'flex-col text-center',
                wrapper: 'text-center'
            }
        },
        clickable: {
            true: {
                root: 'cursor-pointer hover:bg-surface-container-high rounded-lg transition-colors -m-2 p-2'
            }
        }
    },
    defaultVariants: {
        size: 'md',
        orientation: 'horizontal'
    }
})

export type UserVariantProps = VariantProps<typeof userVariants>
export type UserSlots = keyof ReturnType<typeof userVariants>

export const userDefaults = {
    defaultVariants: userVariants.defaultVariants,
    slots: {} as Partial<Record<UserSlots, string>>
}
