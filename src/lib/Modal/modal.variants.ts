import { tv, type VariantProps } from 'tailwind-variants'

export const modalVariants = tv({
    slots: {
        overlay: 'fixed inset-0 z-50',
        content:
            'z-50 bg-surface-container-low divide-y divide-outline-variant flex flex-col focus:outline-none',
        header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
        wrapper: '',
        body: 'flex-1 p-4 sm:p-6',
        footer: 'flex items-center gap-1.5 p-4 sm:px-6',
        title: 'text-on-surface font-semibold',
        description: 'mt-1 text-on-surface-variant text-sm',
        close: 'absolute top-4 end-4'
    },
    variants: {
        transition: {
            true: {
                overlay:
                    'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
                content:
                    'data-[state=open]:animate-[scale-in_200ms_cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-[scale-out_150ms_cubic-bezier(0.32,0.72,0,1)]'
            }
        },
        fullscreen: {
            true: {
                content: 'inset-0'
            },
            false: {
                content:
                    'w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-outline-variant'
            }
        },
        overlay: {
            true: {
                overlay: 'bg-on-surface/50'
            }
        },
        scrollable: {
            true: {
                overlay: 'overflow-y-auto',
                content: 'relative'
            },
            false: {
                content: 'fixed',
                body: 'overflow-y-auto'
            }
        }
    },
    compoundVariants: [
        {
            scrollable: true,
            fullscreen: false,
            class: {
                overlay: 'grid place-items-center p-4 sm:py-8'
            }
        },
        {
            scrollable: false,
            fullscreen: false,
            class: {
                content:
                    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden'
            }
        }
    ],
    defaultVariants: {
        transition: true,
        fullscreen: false,
        overlay: true,
        scrollable: false
    }
})

export type ModalVariantProps = VariantProps<typeof modalVariants>
export type ModalSlots = keyof ReturnType<typeof modalVariants>

export const modalDefaults = {
    defaultVariants: modalVariants.defaultVariants,
    slots: {} as Partial<Record<ModalSlots, string>>
}
