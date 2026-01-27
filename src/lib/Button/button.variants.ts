// button.variants.ts
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
    base: [
        // Layout
        'inline-flex items-center justify-center gap-2',
        // Typography
        'font-medium',
        // Shape
        'rounded-md',
        // Transition
        'transition-all duration-150',
        // Focus
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        // Disabled
        'disabled:opacity-50 disabled:pointer-events-none',
        // Cursor
        'cursor-pointer'
    ],

    variants: {
        variant: {
            solid: '',
            soft: '',
            outline: 'border bg-transparent',
            ghost: 'bg-transparent',
            link: 'bg-transparent underline-offset-4 hover:underline',
            elevated: 'shadow-md hover:shadow-lg'
        },

        color: {
            primary: 'focus-visible:ring-primary',
            secondary: 'focus-visible:ring-secondary',
            tertiary: 'focus-visible:ring-tertiary',
            error: 'focus-visible:ring-error',
            success: 'focus-visible:ring-success',
            warning: 'focus-visible:ring-warning',
            neutral: 'focus-visible:ring-outline'
        },

        size: {
            xs: 'h-7 px-2 text-xs rounded',
            sm: 'h-8 px-3 text-sm rounded-md',
            md: 'h-10 px-4 text-sm rounded-md',
            lg: 'h-11 px-5 text-base rounded-md',
            xl: 'h-12 px-6 text-lg rounded-lg',
            icon: 'size-10 p-0 rounded-md',
            'icon-xs': 'size-7 p-0 rounded',
            'icon-sm': 'size-8 p-0 rounded-md',
            'icon-lg': 'size-11 p-0 rounded-md',
            'icon-xl': 'size-12 p-0 rounded-lg'
        },

        fullWidth: {
            true: 'w-full',
            false: ''
        },

        loading: {
            true: 'cursor-wait',
            false: ''
        }
    },

    compoundVariants: [
        // ========== SOLID ==========
        {
            variant: 'solid',
            color: 'primary',
            class: 'bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80'
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: 'bg-secondary text-on-secondary hover:bg-secondary/90 active:bg-secondary/80'
        },
        {
            variant: 'solid',
            color: 'tertiary',
            class: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90 active:bg-tertiary/80'
        },
        {
            variant: 'solid',
            color: 'error',
            class: 'bg-error text-on-error hover:bg-error/90 active:bg-error/80'
        },
        {
            variant: 'solid',
            color: 'success',
            class: 'bg-success text-on-success hover:bg-success/90 active:bg-success/80'
        },
        {
            variant: 'solid',
            color: 'warning',
            class: 'bg-warning text-on-warning hover:bg-warning/90 active:bg-warning/80'
        },
        {
            variant: 'solid',
            color: 'neutral',
            class: 'bg-on-surface text-surface hover:bg-on-surface/90 active:bg-on-surface/80'
        },

        // ========== SOFT ==========
        {
            variant: 'soft',
            color: 'primary',
            class: 'bg-primary-container text-on-primary-container hover:bg-primary-container/80'
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80'
        },
        {
            variant: 'soft',
            color: 'error',
            class: 'bg-error-container text-on-error-container hover:bg-error-container/80'
        },
        {
            variant: 'soft',
            color: 'success',
            class: 'bg-success-container text-on-success-container hover:bg-success-container/80'
        },
        {
            variant: 'soft',
            color: 'warning',
            class: 'bg-warning-container text-on-warning-container hover:bg-warning-container/80'
        },
        {
            variant: 'soft',
            color: 'neutral',
            class: 'bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80'
        },

        // ========== OUTLINE ==========
        {
            variant: 'outline',
            color: 'primary',
            class: 'border-primary text-primary hover:bg-primary-container'
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: 'border-secondary text-secondary hover:bg-secondary-container'
        },
        {
            variant: 'outline',
            color: 'tertiary',
            class: 'border-tertiary text-tertiary hover:bg-tertiary-container'
        },
        {
            variant: 'outline',
            color: 'error',
            class: 'border-error text-error hover:bg-error-container'
        },
        {
            variant: 'outline',
            color: 'success',
            class: 'border-success text-success hover:bg-success-container'
        },
        {
            variant: 'outline',
            color: 'warning',
            class: 'border-warning text-warning hover:bg-warning-container'
        },
        {
            variant: 'outline',
            color: 'neutral',
            class: 'border-outline text-on-surface hover:bg-surface-container'
        },

        // ========== GHOST ==========
        {
            variant: 'ghost',
            color: 'primary',
            class: 'text-primary hover:bg-primary-container'
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: 'text-secondary hover:bg-secondary-container'
        },
        {
            variant: 'ghost',
            color: 'tertiary',
            class: 'text-tertiary hover:bg-tertiary-container'
        },
        {
            variant: 'ghost',
            color: 'error',
            class: 'text-error hover:bg-error-container'
        },
        {
            variant: 'ghost',
            color: 'success',
            class: 'text-success hover:bg-success-container'
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: 'text-warning hover:bg-warning-container'
        },
        {
            variant: 'ghost',
            color: 'neutral',
            class: 'text-on-surface-variant hover:bg-surface-container'
        },

        // ========== LINK ==========
        {
            variant: 'link',
            color: 'primary',
            class: 'text-primary'
        },
        {
            variant: 'link',
            color: 'secondary',
            class: 'text-secondary'
        },
        {
            variant: 'link',
            color: 'tertiary',
            class: 'text-tertiary'
        },
        {
            variant: 'link',
            color: 'error',
            class: 'text-error'
        },
        {
            variant: 'link',
            color: 'success',
            class: 'text-success'
        },
        {
            variant: 'link',
            color: 'warning',
            class: 'text-warning'
        },
        {
            variant: 'link',
            color: 'neutral',
            class: 'text-on-surface-variant'
        },

        // ========== ELEVATED ==========
        {
            variant: 'elevated',
            color: 'primary',
            class: 'bg-primary text-on-primary hover:bg-primary/90'
        },
        {
            variant: 'elevated',
            color: 'secondary',
            class: 'bg-surface-container-low text-primary hover:bg-surface-container'
        },
        {
            variant: 'elevated',
            color: 'tertiary',
            class: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90'
        },
        {
            variant: 'elevated',
            color: 'error',
            class: 'bg-error text-on-error hover:bg-error/90'
        },
        {
            variant: 'elevated',
            color: 'success',
            class: 'bg-success text-on-success hover:bg-success/90'
        },
        {
            variant: 'elevated',
            color: 'warning',
            class: 'bg-warning text-on-warning hover:bg-warning/90'
        },
        {
            variant: 'elevated',
            color: 'neutral',
            class: 'bg-surface-container text-on-surface hover:bg-surface-container-high'
        }
    ],

    defaultVariants: {
        variant: 'solid',
        color: 'primary',
        size: 'md',
        fullWidth: false,
        loading: false
    }
})

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
