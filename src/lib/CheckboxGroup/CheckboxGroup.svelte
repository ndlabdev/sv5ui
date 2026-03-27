<script lang="ts" module>
    import type { CheckboxGroupProps } from './checkbox-group.types.js'

    export type Props = CheckboxGroupProps
</script>

<script lang="ts">
    import { Checkbox, Label, useId } from 'bits-ui'
    import { checkboxGroupVariants, checkboxGroupDefaults } from './checkbox-group.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import Icon from '../Icon/Icon.svelte'
    import type { FormFieldProps } from '../FormField/form-field.types.js'
    import type { CheckboxGroupItem } from './checkbox-group.types.js'

    const config = getComponentConfig('checkboxGroup', checkboxGroupDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable([]),
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
        loading = false,
        loadingIcon = icons.loading,
        icon = icons.check,
        legend,
        legendSlot,
        labelSlot,
        descriptionSlot,
        class: className,
        ...restProps
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

    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const slots = $derived(
        checkboxGroupVariants({
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
        icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
        label: slots.label({ class: [config.slots.label, ui?.label] }),
        description: slots.description({ class: [config.slots.description, ui?.description] })
    }))

    function toggleItem(itemValue: string, checked: boolean) {
        if (checked) {
            value = [...value, itemValue]
        } else {
            value = value.filter((v) => v !== itemValue)
        }
        onValueChange?.(value)
    }

    function handleCardItemClick(e: MouseEvent, btnId: string, itemDisabled: boolean) {
        if (itemDisabled) return
        if ((e.target as Element).closest('button')) return
        document.getElementById(btnId)?.click()
    }
</script>

{#snippet itemContent(checkboxItem: CheckboxGroupItem)}
    {@const itemId = `${resolvedId}-${checkboxItem.value}`}
    {@const itemDisabled = isDisabled || !!checkboxItem.disabled}
    <div class={layoutClasses.container}>
        <Checkbox.Root
            checked={value.includes(checkboxItem.value)}
            onCheckedChange={(checked) => toggleItem(checkboxItem.value, checked)}
            id={itemId}
            name={resolvedName}
            value={checkboxItem.value}
            disabled={itemDisabled}
            class={elementClasses.base}
        >
            {#snippet children({ checked: isChecked })}
                {#if isChecked || loading}
                    <span class={elementClasses.indicator}>
                        <Icon name={loading ? loadingIcon : icon} class={elementClasses.icon} />
                    </span>
                {/if}
            {/snippet}
        </Checkbox.Root>
    </div>

    {#if checkboxItem.label || checkboxItem.description || labelSlot || descriptionSlot}
        <div class={layoutClasses.wrapper}>
            {#if labelSlot}
                {@render labelSlot({ item: checkboxItem })}
            {:else if checkboxItem.label}
                {#if variant === 'card'}
                    <span
                        class={[elementClasses.label, itemDisabled && 'cursor-not-allowed']
                            .filter(Boolean)
                            .join(' ')}>{checkboxItem.label}</span
                    >
                {:else}
                    <Label.Root
                        for={itemId}
                        class={[elementClasses.label, itemDisabled && 'cursor-not-allowed']
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {checkboxItem.label}
                    </Label.Root>
                {/if}
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot({ item: checkboxItem })}
            {:else if checkboxItem.description}
                <p
                    class={[elementClasses.description, itemDisabled && 'cursor-not-allowed']
                        .filter(Boolean)
                        .join(' ')}
                >
                    {checkboxItem.description}
                </p>
            {/if}
        </div>
    {/if}
{/snippet}

<div {...restProps} bind:this={ref} class={layoutClasses.root}>
    <fieldset class={layoutClasses.fieldset} aria-describedby={ariaDescribedBy}>
        {#if legend || legendSlot}
            {#if legendSlot}
                {@render legendSlot({ legend })}
            {:else}
                <legend class={layoutClasses.legend}>{legend}</legend>
            {/if}
        {/if}

        {#each items as checkboxItem (checkboxItem.value)}
            {#if variant === 'card'}
                <div
                    role="none"
                    class={layoutClasses.item}
                    class:opacity-75={checkboxItem.disabled && !isDisabled}
                    onclick={(e) =>
                        handleCardItemClick(
                            e,
                            `${resolvedId}-${checkboxItem.value}`,
                            isDisabled || !!checkboxItem.disabled
                        )}
                >
                    {@render itemContent(checkboxItem)}
                </div>
            {:else}
                <div
                    class={layoutClasses.item}
                    class:opacity-75={checkboxItem.disabled && !isDisabled}
                >
                    {@render itemContent(checkboxItem)}
                </div>
            {/if}
        {/each}
    </fieldset>
</div>
