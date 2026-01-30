import { tv, type VariantProps } from 'tailwind-variants'

export const userVariants = tv({
    slots: {
        root: 'inline-flex items-center gap-2',
        wrapper: 'min-w-0',
        name: 'font-medium text-on-surface truncate',
        description: 'text-on-surface-variant truncate',
        avatar: 'shrink-0'
    },
    variants: {
        size: {
            '3xs': {
                name: 'text-[10px]',
                description: 'text-[10px]'
            },
            '2xs': {
                name: 'text-[10px]',
                description: 'text-[10px]'
            },
            xs: {
                name: 'text-xs',
                description: 'text-[10px]'
            },
            sm: {
                name: 'text-xs',
                description: 'text-xs'
            },
            md: {
                name: 'text-sm',
                description: 'text-xs'
            },
            lg: {
                name: 'text-sm',
                description: 'text-sm'
            },
            xl: {
                name: 'text-base',
                description: 'text-sm'
            },
            '2xl': {
                name: 'text-base',
                description: 'text-base'
            },
            '3xl': {
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
