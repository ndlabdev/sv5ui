<script lang="ts" module>
    import type { ButtonProps } from './button.types.js'

    export type Props = ButtonProps
</script>

<script lang="ts">
    import { Button } from 'bits-ui'
    import { buttonVariants, buttonDefaults } from './button.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('button', buttonDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        ui,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size = config.defaultVariants.size,
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
        avatar,
        leadingSlot,
        trailingSlot,
        children,
        class: className,
        ...restProps
    }: Props = $props()

    const isIconOnly = $derived(square || (!label && !children))
    const isLeading = $derived((!!icon && !trailing) || (loading && !trailing) || !!leadingIcon)
    const isTrailing = $derived((!!icon && trailing) || (loading && trailing) || !!trailingIcon)

    const leadingIconName = $derived(
        loading && isLeading
            ? loadingIcon
            : leadingIcon || (isLeading && !trailing ? icon : undefined)
    )
    const trailingIconName = $derived(
        loading && isTrailing ? loadingIcon : trailingIcon || (trailing ? icon : undefined)
    )

    const classes = $derived.by(() => {
        const slots = buttonVariants({
            variant,
            color,
            size,
            block,
            square: isIconOnly,
            loading,
            leading: isLeading,
            trailing: isTrailing
        })
        return {
            base: slots.base({ class: [config.slots.base, className, ui?.base] }),
            label: slots.label({ class: [config.slots.label, ui?.label] }),
            leadingIcon: slots.leadingIcon({ class: [config.slots.leadingIcon, ui?.leadingIcon] }),
            trailingIcon: slots.trailingIcon({
                class: [config.slots.trailingIcon, ui?.trailingIcon]
            }),
            leadingAvatar: slots.leadingAvatar({
                class: [config.slots.leadingAvatar, ui?.leadingAvatar]
            }),
            leadingAvatarSize: slots.leadingAvatarSize() as AvatarSize
        }
    })
</script>

<Button.Root bind:ref class={classes.base} disabled={disabled || loading} {...restProps}>
    {#if leadingSlot}
        {@render leadingSlot()}
    {:else if isLeading && leadingIconName}
        <Icon name={leadingIconName} class={classes.leadingIcon} />
    {:else if avatar}
        <Avatar {...avatar} size={classes.leadingAvatarSize} class={classes.leadingAvatar} />
    {/if}

    {#if !isIconOnly}
        {#if label}
            <span class={classes.label}>{label}</span>
        {:else if children}
            <span class={classes.label}>{@render children()}</span>
        {/if}
    {/if}

    {#if trailingSlot}
        {@render trailingSlot()}
    {:else if isTrailing && trailingIconName}
        <Icon name={trailingIconName} class={classes.trailingIcon} />
    {/if}
</Button.Root>
