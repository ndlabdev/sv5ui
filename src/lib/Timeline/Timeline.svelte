<script lang="ts" module>
    import type { TimelineProps } from './timeline.types.js'

    export type Props = TimelineProps
</script>

<script lang="ts">
    import { timelineVariants } from './timeline.variants.js'
    import type { TimelineItemState } from './timeline.types.js'
    import { getComponentConfig } from '../config.js'
    import Avatar from '../Avatar/Avatar.svelte'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('timeline')

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

    const slots = $derived(timelineVariants({ orientation, color, size, reverse }))
    const activeIndex = $derived(value !== undefined ? items.findIndex((item) => item.value === value) : -1)

    function getState(index: number): TimelineItemState {
        if (activeIndex === -1) return 'pending'
        if (index === activeIndex) return 'active'
        return index < activeIndex ? 'completed' : 'pending'
    }
</script>

<svelte:element this={as} class={slots.root({ class: [config.slots.root, className, ui?.root] })} {...restProps}>
    {#each items as item, index (item.value ?? index)}
        {@const state = getState(index)}
        <div class={slots.item({ class: [config.slots.item, ui?.item, item.class] })} data-state={state}>
            <div class={slots.container({ class: [config.slots.container, ui?.container] })}>
                {#if indicator}
                    {@render indicator({ item, index, state })}
                {:else}
                    <div class={slots.indicator({ class: [config.slots.indicator, ui?.indicator] })}>
                        {#if item.avatar}
                            <Avatar {...item.avatar} size={size} />
                        {:else if item.icon}
                            <Icon name={item.icon} />
                        {/if}
                    </div>
                {/if}

                {#if reverse ? index > 0 : index < items.length - 1}
                    <div class={slots.separator({ class: [config.slots.separator, ui?.separator] })}></div>
                {/if}
            </div>

            <div class={slots.wrapper({ class: [config.slots.wrapper, ui?.wrapper] })}>
                {#if dateSlot}
                    {@render dateSlot({ item, index, state })}
                {:else if item.date}
                    <div class={slots.date({ class: [config.slots.date, ui?.date] })}>{item.date}</div>
                {/if}

                {#if titleSlot}
                    {@render titleSlot({ item, index, state })}
                {:else if item.title}
                    <div class={slots.title({ class: [config.slots.title, ui?.title] })}>{item.title}</div>
                {/if}

                {#if descriptionSlot}
                    {@render descriptionSlot({ item, index, state })}
                {:else if item.description}
                    <div class={slots.description({ class: [config.slots.description, ui?.description] })}>{item.description}</div>
                {/if}

                {#if content}
                    {@render content({ item, index, state })}
                {/if}
            </div>
        </div>
    {/each}
</svelte:element>
