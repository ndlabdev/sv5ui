import { tv, type VariantProps } from 'tailwind-variants'

export const selectVariants = tv({
    slots: {
        root: 'relative w-full inline-flex items-center',
        base: [
            'w-full rounded-md border-0 bg-surface text-on-surface',
            'disabled:cursor-not-allowed disabled:opacity-75',
            'transition-colors',
            'focus:outline-none',
            'inline-flex items-center'
        ],
        leading: 'absolute inset-y-0 start-0 flex items-center pointer-events-none',
        leadingIcon: 'shrink-0 text-on-surface-variant/75',
        leadingAvatar: 'shrink-0',
        leadingAvatarSize: '',
        trailing: 'absolute inset-y-0 end-0 flex items-center pointer-events-none',
        trailingIcon: 'shrink-0 text-on-surface-variant/75',
        value: 'truncate',
        placeholder: 'truncate text-on-surface-variant/50',
        content: [
            'z-50 min-w-(--bits-select-anchor-width)',
            'bg-surface-container-low text-on-surface',
            'rounded-md',
            'ring ring-outline-variant/50',
            'shadow-lg',
            'focus:outline-none',
            'overflow-hidden'
        ],
        viewport: 'p-1',
        group: '',
        groupLabel: 'px-2 py-1.5 text-xs font-semibold text-on-surface-variant',
        item: [
            'group relative flex items-center gap-2 w-full rounded-sm px-2 cursor-pointer select-none',
            'focus:outline-none',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'data-[highlighted]:bg-surface-container-highest'
        ],
        itemIcon: 'shrink-0',
        itemAvatar: 'shrink-0',
        itemAvatarSize: '',
        itemLabel: 'flex-1 truncate',
        itemDescription: 'text-on-surface-variant',
        itemIndicator: 'ml-auto shrink-0',
        separator: '-mx-1 my-1 h-px bg-outline-variant'
    },
    variants: {
        variant: {
            outline: '',
            soft: '',
            subtle: '',
            ghost: '',
            none: ''
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
                base: 'px-2 py-1 text-xs rounded',
                leading: 'ps-2',
                leadingIcon: 'size-3.5',
                leadingAvatarSize: '3xs',
                trailing: 'pe-2',
                trailingIcon: 'size-3.5',
                item: 'py-1 text-xs',
                itemIcon: 'size-3',
                itemAvatarSize: '3xs',
                itemIndicator: 'size-3',
                itemDescription: 'text-[10px]',
                groupLabel: 'text-[10px]'
            },
            sm: {
                base: 'px-2.5 py-1.5 text-xs rounded-md',
                leading: 'ps-2.5',
                leadingIcon: 'size-4',
                leadingAvatarSize: '3xs',
                trailing: 'pe-2.5',
                trailingIcon: 'size-4',
                item: 'py-1.5 text-xs',
                itemIcon: 'size-3.5',
                itemAvatarSize: '3xs',
                itemIndicator: 'size-3.5',
                itemDescription: 'text-[11px]',
                groupLabel: 'text-[11px]'
            },
            md: {
                base: 'px-3 py-2 text-sm rounded-md',
                leading: 'ps-3',
                leadingIcon: 'size-5',
                leadingAvatarSize: '2xs',
                trailing: 'pe-3',
                trailingIcon: 'size-5',
                item: 'py-1.5 text-sm',
                itemIcon: 'size-4',
                itemAvatarSize: '2xs',
                itemIndicator: 'size-4',
                itemDescription: 'text-xs'
            },
            lg: {
                base: 'px-4 py-2.5 text-sm rounded-md',
                leading: 'ps-4',
                leadingIcon: 'size-5',
                leadingAvatarSize: '2xs',
                trailing: 'pe-4',
                trailingIcon: 'size-5',
                item: 'py-2 text-sm',
                itemIcon: 'size-5',
                itemAvatarSize: '2xs',
                itemIndicator: 'size-5',
                itemDescription: 'text-xs'
            },
            xl: {
                base: 'px-5 py-3 text-base rounded-lg',
                leading: 'ps-5',
                leadingIcon: 'size-6',
                leadingAvatarSize: 'xs',
                trailing: 'pe-5',
                trailingIcon: 'size-6',
                item: 'py-2.5 text-base',
                itemIcon: 'size-5',
                itemAvatarSize: 'xs',
                itemIndicator: 'size-5',
                itemDescription: 'text-sm'
            }
        },
        leading: {
            true: ''
        },
        trailing: {
            true: ''
        },
        loading: {
            true: ''
        },
        highlight: {
            true: ''
        },
        side: {
            top: {
                content:
                    'data-[state=open]:animate-[slide-in-from-bottom_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-top_100ms_ease-in_reverse]'
            },
            right: {
                content:
                    'data-[state=open]:animate-[slide-in-from-left_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-right_100ms_ease-in_reverse]'
            },
            bottom: {
                content:
                    'data-[state=open]:animate-[slide-in-from-top_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-bottom_100ms_ease-in_reverse]'
            },
            left: {
                content:
                    'data-[state=open]:animate-[slide-in-from-right_150ms_ease-out] data-[state=closed]:animate-[slide-in-from-left_100ms_ease-in_reverse]'
            }
        },
        transition: {
            true: {
                content:
                    'data-[state=open]:animate-[fade-in_150ms_ease-out,scale-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in,scale-out_100ms_ease-in]'
            }
        }
    },
    compoundVariants: [
        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-primary data-[state=open]:ring-2 data-[state=open]:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-secondary data-[state=open]:ring-2 data-[state=open]:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-tertiary data-[state=open]:ring-2 data-[state=open]:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-success data-[state=open]:ring-2 data-[state=open]:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-warning data-[state=open]:ring-2 data-[state=open]:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-error data-[state=open]:ring-2 data-[state=open]:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-info data-[state=open]:ring-2 data-[state=open]:ring-info'
            }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                base: 'ring ring-inset ring-outline-variant focus:ring-2 focus:ring-outline data-[state=open]:ring-2 data-[state=open]:ring-outline'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                base: 'bg-primary-container/50 focus:bg-primary-container/75 focus:ring-2 focus:ring-inset focus:ring-primary data-[state=open]:bg-primary-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-primary'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                base: 'bg-secondary-container/50 focus:bg-secondary-container/75 focus:ring-2 focus:ring-inset focus:ring-secondary data-[state=open]:bg-secondary-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-secondary'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                base: 'bg-tertiary-container/50 focus:bg-tertiary-container/75 focus:ring-2 focus:ring-inset focus:ring-tertiary data-[state=open]:bg-tertiary-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-tertiary'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                base: 'bg-success-container/50 focus:bg-success-container/75 focus:ring-2 focus:ring-inset focus:ring-success data-[state=open]:bg-success-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-success'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                base: 'bg-warning-container/50 focus:bg-warning-container/75 focus:ring-2 focus:ring-inset focus:ring-warning data-[state=open]:bg-warning-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-warning'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                base: 'bg-error-container/50 focus:bg-error-container/75 focus:ring-2 focus:ring-inset focus:ring-error data-[state=open]:bg-error-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-error'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                base: 'bg-info-container/50 focus:bg-info-container/75 focus:ring-2 focus:ring-inset focus:ring-info data-[state=open]:bg-info-container/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-info'
            }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: {
                base: 'bg-surface-container-highest/50 focus:bg-surface-container-highest/75 focus:ring-2 focus:ring-inset focus:ring-outline data-[state=open]:bg-surface-container-highest/75 data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-outline'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                base: 'ring ring-inset ring-primary/25 bg-primary-container/50 focus:ring-2 focus:ring-primary data-[state=open]:ring-2 data-[state=open]:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                base: 'ring ring-inset ring-secondary/25 bg-secondary-container/50 focus:ring-2 focus:ring-secondary data-[state=open]:ring-2 data-[state=open]:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                base: 'ring ring-inset ring-tertiary/25 bg-tertiary-container/50 focus:ring-2 focus:ring-tertiary data-[state=open]:ring-2 data-[state=open]:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                base: 'ring ring-inset ring-success/25 bg-success-container/50 focus:ring-2 focus:ring-success data-[state=open]:ring-2 data-[state=open]:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                base: 'ring ring-inset ring-warning/25 bg-warning-container/50 focus:ring-2 focus:ring-warning data-[state=open]:ring-2 data-[state=open]:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                base: 'ring ring-inset ring-error/25 bg-error-container/50 focus:ring-2 focus:ring-error data-[state=open]:ring-2 data-[state=open]:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                base: 'ring ring-inset ring-info/25 bg-info-container/50 focus:ring-2 focus:ring-info data-[state=open]:ring-2 data-[state=open]:ring-info'
            }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                base: 'ring ring-inset ring-outline-variant bg-surface-container-highest/50 focus:ring-2 focus:ring-outline data-[state=open]:ring-2 data-[state=open]:ring-outline'
            }
        },

        // ========== GHOST VARIANTS ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: {
                base: 'bg-transparent hover:bg-primary-container/50 focus:ring-2 focus:ring-inset focus:ring-primary data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-primary'
            }
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: {
                base: 'bg-transparent hover:bg-secondary-container/50 focus:ring-2 focus:ring-inset focus:ring-secondary data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-secondary'
            }
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: {
                base: 'bg-transparent hover:bg-tertiary-container/50 focus:ring-2 focus:ring-inset focus:ring-tertiary data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-tertiary'
            }
        },
        {
            variant: 'ghost',
            color: 'success',
            class: {
                base: 'bg-transparent hover:bg-success-container/50 focus:ring-2 focus:ring-inset focus:ring-success data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-success'
            }
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: {
                base: 'bg-transparent hover:bg-warning-container/50 focus:ring-2 focus:ring-inset focus:ring-warning data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-warning'
            }
        },
        {
            variant: 'ghost',
            color: 'error',
            class: {
                base: 'bg-transparent hover:bg-error-container/50 focus:ring-2 focus:ring-inset focus:ring-error data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-error'
            }
        },
        {
            variant: 'ghost',
            color: 'info',
            class: {
                base: 'bg-transparent hover:bg-info-container/50 focus:ring-2 focus:ring-inset focus:ring-info data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-info'
            }
        },
        {
            variant: 'ghost',
            color: 'surface',
            class: {
                base: 'bg-transparent hover:bg-surface-container-highest/50 focus:ring-2 focus:ring-inset focus:ring-outline data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-outline'
            }
        },

        // ========== NONE VARIANT ==========
        {
            variant: 'none',
            class: {
                base: 'bg-transparent focus:ring-0'
            }
        },

        // ========== HIGHLIGHT VARIANTS ==========
        {
            highlight: true,
            color: 'primary',
            class: { base: 'ring-2 ring-inset ring-primary' }
        },
        {
            highlight: true,
            color: 'secondary',
            class: { base: 'ring-2 ring-inset ring-secondary' }
        },
        {
            highlight: true,
            color: 'tertiary',
            class: { base: 'ring-2 ring-inset ring-tertiary' }
        },
        {
            highlight: true,
            color: 'success',
            class: { base: 'ring-2 ring-inset ring-success' }
        },
        {
            highlight: true,
            color: 'warning',
            class: { base: 'ring-2 ring-inset ring-warning' }
        },
        {
            highlight: true,
            color: 'error',
            class: { base: 'ring-2 ring-inset ring-error' }
        },
        {
            highlight: true,
            color: 'info',
            class: { base: 'ring-2 ring-inset ring-info' }
        },
        {
            highlight: true,
            color: 'surface',
            class: { base: 'ring-2 ring-inset ring-outline' }
        },

        // ========== LEADING PADDING ADJUSTMENTS ==========
        { leading: true, size: 'xs', class: { base: 'ps-7' } },
        { leading: true, size: 'sm', class: { base: 'ps-8' } },
        { leading: true, size: 'md', class: { base: 'ps-9' } },
        { leading: true, size: 'lg', class: { base: 'ps-10' } },
        { leading: true, size: 'xl', class: { base: 'ps-12' } },

        // ========== TRAILING PADDING ADJUSTMENTS ==========
        { trailing: true, size: 'xs', class: { base: 'pe-7' } },
        { trailing: true, size: 'sm', class: { base: 'pe-8' } },
        { trailing: true, size: 'md', class: { base: 'pe-9' } },
        { trailing: true, size: 'lg', class: { base: 'pe-10' } },
        { trailing: true, size: 'xl', class: { base: 'pe-12' } },

        // ========== LOADING ICON ANIMATION ==========
        {
            loading: true,
            leading: true,
            class: {
                leadingIcon: 'animate-spin'
            }
        },
        {
            loading: true,
            leading: false,
            trailing: true,
            class: {
                trailingIcon: 'animate-spin'
            }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md',
        side: 'bottom',
        transition: true
    }
})

export type SelectVariantProps = VariantProps<typeof selectVariants>
export type SelectSlots = keyof ReturnType<typeof selectVariants>

export const selectDefaults = {
    defaultVariants: selectVariants.defaultVariants,
    slots: {} as Partial<Record<SelectSlots, string>>
}
