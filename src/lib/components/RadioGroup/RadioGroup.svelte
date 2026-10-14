<script lang="ts" module>
    import type { RadioGroupProps } from './radio-group.types.js'

    export type Props = RadioGroupProps
</script>

<script lang="ts">
    import { RadioGroup, Label } from 'bits-ui'
    import { radioGroupVariants, radioGroupDefaults } from './radio-group.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'
    import {
        composeHandlers,
        fieldControlAttributes,
        groupFocusHandlers,
        reportControlId,
        splitControlProps
    } from '../../hooks/useFormField/field-control.svelte.js'
    import type { RadioGroupItem } from './radio-group.types.js'

    const config = getComponentConfig('radioGroup', radioGroupDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(''),
        onValueChange,
        items = [],
        ui,
        id,
        name,
        color = config.defaultVariants.color,
        size,
        variant = config.defaultVariants.variant,
        indicator = config.defaultVariants.indicator,
        orientation = config.defaultVariants.orientation,
        disabled = false,
        required = false,
        readonly = false,
        loop = true,
        loading = false,
        loadingIcon = icons.loading,
        legend,
        legendSlot,
        labelSlot,
        descriptionSlot,
        class: className,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const uid = $props.id()
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? uid)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const isDisabled = $derived(disabled || loading)
    const legendId = `${uid}-legend`

    const splitProps = $derived(splitControlProps(restProps))
    const groupFocus = $derived(groupFocusHandlers(splitProps.root))
    const controlAttributes = $derived(
        fieldControlAttributes(formFieldContext, splitProps.control, hasError, {
            invalid: true,
            labelledBy: !legend && !legendSlot
        })
    )

    reportControlId(formFieldContext, () => resolvedId, { labelable: false })

    const slots = $derived(
        radioGroupVariants({
            color: resolvedColor,
            size: resolvedSize,
            variant,
            indicator,
            orientation,
            loading,
            required,
            disabled: isDisabled ? true : undefined
        })
    )

    const layoutClasses = $derived.by(() => ({
        root: slots.root({ class: [config.slots.root, className, ui?.root] }),
        fieldset: slots.fieldset({ class: [config.slots.fieldset, ui?.fieldset] }),
        legend: slots.legend({ class: [config.slots.legend, ui?.legend] }),
        item: slots.item({ class: [config.slots.item, ui?.item] }),
        container: slots.container({ class: [config.slots.container, ui?.container] }),
        wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] })
    }))

    const elementClasses = $derived.by(() => ({
        base: slots.base({ class: [config.slots.base, ui?.base] }),
        indicator: slots.indicator({ class: [config.slots.indicator, ui?.indicator] }),
        loadingIcon: slots.loadingIcon({ class: [config.slots.loadingIcon, ui?.loadingIcon] }),
        label: slots.label({ class: [config.slots.label, ui?.label] }),
        description: slots.description({ class: [config.slots.description, ui?.description] })
    }))

    function handleCardItemClick(
        e: MouseEvent & { currentTarget: HTMLElement },
        itemDisabled: boolean
    ) {
        if (itemDisabled) return
        if ((e.target as Element).closest('button')) return
        e.currentTarget.querySelector<HTMLElement>('[role=radio]')?.click()
    }
</script>

{#snippet itemContent(radioItem: RadioGroupItem, index: number)}
    {@const itemId = `${uid}-item-${index}`}
    {@const itemDisabled = isDisabled || !!radioItem.disabled}
    <div class={layoutClasses.container}>
        <RadioGroup.Item
            value={radioItem.value}
            disabled={itemDisabled}
            id={itemId}
            class={elementClasses.base}
        >
            {#snippet children({ checked })}
                {#if checked}
                    <span class={elementClasses.indicator}>
                        {#if loading}
                            <Icon name={loadingIcon} class={elementClasses.loadingIcon} />
                        {/if}
                    </span>
                {/if}
            {/snippet}
        </RadioGroup.Item>
    </div>

    {#if radioItem.label || radioItem.description || labelSlot || descriptionSlot}
        <div class={layoutClasses.wrapper}>
            {#if labelSlot}
                {@render labelSlot({ item: radioItem })}
            {:else if radioItem.label}
                {#if variant === 'card'}
                    <span
                        class={[elementClasses.label, itemDisabled && 'cursor-not-allowed']
                            .filter(Boolean)
                            .join(' ')}>{radioItem.label}</span
                    >
                {:else}
                    <Label.Root
                        for={itemId}
                        class={[elementClasses.label, itemDisabled && 'cursor-not-allowed']
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {radioItem.label}
                    </Label.Root>
                {/if}
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot({ item: radioItem })}
            {:else if radioItem.description}
                <p
                    class={[elementClasses.description, itemDisabled && 'cursor-not-allowed']
                        .filter(Boolean)
                        .join(' ')}
                >
                    {radioItem.description}
                </p>
            {/if}
        </div>
    {/if}
{/snippet}

<div
    {...splitProps.root}
    bind:this={ref}
    class={layoutClasses.root}
    onfocusin={composeHandlers(() => emit.onFocus(), groupFocus.onfocusin)}
    onfocusout={composeHandlers((e: FocusEvent) => {
        const root = e.currentTarget as HTMLElement
        if (!root.contains(e.relatedTarget as Node | null)) {
            emit.onBlur()
        }
    }, groupFocus.onfocusout)}
>
    <RadioGroup.Root
        {...splitProps.control}
        bind:value
        onValueChange={(val) => {
            emit.onChange()
            onValueChange?.(val)
        }}
        id={resolvedId}
        name={resolvedName}
        disabled={isDisabled}
        {required}
        {readonly}
        {loop}
        {orientation}
        aria-labelledby={(splitProps.control['aria-labelledby'] as string | undefined) ??
            (legend && !legendSlot ? legendId : undefined)}
        {...controlAttributes}
        class={layoutClasses.fieldset}
    >
        {#if legend || legendSlot}
            {#if legendSlot}
                {@render legendSlot({ legend })}
            {:else}
                <span id={legendId} class={layoutClasses.legend}>{legend}</span>
            {/if}
        {/if}

        {#each items as radioItem, index (radioItem.value)}
            {#if variant === 'card'}
                <div
                    role="none"
                    class={layoutClasses.item}
                    class:opacity-75={radioItem.disabled && !isDisabled}
                    onclick={(e) => handleCardItemClick(e, isDisabled || !!radioItem.disabled)}
                >
                    {@render itemContent(radioItem, index)}
                </div>
            {:else}
                <div
                    class={layoutClasses.item}
                    class:opacity-75={radioItem.disabled && !isDisabled}
                >
                    {@render itemContent(radioItem, index)}
                </div>
            {/if}
        {/each}
    </RadioGroup.Root>
</div>
