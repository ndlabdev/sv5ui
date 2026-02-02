import { tv, type VariantProps } from 'tailwind-variants'

export const drawerVariants = tv({
    slots: {
        overlay: 'fixed inset-0 z-50 bg-on-surface/50',
        content: 'fixed z-50 bg-surface-container-low ring ring-outline-variant flex focus:outline-none',
        handle: 'shrink-0 rounded-full bg-on-surface-variant/40 transition-opacity',
        container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
        header: '',
        title: 'text-on-surface font-semibold',
        description: 'mt-1 text-on-surface-variant text-sm',
        body: 'flex-1',
        footer: 'flex flex-col gap-1.5'
    },
    variants: {
        direction: {
            top: {
                content: 'mb-24 flex-col-reverse',
                handle: 'mb-4'
            },
            right: {
                content: 'flex-row',
                handle: '!ml-4'
            },
            bottom: {
                content: 'mt-24 flex-col',
                handle: 'mt-4'
            },
            left: {
                content: 'flex-row-reverse',
                handle: '!mr-4'
            }
        },
        inset: {
            true: {
                content: 'rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]'
            }
        },
        snapPoints: {
            true: ''
        }
    },
    compoundVariants: [
        // Vertical directions: auto height
        {
            direction: ['top', 'bottom'],
            class: {
                content: 'h-auto max-h-[96%]',
                handle: '!w-12 !h-1.5 mx-auto'
            }
        },
        {
            direction: ['top', 'bottom'],
            snapPoints: true,
            class: {
                content: 'h-full'
            }
        },
        // Horizontal directions: auto width
        {
            direction: ['right', 'left'],
            class: {
                content: 'w-auto max-w-[calc(100%-2rem)]',
                handle: '!h-12 !w-1.5 mt-auto mb-auto'
            }
        },
        {
            direction: ['right', 'left'],
            snapPoints: true,
            class: {
                content: 'w-full'
            }
        },
        // Direction + inset combinations
        {
            direction: 'top',
            inset: true,
            class: {
                content: 'inset-x-4 top-4'
            }
        },
        {
            direction: 'top',
            inset: false,
            class: {
                content: 'inset-x-0 top-0 rounded-b-lg'
            }
        },
        {
            direction: 'bottom',
            inset: true,
            class: {
                content: 'inset-x-4 bottom-4'
            }
        },
        {
            direction: 'bottom',
            inset: false,
            class: {
                content: 'inset-x-0 bottom-0 rounded-t-lg'
            }
        },
        {
            direction: 'left',
            inset: true,
            class: {
                content: 'inset-y-4 left-4'
            }
        },
        {
            direction: 'left',
            inset: false,
            class: {
                content: 'inset-y-0 left-0 rounded-r-lg'
            }
        },
        {
            direction: 'right',
            inset: true,
            class: {
                content: 'inset-y-4 right-4'
            }
        },
        {
            direction: 'right',
            inset: false,
            class: {
                content: 'inset-y-0 right-0 rounded-l-lg'
            }
        }
    ],
    defaultVariants: {
        direction: 'bottom',
        inset: false
    }
})

export type DrawerVariantProps = VariantProps<typeof drawerVariants>
export type DrawerSlots = keyof ReturnType<typeof drawerVariants>

export const drawerDefaults = {
    defaultVariants: drawerVariants.defaultVariants,
    slots: {} as Partial<Record<DrawerSlots, string>>
}
