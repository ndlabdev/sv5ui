import { describe, expect, it } from 'vitest'
import { createChartScene, renderChartSvg } from '@tanstack/charts'
import {
    buildCartesianDefinition,
    buildDonutDefinition,
    toSeriesPoint,
    type CartesianDefinitionOptions
} from './chart.definition.js'
import { buildSliceRows, resolveCategories } from './chart.utils.js'

type Row = { month: string; desktop: number; mobile: number }

const data: Row[] = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 }
]

const categories = resolveCategories<Row>([
    { key: 'desktop', label: 'Desktop' },
    { key: 'mobile', label: 'Mobile', color: 'success' }
])

function cartesian(options: Partial<CartesianDefinitionOptions<Row>> = {}) {
    return buildCartesianDefinition<Row>({
        type: 'line',
        data,
        index: 'month',
        categories,
        stacked: false,
        curve: 'linear',
        points: false,
        grid: true,
        xAxis: true,
        yAxis: true,
        tooltip: true,
        transition: false,
        ...options
    })
}

const scene = (definition: ReturnType<typeof cartesian>) =>
    createChartScene(definition, { width: 640, height: 320 })

const svg = (definition: ReturnType<typeof cartesian>) =>
    renderChartSvg(scene(definition), { ariaLabel: 'Test chart' })

