import { describe, expect, it } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render } from 'svelte/server'
import Chart from './Chart.svelte'
import type { ChartCenterSlotProps } from './chart.types.js'

const data = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 }
]

const browsers = [
    { browser: 'Chrome', visitors: 275 },
    { browser: 'Safari', visitors: 200 }
]

describe('Chart SSR', () => {
    it('renders the complete SVG on the server', () => {
        const { body } = render(Chart, {
            props: { data, index: 'month', categories: ['desktop', 'mobile'] }
        })
        expect(body).toContain('<svg')
        expect(body).toContain('role="img"')
        expect(body).toContain('aria-label="Line chart: desktop, mobile"')
        expect(body.match(/class="ts-chart__line"/g)).toHaveLength(2)
    })

    it('sizes the server SVG from initialWidth and height', () => {
        const { body } = render(Chart, {
            props: { data, index: 'month', categories: ['desktop'], initialWidth: 800, height: 200 }
        })
        expect(body).toContain('viewBox="0 0 800 200"')
    })

    it('renders the legend on the server', () => {
        const { body } = render(Chart, {
            props: {
                data,
                index: 'month',
                categories: [
                    { key: 'desktop', label: 'Desktop' },
                    { key: 'mobile', label: 'Mobile' }
                ]
            }
        })
        expect(body).toMatch(/<ul[^>]*>[\s\S]*Desktop[\s\S]*Mobile[\s\S]*<\/ul>/)
    })

    it('renders donut center content on the server', () => {
        const center = createRawSnippet<[ChartCenterSlotProps]>((props) => ({
            render: () => `<strong>${props().total} total</strong>`
        }))
        const { body } = render(Chart, {
            props: {
                type: 'donut',
                data: browsers,
                index: 'browser',
                categories: ['visitors'],
                center
            }
        })
        expect(body).toContain('<strong>475 total</strong>')
        expect(body).toContain('class="ts-chart__arc"')
    })

    it('renders default axis ticks without locale separators', () => {
        const { body } = render(Chart, {
            props: {
                data: [
                    { month: 'Jan', desktop: 12_500 },
                    { month: 'Feb', desktop: 30_500 }
                ],
                index: 'month',
                categories: ['desktop']
            }
        })
        const ticks = [...body.matchAll(/data-ts-key="y-tick-label[^"]*"[^>]*>([^<]*)</g)].map(
            (match) => match[1]
        )
        expect(ticks.length).toBeGreaterThan(1)
        expect(ticks.every((tick) => /^-?\d+$/.test(tick))).toBe(true)
    })

    it('renders the same markup twice for the same props', () => {
        const props = { data, index: 'month' as const, categories: ['desktop' as const], id: 'a' }
        expect(render(Chart, { props }).body).toBe(render(Chart, { props }).body)
    })
})
