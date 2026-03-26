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
        ref = $bindable(null),
        as = 'div',
        ui,
        icon,
        avatar,
        title,
        description,
        actions,
        variant = config.defaultVariants.variant,
        size = config.defaultVariants.size,
        class: className,
        leading,
        titleSlot,
        descriptionSlot,
        actionsSlot,
        header,
        body,
        footer,
        children,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = emptyVariants({ variant, size })
        const c = config.slots
        return {
            root: slots.root({ class: [c.root, className, ui?.root] }),
            header: slots.header({ class: [c.header, ui?.header] }),
            avatar: slots.avatar({ class: [c.avatar, ui?.avatar] }),
            title: slots.title({ class: [c.title, ui?.title] }),
            description: slots.description({ class: [c.description, ui?.description] }),
            body: slots.body({ class: [c.body, ui?.body] }),
            actions: slots.actions({ class: [c.actions, ui?.actions] }),
            footer: slots.footer({ class: [c.footer, ui?.footer] })
        }
    })

    const hasHeader = $derived(!!icon || !!avatar || !!title || !!description || !!leading || !!titleSlot || !!descriptionSlot || !!header)
    const hasActions = $derived(actions && actions.length > 0)
    const hasBody = $derived(!!hasActions || !!actionsSlot || !!body || !!children)
</script>

<svelte:element this={as} bind:this={ref} class={classes.root} {...restProps}>
    {#if header}
        {@render header()}
    {:else if hasHeader}
        <div class={classes.header}>
            {#if leading}
                {@render leading()}
            {:else if icon}
                <Icon name={icon} class={classes.avatar} />
            {:else if avatar}
                <Avatar {...avatar} class={classes.avatar} />
            {/if}

            {#if titleSlot}
                {@render titleSlot()}
            {:else if title}
                <p class={classes.title}>{title}</p>
            {/if}

            {#if descriptionSlot}
                {@render descriptionSlot()}
            {:else if description}
                <p class={classes.description}>{description}</p>
            {/if}
        </div>
    {/if}

    {#if body}
        {@render body()}
    {:else if hasBody}
        <div class={classes.body}>
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
        </div>
    {/if}

    {#if footer}
        <div class={classes.footer}>
            {@render footer()}
        </div>
    {/if}
</svelte:element>
