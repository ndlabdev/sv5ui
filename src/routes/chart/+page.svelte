<script lang="ts">
    import { Chart } from '$lib/components/Chart/index.js'
    import type { ChartCurve, ChartSeriesDatum, ChartType } from '$lib/components/Chart/index.js'
    import { Badge, Button, Card, Switch, ToggleGroup } from '$lib/index.js'
    import { defineChart, lineY, ruleY } from '@tanstack/charts'
    import { scaleLinear } from '@tanstack/charts/scales/linear'
    import { scalePoint } from '@tanstack/charts/scales/point'
    import { tooltip } from '@tanstack/charts/tooltip'

    type Visitors = { month: string; desktop: number; mobile: number; tablet: number }

    const visitors: Visitors[] = [
        { month: 'Jan', desktop: 186, mobile: 80, tablet: 42 },
        { month: 'Feb', desktop: 305, mobile: 200, tablet: 61 },
        { month: 'Mar', desktop: 237, mobile: 120, tablet: 58 },
        { month: 'Apr', desktop: 73, mobile: 190, tablet: 77 },
        { month: 'May', desktop: 209, mobile: 130, tablet: 69 },
        { month: 'Jun', desktop: 214, mobile: 140, tablet: 93 }
    ]

    const visitorCategories = [
        { key: 'desktop', label: 'Desktop' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'tablet', label: 'Tablet' }
    ] as const

    const browsers = [
        { browser: 'Chrome', visitors: 275 },
        { browser: 'Safari', visitors: 200 },
        { browser: 'Firefox', visitors: 187 },
        { browser: 'Edge', visitors: 173 },
        { browser: 'Other', visitors: 90 }
    ]

    const revenue = [
        { quarter: 'Q1', revenue: 42_300, costs: 31_800 },
        { quarter: 'Q2', revenue: 48_900, costs: 33_400 },
        { quarter: 'Q3', revenue: 53_100, costs: 36_200 },
        { quarter: 'Q4', revenue: 61_700, costs: 38_900 }
    ]

    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })
    const compactCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
    })

    const typeItems = [
        { value: 'line', label: 'Line', leadingIcon: 'lucide:chart-line' },
        { value: 'area', label: 'Area', leadingIcon: 'lucide:chart-area' },
        { value: 'bar', label: 'Bar', leadingIcon: 'lucide:chart-column' },
        { value: 'donut', label: 'Donut', leadingIcon: 'lucide:chart-pie' }
    ]
    const curveItems = [
        { value: 'linear', label: 'Linear' },
        { value: 'monotone', label: 'Monotone' },
        { value: 'step', label: 'Step' }
    ]

    let type = $state<ChartType>('line')
    let curve = $state<ChartCurve>('linear')
    let stacked = $state(false)
    let points = $state(false)
    let grid = $state(true)
    let axes = $state(true)
    let legend = $state(true)
    let showTooltip = $state(true)

    let live = $state<Visitors[]>(visitors)

    function shuffle() {
        live = live.map((row) => ({
            ...row,
            desktop: Math.round(60 + Math.random() * 260),
            mobile: Math.round(40 + Math.random() * 200),
            tablet: Math.round(20 + Math.random() * 100)
        }))
    }

    let selected = $state<ChartSeriesDatum<Visitors> | null>(null)
    let focused = $state<string>('')

    const target = 200
    let targetFocus = $state('')
    const targetDefinition = defineChart({
        marks: [
            ruleY([target], { stroke: 'var(--color-error)', strokeDasharray: '4 4' }),
            lineY(visitors, {
                x: 'month',
                y: 'desktop',
                stroke: 'var(--color-primary)',
                points: true
            })
        ],
        scales: {
            x: { scale: () => scalePoint<string>().padding(0.1) },
            y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Desktop visitors' } }
        },
        tooltip
    })

    const sparklines = [
        { label: 'Desktop', key: 'desktop', color: 'primary' },
        { label: 'Mobile', key: 'mobile', color: 'success' },
        { label: 'Tablet', key: 'tablet', color: 'warning' }
    ] as const

    const lastChange = (key: 'desktop' | 'mobile' | 'tablet') => {
        const [previous, current] = visitors.slice(-2).map((row) => row[key])
        return Math.round(((current - previous) / previous) * 100)
    }
</script>

