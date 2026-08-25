import { tv, type VariantProps } from 'tailwind-variants'

export const sidebarVariants = tv({
    slots: {
        root: 'group/sidebar z-40 flex h-svh flex-col bg-surface text-on-surface',
        header: 'flex h-(--ui-sidebar-header-height,var(--ui-header-height,4rem)) shrink-0 items-center gap-2 border-b border-outline-variant px-3',
        headerContent: 'flex min-w-0 flex-1 flex-col justify-center',
        title: 'truncate text-sm font-semibold text-on-surface',
        description: 'truncate text-xs text-on-surface-variant',
        headerActions: 'flex shrink-0 items-center gap-1',
        content: 'flex flex-col gap-2 p-3',
        footer: 'mt-auto flex min-h-(--ui-sidebar-footer-height,4rem) shrink-0 flex-col justify-center gap-1 border-t border-outline-variant px-3 py-2',
        toggle: 'shrink-0',
        rail: 'group/rail absolute inset-y-0 z-20 hidden w-4 cursor-col-resize touch-none select-none sm:flex',
        railHandle:
            'h-full w-0.5 rounded-full bg-transparent transition-colors duration-150 group-hover/rail:bg-primary'
    },
    variants: {
        variant: {
            sidebar: {
                root: 'sticky top-0 border-outline-variant'
            },
            floating: {
                root: 'sticky top-2 m-2 h-[calc(100svh-1rem)] rounded-xl border border-outline-variant shadow-lg'
            },
            inset: {
                root: 'sticky top-0 bg-transparent'
            }
        },
        side: {
            left: {
                rail: 'end-0',
                railHandle: 'ms-auto'
            },
            right: {
                root: 'order-last',
                rail: 'start-0',
                railHandle: 'me-auto'
            }
        },
        transition: {
            true: {
                root: 'transition-[width] duration-300 ease-in-out'
            },
            false: {}
        },
        breakpoint: {
            sm: { root: 'hidden sm:flex' },
            md: { root: 'hidden md:flex' },
            lg: { root: 'hidden lg:flex' },
            xl: { root: 'hidden xl:flex' }
        }
    },
    compoundVariants: [
        { variant: 'sidebar', side: 'left', class: { root: 'border-e' } },
        { variant: 'sidebar', side: 'right', class: { root: 'border-s' } }
    ],
    defaultVariants: {
        variant: 'sidebar',
        side: 'left',
        transition: true,
        breakpoint: 'lg'
    }
})

export type SidebarVariantProps = VariantProps<typeof sidebarVariants>
export type SidebarSlots = keyof ReturnType<typeof sidebarVariants>

export const sidebarDefaults = {
    defaultVariants: sidebarVariants.defaultVariants,
    slots: {} as Partial<Record<SidebarSlots, string>>
}
