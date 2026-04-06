<script lang="ts" module>
    import type { SliderProps } from './slider.types.js'

    export type Props = SliderProps
</script>

<script lang="ts">
    import { Slider, useId } from 'bits-ui'
    import { sliderVariants, sliderDefaults } from './slider.variants.js'
    import { getComponentConfig } from '../config.js'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField.svelte.js'

    const config = getComponentConfig('slider', sliderDefaults)

    let {
        ref = $bindable(null),
        id,
        value = $bindable(0),
        onValueChange,
        onValueCommit,
        min = 0,
        max = 100,
        step = 1,
        orientation = config.defaultVariants.orientation,
        disabled = false,
        autoSort = true,
        dir,
        thumbPositioning,
        trackPadding,
        color = config.defaultVariants.color,
        size,
        tooltip = false,
        name,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const autoId = useId()
    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? autoId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const asArray = $derived(Array.isArray(value) ? value : [value ?? min])
    const isMultiple = $derived(Array.isArray(value))

    function handleValueChange(v: number[]) {
        value = isMultiple ? v : (v[0] ?? min)
        emit.onInput()
        onValueChange?.(value)
    }

    function handleValueCommit(v: number[]) {
        emit.onChange()
        onValueCommit?.(isMultiple ? v : (v[0] ?? min))
    }

    const slots = $derived(
        sliderVariants({ color: resolvedColor, size: resolvedSize, orientation, disabled })
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
    {#if resolvedName}
        {#each asArray as v, i (i)}
            <input type="hidden" name={resolvedName} value={v} />
        {/each}
    {/if}

    <Slider.Root
        type="multiple"
        id={resolvedId}
        value={asArray}
        {min}
        {max}
        {step}
        {disabled}
        {orientation}
        {autoSort}
        {dir}
        {thumbPositioning}
        {trackPadding}
        aria-describedby={ariaDescribedBy}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        class={classes.base}
    >
        {#snippet children({ thumbItems })}
            <span data-slider-track class={classes.track}>
                <Slider.Range class={classes.range} />
            </span>

            {#each thumbItems as item (item.index)}
                <Slider.Thumb index={item.index} class={classes.thumb} />
                {#if tooltip}
                    <Slider.ThumbLabel index={item.index} class={classes.tooltip}>
                        {item.value}
                    </Slider.ThumbLabel>
                {/if}
            {/each}
        {/snippet}
    </Slider.Root>
</div>
