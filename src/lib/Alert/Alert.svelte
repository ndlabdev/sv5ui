<script lang="ts" module>
    import type { AlertProps } from './alert.types.js'

    export type Props = AlertProps
</script>

<script lang="ts">
    import { alertVariants } from './alert.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('alert')
    const icons = getComponentConfig('icons')

    let {
        as = 'div',
        ui,
        title,
        description,
        icon,
        avatar,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        orientation = config.defaultVariants.orientation,
        open = true,
        close = false,
        closeIcon,
        actions,
        class: className,
        leading,
        titleSlot,
        descriptionSlot,
        actionsSlot,
        closeSlot,
        onClose,
        ...restProps
    }: Props = $props()

    const resolvedCloseIcon = $derived(closeIcon ?? icons.close)

    const slots = $derived(
        alertVariants({
            variant,
            color,
            orientation
        })
    )

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
    const wrapperClass = $derived(slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }))
    const titleClass = $derived(slots.title({ class: [config.slots.title, ui?.title] }))
    const descriptionClass = $derived(slots.description({ class: [config.slots.description, ui?.description] }))
    const iconClass = $derived(slots.icon({ class: [config.slots.icon, ui?.icon] }))
    const avatarClass = $derived(slots.avatar({ class: [config.slots.avatar, ui?.avatar] }))
    const actionsClass = $derived(slots.actions({ class: [config.slots.actions, ui?.actions] }))
    const closeClass = $derived(slots.close({ class: [config.slots.close, ui?.close] }))

    const closeButtonProps = $derived.by(() => {
        if (!close) return null
        if (close === true) return {}
        return close
    })

    function handleClose() {
        onClose?.()
    }
</script>

{#if open}
    <svelte:element this={as} class={rootClass} role="alert" {...restProps}>
        {#if leading}
            {@render leading()}
        {:else if icon}
            <Icon name={icon} class={iconClass} />
        {:else if avatar}
            <Avatar {...avatar} class={avatarClass} />
        {/if}

        {#if title || description || titleSlot || descriptionSlot}
            <div class={wrapperClass}>
                {#if titleSlot}
                    {@render titleSlot()}
                {:else if title}
                    <div class={titleClass}>{title}</div>
                {/if}

                {#if descriptionSlot}
                    {@render descriptionSlot()}
                {:else if description}
                    <div class={descriptionClass}>{description}</div>
                {/if}
            </div>
        {/if}

        {#if actionsSlot}
            {@render actionsSlot()}
        {:else if actions && actions.length > 0}
            <div class={actionsClass}>
                {#each actions as action, index (index)}
                    <Button size="xs" variant="outline" color={color} {...action} />
                {/each}
            </div>
        {/if}

        {#if closeSlot}
            <div class={closeClass}>
                {@render closeSlot()}
            </div>
        {:else if closeButtonProps}
            <Button
                icon={resolvedCloseIcon}
                variant="ghost"
                color={color}
                size="xs"
                square
                class={closeClass}
                onclick={handleClose}
                aria-label="Close alert"
                {...closeButtonProps}
            />
        {/if}
    </svelte:element>
{/if}