describe('chart definition', () => {
    describe('cartesian', () => {
        it.each(['line', 'area', 'bar'] as const)(
            'exposes one focusable point per value for %s',
            (type) => {
                expect(scene(cartesian({ type })).points).toHaveLength(6)
            }
        )

        it('keeps area fills and dots out of focus', () => {
            const { points } = scene(cartesian({ type: 'area', points: true }))
            expect(points).toHaveLength(6)
            expect(new Set(points.map((point) => point.markId)).size).toBe(1)
        })

        it('maps series to the resolved colors in category order', () => {
            const markup = svg(cartesian())
            expect(markup).toContain('stroke="var(--color-chart-1)"')
            expect(markup).toContain('stroke="var(--color-success)"')
        })

        it('draws a dot per value only with points', () => {
            const dots = /<circle[^>]*stroke="var\(--color-surface\)"/g
            expect(svg(cartesian()).match(dots)).toBeNull()
            expect(svg(cartesian({ points: true })).match(dots)).toHaveLength(6)
        })

        it.each(['line', 'area'] as const)(
            'draws a dot for isolated %s values without points',
            (type) => {
                const dots = /<circle[^>]*stroke="var\(--color-surface\)"/g
                const single = svg(cartesian({ type, data: data.slice(0, 1) }))
                expect(single.match(dots)).toHaveLength(2)
                const gaps = svg(
                    cartesian({
                        type,
                        data: [
                            { month: 'Jan', desktop: 1, mobile: 2 },
                            { month: 'Feb', desktop: null as never, mobile: 3 },
                            { month: 'Mar', desktop: 4, mobile: 5 },
                            { month: 'Apr', desktop: null as never, mobile: 6 }
                        ]
                    })
                )
                expect(gaps.match(dots)).toHaveLength(2)
            }
        )

        it('plots nothing without an index', () => {
            expect(scene(cartesian({ index: undefined })).points).toHaveLength(0)
        })

        it('draws grid lines only with grid', () => {
            expect(svg(cartesian())).toContain('ts-chart__grid')
            expect(svg(cartesian({ grid: false }))).not.toContain('ts-chart__grid')
        })

        it('hides the axes', () => {
            const markup = svg(cartesian({ xAxis: false, yAxis: false }))
            expect(markup).not.toContain('x-tick-label')
            expect(markup).not.toContain('y-tick-label')
        })

        it('renders axis titles', () => {
            const markup = svg(cartesian({ xLabel: 'Month', yLabel: 'Visitors' }))
            expect(markup).toContain('>Month</text>')
            expect(markup).toContain('>Visitors</text>')
        })

        it('formats y axis ticks', () => {
            const markup = svg(cartesian({ format: (value) => `${value} visits` }))
            expect(markup).toMatch(/>\d+ visits<\/text>/)
        })

        it('places grouped bars side by side', () => {
            const { points } = scene(cartesian({ type: 'bar' }))
            const january = points.filter((point) => point.xValue === 'Jan')
            expect(january).toHaveLength(2)
            expect(january[0].x).not.toBe(january[1].x)
        })

        it('stacks bars in category order', () => {
            const { points } = scene(cartesian({ type: 'bar', stacked: true }))
            const [desktop, mobile] = points.filter((point) => point.xValue === 'Jan')
            expect(desktop.x).toBe(mobile.x)
            expect(mobile.y).toBeLessThan(desktop.y)
        })

        it('stacks areas on top of each other', () => {
            const { points } = scene(cartesian({ type: 'area', stacked: true }))
            const top = points.find(
                (point) => point.xValue === 'Jan' && point.datum.category === 'mobile'
            )!
            expect(top.datum).toMatchObject({ start: 186, end: 266, value: 80 })
        })

        it('never stacks lines', () => {
            const { points } = scene(cartesian({ type: 'line', stacked: true }))
            const mobile = points.find(
                (point) => point.xValue === 'Jan' && point.datum.category === 'mobile'
            )!
            expect(mobile.datum.end).toBe(80)
        })

        it('stacks bars whose rows share an index instead of throwing', () => {
            const definition = buildCartesianDefinition<Row>({
                type: 'bar',
                data: [...data, { month: 'Jan', desktop: 14, mobile: 20 }],
                index: 'month',
                categories,
                stacked: true,
                curve: 'linear',
                points: false,
                grid: true,
                xAxis: true,
                yAxis: true,
                tooltip: true,
                transition: false
            })
            const january = scene(definition).points.filter((point) => point.xValue === 'Jan')
            expect(january.map((point) => point.datum.value)).toEqual([200, 100])
        })

        it.each(['line', 'area', 'bar'] as const)('renders %s without data', (type) => {
            const markup = svg(cartesian({ type, data: [] }))
            expect(markup).not.toMatch(/NaN|Infinity/)
        })

        it.each(['line', 'area', 'bar'] as const)(
            'keeps %s geometry finite for negative, zero and flat values',
            (type) => {
                for (const rows of [
                    [
                        { month: 'Jan', desktop: -5, mobile: 3 },
                        { month: 'Feb', desktop: 4, mobile: -6 }
                    ],
                    [
                        { month: 'Jan', desktop: 0, mobile: 0 },
                        { month: 'Feb', desktop: 0, mobile: 0 }
                    ],
                    [
                        { month: 'Jan', desktop: 42, mobile: 42 },
                        { month: 'Feb', desktop: 42, mobile: 42 }
                    ]
                ]) {
                    for (const stacked of [false, true]) {
                        expect(svg(cartesian({ type, data: rows, stacked }))).not.toMatch(
                            /NaN|Infinity/
                        )
                    }
                }
            }
        )

        it('uses a curve for line and area paths', () => {
            expect(svg(cartesian({ curve: 'monotone' }))).toMatch(/d="M[^"]*C/)
            expect(svg(cartesian({ type: 'area', curve: 'step' }))).not.toMatch(/d="M[^"]*C/)
        })

        it('turns the tooltip off', () => {
            expect(cartesian({ tooltip: false }).tooltip).toBe(false)
            expect(cartesian().tooltip).toBeTruthy()
        })

        it('turns animation off', () => {
            expect(cartesian({ transition: false }).svgAnimation).toBe(false)
            expect(cartesian({ transition: true }).svgAnimation).toBe(true)
        })
    })

    describe('donut', () => {
        const browsers = [
            { browser: 'Chrome', visitors: 275 },
            { browser: 'Safari', visitors: 200 },
            { browser: 'Firefox', visitors: 187 }
        ]
        const slices = buildSliceRows(
            browsers,
            'browser',
            resolveCategories<(typeof browsers)[number]>(['visitors'])[0]
        )
        const donut = (thickness = 24) =>
            buildDonutDefinition({ ...slices, thickness, tooltip: true, transition: false })

        it('draws one arc per slice', () => {
            const markup = renderChartSvg(createChartScene(donut(), { width: 320, height: 320 }), {
                ariaLabel: 'Donut'
            })
            expect(markup.match(/<path[^>]*data-ts-key="polar-0:arc-0/g)).toHaveLength(3)
            expect(markup).toContain('fill="var(--color-chart-3)"')
        })

        it('maps slice points back to the series datum', () => {
            const { points } = createChartScene(donut(), { width: 320, height: 320 })
            expect(points).toHaveLength(3)
            const point = toSeriesPoint(points[1])
            expect(point.datum).toMatchObject({ label: 'Safari', value: 200, index: 'Safari' })
            expect(point.datum.row).toBe(browsers[1])
        })

        it('draws a single slice as a closed ring without a gap', () => {
            const single = buildSliceRows(
                [{ browser: 'Chrome', visitors: 10 }],
                'browser',
                resolveCategories<{ browser: string; visitors: number }>(['visitors'])[0]
            )
            const markup = renderChartSvg(
                createChartScene(
                    buildDonutDefinition({
                        ...single,
                        thickness: 24,
                        tooltip: true,
                        transition: false
                    }),
                    { width: 320, height: 320 }
                ),
                { ariaLabel: 'Donut' }
            )
            const path = markup.match(/<path[^>]*data-ts-key="polar-0:arc-0[^>]*d="([^"]+)"/)![1]
            expect(path).not.toMatch(/A2,2/)
        })

        it.each([0, -5, NaN, 9999])('keeps the ring finite with thickness %s', (thickness) => {
            const markup = renderChartSvg(
                createChartScene(donut(thickness), { width: 320, height: 320 }),
                { ariaLabel: 'Donut' }
            )
            expect(markup).not.toMatch(/NaN|Infinity/)
            expect(markup.match(/<path[^>]*data-ts-key="polar-0:arc-0/g)).toHaveLength(3)
        })

        it('changes the ring width with thickness', () => {
            const paths = (thickness: number) =>
                renderChartSvg(createChartScene(donut(thickness), { width: 320, height: 320 }), {
                    ariaLabel: 'Donut'
                })
            expect(paths(12)).not.toBe(paths(48))
        })
    })

    describe('toSeriesPoint', () => {
        it('keeps a cartesian datum as is', () => {
            const { points } = scene(cartesian())
            expect(toSeriesPoint(points[0]).datum).toBe(points[0].datum)
        })
    })
})
