import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { TabsSlots, TabsVariantProps } from './tabs.variants.js'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Configuration for an individual tab item.
 *
 * @example
 * ```ts
 * const item: TabsItem = {
 *   label: 'Account',
 *   icon: 'lucide:user',
 *   value: 'account',
 *   content: 'Manage your account settings here.'
 * }
 * ```
 */
export interface TabsItem {
    /**
     * The visible text displayed in the tab trigger.
     */
    label?: string

    /**
     * Icon displayed before the label (leading position).
     * Supports any Iconify icon name (e.g., 'lucide:home', 'mdi:account').
     */
    icon?: string

    /**
     * Unique identifier for this tab.
     * Used to control which tab is active via the `value` prop.
     * @default String(index) - Falls back to the item's index as a string
     */
    value?: string

    /**
     * Whether this specific tab trigger is disabled.
     * Disabled tabs cannot be activated by the user.
     * @default false
     */
    disabled?: boolean

    /**
     * The text content shown in the tab panel when this tab is active.
     * For complex content, use the `body` snippet instead.
     */
    content?: string

    /**
     * Named slot identifier for custom content rendering.
     * When provided, allows using dynamic snippet slots for this item.
     */
    slot?: string

    /**
     * Additional CSS classes applied to this item's trigger element.
     */
    class?: ClassNameValue

    /**
     * Override classes for specific slots within this item's trigger.
     * Allows fine-grained styling control per item.
     */
    ui?: Partial<Pick<Record<TabsSlots, ClassNameValue>, 'trigger' | 'leadingIcon' | 'label'>>
}

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to tabs snippet slots.
 * Provides context about the current item and its state.
 */
export interface TabsSlotProps {
    /** The current tab item data */
    item: TabsItem
    /** Zero-based index of the item in the items array */
    index: number
    /** Whether this tab is currently active */
    active: boolean
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Tabs component.
 *
 * Wraps bits-ui's Tabs primitives with enhanced styling,
 * data-driven rendering, and animated indicator support.
 *
 * @example
 * ```svelte
 * <Tabs
 *   items={tabItems}
 *   bind:value={activeTab}
 *   variant="pill"
 *   color="primary"
 * />
 * ```
 *
 * @see https://bits-ui.com/docs/components/tabs
 */
export interface TabsProps {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------

    /**
     * Array of tab items to render.
     * Each item can have a label, icon, content, and optional styling overrides.
     */
    items?: TabsItem[]

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /**
     * The currently active tab value.
     * Use `bind:value` for two-way binding.
     * @default First item's value or '0'
     */
    value?: string

    /**
     * The default active tab value when uncontrolled.
     * Used as the initial value when `value` is not provided.
     */
    defaultValue?: string

    /**
     * Callback fired when the active tab changes.
     * Receives the new active tab value.
     */
    onValueChange?: (value: string) => void

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Visual style variant for the tabs.
     * - `'pill'`: Rounded background indicator with shadow
     * - `'link'`: Thin line indicator (bottom for horizontal, side for vertical)
     * @default 'pill'
     */
    variant?: NonNullable<TabsVariantProps['variant']>

    /**
     * Color theme for the active tab indicator and text.
     * @default 'primary'
     */
    color?: NonNullable<TabsVariantProps['color']>

    /**
     * Size variant controlling padding, text size, and icon dimensions.
     * @default 'md'
     */
    size?: NonNullable<TabsVariantProps['size']>

    /**
     * Layout orientation of the tabs.
     * - `'horizontal'`: Tabs arranged in a row, content below
     * - `'vertical'`: Tabs arranged in a column, content to the side
     * @default 'horizontal'
     */
    orientation?: NonNullable<TabsVariantProps['orientation']>

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Controls how tabs are activated.
     * - `'automatic'`: Tab activates on focus (arrow key navigation)
     * - `'manual'`: Tab activates on explicit click/enter
     * @default 'automatic'
     */
    activationMode?: 'automatic' | 'manual'

    /**
     * Whether all tabs are disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Whether keyboard navigation wraps around at the edges.
     * @default true
     */
    loop?: boolean

    /**
     * Whether to render content panels for each tab.
     * Set to `false` when using tabs purely for navigation.
     * @default true
     */
    content?: boolean

    // -------------------------------------------------------------------------
    // Styling Overrides
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root tabs container.
     */
    class?: ClassNameValue

    /**
     * Override classes for tabs component slots.
     * Allows customization of root, list, indicator, trigger, content,
     * leadingIcon, and label elements.
     *
     * @example
     * ```ts
     * ui={{
     *   list: 'bg-surface-container-high',
     *   trigger: 'font-semibold',
     *   content: 'p-4'
     * }}
     * ```
     */
    ui?: Partial<Record<TabsSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Custom snippet for the leading section of all tab triggers.
     * Replaces the default leading icon when provided.
     *
     * @param props - Contains `{ item, index, active }`
     */
    leading?: Snippet<[TabsSlotProps]>

    /**
     * Custom snippet for the label section of all tab triggers.
     * Replaces the default `item.label` text when provided.
     *
     * @param props - Contains `{ item, index, active }`
     */
    label?: Snippet<[TabsSlotProps]>

    /**
     * Custom snippet for the trailing section of all tab triggers.
     * Rendered after the label.
     *
     * @param props - Contains `{ item, index, active }`
     */
    trailing?: Snippet<[TabsSlotProps]>

    /**
     * Custom snippet for tab content body.
     * Replaces `item.content` text when provided.
     *
     * @param props - Contains `{ item, index, active }`
     */
    body?: Snippet<[TabsSlotProps]>
}
