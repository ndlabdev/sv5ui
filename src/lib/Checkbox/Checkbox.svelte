<script lang="ts" module>
    import type { CheckboxProps } from './checkbox.types.js'

    export type Props = CheckboxProps
</script>

<script lang="ts">
    import { Checkbox, Label, useId } from 'bits-ui'
    import { checkboxVariants, checkboxDefaults } from './checkbox.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import Icon from '../Icon/Icon.svelte'
    import type { FormFieldProps } from '../FormField/form-field.types.js'

    const config = getComponentConfig('checkbox', checkboxDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        checked = $bindable(false),
        onCheckedChange,
        indeterminate = $bindable(false),
        onIndeterminateChange,
        ui,
        id,
        name,
        value,
        color = config.defaultVariants.color,
        size,
        disabled = false,
        required = false,
        loading = false,
        loadingIcon = icons.loading,
        icon = icons.check,
        indeterminateIcon = 'lucide:minus',
        label,
        description,
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

    const resolvedIcon = $derived(loading ? loadingIcon : indeterminate ? indeterminateIcon : icon)

    const classes = $derived.by(() => {
        const slots = checkboxVariants({
            color: resolvedColor,
            size: resolvedSize,
            loading,
            required,
            disabled: isDisabled ? true : undefined
        })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            base: slots.base({ class: [config.slots.base, ui?.base] }),
            container: slots.container({ class: [config.slots.container, ui?.container] }),
            indicator: slots.indicator({ class: [config.slots.indicator, ui?.indicator] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
            label: slots.label({ class: [config.slots.label, ui?.label] }),
            description: slots.description({
                class: [config.slots.description, ui?.description]
            })
        }
    })
</script>

<div class={classes.root}>
    <div class={classes.container}>
        <Checkbox.Root
            bind:checked
            {onCheckedChange}
            bind:indeterminate
            {onIndeterminateChange}
            id={resolvedId}
            name={resolvedName}
            {value}
            disabled={isDisabled}
            {required}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError ? true : undefined}
            class={classes.base}
        >
            {#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
                {#if isChecked || isIndeterminate || loading}
                    <span class={classes.indicator}>
                        {#if resolvedIcon}
                            <Icon name={resolvedIcon} class={classes.icon} />
                        {/if}
                    </span>
                {/if}
            {/snippet}
        </Checkbox.Root>
    </div>

    {#if label || description || labelSlot || descriptionSlot}
        <div class={classes.wrapper}>
            {#if labelSlot}
                {@render labelSlot({ label })}
            {:else if label}
                <Label.Root for={resolvedId} class={classes.label}>
                    {label}
                </Label.Root>
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot({ description })}
            {:else if description}
                <p class={classes.description}>{description}</p>
            {/if}
        </div>
    {/if}
</div>
