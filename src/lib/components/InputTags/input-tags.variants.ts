import { tv, type VariantProps } from 'tailwind-variants'
import type { InputVariantProps } from '../Input/input.variants.js'

export const inputTagsVariants = tv({
    slots: {
        root: [
            'flex-wrap cursor-text',
            'has-disabled:cursor-not-allowed has-disabled:opacity-75',
            'transition-colors'
        ],
        base: [
            'grow bg-transparent placeholder:text-on-surface-variant/50',
            'focus:outline-none disabled:cursor-not-allowed'
        ],
        tag: 'max-w-full',
        tagDelete: [
            'shrink-0 inline-flex items-center justify-center rounded-xs',
            'opacity-75 hover:opacity-100',
            'focus:outline-none transition-opacity'
        ],
        tagDeleteIcon: 'shrink-0',
        tagSize: ''
    },
    variants: {
        variant: {
            outline: { root: 'focus-within:ring-2' },
            soft: { root: 'focus-within:ring-2 focus-within:ring-inset' },
            subtle: { root: 'focus-within:ring-2' },
            ghost: { root: 'focus-within:ring-2 focus-within:ring-inset' },
            none: {}
        },
        color: {
            primary: { root: 'focus-within:ring-primary' },
            secondary: { root: 'focus-within:ring-secondary' },
            tertiary: { root: 'focus-within:ring-tertiary' },
            success: { root: 'focus-within:ring-success' },
            warning: { root: 'focus-within:ring-warning' },
            error: { root: 'focus-within:ring-error' },
            info: { root: 'focus-within:ring-info' },
            surface: { root: 'focus-within:ring-outline' }
        },
        size: {
            xs: { root: 'gap-1', base: 'min-w-16', tagSize: 'xs', tagDeleteIcon: 'size-3' },
            sm: { root: 'gap-1', base: 'min-w-16', tagSize: 'xs', tagDeleteIcon: 'size-3' },
            md: { root: 'gap-1.5', base: 'min-w-20', tagSize: 'sm', tagDeleteIcon: 'size-3' },
            lg: { root: 'gap-1.5', base: 'min-w-20', tagSize: 'sm', tagDeleteIcon: 'size-3.5' },
            xl: { root: 'gap-2', base: 'min-w-24', tagSize: 'md', tagDeleteIcon: 'size-4' }
        }
    },
    compoundVariants: [
        {
            variant: 'soft',
            color: 'primary',
            class: { root: 'focus-within:bg-primary-container/75' }
        },
        {
            variant: 'soft',
            color: 'secondary',
            class: { root: 'focus-within:bg-secondary-container/75' }
        },
        {
            variant: 'soft',
            color: 'tertiary',
            class: { root: 'focus-within:bg-tertiary-container/75' }
        },
        {
            variant: 'soft',
            color: 'success',
            class: { root: 'focus-within:bg-success-container/75' }
        },
        {
            variant: 'soft',
            color: 'warning',
            class: { root: 'focus-within:bg-warning-container/75' }
        },
        {
            variant: 'soft',
            color: 'error',
            class: { root: 'focus-within:bg-error-container/75' }
        },
        {
            variant: 'soft',
            color: 'info',
            class: { root: 'focus-within:bg-info-container/75' }
        },
        {
            variant: 'soft',
            color: 'surface',
            class: { root: 'focus-within:bg-surface-container-highest/75' }
        }
    ],
    defaultVariants: {
        variant: 'outline',
        color: 'primary',
        size: 'md'
    }
})

export type InputTagsVariantProps = VariantProps<typeof inputTagsVariants>
export type InputTagsSlots = keyof ReturnType<typeof inputTagsVariants>

export const inputTagsDefaults = {
    defaultVariants: inputTagsVariants.defaultVariants as {
        variant: NonNullable<InputVariantProps['variant']>
        color: NonNullable<InputVariantProps['color']>
        size: NonNullable<InputVariantProps['size']>
    },
    slots: {} as Partial<Record<InputTagsSlots, string>>
}
