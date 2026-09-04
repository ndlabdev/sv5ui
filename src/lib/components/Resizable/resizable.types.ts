import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ResizableVariantProps, ResizableSlots } from './resizable.variants.js'

/**
 * Context handed to a pane's `content` snippet.
 */
export interface ResizablePaneContext {
    pane: ResizablePane
    index: number
    /** Current size of the pane as a percentage of the group. */
    size: number
    collapsed: boolean
}

/**
 * Context handed to the `handle` snippet.
 */
export interface ResizableHandleContext {
    index: number
    /** Whether this handle is being dragged. */
    active: boolean
    direction: 'horizontal' | 'vertical'
}

/**
 * One pane of the group.
 */
export interface ResizablePane {
    /** Stable identity, also used to validate a persisted layout. */
    id: string

    /**
     * Starting size as a percentage of the group. Panes without one share the
     * space the others leave.
     */
    defaultSize?: number

    /**
     * Smallest size the pane can be dragged to, as a percentage (`15`) or a
     * pixel string (`'200px'`) resolved against the measured group.
     */
    minSize?: number | string

    /**
     * Largest size the pane can be dragged to, in the same units as `minSize`.
     */
    maxSize?: number | string

    /**
     * Let the pane snap shut when it is dragged past its minimum, and spring
     * back when it is dragged out again.
     * @default false
     */
    collapsible?: boolean

    /**
     * Size the pane takes while collapsed, as a percentage.
     * @default 0
     */
    collapsedSize?: number

    /**
     * Set to `false` to pin the pane: the handles beside it stop responding to
     * the pointer and the keyboard, and a drag elsewhere in the group never
     * takes space from it.
     * @default true
     */
    resizable?: boolean

    /** Additional CSS classes for this pane. */
    class?: ClassNameValue

    /** Content of the pane. */
    content?: Snippet<[ResizablePaneContext]>
}

/**
 * Imperative handle exposed through the `api` prop.
 */
export interface ResizableApi {
    /** Collapse a collapsible pane by id. */
    collapse: (id: string) => void
    /** Restore a collapsed pane to the size it had before, or to its minimum. */
    expand: (id: string) => void
    /** Collapse or restore a pane depending on its current state. */
    toggle: (id: string) => void
    /** Set one pane to an exact size in percent; the neighbours absorb the change. */
    resize: (id: string, size: number) => void
    /** Replace the layout with the given percentages. */
    setSizes: (sizes: number[]) => void
    /** Restore the layout described by the `panes` defaults. */
    reset: () => void
    /** Current sizes as percentages. */
    readonly sizes: number[]
    /** Ids of the panes that are currently collapsed. */
    readonly collapsed: string[]
}

export type ResizableProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The panes of the group, in order. A handle is rendered between each pair.
     */
    panes: ResizablePane[]

    /**
     * Axis the panes are laid out along.
     * @default 'horizontal'
     */
    direction?: NonNullable<ResizableVariantProps['direction']>

    /**
     * Current sizes as percentages that add up to 100. Supports two-way binding
     * with `bind:sizes`; assigning a layout applies it.
     */
    sizes?: number[]

    /**
     * Persist the layout under this `localStorage` key. A stored layout is only
     * restored when it still matches the current panes.
     */
    storageKey?: string

    /**
     * Percentage a handle moves per arrow key press. Shift doubles it.
     * @default 5
     */
    keyboardStep?: number

    /**
     * Disable dragging and keyboard resizing.
     * @default false
     */
    disabled?: boolean

    /**
     * Color of the handle while hovered or dragged.
     * @default 'primary'
     */
    color?: NonNullable<ResizableVariantProps['color']>

    /**
     * Thickness of the handle and its grip.
     * @default 'md'
     */
    size?: NonNullable<ResizableVariantProps['size']>

    /**
     * Bindable imperative handle.
     */
    api?: ResizableApi

    /**
     * Callback fired whenever the layout changes, including keyboard and api changes.
     */
    onSizesChange?: (sizes: number[]) => void

    /**
     * Callback fired when a drag starts, with the index of the handle.
     */
    onResizeStart?: (index: number) => void

    /**
     * Callback fired when a drag ends, with the settled layout.
     */
    onResizeEnd?: (sizes: number[]) => void

    /**
     * Callback fired when a pane collapses or is restored.
     */
    onCollapse?: (id: string, collapsed: boolean) => void

    /**
     * Text overrides for the accessible names.
     */
    labels?: {
        /** Accessible name of a handle. Receives the 1-based handle position. */
        handle?: string
    }

    /**
     * Replaces the grip drawn inside every handle.
     */
    handle?: Snippet<[ResizableHandleContext]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific resizable slots.
     */
    ui?: Partial<Record<ResizableSlots, ClassNameValue>>
}
