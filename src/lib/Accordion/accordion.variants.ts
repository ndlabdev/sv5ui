import { tv, type VariantProps } from 'tailwind-variants'

export const accordionVariants = tv({
    slots: {
        root: 'w-full',
        item: 'border-b border-outline-variant last:border-b-0',
        header: 'flex',
        trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-0',
        content: 'data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
        body: 'text-sm pb-3.5',
        leadingIcon: 'shrink-0 size-5',
        trailingIcon: 'shrink-0 size-5 ms-auto group-data-[state=open]:rotate-180 transition-transform duration-200',
        label: 'text-start break-words'
    },
    variants: {
        disabled: {
            true: {
                trigger: 'cursor-not-allowed opacity-75'
            }
        }
    },
    defaultVariants: {
        disabled: false
    }
})

export type AccordionVariantProps = VariantProps<typeof accordionVariants>
export type AccordionSlots = keyof ReturnType<typeof accordionVariants>

export const accordionDefaults = {
    defaultVariants: accordionVariants.defaultVariants,
    slots: {} as Partial<Record<AccordionSlots, string>>
}
