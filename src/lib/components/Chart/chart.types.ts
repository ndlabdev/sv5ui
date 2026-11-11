/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ChartDefinition, ChartPoint } from '@tanstack/charts/svelte'
import type { ChartSlots } from './chart.variants.js'

/** Shape of the chart. */
export type ChartType = 'line' | 'area' | 'bar' | 'donut'

/** Interpolation between the values of a `line` or `area` series. */
export type ChartCurve = 'linear' | 'monotone' | 'step'

type KeysOfType<T, V> = string extends keyof T
    ? string
    : { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T] & string

/** Row keys whose values can label the x axis or a donut slice. Any key for loosely typed records. */
export type ChartIndexKey<T> = KeysOfType<T, string | number>

/** Row keys whose values can be plotted. Missing values leave a gap. Any key for loosely typed records. */
export type ChartValueKey<T> = KeysOfType<T, number | null | undefined>

/** A plotted series with its own label and color. */
export interface ChartCategory<T extends Record<string, any> = Record<string, any>> {
    /** Row key that holds the series values. */
    key: ChartValueKey<T>

    /**
     * Name shown in the legend, the tooltip and the default accessible name.
     * @default key
     */
    label?: string

    /**
     * Series color: a theme color (`primary`, `success`, ...) or any CSS color.
     * Takes precedence over the `colors` prop.
     */
    color?: string
}

/**
 * The datum behind every point of a chart built from `data`.
 * Interaction callbacks receive it as `point.datum`.
 */
export interface ChartSeriesDatum<T extends Record<string, any> = Record<string, any>> {
    /** Value of the `index` key: the x position, or the slice for `donut`. */
    index: string | number

    /** Key of the category this point belongs to. */
    category: string

    /** Display label of the series, or of the slice for `donut`. */
    label: string

    /** Plotted value, or `null` for a gap. */
    value: number | null

    /** Lower end of the plotted interval. Differs from `0` only when stacked. */
    start: number | null

    /** Upper end of the plotted interval. Differs from `value` only when stacked. */
    end: number | null

    /** The first row from `data` with this `index` value. */
    row: T

    /** Every row from `data` with this `index` value. Their values are added together. */
    rows: T[]
}

/** A legend entry. */
export interface ChartLegendItem {
    key: string
    label: string
    color: string
}

/** A tooltip row, one per series or slice. */
export interface ChartTooltipRow {
    label: string
    value: string
    color?: string

    /** The row of the hovered or keyboard-focused point. */
    active: boolean
}

/**
 * Context passed to the `tooltipSlot` snippet.
 * `D` is `ChartSeriesDatum` for charts built from `data`, or the datum of the marks with `definition`.
 */
export interface ChartTooltipSlotProps<D = unknown> {
    title?: string
    rows: ChartTooltipRow[]
    points: readonly ChartPoint<D>[]

    /** `true` once the tooltip is pinned with a click, Enter or Space. */
    pinned: boolean

    /** Closes a pinned tooltip and returns focus to the chart. */
    dismiss: () => void
}

/** Context passed to the `center` snippet of a `donut` chart. */
export interface ChartCenterSlotProps {
    /** Sum of every slice value. */
    total: number
    items: ChartLegendItem[]
}

export interface ChartProps<
    T extends Record<string, any> = Record<string, any>,
    D = ChartSeriesDatum<T>
> extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'aria-label' | 'onselect'> {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Shape of the chart.
     * @default 'line'
     */
    type?: ChartType

    /**
     * Rows to plot: one row per x value, or one row per slice for `donut`.
     * Rows that share an `index` value are added together, and rows without one are skipped.
     * Values that are not finite numbers leave a gap. Numeric strings such as `'12'` are not
     * parsed: convert them with `Number()` first. The chart warns once per category when it finds them.
     */
    data?: readonly T[]

    /**
     * Row key used for the x axis, or for the slice labels of a `donut`.
     */
    index?: ChartIndexKey<T>

    /**
     * Row keys plotted as series. Pass objects to set a label or a color.
     * For `donut`, the first entry holds the slice values.
     */
    categories?: readonly (ChartValueKey<T> | ChartCategory<T>)[]

    /**
     * Series colors in `categories` order, or slice colors in `data` order for `donut`.
     * Accepts theme colors (`primary`, `success`, ...) and any CSS color.
     * Defaults to the `--color-chart-1` to `--color-chart-6` theme tokens;
     * series past the sixth reuse them as lighter tints.
     */
    colors?: readonly string[]

    /**
     * Stacks the series on top of each other. Applies to `area` and `bar`.
     * @default false
     */
    stacked?: boolean

    /**
     * Interpolation between values. Applies to `line` and `area`.
     * @default 'linear'
     */
    curve?: ChartCurve

    /**
     * Draws a dot at each value. Applies to `line` and `area`.
     * @default false
     */
    points?: boolean

    /**
     * Draws horizontal grid lines.
     * @default true
     */
    grid?: boolean

    /**
     * Shows the x axis.
     * @default true
     */
    xAxis?: boolean

    /**
     * Shows the y axis.
     * @default true
     */
    yAxis?: boolean

    /**
     * Title along the x axis.
     */
    xLabel?: string

    /**
     * Title along the y axis.
     */
    yLabel?: string

    /**
     * Shows the legend. By default it is shown when there is more than one series,
     * or more than one slice for `donut`.
     */
    legend?: boolean

    /**
     * Formats y axis ticks and tooltip values.
     * With server rendering, pass an explicit locale (for example `new Intl.NumberFormat('en-US')`)
     * so the server and the browser render the same ticks.
     */
    format?: (value: number) => string

    /**
     * Shows a tooltip for the hovered or keyboard-focused values.
     * @default true
     */
    tooltip?: boolean

    /**
     * Animates the marks when the data changes. Respects `prefers-reduced-motion`.
     * Does not apply to `definition`, which sets `svgAnimation` itself.
     * @default true
     */
    transition?: boolean

    /**
     * Ring width of a `donut`, in pixels. At least 1; a value at or above the radius draws a pie.
     * @default 24
     */
    thickness?: number

    /**
     * Fixed height in pixels.
     * @default 300, unless `aspectRatio` is set
     */
    height?: number

    /**
     * Fixed width in pixels. Without it the chart follows its container.
     */
    width?: number

    /**
     * Width-to-height ratio, used when `height` is not set.
     * With server rendering, prefer it over a fixed `height`: the server markup then keeps its
     * proportions in any container width until the page hydrates.
     */
    aspectRatio?: number

    /**
     * Width used on the server and before the container is measured.
     * Set it close to the rendered width so the server markup matches the hydrated chart.
     * @default 640
     */
    initialWidth?: number

    /**
     * A full TanStack Charts definition for charts the props above do not cover.
     * The definition owns the marks, colors, tooltip and animation, so these props are ignored
     * with it: `type`, `data`, `index`, `categories`, `colors`, `stacked`, `curve`, `points`, `grid`,
     * `xAxis`, `yAxis`, `xLabel`, `yLabel`, `legend`, `format`, `tooltip`, `transition`, `thickness`
     * and `center`. `tooltipSlot` and the interaction callbacks receive the datum of its marks.
     */
    definition?: ChartDefinition<D>

    /**
     * Accessible name of the chart.
     * Defaults to the chart type and the series labels. Set it when using `definition`.
     */
    'aria-label'?: string

    /**
     * Longer description for assistive technologies.
     */
    'aria-description'?: string

    /**
     * Called when a point is activated with a click, Enter or Space.
     * `point.datum` is a `ChartSeriesDatum`, or the datum of the marks with `definition`.
     */
    onSelect?: (point: ChartPoint<D> | null) => void

    /**
     * Called when the hovered or keyboard-focused point changes.
     * `point.datum` is a `ChartSeriesDatum`, or the datum of the marks with `definition`.
     */
    onFocusChange?: (point: ChartPoint<D> | null) => void

    /**
     * Called with every point of the focused x value.
     * `point.datum` is a `ChartSeriesDatum`, or the datum of the marks with `definition`.
     */
    onFocusGroupChange?: (points: readonly ChartPoint<D>[]) => void

    /**
     * Override styles for specific chart slots.
     */
    ui?: Partial<Record<ChartSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Replaces the tooltip content.
     */
    tooltipSlot?: Snippet<[ChartTooltipSlotProps<D>]>

    /**
     * Content in the middle of a `donut` chart.
     */
    center?: Snippet<[ChartCenterSlotProps]>
}
