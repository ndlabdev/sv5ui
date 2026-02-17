<script lang="ts" module>
    import type { SwitchProps } from './switch.types.js'

    export type Props = SwitchProps
</script>

<script lang="ts">
    import { Switch, Label, useId } from 'bits-ui'
    import { switchVariants, switchDefaults } from './switch.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import Icon from '../Icon/Icon.svelte'
    import type { FormFieldProps } from '../FormField/form-field.types.js'

    const config = getComponentConfig('switch', switchDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
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
    } as const)

    const classes = $derived.by(() => {
        const slots = switchVariants(variantOpts)
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            base: slots.base({ class: [config.slots.base, ui?.base] }),
            container: slots.container({ class: [config.slots.container, ui?.container] }),
            thumb: slots.thumb({ class: [config.slots.thumb, ui?.thumb] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
            label: slots.label({ class: [config.slots.label, ui?.label] }),
            description: slots.description({
                class: [config.slots.description, ui?.description]
            })
        }
    })

    const iconUiClass = $derived([config.slots.icon, ui?.icon])

    const checkedIconClass = $derived.by(() => {
        if (!hasCheckedIcon) return undefined
        return switchVariants({
            ...variantOpts,
            checked: true,
            unchecked: loading ? true : undefined
        }).icon({ class: iconUiClass })
    })

    const uncheckedIconClass = $derived.by(() => {
        if (!hasUncheckedIcon) return undefined
        return switchVariants({
            ...variantOpts,
            unchecked: true,
            checked: loading ? true : undefined
        }).icon({ class: iconUiClass })
    })
</script>

<div class={classes.root}>
    <div class={classes.container}>
        <Switch.Root
            bind:checked
            {onCheckedChange}
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
                    <Icon name={checkedIconName} class={checkedIconClass} />
                {/if}
                {#if hasUncheckedIcon && uncheckedIconName && !loading}
                    <Icon name={uncheckedIconName} class={uncheckedIconClass} />
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
