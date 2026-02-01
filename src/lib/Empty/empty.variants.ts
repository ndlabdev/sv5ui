import { tv, type VariantProps } from 'tailwind-variants'

export const emptyVariants = tv({
    slots: {
        root: 'flex flex-col items-center justify-center rounded-lg text-center',
        icon: 'shrink-0',
        avatar: 'shrink-0',
        title: 'font-medium',
        description: '',
        actions: 'flex flex-wrap items-center justify-center gap-2'
    },
    variants: {
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: ''
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
                root: 'gap-2 p-4',
                icon: 'size-8',
                title: 'text-sm',
                description: 'text-xs'
            },
            sm: {
                root: 'gap-2.5 p-5',
                icon: 'size-10',
                title: 'text-sm',
                description: 'text-xs'
            },
            md: {
                root: 'gap-3 p-6',
                icon: 'size-12',
                title: 'text-base',
                description: 'text-sm'
            },
            lg: {
                root: 'gap-4 p-8',
                icon: 'size-14',
                title: 'text-lg',
                description: 'text-sm'
            },
            xl: {
                root: 'gap-5 p-10',
                icon: 'size-16',
                title: 'text-xl',
                description: 'text-base'
            }
        }
    },
    compoundVariants: [
        // ========== SOLID VARIANTS ==========
        {
            variant: 'solid',
            color: 'primary',
            class: {
                root: 'bg-primary text-on-primary',
                icon: 'text-on-primary/70',
                description: 'text-on-primary/80'
            }
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: {
                root: 'bg-secondary text-on-secondary',
                icon: 'text-on-secondary/70',
                description: 'text-on-secondary/80'
            }
        },
        {
            variant: 'solid',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary text-on-tertiary',
                icon: 'text-on-tertiary/70',
                description: 'text-on-tertiary/80'
            }
        },
        {
            variant: 'solid',
            color: 'success',
            class: {
                root: 'bg-success text-on-success',
                icon: 'text-on-success/70',
                description: 'text-on-success/80'
            }
        },
        {
            variant: 'solid',
            color: 'warning',
            class: {
                root: 'bg-warning text-on-warning',
                icon: 'text-on-warning/70',
                description: 'text-on-warning/80'
            }
        },
        {
            variant: 'solid',
            color: 'error',
            class: {
                root: 'bg-error text-on-error',
                icon: 'text-on-error/70',
                description: 'text-on-error/80'
            }
        },
        {
            variant: 'solid',
            color: 'info',
            class: {
                root: 'bg-info text-on-info',
                icon: 'text-on-info/70',
                description: 'text-on-info/80'
            }
        },
        {
            variant: 'solid',
            color: 'surface',
            class: {
                root: 'bg-inverse-surface text-inverse-on-surface',
                icon: 'text-inverse-on-surface/70',
                description: 'text-inverse-on-surface/80'
            }
        },

        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                root: 'ring ring-inset ring-primary/25 text-primary',
                icon: 'text-primary/70',
                description: 'text-primary/80'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                root: 'ring ring-inset ring-secondary/25 text-secondary',
                icon: 'text-secondary/70',
                description: 'text-secondary/80'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                root: 'ring ring-inset ring-tertiary/25 text-tertiary',
                icon: 'text-tertiary/70',
                description: 'text-tertiary/80'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                root: 'ring ring-inset ring-success/25 text-success',
                icon: 'text-success/70',
                description: 'text-success/80'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                root: 'ring ring-inset ring-warning/25 text-warning',
                icon: 'text-warning/70',
                description: 'text-warning/80'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                root: 'ring ring-inset ring-error/25 text-error',
                icon: 'text-error/70',
                description: 'text-error/80'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                root: 'ring ring-inset ring-info/25 text-info',
                icon: 'text-info/70',
                description: 'text-info/80'
            }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                root: 'ring ring-inset ring-outline-variant text-on-surface',
                icon: 'text-on-surface-variant',
                description: 'text-on-surface-variant'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                root: 'bg-primary-container text-on-primary-container',
                icon: 'text-on-primary-container/70',
                description: 'text-on-primary-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                root: 'bg-secondary-container text-on-secondary-container',
                icon: 'text-on-secondary-container/70',
                description: 'text-on-secondary-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary-container text-on-tertiary-container',
                icon: 'text-on-tertiary-container/70',
                description: 'text-on-tertiary-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                root: 'bg-success-container text-on-success-container',
                icon: 'text-on-success-container/70',
                description: 'text-on-success-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                root: 'bg-warning-container text-on-warning-container',
                icon: 'text-on-warning-container/70',
                description: 'text-on-warning-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                root: 'bg-error-container text-on-error-container',
                icon: 'text-on-error-container/70',
                description: 'text-on-error-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                root: 'bg-info-container text-on-info-container',
                icon: 'text-on-info-container/70',
                description: 'text-on-info-container/80'
            }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: {
                root: 'bg-surface-container-highest text-on-surface',
                icon: 'text-on-surface-variant',
                description: 'text-on-surface-variant'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                root: 'bg-primary-container text-on-primary-container ring ring-inset ring-primary/25',
                icon: 'text-on-primary-container/70',
                description: 'text-on-primary-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                root: 'bg-secondary-container text-on-secondary-container ring ring-inset ring-secondary/25',
                icon: 'text-on-secondary-container/70',
                description: 'text-on-secondary-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary-container text-on-tertiary-container ring ring-inset ring-tertiary/25',
                icon: 'text-on-tertiary-container/70',
                description: 'text-on-tertiary-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                root: 'bg-success-container text-on-success-container ring ring-inset ring-success/25',
                icon: 'text-on-success-container/70',
                description: 'text-on-success-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                root: 'bg-warning-container text-on-warning-container ring ring-inset ring-warning/25',
                icon: 'text-on-warning-container/70',
                description: 'text-on-warning-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                root: 'bg-error-container text-on-error-container ring ring-inset ring-error/25',
                icon: 'text-on-error-container/70',
                description: 'text-on-error-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                root: 'bg-info-container text-on-info-container ring ring-inset ring-info/25',
                icon: 'text-on-info-container/70',
                description: 'text-on-info-container/80'
            }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                root: 'bg-surface-container-highest text-on-surface ring ring-inset ring-outline-variant',
                icon: 'text-on-surface-variant',
                description: 'text-on-surface-variant'
            }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'surface',
        size: 'md'
    }
})

export type EmptyVariantProps = VariantProps<typeof emptyVariants>
export type EmptySlots = keyof ReturnType<typeof emptyVariants>

export const emptyDefaults = {
    defaultVariants: emptyVariants.defaultVariants,
    slots: {} as Partial<Record<EmptySlots, string>>
}
