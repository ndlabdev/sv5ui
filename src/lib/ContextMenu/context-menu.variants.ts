import { tv, type VariantProps } from 'tailwind-variants'

// Per-item color classes — static map, O(1) lookup, no TV re-instantiation per item
// Default highlight is here (not in base item slot) to avoid class conflicts
export const itemColorClasses: Record<string, { item: string; itemLeadingIcon: string }> = {
    default: {
        item: 'data-[highlighted]:bg-surface-container-highest',
        itemLeadingIcon: ''
    },
    primary: {
        item: 'text-primary data-[highlighted]:bg-primary-container data-[highlighted]:text-on-primary-container',
        itemLeadingIcon:
            'text-primary group-data-[highlighted]:text-on-primary-container'
    },
    secondary: {
        item: 'text-secondary data-[highlighted]:bg-secondary-container data-[highlighted]:text-on-secondary-container',
        itemLeadingIcon:
            'text-secondary group-data-[highlighted]:text-on-secondary-container'
    },
    tertiary: {
        item: 'text-tertiary data-[highlighted]:bg-tertiary-container data-[highlighted]:text-on-tertiary-container',
        itemLeadingIcon:
            'text-tertiary group-data-[highlighted]:text-on-tertiary-container'
    },
    success: {
        item: 'text-success data-[highlighted]:bg-success-container data-[highlighted]:text-on-success-container',
        itemLeadingIcon:
            'text-success group-data-[highlighted]:text-on-success-container'
    },
    warning: {
        item: 'text-warning data-[highlighted]:bg-warning-container data-[highlighted]:text-on-warning-container',
        itemLeadingIcon:
            'text-warning group-data-[highlighted]:text-on-warning-container'
    },
    error: {
        item: 'text-error data-[highlighted]:bg-error-container data-[highlighted]:text-on-error-container',
        itemLeadingIcon:
            'text-error group-data-[highlighted]:text-on-error-container'
    },
    info: {
        item: 'text-info data-[highlighted]:bg-info-container data-[highlighted]:text-on-info-container',
        itemLeadingIcon:
            'text-info group-data-[highlighted]:text-on-info-container'
    },
    surface: {
        item: 'text-on-surface-variant data-[highlighted]:bg-surface-container-highest data-[highlighted]:text-on-surface',
        itemLeadingIcon:
            'text-on-surface-variant group-data-[highlighted]:text-on-surface'
    }
}

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
            'group relative flex items-center gap-2 w-full rounded-sm px-2 cursor-pointer select-none',
            'focus:outline-none',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
        ],
        itemLeadingIcon: 'shrink-0',
        itemLabel: 'flex-1 truncate',
        itemTrailingKbds: 'ml-auto flex items-center gap-0.5',
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
        ]
    },
    variants: {
        transition: {
            true: {
                content: [
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                ],
                subContent: [
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                ]
            }
        },
        size: {
            xs: {
                item: 'py-1 text-xs',
                subTrigger: 'py-1 text-xs',
                itemLeadingIcon: 'size-3',
                subTriggerIcon: 'size-3',
                itemIndicator: 'size-3',
                label: 'text-[10px]'
            },
            sm: {
                item: 'py-1.5 text-xs',
                subTrigger: 'py-1.5 text-xs',
                itemLeadingIcon: 'size-3.5',
                subTriggerIcon: 'size-3.5',
                itemIndicator: 'size-3.5',
                label: 'text-[11px]'
            },
            md: {
                item: 'py-1.5 text-sm',
                subTrigger: 'py-1.5 text-sm',
                itemLeadingIcon: 'size-4',
                subTriggerIcon: 'size-4',
                itemIndicator: 'size-4'
            },
            lg: {
                item: 'py-2 text-sm',
                subTrigger: 'py-2 text-sm',
                itemLeadingIcon: 'size-5',
                subTriggerIcon: 'size-5',
                itemIndicator: 'size-5'
            },
            xl: {
                item: 'py-2.5 text-base',
                subTrigger: 'py-2.5 text-base',
                itemLeadingIcon: 'size-5',
                subTriggerIcon: 'size-5',
                itemIndicator: 'size-5'
            }
        }
    },
    defaultVariants: {
        transition: true,
        size: 'md'
    }
})

export type ContextMenuVariantProps = VariantProps<typeof contextMenuVariants>
export type ContextMenuSlots = keyof ReturnType<typeof contextMenuVariants>

export const contextMenuDefaults = {
    defaultVariants: contextMenuVariants.defaultVariants,
    slots: {} as Partial<Record<ContextMenuSlots, string>>
}
