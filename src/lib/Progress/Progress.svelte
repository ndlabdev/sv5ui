<script lang="ts" module>
    import type { ProgressProps } from './progress.types.js'

    export type Props = ProgressProps
</script>

<script lang="ts">
    import { Progress } from 'bits-ui'
    import { progressVariants, progressDefaults } from './progress.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('progress', progressDefaults)

    let {
        ref = $bindable(null),
        value = null,
        max = 100,
        status = false,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        orientation = config.defaultVariants.orientation,
        inverted = false,
        animation = config.defaultVariants.animation,
        ui,
        class: className,
        statusSlot,
        stepSlot,
        ...restProps
    }: Props = $props()

    const isIndeterminate = $derived(value === null)
    const hasSteps = $derived(Array.isArray(max))

    const realMax = $derived.by(() => {
        if (isIndeterminate || !max) return undefined
        if (Array.isArray(max)) return max.length - 1
        return Number(max)
    })

    const percent = $derived.by(() => {
        if (isIndeterminate) return undefined
        if (value! < 0) return 0
        if (value! > (realMax ?? 100)) return 100
        return Math.round((value! / (realMax ?? 100)) * 100)
    })

    const indicatorStyle = $derived.by(() => {
        if (percent === undefined) return ''
        const offset = 100 - percent
        if (orientation === 'vertical') {
            return `transform: translateY(${inverted ? '' : '-'}${offset}%);`
        }
        return `transform: translateX(${inverted ? '' : '-'}${offset}%);`
    })

    const statusStyle = $derived.by(() => {
        const val = `${Math.max(percent ?? 0, 0)}%`
        return orientation === 'vertical' ? `height: ${val};` : `width: ${val};`
    })

    function stepVariant(index: number): 'active' | 'first' | 'last' | 'other' {
        const isActive = index === Number(value)
        const isFirst = index === 0
        const isLast = index === realMax

        if (isActive && !isFirst) return 'active'
        if (isFirst && isActive) return 'first'
        if (isLast && isActive) return 'last'
        return 'other'
    }

    const classes = $derived.by(() => {
        const slots = progressVariants({ animation, color, size, orientation, inverted })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            base: slots.base({ class: [config.slots.base, ui?.base] }),
            indicator: slots.indicator({ class: [config.slots.indicator, ui?.indicator] }),
            status: slots.status({ class: [config.slots.status, ui?.status] }),
            steps: slots.steps({ class: [config.slots.steps, ui?.steps] })
        }
    })

    const state = $derived(isIndeterminate ? 'indeterminate' : 'determinate')
</script>

<Progress.Root
    bind:ref
    value={value ?? undefined}
    max={realMax}
    class={classes.root}
    data-orientation={orientation}
    {...restProps}
>
    {#if !isIndeterminate && status}
        <div class={classes.status} style={statusStyle}>
            {#if statusSlot}
                {@render statusSlot({ percent: percent ?? 0 })}
            {:else}
                {percent}%
            {/if}
        </div>
    {/if}

    <div class={classes.base}>
        <div class={classes.indicator} data-state={state} style={indicatorStyle}></div>
    </div>

    {#if hasSteps && Array.isArray(max)}
        <div class={classes.steps}>
            {#each max as step, index (index)}
                {@const stepClass = progressVariants({ size, orientation, inverted, step: stepVariant(index) }).step({ class: [config.slots.step, ui?.step] })}
                <div class={stepClass}>
                    {#if stepSlot}
                        {@render stepSlot({ step, index })}
                    {:else}
                        {step}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</Progress.Root>
