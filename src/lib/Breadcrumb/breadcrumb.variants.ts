import { tv, type VariantProps } from 'tailwind-variants'

export const breadcrumbVariants = tv({
    slots: {
        root: 'relative min-w-0',
        list: 'flex items-center gap-1.5',
        item: 'flex min-w-0 items-center',
        link: [
            'group relative flex items-center gap-1.5 text-sm min-w-0',
            'focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        ],
        linkLeadingIcon: 'shrink-0 size-5',
        linkLabel: 'truncate',
        separator: 'flex',
        separatorIcon: 'shrink-0 size-5 text-on-surface-variant/60'
    },
    variants: {
        active: {
            true: {
                link: 'text-primary font-semibold'
            },
            false: {
                link: 'text-on-surface-variant font-medium'
            }
        },
        disabled: {
            true: {
                link: 'cursor-not-allowed opacity-75'
            },
            false: ''
        }
    },
    compoundVariants: [
        {
            active: false,
            disabled: false,
            class: {
                link: 'hover:text-on-surface transition-colors'
            }
        }
    ],
    defaultVariants: {
        active: false,
        disabled: false
    }
})

export type BreadcrumbVariantProps = VariantProps<typeof breadcrumbVariants>
export type BreadcrumbSlots = keyof ReturnType<typeof breadcrumbVariants>

export const breadcrumbDefaults = {
    defaultVariants: breadcrumbVariants.defaultVariants,
    slots: {} as Partial<Record<BreadcrumbSlots, string>>
}
