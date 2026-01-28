import { tv, type VariantProps } from 'tailwind-variants'

export const linkVariants = tv({
    slots: {
        base: [
            'inline-flex items-center',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        ]
    },
    variants: {
        color: {
            primary: '',
            secondary: '',
            tertiary: '',
            success: '',
            warning: '',
            error: '',
            info: ''
        },
        active: {
            true: '',
            false: ''
        },
        disabled: {
            true: {
                base: 'cursor-not-allowed opacity-75'
            },
            false: ''
        },
        raw: {
            true: '',
            false: ''
        }
    },
    compoundVariants: [
        // ========== PRIMARY ==========
        {
            color: 'primary',
            active: true,
            raw: false,
            class: { base: 'text-primary' }
        },
        {
            color: 'primary',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-primary/80 hover:text-primary' }
        },

        // ========== SECONDARY ==========
        {
            color: 'secondary',
            active: true,
            raw: false,
            class: { base: 'text-secondary' }
        },
        {
            color: 'secondary',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-secondary/80 hover:text-secondary' }
        },

        // ========== TERTIARY ==========
        {
            color: 'tertiary',
            active: true,
            raw: false,
            class: { base: 'text-tertiary' }
        },
        {
            color: 'tertiary',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-tertiary/80 hover:text-tertiary' }
        },

        // ========== SUCCESS ==========
        {
            color: 'success',
            active: true,
            raw: false,
            class: { base: 'text-success' }
        },
        {
            color: 'success',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-success/80 hover:text-success' }
        },

        // ========== WARNING ==========
        {
            color: 'warning',
            active: true,
            raw: false,
            class: { base: 'text-warning' }
        },
        {
            color: 'warning',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-warning/80 hover:text-warning' }
        },

        // ========== ERROR ==========
        {
            color: 'error',
            active: true,
            raw: false,
            class: { base: 'text-error' }
        },
        {
            color: 'error',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-error/80 hover:text-error' }
        },

        // ========== INFO ==========
        {
            color: 'info',
            active: true,
            raw: false,
            class: { base: 'text-info' }
        },
        {
            color: 'info',
            active: false,
            disabled: false,
            raw: false,
            class: { base: 'text-info/80 hover:text-info' }
        }
    ],
    defaultVariants: {
        color: 'primary',
        active: false,
        disabled: false,
        raw: false
    }
})

export type LinkVariantProps = VariantProps<typeof linkVariants>
export type LinkSlots = keyof ReturnType<typeof linkVariants>

export const linkDefaults = {
    defaultVariants: linkVariants.defaultVariants,
    slots: {} as Partial<Record<LinkSlots, string>>
}
