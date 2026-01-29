import { tv, type VariantProps } from 'tailwind-variants'

export const badgeVariants = tv({
    slots: {
        base: 'font-medium inline-flex items-center',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0',
        leadingAvatarSize: '',
        trailingIcon: 'shrink-0'
    },
    variants: {
        variant: {
            solid: '',
            outline: '',
            soft: '',
            subtle: ''
        },
        color: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
            surface: ''
        },
        size: {
            xs: {
                base: 'text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm',
                leadingIcon: 'size-3',
                leadingAvatarSize: '3xs',
                trailingIcon: 'size-3'
            },
            sm: {
                base: 'text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm',
                leadingIcon: 'size-3',
                leadingAvatarSize: '3xs',
                trailingIcon: 'size-3'
            },
            md: {
                base: 'text-xs px-2 py-1 gap-1 rounded-md',
                leadingIcon: 'size-4',
                leadingAvatarSize: '3xs',
                trailingIcon: 'size-4'
            },
            lg: {
                base: 'text-sm px-2 py-1 gap-1.5 rounded-md',
                leadingIcon: 'size-5',
                leadingAvatarSize: '2xs',
                trailingIcon: 'size-5'
            },
            xl: {
                base: 'text-base px-2.5 py-1 gap-1.5 rounded-md',
                leadingIcon: 'size-6',
                leadingAvatarSize: '2xs',
                trailingIcon: 'size-6'
            }
        },
        square: {
            true: ''
        }
    },
    compoundVariants: [
        // ========== SOLID VARIANTS ==========
        {
            variant: 'solid',
            color: 'primary',
            class: { base: 'bg-primary text-on-primary' }
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: { base: 'bg-secondary text-on-secondary' }
        },
        {
            variant: 'solid',
            color: 'tertiary',
            class: { base: 'bg-tertiary text-on-tertiary' }
        },
        {
            variant: 'solid',
            color: 'success',
            class: { base: 'bg-success text-on-success' }
        },
        {
            variant: 'solid',
            color: 'warning',
            class: { base: 'bg-warning text-on-warning' }
        },
        {
            variant: 'solid',
            color: 'error',
            class: { base: 'bg-error text-on-error' }
        },
        {
            variant: 'solid',
            color: 'info',
            class: { base: 'bg-info text-on-info' }
        },
        {
            variant: 'solid',
            color: 'surface',
            class: { base: 'bg-inverse-surface text-inverse-on-surface' }
        },

        // ========== OUTLINE VARIANTS ==========
        {
            variant: 'outline',
            color: 'primary',
            class: { base: 'text-primary ring ring-inset ring-primary/50' }
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: { base: 'text-secondary ring ring-inset ring-secondary/50' }
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: { base: 'text-tertiary ring ring-inset ring-tertiary/50' }
        },
        {
            variant: 'outline',
            color: 'success',
            class: { base: 'text-success ring ring-inset ring-success/50' }
        },
        {
            variant: 'outline',
            color: 'warning',
            class: { base: 'text-warning ring ring-inset ring-warning/50' }
        },
        {
            variant: 'outline',
            color: 'error',
            class: { base: 'text-error ring ring-inset ring-error/50' }
        },
        {
            variant: 'outline',
            color: 'info',
            class: { base: 'text-info ring ring-inset ring-info/50' }
        },
        {
            variant: 'outline',
            color: 'surface',
            class: { base: 'text-on-surface-variant ring ring-inset ring-outline-variant' }
        },

        // ========== SOFT VARIANTS ==========
        {
            variant: 'soft',
            color: 'primary',
            class: { base: 'bg-primary-container text-on-primary-container' }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: { base: 'bg-secondary-container text-on-secondary-container' }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: { base: 'bg-tertiary-container text-on-tertiary-container' }
        },
        {
            variant: 'soft',
            color: 'success',
            class: { base: 'bg-success-container text-on-success-container' }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: { base: 'bg-warning-container text-on-warning-container' }
        },
        {
            variant: 'soft',
            color: 'error',
            class: { base: 'bg-error-container text-on-error-container' }
        },
        {
            variant: 'soft',
            color: 'info',
            class: { base: 'bg-info-container text-on-info-container' }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: { base: 'bg-surface-container-highest text-on-surface' }
        },

        // ========== SUBTLE VARIANTS ==========
        {
            variant: 'subtle',
            color: 'primary',
            class: { base: 'bg-primary-container text-on-primary-container ring ring-inset ring-primary/25' }
        },
        {
            variant: 'subtle',
            color: 'secondary',
            class: { base: 'bg-secondary-container text-on-secondary-container ring ring-inset ring-secondary/25' }
        },
        {
            variant: 'subtle',
            color: 'tertiary',
            class: { base: 'bg-tertiary-container text-on-tertiary-container ring ring-inset ring-tertiary/25' }
        },
        {
            variant: 'subtle',
            color: 'success',
            class: { base: 'bg-success-container text-on-success-container ring ring-inset ring-success/25' }
        },
        {
            variant: 'subtle',
            color: 'warning',
            class: { base: 'bg-warning-container text-on-warning-container ring ring-inset ring-warning/25' }
        },
        {
            variant: 'subtle',
            color: 'error',
            class: { base: 'bg-error-container text-on-error-container ring ring-inset ring-error/25' }
        },
        {
            variant: 'subtle',
            color: 'info',
            class: { base: 'bg-info-container text-on-info-container ring ring-inset ring-info/25' }
        },
        {
            variant: 'subtle',
            color: 'surface',
            class: { base: 'bg-surface-container-highest text-on-surface ring ring-inset ring-outline-variant' }
        },

        // ========== SQUARE SIZE ADJUSTMENTS ==========
        { square: true, size: 'xs', class: { base: 'p-0.5' } },
        { square: true, size: 'sm', class: { base: 'p-1' } },
        { square: true, size: 'md', class: { base: 'p-1' } },
        { square: true, size: 'lg', class: { base: 'p-1' } },
        { square: true, size: 'xl', class: { base: 'p-1' } }
    ],
    defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
    }
})

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
export type BadgeSlots = keyof ReturnType<typeof badgeVariants>

export const badgeDefaults = {
    defaultVariants: badgeVariants.defaultVariants,
    slots: {} as Partial<Record<BadgeSlots, string>>
}
