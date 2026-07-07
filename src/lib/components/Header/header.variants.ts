import { tv, type VariantProps } from 'tailwind-variants'

export const headerVariants = tv({
    slots: {
        root: 'sticky top-0 z-50 h-(--ui-header-height) border-b border-outline-variant bg-surface/75 backdrop-blur',
        container: 'flex h-full items-center justify-between gap-3',
        left: 'flex items-center gap-1.5 lg:flex-1',
        center: 'hidden lg:flex',
        right: 'flex items-center justify-end gap-1.5 lg:flex-1',
        title: 'flex min-w-0 shrink-0 items-center gap-1.5 text-xl font-bold text-on-surface',
        toggle: 'lg:hidden',
        top: '',
        bottom: '',
        body: ''
    },
    variants: {
        toggleSide: {
            left: {
                toggle: '-ms-1.5'
            },
            right: {
                toggle: '-me-1.5'
            }
        }
    },
    defaultVariants: {
        toggleSide: 'right'
    }
})

export type HeaderVariantProps = VariantProps<typeof headerVariants>
export type HeaderSlots = keyof ReturnType<typeof headerVariants>

export const headerDefaults = {
    defaultVariants: headerVariants.defaultVariants,
    slots: {} as Partial<Record<HeaderSlots, string>>
}
