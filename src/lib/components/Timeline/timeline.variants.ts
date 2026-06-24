import { tv, type VariantProps } from 'tailwind-variants'

export const timelineVariants = tv({
    slots: {
        root: 'flex gap-1.5',
        item: 'group relative flex flex-1 gap-3',
        container: 'relative flex items-center gap-1.5',
        indicator:
            'inline-flex items-center justify-center shrink-0 rounded-full bg-surface-container-highest text-on-surface-variant',
        separator: 'flex-1 rounded-full bg-surface-container-highest',
        wrapper: 'w-full',
        date: 'text-on-surface-variant text-xs',
        title: 'font-medium text-on-surface text-sm',
        description: 'text-on-surface-variant text-wrap text-sm'
    },
    variants: {
        orientation: {
            horizontal: {
                root: 'flex-row w-full',
                item: 'flex-col',
                separator: 'h-0.5'
            },
            vertical: {
                root: 'flex-col',
                container: 'flex-col',
                separator: 'w-0.5'
            }
        },
        color: {
            primary: {
                indicator:
                    'group-data-[state=completed]:bg-primary group-data-[state=completed]:text-on-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-on-primary'
            },
            secondary: {
                indicator:
                    'group-data-[state=completed]:bg-secondary group-data-[state=completed]:text-on-secondary group-data-[state=active]:bg-secondary group-data-[state=active]:text-on-secondary'
            },
            tertiary: {
                indicator:
                    'group-data-[state=completed]:bg-tertiary group-data-[state=completed]:text-on-tertiary group-data-[state=active]:bg-tertiary group-data-[state=active]:text-on-tertiary'
            },
            success: {
                indicator:
                    'group-data-[state=completed]:bg-success group-data-[state=completed]:text-on-success group-data-[state=active]:bg-success group-data-[state=active]:text-on-success'
            },
            warning: {
                indicator:
                    'group-data-[state=completed]:bg-warning group-data-[state=completed]:text-on-warning group-data-[state=active]:bg-warning group-data-[state=active]:text-on-warning'
            },
            error: {
                indicator:
                    'group-data-[state=completed]:bg-error group-data-[state=completed]:text-on-error group-data-[state=active]:bg-error group-data-[state=active]:text-on-error'
            },
            info: {
                indicator:
                    'group-data-[state=completed]:bg-info group-data-[state=completed]:text-on-info group-data-[state=active]:bg-info group-data-[state=active]:text-on-info'
            },
            surface: {
                indicator:
                    'group-data-[state=completed]:bg-inverse-surface group-data-[state=completed]:text-inverse-on-surface group-data-[state=active]:bg-inverse-surface group-data-[state=active]:text-inverse-on-surface'
            }
        },
        size: {
            '3xs': { indicator: 'size-4 *:size-2.5' },
            '2xs': { indicator: 'size-5 *:size-3' },
            xs: { indicator: 'size-6 *:size-3.5' },
            sm: { indicator: 'size-7 *:size-4' },
            md: { indicator: 'size-8 *:size-5' },
            lg: { indicator: 'size-9 *:size-5' },
            xl: { indicator: 'size-10 *:size-6' },
            '2xl': { indicator: 'size-11 *:size-6' },
            '3xl': { indicator: 'size-12 *:size-7' }
        },
        reverse: {
            true: ''
        }
    },
    compoundVariants: [
        // Orientation + reverse (visual direction)
        { orientation: 'vertical', reverse: true, class: { root: 'flex-col-reverse' } },
        { orientation: 'horizontal', reverse: true, class: { root: 'flex-row-reverse' } },

        // Color + separator styling (reverse=false: completed gets color)
        {
            color: 'primary',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-primary' }
        },
        {
            color: 'secondary',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-secondary' }
        },
        {
            color: 'tertiary',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-tertiary' }
        },
        {
            color: 'success',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-success' }
        },
        {
            color: 'warning',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-warning' }
        },
        {
            color: 'error',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-error' }
        },
        {
            color: 'info',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-info' }
        },
        {
            color: 'surface',
            reverse: false,
            class: { separator: 'group-data-[state=completed]:bg-inverse-surface' }
        },

        // Color + separator styling (reverse=true: active AND completed get color)
        {
            color: 'primary',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-primary group-data-[state=completed]:bg-primary'
            }
        },
        {
            color: 'secondary',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-secondary group-data-[state=completed]:bg-secondary'
            }
        },
        {
            color: 'tertiary',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-tertiary group-data-[state=completed]:bg-tertiary'
            }
        },
        {
            color: 'success',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-success group-data-[state=completed]:bg-success'
            }
        },
        {
            color: 'warning',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-warning group-data-[state=completed]:bg-warning'
            }
        },
        {
            color: 'error',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-error group-data-[state=completed]:bg-error'
            }
        },
        {
            color: 'info',
            reverse: true,
            class: {
                separator: 'group-data-[state=active]:bg-info group-data-[state=completed]:bg-info'
            }
        },
        {
            color: 'surface',
            reverse: true,
            class: {
                separator:
                    'group-data-[state=active]:bg-inverse-surface group-data-[state=completed]:bg-inverse-surface'
            }
        },

        // Horizontal + size
        { orientation: 'horizontal', size: '3xs', class: { wrapper: 'pe-4.5' } },
        { orientation: 'horizontal', size: '2xs', class: { wrapper: 'pe-5' } },
        { orientation: 'horizontal', size: 'xs', class: { wrapper: 'pe-5.5' } },
        { orientation: 'horizontal', size: 'sm', class: { wrapper: 'pe-6' } },
        { orientation: 'horizontal', size: 'md', class: { wrapper: 'pe-6.5' } },
        { orientation: 'horizontal', size: 'lg', class: { wrapper: 'pe-7' } },
        { orientation: 'horizontal', size: 'xl', class: { wrapper: 'pe-7.5' } },
        { orientation: 'horizontal', size: '2xl', class: { wrapper: 'pe-8' } },
        { orientation: 'horizontal', size: '3xl', class: { wrapper: 'pe-8.5' } },

        // Vertical + size (mt aligns text with indicator center, pb adds spacing)
        { orientation: 'vertical', size: '3xs', class: { wrapper: '-mt-0.5 pb-4.5' } },
        { orientation: 'vertical', size: '2xs', class: { wrapper: 'pb-5' } },
        { orientation: 'vertical', size: 'xs', class: { wrapper: 'mt-0.5 pb-5.5' } },
        { orientation: 'vertical', size: 'sm', class: { wrapper: 'mt-1 pb-6' } },
        { orientation: 'vertical', size: 'md', class: { wrapper: 'mt-1.5 pb-6.5' } },
        { orientation: 'vertical', size: 'lg', class: { wrapper: 'mt-2 pb-7' } },
        { orientation: 'vertical', size: 'xl', class: { wrapper: 'mt-2.5 pb-7.5' } },
        { orientation: 'vertical', size: '2xl', class: { wrapper: 'mt-3 pb-8' } },
        { orientation: 'vertical', size: '3xl', class: { wrapper: 'mt-3.5 pb-8.5' } }
    ],
    defaultVariants: {
        orientation: 'vertical',
        color: 'primary',
        size: 'md',
        reverse: false
    }
})

export type TimelineVariantProps = VariantProps<typeof timelineVariants>
export type TimelineSlots = keyof ReturnType<typeof timelineVariants>

export const timelineDefaults = {
    defaultVariants: timelineVariants.defaultVariants,
    slots: {} as Partial<Record<TimelineSlots, string>>
}
