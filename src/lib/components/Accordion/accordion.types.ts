import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { BaseAccordionRootPropsWithoutHTML, AccordionContentPropsWithoutHTML } from 'bits-ui'
import type { AccordionSlots } from './accordion.variants.js'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Configuration for an individual accordion item.
 *
 * @example
 * ```ts
 * const item: AccordionItem = {
 *   label: 'Section Title',
 *   content: 'Section content goes here',
 *   icon: 'lucide:settings',
 *   value: 'section-1'
 * }
 * ```
 */
export interface AccordionItem {
    /**
     * The visible text displayed in the accordion trigger/header.
     */
    label?: string

    /**
     * Icon displayed before the label (leading position).
     * Supports any Iconify icon name (e.g., 'lucide:home', 'mdi:account').
     */
    icon?: string

    /**
     * Icon displayed after the label (trailing position).
     * Overrides the global `trailingIcon` prop for this item.
     * Supports any Iconify icon name.
     */
    trailingIcon?: string

    /**
     * The text content shown when the accordion item is expanded.
     * For complex content, use the `body` or `content` snippet instead.
     */
    content?: string

    /**
     * Unique identifier for this item.
     * Used to control which item(s) are expanded via the `value` prop.
     * @default String(index) - Falls back to the item's index as a string
     */
    value?: string

    /**
     * Whether this specific item is disabled.
     * Disabled items cannot be expanded or collapsed by the user.
     * @default false
     */
    disabled?: boolean

    /**
     * Additional CSS classes applied to this item's container element.
     */
    class?: ClassNameValue

    /**
     * Override classes for specific slots within this item.
     * Allows fine-grained styling control per item.
     */
    ui?: Partial<
        Pick<
            Record<AccordionSlots, ClassNameValue>,
            | 'item'
            | 'header'
            | 'trigger'
            | 'leadingIcon'
            | 'label'
            | 'trailingIcon'
            | 'content'
            | 'body'
        >
    >
}

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to accordion snippet slots.
 * Provides context about the current item and its state.
 */
export interface AccordionSlotProps {
    /** The current accordion item data */
    item: AccordionItem
    /** Zero-based index of the item in the items array */
    index: number
    /** Whether this item is currently expanded */
    open: boolean
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Accordion component.
 *
 * Extends bits-ui's base accordion props for behavior (disabled, loop, orientation)
 * and content props (forceMount).
 *
 * @example
 * ```svelte
 * <Accordion
 *   type="single"
 *   items={faqItems}
 *   bind:value={openItem}
 *   ui={{ trigger: 'font-semibold' }}
 * />
 * ```
 *
 * @see https://bits-ui.com/docs/components/accordion
 */
export interface AccordionProps
    extends
        Omit<BaseAccordionRootPropsWithoutHTML, 'loop'>,
        Pick<AccordionContentPropsWithoutHTML, 'forceMount'> {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------

    /**
     * Array of accordion items to render.
     * Each item can have a label, content, icon, and optional styling overrides.
     */
    items?: AccordionItem[]

    /**
     * Default icon displayed on the trailing side of all triggers.
     * Typically used for expand/collapse indicators.
     * Can be overridden per-item via `item.trailingIcon`.
     * @default 'lucide:chevron-down'
     */
    trailingIcon?: string

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Controls how many items can be expanded simultaneously.
     * - `'single'`: Only one item can be open at a time (default)
     * - `'multiple'`: Multiple items can be open simultaneously
     * @default 'single'
     */
    type?: 'single' | 'multiple'

    /**
     * The currently expanded item value(s).
     * - For `type="single"`: `string | undefined`
     * - For `type="multiple"`: `string[] | undefined`
     *
     * Use `bind:value` for two-way binding.
     */
    value?: string | string[]

    /**
     * Callback fired when the expanded item(s) change.
     * Receives the new value (string for single, string[] for multiple).
     */
    onValueChange?: (value: string | string[]) => void

    /**
     * Whether to cycle focus when reaching the first/last item
     * using keyboard navigation.
     * @default false
     */
    loop?: boolean

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Override classes for accordion component slots.
     * Allows customization of root, item, header, trigger, content, body,
     * label, leadingIcon, and trailingIcon elements.
     *
     * @example
     * ```ts
     * ui={{
     *   trigger: 'py-4 hover:bg-muted',
     *   body: 'text-muted-foreground'
     * }}
     * ```
     */
    ui?: Partial<Record<AccordionSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root accordion container.
     */
    class?: ClassNameValue

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Custom snippet for the leading section of all item triggers.
     * Replaces the default leading icon when provided.
     *
     * @param props - Contains `{ item, index, open }`
     *
     * @example
     * ```svelte
     * {#snippet leading({ item, open })}
     *   <Avatar src={item.avatar} size="sm" />
     * {/snippet}
     * ```
     */
    leading?: Snippet<[AccordionSlotProps]>

    /**
     * Custom snippet for the label section of all item triggers.
     * Replaces the default `item.label` text when provided.
     *
     * @param props - Contains `{ item, index, open }`
     *
     * @example
     * ```svelte
     * {#snippet label({ item, open })}
     *   <span class:font-bold={open}>{item.label}</span>
     *   {#if item.badge}<Badge>{item.badge}</Badge>{/if}
     * {/snippet}
     * ```
     */
    label?: Snippet<[AccordionSlotProps]>

    /**
     * Custom snippet for the trailing section of all item triggers.
     * Replaces the default trailing icon when provided.
     *
     * @param props - Contains `{ item, index, open }`
     *
     * @example
     * ```svelte
     * {#snippet trailing({ open })}
     *   <Icon name={open ? 'lucide:minus' : 'lucide:plus'} />
     * {/snippet}
     * ```
     */
    trailing?: Snippet<[AccordionSlotProps]>

    /**
     * Custom snippet for the entire content area.
     * Provides full control over the expanded content rendering.
     * When used, `body` snippet and `item.content` are ignored.
     *
     * @param props - Contains `{ item, index, open }`
     *
     * @example
     * ```svelte
     * {#snippet content({ item })}
     *   <div class="custom-content-wrapper">
     *     <p>{item.content}</p>
     *     <Button>Action</Button>
     *   </div>
     * {/snippet}
     * ```
     */
    content?: Snippet<[AccordionSlotProps]>

    /**
     * Custom snippet for the body content inside the default content wrapper.
     * Replaces `item.content` text when provided.
     * Use `content` snippet instead for full control over the content area.
     *
     * @param props - Contains `{ item, index, open }`
     *
     * @example
     * ```svelte
     * {#snippet body({ item })}
     *   <p>{item.content}</p>
     *   <a href={item.link}>Learn more</a>
     * {/snippet}
     * ```
     */
    body?: Snippet<[AccordionSlotProps]>
}
