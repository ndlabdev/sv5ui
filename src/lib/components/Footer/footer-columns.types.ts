import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FooterColumnsSlots } from './footer-columns.variants.js'
import type { LinkProps } from '../Link/link.types.js'

export type FooterColumnLink = Omit<LinkProps, 'children' | 'ui'> & {
    /**
     * Link display text.
     */
    label: string

    /**
     * Icon displayed before the label.
     */
    icon?: string
}

export type FooterColumn = {
    /**
     * Column heading text.
     */
    label: string

    /**
     * Links rendered in the column.
     */
    children: FooterColumnLink[]
}

export type FooterColumnsProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the columns as a different HTML element.
     * @default 'nav'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific slots.
     */
    ui?: Partial<Record<FooterColumnsSlots, ClassNameValue>>

    /**
     * Columns of link groups to render.
     */
    columns?: FooterColumn[]

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom rendering for a column heading.
     */
    columnLabel?: Snippet<[{ column: FooterColumn }]>

    /**
     * Custom rendering for a link, replacing the default Link element.
     */
    link?: Snippet<[{ link: FooterColumnLink }]>

    /**
     * Content beside the columns, before them on xl screens.
     */
    left?: Snippet

    /**
     * Content beside the columns, after them on xl screens.
     * Designed for a newsletter or call to action block.
     */
    right?: Snippet

    /**
     * Extra content rendered as an additional column in the grid.
     */
    children?: Snippet
}
