import { tv, type VariantProps } from 'tailwind-variants'

export const stepperVariants = tv({
    slots: {
        root: 'flex flex-col gap-4 w-full',
        list: 'flex list-none p-0 m-0',
        item: 'group relative flex flex-1',
        trigger: [
            'group/trigger relative z-10 flex w-full gap-3 text-start rounded-md',
            'enabled:cursor-pointer select-none',
            'focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60'
        ],
        container: 'flex shrink-0 items-center justify-center',
        indicator: [
            'relative z-10 inline-flex items-center justify-center shrink-0 rounded-full font-medium',
            'bg-surface-container-highest text-on-surface-variant',
            'transition-colors',
            'group-focus-visible/trigger:ring-2 group-focus-visible/trigger:ring-offset-2 group-focus-visible/trigger:ring-offset-surface'
        ],
        separator: 'shrink-0 z-0 rounded-full bg-surface-container-highest transition-colors',
        wrapper: 'flex flex-col min-w-0',
        title: 'font-medium text-on-surface transition-colors',
        description: 'text-on-surface-variant',
        content: 'focus:outline-none'
    },
    variants: {
        orientation: {
            horizontal: {
                list: 'flex-row w-full',
                item: 'flex-col items-center',
                trigger: 'flex-col items-center',
                container: 'w-full',
                wrapper: 'items-center text-center pt-2',
                separator: 'absolute h-0.5 left-1/2 right-[-50%] -translate-y-1/2'
            },
            vertical: {
                list: 'flex-col',
                item: 'flex-row',
                trigger: 'flex-row items-stretch',
                container: 'self-stretch flex-col',
                wrapper: 'items-start',
                separator: 'w-0.5 flex-1 my-1'
            }
        },
        size: {
            xs: {
                indicator: 'size-6 text-[10px] *:size-3.5',
                title: 'text-xs',
                description: 'text-[11px]'
            },
            sm: {
                indicator: 'size-7 text-xs *:size-4',
                title: 'text-sm',
                description: 'text-xs'
            },
            md: {
                indicator: 'size-8 text-sm *:size-5',
                title: 'text-sm',
                description: 'text-sm'
            },
            lg: {
                indicator: 'size-10 text-base *:size-5',
                title: 'text-base',
                description: 'text-sm'
            },
            xl: {
                indicator: 'size-12 text-lg *:size-6',
                title: 'text-base',
                description: 'text-sm'
            }
        },
        color: {
            primary: { indicator: 'group-focus-visible/trigger:ring-primary' },
            secondary: { indicator: 'group-focus-visible/trigger:ring-secondary' },
            tertiary: { indicator: 'group-focus-visible/trigger:ring-tertiary' },
            success: { indicator: 'group-focus-visible/trigger:ring-success' },
            warning: { indicator: 'group-focus-visible/trigger:ring-warning' },
            error: { indicator: 'group-focus-visible/trigger:ring-error' },
            info: { indicator: 'group-focus-visible/trigger:ring-info' },
            surface: { indicator: 'group-focus-visible/trigger:ring-outline' }
        }
    },
    compoundVariants: [
        // -------------------------------------------------------------------
        // Color × state — indicator background, separator fill, active title
        // -------------------------------------------------------------------
        {
            color: 'primary',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-primary group-data-[state=completed]:text-on-primary',
                    'group-data-[state=active]:bg-primary group-data-[state=active]:text-on-primary'
                ],
                separator: 'group-data-[state=completed]:bg-primary',
                title: 'group-data-[state=active]:text-primary'
            }
        },
        {
            color: 'secondary',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-secondary group-data-[state=completed]:text-on-secondary',
                    'group-data-[state=active]:bg-secondary group-data-[state=active]:text-on-secondary'
                ],
                separator: 'group-data-[state=completed]:bg-secondary',
                title: 'group-data-[state=active]:text-secondary'
            }
        },
        {
            color: 'tertiary',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-tertiary group-data-[state=completed]:text-on-tertiary',
                    'group-data-[state=active]:bg-tertiary group-data-[state=active]:text-on-tertiary'
                ],
                separator: 'group-data-[state=completed]:bg-tertiary',
                title: 'group-data-[state=active]:text-tertiary'
            }
        },
        {
            color: 'success',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-success group-data-[state=completed]:text-on-success',
                    'group-data-[state=active]:bg-success group-data-[state=active]:text-on-success'
                ],
                separator: 'group-data-[state=completed]:bg-success',
                title: 'group-data-[state=active]:text-success'
            }
        },
        {
            color: 'warning',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-warning group-data-[state=completed]:text-on-warning',
                    'group-data-[state=active]:bg-warning group-data-[state=active]:text-on-warning'
                ],
                separator: 'group-data-[state=completed]:bg-warning',
                title: 'group-data-[state=active]:text-warning'
            }
        },
        {
            color: 'error',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-error group-data-[state=completed]:text-on-error',
                    'group-data-[state=active]:bg-error group-data-[state=active]:text-on-error'
                ],
                separator: 'group-data-[state=completed]:bg-error',
                title: 'group-data-[state=active]:text-error'
            }
        },
        {
            color: 'info',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-info group-data-[state=completed]:text-on-info',
                    'group-data-[state=active]:bg-info group-data-[state=active]:text-on-info'
                ],
                separator: 'group-data-[state=completed]:bg-info',
                title: 'group-data-[state=active]:text-info'
            }
        },
        {
            color: 'surface',
            class: {
                indicator: [
                    'group-data-[state=completed]:bg-inverse-surface group-data-[state=completed]:text-inverse-on-surface',
                    'group-data-[state=active]:bg-inverse-surface group-data-[state=active]:text-inverse-on-surface'
                ],
                separator: 'group-data-[state=completed]:bg-inverse-surface',
                title: 'group-data-[state=active]:text-on-surface'
            }
        },

        // -------------------------------------------------------------------
        // Horizontal × size — separator vertically centered on indicator,
        // horizontal margins equal indicator radius so the line stops at each
        // indicator's edge (never enters the indicator — important so faded
        // disabled indicators don't reveal the line behind them).
        // -------------------------------------------------------------------
        { orientation: 'horizontal', size: 'xs', class: { separator: 'top-3 mx-3' } },
        { orientation: 'horizontal', size: 'sm', class: { separator: 'top-3.5 mx-3.5' } },
        { orientation: 'horizontal', size: 'md', class: { separator: 'top-4 mx-4' } },
        { orientation: 'horizontal', size: 'lg', class: { separator: 'top-5 mx-5' } },
        { orientation: 'horizontal', size: 'xl', class: { separator: 'top-6 mx-6' } },

        // -------------------------------------------------------------------
        // Vertical × size — wrapper bottom padding creates visible line height
        // -------------------------------------------------------------------
        { orientation: 'vertical', size: 'xs', class: { wrapper: 'pb-6' } },
        { orientation: 'vertical', size: 'sm', class: { wrapper: 'pb-7' } },
        { orientation: 'vertical', size: 'md', class: { wrapper: 'pb-8' } },
        { orientation: 'vertical', size: 'lg', class: { wrapper: 'pb-10' } },
        { orientation: 'vertical', size: 'xl', class: { wrapper: 'pb-12' } }
    ],
    defaultVariants: {
        orientation: 'horizontal',
        size: 'md',
        color: 'primary'
    }
})

export type StepperVariantProps = VariantProps<typeof stepperVariants>
export type StepperSlots = keyof ReturnType<typeof stepperVariants>

export const stepperDefaults = {
    defaultVariants: stepperVariants.defaultVariants,
    slots: {} as Partial<Record<StepperSlots, string>>
}
