import { tv, type VariantProps } from 'tailwind-variants'

export const tableVariants = tv({
    slots: {
        root: 'relative w-full overflow-x-auto scrollbar-thin rounded-xl border border-outline-variant/50 bg-surface [contain:inline-size]',
        base: 'min-w-full',
        caption: 'sr-only',
        thead: 'relative bg-surface-container-low',
        tbody: [
            '[&>tr]:transition-colors [&>tr]:duration-150',
            '[&>tr]:border-b [&>tr]:border-outline-variant/30',
            '[&>tr:last-child]:border-b-0'
        ],
        tfoot: 'relative bg-surface-container-low border-t border-outline-variant/50',
        tr: 'data-[selected=true]:bg-primary-container/20 data-[pinned-row=true]:bg-surface-container-lowest',
        th: [
            'relative px-4 py-3 text-xs font-semibold uppercase tracking-wider',
            'text-on-surface-variant text-left rtl:text-right',
            '[&:has([role=checkbox])]:pe-0 [&:has([role=checkbox])]:w-12'
        ],
        td: [
            'px-4 py-3.5 text-sm text-on-surface',
            'whitespace-nowrap max-sm:whitespace-normal max-sm:break-words',
            '[&:has([role=checkbox])]:pe-0 [&:has([role=checkbox])]:w-12'
        ],
        separator: 'h-px bg-outline-variant/50',
        empty: 'py-10 text-center text-sm text-on-surface-variant/70',
        loading: 'py-10 text-center'
    },
    variants: {
        pinned: {
            true: {
                th: 'sticky bg-surface-container-low/95 backdrop-blur-sm z-1',
                td: 'sticky bg-surface/95 backdrop-blur-sm z-1'
            }
        },
        hoverable: {
            true: {
                tbody: '[&>tr]:data-[selectable=true]:cursor-pointer [&>tr]:data-[selectable=true]:hover:bg-surface-container/60 [&>tr]:data-[selectable=true]:focus-visible:outline-2 [&>tr]:data-[selectable=true]:focus-visible:outline-primary [&>tr]:data-[selectable=true]:focus-visible:outline-offset-[-2px]'
            }
        },
        sticky: {
            true: {
                thead: 'sticky top-0 inset-x-0 bg-surface-container-low/95 backdrop-blur-sm z-10 rounded-t-xl',
                tfoot: 'sticky bottom-0 inset-x-0 bg-surface-container-low/95 backdrop-blur-sm z-10 rounded-b-xl'
            },
            header: {
                thead: 'sticky top-0 inset-x-0 bg-surface-container-low/95 backdrop-blur-sm z-10 rounded-t-xl'
            },
            footer: {
                tfoot: 'sticky bottom-0 inset-x-0 bg-surface-container-low/95 backdrop-blur-sm z-10 rounded-b-xl'
            }
        },
        striped: {
            true: {
                tbody: '[&>tr:nth-child(even)]:bg-surface-container-lowest/60'
            }
        },
        loading: {
            true: {
                thead: 'after:absolute after:top-0 after:left-0 after:z-20 after:h-0.5 after:rounded-full'
            }
        },
        loadingColor: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
            surface: ''
        },
        loadingAnimation: {
            carousel: '',
            'carousel-inverse': '',
            swing: '',
            elastic: ''
        }
    },
    compoundVariants: [
        // ========== LOADING COLOR ==========
        { loading: true, loadingColor: 'primary', class: { thead: 'after:bg-primary' } },
        { loading: true, loadingColor: 'secondary', class: { thead: 'after:bg-secondary' } },
        { loading: true, loadingColor: 'tertiary', class: { thead: 'after:bg-tertiary' } },
        { loading: true, loadingColor: 'success', class: { thead: 'after:bg-success' } },
        { loading: true, loadingColor: 'warning', class: { thead: 'after:bg-warning' } },
        { loading: true, loadingColor: 'error', class: { thead: 'after:bg-error' } },
        { loading: true, loadingColor: 'info', class: { thead: 'after:bg-info' } },
        { loading: true, loadingColor: 'surface', class: { thead: 'after:bg-on-surface' } },

        // ========== LOADING ANIMATION ==========
        {
            loading: true,
            loadingAnimation: 'carousel',
            class: { thead: 'after:animate-[carousel_2s_ease-in-out_infinite]' }
        },
        {
            loading: true,
            loadingAnimation: 'carousel-inverse',
            class: { thead: 'after:animate-[carousel-inverse_2s_ease-in-out_infinite]' }
        },
        {
            loading: true,
            loadingAnimation: 'swing',
            class: { thead: 'after:animate-[swing_2s_ease-in-out_infinite]' }
        },
        {
            loading: true,
            loadingAnimation: 'elastic',
            class: { thead: 'after:animate-[elastic_2s_ease-in-out_infinite]' }
        }
    ],
    defaultVariants: {
        hoverable: true,
        loadingColor: 'primary',
        loadingAnimation: 'carousel'
    }
})

export type TableVariantProps = VariantProps<typeof tableVariants>
export type TableSlots = keyof ReturnType<typeof tableVariants>

export const tableDefaults = {
    defaultVariants: {
        ...tableVariants.defaultVariants,
        hoverable: true as const,
        loadingColor: 'primary' as const,
        loadingAnimation: 'carousel' as const
    },
    slots: {} as Partial<Record<TableSlots, string>>
}
