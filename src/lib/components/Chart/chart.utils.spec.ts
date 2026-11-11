import { describe, expect, it } from 'vitest'
import {
    buildSeriesRows,
    buildSliceRows,
    createCurve,
    defaultAriaLabel,
    groupByIndex,
    isolatedRows,
    numericStrings,
    paletteColor,
    resolveCategories,
    resolveColor,
    ringInnerRadius,
    seriesColor
} from './chart.utils.js'

type Row = { month: string; desktop: number | null; mobile: number | null }

const data: Row[] = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: -20 },
    { month: 'Mar', desktop: null, mobile: 120 }
]

const numbers = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)

describe('chart utils', () => {
    describe('resolveColor', () => {
        it.each(['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'])(
            'maps the %s theme color to its token',
            (color) => {
                expect(resolveColor(color)).toBe(`var(--color-${color})`)
            }
        )

        it.each(['#8b5cf6', 'rgb(0 0 0)', 'oklch(0.5 0.1 200)', 'var(--brand)', 'tomato'])(
            'keeps the CSS color %s',
            (color) => {
                expect(resolveColor(color)).toBe(color)
            }
        )
    })

    describe('paletteColor', () => {
        it('uses the six chart tokens in order', () => {
            expect([0, 1, 2, 3, 4, 5].map(paletteColor)).toEqual(
                [1, 2, 3, 4, 5, 6].map((slot) => `var(--color-chart-${slot})`)
            )
        })

        it('reuses the palette as lighter tints past the sixth series', () => {
            expect(paletteColor(6)).toBe(
                'color-mix(in oklab, var(--color-chart-1) 65%, var(--color-surface))'
            )
            expect(paletteColor(13)).toBe(
                'color-mix(in oklab, var(--color-chart-2) 30%, var(--color-surface))'
            )
        })

        it('never fades a tint below 30%', () => {
            expect(paletteColor(60)).toContain(' 30%,')
        })
    })

    describe('seriesColor', () => {
        it('prefers the own color, then the colors list, then the palette', () => {
            expect(seriesColor(0, 'error', ['success'])).toBe('var(--color-error)')
            expect(seriesColor(0, undefined, ['success'])).toBe('var(--color-success)')
            expect(seriesColor(1, undefined, ['success'])).toBe('var(--color-chart-2)')
        })
    })

    describe('resolveCategories', () => {
        it('accepts keys and objects', () => {
            expect(
                resolveCategories<Row>([
                    'desktop',
                    { key: 'mobile', label: 'Mobile', color: '#000' }
                ])
            ).toEqual([
                { key: 'desktop', label: 'desktop', color: 'var(--color-chart-1)' },
                { key: 'mobile', label: 'Mobile', color: '#000' }
            ])
        })

        it('returns no series without categories', () => {
            expect(resolveCategories(undefined)).toEqual([])
        })
    })

    describe('groupByIndex', () => {
        it('keeps the first-seen order of index values', () => {
            const groups = groupByIndex(
                [{ x: 'B' }, { x: 'A' }, { x: 'B' }, { x: 'C' }] as Record<string, string>[],
                'x'
            )
            expect(groups.map((group) => [group.index, group.rows.length])).toEqual([
                ['B', 2],
                ['A', 1],
                ['C', 1]
            ])
        })

        it.each([null, undefined, NaN, Infinity, {}, [], true])(
            'skips rows whose index is %s',
            (value) => {
                expect(
                    groupByIndex([{ x: value }, { x: 'A' }], 'x').map((group) => group.index)
                ).toEqual(['A'])
            }
        )

        it('keeps numeric and empty-string index values', () => {
            expect(
                groupByIndex([{ x: 2024 }, { x: 0 }, { x: '' }], 'x').map((group) => group.index)
            ).toEqual([2024, 0, ''])
        })

        it('treats a number and its string as the same index', () => {
            const groups = groupByIndex([{ x: 1 }, { x: '1' }], 'x')
            expect(groups).toHaveLength(1)
            expect(groups[0].index).toBe(1)
        })
    })

    describe('numericStrings', () => {
        it('reports the first numeric string of each key', () => {
            expect(
                numericStrings(
                    [
                        { a: 1, b: 'n/a', c: ' ' },
                        { a: '12', b: '3.5', c: '' },
                        { a: '7', b: 2, c: null }
                    ],
                    ['a', 'b', 'c']
                )
            ).toEqual([
                { key: 'a', sample: '12' },
                { key: 'b', sample: '3.5' }
            ])
        })

        it('ignores numbers, text, blanks and keys that are not plotted', () => {
            expect(numericStrings([{ a: 1, b: 'x', c: '', d: '5' }], ['a', 'b', 'c'])).toEqual([])
        })
    })

    describe('buildSeriesRows', () => {
        const categories = resolveCategories<Row>(['desktop', 'mobile'])

        it('creates one datum per row and category, in data order', () => {
            const rows = buildSeriesRows(data, 'month', categories, false)
            expect(rows.map((row) => `${row.index}:${row.category}`)).toEqual([
                'Jan:desktop',
                'Jan:mobile',
                'Feb:desktop',
                'Feb:mobile',
                'Mar:desktop',
                'Mar:mobile'
            ])
            expect(rows[0]).toMatchObject({ label: 'desktop', value: 186, start: 0, end: 186 })
            expect(rows[0].row).toBe(data[0])
        })

        it('keeps a missing value as a gap', () => {
            const gap = buildSeriesRows(data, 'month', categories, false)[4]
            expect(gap).toMatchObject({ value: null, start: null, end: null })
        })

        it.each([NaN, Infinity, '12', undefined])('treats %s as a gap', (value) => {
            const rows = buildSeriesRows(
                [{ month: 'Jan', desktop: value as unknown as number }],
                'month',
                resolveCategories<{ month: string; desktop: number }>(['desktop']),
                false
            )
            expect(rows[0].value).toBeNull()
        })

        it('stacks positive and negative values away from zero', () => {
            const rows = buildSeriesRows(
                [{ month: 'Jan', a: 10, b: -4, c: 5, d: -6 }],
                'month',
                resolveCategories<{ month: string; a: number; b: number; c: number; d: number }>([
                    'a',
                    'b',
                    'c',
                    'd'
                ]),
                true
            )
            expect(rows.map((row) => [row.start, row.end])).toEqual([
                [0, 10],
                [0, -4],
                [10, 15],
                [-4, -10]
            ])
            expect(rows.map((row) => row.value)).toEqual([10, -4, 5, -6])
        })

        it('adds up rows that share an index', () => {
            const rows = buildSeriesRows(
                [
                    { month: 'Jan', desktop: 1, mobile: null },
                    { month: 'Feb', desktop: 2, mobile: 5 },
                    { month: 'Jan', desktop: 3, mobile: null }
                ],
                'month',
                categories,
                false
            )
            expect(rows.map((row) => [row.index, row.category, row.value])).toEqual([
                ['Jan', 'desktop', 4],
                ['Jan', 'mobile', null],
                ['Feb', 'desktop', 2],
                ['Feb', 'mobile', 5]
            ])
            expect(rows[0].row).toEqual({ month: 'Jan', desktop: 1, mobile: null })
            expect(rows[0].rows).toHaveLength(2)
        })

        it('skips rows without an index', () => {
            const rows = buildSeriesRows(
                [
                    { desktop: 1 },
                    { month: null, desktop: 2 },
                    { month: 'Jan', desktop: 3 }
                ] as never,
                'month',
                categories,
                false
            )
            expect(rows.map((row) => row.index)).toEqual(['Jan', 'Jan'])
        })

        it('restarts the stack for every row and skips gaps', () => {
            const rows = buildSeriesRows(data, 'month', categories, true)
            expect(rows.map((row) => [row.start, row.end])).toEqual([
                [0, 186],
                [186, 266],
                [0, 305],
                [0, -20],
                [null, null],
                [0, 120]
            ])
        })
    })

    describe('isolatedRows', () => {
        const categories = resolveCategories<Row>(['desktop', 'mobile'])

        it('finds values without a neighbouring value in their series', () => {
            const rows = buildSeriesRows(
                [
                    { month: 'Jan', desktop: 1, mobile: 4 },
                    { month: 'Feb', desktop: null, mobile: 5 },
                    { month: 'Mar', desktop: 3, mobile: null },
                    { month: 'Apr', desktop: null, mobile: 6 }
                ],
                'month',
                categories,
                false
            )
            expect(isolatedRows(rows).map((row) => `${row.category}:${row.index}`)).toEqual([
                'desktop:Jan',
                'desktop:Mar',
                'mobile:Apr'
            ])
        })

        it('treats every value of a single row as isolated', () => {
            const rows = buildSeriesRows(
                [{ month: 'Jan', desktop: 1, mobile: 4 }],
                'month',
                categories,
                false
            )
            expect(isolatedRows(rows)).toHaveLength(2)
        })

        it('finds nothing in continuous series', () => {
            expect(
                isolatedRows(buildSeriesRows(data.slice(0, 2), 'month', categories, false))
            ).toEqual([])
        })
    })

    describe('buildSliceRows', () => {
        const browsers = [
            { browser: 'Chrome', visitors: 275 },
            { browser: 'Safari', visitors: 0 },
            { browser: 'Firefox', visitors: null },
            { browser: 'Edge', visitors: 90 }
        ]
        const category = resolveCategories<(typeof browsers)[number]>(['visitors'])[0]

        it('keeps positive slices with their own color slot', () => {
            const { rows, items } = buildSliceRows(browsers, 'browser', category)
            expect(rows.map((row) => [row.label, row.value])).toEqual([
                ['Chrome', 275],
                ['Edge', 90]
            ])
            expect(items).toEqual([
                { key: 'Chrome', label: 'Chrome', color: 'var(--color-chart-1)' },
                { key: 'Edge', label: 'Edge', color: 'var(--color-chart-4)' }
            ])
        })

        it('colors slices from the colors list in data order', () => {
            const { items } = buildSliceRows(browsers, 'browser', category, [
                'info',
                'red',
                'blue',
                'success'
            ])
            expect(items.map((item) => item.color)).toEqual([
                'var(--color-info)',
                'var(--color-success)'
            ])
        })

        it('adds up slices that share a label', () => {
            const { rows, items } = buildSliceRows(
                [
                    { browser: 'Chrome', visitors: 10 },
                    { browser: 'Safari', visitors: 4 },
                    { browser: 'Chrome', visitors: 5 }
                ],
                'browser',
                category
            )
            expect(rows.map((row) => [row.label, row.value, row.rows.length])).toEqual([
                ['Chrome', 15, 2],
                ['Safari', 4, 1]
            ])
            expect(items.map((item) => item.label)).toEqual(['Chrome', 'Safari'])
        })

        it('drops a slice whose values add up to zero or less', () => {
            const { items } = buildSliceRows(
                [
                    { browser: 'Chrome', visitors: 10 },
                    { browser: 'Chrome', visitors: -10 },
                    { browser: 'Safari', visitors: -3 }
                ],
                'browser',
                category
            )
            expect(items).toEqual([])
        })

        it('never labels a slice "undefined"', () => {
            const { items } = buildSliceRows(
                [
                    { visitors: 3 },
                    { browser: null, visitors: 4 },
                    { browser: 'Edge', visitors: 1 }
                ] as never,
                'browser',
                category
            )
            expect(items.map((item) => item.label)).toEqual(['Edge'])
        })

        it('returns nothing without a value category', () => {
            expect(buildSliceRows(browsers, 'browser', undefined)).toEqual({ rows: [], items: [] })
        })
    })

    describe('ringInnerRadius', () => {
        it('subtracts the thickness from the radius', () => {
            expect(ringInnerRadius(100, 24)).toBe(76)
        })

        it.each([0, -5])('keeps a ring of at least one pixel for %s', (thickness) => {
            expect(ringInnerRadius(100, thickness)).toBe(99)
        })

        it('draws a pie when the thickness reaches the radius', () => {
            expect(ringInnerRadius(100, 100)).toBe(0)
            expect(ringInnerRadius(100, 9999)).toBe(0)
        })

        it.each([NaN, Infinity])('falls back to the default thickness for %s', (thickness) => {
            expect(ringInnerRadius(100, thickness)).toBe(76)
        })

        it('never returns a negative radius', () => {
            expect(ringInnerRadius(10, 24)).toBe(0)
        })
    })

    describe('defaultAriaLabel', () => {
        it('names the type and the series', () => {
            expect(defaultAriaLabel('line', ['Desktop', 'Mobile'])).toBe(
                'Line chart: Desktop, Mobile'
            )
        })

        it('names only the type without series', () => {
            expect(defaultAriaLabel('donut', [])).toBe('Donut chart')
        })
    })

    describe('createCurve', () => {
        const points = [
            [0, 100],
            [50, 20],
            [100, 60],
            [150, 60]
        ] as const

        it('leaves linear interpolation to the engine', () => {
            expect(createCurve('linear')).toBeUndefined()
        })

        it('draws step lines through the midpoints', () => {
            expect(createCurve('step')!.line(points.slice(0, 2))).toBe('M0,100L25,100L25,20L50,20')
        })

        it('draws monotone curves through every point', () => {
            const path = createCurve('monotone')!.line(points)
            expect(path.startsWith('M0,100C')).toBe(true)
            expect(path.endsWith('150,60')).toBe(true)
            expect(path.match(/C/g)).toHaveLength(3)
        })

        it('keeps a monotone curve inside the range of its points', () => {
            const ys = numbers(createCurve('monotone')!.line(points)).filter(
                (_, position) => position % 2 === 1
            )
            expect(Math.min(...ys)).toBeGreaterThanOrEqual(20)
            expect(Math.max(...ys)).toBeLessThanOrEqual(100)
        })

        it('keeps a flat run flat', () => {
            const path = createCurve('monotone')!.line([
                [0, 50],
                [10, 50],
                [20, 50]
            ])
            expect(numbers(path).filter((_, position) => position % 2 === 1)).toEqual(
                Array(7).fill(50)
            )
        })

        it('falls back to straight segments for two points', () => {
            expect(
                createCurve('monotone')!.line([
                    [0, 0],
                    [10, 10]
                ])
            ).toBe('M0,0L10,10')
        })

        it('closes an area along the reversed baseline', () => {
            const area = createCurve('step')!.area(
                [
                    [0, 10],
                    [20, 30]
                ],
                [
                    [0, 100],
                    [20, 100]
                ]
            )
            expect(area).toBe('M0,10L10,10L10,30L20,30L20,100L10,100L10,100L0,100Z')
        })

        it('returns an empty path without points', () => {
            const curve = createCurve('monotone')!
            expect(curve.line([])).toBe('')
            expect(curve.area([], [])).toBe('')
        })
    })
})
