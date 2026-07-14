<script lang="ts" module>
    import type { ToggleProps } from './toggle.types.js'

    export type Props = ToggleProps
</script>

<script lang="ts">
    import { Toggle } from 'bits-ui'
    import { toggleVariants, toggleDefaults } from './toggle.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('toggle', toggleDefaults)

    let {
        ref = $bindable(null),
        pressed = $bindable(false),
        onPressedChange,
        ui,
        variant = config.defaultVariants.variant,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        disabled = false,
        block = false,
        square = false,
        icon,
        leadingIcon,
        trailingIcon,
        label,
        leadingSlot,
        trailingSlot,
        children,
        class: className,
        ...restProps
    }: Props = $props()

    const isIconOnly = $derived(square || (!label && !children))
    const leadingIconName = $derived(leadingIcon ?? icon)

    const classes = $derived.by(() => {
        const slots = toggleVariants({
            variant,
            color,
            size,
            block,
            square: isIconOnly
        })
        return {
            base: slots.base({ class: [config.slots.base, className, ui?.base] }),
            label: slots.label({ class: [config.slots.label, ui?.label] }),
            leadingIcon: slots.leadingIcon({ class: [config.slots.leadingIcon, ui?.leadingIcon] }),
            trailingIcon: slots.trailingIcon({
                class: [config.slots.trailingIcon, ui?.trailingIcon]
            })
        }
    })
</script>

<Toggle.Root {...restProps} bind:ref bind:pressed {onPressedChange} {disabled} class={classes.base}>
    {#if leadingSlot}
        {@render leadingSlot()}
    {:else if leadingIconName}
        <Icon name={leadingIconName} class={classes.leadingIcon} />
    {/if}

    {#if label}
        <span class={classes.label}>{label}</span>
    {:else if children}
        <span class={classes.label}>{@render children()}</span>
    {/if}

    {#if trailingSlot}
        {@render trailingSlot()}
    {:else if trailingIcon}
        <Icon name={trailingIcon} class={classes.trailingIcon} />
    {/if}
</Toggle.Root>
