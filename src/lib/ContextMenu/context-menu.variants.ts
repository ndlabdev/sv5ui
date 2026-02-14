import { tv, type VariantProps } from 'tailwind-variants'

export const contextMenuVariants = tv({
    slots: {
        content: [
            'z-50 min-w-48',
            'bg-surface-container-low text-on-surface',
            'rounded-md',
            'ring ring-outline-variant/50',
            'shadow-lg',
            'focus:outline-none',
            'overflow-hidden'
        ],
        group: 'p-1',
        separator: '-mx-1 my-1 h-px bg-outline-variant',
        label: 'px-2 py-1.5 text-xs font-semibold text-on-surface-variant',
        item: [
            'relative flex items-center gap-2 w-full rounded-sm px-2 cursor-pointer select-none',
            'focus:outline-none',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'data-[highlighted]:bg-surface-container-highest'
        ],
        itemIcon: 'shrink-0',
        itemLabel: 'flex-1 truncate',
        itemKbd: 'ml-auto flex items-center gap-0.5',
        itemIndicator: 'shrink-0',
        subTrigger: [
            'relative flex items-center gap-2 w-full rounded-sm px-2 cursor-pointer select-none',
            'focus:outline-none',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'data-[highlighted]:bg-surface-container-highest',
            'data-[state=open]:bg-surface-container-highest'
        ],
        subTriggerIcon: 'ml-auto shrink-0',
        subContent: [
            'z-50 min-w-48',
            'bg-surface-container-low text-on-surface',
            'rounded-md',
            'ring ring-outline-variant/50',
            'shadow-lg',
            'focus:outline-none',
            'overflow-hidden'
        ],
        checkboxIndicator: 'shrink-0',
        radioIndicator: 'shrink-0'
    },
    variants: {
        transition: {
            true: {
                content:
                    'data-[state=open]:animate-[fade-in_150ms_ease-out,scale-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in,scale-out_100ms_ease-in]',
                subContent:
                    'data-[state=open]:animate-[fade-in_150ms_ease-out,scale-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in,scale-out_100ms_ease-in]'
            }
        },
        size: {
            xs: {
                item: 'py-1 text-xs',
                subTrigger: 'py-1 text-xs',
                itemIcon: 'size-3',
                subTriggerIcon: 'size-3',
                checkboxIndicator: 'size-3',
                radioIndicator: 'size-3',
                label: 'text-[10px]'
            },
            sm: {
                item: 'py-1.5 text-xs',
                subTrigger: 'py-1.5 text-xs',
                itemIcon: 'size-3.5',
                subTriggerIcon: 'size-3.5',
                checkboxIndicator: 'size-3.5',
                radioIndicator: 'size-3.5',
                label: 'text-[11px]'
            },
            md: {
                item: 'py-1.5 text-sm',
                subTrigger: 'py-1.5 text-sm',
                itemIcon: 'size-4',
                subTriggerIcon: 'size-4',
                checkboxIndicator: 'size-4',
                radioIndicator: 'size-4'
            },
            lg: {
                item: 'py-2 text-sm',
                subTrigger: 'py-2 text-sm',
                itemIcon: 'size-5',
                subTriggerIcon: 'size-5',
                checkboxIndicator: 'size-5',
                radioIndicator: 'size-5'
            },
            xl: {
                item: 'py-2.5 text-base',
                subTrigger: 'py-2.5 text-base',
                itemIcon: 'size-5',
                subTriggerIcon: 'size-5',
                checkboxIndicator: 'size-5',
                radioIndicator: 'size-5'
            }
        },
        color: {
            default: {},
            primary: {},
            secondary: {},
            tertiary: {},
            success: {},
            warning: {},
            error: {},
            info: {},
            surface: {}
        }
    },
    compoundVariants: [
        {
            color: 'error',
            class: {
                item: 'text-error data-[highlighted]:bg-error-container data-[highlighted]:text-on-error-container',
                itemIcon: 'text-error'
            }
        },
        {
            color: 'success',
            class: {
                item: 'text-success data-[highlighted]:bg-success-container data-[highlighted]:text-on-success-container',
                itemIcon: 'text-success'
            }
        },
        {
            color: 'warning',
            class: {
                item: 'text-warning data-[highlighted]:bg-warning-container data-[highlighted]:text-on-warning-container',
                itemIcon: 'text-warning'
            }
        },
        {
            color: 'info',
            class: {
                item: 'text-info data-[highlighted]:bg-info-container data-[highlighted]:text-on-info-container',
                itemIcon: 'text-info'
            }
        },
        {
            color: 'primary',
            class: {
                item: 'text-primary data-[highlighted]:bg-primary-container data-[highlighted]:text-on-primary-container',
                itemIcon: 'text-primary'
            }
        },
        {
            color: 'secondary',
            class: {
                item: 'text-secondary data-[highlighted]:bg-secondary-container data-[highlighted]:text-on-secondary-container',
                itemIcon: 'text-secondary'
            }
        },
        {
            color: 'tertiary',
            class: {
                item: 'text-tertiary data-[highlighted]:bg-tertiary-container data-[highlighted]:text-on-tertiary-container',
                itemIcon: 'text-tertiary'
            }
        },
        {
            color: 'surface',
            class: {
                item: 'text-on-surface-variant data-[highlighted]:bg-surface-container-highest data-[highlighted]:text-on-surface',
                itemIcon: 'text-on-surface-variant'
            }
        }
    ],
    defaultVariants: {
        transition: true,
        size: 'md',
        color: 'default'
    }
})

export type ContextMenuVariantProps = VariantProps<typeof contextMenuVariants>
export type ContextMenuSlots = keyof ReturnType<typeof contextMenuVariants>

export const contextMenuDefaults = {
    defaultVariants: contextMenuVariants.defaultVariants,
    slots: {} as Partial<Record<ContextMenuSlots, string>>
}
