import { tv } from 'tailwind-variants'

export const footerColumnsVariants = tv({
    slots: {
        root: 'xl:grid xl:grid-cols-3 xl:gap-8',
        left: 'mb-10 xl:mb-0',
        center: 'flex flex-col gap-8 lg:grid lg:auto-cols-fr lg:grid-flow-col xl:col-span-2',
        right: 'mt-10 xl:mt-0',
        column: '',
        label: 'text-sm font-semibold text-on-surface',
        list: 'mt-6 space-y-4',
        item: 'relative',
        link: 'group flex items-center gap-1.5 text-sm',
        linkActive: 'font-medium text-primary',
        linkInactive: 'text-on-surface-variant transition-colors hover:text-on-surface',
        linkLeadingIcon: 'size-5 shrink-0',
        linkLabel: 'truncate',
        linkLabelExternalIcon: 'absolute top-0 inline-block size-3 text-on-surface-variant'
    }
})

export type FooterColumnsSlots = keyof ReturnType<typeof footerColumnsVariants>

export const footerColumnsDefaults = {
    defaultVariants: {} as Record<string, never>,
    slots: {} as Partial<Record<FooterColumnsSlots, string>>
}
