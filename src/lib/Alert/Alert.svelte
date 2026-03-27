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
        ref = $bindable(null),
        as = 'div',
        ui,
        title,
        description,
        icon,
        avatar,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        orientation = config.defaultVariants.orientation,
        open = $bindable(true),
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
        const slots = alertVariants({ variant, color, orientation, title: !!title })
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

    const closeButtonProps = $derived(!close ? null : close === true ? {} : close)

    const isVertical = $derived(orientation === 'vertical')
    const hasActions = $derived(!!actionsSlot || (actions && actions.length > 0))

    function handleClose() {
        open = false
        onClose?.()
    }
</script>

{#snippet actionsContent()}
    {#if actionsSlot}
        {@render actionsSlot()}
    {:else if actions && actions.length > 0}
        <div class={classes.actions}>
            {#each actions as action, index (index)}
                <Button size="xs" {...action} />
            {/each}
        </div>
    {/if}
{/snippet}

{#if open}
    <svelte:element this={as} bind:this={ref} class={classes.root} role="alert" {...restProps}>
        {#if leading}
            {@render leading()}
        {:else if icon}
            <Icon name={icon} class={classes.icon} />
        {:else if avatar}
            <Avatar {...avatar} class={classes.avatar} />
        {/if}

        {#if title || description || titleSlot || descriptionSlot || (isVertical && hasActions)}
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

                {#if isVertical}
                    {@render actionsContent()}
                {/if}
            </div>
        {/if}

        {#if !isVertical}
            {@render actionsContent()}
        {/if}

        {#if closeSlot}
            <div class={classes.close}>
                {@render closeSlot()}
            </div>
        {:else if closeButtonProps}
            <Button
                {...closeButtonProps}
                icon={closeButtonProps.icon ?? resolvedCloseIcon}
                variant={closeButtonProps.variant ?? 'link'}
                color={closeButtonProps.color ?? 'surface'}
                class={classes.close}
                onclick={handleClose}
                aria-label={closeButtonProps['aria-label'] ?? 'Close alert'}
            />
        {/if}
    </svelte:element>
{/if}
