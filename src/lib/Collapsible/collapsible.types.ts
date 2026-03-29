import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { CollapsibleRootPropsWithoutHTML } from 'bits-ui'
import type { CollapsibleSlots } from './collapsible.variants.js'

/**
 * Props for the Collapsible component.
 *
 * Wraps bits-ui's Collapsible primitives with a themed, slot-based API.
 *
 * @example
 * ```svelte
 * <Collapsible>
 *   {#snippet trigger({ open })}
 *     <Button>{open ? 'Hide' : 'Show'}</Button>
 *   {/snippet}
 *   {#snippet content()}
 *     <p>Collapsible content here</p>
 *   {/snippet}
 * </Collapsible>
 * ```
 *
 * @see https://bits-ui.com/docs/components/collapsible
 */
export interface CollapsibleProps extends Pick<
    CollapsibleRootPropsWithoutHTML,
    'open' | 'onOpenChange' | 'onOpenChangeComplete' | 'disabled'
> {
    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------

    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Override classes for collapsible component slots.
     *
     * @example
     * ```ts
     * ui={{ root: 'border rounded-lg', content: 'p-4' }}
     * ```
     */
    ui?: Partial<Record<CollapsibleSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Snippet for the trigger element that toggles the collapsible.
     * Receives `{ open }` to reflect the current state.
     *
     * @example
     * ```svelte
     * {#snippet trigger({ open })}
     *   <Button variant="ghost">
     *     {open ? 'Collapse' : 'Expand'}
     *   </Button>
     * {/snippet}
     * ```
     */
    trigger?: Snippet<[{ open: boolean; props: Record<string, unknown> }]>

    /**
     * Snippet for the collapsible content area.
     *
     * @example
     * ```svelte
     * {#snippet content()}
     *   <p>Hidden content revealed on expand.</p>
     * {/snippet}
     * ```
     */
    content?: Snippet

    /**
     * Default slot children. If provided, rendered inside the root
     * for full custom layouts using bits-ui primitives directly.
     */
    children?: Snippet
}
