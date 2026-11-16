<script lang="ts">
    import { Chart } from '$lib/components/Chart/index.js'
    import type { ChartCurve, ChartType } from '$lib/components/Chart/index.js'
    import { Badge, Button, Card, Link, Switch, ToggleGroup } from '$lib/index.js'

    type Row = Record<string, unknown>

    interface Case {
        title: string
        expected: string
        data: Row[]
        categories?: string[]
        format?: (value: number) => string
        width?: number
        height?: number
    }

    const series = ['desktop', 'mobile']

    const compact = new Intl.NumberFormat('en-US', { notation: 'compact' })

    const cartesianCases: Case[] = [
        {
            title: 'Empty data',
            expected: 'Renders an empty plot, no legend entries are lost.',
            data: []
        },
        {
            title: 'A single row',
            expected: 'One x position. Lines keep a dot even without points.',
            data: [{ month: 'Jan', desktop: 186, mobile: 80 }]
        },
        {
            title: 'Missing values',
            expected: 'Gaps instead of zeros. A value between gaps keeps a dot.',
            data: [
                { month: 'Jan', desktop: 186, mobile: 80 },
                { month: 'Feb', desktop: null, mobile: 200 },
                { month: 'Mar', desktop: 237 },
                { month: 'Apr', desktop: 73, mobile: 190 },
                { month: 'May', desktop: 209, mobile: null }
            ]
        },
        {
            title: 'Only missing values',
            expected: 'Axes render, nothing is plotted, no NaN in the SVG.',
            data: [
                { month: 'Jan', desktop: null, mobile: null },
                { month: 'Feb', desktop: null, mobile: null }
            ]
        },
        {
            title: 'Values that are not numbers',
            expected: 'NaN, Infinity and numeric strings are treated as gaps.',
            data: [
                { month: 'Jan', desktop: NaN, mobile: 80 },
                { month: 'Feb', desktop: Infinity, mobile: 200 },
                { month: 'Mar', desktop: '237', mobile: 120 },
                { month: 'Apr', desktop: 73, mobile: 190 }
            ]
        },
        {
            title: 'Negative values',
            expected: 'Bars grow down from zero, stacks diverge around zero.',
            data: [
                { month: 'Jan', desktop: -40, mobile: 30 },
                { month: 'Feb', desktop: 60, mobile: -20 },
                { month: 'Mar', desktop: -10, mobile: -50 },
                { month: 'Apr', desktop: 80, mobile: 45 }
            ]
        },
        {
            title: 'Only zeros',
            expected: 'A flat line on the baseline, the y axis stays readable.',
            data: [
                { month: 'Jan', desktop: 0, mobile: 0 },
                { month: 'Feb', desktop: 0, mobile: 0 },
                { month: 'Mar', desktop: 0, mobile: 0 }
            ]
        },
        {
            title: 'Rows that share an index',
            expected: 'The two Jan rows are added together: Desktop 120 + 66.',
            data: [
                { month: 'Jan', desktop: 120, mobile: 50 },
                { month: 'Feb', desktop: 305, mobile: 200 },
                { month: 'Jan', desktop: 66, mobile: 30 },
                { month: 'Mar', desktop: 237, mobile: 120 }
            ]
        },
        {
            title: 'Rows without an index',
            expected: 'Rows with a missing or null month are skipped.',
            data: [
                { desktop: 999, mobile: 999 },
                { month: 'Feb', desktop: 305, mobile: 200 },
                { month: null, desktop: 999, mobile: 999 },
                { month: 'Mar', desktop: 237, mobile: 120 }
            ]
        },
        {
            title: 'Numeric index',
            expected: 'Years stay in data order as categories.',
            data: [
                { month: 2022, desktop: 186, mobile: 80 },
                { month: 2023, desktop: 305, mobile: 200 },
                { month: 2024, desktop: 237, mobile: 120 },
                { month: 2025, desktop: 260, mobile: 150 }
            ]
        },
        {
            title: 'Ninety points',
            expected: 'Tick labels thin out instead of overlapping.',
            data: Array.from({ length: 90 }, (_, day) => ({
                month: `Day ${day + 1}`,
                desktop: 120 + Math.round(60 * Math.sin(day / 6)),
                mobile: 80 + Math.round(40 * Math.cos(day / 9))
            }))
        },
        {
            title: 'Long labels',
            expected: 'Overlapping tick labels are dropped, the tooltip keeps the full text.',
            data: [
                { month: 'North America enterprise accounts', desktop: 186, mobile: 80 },
                { month: 'Europe, Middle East and Africa', desktop: 305, mobile: 200 },
                { month: 'Asia Pacific self-serve plans', desktop: 237, mobile: 120 }
            ]
        },
        {
            title: 'Huge numbers',
            expected: 'format keeps the axis narrow: 1.3B instead of 1,250,000,000.',
            data: [
                { month: 'Q1', desktop: 1_250_000_000, mobile: 820_000_000 },
                { month: 'Q2', desktop: 3_400_000_000, mobile: 1_900_000_000 },
                { month: 'Q3', desktop: 2_700_000_000, mobile: 2_100_000_000 }
            ],
            format: (value) => compact.format(value)
        },
        {
            title: 'Tiny decimals',
            expected: 'Small values get a readable axis and exact tooltip values.',
            data: [
                { month: 'Jan', desktop: 0.0012, mobile: 0.0004 },
                { month: 'Feb', desktop: 0.0034, mobile: 0.0011 },
                { month: 'Mar', desktop: 0.0021, mobile: 0.0019 }
            ]
        },
        {
            title: 'Ten series',
            expected: 'Past six series the palette repeats as lighter tints.',
            data: ['Jan', 'Feb', 'Mar', 'Apr'].map((month, position) => ({
                month,
                ...Object.fromEntries(
                    Array.from({ length: 10 }, (_, key) => [
                        `Series ${key + 1}`,
                        10 + ((key * 7 + position * 13) % 30)
                    ])
                )
            })),
            categories: Array.from({ length: 10 }, (_, key) => `Series ${key + 1}`)
        },
        {
            title: 'Markup in labels',
            expected: 'Labels render as text, never as HTML.',
            data: [
                { month: '<img src=x onerror=alert(1)>', desktop: 186, mobile: 80 },
                { month: 'Q&A <b>bold</b>', desktop: 305, mobile: 200 }
            ],
            categories: ['desktop', 'mobile']
        },
        {
            title: 'Tiny box',
            expected: 'A 160 × 64 chart stays finite and focusable.',
            data: [
                { month: 'Jan', desktop: 186, mobile: 80 },
                { month: 'Feb', desktop: 305, mobile: 200 },
                { month: 'Mar', desktop: 237, mobile: 120 }
            ],
            width: 160,
            height: 64
        }
    ]

    const donutCases: (Case & { thickness?: number })[] = [
        {
            title: 'Empty data',
            expected: 'No slices, the center still shows a total of 0.',
            data: []
        },
        {
            title: 'A single slice',
            expected: 'A closed ring, no gap at the top.',
            data: [{ browser: 'Chrome', visitors: 275 }]
        },
        {
            title: 'Only zeros',
            expected: 'Zero slices are not drawn and not listed.',
            data: [
                { browser: 'Chrome', visitors: 0 },
                { browser: 'Safari', visitors: 0 }
            ]
        },
        {
            title: 'Negative and missing values',
            expected: 'Only the positive slices are drawn.',
            data: [
                { browser: 'Chrome', visitors: -40 },
                { browser: 'Safari', visitors: null },
                { browser: 'Firefox', visitors: 187 },
                { browser: 'Edge', visitors: 173 }
            ]
        },
        {
            title: 'A tiny slice',
            expected: 'A 0.001% slice stays in the legend and the tooltip.',
            data: [
                { browser: 'Chrome', visitors: 100_000 },
                { browser: 'Safari', visitors: 1 }
            ]
        },
        {
            title: 'Rows that share a label',
            expected: 'Chrome rows are added together, legend and slices stay in step.',
            data: [
                { browser: 'Chrome', visitors: 150 },
                { browser: 'Safari', visitors: 200 },
                { browser: 'Chrome', visitors: 125 }
            ]
        },
        {
            title: 'Rows without a label',
            expected: 'Rows without a browser are skipped, never shown as "undefined".',
            data: [
                { visitors: 500 },
                { browser: 'Firefox', visitors: 187 },
                { browser: null, visitors: 500 },
                { browser: 'Edge', visitors: 173 }
            ]
        },
        {
            title: 'Fourteen slices',
            expected: 'Colors repeat as tints, the legend wraps.',
            data: Array.from({ length: 14 }, (_, slice) => ({
                browser: `Browser ${slice + 1}`,
                visitors: 20 + slice * 7
            }))
        },
        {
            title: 'thickness={0}',
            expected: 'Clamped to a 1px ring instead of an invisible one.',
            data: [
                { browser: 'Chrome', visitors: 275 },
                { browser: 'Safari', visitors: 200 },
                { browser: 'Firefox', visitors: 187 }
            ],
            thickness: 0
        },
        {
            title: 'thickness={9999}',
            expected: 'A thickness past the radius draws a pie.',
            data: [
                { browser: 'Chrome', visitors: 275 },
                { browser: 'Safari', visitors: 200 },
                { browser: 'Firefox', visitors: 187 }
            ],
            thickness: 9999
        }
    ]

    const typeItems = [
        { value: 'line', label: 'Line', leadingIcon: 'lucide:chart-line' },
        { value: 'area', label: 'Area', leadingIcon: 'lucide:chart-area' },
        { value: 'bar', label: 'Bar', leadingIcon: 'lucide:chart-column' }
    ]
    const curveItems = [
        { value: 'linear', label: 'Linear' },
        { value: 'monotone', label: 'Monotone' },
        { value: 'step', label: 'Step' }
    ]

    let type = $state<Exclude<ChartType, 'donut'>>('line')
    let curve = $state<ChartCurve>('linear')
    let stacked = $state(false)
    let points = $state(false)

    const base = [
        { month: 'Jan', desktop: 186, mobile: 80, tablet: 42 },
        { month: 'Feb', desktop: 305, mobile: 200, tablet: 61 },
        { month: 'Mar', desktop: 237, mobile: 120, tablet: 58 },
        { month: 'Apr', desktop: 73, mobile: 190, tablet: 77 }
    ]
    const allSeries = ['desktop', 'mobile', 'tablet']
    const types: ChartType[] = ['line', 'area', 'bar', 'donut']

    let dynamicData = $state<Row[]>(base)
    let dynamicSeries = $state(allSeries)
    let dynamicType = $state<ChartType>('bar')
    let dynamicStacked = $state(false)
    let updates = $state(0)

    function burst() {
        for (let step = 0; step < 12; step++) {
            dynamicType = types[step % types.length]
            dynamicStacked = step % 2 === 0
            dynamicData =
                step % 3 === 0
                    ? []
                    : base.map((row) => ({ ...row, desktop: row.desktop + step * 10 }))
        }
        dynamicType = 'bar'
        dynamicData = base
        updates += 12
    }
