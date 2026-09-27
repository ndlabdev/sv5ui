import { tv, type VariantProps } from 'tailwind-variants'

export const inputPasswordVariants = tv({
    slots: {
        root: 'w-full',
        toggle: [
            'text-on-surface-variant/75 transition-colors',
            'hover:bg-transparent hover:text-on-surface',
            'active:bg-transparent active:text-on-surface',
            'focus-visible:bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary'
        ],
        meter: 'mt-1.5',
        caps: 'mt-1.5 flex items-center gap-1.5 text-xs text-warning',
        capsIcon: 'size-3.5 shrink-0',
        footer: 'mt-1.5'
    }
})

export type InputPasswordVariantProps = VariantProps<typeof inputPasswordVariants>
export type InputPasswordSlots = keyof ReturnType<typeof inputPasswordVariants>

export const inputPasswordDefaults = {
    defaultVariants: inputPasswordVariants.defaultVariants,
    slots: {} as Partial<Record<InputPasswordSlots, string>>,
    strengthLevels: ['Weak', 'Fair', 'Good', 'Strong'],
    strengthColors: ['error', 'warning', 'info', 'success'] as const
}
