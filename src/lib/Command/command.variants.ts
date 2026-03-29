import { tv, type VariantProps } from 'tailwind-variants'

export const commandVariants = tv({
    slots: {
        root: 'flex flex-col overflow-hidden',
        input: 'flex h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-on-surface-variant/50 disabled:cursor-not-allowed disabled:opacity-50',
        list: 'scroll-py-1 overflow-y-auto overflow-x-hidden',
        empty: 'py-6 text-center text-sm text-on-surface-variant',
        loading: 'py-6 text-center text-sm text-on-surface-variant',
        group: 'overflow-hidden p-1',
        groupHeading: 'px-2 py-1.5 text-xs font-semibold text-on-surface-variant',
        groupItems: '',
        separator: '-mx-1 h-px bg-outline-variant',
        item: 'relative flex w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:bg-surface-container-highest',
        itemIcon: 'size-4 shrink-0',
        itemLabel: 'truncate',
        itemDescription: 'truncate text-xs text-on-surface-variant',
        itemTrailing: 'ms-auto flex items-center gap-1'
    },
    variants: {
        size: {
            xs: {
                input: 'h-9 text-xs px-2',
                item: 'px-1.5 py-1 text-xs gap-1.5',
                itemIcon: 'size-3.5',
                groupHeading: 'px-1.5 py-1 text-[10px]',
                empty: 'py-4 text-xs',
                loading: 'py-4 text-xs'
            },
            sm: {
                input: 'h-10 text-xs px-2.5',
                item: 'px-1.5 py-1 text-xs gap-1.5',
                itemIcon: 'size-4',
                groupHeading: 'px-1.5 py-1 text-[10px]',
                empty: 'py-5 text-xs',
                loading: 'py-5 text-xs'
            },
            md: {
                input: 'h-12 text-sm px-3',
                item: 'px-2 py-1.5 text-sm gap-2',
                itemIcon: 'size-4',
                groupHeading: 'px-2 py-1.5 text-xs',
                empty: 'py-6 text-sm',
                loading: 'py-6 text-sm'
            },
            lg: {
                input: 'h-13 text-sm px-3.5',
                item: 'px-2.5 py-2 text-sm gap-2',
                itemIcon: 'size-5',
                groupHeading: 'px-2.5 py-2 text-xs',
                empty: 'py-7 text-sm',
                loading: 'py-7 text-sm'
            },
            xl: {
                input: 'h-14 text-base px-4',
                item: 'px-3 py-2 text-base gap-2.5',
                itemIcon: 'size-5',
                groupHeading: 'px-3 py-2 text-sm',
                empty: 'py-8 text-base',
                loading: 'py-8 text-base'
            }
        }
    },
    defaultVariants: {
        size: 'md'
    }
})

export type CommandVariantProps = VariantProps<typeof commandVariants>
export type CommandSlots = keyof ReturnType<typeof commandVariants>

export const commandDefaults = {
    defaultVariants: {
        size: 'md' as NonNullable<CommandVariantProps['size']>
    },
    slots: {} as Partial<Record<CommandSlots, string>>
}
