import { tv } from 'tailwind-variants'

export const footerVariants = tv({
    slots: {
        root: 'border-t border-outline-variant',
        top: 'py-8 lg:py-12',
        container:
            'flex flex-col items-center gap-y-3 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-x-3 lg:py-4',
        left: 'flex items-center justify-center gap-x-1.5 text-sm text-on-surface-variant lg:order-1 lg:flex-1 lg:justify-start',
        center: 'flex items-center justify-center lg:order-2',
        right: 'flex items-center justify-center gap-x-1.5 lg:order-3 lg:flex-1 lg:justify-end',
        bottom: 'py-8 text-sm text-on-surface-variant lg:py-12'
    }
})

export type FooterSlots = keyof ReturnType<typeof footerVariants>

export const footerDefaults = {
    defaultVariants: {} as Record<string, never>,
    slots: {} as Partial<Record<FooterSlots, string>>
}
