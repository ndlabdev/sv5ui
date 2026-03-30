import type { ClassNameValue } from 'tailwind-merge'
import type { ToasterProps as SonnerToasterProps } from 'svelte-sonner'
import type { ToastVariant } from './toast.variants.js'

export type ToasterProps = Omit<SonnerToasterProps, 'class' | 'toastOptions' | 'richColors'> & {
    /**
     * The visual style variant.
     * - `outline`: Border with surface background, semantic border accent per type (default)
     * - `soft`: Light tinted background per type
     * - `subtle`: Light tinted background + semantic border per type
     * - `solid`: Full semantic color background per type
     * - `accent`: Left color stripe with surface background
     * @default 'outline'
     */
    variant?: ToastVariant

    /**
     * Additional CSS classes for the toaster container.
     */
    class?: ClassNameValue
}
