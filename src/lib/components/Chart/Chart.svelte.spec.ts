import '../../../routes/layout.css'
import { userEvent } from 'vitest/browser'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import { defineChart, lineY } from '@tanstack/charts'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import Chart from './Chart.svelte'
import { defineConfig, resetConfig } from '../../config.js'
import type { ChartCenterSlotProps, ChartTooltipSlotProps } from './chart.types.js'

afterEach(() => resetConfig())

type Row = { month: string; desktop: number; mobile: number }

const data: Row[] = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 }
]

const categories = [
    { key: 'desktop', label: 'Desktop' },
    { key: 'mobile', label: 'Mobile' }
] as const

const browsers = [
    { browser: 'Chrome', visitors: 275 },
    { browser: 'Safari', visitors: 200 },
    { browser: 'Firefox', visitors: 187 }
]

const getRoot = (container: Element) => container.firstElementChild as HTMLElement
const getSvg = (container: Element) => container.querySelector('svg.ts-chart') as SVGSVGElement
const getLegend = (container: Element) => container.querySelector('ul')
const legendLabels = (container: Element) =>
    [...(getLegend(container)?.querySelectorAll('li') ?? [])].map((item) =>
        item.textContent?.trim()
    )
const legendColors = (container: Element) =>
    [...(getLegend(container)?.querySelectorAll('li > span:first-child') ?? [])].map(
        (indicator) => (indicator as HTMLElement).style.backgroundColor
    )
const findTooltip = () =>
    [...document.querySelectorAll('[data-active]')].map((row) =>
        row.textContent?.replace(/\s+/g, ' ').trim()
    )

async function focusFirstPoint(container: Element) {
    getSvg(container).focus()
    await vi.waitFor(() => expect(findTooltip().length).toBeGreaterThan(0))
}

