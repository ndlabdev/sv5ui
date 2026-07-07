import { tv } from 'tailwind-variants'

export const errorVariants = tv({
    slots: {
        root: 'min-h-[calc(100svh-var(--ui-header-height,0px))] flex flex-col items-center justify-center text-center px-4',
        leading: 'flex items-center justify-center mb-4',
        leadingIcon: 'size-12 shrink-0 text-primary',
        statusCode: 'text-base font-semibold text-primary',
        statusMessage: 'mt-2 text-4xl sm:text-5xl font-bold text-on-surface text-balance',
        message: 'mt-4 text-lg text-on-surface-variant text-balance',
        links: 'mt-8 flex items-center justify-center gap-6'
    }
})

export type ErrorSlots = keyof ReturnType<typeof errorVariants>

export const errorDefaults = {
    defaultVariants: {} as Record<string, never>,
    slots: {} as Partial<Record<ErrorSlots, string>>
}
