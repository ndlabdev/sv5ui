<script lang="ts" module>
    import type { SwitchProps } from './switch.types.js'

    export type Props = SwitchProps
</script>

<script lang="ts">
    import { Switch, Label, useId } from 'bits-ui'
    import { switchVariants, switchDefaults } from './switch.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField/index.js'

    const config = getComponentConfig('switch', switchDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        checked = $bindable(false),
        onCheckedChange,
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
        checkedIcon,
        uncheckedIcon,
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

    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const hasCheckedIcon = $derived(loading || !!checkedIcon)
    const hasUncheckedIcon = $derived(loading || !!uncheckedIcon)
    const checkedIconName = $derived(loading ? loadingIcon : checkedIcon)
    const uncheckedIconName = $derived(loading ? loadingIcon : uncheckedIcon)

    const variantOpts = $derived({
        color: resolvedColor,
        size: resolvedSize,
        loading,
        required,
        disabled: isDisabled ? true : undefined
    })

    const slots = $derived(switchVariants(variantOpts))

    const classes = $derived({
        root: slots.root({ class: [config.slots.root, className, ui?.root] }),
        base: slots.base({ class: [config.slots.base, ui?.base] }),
        container: slots.container({ class: [config.slots.container, ui?.container] }),
        thumb: slots.thumb({ class: [config.slots.thumb, ui?.thumb] }),
        wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
        label: slots.label({ class: [config.slots.label, ui?.label] }),
        description: slots.description({ class: [config.slots.description, ui?.description] })
    })

    const iconClasses = $derived.by(() => {
        if (!hasCheckedIcon && !hasUncheckedIcon)
            return { checked: undefined, unchecked: undefined }
        const iconUiClass = [config.slots.icon, ui?.icon]
        return {
            checked: hasCheckedIcon
                ? slots.icon({ class: iconUiClass, checked: true, unchecked: loading })
                : undefined,
            unchecked:
                hasUncheckedIcon && !loading
                    ? slots.icon({ class: iconUiClass, unchecked: true })
                    : undefined
        }
    })
</script>

<div {...restProps} bind:this={ref} class={classes.root}>
    <div class={classes.container}>
        <Switch.Root
            bind:checked
            onCheckedChange={(val) => {
                emit.onChange()
                onCheckedChange?.(val)
            }}
            onblur={() => emit.onBlur()}
            onfocus={() => emit.onFocus()}
            id={resolvedId}
            name={resolvedName}
            {value}
            disabled={isDisabled}
            {required}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError ? true : undefined}
            class={classes.base}
        >
            <Switch.Thumb class={classes.thumb}>
                {#if hasCheckedIcon && checkedIconName}
                    <Icon name={checkedIconName} class={iconClasses.checked} />
                {/if}
                {#if hasUncheckedIcon && uncheckedIconName && !loading}
                    <Icon name={uncheckedIconName} class={iconClasses.unchecked} />
                {/if}
            </Switch.Thumb>
        </Switch.Root>
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
