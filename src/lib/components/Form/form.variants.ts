import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Form component variants.
 *
 * The Form component renders a near-styleless `<form>` (or `<div>` for nested forms) —
 * matching Nuxt UI v4's minimal form theme. This exists primarily so users can inject
 * shared form spacing via `defineConfig({ form: { slots: { root: 'space-y-4' } } })`.
 */
export const formVariants = tv({
    slots: {
        root: ''
    }
})

export type FormVariantProps = VariantProps<typeof formVariants>
export type FormSlots = keyof ReturnType<typeof formVariants>

export const formDefaults = {
    defaultVariants: {} as NonNullable<typeof formVariants.defaultVariants>,
    slots: {} as Partial<Record<FormSlots, string>>
}
