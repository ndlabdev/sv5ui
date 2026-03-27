<script lang="ts" module>
    import type { ButtonProps } from './button.types.js'

    export type Props = ButtonProps
</script>

<script lang="ts">
    import { buttonVariants, buttonDefaults } from './button.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import { fieldGroupVariant } from '../FieldGroup/field-group.variants.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Link from '../Link/Link.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'
    import type { FieldGroupVariantProps } from '../FieldGroup/field-group.variants.js'

    const config = getComponentConfig('button', buttonDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        ui,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size,
        label,
        loading = false,
        loadingAuto = false,
        loadingIcon = icons.loading,
        disabled = false,
        block = false,
        square = false,
        icon,
        leadingIcon,
        trailingIcon,
        trailing = false,
        avatar,
        href,
        type,
        external,
        active,
        exact = false,
        activeColor,
        activeVariant,
        activeClass,
        inactiveClass,
        leadingSlot,
        trailingSlot,
        children,
        class: className,
        onclick,
        ...restProps
    }: Props = $props()

    const fieldGroupContext = getContext<
        | {
              orientation: NonNullable<FieldGroupVariantProps['orientation']>
              size: NonNullable<FieldGroupVariantProps['size']>
          }
        | undefined
    >('fieldGroup')

    const resolvedSize = $derived(size ?? fieldGroupContext?.size ?? config.defaultVariants.size)
    const fieldGroupClass = $derived(
        fieldGroupContext
            ? fieldGroupVariant.fieldGroup[fieldGroupContext.orientation ?? 'horizontal']
            : undefined
    )

    let autoLoading = $state(false)
    let pendingPromise: Promise<unknown> | null = null
    const isLoading = $derived(loading || autoLoading)

    const isIconOnly = $derived(square || (!label && !children))
    const isLeading = $derived((!!icon && !trailing) || (isLoading && !trailing) || !!leadingIcon)
    const isTrailing = $derived((!!icon && trailing) || (isLoading && trailing) || !!trailingIcon)

    const leadingIconName = $derived(
        isLoading && isLeading
            ? loadingIcon
            : leadingIcon || (isLeading && !trailing ? icon : undefined)
    )
    const trailingIconName = $derived(
        isLoading && isTrailing ? loadingIcon : trailingIcon || (trailing ? icon : undefined)
    )

    const resolvedColor = $derived(active && activeColor ? activeColor : color)
    const resolvedVariant = $derived(active && activeVariant ? activeVariant : variant)

    const classes = $derived.by(() => {
        const slots = buttonVariants({
            variant: resolvedVariant,
            color: resolvedColor,
            size: resolvedSize,
            block,
            square: isIconOnly,
            loading: isLoading,
            leading: isLeading,
            trailing: isTrailing
        })
        return {
            base: slots.base({ class: [config.slots.base, fieldGroupClass, className, ui?.base] }),
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

    function handleClick(e: MouseEvent) {
        if (disabled || isLoading) {
            e.preventDefault()
            e.stopPropagation()
            return
        }

        if (typeof onclick === 'function') {
            const result = (onclick as (e: MouseEvent) => unknown)(e)

            if (loadingAuto && result instanceof Promise) {
                autoLoading = true
                pendingPromise = result
                result.then(
                    () => {
                        if (pendingPromise === result) autoLoading = false
                    },
                    () => {
                        if (pendingPromise === result) autoLoading = false
                    }
                )
            }
        }
    }
</script>

<Link
    {...restProps}
    bind:ref
    {href}
    {type}
    {external}
    {active}
    {exact}
    {activeClass}
    {inactiveClass}
    raw
    disabled={disabled || isLoading}
    class={classes.base}
    onclick={handleClick}
>
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
</Link>
