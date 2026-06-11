<script lang="ts" module>
    import type { StepperProps } from './stepper.types.js'

    export type Props = StepperProps
</script>

<script lang="ts">
    import type { ClassNameValue } from 'tailwind-merge'
    import { untrack } from 'svelte'
    import { stepperVariants, stepperDefaults } from './stepper.variants.js'
    import type { StepperItem, StepperItemState, StepperApi } from './stepper.types.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('stepper', stepperDefaults)

    let {
        ref = $bindable(null),
        as = 'div',
        items = [],
        value = $bindable(),
        defaultValue,
        onValueChange,
        api = $bindable(),
        linear = true,
        disabled = false,
        orientation = config.defaultVariants.orientation ?? 'horizontal',
        size = config.defaultVariants.size ?? 'md',
        color = config.defaultVariants.color ?? 'primary',
        content: showContent = true,
        class: className,
        ui,
        indicator: indicatorSlot,
        titleSlot,
        descriptionSlot,
        body,
        ...restProps
    }: Props = $props()

    if (value === undefined) {
        value = untrack(() => defaultValue ?? items[0]?.value ?? 0)
    }

    let triggers: (HTMLButtonElement | null)[] = $state([])

    function getItemValue(item: StepperItem, index: number): string | number {
        return item.value ?? index
    }

    const activeIndex = $derived(items.findIndex((item, i) => getItemValue(item, i) === value))

    function getState(index: number): StepperItemState {
        if (activeIndex === -1) return 'pending'
        if (index === activeIndex) return 'active'
        return index < activeIndex ? 'completed' : 'pending'
    }

    function canActivate(index: number): boolean {
        if (disabled || items[index]?.disabled) return false
        if (!linear) return true
        return index <= activeIndex + 1
    }

    function setValue(next: string | number) {
        if (next === value) return
        value = next
        onValueChange?.(next)
    }

    function handleClick(item: StepperItem, index: number) {
        if (!canActivate(index)) return
        setValue(getItemValue(item, index))
    }

    function findEnabled(start: number, dir: 1 | -1): number {
        for (let i = start; i >= 0 && i < items.length; i += dir) {
            if (!items[i]?.disabled) return i
        }
        return -1
    }

    function handleKeydown(e: KeyboardEvent, index: number) {
        const horizontal = orientation === 'horizontal'
        const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
        const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

        let target = -1
        if (e.key === nextKey) target = findEnabled(index + 1, 1)
        else if (e.key === prevKey) target = findEnabled(index - 1, -1)
        else if (e.key === 'Home') target = findEnabled(0, 1)
        else if (e.key === 'End') target = findEnabled(items.length - 1, -1)
        else return

        e.preventDefault()
        if (target >= 0) triggers[target]?.focus()
    }

    const apiInstance: StepperApi = {
        next() {
            if (activeIndex >= items.length - 1) return
            const target = items[activeIndex + 1]
            if (!target) return
            setValue(getItemValue(target, activeIndex + 1))
        },
        prev() {
            if (activeIndex <= 0) return
            const target = items[activeIndex - 1]
            if (!target) return
            setValue(getItemValue(target, activeIndex - 1))
        },
        goTo(next) {
            setValue(next)
        },
        get hasNext() {
            return activeIndex >= 0 && activeIndex < items.length - 1
        },
        get hasPrev() {
            return activeIndex > 0
        },
        get activeIndex() {
            return activeIndex
        }
    }

    api = apiInstance

    const variantSlots = $derived(stepperVariants({ orientation, size, color }))

    type ItemUi = StepperItem['ui']

    const classes = $derived.by(() => {
        const c = config.slots
        const slots = variantSlots
        const u = ui ?? {}

        const _item = slots.item({ class: [c.item, u.item] })
        const _trigger = slots.trigger({ class: [c.trigger, u.trigger] })
        const _container = slots.container({ class: [c.container, u.container] })
        const _indicator = slots.indicator({ class: [c.indicator, u.indicator] })
        const _separator = slots.separator({ class: [c.separator, u.separator] })
        const _wrapper = slots.wrapper({ class: [c.wrapper, u.wrapper] })
        const _title = slots.title({ class: [c.title, u.title] })
        const _description = slots.description({ class: [c.description, u.description] })
        const _content = slots.content({ class: [c.content, u.content] })

        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            list: slots.list({ class: [c.list, u.list] }),
            item: (itemClass?: ClassNameValue, itemUi?: ItemUi) =>
                itemClass || itemUi
                    ? slots.item({ class: [c.item, u.item, itemUi?.item, itemClass] })
                    : _item,
            trigger: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.trigger({ class: [c.trigger, u.trigger, itemUi.trigger] })
                    : _trigger,
            container: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.container({ class: [c.container, u.container, itemUi.container] })
                    : _container,
            indicator: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.indicator({ class: [c.indicator, u.indicator, itemUi.indicator] })
                    : _indicator,
            separator: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.separator({ class: [c.separator, u.separator, itemUi.separator] })
                    : _separator,
            wrapper: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.wrapper({ class: [c.wrapper, u.wrapper, itemUi.wrapper] })
                    : _wrapper,
            title: (itemUi?: ItemUi) =>
                itemUi ? slots.title({ class: [c.title, u.title, itemUi.title] }) : _title,
            description: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.description({
                          class: [c.description, u.description, itemUi.description]
                      })
                    : _description,
            content: (itemUi?: ItemUi) =>
                itemUi ? slots.content({ class: [c.content, u.content, itemUi.content] }) : _content
        }
    })
