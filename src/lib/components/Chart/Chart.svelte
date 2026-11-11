<script lang="ts" module>
    import type { ChartProps } from './chart.types.js'

    export type Props = ChartProps
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="T extends Record<string, any>">
    import {
        Chart as ChartHost,
        type ChartPoint,
        type ChartTooltipBodySnippetContext
    } from '@tanstack/charts/svelte'
    import type { ChartTooltipRow as ChartContentRow } from '@tanstack/charts'
    import type { ChartLegendItem, ChartTooltipRow } from './chart.types.js'
    import { chartVariants, chartDefaults } from './chart.variants.js'
    import {
        buildCartesianDefinition,
        buildDonutDefinition,
        toSeriesPoint
    } from './chart.definition.js'
    import { buildSliceRows, defaultAriaLabel, resolveCategories } from './chart.utils.js'
    import { getComponentConfig } from '../../config.js'

    const config = getComponentConfig('chart', chartDefaults)

    let {
        ref = $bindable(null),
        type = config.defaultVariants.type ?? 'line',
        data = [],
        index,
        categories,
        colors,
        stacked = false,
        curve = 'linear',
        points = false,
        grid = true,
        xAxis = true,
        yAxis = true,
        xLabel,
        yLabel,
        legend,
        format,
        tooltip = true,
        transition = true,
        thickness = 24,
        height,
        width,
        aspectRatio,
        initialWidth = 640,
        definition,
        'aria-label': ariaLabel,
        'aria-description': ariaDescription,
        onSelect,
        onFocusChange,
        onFocusGroupChange,
        ui,
        class: className,
        tooltipSlot,
        center,
        ...restProps
    }: ChartProps<T> = $props()

    const resolvedCategories = $derived(resolveCategories(categories, colors))

    const slices = $derived(
        type === 'donut' && index
            ? buildSliceRows(data, index, resolvedCategories[0], colors)
            : { rows: [], items: [] }
    )

    const legendItems: ChartLegendItem[] = $derived.by(() => {
        if (definition) return []
        if (type === 'donut') return slices.items
        return resolvedCategories.map(({ key, label, color }) => ({ key, label, color }))
    })

    const showLegend = $derived((legend ?? legendItems.length > 1) && legendItems.length > 0)

    const total = $derived(slices.rows.reduce((sum, row) => sum + (row.value ?? 0), 0))

    const chartDefinition = $derived.by(() => {
        if (definition) return definition
        if (type === 'donut') {
            return buildDonutDefinition({
                rows: slices.rows,
                items: slices.items,
                thickness,
                format,
                tooltip,
                transition
            })
        }
        return buildCartesianDefinition({
            type,
            data,
            index,
            categories: resolvedCategories,
            stacked,
            curve,
            points,
            grid,
            xAxis,
            yAxis,
            xLabel,
            yLabel,
            format,
            tooltip,
            transition
        })
    })

    const accessibleName = $derived(
        ariaLabel ??
            (definition
                ? 'Chart'
                : defaultAriaLabel(
                      type,
                      legendItems.map((item) => item.label)
                  ))
    )

    const chartHeight = $derived(height ?? (aspectRatio === undefined ? 300 : undefined))

    const handleSelect = $derived(
        onSelect && ((point: ChartPoint | null) => onSelect(point && toSeriesPoint<T>(point)))
    )
    const handleFocusChange = $derived(
        onFocusChange &&
            ((point: ChartPoint | null) => onFocusChange(point && toSeriesPoint<T>(point)))
    )
    const handleFocusGroupChange = $derived(
        onFocusGroupChange &&
            ((points: readonly ChartPoint[]) =>
                onFocusGroupChange(points.map((point) => toSeriesPoint<T>(point))))
    )

    const variantSlots = $derived(chartVariants({ type }))

    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        base: variantSlots.base({ class: [config.slots.base, ui?.base] }),
        center: variantSlots.center({ class: [config.slots.center, ui?.center] }),
        legend: variantSlots.legend({ class: [config.slots.legend, ui?.legend] }),
        legendItem: variantSlots.legendItem({
            class: [config.slots.legendItem, ui?.legendItem]
        }),
        legendIndicator: variantSlots.legendIndicator({
            class: [config.slots.legendIndicator, ui?.legendIndicator]
        }),
        legendLabel: variantSlots.legendLabel({
            class: [config.slots.legendLabel, ui?.legendLabel]
        }),
        tooltip: variantSlots.tooltip({ class: [config.slots.tooltip, ui?.tooltip] }),
        tooltipTitle: variantSlots.tooltipTitle({
            class: [config.slots.tooltipTitle, ui?.tooltipTitle]
        }),
        tooltipRow: variantSlots.tooltipRow({
            class: [config.slots.tooltipRow, ui?.tooltipRow]
        }),
        tooltipIndicator: variantSlots.tooltipIndicator({
            class: [config.slots.tooltipIndicator, ui?.tooltipIndicator]
        }),
        tooltipLabel: variantSlots.tooltipLabel({
            class: [config.slots.tooltipLabel, ui?.tooltipLabel]
        }),
        tooltipValue: variantSlots.tooltipValue({
            class: [config.slots.tooltipValue, ui?.tooltipValue]
        })
    })

    function tooltipContent(context: ChartTooltipBodySnippetContext): {
        title?: string
        rows: ChartTooltipRow[]
    } {
        if (typeof context.content === 'string') return { title: context.content, rows: [] }
        return {
            title: context.content.title,
            rows: context.content.rows.map((row: ChartContentRow) => ({
                label: row.label,
                value: row.value,
                color: row.color,
                active: row.active ?? false
            }))
        }
    }
</script>

{#snippet tooltipBody(context: ChartTooltipBodySnippetContext)}
    {@const content = tooltipContent(context)}
    <div class={classes.tooltip}>
        {#if tooltipSlot}
            {@render tooltipSlot({
                ...content,
                points: context.points,
                pinned: context.pinned,
                dismiss: context.dismiss
            })}
        {:else}
            {#if content.title}
                <div class={classes.tooltipTitle}>{content.title}</div>
            {/if}
            {#each content.rows as row, rowIndex (rowIndex)}
                <div class={classes.tooltipRow} data-active={row.active}>
                    {#if row.color}
                        <span class={classes.tooltipIndicator} style:background-color={row.color}
                        ></span>
                    {/if}
                    <span class={classes.tooltipLabel}>{row.label}</span>
                    <span class={classes.tooltipValue}>{row.value}</span>
                </div>
            {/each}
        {/if}
    </div>
{/snippet}

<div bind:this={ref} class={classes.root} data-type={definition ? undefined : type} {...restProps}>
    <div class={classes.base}>
        <ChartHost
            definition={chartDefinition}
            ariaLabel={accessibleName}
            {ariaDescription}
            height={chartHeight}
            {width}
            {aspectRatio}
            {initialWidth}
            onSelect={handleSelect}
            onFocusChange={handleFocusChange}
            onFocusGroupChange={handleFocusGroupChange}
            {tooltipBody}
        />
        {#if center && type === 'donut' && !definition}
            <div class={classes.center}>
                {@render center({ total, items: slices.items })}
            </div>
        {/if}
    </div>

    {#if showLegend}
        <ul class={classes.legend}>
            {#each legendItems as item, itemIndex (`${itemIndex}-${item.key}`)}
                <li class={classes.legendItem}>
                    <span
                        class={classes.legendIndicator}
                        style:background-color={item.color}
                        aria-hidden="true"
                    ></span>
                    <span class={classes.legendLabel}>{item.label}</span>
                </li>
            {/each}
        </ul>
    {/if}
</div>
