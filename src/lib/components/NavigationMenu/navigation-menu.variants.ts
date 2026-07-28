import { tv, type VariantProps } from 'tailwind-variants'

export const navigationMenuVariants = tv({
    slots: {
        root: 'relative',
        list: 'relative isolate min-w-0',
        highlight: 'absolute z-0 rounded-full transition-all duration-200',
        item: 'min-w-0',
        label: 'w-full flex items-center gap-1.5 px-2.5 pt-3 pb-1 font-semibold text-xs uppercase tracking-wider text-on-surface-variant',
        separator: 'shrink-0 bg-outline-variant',
        link: [
            'group relative w-full flex items-center gap-1.5 font-medium text-sm rounded-md',
            'text-on-surface-variant',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
            'data-disabled:cursor-not-allowed data-disabled:opacity-60'
        ],
        linkLeadingIcon: 'shrink-0',
        linkLeadingAvatar: 'shrink-0',
        linkLabel: 'truncate',
        linkLabelExternalIcon: 'size-3.5 shrink-0 text-on-surface-variant/70',
        linkTrailing: 'ms-auto inline-flex items-center gap-1.5',
        linkTrailingBadge: 'shrink-0',
        linkTrailingIcon: 'size-5 shrink-0 transform transition-transform duration-200',
        childList: 'grid gap-0.5 p-2',
        childLabel: 'font-semibold text-xs text-on-surface-variant px-2 py-1.5',
        childItem: 'min-w-0',
        childLink: [
            'group relative w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg',
            'text-sm text-on-surface-variant',
            'transition-colors hover:bg-surface-container-high hover:text-on-surface',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
            'data-[active]:bg-surface-container-high data-[active]:text-on-surface'
        ],
        childLinkWrapper: 'min-w-0 flex flex-col gap-0.5',
        childLinkIcon: 'size-5 shrink-0 mt-0.5 text-on-surface-variant group-hover:text-primary',
        childLinkLabel: 'font-medium text-on-surface truncate',
        childLinkDescription: 'text-xs text-on-surface-variant/80 line-clamp-2',
        childGroup: 'min-w-0',
        childGroupLabel:
            'px-2.5 pt-1 pb-1.5 font-semibold text-xs uppercase tracking-wider text-on-surface-variant',
        childGroupList: 'grid gap-0.5',
        linkBadgeDot: 'absolute top-1 end-1 size-2 rounded-full bg-error ring-2 ring-surface',
        content: [
            'top-0 left-0 w-full sm:absolute sm:w-auto',
            'data-[motion=from-start]:animate-[nav-from-start_250ms_ease]',
            'data-[motion=from-end]:animate-[nav-from-end_250ms_ease]',
            'data-[motion=to-start]:animate-[nav-to-start_250ms_ease]',
            'data-[motion=to-end]:animate-[nav-to-end_250ms_ease]'
        ],
        viewportWrapper:
            'absolute top-full left-0 z-50 flex w-full justify-start pt-1.5 [perspective:2000px]',
        viewport: [
            'relative h-(--bits-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden sm:w-(--bits-navigation-menu-viewport-width)',
            'rounded-xl border border-outline-variant bg-surface-container-low shadow-lg',
            'transition-[width,height] duration-200',
            'data-[state=open]:animate-[nav-scale-in_200ms_ease]',
            'data-[state=closed]:animate-[nav-scale-out_200ms_ease]'
        ],
        indicator: [
            'top-full z-50 flex h-2 items-end justify-center overflow-hidden',
            'data-[state=visible]:animate-[fade-in_150ms_ease]',
            'data-[state=hidden]:animate-[fade-out_150ms_ease]'
        ],
        arrow: 'relative top-[60%] size-2 rotate-45 rounded-tl-sm border-t border-l border-outline-variant bg-surface-container-low',
        toggle: '',
        childTrigger:
            'group ms-auto inline-flex items-center justify-center transition-transform duration-200'
    },
    variants: {
        variant: {
            pill: '',
            link: ''
        },
        color: {
            primary: { highlight: 'bg-primary' },
            secondary: { highlight: 'bg-secondary' },
            tertiary: { highlight: 'bg-tertiary' },
            success: { highlight: 'bg-success' },
            warning: { highlight: 'bg-warning' },
            error: { highlight: 'bg-error' },
            info: { highlight: 'bg-info' },
            surface: { highlight: 'bg-on-surface-variant' }
        },
        orientation: {
            horizontal: {
                root: 'w-full',
                list: 'flex items-center gap-1 overflow-x-auto scrollbar-thin',
                separator: 'mx-1 h-5 w-px self-center',
                highlight: 'bottom-0 h-0.5'
            },
            vertical: {
                root: 'w-full',
                list: 'flex flex-col gap-0.5',
                item: 'flex flex-col',
                separator: 'my-1 h-px w-full',
                childList: 'ms-3.5 mt-0.5 gap-0.5 border-s border-outline-variant p-0 ps-2',
                highlight: 'start-0 w-0.5'
            }
        },
        highlight: {
            true: '',
            false: ''
        },
        collapsed: {
            true: {
                link: 'justify-center',
                linkLabel: 'sr-only',
                linkTrailing: 'hidden'
            },
            false: ''
        },
        contentOrientation: {
            horizontal: {},
            vertical: {}
        },
        disabled: {
            true: '',
            false: ''
        }
    },
    compoundVariants: [
        {
            orientation: 'horizontal',
            class: {
                item: 'shrink-0',
                link: 'w-auto px-2.5 py-1.5',
                label: 'w-auto shrink-0 whitespace-nowrap',
                childList: 'min-w-60'
            }
        },
        {
            orientation: 'horizontal',
            contentOrientation: 'horizontal',
            class: { childList: 'sm:w-128 sm:grid-cols-2' }
        },
        {
            orientation: 'vertical',
            class: { link: 'px-2.5 py-1.5' }
        },
        {
            variant: 'pill',
            class: {
                link: 'hover:bg-surface-container-high hover:text-on-surface data-[state=open]:bg-surface-container-high'
            }
        },
        {
            variant: 'link',
            class: {
                link: 'hover:text-on-surface data-[state=open]:text-on-surface'
            }
        },
        {
            variant: 'pill',
            color: 'primary',
            class: {
                link: 'data-[active]:bg-primary-container data-[active]:text-on-primary-container focus-visible:ring-primary'
            }
        },
        {
            variant: 'pill',
            color: 'secondary',
            class: {
                link: 'data-[active]:bg-secondary-container data-[active]:text-on-secondary-container focus-visible:ring-secondary'
            }
        },
        {
            variant: 'pill',
            color: 'tertiary',
            class: {
                link: 'data-[active]:bg-tertiary-container data-[active]:text-on-tertiary-container focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'pill',
            color: 'success',
            class: {
                link: 'data-[active]:bg-success-container data-[active]:text-on-success-container focus-visible:ring-success'
            }
        },
        {
            variant: 'pill',
            color: 'warning',
            class: {
                link: 'data-[active]:bg-warning-container data-[active]:text-on-warning-container focus-visible:ring-warning'
            }
        },
        {
            variant: 'pill',
            color: 'error',
            class: {
                link: 'data-[active]:bg-error-container data-[active]:text-on-error-container focus-visible:ring-error'
            }
        },
        {
            variant: 'pill',
            color: 'info',
            class: {
                link: 'data-[active]:bg-info-container data-[active]:text-on-info-container focus-visible:ring-info'
            }
        },
        {
            variant: 'pill',
            color: 'surface',
            class: {
                link: 'data-[active]:bg-surface-container-high data-[active]:text-on-surface focus-visible:ring-outline'
            }
        },
        {
            variant: 'link',
            color: 'primary',
            class: { link: 'data-[active]:text-primary focus-visible:ring-primary' }
        },
        {
            variant: 'link',
            color: 'secondary',
            class: { link: 'data-[active]:text-secondary focus-visible:ring-secondary' }
        },
        {
            variant: 'link',
            color: 'tertiary',
            class: { link: 'data-[active]:text-tertiary focus-visible:ring-tertiary' }
        },
        {
            variant: 'link',
            color: 'success',
            class: { link: 'data-[active]:text-success focus-visible:ring-success' }
        },
        {
            variant: 'link',
            color: 'warning',
            class: { link: 'data-[active]:text-warning focus-visible:ring-warning' }
        },
        {
            variant: 'link',
            color: 'error',
            class: { link: 'data-[active]:text-error focus-visible:ring-error' }
        },
        {
            variant: 'link',
            color: 'info',
            class: { link: 'data-[active]:text-info focus-visible:ring-info' }
        },
        {
            variant: 'link',
            color: 'surface',
            class: { link: 'data-[active]:text-on-surface focus-visible:ring-outline' }
        }
    ],
    defaultVariants: {
        variant: 'pill',
        color: 'primary',
        orientation: 'horizontal',
        highlight: false,
        collapsed: false,
        contentOrientation: 'horizontal',
        disabled: false
    }
})

export type NavigationMenuVariantProps = VariantProps<typeof navigationMenuVariants>
export type NavigationMenuSlots = keyof ReturnType<typeof navigationMenuVariants>

export const navigationMenuDefaults = {
    defaultVariants: navigationMenuVariants.defaultVariants,
    slots: {} as Partial<Record<NavigationMenuSlots, string>>
}
