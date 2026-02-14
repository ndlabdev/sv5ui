import { tv, type VariantProps } from 'tailwind-variants'

const navButton = [
    'inline-flex items-center justify-center rounded-md',
    'cursor-pointer select-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'hover:bg-surface-container-high text-on-surface-variant'
]

const navIcon = 'shrink-0'

export const paginationVariants = tv({
    slots: {
        root: '',
        list: 'flex items-center gap-1',
        item: [
            'inline-flex items-center justify-center rounded-md font-medium',
            'cursor-pointer select-none transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'hover:bg-surface-container-high text-on-surface'
        ],
        ellipsis:
            'inline-flex items-center justify-center pointer-events-none text-on-surface-variant',
        first: navButton,
        prev: navButton,
        next: navButton,
        last: navButton,
        ellipsisIcon: navIcon,
        firstIcon: navIcon,
        prevIcon: navIcon,
        nextIcon: navIcon,
        lastIcon: navIcon
    },
    variants: {
        activeColor: {
            primary: {
                item: 'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:hover:bg-primary/90'
            },
            secondary: {
                item: 'data-[selected]:bg-secondary data-[selected]:text-on-secondary data-[selected]:hover:bg-secondary/90'
            },
            tertiary: {
                item: 'data-[selected]:bg-tertiary data-[selected]:text-on-tertiary data-[selected]:hover:bg-tertiary/90'
            },
            success: {
                item: 'data-[selected]:bg-success data-[selected]:text-on-success data-[selected]:hover:bg-success/90'
            },
            warning: {
                item: 'data-[selected]:bg-warning data-[selected]:text-on-warning data-[selected]:hover:bg-warning/90'
            },
            error: {
                item: 'data-[selected]:bg-error data-[selected]:text-on-error data-[selected]:hover:bg-error/90'
            },
            info: {
                item: 'data-[selected]:bg-info data-[selected]:text-on-info data-[selected]:hover:bg-info/90'
            },
            surface: {
                item: 'data-[selected]:bg-surface-container-highest data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest/90'
            }
        },
        size: {
            xs: {
                list: 'gap-0.5',
                item: 'size-7 text-xs',
                ellipsis: 'size-7 text-xs',
                first: 'size-7',
                prev: 'size-7',
                next: 'size-7',
                last: 'size-7',
                ellipsisIcon: 'size-3',
                firstIcon: 'size-3',
                prevIcon: 'size-3',
                nextIcon: 'size-3',
                lastIcon: 'size-3'
            },
            sm: {
                list: 'gap-0.5',
                item: 'size-8 text-xs',
                ellipsis: 'size-8 text-xs',
                first: 'size-8',
                prev: 'size-8',
                next: 'size-8',
                last: 'size-8',
                ellipsisIcon: 'size-3.5',
                firstIcon: 'size-3.5',
                prevIcon: 'size-3.5',
                nextIcon: 'size-3.5',
                lastIcon: 'size-3.5'
            },
            md: {
                list: 'gap-1',
                item: 'size-9 text-sm',
                ellipsis: 'size-9 text-sm',
                first: 'size-9',
                prev: 'size-9',
                next: 'size-9',
                last: 'size-9',
                ellipsisIcon: 'size-4',
                firstIcon: 'size-4',
                prevIcon: 'size-4',
                nextIcon: 'size-4',
                lastIcon: 'size-4'
            },
            lg: {
                list: 'gap-1',
                item: 'size-10 text-sm',
                ellipsis: 'size-10 text-sm',
                first: 'size-10',
                prev: 'size-10',
                next: 'size-10',
                last: 'size-10',
                ellipsisIcon: 'size-5',
                firstIcon: 'size-5',
                prevIcon: 'size-5',
                nextIcon: 'size-5',
                lastIcon: 'size-5'
            },
            xl: {
                list: 'gap-1.5',
                item: 'size-11 text-base',
                ellipsis: 'size-11 text-base',
                first: 'size-11',
                prev: 'size-11',
                next: 'size-11',
                last: 'size-11',
                ellipsisIcon: 'size-5',
                firstIcon: 'size-5',
                prevIcon: 'size-5',
                nextIcon: 'size-5',
                lastIcon: 'size-5'
            }
        },
        disabled: {
            true: {
                root: 'opacity-50 pointer-events-none'
            }
        }
    },
    defaultVariants: {
        activeColor: 'primary',
        size: 'md'
    }
})

export type PaginationVariantProps = VariantProps<typeof paginationVariants>
export type PaginationSlots = keyof ReturnType<typeof paginationVariants>

export const paginationDefaults = {
    defaultVariants: paginationVariants.defaultVariants,
    slots: {} as Partial<Record<PaginationSlots, string>>
}
