/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartCurve as ChartPathCurve } from '@tanstack/charts'
import type {
    ChartCategory,
    ChartCurve,
    ChartLegendItem,
    ChartSeriesDatum,
    ChartType,
    ChartValueKey
} from './chart.types.js'

type Point = readonly [number, number]

export interface ResolvedCategory {
    key: string
    label: string
    color: string
}

const THEME_COLORS = new Set([
    'primary',
    'secondary',
    'tertiary',
    'success',
    'warning',
    'error',
    'info'
])
const PALETTE_SIZE = 6

export function resolveColor(color: string): string {
    return THEME_COLORS.has(color) ? `var(--color-${color})` : color
}

export function paletteColor(index: number): string {
    const base = `var(--color-chart-${(index % PALETTE_SIZE) + 1})`
    const round = Math.floor(index / PALETTE_SIZE)
    if (round === 0) return base
    const weight = Math.max(100 - round * 35, 30)
    return `color-mix(in oklab, ${base} ${weight}%, var(--color-surface))`
}

export function seriesColor(index: number, own?: string, colors?: readonly string[]): string {
    const color = own ?? colors?.[index]
    return color ? resolveColor(color) : paletteColor(index)
}

export function resolveCategories<T extends Record<string, any>>(
    categories: readonly (ChartValueKey<T> | ChartCategory<T>)[] | undefined,
    colors?: readonly string[]
): ResolvedCategory[] {
    return (categories ?? []).map((category, index) => {
        const item = typeof category === 'string' ? { key: category } : category
        return {
            key: item.key,
            label: item.label ?? item.key,
            color: seriesColor(index, item.color, colors)
        }
    })
}

const DEFAULT_THICKNESS = 24

interface IndexGroup<T> {
    index: string | number
    rows: T[]
}

function toValue(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function isIndexValue(value: unknown): value is string | number {
    return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))
}

export function groupByIndex<T extends Record<string, any>>(
    data: readonly T[],
    index: string
): IndexGroup<T>[] {
    const groups = new Map<string, IndexGroup<T>>()
    for (const row of data) {
        const value = row[index]
        if (!isIndexValue(value)) continue
        const group = groups.get(String(value))
        if (group) group.rows.push(row)
        else groups.set(String(value), { index: value, rows: [row] })
    }
    return [...groups.values()]
}

function sumValues<T extends Record<string, any>>(rows: readonly T[], key: string): number | null {
    let total: number | null = null
    for (const row of rows) {
        const value = toValue(row[key])
        if (value !== null) total = (total ?? 0) + value
    }
    return total
}

export function numericStrings<T extends Record<string, any>>(
    data: readonly T[],
    keys: readonly string[]
): { key: string; sample: string }[] {
    const found: { key: string; sample: string }[] = []
    for (const key of keys) {
        const sample = data.find((row) => {
            const value = row[key]
            return (
                typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
            )
        })?.[key]
        if (sample !== undefined) found.push({ key, sample })
    }
    return found
}

export function buildSeriesRows<T extends Record<string, any>>(
    data: readonly T[],
    index: string,
    categories: readonly ResolvedCategory[],
    stacked: boolean
): ChartSeriesDatum<T>[] {
    const rows: ChartSeriesDatum<T>[] = []
    for (const group of groupByIndex(data, index)) {
        let positive = 0
        let negative = 0
        for (const category of categories) {
            const value = sumValues(group.rows, category.key)
            let start: number | null = value === null ? null : 0
            let end = value
            if (stacked && value !== null) {
                start = value < 0 ? negative : positive
                end = start + value
                if (value < 0) negative = end
                else positive = end
            }
            rows.push({
                index: group.index,
                category: category.key,
                label: category.label,
                value,
                start,
                end,
                row: group.rows[0],
                rows: group.rows
            })
        }
    }
    return rows
}

export function isolatedRows<T extends Record<string, any>>(
    rows: readonly ChartSeriesDatum<T>[]
): ChartSeriesDatum<T>[] {
    const byCategory = new Map<string, ChartSeriesDatum<T>[]>()
    for (const row of rows) {
        const list = byCategory.get(row.category)
        if (list) list.push(row)
        else byCategory.set(row.category, [row])
    }
    return [...byCategory.values()].flatMap((list) =>
        list.filter(
            (row, position) =>
                row.end !== null &&
                (list[position - 1]?.end ?? null) === null &&
                (list[position + 1]?.end ?? null) === null
        )
    )
}

