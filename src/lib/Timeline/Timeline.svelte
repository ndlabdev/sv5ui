<script lang="ts" module>
    import type { TimelineProps } from './timeline.types.js'

    export type Props = TimelineProps
</script>

<script lang="ts">
    import type { ClassNameValue } from 'tailwind-merge'
    import { timelineVariants, timelineDefaults } from './timeline.variants.js'
    import type { TimelineItemState } from './timeline.types.js'
    import { getComponentConfig } from '../config.js'
    import Avatar from '../Avatar/Avatar.svelte'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('timeline', timelineDefaults)

    let {
        ref = $bindable(null),
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

    type ItemUi = Partial<Record<string, ClassNameValue>>

    const classes = $derived.by(() => {
        const slots = timelineVariants({ orientation, color, size, reverse })
        const c = config.slots

        // Pre-compute defaults — reused for all items without per-item ui
        const _item = slots.item({ class: [c.item, ui?.item] })
        const _container = slots.container({ class: [c.container, ui?.container] })
        const _indicator = slots.indicator({ class: [c.indicator, ui?.indicator] })
        const _separator = slots.separator({ class: [c.separator, ui?.separator] })
        const _wrapper = slots.wrapper({ class: [c.wrapper, ui?.wrapper] })
        const _date = slots.date({ class: [c.date, ui?.date] })
        const _title = slots.title({ class: [c.title, ui?.title] })
        const _description = slots.description({ class: [c.description, ui?.description] })

        return {
            root: slots.root({ class: [c.root, className, ui?.root] }),
            item: (itemClass?: ClassNameValue, itemUi?: ItemUi) =>
                itemClass || itemUi
                    ? slots.item({ class: [c.item, ui?.item, itemUi?.item, itemClass] })
                    : _item,
            container: (itemUi?: ItemUi) =>
                itemUi ? slots.container({ class: [c.container, ui?.container, itemUi.container] }) : _container,
            indicator: (itemUi?: ItemUi) =>
                itemUi ? slots.indicator({ class: [c.indicator, ui?.indicator, itemUi.indicator] }) : _indicator,
            separator: (itemUi?: ItemUi) =>
                itemUi ? slots.separator({ class: [c.separator, ui?.separator, itemUi.separator] }) : _separator,
            wrapper: (itemUi?: ItemUi) =>
                itemUi ? slots.wrapper({ class: [c.wrapper, ui?.wrapper, itemUi.wrapper] }) : _wrapper,
            date: (itemUi?: ItemUi) =>
                itemUi?.date ? slots.date({ class: [c.date, ui?.date, itemUi.date] }) : _date,
            title: (itemUi?: ItemUi) =>
                itemUi?.title ? slots.title({ class: [c.title, ui?.title, itemUi.title] }) : _title,
            description: (itemUi?: ItemUi) =>
                itemUi?.description
                    ? slots.description({ class: [c.description, ui?.description, itemUi.description] })
                    : _description
        }
    })

    const activeIndex = $derived(
        value !== undefined ? items.findIndex((item) => item.value === value) : -1
    )

    function getState(index: number): TimelineItemState {
        if (activeIndex === -1) return 'pending'
        if (index === activeIndex) return 'active'
        return index < activeIndex ? 'completed' : 'pending'
    }
</script>

<svelte:element
    this={as}
    bind:this={ref}
    class={classes.root}
    data-orientation={orientation}
    {...restProps}
>
    {#each items as item, index (item.value ?? index)}
        {@const state = getState(index)}
        <div class={classes.item(item.class, item.ui)} data-state={state}>
            <div class={classes.container(item.ui)}>
                {#if indicator}
                    {@render indicator({ item, index, state })}
                {:else}
                    <div class={classes.indicator(item.ui)}>
                        {#if item.avatar}
                            <Avatar {...item.avatar} {size} />
                        {:else if item.icon}
                            <Icon name={item.icon} />
                        {/if}
                    </div>
                {/if}

                {#if reverse ? index > 0 : index < items.length - 1}
                    <div class={classes.separator(item.ui)}></div>
                {/if}
            </div>

            <div class={classes.wrapper(item.ui)}>
                {#if dateSlot}
                    {@render dateSlot({ item, index, state })}
                {:else if item.date}
                    <div class={classes.date(item.ui)}>{item.date}</div>
                {/if}

                {#if titleSlot}
                    {@render titleSlot({ item, index, state })}
                {:else if item.title}
                    <div class={classes.title(item.ui)}>{item.title}</div>
                {/if}

                {#if descriptionSlot}
                    {@render descriptionSlot({ item, index, state })}
                {:else if item.description}
                    <div class={classes.description(item.ui)}>{item.description}</div>
                {/if}

                {#if content}
                    {@render content({ item, index, state })}
                {/if}
            </div>
        </div>
    {/each}
</svelte:element>
