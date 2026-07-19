import { tv, type VariantProps } from 'tailwind-variants'

export const datePickerVariants = tv({
    slots: {
        root: 'relative w-full inline-flex items-center',
        field: [
            'w-full inline-flex items-center rounded-md border-0 bg-surface text-on-surface',
            'select-none whitespace-nowrap',
            'data-disabled:cursor-not-allowed data-disabled:opacity-75',
            'data-invalid:ring-error',
            'transition-colors',
            'focus-within:outline-none'
        ],
        segment: [
            'rounded px-0.5 tabular-nums outline-none',
            'focus:outline-none',
            'aria-[valuetext=Empty]:text-on-surface-variant/50',
            'data-disabled:cursor-not-allowed',
            'transition-colors'
        ],
        literal: 'px-0.5 text-on-surface-variant/75',
        trigger: [
            'absolute inset-y-0 end-0 flex items-center justify-center rounded-md',
            'text-on-surface-variant/75 hover:text-on-surface',
            'disabled:opacity-75 disabled:pointer-events-none',
            'focus:outline-none focus-visible:ring-2',
            'transition-colors'
        ],
        triggerIcon: 'shrink-0',
        content: [
            'z-50',
            'bg-surface-container-lowest text-on-surface ring ring-surface-container-highest',
            'rounded-md shadow-lg',
            'focus:outline-none pointer-events-auto'
        ],
        calendar: 'p-3',
        time: 'flex items-center justify-center gap-2 border-t border-surface-container-highest p-3',
        timeIcon: 'shrink-0 text-on-surface-variant/75',
        timeField: [
            'inline-flex items-center rounded-md bg-surface text-on-surface',
            'select-none whitespace-nowrap',
            'ring ring-inset ring-outline-variant focus-within:ring-2',
            'data-disabled:cursor-not-allowed data-disabled:opacity-75',
            'data-invalid:ring-error',
            'transition-colors focus-within:outline-none'
        ]
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
            primary: {
                segment: 'focus:bg-primary/15 focus:text-primary',
                trigger: 'focus-visible:ring-primary',
                timeField: 'focus-within:ring-primary'
            },
            secondary: {
                segment: 'focus:bg-secondary/15 focus:text-secondary',
                trigger: 'focus-visible:ring-secondary',
                timeField: 'focus-within:ring-secondary'
            },
            tertiary: {
                segment: 'focus:bg-tertiary/15 focus:text-tertiary',
                trigger: 'focus-visible:ring-tertiary',
                timeField: 'focus-within:ring-tertiary'
            },
            success: {
                segment: 'focus:bg-success/15 focus:text-success',
                trigger: 'focus-visible:ring-success',
                timeField: 'focus-within:ring-success'
            },
            warning: {
                segment: 'focus:bg-warning/15 focus:text-warning',
                trigger: 'focus-visible:ring-warning',
                timeField: 'focus-within:ring-warning'
            },
            error: {
                segment: 'focus:bg-error/15 focus:text-error',
                trigger: 'focus-visible:ring-error',
                timeField: 'focus-within:ring-error'
            },
            info: {
                segment: 'focus:bg-info/15 focus:text-info',
                trigger: 'focus-visible:ring-info',
                timeField: 'focus-within:ring-info'
            },
            surface: {
                segment: 'focus:bg-inverse-surface/15 focus:text-on-surface',
                trigger: 'focus-visible:ring-outline',
                timeField: 'focus-within:ring-outline'
            }
        },
        size: {
            xs: {
                field: 'ps-1.5 py-1 pe-7 text-xs rounded',
                trigger: 'pe-2 ps-1',
                triggerIcon: 'size-3.5',
                timeField: 'px-1 py-0.5 text-xs rounded',
                timeIcon: 'size-3.5'
            },
            sm: {
                field: 'ps-2 py-1.5 pe-8 text-xs rounded-md',
                trigger: 'pe-2.5 ps-1',
                triggerIcon: 'size-4',
                timeField: 'px-1.5 py-1 text-xs rounded-md',
                timeIcon: 'size-4'
            },
            md: {
                field: 'ps-2.5 py-2 pe-10 text-sm rounded-md',
                trigger: 'pe-3 ps-1.5',
                triggerIcon: 'size-5',
                timeField: 'px-2 py-1 text-sm rounded-md',
                timeIcon: 'size-5'
            },
            lg: {
                field: 'ps-3.5 py-2.5 pe-11 text-sm rounded-md',
                trigger: 'pe-4 ps-1.5',
                triggerIcon: 'size-5',
                timeField: 'px-2.5 py-1.5 text-sm rounded-md',
                timeIcon: 'size-5'
            },
            xl: {
                field: 'ps-4.5 py-3 pe-13 text-base rounded-lg',
                trigger: 'pe-5 ps-2',
                triggerIcon: 'size-6',
                timeField: 'px-3 py-2 text-base rounded-lg',
                timeIcon: 'size-6'
            }
        },
        highlight: {
            true: ''
        },
        transition: {
            true: {
                content: [
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    'data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2'
                ]
            }
        }
    },
    compoundVariants: [
        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-primary'
            }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-secondary'
            }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-tertiary'
            }
        },
        {
            variant: 'outline',
            color: 'success',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-success'
            }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-warning'
            }
        },
        {
            variant: 'outline',
            color: 'error',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-error'
            }
        },
        {
            variant: 'outline',
            color: 'info',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-info'
            }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: {
                field: 'ring ring-inset ring-outline-variant focus-within:ring-2 focus-within:ring-outline'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: {
                field: 'bg-primary-container/50 focus-within:bg-primary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary'
            }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: {
                field: 'bg-secondary-container/50 focus-within:bg-secondary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-secondary'
            }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: {
                field: 'bg-tertiary-container/50 focus-within:bg-tertiary-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-tertiary'
            }
        },
        {
            variant: 'soft',
            color: 'success',
            class: {
                field: 'bg-success-container/50 focus-within:bg-success-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-success'
            }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: {
                field: 'bg-warning-container/50 focus-within:bg-warning-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-warning'
            }
        },
        {
            variant: 'soft',
            color: 'error',
            class: {
                field: 'bg-error-container/50 focus-within:bg-error-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-error'
            }
        },
        {
            variant: 'soft',
            color: 'info',
            class: {
                field: 'bg-info-container/50 focus-within:bg-info-container/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-info'
            }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: {
                field: 'bg-surface-container-highest/50 focus-within:bg-surface-container-highest/75 focus-within:ring-2 focus-within:ring-inset focus-within:ring-outline'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: {
                field: 'ring ring-inset ring-primary/25 bg-primary-container/50 focus-within:ring-2 focus-within:ring-primary'
            }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: {
                field: 'ring ring-inset ring-secondary/25 bg-secondary-container/50 focus-within:ring-2 focus-within:ring-secondary'
            }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: {
                field: 'ring ring-inset ring-tertiary/25 bg-tertiary-container/50 focus-within:ring-2 focus-within:ring-tertiary'
            }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: {
                field: 'ring ring-inset ring-success/25 bg-success-container/50 focus-within:ring-2 focus-within:ring-success'
            }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: {
                field: 'ring ring-inset ring-warning/25 bg-warning-container/50 focus-within:ring-2 focus-within:ring-warning'
            }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: {
                field: 'ring ring-inset ring-error/25 bg-error-container/50 focus-within:ring-2 focus-within:ring-error'
            }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: {
                field: 'ring ring-inset ring-info/25 bg-info-container/50 focus-within:ring-2 focus-within:ring-info'
            }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: {
                field: 'ring ring-inset ring-outline-variant bg-surface-container-highest/50 focus-within:ring-2 focus-within:ring-outline'
            }
        },

        // ========== GHOST VARIANTS ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: {
                field: 'bg-transparent hover:bg-primary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary'
            }
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: {
                field: 'bg-transparent hover:bg-secondary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-secondary'
            }
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: {
                field: 'bg-transparent hover:bg-tertiary-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-tertiary'
            }
        },
        {
            variant: 'ghost',
            color: 'success',
            class: {
                field: 'bg-transparent hover:bg-success-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-success'
            }
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: {
                field: 'bg-transparent hover:bg-warning-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-warning'
            }
        },
        {
            variant: 'ghost',
            color: 'error',
            class: {
                field: 'bg-transparent hover:bg-error-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-error'
            }
        },
        {
            variant: 'ghost',
            color: 'info',
            class: {
                field: 'bg-transparent hover:bg-info-container/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-info'
            }
        },
        {
            variant: 'ghost',
            color: 'surface',
            class: {
                field: 'bg-transparent hover:bg-surface-container-highest/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-outline'
            }
        },

        // ========== NONE VARIANT ==========
        {
            variant: 'none',
            class: {
                field: 'bg-transparent focus-within:ring-0'
            }
        },

        // ========== HIGHLIGHT VARIANTS ==========
        {
            highlight: true,
            color: 'primary',
            class: { field: 'ring-2 ring-inset ring-primary' }
        },
        {
            highlight: true,
            color: 'secondary',
            class: { field: 'ring-2 ring-inset ring-secondary' }
        },
        {
            highlight: true,
            color: 'tertiary',
            class: { field: 'ring-2 ring-inset ring-tertiary' }
        },
        {
            highlight: true,
            color: 'success',
            class: { field: 'ring-2 ring-inset ring-success' }
        },
        {
            highlight: true,
            color: 'warning',
            class: { field: 'ring-2 ring-inset ring-warning' }
        },
        {
            highlight: true,
            color: 'error',
            class: { field: 'ring-2 ring-inset ring-error' }
        },
        {
            highlight: true,
            color: 'info',
            class: { field: 'ring-2 ring-inset ring-info' }
        },
        {
            highlight: true,
            color: 'surface',
            class: { field: 'ring-2 ring-inset ring-outline' }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md',
        highlight: false,
        transition: true
    }
})

export type DatePickerVariantProps = VariantProps<typeof datePickerVariants>
export type DatePickerSlots = keyof ReturnType<typeof datePickerVariants>

export const datePickerDefaults = {
    defaultVariants: datePickerVariants.defaultVariants,
    slots: {} as Partial<Record<DatePickerSlots, string>>
}
