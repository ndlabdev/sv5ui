import { tv, type VariantProps } from 'tailwind-variants'
import type { ButtonVariantProps } from '../Button/button.variants.js'

export const themeModeButtonVariants = tv({
    slots: {
        base: '',
        icon: 'shrink-0'
    },
    variants: {},
    defaultVariants: {}
})

export type ThemeModeButtonVariantProps = VariantProps<typeof themeModeButtonVariants>
export type ThemeModeButtonSlots = keyof ReturnType<typeof themeModeButtonVariants>

export const themeModeButtonDefaults = {
    defaultVariants: {
        ...themeModeButtonVariants.defaultVariants,
        color: 'surface' as NonNullable<ButtonVariantProps['color']>,
        variant: 'ghost' as NonNullable<ButtonVariantProps['variant']>
    },
    slots: {} as Partial<Record<ThemeModeButtonSlots, string>>
}