export function buildSliceRows<T extends Record<string, any>>(
    data: readonly T[],
    index: string,
    category: ResolvedCategory | undefined,
    colors?: readonly string[]
): { rows: ChartSeriesDatum<T>[]; items: ChartLegendItem[] } {
    const rows: ChartSeriesDatum<T>[] = []
    const items: ChartLegendItem[] = []
    if (!category) return { rows, items }
    groupByIndex(data, index).forEach((group, position) => {
        const value = sumValues(group.rows, category.key)
        if (value === null || value <= 0) return
        const label = String(group.index)
        rows.push({
            index: group.index,
            category: category.key,
            label,
            value,
            start: 0,
            end: value,
            row: group.rows[0],
            rows: group.rows
        })
        items.push({ key: label, label, color: seriesColor(position, undefined, colors) })
    })
    return { rows, items }
}

export function ringInnerRadius(radius: number, thickness: number): number {
    const width = Number.isFinite(thickness) ? Math.max(thickness, 1) : DEFAULT_THICKNESS
    return Math.max(radius - width, 0)
}

export function defaultAriaLabel(type: ChartType, labels: readonly string[]): string {
    const name = `${type.charAt(0).toUpperCase()}${type.slice(1)} chart`
    return labels.length ? `${name}: ${labels.join(', ')}` : name
}

const round = (value: number) => Math.round(value * 1000) / 1000
const coord = ([x, y]: Point) => `${round(x)},${round(y)}`

function linearSegments(points: readonly Point[]): string {
    return points
        .slice(1)
        .map((point) => `L${coord(point)}`)
        .join('')
}

function stepSegments(points: readonly Point[]): string {
    let path = ''
    for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1]
        const [x1, y1] = points[i]
        const middle = (x0 + x1) / 2
        path += `L${coord([middle, y0])}L${coord([middle, y1])}L${coord([x1, y1])}`
    }
    return path
}

const sign = (value: number) => (value < 0 ? -1 : 1)

function monotoneTangents(points: readonly Point[]): number[] {
    const count = points.length
    const secants: number[] = []
    for (let i = 0; i < count - 1; i++) {
        const dx = points[i + 1][0] - points[i][0]
        secants.push(dx ? (points[i + 1][1] - points[i][1]) / dx : 0)
    }
    const tangents = new Array<number>(count).fill(0)
    for (let i = 1; i < count - 1; i++) {
        const h0 = points[i][0] - points[i - 1][0]
        const h1 = points[i + 1][0] - points[i][0]
        const s0 = secants[i - 1]
        const s1 = secants[i]
        const p = h0 + h1 ? (s0 * h1 + s1 * h0) / (h0 + h1) : 0
        tangents[i] =
            (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
    }
    tangents[0] = (3 * secants[0] - tangents[1]) / 2
    tangents[count - 1] = (3 * secants[count - 2] - tangents[count - 2]) / 2
    return tangents
}

function monotoneSegments(points: readonly Point[]): string {
    if (points.length < 3) return linearSegments(points)
    const tangents = monotoneTangents(points)
    let path = ''
    for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1]
        const [x1, y1] = points[i]
        const dx = (x1 - x0) / 3
        path += `C${coord([x0 + dx, y0 + dx * tangents[i - 1]])},${coord([x1 - dx, y1 - dx * tangents[i]])},${coord([x1, y1])}`
    }
    return path
}

export function createCurve(curve: ChartCurve): ChartPathCurve | undefined {
    if (curve === 'linear') return undefined
    const segments = curve === 'step' ? stepSegments : monotoneSegments
    const line = (points: readonly Point[]) =>
        points.length ? `M${coord(points[0])}${segments(points)}` : ''
    return {
        line,
        area: (top, bottom) => {
            if (!top.length) return ''
            const lower = [...bottom].reverse()
            return `${line(top)}L${coord(lower[0])}${segments(lower)}Z`
        }
    }
}
