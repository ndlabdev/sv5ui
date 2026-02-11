import { tv, type VariantProps } from 'tailwind-variants'

export const calendarVariants = tv({
    slots: {
        root: '',
        header: 'flex items-center justify-between',
        body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
        heading: 'text-center font-medium truncate mx-auto',
        grid: 'w-full border-collapse select-none focus:outline-none',
        gridRow: '',
        gridWeekDaysRow: '',
        gridBody: '',
        headCell: 'rounded-md',
        headCellWeek: 'rounded-md text-on-surface-variant',
        cell: 'relative text-center',
        cellTrigger: [
            'm-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap',
            'focus-visible:ring-2 focus:outline-none',
            'data-disabled:text-on-surface-variant',
            'data-unavailable:line-through data-unavailable:text-on-surface-variant data-unavailable:pointer-events-none',
            'data-today:font-semibold',
            'data-[outside-month]:text-on-surface-variant',
            'transition'
        ],
        cellWeek: 'relative text-center text-on-surface-variant',
        navButton: [
            'inline-flex items-center justify-center rounded-md',
            'text-on-surface-variant hover:bg-surface-container-highest',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'disabled:opacity-50 disabled:pointer-events-none',
            'transition-colors'
        ],
        navButtonIcon: 'shrink-0'
    },
    variants: {
        color: {
            primary: {
                headCell: 'text-primary',
                cellTrigger: 'focus-visible:ring-primary'
            },
            secondary: {
                headCell: 'text-secondary',
                cellTrigger: 'focus-visible:ring-secondary'
            },
            tertiary: {
                headCell: 'text-tertiary',
                cellTrigger: 'focus-visible:ring-tertiary'
            },
            success: {
                headCell: 'text-success',
                cellTrigger: 'focus-visible:ring-success'
            },
            warning: {
                headCell: 'text-warning',
                cellTrigger: 'focus-visible:ring-warning'
            },
            error: {
                headCell: 'text-error',
                cellTrigger: 'focus-visible:ring-error'
            },
            info: {
                headCell: 'text-info',
                cellTrigger: 'focus-visible:ring-info'
            },
            surface: {
                headCell: 'text-on-surface',
                cellTrigger: 'focus-visible:ring-inverse-surface'
            }
        },
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: ''
        },
        size: {
            xs: {
                heading: 'text-xs',
                cell: 'text-xs',
                cellWeek: 'text-xs',
                headCell: 'text-[10px]',
                headCellWeek: 'text-[10px]',
                cellTrigger: 'size-7',
                body: 'space-y-2 pt-2',
                navButton: 'size-6',
                navButtonIcon: 'size-3'
            },
            sm: {
                heading: 'text-xs',
                headCell: 'text-xs',
                headCellWeek: 'text-xs',
                cellWeek: 'text-xs',
                cell: 'text-xs',
                cellTrigger: 'size-7',
                navButton: 'size-7',
                navButtonIcon: 'size-3.5'
            },
            md: {
                heading: 'text-sm',
                headCell: 'text-xs',
                headCellWeek: 'text-xs',
                cellWeek: 'text-xs',
                cell: 'text-sm',
                cellTrigger: 'size-8',
                navButton: 'size-8',
                navButtonIcon: 'size-4'
            },
            lg: {
                heading: 'text-base',
                headCell: 'text-base',
                headCellWeek: 'text-base',
                cellTrigger: 'size-9 text-base',
                navButton: 'size-9',
                navButtonIcon: 'size-4'
            },
            xl: {
                heading: 'text-lg',
                headCell: 'text-lg',
                headCellWeek: 'text-lg',
                cellTrigger: 'size-10 text-lg',
                navButton: 'size-10',
                navButtonIcon: 'size-5'
            }
        },
        weekNumbers: {
            true: {}
        }
    },
    compoundVariants: [
        // ========== SOLID VARIANTS ==========
        {
            color: 'primary',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-primary data-[selected]:text-on-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20'
            }
        },
        {
            color: 'secondary',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-secondary data-[selected]:text-on-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20'
            }
        },
        {
            color: 'tertiary',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-tertiary data-[selected]:text-on-tertiary data-today:not-data-[selected]:text-tertiary data-[highlighted]:bg-tertiary/20 hover:not-data-[selected]:bg-tertiary/20'
            }
        },
        {
            color: 'success',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-success data-[selected]:text-on-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20'
            }
        },
        {
            color: 'warning',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-warning data-[selected]:text-on-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20'
            }
        },
        {
            color: 'error',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-error data-[selected]:text-on-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20'
            }
        },
        {
            color: 'info',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-info data-[selected]:text-on-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20'
            }
        },
        {
            color: 'surface',
            variant: 'solid',
            class: {
                cellTrigger:
                    'data-[selected]:bg-inverse-surface data-[selected]:text-inverse-on-surface data-today:not-data-[selected]:text-on-surface data-[highlighted]:bg-inverse-surface/20 hover:not-data-[selected]:bg-inverse-surface/10'
            }
        },

        // ========== OUTLINE VARIANTS ==========
        {
            color: 'primary',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/50 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/10 hover:not-data-[selected]:bg-primary/10'
            }
        },
        {
            color: 'secondary',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/50 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/10 hover:not-data-[selected]:bg-secondary/10'
            }
        },
        {
            color: 'tertiary',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-tertiary/50 data-[selected]:text-tertiary data-today:not-data-[selected]:text-tertiary data-[highlighted]:bg-tertiary/10 hover:not-data-[selected]:bg-tertiary/10'
            }
        },
        {
            color: 'success',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/50 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/10 hover:not-data-[selected]:bg-success/10'
            }
        },
        {
            color: 'warning',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/50 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/10 hover:not-data-[selected]:bg-warning/10'
            }
        },
        {
            color: 'error',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/50 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/10 hover:not-data-[selected]:bg-error/10'
            }
        },
        {
            color: 'info',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/50 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/10 hover:not-data-[selected]:bg-info/10'
            }
        },
        {
            color: 'surface',
            variant: 'outline',
            class: {
                cellTrigger:
                    'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-outline-variant data-[selected]:text-on-surface data-[selected]:bg-surface data-today:not-data-[selected]:text-on-surface data-[highlighted]:bg-inverse-surface/10 hover:not-data-[selected]:bg-inverse-surface/10'
            }
        },

        // ========== SOFT VARIANTS ==========
        {
            color: 'primary',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-primary/10 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20'
            }
        },
        {
            color: 'secondary',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20'
            }
        },
        {
            color: 'tertiary',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-tertiary/10 data-[selected]:text-tertiary data-today:not-data-[selected]:text-tertiary data-[highlighted]:bg-tertiary/20 hover:not-data-[selected]:bg-tertiary/20'
            }
        },
        {
            color: 'success',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-success/10 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20'
            }
        },
        {
            color: 'warning',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-warning/10 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20'
            }
        },
        {
            color: 'error',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-error/10 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20'
            }
        },
        {
            color: 'info',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-info/10 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20'
            }
        },
        {
            color: 'surface',
            variant: 'soft',
            class: {
                cellTrigger:
                    'data-[selected]:bg-surface-container-highest data-[selected]:text-on-surface data-today:not-data-[selected]:text-on-surface data-[highlighted]:bg-inverse-surface/20 hover:not-data-[selected]:bg-inverse-surface/10'
            }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            color: 'primary',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/25 data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20'
            }
        },
        {
            color: 'secondary',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/25 data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20'
            }
        },
        {
            color: 'tertiary',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-tertiary/10 data-[selected]:text-tertiary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-tertiary/25 data-today:not-data-[selected]:text-tertiary data-[highlighted]:bg-tertiary/20 hover:not-data-[selected]:bg-tertiary/20'
            }
        },
        {
            color: 'success',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-success/10 data-[selected]:text-success data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/25 data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20'
            }
        },
        {
            color: 'warning',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-warning/10 data-[selected]:text-warning data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/25 data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20'
            }
        },
        {
            color: 'error',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-error/10 data-[selected]:text-error data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/25 data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20'
            }
        },
        {
            color: 'info',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-info/10 data-[selected]:text-info data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/25 data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20'
            }
        },
        {
            color: 'surface',
            variant: 'subtle',
            class: {
                cellTrigger:
                    'data-[selected]:bg-surface-container-highest data-[selected]:text-on-surface data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-outline-variant data-today:not-data-[selected]:text-on-surface data-[highlighted]:bg-inverse-surface/20 hover:not-data-[selected]:bg-inverse-surface/10'
            }
        }
    ],
    defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
    }
})

export type CalendarVariantProps = VariantProps<typeof calendarVariants>
export type CalendarSlots = keyof ReturnType<typeof calendarVariants>

export const calendarDefaults = {
    defaultVariants: calendarVariants.defaultVariants,
    slots: {} as Partial<Record<CalendarSlots, string>>
}
