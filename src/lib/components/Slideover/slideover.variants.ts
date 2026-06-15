import { tv, type VariantProps } from 'tailwind-variants'

export const slideoverVariants = tv({
    slots: {
        overlay: 'fixed inset-0 z-50',
        content:
            'z-50 bg-surface-container-low divide-y divide-outline-variant flex flex-col focus:outline-none',
        header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
        wrapper: '',
        body: 'flex-1 overflow-y-auto p-4 sm:p-6',
        footer: 'flex items-center gap-1.5 p-4 sm:px-6',
        title: 'text-on-surface font-semibold',
        description: 'mt-1 text-on-surface-variant text-sm',
        actions: 'flex items-center gap-1.5 shrink-0',
        close: 'absolute top-4 end-4'
    },
    variants: {
        transition: {
            none: {},
            fade: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
                content:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]'
            },
            slide: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]'
            },
            scale: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
                content:
                    'data-[state=open]:animate-[scale-in_200ms_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[scale-out_150ms_cubic-bezier(0.32,0.72,0,1)]'
            }
        },
        side: {
            top: {
                content: 'fixed top-0 inset-x-0'
            },
            right: {
                content: 'fixed right-0 inset-y-0 w-full'
            },
            bottom: {
                content: 'fixed bottom-0 inset-x-0'
            },
            left: {
                content: 'fixed left-0 inset-y-0 w-full'
            }
        },
        size: {
            sm: {},
            md: {},
            lg: {},
            xl: {},
            full: {}
        },
        inset: {
            true: {},
            false: {
                content: 'shadow-lg'
            }
        },
        overlay: {
            true: {
                overlay: 'bg-on-surface/50'
            }
        }
    },
    compoundVariants: [
        // Side-specific slide animations
        {
            transition: 'slide',
            side: 'top',
            class: {
                content:
                    'data-[state=open]:animate-[slide-in-full-top_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-top_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: 'slide',
            side: 'right',
            class: {
                content:
                    'data-[state=open]:animate-[slide-in-full-right_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-right_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: 'slide',
            side: 'bottom',
            class: {
                content:
                    'data-[state=open]:animate-[slide-in-full-bottom_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-bottom_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        {
            transition: 'slide',
            side: 'left',
            class: {
                content:
                    'data-[state=open]:animate-[slide-in-full-left_200ms_ease-out,fade-in_200ms_ease-out] data-[state=closed]:animate-[slide-out-full-left_150ms_ease-in,fade-out_150ms_ease-in]'
            }
        },
        // Sizes — left/right control width, top/bottom control height
        { side: ['left', 'right'], size: 'sm', class: { content: 'max-w-sm' } },
        { side: ['left', 'right'], size: 'md', class: { content: 'max-w-md' } },
        { side: ['left', 'right'], size: 'lg', class: { content: 'max-w-lg' } },
        { side: ['left', 'right'], size: 'xl', class: { content: 'max-w-xl' } },
        { side: ['left', 'right'], size: 'full', class: { content: 'max-w-full' } },
        { side: ['top', 'bottom'], size: 'sm', class: { content: 'max-h-[40dvh]' } },
        { side: ['top', 'bottom'], size: 'md', class: { content: 'max-h-[60dvh]' } },
        { side: ['top', 'bottom'], size: 'lg', class: { content: 'max-h-[75dvh]' } },
        { side: ['top', 'bottom'], size: 'xl', class: { content: 'max-h-[90dvh]' } },
        { side: ['top', 'bottom'], size: 'full', class: { content: 'max-h-full' } },
        // Inset positioning + rounded corners + shadow ring per side
        {
            inset: true,
            side: 'top',
            class: {
                content: 'top-4 inset-x-4 rounded-xl shadow-lg ring ring-outline-variant'
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
                content: 'bottom-4 inset-x-4 rounded-xl shadow-lg ring ring-outline-variant'
            }
        },
        {
            inset: true,
            side: 'left',
            class: {
                content: 'left-4 inset-y-4 rounded-xl shadow-lg ring ring-outline-variant'
            }
        }
    ],
    defaultVariants: {
        transition: 'slide',
        side: 'right',
        size: 'md',
        inset: false,
        overlay: true
    }
})

export type SlideoverVariantProps = VariantProps<typeof slideoverVariants>
export type SlideoverSlots = keyof ReturnType<typeof slideoverVariants>

export const slideoverDefaults = {
    defaultVariants: slideoverVariants.defaultVariants,
    slots: {} as Partial<Record<SlideoverSlots, string>>
}
