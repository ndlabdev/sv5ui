import { tv, type VariantProps } from 'tailwind-variants'

const navIcon = 'shrink-0'

export const activeVariantColorClasses: Record<string, Record<string, string>> = {
    solid: {
        primary:
            'data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:hover:bg-primary/90',
        secondary:
            'data-[selected]:bg-secondary data-[selected]:text-on-secondary data-[selected]:hover:bg-secondary/90',
        tertiary:
            'data-[selected]:bg-tertiary data-[selected]:text-on-tertiary data-[selected]:hover:bg-tertiary/90',
        success:
            'data-[selected]:bg-success data-[selected]:text-on-success data-[selected]:hover:bg-success/90',
        warning:
            'data-[selected]:bg-warning data-[selected]:text-on-warning data-[selected]:hover:bg-warning/90',
        error: 'data-[selected]:bg-error data-[selected]:text-on-error data-[selected]:hover:bg-error/90',
        info: 'data-[selected]:bg-info data-[selected]:text-on-info data-[selected]:hover:bg-info/90',
        surface:
            'data-[selected]:bg-surface-container-highest data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest/90'
    },
    outline: {
        primary:
            'data-[selected]:ring-2 data-[selected]:ring-primary data-[selected]:text-primary data-[selected]:hover:bg-primary/10',
        secondary:
            'data-[selected]:ring-2 data-[selected]:ring-secondary data-[selected]:text-secondary data-[selected]:hover:bg-secondary/10',
        tertiary:
            'data-[selected]:ring-2 data-[selected]:ring-tertiary data-[selected]:text-tertiary data-[selected]:hover:bg-tertiary/10',
        success:
            'data-[selected]:ring-2 data-[selected]:ring-success data-[selected]:text-success data-[selected]:hover:bg-success/10',
        warning:
            'data-[selected]:ring-2 data-[selected]:ring-warning data-[selected]:text-warning data-[selected]:hover:bg-warning/10',
        error: 'data-[selected]:ring-2 data-[selected]:ring-error data-[selected]:text-error data-[selected]:hover:bg-error/10',
        info: 'data-[selected]:ring-2 data-[selected]:ring-info data-[selected]:text-info data-[selected]:hover:bg-info/10',
        surface:
            'data-[selected]:ring-2 data-[selected]:ring-outline-variant data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest'
    },
    soft: {
        primary:
            'data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:hover:bg-primary-container/90',
        secondary:
            'data-[selected]:bg-secondary-container data-[selected]:text-on-secondary-container data-[selected]:hover:bg-secondary-container/90',
        tertiary:
            'data-[selected]:bg-tertiary-container data-[selected]:text-on-tertiary-container data-[selected]:hover:bg-tertiary-container/90',
        success:
            'data-[selected]:bg-success-container data-[selected]:text-on-success-container data-[selected]:hover:bg-success-container/90',
        warning:
            'data-[selected]:bg-warning-container data-[selected]:text-on-warning-container data-[selected]:hover:bg-warning-container/90',
        error: 'data-[selected]:bg-error-container data-[selected]:text-on-error-container data-[selected]:hover:bg-error-container/90',
        info: 'data-[selected]:bg-info-container data-[selected]:text-on-info-container data-[selected]:hover:bg-info-container/90',
        surface:
            'data-[selected]:bg-surface-container-highest data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest/90'
    },
    subtle: {
        primary:
            'data-[selected]:bg-primary-container/50 data-[selected]:text-primary data-[selected]:hover:bg-primary-container/70',
        secondary:
            'data-[selected]:bg-secondary-container/50 data-[selected]:text-secondary data-[selected]:hover:bg-secondary-container/70',
        tertiary:
            'data-[selected]:bg-tertiary-container/50 data-[selected]:text-tertiary data-[selected]:hover:bg-tertiary-container/70',
        success:
            'data-[selected]:bg-success-container/50 data-[selected]:text-success data-[selected]:hover:bg-success-container/70',
        warning:
            'data-[selected]:bg-warning-container/50 data-[selected]:text-warning data-[selected]:hover:bg-warning-container/70',
        error: 'data-[selected]:bg-error-container/50 data-[selected]:text-error data-[selected]:hover:bg-error-container/70',
        info: 'data-[selected]:bg-info-container/50 data-[selected]:text-info data-[selected]:hover:bg-info-container/70',
        surface:
            'data-[selected]:bg-surface-container-highest/50 data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest/70'
    },
    ghost: {
        primary:
            'data-[selected]:text-primary data-[selected]:hover:bg-primary/10',
        secondary:
            'data-[selected]:text-secondary data-[selected]:hover:bg-secondary/10',
        tertiary:
            'data-[selected]:text-tertiary data-[selected]:hover:bg-tertiary/10',
        success:
            'data-[selected]:text-success data-[selected]:hover:bg-success/10',
        warning:
            'data-[selected]:text-warning data-[selected]:hover:bg-warning/10',
        error: 'data-[selected]:text-error data-[selected]:hover:bg-error/10',
        info: 'data-[selected]:text-info data-[selected]:hover:bg-info/10',
        surface:
            'data-[selected]:text-on-surface data-[selected]:hover:bg-surface-container-highest'
    }
}


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
        first: '',
        prev: '',
        next: '',
        last: '',
        ellipsisIcon: navIcon,
        firstIcon: navIcon,
        prevIcon: navIcon,
        nextIcon: navIcon,
        lastIcon: navIcon
    },
    variants: {
        size: {
            xs: {
                list: 'gap-0.5',
                item: 'size-7 text-xs',
                ellipsis: 'size-7 text-xs',
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
        size: 'md'
    }
})

export type PaginationVariantProps = VariantProps<typeof paginationVariants>
export type PaginationSlots = keyof ReturnType<typeof paginationVariants>

export const paginationDefaults = {
    defaultVariants: {
        ...paginationVariants.defaultVariants,
        variant: 'ghost' as const,
        color: 'surface' as const,
        activeColor: 'primary' as const,
        activeVariant: 'solid' as const
    },
    slots: {} as Partial<Record<PaginationSlots, string>>
}
