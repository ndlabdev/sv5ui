import { tv, type VariantProps } from 'tailwind-variants'

export const slideoverVariants = tv({
    slots: {
        overlay: 'fixed inset-0 z-50',
        content: 'z-50 bg-surface-container-low divide-y divide-outline-variant flex flex-col focus:outline-none',
        header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
        wrapper: '',
        body: 'flex-1 overflow-y-auto p-4 sm:p-6',
        footer: 'flex items-center gap-1.5 p-4 sm:px-6',
        title: 'text-on-surface font-semibold',
        description: 'mt-1 text-on-surface-variant text-sm',
        close: 'absolute top-4 end-4'
    },
    variants: {
        transition: {
            true: {
                overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]'
            }
        },
        side: {
            top: {
                content: 'fixed top-0 inset-x-0 max-h-[90dvh]'
            },
            right: {
                content: 'fixed right-0 inset-y-0 w-full max-w-md'
            },
            bottom: {
                content: 'fixed bottom-0 inset-x-0 max-h-[90dvh]'
            },
            left: {
                content: 'fixed left-0 inset-y-0 w-full max-w-md'
            }
        },
        inset: {
            true: {},
            false: {}
        },
        overlay: {
            true: {
                overlay: 'bg-on-surface/50'
            }
        }
    },
    compoundVariants: [
        // Transition animations per side
        {
            transition: true,
            side: 'top',
            class: {
                content: 'data-[state=open]:animate-[slide-in-full-top_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-top_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: true,
            side: 'right',
            class: {
                content: 'data-[state=open]:animate-[slide-in-full-right_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-right_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: true,
            side: 'bottom',
            class: {
                content: 'data-[state=open]:animate-[slide-in-full-bottom_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-bottom_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: true,
            side: 'left',
            class: {
                content: 'data-[state=open]:animate-[slide-in-full-left_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-left_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        // Inset mode with rounded corners and margins
        {
            inset: true,
            side: 'top',
            class: {
                content: 'top-4 inset-x-4 max-h-[calc(90dvh-2rem)] rounded-xl shadow-lg ring ring-outline-variant'
            }
        },
        {
            inset: true,
            side: 'right',
            class: {
                content: 'right-4 inset-y-4 rounded-xl shadow-lg ring ring-outline-variant'
            }
        },
        {
            inset: true,
            side: 'bottom',
            class: {
                content: 'bottom-4 inset-x-4 max-h-[calc(90dvh-2rem)] rounded-xl shadow-lg ring ring-outline-variant'
            }
        },
        {
            inset: true,
            side: 'left',
            class: {
                content: 'left-4 inset-y-4 rounded-xl shadow-lg ring ring-outline-variant'
            }
        },
        // Non-inset mode with edge styling
        {
            inset: false,
            side: 'top',
            class: {
                content: 'shadow-lg'
            }
        },
        {
            inset: false,
            side: 'right',
            class: {
                content: 'shadow-lg'
            }
        },
        {
            inset: false,
            side: 'bottom',
            class: {
                content: 'shadow-lg'
            }
        },
        {
            inset: false,
            side: 'left',
            class: {
                content: 'shadow-lg'
            }
        }
    ],
    defaultVariants: {
        transition: true,
        side: 'right',
        inset: false,
        overlay: true
    }
})

export type SlideoverVariantProps = VariantProps<typeof slideoverVariants>
export type SlideoverSlots = keyof ReturnType<typeof slideoverVariants>
export type SlideoverSide = NonNullable<SlideoverVariantProps['side']>

export const slideoverDefaults = {
    defaultVariants: slideoverVariants.defaultVariants,
    slots: {} as Partial<Record<SlideoverSlots, string>>
}
