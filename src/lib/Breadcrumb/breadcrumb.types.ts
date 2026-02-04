import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { BreadcrumbSlots } from './breadcrumb.variants.js'

export interface BreadcrumbItem {
    /**
     * Display text for the breadcrumb item.
     */
    label: string

    /**
     * The destination URL. When omitted, the item renders as a non-clickable span.
     */
    href?: string

    /**
     * Leading icon name (e.g. 'lucide:home').
     */
    icon?: string

    /**
     * Disables the breadcrumb item.
     * @default false
     */
    disabled?: boolean

    /**
     * Additional CSS classes for this specific item's link/span.
     */
    class?: ClassNameValue
}

export interface BreadcrumbProps {
    /**
     * The HTML element to render as the root wrapper.
     * @default 'nav'
     */
    as?: string

    /**
     * Array of breadcrumb items to render.
     */
    items: BreadcrumbItem[]

    /**
     * Icon name for the separator between items.
     * @default 'lucide:chevron-right'
     */
    separatorIcon?: string

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific breadcrumb slots.
     */
    ui?: Partial<Record<BreadcrumbSlots, ClassNameValue>>

    /**
     * Custom snippet for rendering each breadcrumb item.
     */
    item?: Snippet<[{ item: BreadcrumbItem; index: number; active: boolean }]>

    /**
     * Custom snippet for rendering the separator.
     */
    separator?: Snippet
}
