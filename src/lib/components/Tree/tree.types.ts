import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'
import type { TreeSlots, TreeVariantProps } from './tree.variants.js'

// ============================================================================
// Value Types
// ============================================================================

/**
 * Selected value(s) of the Tree.
 * A single key when `multiple` is `false`, an array of keys when `true`.
 */
export type TreeValue = string | string[]

// ============================================================================
// Item Types
// ============================================================================

/**
 * Configuration for a single node inside the Tree.
 *
 * Nodes are identified by a key resolved in this order:
 * `getKey(item, indexPath)` → `item.value` → `item[labelKey]` → positional
 * index path (e.g. `'0.2.1'`). When a resolved key collides with an earlier
 * node's key, the later node falls back to its index path.
 *
 * @example
 * ```ts
 * const item: TreeItem = {
 *   label: 'src',
 *   icon: 'lucide:folder',
 *   defaultExpanded: true,
 *   children: [{ label: 'index.ts', icon: 'lucide:file' }]
 * }
 * ```
 */
export interface TreeItem {
    /**
     * Text rendered as the node label (when `labelKey` is `'label'`).
     */
    label?: string

    /**
     * Explicit unique key for this node.
     * Falls back to the label, then the positional index path.
     */
    value?: string

    /**
     * Iconify icon name rendered before the label.
     * Overrides the default `collapsedIcon`/`expandedIcon` folder icons
     * shown on parent nodes.
     */
    icon?: string

    /**
     * Iconify icon name for this node's expand/collapse chevron.
     * Overrides the tree-level `trailingIcon`.
     */
    trailingIcon?: string

    /**
     * Child nodes. `undefined` or an empty array marks a leaf
     * (no chevron, no `aria-expanded`).
     * Typed as `this[]` so interfaces extending `TreeItem` keep their own
     * item type throughout the subtree.
     */
    children?: this[]

    /**
     * Whether this node cannot be selected, expanded, or reached by
     * keyboard navigation. Children of a disabled parent stay unreachable.
     * @default false
     */
    disabled?: boolean

    /**
     * Whether this node starts expanded when the tree is uncontrolled.
     * Read once on mount; ignored when `expanded` or `defaultExpanded`
     * is passed on the tree.
     */
    defaultExpanded?: boolean

    /**
     * Fired after this node is expanded or collapsed.
     */
    onToggle?: (expanded: boolean) => void

    /**
     * Fired after this node is selected or deselected.
     */
    onSelect?: (selected: boolean) => void

    /**
     * Additional CSS classes applied to this node's `<li>` element.
     */
    class?: ClassNameValue

    /**
     * Per-node overrides for individual slot classes.
     */
    ui?: Partial<
        Pick<
            Record<TreeSlots, ClassNameValue>,
            | 'item'
            | 'itemWithChildren'
            | 'listWithChildren'
            | 'link'
            | 'linkLeadingIcon'
            | 'linkLabel'
            | 'linkTrailing'
            | 'linkTrailingIcon'
        >
    >
}

// ============================================================================
// Slot Props
// ============================================================================

/**
 * Context passed to every Tree snippet (`item`, `itemLeading`, `itemLabel`,
 * `itemTrailing`).
 *
 * Svelte has no dynamic named slots, so there is no per-item `slot` field
 * like Nuxt UI's Tree; branch on `item` inside a snippet instead.
 */
export interface TreeSlotProps<T extends TreeItem = TreeItem> {
    /** The node's item data. */
    item: T
    /** Resolved unique key of this node. */
    key: string
    /** Zero-based position among its siblings. */
    index: number
    /** Zero-based depth (top-level nodes are `0`). */
    level: number
    /** Whether the node is currently expanded. */
    expanded: boolean
    /** Whether the node is currently selected. */
    selected: boolean
    /** Whether only some of the node's descendants are selected. */
    indeterminate: boolean
    /** Whether the node has children. */
    hasChildren: boolean
    /** Select/deselect this node (respects `multiple`, propagate, bubble). */
    select: () => void
    /** Toggle this node's expansion. No-op on leaves. */
    toggle: () => void
}

// ============================================================================
// Imperative API
// ============================================================================

/**
 * Imperative API exposed via `bind:api`. Useful for external
 * Expand all / Collapse all buttons or programmatic selection.
 *
 * @example
 * ```svelte
 * <script>
 *   let api = $state<TreeApi>()
 * </script>
 *
 * <Tree bind:api items={files} />
 *
 * <Button onclick={() => api?.expandAll()}>Expand all</Button>
 * ```
 */
export interface TreeApi {
    /** Expand the node with the given key. No-op on leaves. */
    expand: (key: string) => void

    /** Collapse the node with the given key. */
    collapse: (key: string) => void

    /** Toggle the node's expanded state. No-op on leaves. */
    toggle: (key: string) => void

    /** Expand every parent node. */
    expandAll: () => void

    /** Collapse every parent node. */
    collapseAll: () => void

    /** Select the node with the given key (respects `multiple`). */
    select: (key: string) => void

    /** Deselect the node with the given key. */
    deselect: (key: string) => void

    /** Clear the entire selection. */
    clearSelection: () => void

    /** Move keyboard focus to the node with the given key (if visible). */
    focus: (key: string) => void

    /** Whether the node with the given key is expanded. */
    isExpanded: (key: string) => boolean

    /** Whether the node with the given key is selected. */
    isSelected: (key: string) => boolean

