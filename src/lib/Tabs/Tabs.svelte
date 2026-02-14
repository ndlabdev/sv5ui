<script lang="ts" module>
    import type { TabsProps, TabsItem } from './tabs.types.js'

    export type Props = TabsProps
</script>

<script lang="ts">
    import { Tabs } from 'bits-ui'
    import { tick, untrack } from 'svelte'
    import { tabsVariants, tabsDefaults } from './tabs.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('tabs', tabsDefaults)

    let {
        items = [],
        value = $bindable(),
        defaultValue,
        onValueChange,
        variant = config.defaultVariants.variant ?? 'pill',
        color = config.defaultVariants.color ?? 'primary',
        size = config.defaultVariants.size ?? 'md',
        orientation = config.defaultVariants.orientation ?? 'horizontal',
        activationMode = 'automatic',
        disabled = false,
        loop = true,
        content: showContent = true,
        ui,
        class: className,
        leading,
        label: labelSlot,
        trailing,
        body: bodySlot
    }: Props = $props()

    // Initialize value if not provided (intentionally reads initial values only)
    if (value === undefined) {
        value = untrack(
            () => defaultValue ?? (items.length > 0 ? (items[0].value ?? '0') : undefined)
        )
    }

    let listEl: HTMLElement | null = $state(null)
    let indicatorStyle = $state('')

    const variantSlots = $derived(tabsVariants({ variant, color, size, orientation }))

    const classes = $derived.by(() => ({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        list: variantSlots.list({ class: [config.slots.list, ui?.list] }),
        indicator: variantSlots.indicator({
            class: [config.slots.indicator, ui?.indicator]
        }),
        trigger: variantSlots.trigger({ class: [config.slots.trigger, ui?.trigger] }),
        leadingIcon: variantSlots.leadingIcon({
            class: [config.slots.leadingIcon, ui?.leadingIcon]
        }),
        label: variantSlots.label({ class: [config.slots.label, ui?.label] }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] })
    }))

    let rafId = 0

    function getItemValue(item: TabsItem, index: number): string {
        return item.value ?? String(index)
    }

    function getTriggerClass(item: TabsItem) {
        if (!item.ui?.trigger && !item.class) return classes.trigger
        return variantSlots.trigger({
            class: [config.slots.trigger, ui?.trigger, item.ui?.trigger, item.class]
        })
    }

    function getIconClass(item: TabsItem) {
        if (!item.ui?.leadingIcon) return classes.leadingIcon
        return variantSlots.leadingIcon({
            class: [config.slots.leadingIcon, ui?.leadingIcon, item.ui?.leadingIcon]
        })
    }

    function getLabelClass(item: TabsItem) {
        if (!item.ui?.label) return classes.label
        return variantSlots.label({
            class: [config.slots.label, ui?.label, item.ui?.label]
        })
    }

    function updateIndicator() {
        if (!listEl) return
        const activeTrigger = listEl.querySelector('[data-state="active"]') as HTMLElement
        if (!activeTrigger) {
            indicatorStyle = 'opacity: 0;'
            return
        }

        if (orientation === 'horizontal') {
            indicatorStyle = `left: ${activeTrigger.offsetLeft}px; width: ${activeTrigger.offsetWidth}px;`
        } else {
            indicatorStyle = `top: ${activeTrigger.offsetTop}px; height: ${activeTrigger.offsetHeight}px;`
        }
    }

    function scheduleIndicatorUpdate() {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(updateIndicator)
    }

    function handleValueChange(newValue: string) {
        value = newValue
        onValueChange?.(newValue)
    }

    // Update indicator on mount and when dependencies change
    $effect(() => {
        void value
        void orientation
        void items
        tick().then(updateIndicator)
    })

    // Handle resize with rAF debouncing
    $effect(() => {
        if (!listEl) return

        const observer = new ResizeObserver(scheduleIndicatorUpdate)
        observer.observe(listEl)

        return () => {
            observer.disconnect()
            cancelAnimationFrame(rafId)
        }
    })
</script>

<Tabs.Root
    {value}
    onValueChange={handleValueChange}
    {orientation}
    {activationMode}
    {disabled}
    {loop}
    class={classes.root}
>
    <Tabs.List bind:ref={listEl} class={classes.list}>
        <div class={classes.indicator} style={indicatorStyle}></div>

        {#each items as item, index (item.value ?? index)}
            {@const itemValue = getItemValue(item, index)}
            {@const active = value === itemValue}
            <Tabs.Trigger value={itemValue} disabled={item.disabled} class={getTriggerClass(item)}>
                {#if leading}
                    {@render leading({ item, index, active })}
                {:else if item.icon}
                    <Icon name={item.icon} class={getIconClass(item)} />
                {/if}

                {#if item.label || labelSlot}
                    <span class={getLabelClass(item)}>
                        {#if labelSlot}
                            {@render labelSlot({ item, index, active })}
                        {:else}
                            {item.label}
                        {/if}
                    </span>
                {/if}

                {#if trailing}
                    {@render trailing({ item, index, active })}
                {/if}
            </Tabs.Trigger>
        {/each}
    </Tabs.List>

    {#if showContent}
        {#each items as item, index (item.value ?? index)}
            {@const itemValue = getItemValue(item, index)}
            {@const active = value === itemValue}
            <Tabs.Content value={itemValue} class={classes.content}>
                {#if bodySlot}
                    {@render bodySlot({ item, index, active })}
                {:else if item.content}
                    {item.content}
                {/if}
            </Tabs.Content>
        {/each}
    {/if}
</Tabs.Root>
