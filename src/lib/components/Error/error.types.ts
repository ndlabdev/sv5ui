import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ErrorSlots } from './error.variants.js'
import type { ButtonProps } from '../Button/button.types.js'

export type ErrorData = {
    /**
     * HTTP status code of the error.
     */
    statusCode?: number | string

    /**
     * Short status text displayed as the main heading.
     */
    statusMessage?: string

    /**
     * Detailed error description.
     * Hidden automatically when identical to statusMessage.
     */
    message?: string
}

export type ErrorProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the error state as a different HTML element.
     * @default 'main'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific error slots.
     */
    ui?: Partial<Record<ErrorSlots, ClassNameValue>>

    /**
     * Icon displayed above the status code.
     */
    icon?: string

    /**
     * Error object containing statusCode, statusMessage, and message.
     */
    error?: ErrorData

    /**
     * URL the clear button navigates to.
     * Ignored when onClear is provided.
     * @default '/'
     */
    redirect?: string

    /**
     * Customize the clear button with ButtonProps or hide it with false.
     * @default true
     */
    clear?: boolean | ButtonProps

    /**
     * Callback invoked when the clear button is clicked.
     * When provided, the clear button renders as a button instead of a link.
     */
    onClear?: () => void

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom content to replace the default icon area.
     */
    leading?: Snippet

    /**
     * Custom content to replace the default status code rendering.
     */
    statusCode?: Snippet

    /**
     * Custom content to replace the default status message rendering.
     */
    statusMessage?: Snippet

    /**
     * Custom content to replace the default message rendering.
     */
    message?: Snippet

    /**
     * Custom content to replace the default clear button area.
     */
    links?: Snippet

    /**
     * Additional content rendered after the links area.
     */
    children?: Snippet
}
