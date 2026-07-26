import { tv, type VariantProps } from 'tailwind-variants'

export const treeVariants = tv({
    slots: {
        root: 'relative isolate w-full list-none p-0 m-0 space-y-0.5',
        item: 'group/item space-y-0.5 focus:outline-none focus-visible:outline-none',
        listWithChildren:
            'list-none p-0 m-0 ms-4.5 ps-1.5 border-s border-outline-variant space-y-0.5',
        itemWithChildren: '',
        link: [
            'group/link relative w-full flex items-center text-start rounded-md select-none',
            'text-on-surface transition-colors',
            'cursor-pointer hover:not-data-[selected=true]:not-data-disabled:bg-surface-container',
            'data-[keyboard-focus]:ring-2 data-[keyboard-focus]:ring-inset',
            'data-disabled:cursor-not-allowed data-disabled:opacity-60'
        ],
        linkLeadingIcon: 'shrink-0 text-on-surface-variant',
        linkLabel: 'truncate',
        linkTrailing: 'ms-auto inline-flex items-center',
        linkTrailingIcon: [
            'shrink-0 text-on-surface-variant transition-transform duration-200',
            'group-data-[expanded=true]/link:rotate-180'
        ]
    },
    variants: {
        color: {
            primary: {
                link: [
                    'data-[keyboard-focus]:ring-primary',
                    'data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-primary'
            },
            secondary: {
                link: [
                    'data-[keyboard-focus]:ring-secondary',
                    'data-[selected=true]:bg-secondary/10 data-[selected=true]:text-secondary'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-secondary'
            },
            tertiary: {
                link: [
                    'data-[keyboard-focus]:ring-tertiary',
                    'data-[selected=true]:bg-tertiary/10 data-[selected=true]:text-tertiary'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-tertiary'
            },
            success: {
                link: [
                    'data-[keyboard-focus]:ring-success',
                    'data-[selected=true]:bg-success/10 data-[selected=true]:text-success'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-success'
            },
            warning: {
                link: [
                    'data-[keyboard-focus]:ring-warning',
                    'data-[selected=true]:bg-warning/10 data-[selected=true]:text-warning'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-warning'
            },
            error: {
                link: [
                    'data-[keyboard-focus]:ring-error',
                    'data-[selected=true]:bg-error/10 data-[selected=true]:text-error'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-error'
            },
            info: {
                link: [
                    'data-[keyboard-focus]:ring-info',
                    'data-[selected=true]:bg-info/10 data-[selected=true]:text-info'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-info'
            },
            surface: {
                link: [
                    'data-[keyboard-focus]:ring-outline',
                    'data-[selected=true]:bg-surface-container-highest data-[selected=true]:text-on-surface'
                ],
                linkLeadingIcon: 'group-data-[selected=true]/link:text-on-surface'
            }
        },
        size: {
            xs: {
                link: 'px-2 py-1 text-xs gap-1',
                linkLeadingIcon: 'size-3.5',
                linkTrailingIcon: 'size-3.5'
            },
            sm: {
                link: 'px-2 py-1.5 text-xs gap-1.5',
                linkLeadingIcon: 'size-4',
                linkTrailingIcon: 'size-4'
            },
            md: {
                link: 'px-2.5 py-1.5 text-sm gap-1.5',
                linkLeadingIcon: 'size-5',
                linkTrailingIcon: 'size-5'
            },
            lg: {
                link: 'px-3 py-2 text-sm gap-2',
                linkLeadingIcon: 'size-5',
                linkTrailingIcon: 'size-5'
            },
            xl: {
                link: 'px-3 py-2 text-base gap-2',
                linkLeadingIcon: 'size-6',
                linkTrailingIcon: 'size-6'
            }
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'md'
    }
})

export type TreeVariantProps = VariantProps<typeof treeVariants>
export type TreeSlots = keyof ReturnType<typeof treeVariants>

export const treeDefaults = {
    defaultVariants: treeVariants.defaultVariants,
    slots: {} as Partial<Record<TreeSlots, string>>
}
