<script lang="ts" module>
    import type { TimeFieldProps } from './time-field.types.js'

    export type Props = TimeFieldProps
</script>

<script lang="ts">
    import { TimeField, type TimeValue } from 'bits-ui'
    import { timeFieldVariants, timeFieldDefaults } from './time-field.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { getLocalTimeZone, now, toTime } from '@internationalized/date'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'

    const config = getComponentConfig('timeField', timeFieldDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        onValueChange,
        placeholder = $bindable(),
        onPlaceholderChange,
        id,
        name,
        required = false,
        disabled = false,
        readonly = false,
        readonlySegments,
        granularity = 'minute',
        hourCycle,
        hideTimeZone = false,
        locale = 'en',
        minValue,
        maxValue,
        validate,
        onInvalid,
        icon = 'lucide:clock',
        color = config.defaultVariants.color ?? 'primary',
        size,
        variant = config.defaultVariants.variant ?? 'outline',
        highlight = false,
        ui,
        class: className
    }: Props = $props()

    if (placeholder === undefined) {
        placeholder = value ?? toTime(now(getLocalTimeZone()))
    }

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedHighlight = $derived(hasError || highlight)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const variantSlots = $derived(
        timeFieldVariants({
            color: resolvedColor,
            size: resolvedSize,
            variant,
            icon: icon !== false,
            highlight: resolvedHighlight
        })
    )
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        field: variantSlots.field({ class: [config.slots.field, ui?.field] }),
        segment: variantSlots.segment({ class: [config.slots.segment, ui?.segment] }),
        literal: variantSlots.literal({ class: [config.slots.literal, ui?.literal] }),
        iconWrapper: variantSlots.iconWrapper({
            class: [config.slots.iconWrapper, ui?.iconWrapper]
        }),
        icon: variantSlots.icon({ class: [config.slots.icon, ui?.icon] })
    })

    let lastValue: TimeValue | undefined = value

    function isSameTime(a: TimeValue | undefined, b: TimeValue | undefined): boolean {
        if (a === undefined || b === undefined) return a === b
        return a.compare(b as never) === 0
    }

    function handleValueChange(val: TimeValue | undefined) {
        if (isSameTime(lastValue, val)) return
        lastValue = val
        onValueChange?.(val)
        emit.onChange()
    }

    let rootEl = $state<HTMLElement | null>(null)

    function handleFocusOut(event: FocusEvent) {
        const next = event.relatedTarget as Node | null
        if (next && rootEl?.contains(next)) return
        emit.onBlur()
    }
</script>

<TimeField.Root
    bind:value
    bind:placeholder
    onValueChange={handleValueChange}
    onPlaceholderChange={(val) => onPlaceholderChange?.(val)}
    {required}
    {disabled}
    {readonly}
    {readonlySegments}
    {granularity}
    {hourCycle}
    {hideTimeZone}
    {locale}
    {minValue}
    {maxValue}
    {validate}
    {onInvalid}
>
    <div
        bind:this={rootEl}
        class={classes.root}
        onfocusin={() => emit.onFocus()}
        onfocusout={handleFocusOut}
    >
        <TimeField.Input
            bind:ref
            id={resolvedId}
            name={resolvedName}
            class={classes.field}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError ? true : undefined}
        >
            {#snippet children({ segments })}
                {#each segments as segment, i (segment.part + i)}
                    {#if segment.part === 'literal'}
                        <TimeField.Segment part={segment.part} class={classes.literal}>
                            {segment.value}
                        </TimeField.Segment>
                    {:else}
                        <TimeField.Segment part={segment.part} class={classes.segment}>
                            {segment.value}
                        </TimeField.Segment>
                    {/if}
                {/each}
            {/snippet}
        </TimeField.Input>

        {#if icon !== false}
            <span class={classes.iconWrapper} aria-hidden="true">
                <Icon name={icon} class={classes.icon} />
            </span>
        {/if}
    </div>
</TimeField.Root>