describe('Chart', () => {
    describe('rendering', () => {
        it.each(['line', 'area', 'bar', 'donut'] as const)('renders a %s chart', (type) => {
            const props =
                type === 'donut'
                    ? {
                          type,
                          data: browsers,
                          index: 'browser' as const,
                          categories: ['visitors' as const]
                      }
                    : { type, data, index: 'month' as const, categories }
            const { container } = render(Chart, props)
            expect(getSvg(container)).not.toBeNull()
            expect(getRoot(container).dataset.type).toBe(type)
        })

        it('renders one line per category', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(container.querySelectorAll('.ts-chart__line')).toHaveLength(2)
        })

        it('renders bars for every value', () => {
            const { container } = render(Chart, { type: 'bar', data, index: 'month', categories })
            expect(
                container.querySelectorAll('.ts-chart__bar rect, .ts-chart__bar path')
            ).toHaveLength(6)
        })

        it('renders a slice per donut row', () => {
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors']
            })
            expect(container.querySelectorAll('.ts-chart__arc path')).toHaveLength(3)
        })

        it('renders an empty chart without data', () => {
            const { container } = render(Chart, { categories: ['desktop'] })
            expect(getSvg(container)).not.toBeNull()
            expect(container.querySelectorAll('.ts-chart__line')).toHaveLength(0)
        })

        it('updates when the data changes', async () => {
            const { container, rerender } = render(Chart, {
                data,
                index: 'month',
                categories: ['desktop'],
                transition: false
            })
            await rerender({ categories: ['desktop', 'mobile'] })
            await vi.waitFor(() =>
                expect(container.querySelectorAll('.ts-chart__line')).toHaveLength(2)
            )
        })
    })

    describe('size', () => {
        it('defaults to a height of 300 pixels', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(container.querySelector<HTMLElement>('.ts-chart-host')!.style.height).toBe(
                '300px'
            )
        })

        it('applies a fixed height and width', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                height: 180,
                width: 320
            })
            const host = container.querySelector<HTMLElement>('.ts-chart-host')!
            expect(host.style.height).toBe('180px')
            expect(host.style.width).toBe('320px')
        })

        it('uses the aspect ratio when no height is set', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                aspectRatio: 2
            })
            const host = container.querySelector<HTMLElement>('.ts-chart-host')!
            expect(host.style.aspectRatio).toBe('2 / 1')
            expect(host.style.height).toBe('')
        })
    })

    describe('accessibility', () => {
        it('derives the accessible name from the series labels', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(getSvg(container).getAttribute('aria-label')).toBe('Line chart: Desktop, Mobile')
        })

        it('derives the accessible name from the slices of a donut', () => {
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors']
            })
            expect(getSvg(container).getAttribute('aria-label')).toBe(
                'Donut chart: Chrome, Safari, Firefox'
            )
        })

        it('uses a custom aria-label and aria-description', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                'aria-label': 'Visitors per month',
                'aria-description': 'Desktop and mobile visitors from January to March.'
            })
            const svg = getSvg(container)
            expect(svg.getAttribute('aria-label')).toBe('Visitors per month')
            expect(svg.querySelector('desc')?.textContent).toBe(
                'Desktop and mobile visitors from January to March.'
            )
            expect(getRoot(container).hasAttribute('aria-label')).toBe(false)
        })

        it('is reachable with the keyboard', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(getSvg(container).getAttribute('tabindex')).toBe('0')
            expect(getSvg(container).getAttribute('role')).toBe('img')
        })
    })

    describe('legend', () => {
        it('is shown for more than one series', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(legendLabels(container)).toEqual(['Desktop', 'Mobile'])
        })

        it('is hidden for a single series', () => {
            const { container } = render(Chart, { data, index: 'month', categories: ['desktop'] })
            expect(getLegend(container)).toBeNull()
        })

        it('follows the legend prop', () => {
            const single = render(Chart, {
                data,
                index: 'month',
                categories: ['desktop'],
                legend: true
            })
            expect(legendLabels(single.container)).toEqual(['desktop'])

            const hidden = render(Chart, { data, index: 'month', categories, legend: false })
            expect(getLegend(hidden.container)).toBeNull()
        })

        it('lists donut slices', () => {
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors']
            })
            expect(legendLabels(container)).toEqual(['Chrome', 'Safari', 'Firefox'])
        })

        it('hides the indicator from assistive technologies', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(
                getLegend(container)!
                    .querySelector('li > span:first-child')!
                    .getAttribute('aria-hidden')
            ).toBe('true')
        })
    })

    describe('colors', () => {
        it('uses the chart palette by default', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(legendColors(container)).toEqual([
                'var(--color-chart-1)',
                'var(--color-chart-2)'
            ])
            expect(container.querySelector('.ts-chart__line path')!.getAttribute('stroke')).toBe(
                'var(--color-chart-1)'
            )
        })

        it('resolves the chart tokens from the theme', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            const indicator =
                getLegend(container)!.querySelector<HTMLElement>('li > span:first-child')!
            expect(getComputedStyle(indicator).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
        })

        it('accepts theme colors and CSS colors', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                colors: ['success', '#8b5cf6']
            })
            expect(legendColors(container)).toEqual(['var(--color-success)', 'rgb(139, 92, 246)'])
        })

        it('prefers a category color over the colors prop', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories: [{ key: 'desktop', color: 'error' }, 'mobile'],
                colors: ['success', 'info']
            })
            expect(legendColors(container)).toEqual(['var(--color-error)', 'var(--color-info)'])
        })

        it('maps the palette for definitions that bring no colors', () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            const root = getComputedStyle(getRoot(container))
            expect(root.getPropertyValue('--ts-chart-1').trim()).not.toBe('')
        })
    })

    describe('options', () => {
        it('draws dots with points', () => {
            const dots = (container: Element) =>
                container.querySelectorAll('circle[stroke="var(--color-surface)"]').length
            expect(dots(render(Chart, { data, index: 'month', categories }).container)).toBe(0)
            expect(
                dots(render(Chart, { data, index: 'month', categories, points: true }).container)
            ).toBe(6)
        })

        it('hides the grid', () => {
            const { container } = render(Chart, { data, index: 'month', categories, grid: false })
            expect(container.querySelector('.ts-chart__grid')).toBeNull()
        })

        it('hides the axes', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                xAxis: false,
                yAxis: false
            })
            expect(container.querySelector('[data-ts-key^="x-tick-label"]')).toBeNull()
            expect(container.querySelector('[data-ts-key^="y-tick-label"]')).toBeNull()
        })

        it('renders axis titles', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                xLabel: 'Month',
                yLabel: 'Visitors'
            })
            const texts = [...container.querySelectorAll('svg text')].map(
                (text) => text.textContent
            )
            expect(texts).toContain('Month')
            expect(texts).toContain('Visitors')
        })

        it('formats y axis ticks', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                format: (value: number) => `$${value}`
            })
            const ticks = [...container.querySelectorAll('[data-ts-key^="y-tick-label"]')]
            expect(ticks.length).toBeGreaterThan(0)
            expect(ticks.every((tick) => tick.textContent?.startsWith('$'))).toBe(true)
        })

        it('changes the donut ring width with thickness', () => {
            const path = (thickness: number) =>
                render(Chart, {
                    type: 'donut',
                    data: browsers,
                    index: 'browser',
                    categories: ['visitors'],
                    thickness
                })
                    .container.querySelector('.ts-chart__arc path')!
                    .getAttribute('d')
            expect(path(12)).not.toBe(path(48))
        })
    })

    describe('tooltip', () => {
        it('shows every series of the focused x value', async () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            await focusFirstPoint(container)
            expect(document.body.textContent).toContain('January')
            expect(findTooltip()).toEqual(['Desktop 186', 'Mobile 80'])
        })

        it('marks the focused series as active', async () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            await focusFirstPoint(container)
            const active = [...document.querySelectorAll('[data-active="true"]')]
            expect(active).toHaveLength(1)
        })

        it('formats tooltip values', async () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                format: (value: number) => `${value} visits`
            })
            await focusFirstPoint(container)
            expect(findTooltip()).toEqual(['Desktop 186 visits', 'Mobile 80 visits'])
        })

        it('shows the plotted value of a stacked series, not its running total', async () => {
            const { container } = render(Chart, {
                type: 'bar',
                stacked: true,
                data,
                index: 'month',
                categories
            })
            await focusFirstPoint(container)
            expect(findTooltip()).toEqual(['Desktop 186', 'Mobile 80'])
        })

        it('moves with the arrow keys', async () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            await focusFirstPoint(container)
            await userEvent.keyboard('{ArrowRight}')
            await vi.waitFor(() => expect(document.body.textContent).toContain('February'))
        })

        it('shows the focused slice of a donut', async () => {
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors']
            })
            await focusFirstPoint(container)
            const rows = findTooltip()
            expect(rows).toHaveLength(1)
            expect(browsers.map((row) => `${row.browser} ${row.visitors}`)).toContain(rows[0])
        })

        it('is not shown with tooltip false', async () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                tooltip: false
            })
            getSvg(container).focus()
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(findTooltip()).toEqual([])
        })

        it('draws its own surface', async () => {
            const { container } = render(Chart, { data, index: 'month', categories })
            await focusFirstPoint(container)
            const surface = document.querySelector('[data-active]')!.parentElement!
            expect(getComputedStyle(surface).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
            expect(getComputedStyle(surface).borderTopWidth).toBe('1px')
        })

        it('wraps the tooltipSlot snippet in the same surface', async () => {
            const tooltipSlot = createRawSnippet<[ChartTooltipSlotProps]>(() => ({
                render: () => '<p data-active="custom">Custom</p>'
            }))
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                tooltipSlot,
                ui: { tooltip: 'custom-tooltip' }
            })
            await focusFirstPoint(container)
            const surface = document.querySelector('[data-active="custom"]')!.parentElement!
            expect(surface.classList).toContain('custom-tooltip')
            expect(getComputedStyle(surface).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
        })

        it('renders the tooltipSlot snippet', async () => {
            const tooltipSlot = createRawSnippet<[ChartTooltipSlotProps]>((props) => ({
                render: () =>
                    `<p data-active="custom">${props().title}: ${props()
                        .rows.map((row) => row.value)
                        .join(' / ')}</p>`
            }))
            const { container } = render(Chart, { data, index: 'month', categories, tooltipSlot })
            await focusFirstPoint(container)
            expect(findTooltip()).toEqual(['January: 186 / 80'])
        })
    })

    describe('callbacks', () => {
        it('passes the series datum to onSelect', async () => {
            const onSelect = vi.fn()
            const { container } = render(Chart, { data, index: 'month', categories, onSelect })
            await focusFirstPoint(container)
            await userEvent.keyboard('{Enter}')
            await vi.waitFor(() => expect(onSelect).toHaveBeenCalled())
            const point = onSelect.mock.calls.at(-1)![0]
            expect(point.datum).toMatchObject({
                index: 'January',
                value: point.datum.row[point.datum.category]
            })
            expect(data).toContain(point.datum.row)
        })

        it('reports focus changes', async () => {
            const onFocusChange = vi.fn()
            const onFocusGroupChange = vi.fn()
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                onFocusChange,
                onFocusGroupChange
            })
            await focusFirstPoint(container)
            await vi.waitFor(() => expect(onFocusChange).toHaveBeenCalled())
            expect(onFocusChange.mock.calls.at(-1)![0].datum.row).toBe(data[0])
            const group = onFocusGroupChange.mock.calls.at(-1)![0]
            expect(
                group.map((point: { datum: { category: string } }) => point.datum.category)
            ).toEqual(['desktop', 'mobile'])
        })

        it('passes the original row of a donut slice', async () => {
            const onFocusChange = vi.fn()
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors'],
                onFocusChange
            })
            await focusFirstPoint(container)
            await vi.waitFor(() => expect(onFocusChange).toHaveBeenCalled())
            const { datum } = onFocusChange.mock.calls.at(-1)![0]
            expect(browsers).toContain(datum.row)
            expect(datum).toMatchObject({
                index: datum.row.browser,
                label: datum.row.browser,
                value: datum.row.visitors
            })
        })
    })

    describe('center', () => {
        const center = createRawSnippet<[ChartCenterSlotProps]>((props) => ({
            render: () =>
                `<span data-testid="center">${props().total} / ${props().items.length}</span>`
        }))

        it('renders inside a donut with the total', () => {
            const { container } = render(Chart, {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors'],
                center
            })
            expect(container.querySelector('[data-testid="center"]')?.textContent).toBe('662 / 3')
        })

        it('is ignored outside a donut', () => {
            const { container } = render(Chart, { data, index: 'month', categories, center })
            expect(container.querySelector('[data-testid="center"]')).toBeNull()
        })
    })

    describe('definition', () => {
        const definition = defineChart({
            marks: [lineY(data, { x: 'month', y: 'desktop', stroke: 'tomato' })],
            scales: {
                x: { scale: () => scalePoint<string>() },
                y: { scale: scaleLinear }
            },
            tooltip
        })

        it('takes precedence over data, index and categories', () => {
            const { container } = render(Chart, {
                definition,
                data,
                index: 'month',
                categories,
                'aria-label': 'Desktop visitors'
            })
            const lines = container.querySelectorAll('.ts-chart__line path')
            expect(lines).toHaveLength(1)
            expect(lines[0].getAttribute('stroke')).toBe('tomato')
            expect(getLegend(container)).toBeNull()
            expect(getRoot(container).hasAttribute('data-type')).toBe(false)
        })

        it('falls back to a generic accessible name', () => {
            const { container } = render(Chart, { definition })
            expect(getSvg(container).getAttribute('aria-label')).toBe('Chart')
        })

        it('styles the definition tooltip', async () => {
            const { container } = render(Chart, { definition, 'aria-label': 'Desktop visitors' })
            await focusFirstPoint(container)
            expect(findTooltip().length).toBeGreaterThan(0)
        })
    })

    describe('edge cases', () => {
        const cartesianCases: Record<string, Record<string, unknown>[]> = {
            empty: [],
            'a single row': [{ month: 'Jan', desktop: 5, mobile: 3 }],
            'missing values': [
                { month: 'Jan', desktop: 5, mobile: null },
                { month: 'Feb', desktop: null, mobile: 4 },
                { month: 'Mar', desktop: 7 }
            ],
            'only missing values': [
                { month: 'Jan', desktop: null, mobile: null },
                { month: 'Feb', desktop: null, mobile: null }
            ],
            'values that are not finite numbers': [
                { month: 'Jan', desktop: NaN, mobile: Infinity },
                { month: 'Feb', desktop: '12', mobile: 4 }
            ],
            'negative values': [
                { month: 'Jan', desktop: -5, mobile: 3 },
                { month: 'Feb', desktop: 4, mobile: -6 }
            ],
            'only zeros': [
                { month: 'Jan', desktop: 0, mobile: 0 },
                { month: 'Feb', desktop: 0, mobile: 0 }
            ],
            'rows that share an index': [
                { month: 'Jan', desktop: 1, mobile: 2 },
                { month: 'Jan', desktop: 3, mobile: 4 },
                { month: 'Feb', desktop: 2, mobile: 1 }
            ],
            'rows without an index': [
                { desktop: 1, mobile: 2 },
                { month: null, desktop: 3, mobile: 4 },
                { month: 'Feb', desktop: 2, mobile: 1 }
            ],
            'ninety points': Array.from({ length: 90 }, (_, day) => ({
                month: `Day ${day + 1}`,
                desktop: (day * 37) % 100,
                mobile: (day * 11) % 60
            }))
        }

        const donutCases: Record<string, Record<string, unknown>[]> = {
            empty: [],
            'a single slice': [{ browser: 'Chrome', visitors: 10 }],
            'only zeros': [
                { browser: 'Chrome', visitors: 0 },
                { browser: 'Safari', visitors: 0 }
            ],
            'negative and missing values': [
                { browser: 'Chrome', visitors: -5 },
                { browser: 'Safari', visitors: null },
                { browser: 'Edge', visitors: 4 }
            ],
            'a tiny slice': [
                { browser: 'Chrome', visitors: 100_000 },
                { browser: 'Safari', visitors: 1 }
            ],
            'rows that share a label': [
                { browser: 'Chrome', visitors: 3 },
                { browser: 'Chrome', visitors: 4 },
                { browser: 'Safari', visitors: 5 }
            ],
            'fourteen slices': Array.from({ length: 14 }, (_, slice) => ({
                browser: `Browser ${slice + 1}`,
                visitors: slice + 1
            }))
        }

        async function renderSafely(props: Record<string, unknown>) {
            const messages: unknown[] = []
            const error = vi
                .spyOn(console, 'error')
                .mockImplementation((...args) => messages.push(args))
            const warn = vi
                .spyOn(console, 'warn')
                .mockImplementation((...args) => messages.push(args))
            try {
                const { container } = render(Chart, props as never)
                const svg = getSvg(container)
                svg.focus()
                await new Promise((resolve) => setTimeout(resolve, 50))
                expect(messages).toEqual([])
                expect(svg.outerHTML).not.toMatch(/NaN|Infinity/)
                return container
            } finally {
                error.mockRestore()
                warn.mockRestore()
            }
        }

        describe.each([
            ['line', false],
            ['area', false],
            ['area', true],
            ['bar', false],
            ['bar', true]
        ] as const)('%s chart (stacked: %s)', (type, stacked) => {
            it.each(Object.entries(cartesianCases))('renders %s', async (_, rows) => {
                await renderSafely({
                    type,
                    stacked,
                    curve: 'monotone',
                    points: true,
                    data: rows,
                    index: 'month',
                    categories
                })
            })
        })

        describe('donut chart', () => {
            it.each(Object.entries(donutCases))('renders %s', async (_, rows) => {
                await renderSafely({
                    type: 'donut',
                    data: rows,
                    index: 'browser',
                    categories: ['visitors']
                })
            })

            it.each([0, -5, NaN, 9999])('renders with thickness %s', async (thickness) => {
                const container = await renderSafely({
                    type: 'donut',
                    data: browsers,
                    index: 'browser',
                    categories: ['visitors'],
                    thickness
                })
                expect(container.querySelectorAll('.ts-chart__arc path')).toHaveLength(3)
            })

            it('keeps the legend and the slices in step for rows that share a label', async () => {
                const container = await renderSafely({
                    type: 'donut',
                    data: donutCases['rows that share a label'],
                    index: 'browser',
                    categories: ['visitors']
                })
                expect(legendLabels(container)).toEqual(['Chrome', 'Safari'])
                expect(container.querySelectorAll('.ts-chart__arc path')).toHaveLength(2)
            })
        })

        it.each(['line', 'area'] as const)(
            'keeps a single %s value visible without points',
            async (type) => {
                const container = await renderSafely({
                    type,
                    data: data.slice(0, 1),
                    index: 'month',
                    categories
                })
                expect(
                    container.querySelectorAll('circle[stroke="var(--color-surface)"]')
                ).toHaveLength(2)
            }
        )

        it('adds up rows that share an index in the tooltip', async () => {
            const container = await renderSafely({
                type: 'bar',
                stacked: true,
                data: cartesianCases['rows that share an index'],
                index: 'month',
                categories
            })
            await vi.waitFor(() => expect(findTooltip()).toEqual(['Desktop 4', 'Mobile 6']))
            expect(container.querySelectorAll('[data-ts-key^="x-tick-label"]')).toHaveLength(2)
        })

        it('renders labels as text, never as markup', async () => {
            const container = await renderSafely({
                type: 'bar',
                data: [
                    { month: '<img src=x onerror=alert(1)>', desktop: 1, mobile: 2 },
                    { month: 'B&C', desktop: 2, mobile: 1 }
                ],
                index: 'month',
                categories: [
                    { key: 'desktop', label: '<b>Desktop</b>' },
                    { key: 'mobile', label: 'Mobile' }
                ]
            })
            await vi.waitFor(() => expect(findTooltip().length).toBe(2))
            expect(container.querySelector('img, b')).toBeNull()
            expect(document.querySelector('[data-active] b')).toBeNull()
            expect(legendLabels(container)).toContain('<b>Desktop</b>')
        })

        it('reuses the palette as tints past the sixth series', async () => {
            const keys = Array.from({ length: 8 }, (_, series) => `s${series}`)
            const container = await renderSafely({
                data: [Object.fromEntries([['month', 'Jan'], ...keys.map((key) => [key, 1])])],
                index: 'month',
                categories: keys
            })
            const colors = legendColors(container)
            expect(colors).toHaveLength(8)
            expect(new Set(colors).size).toBe(8)
            expect(colors[6]).toContain('color-mix')
        })

        it('survives switching type, data and stacking in a row', async () => {
            const messages: unknown[] = []
            const error = vi
                .spyOn(console, 'error')
                .mockImplementation((...args) => messages.push(args))
            const { container, rerender } = render(Chart, {
                data,
                index: 'month',
                categories,
                transition: false
            } as never)
            for (const props of [
                { type: 'area', stacked: true },
                { type: 'bar' },
                { data: [] },
                { type: 'donut', data: browsers, index: 'browser', categories: ['visitors'] },
                { type: 'line', data, index: 'month', categories }
            ]) {
                await rerender(props as never)
            }
            await vi.waitFor(() =>
                expect(container.querySelectorAll('.ts-chart__line')).toHaveLength(2)
            )
            error.mockRestore()
            expect(messages).toEqual([])
        })

        it.each([
            [120, 40],
            [80, 20]
        ])('stays finite in a %ix%i box', async (width, height) => {
            await renderSafely({ data, index: 'month', categories, width, height, xLabel: 'Month' })
            await renderSafely({
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors'],
                width,
                height
            })
        })
    })

    describe('styling', () => {
        it('merges class and ui slots', () => {
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                class: 'custom-root',
                ui: { legend: 'custom-legend', base: 'custom-base' }
            })
            expect(getRoot(container).classList).toContain('custom-root')
            expect(getLegend(container)!.classList).toContain('custom-legend')
            expect(container.querySelector('.custom-base .ts-chart-host')).not.toBeNull()
        })

        it('uses the line indicator for line charts and a swatch for bars', () => {
            const indicator = (type: 'line' | 'bar') =>
                render(Chart, { type, data, index: 'month', categories }).container.querySelector(
                    'ul li > span:first-child'
                )!.classList
            expect(indicator('line')).toContain('h-0.5')
            expect(indicator('bar')).toContain('size-2.5')
        })

        it('forwards attributes and binds ref', () => {
            let ref: HTMLElement | null = null
            const { container } = render(Chart, {
                data,
                index: 'month',
                categories,
                id: 'visitors',
                'data-testid': 'chart',
                get ref() {
                    return ref
                },
                set ref(value) {
                    ref = value
                }
            })
            expect(getRoot(container).id).toBe('visitors')
            expect(getRoot(container).dataset.testid).toBe('chart')
            expect(ref).toBe(getRoot(container))
        })

        it('reads defaults from defineConfig', () => {
            defineConfig({
                chart: { defaultVariants: { type: 'bar' }, slots: { legend: 'config-legend' } }
            })
            const { container } = render(Chart, { data, index: 'month', categories })
            expect(getRoot(container).dataset.type).toBe('bar')
            expect(getLegend(container)!.classList).toContain('config-legend')
        })
    })
})
