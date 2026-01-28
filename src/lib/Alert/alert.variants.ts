import { tv, type VariantProps } from 'tailwind-variants'

export const alertVariants = tv({
    slots: {
        root: 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5',
        wrapper: 'min-w-0 flex-1 flex flex-col',
        title: 'text-sm font-medium',
        description: 'text-sm opacity-90',
        icon: 'shrink-0 size-5',
        avatar: 'shrink-0',
        actions: 'flex flex-wrap gap-1.5 shrink-0',
        close: 'p-0'
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
            info: ''
        },
        orientation: {
            horizontal: {
                root: 'items-center',
                actions: 'items-center'
            },
            vertical: {
                root: 'items-start',
                actions: 'items-start mt-2.5'
            }
        },
        title: {
            true: {
                description: 'mt-1'
            }
        }
    },
    compoundVariants: [
        // ========== SOLID VARIANT (button styling) ==========
        {
            variant: 'solid',
            class: {
                actions: '[&_button]:text-inherit [&_button]:border-current/30 [&_button]:hover:bg-current/10',
                close: 'text-inherit hover:bg-current/10'
            }
        },

        // ========== SOLID VARIANTS (colors) ==========
        {
            variant: 'solid',
            color: 'primary',
            class: {
                root: 'bg-primary text-on-primary'
            }
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: {
                root: 'bg-secondary text-on-secondary'
            }
        },
        {
            variant: 'solid',
            color: 'success',
            class: {
                root: 'bg-success text-on-success'
            }
        },
        {
            variant: 'solid',
            color: 'warning',
            class: {
                root: 'bg-warning text-on-warning'
            }
        },
        {
            variant: 'solid',
            color: 'error',
            class: {
                root: 'bg-error text-on-error'
            }
        },
        {
            variant: 'solid',
            color: 'info',
            class: {
                root: 'bg-info text-on-info'
            }
        },
        {
            variant: 'solid',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary text-on-tertiary'
            }
        },

        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                root: 'text-primary ring ring-inset ring-primary/25'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                root: 'text-secondary ring ring-inset ring-secondary/25'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                root: 'text-success ring ring-inset ring-success/25'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                root: 'text-warning ring ring-inset ring-warning/25'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                root: 'text-error ring ring-inset ring-error/25'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                root: 'text-info ring ring-inset ring-info/25'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                root: 'text-tertiary ring ring-inset ring-tertiary/25'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                root: 'bg-primary/10 text-primary'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                root: 'bg-secondary/10 text-secondary'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                root: 'bg-success/10 text-success'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                root: 'bg-warning/10 text-warning'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                root: 'bg-error/10 text-error'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                root: 'bg-info/10 text-info'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary/10 text-tertiary'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                root: 'bg-primary/10 text-primary ring ring-inset ring-primary/25'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                root: 'bg-secondary/10 text-secondary ring ring-inset ring-secondary/25'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                root: 'bg-success/10 text-success ring ring-inset ring-success/25'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                root: 'bg-warning/10 text-warning ring ring-inset ring-warning/25'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                root: 'bg-error/10 text-error ring ring-inset ring-error/25'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                root: 'bg-info/10 text-info ring ring-inset ring-info/25'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                root: 'bg-tertiary/10 text-tertiary ring ring-inset ring-tertiary/25'
            }
        }
    ],
    defaultVariants: {
        variant: 'solid',
        color: 'primary',
        orientation: 'horizontal'
    }
})

export type AlertVariantProps = VariantProps<typeof alertVariants>
export type AlertSlots = keyof ReturnType<typeof alertVariants>

export const alertDefaults = {
    defaultVariants: alertVariants.defaultVariants,
    slots: {} as Partial<Record<AlertSlots, string>>
}
