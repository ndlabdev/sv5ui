<script lang="ts" module>
    import type { ToggleGroupProps } from './toggle-group.types.js'

    export type Props = ToggleGroupProps
</script>

<script lang="ts">
    import { ToggleGroup } from 'bits-ui'
    import { toggleGroupVariants, toggleGroupDefaults } from './toggle-group.variants.js'
    import { toggleVariants } from '../Toggle/toggle.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import type { ToggleGroupItem } from './toggle-group.types.js'

    const config = getComponentConfig('toggleGroup', toggleGroupDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        onValueChange,
        type = 'single',
        items = [],
        ui,
        variant = config.defaultVariants.variant,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        orientation = config.defaultVariants.orientation,
        attached = config.defaultVariants.attached,
        block = false,
        square = false,
        disabled = false,
        loop = true,
        rovingFocus = true,
        itemSlot,
        class: className,
        ...restProps
    }: Props = $props()

    const singleValue = $derived(typeof value === 'string' ? value : undefined)
    const multipleValue = $derived(Array.isArray(value) ? value : undefined)
    const onSingleChange = $derived(onValueChange as ((value: string) => void) | undefined)
    const onMultipleChange = $derived(onValueChange as ((value: string[]) => void) | undefined)

    const groupSlots = $derived(toggleGroupVariants({ orientation, attached, block }))
    const toggleSlots = $derived(toggleVariants({ variant, color, size, block }))

    const classes = $derived({
        root: groupSlots.root({ class: [config.slots.root, className, ui?.root] }),
        item: groupSlots.item({ class: [config.slots.item, ui?.item] }),
        label: toggleSlots.label({ class: [config.slots.label, ui?.label] }),
        leadingIcon: toggleSlots.leadingIcon({
            class: [config.slots.leadingIcon, ui?.leadingIcon]
        }),
        trailingIcon: toggleSlots.trailingIcon({
            class: [config.slots.trailingIcon, ui?.trailingIcon]
        })
    })

    function itemClass(item: ToggleGroupItem) {
        const isIconOnly = square || (!item.label && !itemSlot)
        return toggleSlots.base({ square: isIconOnly, class: classes.item })
    }
</script>

{#snippet groupItems()}
    {#each items as item (item.value)}
        {@const leadingIconName = item.leadingIcon ?? item.icon}
        <ToggleGroup.Item
            value={item.value}
            disabled={disabled || item.disabled}
            aria-label={item.ariaLabel}
            class={itemClass(item)}
        >
            {#if itemSlot}
                {@render itemSlot({ item })}
            {:else}
                {#if leadingIconName}
                    <Icon name={leadingIconName} class={classes.leadingIcon} />
                {/if}

                {#if item.label}
                    <span class={classes.label}>{item.label}</span>
                {/if}

                {#if item.trailingIcon}
                    <Icon name={item.trailingIcon} class={classes.trailingIcon} />
                {/if}
            {/if}
        </ToggleGroup.Item>
    {/each}
{/snippet}

{#if type === 'multiple'}
    <ToggleGroup.Root
        {...restProps}
        bind:ref
        type="multiple"
        value={multipleValue}
        onValueChange={(v) => {
            value = v
            onMultipleChange?.(v)
        }}
        {disabled}
        {loop}
        {orientation}
        {rovingFocus}
        class={classes.root}
    >
        {@render groupItems()}
    </ToggleGroup.Root>
{:else}
    <ToggleGroup.Root
        {...restProps}
        bind:ref
        type="single"
        value={singleValue}
        onValueChange={(v) => {
            value = v
            onSingleChange?.(v)
        }}
        {disabled}
        {loop}
        {orientation}
        {rovingFocus}
        class={classes.root}
    >
        {@render groupItems()}
    </ToggleGroup.Root>
{/if}
