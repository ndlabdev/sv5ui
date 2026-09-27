import { tv, type VariantProps } from 'tailwind-variants'
import type { ButtonVariantProps } from '../Button/button.variants.js'

export const themeModeButtonVariants = tv({
    slots: {
        base: '',
        icon: 'shrink-0',
        lightIcon: 'hidden dark:block',
        darkIcon: 'block dark:hidden'
    },
    variants: {
        size: {
            xs: { icon: 'size-3.5' },
            sm: { icon: 'size-4' },
            md: { icon: 'size-5' },
            lg: { icon: 'size-5' },
            xl: { icon: 'size-6' }
        }
    },
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
