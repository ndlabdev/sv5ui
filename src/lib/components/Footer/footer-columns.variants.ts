import { tv } from 'tailwind-variants'

export const footerColumnsVariants = tv({
    slots: {
        root: 'grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4',
        column: '',
        label: 'text-sm font-semibold text-on-surface',
        list: 'mt-4 space-y-3',
        item: 'relative',
        link: 'group flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-on-surface',
        linkLeadingIcon: 'size-4 shrink-0',
        linkLabel: 'truncate',
        linkLabelExternalIcon: 'size-3 shrink-0 self-start text-on-surface-variant'
    }
})

export type FooterColumnsSlots = keyof ReturnType<typeof footerColumnsVariants>

export const footerColumnsDefaults = {
    defaultVariants: {} as Record<string, never>,
    slots: {} as Partial<Record<FooterColumnsSlots, string>>
}
