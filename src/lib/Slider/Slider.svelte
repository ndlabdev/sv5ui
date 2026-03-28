<script lang="ts" module>
    import type { SliderProps } from './slider.types.js'

    export type Props = SliderProps
</script>

<script lang="ts">
    import { Slider } from 'bits-ui'
    import { sliderVariants, sliderDefaults } from './slider.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('slider', sliderDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(0),
        onValueChange,
        onValueCommit,
        min = 0,
        max = 100,
        step = 1,
        orientation = config.defaultVariants.orientation,
        disabled = false,
        autoSort = true,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        tooltip = false,
        name,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    // Always pass an array to bits-ui (type="multiple" handles both single and range)
    const asArray = $derived(Array.isArray(value) ? value : [value ?? min])
    const isMultiple = $derived(Array.isArray(value))

    function handleValueChange(v: number[]) {
        value = isMultiple ? v : v[0]
        onValueChange?.(value)
    }

    function handleValueCommit(v: number[]) {
        onValueCommit?.(isMultiple ? v : v[0])
    }

    const slots = $derived(
        sliderVariants({ color, size, orientation, disabled })
    )

    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: slots.root({ class: [config.slots.root, className, u.root] }),
            base: slots.base({ class: [config.slots.base, u.base] }),
            track: slots.track({ class: [config.slots.track, u.track] }),
            range: slots.range({ class: [config.slots.range, u.range] }),
            thumb: slots.thumb({ class: [config.slots.thumb, u.thumb] }),
            tooltip: slots.tooltip({ class: [config.slots.tooltip, u.tooltip] })
        }
    })
</script>

<div bind:this={ref} class={classes.root} {...restProps}>
    <!-- Hidden inputs for form submission — one per thumb value -->
    {#if name}
        {#each asArray as v}
            <input type="hidden" {name} value={v} />
        {/each}
    {/if}

    <Slider.Root
        type="multiple"
        value={asArray}
        {min}
        {max}
        {step}
        {disabled}
        {orientation}
        {autoSort}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        class={classes.base}
    >
        {#snippet children({ thumbItems })}
            <!-- bits-ui v2 has no Slider.Track — use a plain span as the track container -->
            <span data-slider-track class={classes.track}>
                <Slider.Range class={classes.range} />
            </span>

            {#each thumbItems as item (item.index)}
                <Slider.Thumb index={item.index} class={classes.thumb} />
                {#if tooltip}
                    <Slider.ThumbLabel
                        index={item.index}
                        position={orientation === 'vertical' ? 'left' : 'top'}
                        class={classes.tooltip}
                    >
                        {item.value}
                    </Slider.ThumbLabel>
                {/if}
            {/each}
        {/snippet}
    </Slider.Root>
</div>