</script>

<div class="space-y-10">
    <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-2xl font-bold">Chart edge cases</h1>
            <Badge label="sv5ui/chart" variant="soft" size="sm" />
        </div>
        <p class="text-on-surface-variant">
            Data that commonly breaks charts. Every case below renders without errors, keeps the SVG
            free of NaN and stays reachable with the keyboard. Each one is covered by a test. Back
            to the <Link href="/chart" class="text-primary">Chart demo</Link>.
        </p>
    </div>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Line, area and bar</h2>
        <div
            class="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-surface-container-high p-4"
        >
            <ToggleGroup
                value={type}
                onValueChange={(value: string) =>
                    value && (type = value as Exclude<ChartType, 'donut'>)}
                items={typeItems}
                aria-label="Chart type"
            />
            <ToggleGroup
                value={curve}
                onValueChange={(value: string) => value && (curve = value as ChartCurve)}
                items={curveItems}
                aria-label="Curve"
                disabled={type === 'bar'}
            />
            <Switch bind:checked={stacked} label="Stacked" disabled={type === 'line'} />
            <Switch bind:checked={points} label="Points" disabled={type === 'bar'} />
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {#each cartesianCases as item (item.title)}
                <Card variant="outline" ui={{ body: 'space-y-3' }}>
                    {#snippet header()}
                        <div class="space-y-1">
                            <h3 class="font-semibold">{item.title}</h3>
                            <p class="text-xs text-on-surface-variant">{item.expected}</p>
                        </div>
                    {/snippet}
                    <Chart
                        {type}
                        {curve}
                        {stacked}
                        {points}
                        data={item.data}
                        index="month"
                        categories={item.categories ?? series}
                        format={item.format}
                        width={item.width}
                        height={item.height ?? 200}
                        aria-label={`${item.title}, ${type} chart`}
                    />
                </Card>
            {/each}
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Donut</h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {#each donutCases as item (item.title)}
                <Card variant="outline">
                    {#snippet header()}
                        <div class="space-y-1">
                            <h3 class="font-semibold">{item.title}</h3>
                            <p class="text-xs text-on-surface-variant">{item.expected}</p>
                        </div>
                    {/snippet}
                    <Chart
                        type="donut"
                        data={item.data}
                        index="browser"
                        categories={['visitors']}
                        thickness={item.thickness}
                        legend
                        height={200}
                        aria-label={`${item.title}, donut chart`}
                    >
                        {#snippet center({ total, items })}
                            <span class="text-lg font-semibold text-on-surface tabular-nums"
                                >{total}</span
                            >
                            <span class="text-xs">{items.length} slices</span>
                        {/snippet}
                    </Chart>
                </Card>
            {/each}
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dynamic</h2>
        <p class="text-sm text-on-surface-variant">
            Clear and restore data, change series and switch type while the chart animates. The
            burst runs twelve updates in a row.
        </p>
        <Card variant="outline" ui={{ body: 'space-y-4' }}>
            <div class="flex flex-wrap gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    label="Clear data"
                    onclick={() => (dynamicData = [])}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Restore data"
                    onclick={() => (dynamicData = base)}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Remove a series"
                    disabled={dynamicSeries.length === 0}
                    onclick={() => (dynamicSeries = dynamicSeries.slice(0, -1))}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Add a series"
                    disabled={dynamicSeries.length === allSeries.length}
                    onclick={() => (dynamicSeries = allSeries.slice(0, dynamicSeries.length + 1))}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Next type"
                    onclick={() =>
                        (dynamicType = types[(types.indexOf(dynamicType) + 1) % types.length])}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label={dynamicStacked ? 'Unstack' : 'Stack'}
                    onclick={() => (dynamicStacked = !dynamicStacked)}
                />
                <Button size="sm" label="Run burst" leadingIcon="lucide:zap" onclick={burst} />
            </div>
            <p class="text-xs text-on-surface-variant">
                type <span class="font-mono text-on-surface">{dynamicType}</span> · rows
                <span class="font-mono text-on-surface">{dynamicData.length}</span> · series
                <span class="font-mono text-on-surface">{dynamicSeries.length}</span> · burst
                updates
                <span class="font-mono text-on-surface">{updates}</span>
            </p>
            <Chart
                type={dynamicType}
                stacked={dynamicStacked}
                data={dynamicData}
                index="month"
                categories={dynamicType === 'donut' ? dynamicSeries.slice(0, 1) : dynamicSeries}
                height={240}
            />
        </Card>
    </section>
</div>
