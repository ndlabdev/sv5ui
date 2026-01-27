<script lang="ts" module>
    import type { ButtonProps } from './button.types.js'

    export type Props = ButtonProps
</script>

<script lang="ts">
    import { Button } from 'bits-ui'
    import { buttonVariants } from './button.variants.js'
    import { getButtonConfig, getIconsConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'

    // Get merged configs (user config + defaults)
    const config = getButtonConfig()
    const icons = getIconsConfig()

    let {
        ref = $bindable(null),
        ui,
        color = config.color,
        variant = config.variant,
        size = config.size,
        label,
        loading = false,
        loadingIcon = icons.loading,
        disabled = false,
        block = false,
        square = false,
        truncate = false,
        icon,
        leadingIcon,
        trailingIcon,
        trailing = false,
        leadingSlot,
        trailingSlot,
        children,
        class: className,
        ...restProps
    }: Props = $props()

    // Determine if icon-only mode (no label/children content)
    const isIconOnly = $derived(square || (!label && !children))

    const isLeading = $derived(
        (!!icon && !trailing) || (loading && !trailing) || !!leadingIcon
    )
    const isTrailing = $derived((!!icon && trailing) || (loading && trailing) || !!trailingIcon)

    // Computed icon names
    const leadingIconName = $derived(
        loading && isLeading ? loadingIcon : (leadingIcon || (isLeading && !trailing ? icon : undefined))
    )
    const trailingIconName = $derived(
        loading && isTrailing ? loadingIcon : (trailingIcon || (trailing ? icon : undefined))
    )

    // Get slot classes from variants
    const slots = $derived(
        buttonVariants({
            variant,
            color,
            size,
            block,
            square: isIconOnly || square,
            loading,
            leading: isLeading,
            trailing: isTrailing
        })
    )

    const baseClass = $derived(slots.base({ class: [className, ui?.base] }))
    const labelClass = $derived(slots.label({ class: ui?.label }))
    const leadingIconClass = $derived(slots.leadingIcon({ class: ui?.leadingIcon }))
    const trailingIconClass = $derived(slots.trailingIcon({ class: ui?.trailingIcon }))

    // bits-ui Button handles disabled state internally
    const isDisabled = $derived(disabled || loading)
</script>

{#snippet buttonContent()}
    {#if leadingSlot}
        {@render leadingSlot()}
    {:else if isLeading && leadingIconName}
        <Icon name={leadingIconName} class={leadingIconClass} />
    {/if}

    {#if !isIconOnly}
        {#if label}
            <span class={labelClass}>{label}</span>
        {:else if children}
            <span class={labelClass}>{@render children()}</span>
        {/if}
    {/if}

    {#if trailingSlot}
        {@render trailingSlot()}
    {:else if isTrailing && trailingIconName}
        <Icon name={trailingIconName} class={trailingIconClass} />
    {/if}
{/snippet}

<Button.Root
    bind:ref
    class={baseClass}
    disabled={isDisabled}
    {...restProps}
>
    {@render buttonContent()}
</Button.Root>