</script>

<svelte:element
    this={as}
    bind:this={ref}
    class={classes.root}
    data-orientation={orientation}
    {...restProps}
>
    <ol class={classes.list}>
        {#each items as item, index (item.value ?? index)}
            {@const state = getState(index)}
            {@const number = index + 1}
            {@const active = state === 'active'}
            {@const itemDisabled = disabled || item.disabled || !canActivate(index)}
            {@const slotProps = { item, index, number, state, active }}
            {@const hasVisibleText = !!(
                titleSlot ||
                descriptionSlot ||
                item.title ||
                item.description
            )}
            <li
                class={classes.item(item.class, item.ui)}
                data-state={state}
                data-orientation={orientation}
                data-stepper-item=""
            >
                <button
                    type="button"
                    bind:this={triggers[index]}
                    class={classes.trigger(item.ui)}
                    disabled={itemDisabled}
                    aria-current={active ? 'step' : undefined}
                    aria-label={hasVisibleText ? undefined : `Step ${number}`}
                    tabindex={active ? 0 : -1}
                    onclick={() => handleClick(item, index)}
                    onkeydown={(e) => handleKeydown(e, index)}
                >
                    <span class={classes.container(item.ui)}>
                        {#if indicatorSlot}
                            {@render indicatorSlot(slotProps)}
                        {:else}
                            <span
                                class={classes.indicator(item.ui)}
                                data-stepper-indicator=""
                                aria-hidden="true"
                            >
                                {#if item.icon}
                                    <Icon name={item.icon} />
                                {:else if state === 'completed'}
                                    <Icon name="lucide:check" />
                                {:else}
                                    {number}
                                {/if}
                            </span>
                        {/if}

                        {#if index < items.length - 1}
                            <span
                                class={classes.separator(item.ui)}
                                data-stepper-separator=""
                                aria-hidden="true"
                            ></span>
                        {/if}
                    </span>

                    {#if hasVisibleText}
                        <span class={classes.wrapper(item.ui)}>
                            {#if titleSlot}
                                {@render titleSlot(slotProps)}
                            {:else if item.title}
                                <span class={classes.title(item.ui)}>{item.title}</span>
                            {/if}

                            {#if descriptionSlot}
                                {@render descriptionSlot(slotProps)}
                            {:else if item.description}
                                <span class={classes.description(item.ui)}>
                                    {item.description}
                                </span>
                            {/if}
                        </span>
                    {/if}
                </button>
            </li>
        {/each}
    </ol>

    {#if showContent}
        {#each items as item, index (item.value ?? index)}
            {@const state = getState(index)}
            {#if state === 'active' && (body || item.content !== undefined)}
                {@const number = index + 1}
                {@const slotProps = { item, index, number, state, active: true }}
                <div class={classes.content(item.ui)} role="region" data-stepper-content="">
                    {#if body}
                        {@render body(slotProps)}
                    {:else}
                        {item.content}
                    {/if}
                </div>
            {/if}
        {/each}
    {/if}
</svelte:element>
