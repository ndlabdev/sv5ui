<script lang="ts" module>
    import type { ProgressProps } from './progress.types.js'

    export type Props = ProgressProps
</script>

<script lang="ts">
    import { Progress } from 'bits-ui'
    import { progressVariants } from './progress.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('progress')

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
        ...restProps
    }: Props = $props()

    const maxValue = $derived(Array.isArray(max) ? max.length - 1 : max)
    const percent = $derived(value != null ? Math.round((Math.min(value, maxValue) / maxValue) * 100) : 0)
    const isIndeterminate = $derived(value == null)
    const state = $derived(isIndeterminate ? 'indeterminate' : 'determinate')

    const indicatorStyle = $derived.by(() => {
        if (isIndeterminate) return ''
        const offset = 100 - percent
        if (orientation === 'horizontal') {
            return inverted ? `transform: translateX(${offset}%);` : `transform: translateX(-${offset}%);`
        }
        // Vertical: fill from bottom to top (positive Y = down)
        return inverted ? `transform: translateY(-${offset}%);` : `transform: translateY(${offset}%);`
    })

    const slots = $derived(progressVariants({ animation, color, size, orientation, inverted }))

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
    const baseClass = $derived(slots.base({ class: [config.slots.base, ui?.base] }))
    const indicatorClass = $derived(slots.indicator({ class: [config.slots.indicator, ui?.indicator] }))
    const statusClass = $derived(slots.status({ class: [config.slots.status, ui?.status] }))
    const stepsBaseClass = $derived(slots.steps({ class: [config.slots.steps, ui?.steps] }))

    const stepVariants = $derived({
        active: progressVariants({ size, step: 'active' }).steps(),
        other: progressVariants({ size, step: 'other' }).steps()
    })
</script>

<Progress.Root
    bind:ref
    value={value ?? undefined}
    max={maxValue}
    class={rootClass}
    {...restProps}
>
    {#if status && !Array.isArray(max)}
        <div class={statusClass} style={isIndeterminate ? '' : `width: ${percent}%;`}>
            {#if statusSlot}
                {@render statusSlot({ percent })}
            {:else}
                {percent}%
            {/if}
        </div>
    {/if}

    <div class={baseClass}>
        <div class={indicatorClass} data-state={state} style={indicatorStyle}></div>
    </div>

    {#if Array.isArray(max)}
        <div class={stepsBaseClass}>
            {#each max as step, index (index)}
                <span class={value != null && index <= value ? stepVariants.active : stepVariants.other}>
                    {step}
                </span>
            {/each}
        </div>
    {/if}
</Progress.Root>
