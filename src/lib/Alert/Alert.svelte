<script lang="ts" module>
    import type { AlertProps } from './alert.types.js'

    export type Props = AlertProps
</script>

<script lang="ts">
    import { alertVariants, alertDefaults } from './alert.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('alert', alertDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

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

    const classes = $derived.by(() => {
        const slots = alertVariants({ variant, color, orientation })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
            title: slots.title({ class: [config.slots.title, ui?.title] }),
            description: slots.description({ class: [config.slots.description, ui?.description] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
            avatar: slots.avatar({ class: [config.slots.avatar, ui?.avatar] }),
            actions: slots.actions({ class: [config.slots.actions, ui?.actions] }),
            close: slots.close({ class: [config.slots.close, ui?.close] })
        }
    })

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
    <svelte:element this={as} class={classes.root} role="alert" {...restProps}>
        {#if leading}
            {@render leading()}
        {:else if icon}
            <Icon name={icon} class={classes.icon} />
        {:else if avatar}
            <Avatar {...avatar} class={classes.avatar} />
        {/if}

        {#if title || description || titleSlot || descriptionSlot}
            <div class={classes.wrapper}>
                {#if titleSlot}
                    {@render titleSlot()}
                {:else if title}
                    <div class={classes.title}>{title}</div>
                {/if}

                {#if descriptionSlot}
                    {@render descriptionSlot()}
                {:else if description}
                    <div class={classes.description}>{description}</div>
                {/if}
            </div>
        {/if}

        {#if actionsSlot}
            {@render actionsSlot()}
        {:else if actions && actions.length > 0}
            <div class={classes.actions}>
                {#each actions as action, index (index)}
                    <Button size="xs" {...action} />
                {/each}
            </div>
        {/if}

        {#if closeSlot}
            <div class={classes.close}>
                {@render closeSlot()}
            </div>
        {:else if closeButtonProps}
            <Button
                icon={resolvedCloseIcon}
                variant="link"
                color="surface"
                class={classes.close}
                onclick={handleClose}
                aria-label="Close alert"
                {...closeButtonProps}
            />
        {/if}
    </svelte:element>
{/if}
