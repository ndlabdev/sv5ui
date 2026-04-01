import { tv, type VariantProps } from 'tailwind-variants'

export const navigationMenuVariants = tv({
    slots: {
        root: 'relative',
        list: 'flex gap-1',
        item: '',
        link: [
            'group relative flex items-center gap-2 rounded-md font-medium',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            'disabled:cursor-not-allowed disabled:opacity-50'
        ],
        linkLeadingIcon: 'shrink-0',
        linkLeadingAvatar: 'shrink-0',
        linkLabel: 'truncate',
        linkTrailing: 'ms-auto flex items-center gap-1.5',
        linkTrailingBadge: '',
        linkTrailingIcon: 'shrink-0 transition-transform duration-200',
        childList: 'flex flex-col gap-0.5',
        childLink: [
            'group flex items-center gap-2 rounded-md text-sm',
            'text-on-surface-variant transition-colors duration-150',
            'hover:text-on-surface hover:bg-surface-container-high',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        ],
        childLinkIcon: 'shrink-0 size-4 text-on-surface-variant',
        childLinkLabel: 'truncate',
        childLinkDescription: 'text-xs text-on-surface-variant/70 truncate',
        separator: 'h-px bg-outline-variant/40 my-1.5'
    },
    variants: {
        orientation: {
            horizontal: {
                list: 'flex-row items-center',
                link: 'px-3 py-2 text-sm',
                linkLeadingIcon: 'size-4',
                childList: 'p-2 min-w-48',
                childLink: 'px-3 py-2',
                separator: 'w-full'
            },
            vertical: {
                list: 'flex-col w-full',
                link: 'px-3 py-2 text-sm w-full',
                linkLeadingIcon: 'size-5',
                childList: 'ps-6 pt-0.5',
                childLink: 'px-3 py-1.5',
                separator: 'w-full mx-3'
            }
        },
        variant: {
            pill: '',
            link: ''
        },
        color: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
            surface: ''
        },
        active: {
            true: '',
            false: {
                link: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }
        },
        disabled: {
            true: {
                link: 'cursor-not-allowed opacity-50 pointer-events-none'
            }
        },
        collapsed: {
            true: {
                list: 'items-center',
                link: 'justify-center px-2',
                linkLabel: 'sr-only',
                linkTrailing: 'sr-only'
            }
        }
    },
    compoundVariants: [
        // ========== PILL × ACTIVE × COLOR ==========
        {
            variant: 'pill',
            active: true,
            color: 'primary',
            class: { link: 'bg-primary text-on-primary' }
        },
        {
            variant: 'pill',
            active: true,
            color: 'secondary',
            class: { link: 'bg-secondary text-on-secondary' }
        },
        {
            variant: 'pill',
            active: true,
            color: 'tertiary',
            class: { link: 'bg-tertiary text-on-tertiary' }
        },
        {
            variant: 'pill',
            active: true,
            color: 'success',
            class: { link: 'bg-success text-on-success' }
        },
        {
            variant: 'pill',
            active: true,
            color: 'warning',
            class: { link: 'bg-warning text-on-warning' }
        },
        {
            variant: 'pill',
            active: true,
            color: 'error',
            class: { link: 'bg-error text-on-error' }
        },
        { variant: 'pill', active: true, color: 'info', class: { link: 'bg-info text-on-info' } },
        {
            variant: 'pill',
            active: true,
            color: 'surface',
            class: { link: 'bg-surface-container-highest text-on-surface' }
        },

        // ========== LINK × ACTIVE × COLOR (horizontal = bottom border, vertical = left border) ==========
        { variant: 'link', active: true, color: 'primary', class: { link: 'text-primary' } },
        { variant: 'link', active: true, color: 'secondary', class: { link: 'text-secondary' } },
        { variant: 'link', active: true, color: 'tertiary', class: { link: 'text-tertiary' } },
        { variant: 'link', active: true, color: 'success', class: { link: 'text-success' } },
        { variant: 'link', active: true, color: 'warning', class: { link: 'text-warning' } },
        { variant: 'link', active: true, color: 'error', class: { link: 'text-error' } },
        { variant: 'link', active: true, color: 'info', class: { link: 'text-info' } },
        { variant: 'link', active: true, color: 'surface', class: { link: 'text-on-surface' } },

        // ========== LINK × ACTIVE × ORIENTATION (highlight bar position) ==========
        {
            variant: 'link',
            active: true,
            orientation: 'horizontal',
            class: {
                link: 'after:absolute after:bottom-0 after:inset-x-2 after:h-0.5 after:rounded-full after:bg-current'
            }
        },
        {
            variant: 'link',
            active: true,
            orientation: 'vertical',
            class: {
                link: 'after:absolute after:start-0 after:inset-y-1.5 after:w-0.5 after:rounded-full after:bg-current'
            }
        },

        // ========== CHILD LINK ACTIVE ==========
        { variant: 'pill', active: true, class: { childLink: 'bg-primary/10 text-primary' } },
        { variant: 'link', active: true, class: { childLink: 'text-primary' } }
    ],
    defaultVariants: {
        orientation: 'horizontal',
        variant: 'pill',
        color: 'primary',
        active: false,
        collapsed: false
    }
})

export type NavigationMenuVariantProps = VariantProps<typeof navigationMenuVariants>
export type NavigationMenuSlots = keyof ReturnType<typeof navigationMenuVariants>

export const navigationMenuDefaults = {
    defaultVariants: navigationMenuVariants.defaultVariants,
    slots: {} as Partial<Record<NavigationMenuSlots, string>>
}
