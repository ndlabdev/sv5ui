import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
    slots: {
        base: [
            'rounded-md font-medium inline-flex items-center justify-center',
            'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
            'disabled:opacity-75 aria-disabled:opacity-75',
            'transition-colors'
        ],
        label: 'truncate',
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0',
        leadingAvatarSize: '',
        trailingIcon: 'shrink-0'
    },
    variants: {
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: '',
            ghost: '',
            link: ''
        },
        color: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: ''
        },
        size: {
            xs: {
                base: 'px-2 py-1 text-xs gap-1 rounded',
                leadingIcon: 'size-3.5',
                leadingAvatarSize: '3xs',
                trailingIcon: 'size-3.5'
            },
            sm: {
                base: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-md',
                leadingIcon: 'size-4',
                leadingAvatarSize: '3xs',
                trailingIcon: 'size-4'
            },
            md: {
                base: 'px-3 py-2 text-sm gap-1.5 rounded-md',
                leadingIcon: 'size-5',
                leadingAvatarSize: '2xs',
                trailingIcon: 'size-5'
            },
            lg: {
                base: 'px-4 py-2.5 text-sm gap-2 rounded-md',
                leadingIcon: 'size-5',
                leadingAvatarSize: '2xs',
                trailingIcon: 'size-5'
            },
            xl: {
                base: 'px-5 py-3 text-base gap-2.5 rounded-lg',
                leadingIcon: 'size-6',
                leadingAvatarSize: 'xs',
                trailingIcon: 'size-6'
            }
        },
        block: {
            true: {
                base: 'w-full',
                trailingIcon: 'ms-auto'
            }
        },
        square: {
            true: ''
        },
        leading: {
            true: ''
        },
        trailing: {
            true: ''
        },
        loading: {
            true: ''
        }
    },
    compoundVariants: [
        // ========== SOLID VARIANTS ==========
        {
            variant: 'solid',
            color: 'primary',
            class: {
                base: 'bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            }
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: {
                base: 'bg-secondary text-on-secondary hover:bg-secondary/90 active:bg-secondary/80 disabled:bg-secondary aria-disabled:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
            }
        },
        {
            variant: 'solid',
            color: 'tertiary',
            class: {
                base: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90 active:bg-tertiary/80 disabled:bg-tertiary aria-disabled:bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary'
            }
        },
        {
            variant: 'solid',
            color: 'success',
            class: {
                base: 'bg-success text-on-success hover:bg-success/90 active:bg-success/80 disabled:bg-success aria-disabled:bg-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success'
            }
        },
        {
            variant: 'solid',
            color: 'warning',
            class: {
                base: 'bg-warning text-on-warning hover:bg-warning/90 active:bg-warning/80 disabled:bg-warning aria-disabled:bg-warning focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning'
            }
        },
        {
            variant: 'solid',
            color: 'error',
            class: {
                base: 'bg-error text-on-error hover:bg-error/90 active:bg-error/80 disabled:bg-error aria-disabled:bg-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error'
            }
        },
        {
            variant: 'solid',
            color: 'info',
            class: {
                base: 'bg-info text-on-info hover:bg-info/90 active:bg-info/80 disabled:bg-info aria-disabled:bg-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info'
            }
        },

        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                base: 'ring ring-inset ring-primary text-primary hover:bg-primary-container active:bg-primary-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                base: 'ring ring-inset ring-secondary text-secondary hover:bg-secondary-container active:bg-secondary-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                base: 'ring ring-inset ring-tertiary text-tertiary hover:bg-tertiary-container active:bg-tertiary-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                base: 'ring ring-inset ring-success text-success hover:bg-success-container active:bg-success-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                base: 'ring ring-inset ring-warning text-warning hover:bg-warning-container active:bg-warning-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                base: 'ring ring-inset ring-error text-error hover:bg-error-container active:bg-error-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                base: 'ring ring-inset ring-info text-info hover:bg-info-container active:bg-info-container disabled:bg-transparent aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-info'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                base: 'text-on-primary-container bg-primary-container hover:bg-primary-container/80 active:bg-primary-container/70 focus-visible:bg-primary-container/80 disabled:bg-primary-container aria-disabled:bg-primary-container'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                base: 'text-on-secondary-container bg-secondary-container hover:bg-secondary-container/80 active:bg-secondary-container/70 focus-visible:bg-secondary-container/80 disabled:bg-secondary-container aria-disabled:bg-secondary-container'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                base: 'text-on-tertiary-container bg-tertiary-container hover:bg-tertiary-container/80 active:bg-tertiary-container/70 focus-visible:bg-tertiary-container/80 disabled:bg-tertiary-container aria-disabled:bg-tertiary-container'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                base: 'text-on-success-container bg-success-container hover:bg-success-container/80 active:bg-success-container/70 focus-visible:bg-success-container/80 disabled:bg-success-container aria-disabled:bg-success-container'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                base: 'text-on-warning-container bg-warning-container hover:bg-warning-container/80 active:bg-warning-container/70 focus-visible:bg-warning-container/80 disabled:bg-warning-container aria-disabled:bg-warning-container'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                base: 'text-on-error-container bg-error-container hover:bg-error-container/80 active:bg-error-container/70 focus-visible:bg-error-container/80 disabled:bg-error-container aria-disabled:bg-error-container'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                base: 'text-on-info-container bg-info-container hover:bg-info-container/80 active:bg-info-container/70 focus-visible:bg-info-container/80 disabled:bg-info-container aria-disabled:bg-info-container'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                base: 'text-on-primary-container ring ring-inset ring-primary/25 bg-primary-container hover:bg-primary-container/80 active:bg-primary-container/70 disabled:bg-primary-container aria-disabled:bg-primary-container focus-visible:ring-2 focus-visible:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                base: 'text-on-secondary-container ring ring-inset ring-secondary/25 bg-secondary-container hover:bg-secondary-container/80 active:bg-secondary-container/70 disabled:bg-secondary-container aria-disabled:bg-secondary-container focus-visible:ring-2 focus-visible:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                base: 'text-on-tertiary-container ring ring-inset ring-tertiary/25 bg-tertiary-container hover:bg-tertiary-container/80 active:bg-tertiary-container/70 disabled:bg-tertiary-container aria-disabled:bg-tertiary-container focus-visible:ring-2 focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                base: 'text-on-success-container ring ring-inset ring-success/25 bg-success-container hover:bg-success-container/80 active:bg-success-container/70 disabled:bg-success-container aria-disabled:bg-success-container focus-visible:ring-2 focus-visible:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                base: 'text-on-warning-container ring ring-inset ring-warning/25 bg-warning-container hover:bg-warning-container/80 active:bg-warning-container/70 disabled:bg-warning-container aria-disabled:bg-warning-container focus-visible:ring-2 focus-visible:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                base: 'text-on-error-container ring ring-inset ring-error/25 bg-error-container hover:bg-error-container/80 active:bg-error-container/70 disabled:bg-error-container aria-disabled:bg-error-container focus-visible:ring-2 focus-visible:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                base: 'text-on-info-container ring ring-inset ring-info/25 bg-info-container hover:bg-info-container/80 active:bg-info-container/70 disabled:bg-info-container aria-disabled:bg-info-container focus-visible:ring-2 focus-visible:ring-info'
            }
        },

        // ========== GHOST VARIANTS ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: {
                base: 'text-primary hover:bg-primary-container active:bg-primary-container focus-visible:bg-primary-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: {
                base: 'text-secondary hover:bg-secondary-container active:bg-secondary-container focus-visible:bg-secondary-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: {
                base: 'text-tertiary hover:bg-tertiary-container active:bg-tertiary-container focus-visible:bg-tertiary-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'success',
            class: {
                base: 'text-success hover:bg-success-container active:bg-success-container focus-visible:bg-success-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: {
                base: 'text-warning hover:bg-warning-container active:bg-warning-container focus-visible:bg-warning-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'error',
            class: {
                base: 'text-error hover:bg-error-container active:bg-error-container focus-visible:bg-error-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },
        {
            variant: 'ghost',
            color: 'info',
            class: {
                base: 'text-info hover:bg-info-container active:bg-info-container focus-visible:bg-info-container disabled:bg-transparent aria-disabled:bg-transparent'
            }
        },

        // ========== LINK VARIANTS ==========
        {
            variant: 'link',
            color: 'primary',
            class: {
                base: 'text-primary hover:text-primary/75 active:text-primary/75 underline-offset-4 hover:underline disabled:text-primary aria-disabled:text-primary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary'
            }
        },
        {
            variant: 'link',
            color: 'secondary',
            class: {
                base: 'text-secondary hover:text-secondary/75 active:text-secondary/75 underline-offset-4 hover:underline disabled:text-secondary aria-disabled:text-secondary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary'
            }
        },
        {
            variant: 'link',
            color: 'tertiary',
            class: {
                base: 'text-tertiary hover:text-tertiary/75 active:text-tertiary/75 underline-offset-4 hover:underline disabled:text-tertiary aria-disabled:text-tertiary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tertiary'
            }
        },
        {
            variant: 'link',
            color: 'success',
            class: {
                base: 'text-success hover:text-success/75 active:text-success/75 underline-offset-4 hover:underline disabled:text-success aria-disabled:text-success focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success'
            }
        },
        {
            variant: 'link',
            color: 'warning',
            class: {
                base: 'text-warning hover:text-warning/75 active:text-warning/75 underline-offset-4 hover:underline disabled:text-warning aria-disabled:text-warning focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning'
            }
        },
        {
            variant: 'link',
            color: 'error',
            class: {
                base: 'text-error hover:text-error/75 active:text-error/75 underline-offset-4 hover:underline disabled:text-error aria-disabled:text-error focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error'
            }
        },
        {
            variant: 'link',
            color: 'info',
            class: {
                base: 'text-info hover:text-info/75 active:text-info/75 underline-offset-4 hover:underline disabled:text-info aria-disabled:text-info focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info'
            }
        },

        // ========== SQUARE SIZE ADJUSTMENTS ==========
        { square: true, size: 'xs', class: { base: 'p-1' } },
        { square: true, size: 'sm', class: { base: 'p-1.5' } },
        { square: true, size: 'md', class: { base: 'p-1.5' } },
        { square: true, size: 'lg', class: { base: 'p-2' } },
        { square: true, size: 'xl', class: { base: 'p-2.5' } },

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
        variant: 'solid',
        color: 'primary',
        size: 'md'
    }
})

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
export type ButtonSlots = keyof ReturnType<typeof buttonVariants>