<div class="space-y-10">
    <div class="space-y-2">
        <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold">Chart</h1>
            <Badge label="sv5ui/chart" variant="soft" size="sm" />
            <Button
                href="/chart/edge-cases"
                size="xs"
                variant="ghost"
                trailingIcon="lucide:arrow-right"
                label="Edge cases"
            />
        </div>
        <p class="text-on-surface-variant">
            Line, area, bar and donut charts built on TanStack Charts, styled with the theme tokens.
            Install the optional peer with <code class="font-mono text-on-surface"
                >pnpm add @tanstack/charts</code
            >.
        </p>
    </div>

    <!-- Playground -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Playground</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap items-center gap-3">
                <ToggleGroup
                    value={type}
                    onValueChange={(value: string) => value && (type = value as ChartType)}
                    items={typeItems}
                    aria-label="Chart type"
                />
                <ToggleGroup
                    value={curve}
                    onValueChange={(value: string) => value && (curve = value as ChartCurve)}
                    items={curveItems}
                    aria-label="Curve"
                    disabled={type === 'bar' || type === 'donut'}
                />
                <Button
                    size="sm"
                    variant="outline"
                    leadingIcon="lucide:shuffle"
                    label="Shuffle data"
                    onclick={shuffle}
                />
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-3">
                <Switch
                    bind:checked={stacked}
                    label="Stacked"
                    disabled={type !== 'area' && type !== 'bar'}
                />
                <Switch
                    bind:checked={points}
                    label="Points"
                    disabled={type !== 'line' && type !== 'area'}
                />
                <Switch bind:checked={grid} label="Grid" disabled={type === 'donut'} />
                <Switch bind:checked={axes} label="Axes" disabled={type === 'donut'} />
                <Switch bind:checked={legend} label="Legend" />
                <Switch bind:checked={showTooltip} label="Tooltip" />
            </div>
            <Card variant="outline">
                {#if type === 'donut'}
                    <Chart
                        type="donut"
                        data={browsers}
                        index="browser"
                        categories={['visitors']}
                        {legend}
                        tooltip={showTooltip}
                        aria-label="Visitors by browser"
                    >
                        {#snippet center({ total })}
                            <span class="text-2xl font-semibold text-on-surface tabular-nums"
                                >{total}</span
                            >
                            <span class="text-xs">visitors</span>
                        {/snippet}
                    </Chart>
                {:else}
                    <Chart
                        {type}
                        data={live}
                        index="month"
                        categories={visitorCategories}
                        {curve}
                        {stacked}
                        {points}
                        {grid}
                        xAxis={axes}
                        yAxis={axes}
                        {legend}
                        tooltip={showTooltip}
                    />
                {/if}
            </Card>
        </div>
    </section>

    <!-- Types -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Types</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-semibold">Line</h3>
                {/snippet}
                <Chart data={visitors} index="month" categories={visitorCategories} height={220} />
            </Card>
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-semibold">Area</h3>
                {/snippet}
                <Chart
                    type="area"
                    data={visitors}
                    index="month"
                    categories={visitorCategories}
                    curve="monotone"
                    height={220}
                />
            </Card>
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-semibold">Bar</h3>
                {/snippet}
                <Chart
                    type="bar"
                    data={visitors}
                    index="month"
                    categories={visitorCategories}
                    height={220}
                />
            </Card>
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-semibold">Donut</h3>
                {/snippet}
                <Chart
                    type="donut"
                    data={browsers}
                    index="browser"
                    categories={['visitors']}
                    height={220}
                />
            </Card>
        </div>
    </section>

    <!-- Stacked -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Stacked</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="font-mono">stacked</code> applies to area and bar. Tooltips show each series'
            own value, not the running total.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <Card variant="outline">
                <Chart
                    type="area"
                    stacked
                    curve="monotone"
                    data={visitors}
                    index="month"
                    categories={visitorCategories}
                    height={240}
                />
            </Card>
            <Card variant="outline">
                <Chart
                    type="bar"
                    stacked
                    data={visitors}
                    index="month"
                    categories={visitorCategories}
                    height={240}
                />
            </Card>
        </div>
    </section>

    <!-- Curves -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Curves &amp; points</h2>
        <div class="grid gap-4 md:grid-cols-3">
            {#each ['linear', 'monotone', 'step'] as const as item (item)}
                <Card variant="outline">
                    {#snippet header()}
                        <h3 class="font-mono text-sm">curve="{item}"</h3>
                    {/snippet}
                    <Chart
                        data={visitors}
                        index="month"
                        categories={['desktop']}
                        curve={item}
                        points
                        height={180}
                    />
                </Card>
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Theme colors and any CSS color. A category <code class="font-mono">color</code> wins
            over
            <code class="font-mono">colors</code>.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-mono text-sm">colors={'{'}['success', '#8b5cf6']}</h3>
                {/snippet}
                <Chart
                    type="bar"
                    data={visitors}
                    index="month"
                    categories={['desktop', 'mobile']}
                    colors={['success', '#8b5cf6']}
                    height={200}
                />
            </Card>
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-mono text-sm">{'{'} key: 'costs', color: 'error' }</h3>
                {/snippet}
                <Chart
                    data={revenue}
                    index="quarter"
                    categories={[
                        { key: 'revenue', label: 'Revenue', color: 'success' },
                        { key: 'costs', label: 'Costs', color: 'error' }
                    ]}
                    format={(value) => compactCurrency.format(value)}
                    points
                    height={200}
                />
            </Card>
        </div>
    </section>

    <!-- Formatting & labels -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Formatting &amp; axis labels</h2>
        <Card variant="outline">
            <Chart
                type="bar"
                data={revenue}
                index="quarter"
                categories={[
                    { key: 'revenue', label: 'Revenue' },
                    { key: 'costs', label: 'Costs' }
                ]}
                format={(value) => currency.format(value)}
                xLabel="Quarter"
                yLabel="Amount (USD)"
                height={260}
            />
        </Card>
    </section>

    <!-- Donut -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Donut</h2>
        <div class="grid gap-4 md:grid-cols-3">
            {#each [12, 24, 48] as thickness (thickness)}
                <Card variant="outline">
                    {#snippet header()}
                        <h3 class="font-mono text-sm">thickness={`{${thickness}}`}</h3>
                    {/snippet}
                    <Chart
                        type="donut"
                        data={browsers}
                        index="browser"
                        categories={['visitors']}
                        {thickness}
                        legend={false}
                        height={180}
                    >
                        {#snippet center({ total, items })}
                            <span class="text-xl font-semibold text-on-surface tabular-nums"
                                >{total}</span
                            >
                            <span class="text-xs">{items.length} browsers</span>
                        {/snippet}
                    </Chart>
                </Card>
            {/each}
        </div>
    </section>

    <!-- Custom tooltip -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom tooltip</h2>
        <Card variant="outline">
            <Chart
                data={revenue}
                index="quarter"
                categories={[
                    { key: 'revenue', label: 'Revenue' },
                    { key: 'costs', label: 'Costs' }
                ]}
                format={(value) => currency.format(value)}
                curve="monotone"
                points
                height={240}
            >
                {#snippet tooltipSlot({ title, points: focusedPoints })}
                    {@const row = focusedPoints[0]?.datum.row}
                    <div class="flex min-w-40 flex-col gap-1">
                        <span class="font-medium text-on-surface">{title}</span>
                        {#if row}
                            <span
                                >Revenue <b class="text-on-surface"
                                    >{currency.format(row.revenue)}</b
                                ></span
                            >
                            <span
                                >Costs <b class="text-on-surface">{currency.format(row.costs)}</b
                                ></span
                            >
                            <Badge
                                size="sm"
                                variant="soft"
                                color="success"
                                label={`Profit ${currency.format(row.revenue - row.costs)}`}
                                class="mt-1 self-start"
                            />
                        {/if}
                    </div>
                {/snippet}
            </Chart>
        </Card>
    </section>

    <!-- Events -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Events</h2>
        <p class="text-sm text-on-surface-variant">
            Hover or focus the chart and use the arrow keys. Click, Enter or Space selects a point.
        </p>
        <Card variant="outline">
            <Chart
                type="bar"
                data={visitors}
                index="month"
                categories={visitorCategories}
                height={220}
                onFocusChange={(point) =>
                    (focused = point ? `${point.datum.index} · ${point.datum.label}` : '')}
                onSelect={(point) => (selected = point?.datum ?? null)}
            />
            {#snippet footer()}
                <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <span
                        >Focused: <span class="font-mono text-on-surface">{focused || 'none'}</span
                        ></span
                    >
                    <span
                        >Selected: <span class="font-mono text-on-surface"
                            >{selected
                                ? `${selected.index} · ${selected.label} = ${selected.value}`
                                : 'none'}</span
                        ></span
                    >
                </div>
            {/snippet}
        </Card>
    </section>

    <!-- Definition -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Definition</h2>
        <p class="text-sm text-on-surface-variant">
            Pass a full TanStack Charts definition for anything the props do not cover. Here a
            dashed rule marks a target of {target}. Callbacks receive the rows of its marks.
        </p>
        <Card variant="outline">
            <Chart
                definition={targetDefinition}
                aria-label="Desktop visitors against a target"
                height={240}
                onFocusChange={(point) =>
                    (targetFocus = point
                        ? `${point.datum.month}: ${point.datum.desktop - target >= 0 ? '+' : ''}${point.datum.desktop - target}`
                        : '')}
            />
            {#snippet footer()}
                <span class="text-sm"
                    >Against target: <span class="font-mono text-on-surface"
                        >{targetFocus || 'none'}</span
                    ></span
                >
            {/snippet}
        </Card>
    </section>

    <!-- Dashboard -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dashboard</h2>
        <div class="grid gap-4 md:grid-cols-3">
            {#each sparklines as item (item.key)}
                {@const change = lastChange(item.key)}
                <Card variant="outline" ui={{ body: 'space-y-2' }}>
                    <div class="flex items-baseline justify-between">
                        <span class="text-sm text-on-surface-variant">{item.label}</span>
                        <Badge
                            size="sm"
                            variant="soft"
                            color={change >= 0 ? 'success' : 'error'}
                            label={`${change >= 0 ? '+' : ''}${change}%`}
                        />
                    </div>
                    <p class="text-2xl font-semibold tabular-nums">{visitors.at(-1)![item.key]}</p>
                    <Chart
                        type="area"
                        data={visitors}
                        index="month"
                        categories={[{ key: item.key, label: item.label, color: item.color }]}
                        curve="monotone"
                        grid={false}
                        xAxis={false}
                        yAxis={false}
                        height={64}
                        aria-label={`${item.label} visitors, last six months`}
                    />
                </Card>
            {/each}
        </div>
    </section>
</div>
