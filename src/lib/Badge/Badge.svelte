<script lang="ts" module>
    import type { BadgeProps } from './badge.types.js'

    export type Props = BadgeProps
</script>

<script lang="ts">
    import { badgeVariants, badgeDefaults } from './badge.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('badge', badgeDefaults)

    let {
        as = 'span',
        ui,
        label,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size = config.defaultVariants.size,
        square = false,
        icon,
        leadingIcon,
        trailingIcon,
        avatar,
        class: className,
        leading,
        children,
        trailing,
        ...restProps
    }: Props = $props()

    const isIconOnly = $derived(!!icon || (square && !label && !children))

    const classes = $derived.by(() => {
        const slots = badgeVariants({ variant, color, size, square: isIconOnly || square })
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

<svelte:element this={as} class={classes.base} {...restProps}>
    {#if leading}
        {@render leading()}
    {:else if avatar}
        <Avatar {...avatar} size={classes.leadingAvatarSize} class={classes.leadingAvatar} />
    {:else if leadingIcon}
        <Icon name={leadingIcon} class={classes.leadingIcon} />
    {/if}

    {#if icon}
        <Icon name={icon} class={classes.leadingIcon} />
    {:else if !isIconOnly}
        {#if label != null}
            <span class={classes.label}>{label}</span>
        {:else if children}
            <span class={classes.label}>{@render children()}</span>
        {/if}
    {/if}

    {#if trailing}
        {@render trailing()}
    {:else if trailingIcon}
        <Icon name={trailingIcon} class={classes.trailingIcon} />
    {/if}
</svelte:element>
