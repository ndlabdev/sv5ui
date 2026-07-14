import { tv, type VariantProps } from 'tailwind-variants'

export const toggleVariants = tv({
    slots: {
        base: [
            'rounded-md font-medium inline-flex items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-75',
            'transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2'
        ],
        label: 'truncate',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0'
    },
    variants: {
        variant: {
            outline: {
                base: 'ring ring-inset ring-outline-variant text-on-surface-variant hover:bg-surface-container-highest active:bg-surface-container-highest disabled:bg-transparent'
            },
            soft: {
                base: 'text-on-surface bg-surface-container-highest hover:bg-surface-container-highest/80 active:bg-surface-container-highest/70 disabled:bg-surface-container-highest'
            },
            subtle: {
                base: 'text-on-surface ring ring-inset ring-outline-variant bg-surface-container-highest hover:bg-surface-container-highest/80 active:bg-surface-container-highest/70 disabled:bg-surface-container-highest'
            },
            ghost: {
                base: 'text-on-surface-variant hover:bg-surface-container-highest active:bg-surface-container-highest disabled:bg-transparent'
            }
        },
        color: {
            primary: {
                base: 'data-[state=on]:bg-primary-container data-[state=on]:text-on-primary-container focus-visible:outline-primary'
            },
            secondary: {
                base: 'data-[state=on]:bg-secondary-container data-[state=on]:text-on-secondary-container focus-visible:outline-secondary'
            },
            tertiary: {
                base: 'data-[state=on]:bg-tertiary-container data-[state=on]:text-on-tertiary-container focus-visible:outline-tertiary'
            },
            success: {
                base: 'data-[state=on]:bg-success-container data-[state=on]:text-on-success-container focus-visible:outline-success'
            },
            warning: {
                base: 'data-[state=on]:bg-warning-container data-[state=on]:text-on-warning-container focus-visible:outline-warning'
            },
            error: {
                base: 'data-[state=on]:bg-error-container data-[state=on]:text-on-error-container focus-visible:outline-error'
            },
            info: {
                base: 'data-[state=on]:bg-info-container data-[state=on]:text-on-info-container focus-visible:outline-info'
            },
            surface: {
                base: 'data-[state=on]:bg-inverse-surface data-[state=on]:text-inverse-on-surface focus-visible:outline-outline'
            }
        },
        size: {
            xs: {
                base: 'px-2 py-1 text-xs gap-1 rounded',
                leadingIcon: 'size-3.5',
                trailingIcon: 'size-3.5'
            },
            sm: {
                base: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-md',
                leadingIcon: 'size-4',
                trailingIcon: 'size-4'
            },
            md: {
                base: 'px-3 py-2 text-sm gap-1.5 rounded-md',
                leadingIcon: 'size-5',
                trailingIcon: 'size-5'
            },
            lg: {
                base: 'px-4 py-2.5 text-sm gap-2 rounded-md',
                leadingIcon: 'size-5',
                trailingIcon: 'size-5'
            },
            xl: {
                base: 'px-5 py-3 text-base gap-2.5 rounded-lg',
                leadingIcon: 'size-6',
                trailingIcon: 'size-6'
            }
        },
        block: {
            true: {
                base: 'w-full'
            }
        },
        square: {
            true: ''
        }
    },
    compoundVariants: [
        { variant: 'outline', color: 'primary', class: { base: 'data-[state=on]:ring-primary' } },
        {
            variant: 'outline',
            color: 'secondary',
            class: { base: 'data-[state=on]:ring-secondary' }
        },
        { variant: 'outline', color: 'tertiary', class: { base: 'data-[state=on]:ring-tertiary' } },
        { variant: 'outline', color: 'success', class: { base: 'data-[state=on]:ring-success' } },
        { variant: 'outline', color: 'warning', class: { base: 'data-[state=on]:ring-warning' } },
        { variant: 'outline', color: 'error', class: { base: 'data-[state=on]:ring-error' } },
        { variant: 'outline', color: 'info', class: { base: 'data-[state=on]:ring-info' } },
        {
            variant: 'outline',
            color: 'surface',
            class: { base: 'data-[state=on]:ring-inverse-surface' }
        },

        {
            variant: 'subtle',
            color: 'primary',
            class: { base: 'data-[state=on]:ring-primary/25' }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: { base: 'data-[state=on]:ring-secondary/25' }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: { base: 'data-[state=on]:ring-tertiary/25' }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: { base: 'data-[state=on]:ring-success/25' }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: { base: 'data-[state=on]:ring-warning/25' }
        },
        { variant: 'subtle', color: 'error', class: { base: 'data-[state=on]:ring-error/25' } },
        { variant: 'subtle', color: 'info', class: { base: 'data-[state=on]:ring-info/25' } },
        {
            variant: 'subtle',
            color: 'surface',
            class: { base: 'data-[state=on]:ring-inverse-surface' }
        },

        { square: true, size: 'xs', class: { base: 'p-1' } },
        { square: true, size: 'sm', class: { base: 'p-1.5' } },
        { square: true, size: 'md', class: { base: 'p-1.5' } },
        { square: true, size: 'lg', class: { base: 'p-2' } },
        { square: true, size: 'xl', class: { base: 'p-2.5' } }
    ],
    defaultVariants: {
        variant: 'ghost',
        color: 'primary',
        size: 'md'
    }
})

export type ToggleVariantProps = VariantProps<typeof toggleVariants>
export type ToggleSlots = keyof ReturnType<typeof toggleVariants>

export const toggleDefaults = {
    defaultVariants: toggleVariants.defaultVariants,
    slots: {} as Partial<Record<ToggleSlots, string>>
}
