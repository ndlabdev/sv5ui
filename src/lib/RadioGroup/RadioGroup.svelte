<script lang="ts" module>
    import type { RadioGroupProps } from './radio-group.types.js'

    export type Props = RadioGroupProps
</script>

<script lang="ts">
    import { RadioGroup, Label, useId } from 'bits-ui'
    import { radioGroupVariants, radioGroupDefaults } from './radio-group.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import Icon from '../Icon/Icon.svelte'
    import type { FormFieldProps } from '../FormField/form-field.types.js'

    const config = getComponentConfig('radioGroup', radioGroupDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        value = $bindable(''),
        onValueChange,
        items = [],
        ui,
        id,
        name,
        color = config.defaultVariants.color,
        size,
        orientation = config.defaultVariants.orientation,
        disabled = false,
        required = false,
        loop = true,
        loading = false,
        loadingIcon = icons.loading,
        legend,
        legendSlot,
        labelSlot,
        descriptionSlot,
        class: className
    }: Props = $props()

    const formFieldContext = getContext<
        | {
              name?: string
              size: NonNullable<FormFieldProps['size']>
              error?: string | boolean
              ariaId: string
          }
        | undefined
    >('formField')

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const autoId = useId()
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? autoId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const isDisabled = $derived(disabled || loading)

    const ariaDescribedBy = $derived.by(() => {
        if (!formFieldContext) return undefined
        const fid = formFieldContext.ariaId
        return hasError ? `${fid}-error` : `${fid}-description ${fid}-help`
    })

    const slots = $derived(
        radioGroupVariants({
            color: resolvedColor,
            size: resolvedSize,
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
</script>

<div class={layoutClasses.root}>
    <RadioGroup.Root
        bind:value
        {onValueChange}
        id={resolvedId}
        name={resolvedName}
        disabled={isDisabled}
        {required}
        {loop}
        {orientation}
        aria-describedby={ariaDescribedBy}
        aria-invalid={hasError ? true : undefined}
        class={layoutClasses.fieldset}
    >
        {#if legend || legendSlot}
            {#if legendSlot}
                {@render legendSlot({ legend })}
            {:else}
                <span class={layoutClasses.legend}>{legend}</span>
            {/if}
        {/if}

        {#each items as radioItem (radioItem.value)}
            {@const itemId = `${resolvedId}-${radioItem.value}`}
            {@const itemDisabled = isDisabled || radioItem.disabled}

            <div class="{layoutClasses.item}{itemDisabled && !isDisabled ? ' opacity-75' : ''}">
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
                                        <Icon
                                            name={loadingIcon}
                                            class={elementClasses.loadingIcon}
                                        />
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
                            <Label.Root
                                for={itemId}
                                class="{elementClasses.label}{itemDisabled
                                    ? ' cursor-not-allowed'
                                    : ''}"
                            >
                                {radioItem.label}
                            </Label.Root>
                        {/if}

                        {#if descriptionSlot}
                            {@render descriptionSlot({ item: radioItem })}
                        {:else if radioItem.description}
                            <p
                                class="{elementClasses.description}{itemDisabled
                                    ? ' cursor-not-allowed'
                                    : ''}"
                            >
                                {radioItem.description}
                            </p>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </RadioGroup.Root>
</div>
