import { tv } from 'tailwind-variants'

export const mainVariants = tv({
    slots: {
        root: 'min-h-[calc(100svh-var(--ui-header-height,0px))]'
    }
})

export type MainSlots = keyof ReturnType<typeof mainVariants>

export const mainDefaults = {
    defaultVariants: {} as Record<string, never>,
    slots: {} as Partial<Record<MainSlots, string>>
}
