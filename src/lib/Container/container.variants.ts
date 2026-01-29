import { tv } from 'tailwind-variants'

export const containerVariants = tv({
    slots: {
        root: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
    }
})

export type ContainerSlots = keyof ReturnType<typeof containerVariants>

export const containerDefaults = {
    slots: {} as Partial<Record<ContainerSlots, string>>
}
