import { tv, type VariantProps } from 'tailwind-variants'

export const formFieldVariants = tv({
    slots: {
        root: '',
        wrapper: '',
        labelWrapper: 'flex content-center items-center justify-between gap-1',
        label: 'block font-medium text-on-surface',
        container: 'relative',
        description: 'text-on-surface-variant',
        error: 'mt-2 text-error',
        hint: 'text-on-surface-variant',
        help: 'mt-2 text-on-surface-variant'
    },
    variants: {
        size: {
            xs: {
                label: 'text-xs',
                description: 'text-xs',
                hint: 'text-xs',
                error: 'text-xs',
                help: 'text-xs'
            },
            sm: {
                label: 'text-xs',
                description: 'text-xs',
                hint: 'text-xs',
                error: 'text-xs',
                help: 'text-xs'
            },
            md: {
                label: 'text-sm',
                description: 'text-sm',
                hint: 'text-sm',
                error: 'text-sm',
                help: 'text-sm'
            },
            lg: {
                label: 'text-sm',
                description: 'text-sm',
                hint: 'text-sm',
                error: 'text-sm',
                help: 'text-sm'
            },
            xl: {
                label: 'text-base',
                description: 'text-base',
                hint: 'text-base',
                error: 'text-base',
                help: 'text-base'
            }
        },
        required: {
            true: {
                label: "after:ms-0.5 after:text-error after:content-['*']"
            }
        },
        orientation: {
            vertical: {
                container: 'mt-1'
            },
            horizontal: {
                root: 'grid grid-cols-2 gap-2 items-baseline'
            }
        }
    },
    defaultVariants: {
        size: 'md',
        orientation: 'vertical'
    }
})

export type FormFieldVariantProps = VariantProps<typeof formFieldVariants>
export type FormFieldSlots = keyof ReturnType<typeof formFieldVariants>

export const formFieldDefaults = {
    defaultVariants: formFieldVariants.defaultVariants,
    slots: {} as Partial<Record<FormFieldSlots, string>>
}
