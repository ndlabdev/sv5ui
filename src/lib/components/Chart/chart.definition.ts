/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    areaY,
    barY,
    crosshair,
    defineChart,
    dot,
    group,
    lineY,
    stack,
    type ChartPoint,
    type ChartTooltipContentContext
} from '@tanstack/charts'
import { decorative } from '@tanstack/charts/mark/decorative'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip as tooltipExtension } from '@tanstack/charts/tooltip'
import type { ChartCurve, ChartLegendItem, ChartSeriesDatum } from './chart.types.js'
import {
    buildSeriesRows,
    createCurve,
    isolatedRows,
    ringInnerRadius,
    type ResolvedCategory
} from './chart.utils.js'

type SeriesPoint<T extends Record<string, any>> = ChartPoint<ChartSeriesDatum<T>>

export interface CartesianDefinitionOptions<T extends Record<string, any>> {
    type: 'line' | 'area' | 'bar'
    data: readonly T[]
    index: string | undefined
    categories: readonly ResolvedCategory[]
    stacked: boolean
    curve: ChartCurve
    points: boolean
    grid: boolean
    xAxis: boolean
    yAxis: boolean
    xLabel?: string
    yLabel?: string
    format?: (value: number) => string
    tooltip: boolean
    transition: boolean
}

export interface DonutDefinitionOptions<T extends Record<string, any>> {
    rows: ChartSeriesDatum<T>[]
    items: readonly ChartLegendItem[]
    thickness: number
    format?: (value: number) => string
    tooltip: boolean
    transition: boolean
}

function formatValue(
    value: number | null,
    context: ChartTooltipContentContext,
    format?: (value: number) => string
): string {
    if (value === null) return ''
    return format ? format(value) : context.formatY(value)
}

const series = { x: 'index', z: 'category', color: 'category' } as const

function cartesianMarks<T extends Record<string, any>>(
    type: CartesianDefinitionOptions<T>['type'],
    rows: ChartSeriesDatum<T>[],
    options: { stacked: boolean; points: boolean; curve: ChartCurve; order: string[] }
) {
    if (type === 'bar') {
        return [
            crosshair({
                x: { band: { fill: 'currentColor', fillOpacity: 0.06, radius: 4 } },
                y: false
            }),
            barY(rows, {
                ...series,
                y: 'value',
                layout: options.stacked ? stack({ order: options.order }) : group({ padding: 0.1 }),
                radius: { end: 4 },
                inset: options.stacked ? 0 : 1,
                maxThickness: 48
            })
        ]
    }

    const curve = createCurve(options.curve)
    const area = decorative(
        areaY(rows, {
            ...series,
            y1: 'start',
            y2: 'end',
            curve,
            fillOpacity: options.stacked ? 0.3 : 0.12
        })
    )
    const dots = decorative(
        dot(options.points ? rows : isolatedRows(rows), {
            ...series,
            y: 'end',
            r: 4,
            stroke: 'var(--color-surface)',
            strokeWidth: 2
        })
    )

    return [
        crosshair({ x: { stroke: 'currentColor', strokeOpacity: 0.25 }, y: false }),
        ...(type === 'area' ? [area] : []),
        lineY(rows, { ...series, y: 'end', curve, strokeWidth: 2 }),
        dots
    ]
}

function cartesianScales<T extends Record<string, any>>(options: CartesianDefinitionOptions<T>) {
    const { format } = options
    return {
        x: {
            scale:
                options.type === 'bar'
                    ? () => scaleBand<string | number>().padding(0.2)
                    : () => scalePoint<string | number>().padding(0.05),
            axis: options.xAxis ? { label: options.xLabel } : (false as const)
        },
        y: {
            scale: scaleLinear,
            nice: true,
            grid: options.grid,
            axis: options.yAxis
                ? { label: options.yLabel, line: false, ticks: format ? { format } : undefined }
                : (false as const)
        }
    }
}

function cartesianTooltip<T extends Record<string, any>>(
    categories: readonly ResolvedCategory[],
    format?: (value: number) => string
) {
    const labels = new Map(categories.map((category) => [category.key, category.label]))
    return {
        use: tooltipExtension,
        sort: 'color-domain' as const,
        content: (points: readonly SeriesPoint<T>[], context: ChartTooltipContentContext) => ({
            title: points.length ? String(points[0].datum.index) : undefined,
            rows: points.map((point) => ({
                label: labels.get(point.datum.category) ?? point.datum.category,
                value: formatValue(point.datum.value, context, format),
                color: point.color,
                active: point === context.primaryPoint
            }))
        })
    }
}

export function buildCartesianDefinition<T extends Record<string, any>>(
    options: CartesianDefinitionOptions<T>
) {
    const { type, categories } = options
    const stacked = options.stacked && type !== 'line'
    const rows = options.index
        ? buildSeriesRows(options.data, options.index, categories, stacked)
        : []

    return defineChart({
        marks: cartesianMarks(type, rows, {
            stacked,
            points: options.points,
            curve: options.curve,
            order: categories.map((category) => category.key)
        }),
        scales: cartesianScales(options),
        color: {
            domain: categories.map((category) => category.key),
            range: categories.map((category) => category.color)
        },
        focus: 'group-x',
        maxFocusDistance: Number.POSITIVE_INFINITY,
        svgAnimation: options.transition,
        tooltip: options.tooltip ? cartesianTooltip<T>(categories, options.format) : false
    })
}

export function buildDonutDefinition<T extends Record<string, any>>(
    options: DonutDefinitionOptions<T>
) {
    const { thickness, format } = options
    const slices = pie(options.rows, {
        value: 'value',
        gapAngle: options.rows.length > 1 ? 0.02 : 0
    })

    return defineChart({
        marks: [
            polar({
                inset: 4,
                marks: [
                    radialArc(slices, {
                        innerRadius: ({ radius }) => ringInnerRadius(radius, thickness),
                        cornerRadius: 2,
                        color: 'label',
                        key: 'label'
                    })
                ],
                scales: { angle: null, radius: null }
            })
        ],
        scales: { x: null, y: null },
        color: {
            domain: options.items.map((item) => item.key),
            range: options.items.map((item) => item.color)
        },
        svgAnimation: options.transition,
        tooltip: options.tooltip
            ? {
                  use: tooltipExtension,
                  content: (points, context) => ({
                      rows: points.map((point) => ({
                          label: point.datum.label,
                          value: formatValue(point.datum.value, context, format),
                          color: point.color,
                          active: true
                      }))
                  })
              }
            : false
    })
}

export function toSeriesPoint<T extends Record<string, any>>(point: ChartPoint): SeriesPoint<T> {
    const datum = point.datum as { source?: readonly ChartSeriesDatum<T>[] } & ChartSeriesDatum<T>
    return { ...point, datum: datum.source?.[0] ?? datum } as SeriesPoint<T>
}