    /** Current expanded keys. */
    readonly expanded: string[]

    /** Current selection (`string | undefined` single, `string[]` multiple). */
    readonly selected: TreeValue | undefined
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Tree component.
 *
 * Renders an accessible tree view (WAI-ARIA `tree`/`treeitem`/`group`) with
 * expand/collapse, single or multiple selection, optional parent↔child
 * selection propagation, and full keyboard navigation (arrows, Home/End,
 * Enter/Space, `*`, typeahead).
 *
 * @example
 * ```svelte
 * <Tree
 *   items={files}
 *   bind:value={selected}
 *   bind:expanded
 *   multiple
 *   propagateSelect
 * />
 * ```
 */
export interface TreeProps<T extends TreeItem = TreeItem> extends Omit<
    HTMLAttributes<HTMLUListElement>,
    'class'
> {
    /**
     * Bindable reference to the root `<ul>` element.
     */
    ref?: HTMLUListElement | null

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * Array of root nodes to render.
     */
    items?: T[]

    /**
     * Custom key resolver. Receives the item and its positional index path
     * (e.g. `'0.2.1'`). Must return a key unique across the whole tree.
     */
    getKey?: (item: T, indexPath: string) => string

    /**
     * Item field used as the node label.
     * @default 'label'
     */
    labelKey?: keyof T & string

    // -------------------------------------------------------------------------
    // Selection state (controlled / uncontrolled)
    // -------------------------------------------------------------------------

    /**
     * Selected key(s). Use `bind:value` for two-way binding.
     * A single key when `multiple` is `false`, an array when `true`.
     */
    value?: TreeValue

    /**
     * Initial selection when uncontrolled.
     */
    defaultValue?: TreeValue

    /**
     * Fired whenever the selection changes.
     */
    onValueChange?: (value: TreeValue | undefined) => void

    // -------------------------------------------------------------------------
    // Expansion state (controlled / uncontrolled)
    // -------------------------------------------------------------------------

    /**
     * Keys of expanded nodes. Use `bind:expanded` for two-way binding.
     * When passed (even `[]`), `defaultExpanded` and per-item
     * `defaultExpanded` are ignored.
     */
    expanded?: string[]

    /**
     * Initially expanded keys when uncontrolled. Defaults to the keys of
     * items marked `defaultExpanded: true`.
     */
    defaultExpanded?: string[]

    /**
     * Fired whenever the expanded keys change.
     */
    onExpandedChange?: (expanded: string[]) => void

    // -------------------------------------------------------------------------
    // Imperative API
    // -------------------------------------------------------------------------

    /**
     * Bindable imperative controller for external buttons or
     * programmatic control.
     */
    api?: TreeApi

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Allow selecting multiple nodes. Changes `value` to a `string[]` and
     * sets `aria-multiselectable` on the root.
     * @default false
     */
    multiple?: boolean

    /**
     * How selecting an unselected node affects the existing selection.
     * - `'toggle'`: adds/removes the node, keeping other selections
     * - `'replace'`: the node becomes the only selection
     * @default 'toggle'
     */
    selectionBehavior?: 'toggle' | 'replace'

    /**
     * When `multiple`, selecting a parent also selects/deselects all its
     * selectable (non-disabled) descendants, and partially selected parents
     * report `indeterminate`.
     * @default false
     */
    propagateSelect?: boolean

    /**
     * When `multiple`, a parent is automatically added to the selection
     * once all its selectable children are selected (and removed when
     * any child is deselected).
     * @default false
     */
    bubbleSelect?: boolean

    /**
     * Whether the whole tree is disabled.
     * @default false
     */
    disabled?: boolean

    // -------------------------------------------------------------------------
    // Display
    // -------------------------------------------------------------------------

    /**
     * Color used for selection highlight and focus ring.
     * @default 'primary'
     */
    color?: NonNullable<TreeVariantProps['color']>

    /**
     * Size variant controlling row padding, text, and icon sizes.
     * @default 'md'
     */
    size?: NonNullable<TreeVariantProps['size']>

    /**
     * Iconify icon name for the expand/collapse chevron on parent nodes.
     * @default icons.chevronDown ('lucide:chevron-down')
     */
    trailingIcon?: string

    /**
     * Iconify icon name shown before the label of expanded parent nodes
     * without an explicit `item.icon`.
     * @default icons.folderOpen ('lucide:folder-open')
     */
    expandedIcon?: string

    /**
     * Iconify icon name shown before the label of collapsed parent nodes
     * without an explicit `item.icon`.
     * @default icons.folder ('lucide:folder')
     */
    collapsedIcon?: string

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override classes for component slots.
     */
    ui?: Partial<Record<TreeSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Snippets
    // -------------------------------------------------------------------------

    /**
     * Full custom row renderer. Replaces the default leading icon, label,
     * and trailing chevron entirely (children still render below).
     */
    item?: Snippet<[TreeSlotProps<T>]>

    /**
     * Custom content before the label. Falls back to the item/folder icon.
     */
    itemLeading?: Snippet<[TreeSlotProps<T>]>

    /**
     * Custom label renderer. Falls back to `item[labelKey]`.
     */
    itemLabel?: Snippet<[TreeSlotProps<T>]>

    /**
     * Custom content after the label. Falls back to the expand chevron on
     * parent nodes.
     */
    itemTrailing?: Snippet<[TreeSlotProps<T>]>
}
