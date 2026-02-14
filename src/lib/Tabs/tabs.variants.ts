import { tv, type VariantProps } from 'tailwind-variants'

export const tabsVariants = tv({
    slots: {
        root: 'flex w-full',
        list: 'relative inline-flex items-center shrink-0',
        indicator: 'absolute transition-all duration-200',
        trigger: [
            'relative inline-flex items-center justify-center whitespace-nowrap',
            'font-medium cursor-pointer select-none',
            'focus-visible:outline-none focus-visible:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            'transition-colors'
        ],
        leadingIcon: 'shrink-0',
        label: 'truncate',
        content: 'focus:outline-none'
    },
    variants: {
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
        size: {
            xs: {
                trigger: 'px-2 py-1 text-xs gap-1',
                leadingIcon: 'size-3'
            },
            sm: {
                trigger: 'px-2.5 py-1.5 text-xs gap-1.5',
                leadingIcon: 'size-3.5'
            },
            md: {
                trigger: 'px-3 py-1.5 text-sm gap-1.5',
                leadingIcon: 'size-4'
            },
            lg: {
                trigger: 'px-3 py-2 text-sm gap-2',
                leadingIcon: 'size-5'
            },
            xl: {
                trigger: 'px-3 py-2 text-base gap-2',
                leadingIcon: 'size-5'
            }
        },
        orientation: {
            horizontal: {
                root: 'flex-col',
                list: 'flex-row',
                trigger: 'flex-1',
                content: 'mt-2'
            },
            vertical: {
                root: 'flex-row gap-2',
                list: 'flex-col',
                content: 'flex-1 min-w-0'
            }
        }
    },
    compoundVariants: [
        // ========== PILL + ORIENTATION ==========
        {
            variant: 'pill',
            orientation: 'horizontal',
            class: {
                list: 'bg-surface-container rounded-lg p-1',
                trigger: 'rounded-md z-[1]',
                indicator: 'rounded-md shadow-sm inset-y-1'
            }
        },
        {
            variant: 'pill',
            orientation: 'vertical',
            class: {
                list: 'bg-surface-container rounded-lg p-1',
                trigger: 'rounded-md z-[1] justify-start',
                indicator: 'rounded-md shadow-sm inset-x-1'
            }
        },

        // ========== LINK + ORIENTATION ==========
        {
            variant: 'link',
            orientation: 'horizontal',
            class: {
                list: 'border-b border-outline-variant',
                indicator: '-bottom-px h-0.5 rounded-full'
            }
        },
        {
            variant: 'link',
            orientation: 'vertical',
            class: {
                list: 'border-e border-outline-variant',
                trigger: 'justify-start',
                indicator: '-end-px w-0.5 rounded-full'
            }
        },

        // ========== PILL + COLOR ==========
        {
            variant: 'pill',
            color: 'primary',
            class: {
                indicator: 'bg-primary',
                trigger: 'data-[state=active]:text-on-primary focus-visible:ring-primary'
            }
        },
        {
            variant: 'pill',
            color: 'secondary',
            class: {
                indicator: 'bg-secondary',
                trigger: 'data-[state=active]:text-on-secondary focus-visible:ring-secondary'
            }
        },
        {
            variant: 'pill',
            color: 'tertiary',
            class: {
                indicator: 'bg-tertiary',
                trigger: 'data-[state=active]:text-on-tertiary focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'pill',
            color: 'success',
            class: {
                indicator: 'bg-success',
                trigger: 'data-[state=active]:text-on-success focus-visible:ring-success'
            }
        },
        {
            variant: 'pill',
            color: 'warning',
            class: {
                indicator: 'bg-warning',
                trigger: 'data-[state=active]:text-on-warning focus-visible:ring-warning'
            }
        },
        {
            variant: 'pill',
            color: 'error',
            class: {
                indicator: 'bg-error',
                trigger: 'data-[state=active]:text-on-error focus-visible:ring-error'
            }
        },
        {
            variant: 'pill',
            color: 'info',
            class: {
                indicator: 'bg-info',
                trigger: 'data-[state=active]:text-on-info focus-visible:ring-info'
            }
        },
        {
            variant: 'pill',
            color: 'surface',
            class: {
                indicator: 'bg-surface-container-lowest shadow-sm',
                trigger: 'data-[state=active]:text-on-surface focus-visible:ring-outline'
            }
        },

        // ========== LINK + COLOR ==========
        {
            variant: 'link',
            color: 'primary',
            class: {
                indicator: 'bg-primary',
                trigger: 'data-[state=active]:text-primary focus-visible:ring-primary'
            }
        },
        {
            variant: 'link',
            color: 'secondary',
            class: {
                indicator: 'bg-secondary',
                trigger: 'data-[state=active]:text-secondary focus-visible:ring-secondary'
            }
        },
        {
            variant: 'link',
            color: 'tertiary',
            class: {
                indicator: 'bg-tertiary',
                trigger: 'data-[state=active]:text-tertiary focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'link',
            color: 'success',
            class: {
                indicator: 'bg-success',
                trigger: 'data-[state=active]:text-success focus-visible:ring-success'
            }
        },
        {
            variant: 'link',
            color: 'warning',
            class: {
                indicator: 'bg-warning',
                trigger: 'data-[state=active]:text-warning focus-visible:ring-warning'
            }
        },
        {
            variant: 'link',
            color: 'error',
            class: {
                indicator: 'bg-error',
                trigger: 'data-[state=active]:text-error focus-visible:ring-error'
            }
        },
        {
            variant: 'link',
            color: 'info',
            class: {
                indicator: 'bg-info',
                trigger: 'data-[state=active]:text-info focus-visible:ring-info'
            }
        },
        {
            variant: 'link',
            color: 'surface',
            class: {
                indicator: 'bg-on-surface-variant',
                trigger: 'data-[state=active]:text-on-surface focus-visible:ring-outline'
            }
        }
    ],
    defaultVariants: {
        variant: 'pill',
        color: 'primary',
        size: 'md',
        orientation: 'horizontal'
    }
})

export type TabsVariantProps = VariantProps<typeof tabsVariants>
export type TabsSlots = keyof ReturnType<typeof tabsVariants>

export const tabsDefaults = {
    defaultVariants: tabsVariants.defaultVariants,
    slots: {} as Partial<Record<TabsSlots, string>>
}
