import { tv, type VariantProps } from 'tailwind-variants'

export const resizableVariants = tv({
    slots: {
        root: 'flex h-full w-full data-[dragging]:select-none',
        pane: 'relative overflow-hidden',
        handle: [
            'group relative flex shrink-0 touch-none items-center justify-center',
            'bg-outline-variant/60 transition-colors duration-150',
            'hover:bg-primary/60 data-[active]:bg-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-1',
            "before:absolute before:z-10 before:content-['']",
            'data-[locked]:pointer-events-none data-[locked]:cursor-default data-[locked]:bg-outline-variant/30'
        ],
        grip: 'pointer-events-none rounded-full bg-on-surface-variant/60 transition-colors duration-150 group-hover:bg-on-primary/80 group-data-[active]:bg-on-primary'
    },
    variants: {
        direction: {
            horizontal: {
                root: 'flex-row data-[dragging]:cursor-col-resize',
                handle: 'h-full cursor-col-resize before:inset-y-0 before:-inset-x-2',
                grip: 'h-6 w-0.5'
            },
            vertical: {
                root: 'flex-col data-[dragging]:cursor-row-resize',
                handle: 'w-full cursor-row-resize before:inset-x-0 before:-inset-y-2',
                grip: 'h-0.5 w-6'
            }
        },
        color: {
            primary: { handle: 'hover:bg-primary/60 data-[active]:bg-primary' },
            secondary: { handle: 'hover:bg-secondary/60 data-[active]:bg-secondary' },
            tertiary: { handle: 'hover:bg-tertiary/60 data-[active]:bg-tertiary' },
            success: { handle: 'hover:bg-success/60 data-[active]:bg-success' },
            warning: { handle: 'hover:bg-warning/60 data-[active]:bg-warning' },
            error: { handle: 'hover:bg-error/60 data-[active]:bg-error' },
            info: { handle: 'hover:bg-info/60 data-[active]:bg-info' },
            surface: { handle: 'hover:bg-outline data-[active]:bg-outline' }
        },
        size: {
            xs: { grip: '' },
            sm: { grip: '' },
            md: { grip: '' },
            lg: { grip: '' },
            xl: { grip: '' }
        },
        disabled: {
            true: { handle: 'pointer-events-none cursor-not-allowed opacity-60' },
            false: {}
        }
    },
    compoundVariants: [
        { direction: 'horizontal', size: 'xs', class: { handle: 'w-0.5' } },
        { direction: 'horizontal', size: 'sm', class: { handle: 'w-1' } },
        { direction: 'horizontal', size: 'md', class: { handle: 'w-1.5' } },
        { direction: 'horizontal', size: 'lg', class: { handle: 'w-2' } },
        { direction: 'horizontal', size: 'xl', class: { handle: 'w-3' } },
        { direction: 'vertical', size: 'xs', class: { handle: 'h-0.5' } },
        { direction: 'vertical', size: 'sm', class: { handle: 'h-1' } },
        { direction: 'vertical', size: 'md', class: { handle: 'h-1.5' } },
        { direction: 'vertical', size: 'lg', class: { handle: 'h-2' } },
        { direction: 'vertical', size: 'xl', class: { handle: 'h-3' } },
        { direction: 'horizontal', size: 'lg', class: { grip: 'h-8' } },
        { direction: 'horizontal', size: 'xl', class: { grip: 'h-10 w-1' } },
        { direction: 'vertical', size: 'lg', class: { grip: 'w-8' } },
        { direction: 'vertical', size: 'xl', class: { grip: 'h-1 w-10' } }
    ],
    defaultVariants: {
        direction: 'horizontal',
        color: 'primary',
        size: 'md'
    }
})

export type ResizableVariantProps = VariantProps<typeof resizableVariants>
export type ResizableSlots = keyof ReturnType<typeof resizableVariants>

export const resizableDefaults = {
    defaultVariants: resizableVariants.defaultVariants,
    slots: {} as Partial<Record<ResizableSlots, string>>
}
