<script lang="ts" module>
    import type { CheckboxProps } from './checkbox.types.js'

    export type Props = CheckboxProps
</script>

<script lang="ts">
    import { Checkbox, Label, useId } from 'bits-ui'
    import { checkboxVariants, checkboxDefaults } from './checkbox.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'
    import {
        composeHandlers,
        fieldControlAttributes,
        mergeIds,
        reportControlId,
        splitControlProps
    } from '../../hooks/useFormField/field-control.svelte.js'

    const config = getComponentConfig('checkbox', checkboxDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
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
        variant = config.defaultVariants.variant,
        indicator = config.defaultVariants.indicator,
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
    const autoId = useId()
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? autoId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const isDisabled = $derived(disabled || loading)

    const splitProps = $derived(splitControlProps(restProps, { focus: true }))
    const controlAttributes = $derived(
        fieldControlAttributes(formFieldContext, splitProps.control, hasError, {
            invalid: true
        })
    )

    reportControlId(formFieldContext, () => resolvedId)

    const uid = $props.id()
    const labelId = $derived(label && !labelSlot ? `${uid}-label` : undefined)
    const descriptionId = $derived(
        description && !descriptionSlot ? `${uid}-description` : undefined
    )
    const userLabelledBy = $derived(splitProps.control['aria-labelledby'] as string | undefined)
    const userNamed = $derived(
        splitProps.control['aria-label'] !== undefined || userLabelledBy !== undefined
    )
    const ownAttributes = $derived({
        'aria-labelledby':
            variant === 'card' && labelId && !userNamed
                ? mergeIds(formFieldContext?.labelId, labelId)
                : userLabelledBy,
        'aria-describedby': mergeIds(controlAttributes['aria-describedby'], descriptionId)
    })

    const resolvedIcon = $derived(loading ? loadingIcon : indeterminate ? indeterminateIcon : icon)

    let containerRef: HTMLElement | null = null

    function handleCardClick(e: MouseEvent) {
        if (isDisabled) return
        // Don't re-click when the event originated from the checkbox button itself
        if ((e.target as Element).closest('button')) return
        containerRef?.querySelector('button')?.click()
    }

    const classes = $derived.by(() => {
        const slots = checkboxVariants({
            color: resolvedColor,
            size: resolvedSize,
            variant,
            indicator,
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

<div
    {...splitProps.root}
    bind:this={ref}
    class={classes.root}
    onclick={composeHandlers(
        variant === 'card' ? handleCardClick : undefined,
        splitProps.root.onclick
    )}
>
    <div bind:this={containerRef} class={classes.container}>
        <Checkbox.Root
            bind:checked
            onCheckedChange={(val) => {
                emit.onChange()
                onCheckedChange?.(val)
            }}
            bind:indeterminate
            {onIndeterminateChange}
            {...splitProps.control}
            onblur={composeHandlers(() => emit.onBlur(), splitProps.control.onblur)}
            onfocus={composeHandlers(() => emit.onFocus(), splitProps.control.onfocus)}
            id={resolvedId}
            name={resolvedName}
            {value}
            disabled={isDisabled}
            {required}
            {...controlAttributes}
            {...ownAttributes}
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
                {#if variant === 'card'}
                    <span id={labelId} class={classes.label}>{label}</span>
                {:else}
                    <Label.Root for={resolvedId} class={classes.label}>
                        {label}
                    </Label.Root>
                {/if}
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot({ description })}
            {:else if description}
                <p id={descriptionId} class={classes.description}>{description}</p>
            {/if}
        </div>
    {/if}
</div>
