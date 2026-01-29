<script lang="ts" module>
    import type { BadgeProps } from './badge.types.js'

    export type Props = BadgeProps
</script>

<script lang="ts">
    import { badgeVariants } from './badge.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'

    const config = getComponentConfig('badge')

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

    const slots = $derived(badgeVariants({ variant, color, size, square: isIconOnly || square }))

    const baseClass = $derived(slots.base({ class: [config.slots.base, className, ui?.base] }))
    const labelClass = $derived(slots.label({ class: [config.slots.label, ui?.label] }))
    const leadingIconClass = $derived(slots.leadingIcon({ class: [config.slots.leadingIcon, ui?.leadingIcon] }))
    const trailingIconClass = $derived(slots.trailingIcon({ class: [config.slots.trailingIcon, ui?.trailingIcon] }))
    const leadingAvatarClass = $derived(slots.leadingAvatar({ class: [config.slots.leadingAvatar, ui?.leadingAvatar] }))
    const leadingAvatarSize = $derived(slots.leadingAvatarSize() as AvatarSize)
</script>

<svelte:element this={as} class={baseClass} {...restProps}>
    {#if leading}
        {@render leading()}
    {:else if avatar}
        <Avatar {...avatar} size={leadingAvatarSize} class={leadingAvatarClass} />
    {:else if leadingIcon}
        <Icon name={leadingIcon} class={leadingIconClass} />
    {/if}

    {#if icon}
        <Icon name={icon} class={leadingIconClass} />
    {:else if !isIconOnly}
        {#if label != null}
            <span class={labelClass}>{label}</span>
        {:else if children}
            <span class={labelClass}>{@render children()}</span>
        {/if}
    {/if}

    {#if trailing}
        {@render trailing()}
    {:else if trailingIcon}
        <Icon name={trailingIcon} class={trailingIconClass} />
    {/if}
</svelte:element>
