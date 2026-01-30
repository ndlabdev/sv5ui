<script lang="ts" module>
    import type { TimelineProps } from './timeline.types.js'

    export type Props = TimelineProps
</script>

<script lang="ts">
    import { timelineVariants, timelineDefaults } from './timeline.variants.js'
    import type { TimelineItemState } from './timeline.types.js'
    import { getComponentConfig } from '../config.js'
    import Avatar from '../Avatar/Avatar.svelte'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('timeline', timelineDefaults)

    let {
        as = 'div',
        items = [],
        size = config.defaultVariants.size,
        color = config.defaultVariants.color,
        orientation = config.defaultVariants.orientation,
        reverse = config.defaultVariants.reverse,
        value,
        class: className,
        ui,
        indicator,
        dateSlot,
        titleSlot,
        descriptionSlot,
        content,
        ...restProps
    }: Props = $props()

    // Pre-compute shared slot classes outside the loop (these don't vary per item)
    const classes = $derived.by(() => {
        const slots = timelineVariants({ orientation, color, size, reverse })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            item: slots.item({ class: [config.slots.item, ui?.item] }),
            container: slots.container({ class: [config.slots.container, ui?.container] }),
            indicator: slots.indicator({ class: [config.slots.indicator, ui?.indicator] }),
            separator: slots.separator({ class: [config.slots.separator, ui?.separator] }),
            wrapper: slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] }),
            date: slots.date({ class: [config.slots.date, ui?.date] }),
            title: slots.title({ class: [config.slots.title, ui?.title] }),
            description: slots.description({ class: [config.slots.description, ui?.description] })
        }
    })

    const activeIndex = $derived(value !== undefined ? items.findIndex((item) => item.value === value) : -1)

    function getState(index: number): TimelineItemState {
        if (activeIndex === -1) return 'pending'
        if (index === activeIndex) return 'active'
        return index < activeIndex ? 'completed' : 'pending'
    }
</script>

<svelte:element this={as} class={classes.root} {...restProps}>
    {#each items as item, index (item.value ?? index)}
        {@const state = getState(index)}
        <div class={item.class ? `${classes.item} ${item.class}` : classes.item} data-state={state}>
            <div class={classes.container}>
                {#if indicator}
                    {@render indicator({ item, index, state })}
                {:else}
                    <div class={classes.indicator}>
                        {#if item.avatar}
                            <Avatar {...item.avatar} size={size} />
                        {:else if item.icon}
                            <Icon name={item.icon} />
                        {/if}
                    </div>
                {/if}

                {#if reverse ? index > 0 : index < items.length - 1}
                    <div class={classes.separator}></div>
                {/if}
            </div>

            <div class={classes.wrapper}>
                {#if dateSlot}
                    {@render dateSlot({ item, index, state })}
                {:else if item.date}
                    <div class={classes.date}>{item.date}</div>
                {/if}

                {#if titleSlot}
                    {@render titleSlot({ item, index, state })}
                {:else if item.title}
                    <div class={classes.title}>{item.title}</div>
                {/if}

                {#if descriptionSlot}
                    {@render descriptionSlot({ item, index, state })}
                {:else if item.description}
                    <div class={classes.description}>{item.description}</div>
                {/if}

                {#if content}
                    {@render content({ item, index, state })}
                {/if}
            </div>
        </div>
    {/each}
</svelte:element>
