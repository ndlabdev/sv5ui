<script lang="ts" module>
    import type { EmptyProps } from './empty.types.js'

    export type Props = EmptyProps
</script>

<script lang="ts">
    import { emptyVariants, emptyDefaults } from './empty.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Button from '../Button/Button.svelte'

    const config = getComponentConfig('empty', emptyDefaults)

    let {
        as = 'div',
        ui,
        icon,
        avatar,
        title,
        description,
        actions,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size = config.defaultVariants.size,
        class: className,
        leading,
        titleSlot,
        descriptionSlot,
        actionsSlot,
        children,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = emptyVariants({ variant, color, size })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
            avatar: slots.avatar({ class: [config.slots.avatar, ui?.avatar] }),
            title: slots.title({ class: [config.slots.title, ui?.title] }),
            description: slots.description({ class: [config.slots.description, ui?.description] }),
            actions: slots.actions({ class: [config.slots.actions, ui?.actions] })
        }
    })

    const hasActions = $derived(actions && actions.length > 0)
</script>

<svelte:element this={as} class={classes.root} {...restProps}>
    {#if leading}
        {@render leading()}
    {:else if icon}
        <Icon name={icon} class={classes.icon} />
    {:else if avatar}
        <Avatar {...avatar} class={classes.avatar} />
    {/if}

    {#if titleSlot}
        {@render titleSlot()}
    {:else if title}
        <div class={classes.title}>{title}</div>
    {/if}

    {#if descriptionSlot}
        {@render descriptionSlot()}
    {:else if description}
        <p class={classes.description}>{description}</p>
    {/if}

    {@render children?.()}

    {#if actionsSlot}
        {@render actionsSlot()}
    {:else if hasActions}
        <div class={classes.actions}>
            {#each actions as action, index (index)}
                <Button size="sm" {...action} />
            {/each}
        </div>
    {/if}
</svelte:element>
