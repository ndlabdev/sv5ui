import { tv, type VariantProps } from 'tailwind-variants'

export const separatorVariants = tv({
    slots: {
        root: 'flex items-center text-center',
        border: '',
        container: 'font-medium flex',
        icon: 'shrink-0',
        avatar: 'shrink-0',
        avatarSize: '2xs',
        label: ''
    },
    variants: {
        color: {
            primary: {
                border: 'border-primary',
                label: 'text-primary',
                icon: 'text-primary'
            },
            secondary: {
                border: 'border-secondary',
                label: 'text-secondary',
                icon: 'text-secondary'
            },
            tertiary: {
                border: 'border-tertiary',
                label: 'text-tertiary',
                icon: 'text-tertiary'
            },
            success: {
                border: 'border-success',
                label: 'text-success',
                icon: 'text-success'
            },
            warning: {
                border: 'border-warning',
                label: 'text-warning',
                icon: 'text-warning'
            },
            error: {
                border: 'border-error',
                label: 'text-error',
                icon: 'text-error'
            },
            info: {
                border: 'border-info',
                label: 'text-info',
                icon: 'text-info'
            },
            surface: {
                border: 'border-outline-variant',
                label: 'text-on-surface-variant',
                icon: 'text-on-surface-variant'
            }
        },
        size: {
            xs: { label: 'text-xs', icon: 'size-3' },
            sm: { label: 'text-xs', icon: 'size-3.5' },
            md: { label: 'text-sm', icon: 'size-4' },
            lg: { label: 'text-sm', icon: 'size-5' },
            xl: { label: 'text-base', icon: 'size-6' }
        },
        type: {
            solid: { border: 'border-solid' },
            dashed: { border: 'border-dashed' },
            dotted: { border: 'border-dotted' }
        },
        orientation: {
            horizontal: {
                root: 'w-full flex-row',
                border: 'w-full flex-1',
                container: 'mx-3 whitespace-nowrap'
            },
            vertical: {
                root: 'h-full flex-col',
                border: 'h-full flex-1',
                container: 'my-2'
            }
        }
    },
    compoundVariants: [
        // Horizontal border sizes
        { orientation: 'horizontal', size: 'xs', class: { border: 'border-t' } },
        { orientation: 'horizontal', size: 'sm', class: { border: 'border-t-2' } },
        { orientation: 'horizontal', size: 'md', class: { border: 'border-t-[3px]' } },
        { orientation: 'horizontal', size: 'lg', class: { border: 'border-t-4' } },
        { orientation: 'horizontal', size: 'xl', class: { border: 'border-t-[5px]' } },
        // Vertical border sizes
        { orientation: 'vertical', size: 'xs', class: { border: 'border-s' } },
        { orientation: 'vertical', size: 'sm', class: { border: 'border-s-2' } },
        { orientation: 'vertical', size: 'md', class: { border: 'border-s-[3px]' } },
        { orientation: 'vertical', size: 'lg', class: { border: 'border-s-4' } },
        { orientation: 'vertical', size: 'xl', class: { border: 'border-s-[5px]' } }
    ],
    defaultVariants: {
        color: 'surface',
        size: 'xs',
        type: 'solid',
        orientation: 'horizontal'
    }
})

export type SeparatorVariantProps = VariantProps<typeof separatorVariants>
export type SeparatorSlots = keyof ReturnType<typeof separatorVariants>

export const separatorDefaults = {
    defaultVariants: separatorVariants.defaultVariants,
    slots: {} as Partial<Record<SeparatorSlots, string>>
}
