<script lang="ts" module>
    import type { AccordionProps, AccordionItem } from './accordion.types.js'

    export type Props = AccordionProps
</script>

<script lang="ts">
    import { Accordion } from 'bits-ui'
    import { slide } from 'svelte/transition'
    import { accordionVariants, accordionDefaults } from './accordion.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('accordion', accordionDefaults)

    let {
        items = [],
        type = 'single',
        value = $bindable(),
        onValueChange,
        disabled = false,
        loop = false,
        orientation = 'vertical',
        forceMount = false,
        trailingIcon = 'lucide:chevron-down',
        ui,
        class: className,
        leading,
        label: labelSlot,
        trailing,
        content: contentSlot,
        body: bodySlot
    }: Props = $props()

    const variantSlots = $derived(accordionVariants({ disabled }))
    const rootClass = $derived(
        variantSlots.root({ class: [config.slots.root, ui?.root, className] })
    )

    const singleValue = $derived(typeof value === 'string' ? value : undefined)
    const multipleValue = $derived(Array.isArray(value) ? value : undefined)

    function getItemClasses(item: AccordionItem) {
        return {
            item: variantSlots.item({
                class: [config.slots.item, ui?.item, item.ui?.item, item.class]
            }),
            header: variantSlots.header({
                class: [config.slots.header, ui?.header, item.ui?.header]
            }),
            trigger: variantSlots.trigger({
                class: [config.slots.trigger, ui?.trigger, item.ui?.trigger],
                disabled: item.disabled
            }),
            content: variantSlots.content({
                class: [config.slots.content, ui?.content, item.ui?.content]
            }),
            body: variantSlots.body({ class: [config.slots.body, ui?.body, item.ui?.body] }),
            leadingIcon: variantSlots.leadingIcon({
                class: [config.slots.leadingIcon, ui?.leadingIcon, item.ui?.leadingIcon]
            }),
            trailingIcon: variantSlots.trailingIcon({
                class: [config.slots.trailingIcon, ui?.trailingIcon, item.ui?.trailingIcon]
            }),
            label: variantSlots.label({ class: [config.slots.label, ui?.label, item.ui?.label] })
        }
    }

    function isOpen(itemValue: string): boolean {
        if (!value) return false
        if (Array.isArray(value)) return value.includes(itemValue)
        return value === itemValue
    }

    function handleSingleValueChange(newValue: string) {
        value = newValue
        onValueChange?.(newValue)
    }

    function handleMultipleValueChange(newValue: string[]) {
        value = newValue
        onValueChange?.(newValue)
    }
</script>

{#snippet accordionItem(item: AccordionItem, index: number)}
    {@const itemValue = item.value ?? String(index)}
    {@const cls = getItemClasses(item)}
    {@const open = isOpen(itemValue)}
    <Accordion.Item value={itemValue} disabled={item.disabled} class={cls.item}>
        <Accordion.Header class={cls.header}>
            <Accordion.Trigger class={cls.trigger}>
                {#if leading}
                    {@render leading({ item, index, open })}
                {:else if item.icon}
                    <Icon name={item.icon} class={cls.leadingIcon} />
                {/if}

                {#if item.label || labelSlot}
                    <span class={cls.label}>
                        {#if labelSlot}
                            {@render labelSlot({ item, index, open })}
                        {:else}
                            {item.label}
                        {/if}
                    </span>
                {/if}

                {#if trailing}
                    {@render trailing({ item, index, open })}
                {:else}
                    <Icon name={item.trailingIcon ?? trailingIcon} class={cls.trailingIcon} />
                {/if}
            </Accordion.Trigger>
        </Accordion.Header>

        {#if item.content || contentSlot || bodySlot}
            {#if forceMount}
                <Accordion.Content forceMount>
                    {#snippet child({ props, open: isContentOpen })}
                        {#if isContentOpen}
                            <div {...props} transition:slide={{ duration: 200 }}>
                                <div class={cls.content}>
                                    {#if contentSlot}
                                        {@render contentSlot({ item, index, open: isContentOpen })}
                                    {:else}
                                        <div class={cls.body}>
                                            {#if bodySlot}
                                                {@render bodySlot({
                                                    item,
                                                    index,
                                                    open: isContentOpen
                                                })}
                                            {:else}
                                                {item.content}
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    {/snippet}
                </Accordion.Content>
            {:else}
                <Accordion.Content class={cls.content}>
                    {#if contentSlot}
                        {@render contentSlot({ item, index, open })}
                    {:else}
                        <div class={cls.body}>
                            {#if bodySlot}
                                {@render bodySlot({ item, index, open })}
                            {:else}
                                {item.content}
                            {/if}
                        </div>
                    {/if}
                </Accordion.Content>
            {/if}
        {/if}
    </Accordion.Item>
{/snippet}

{#if type === 'single'}
    <Accordion.Root
        type="single"
        value={singleValue}
        onValueChange={handleSingleValueChange}
        {disabled}
        {loop}
        {orientation}
        class={rootClass}
    >
        {#each items as item, index}
            {@render accordionItem(item, index)}
        {/each}
    </Accordion.Root>
{:else}
    <Accordion.Root
        type="multiple"
        value={multipleValue}
        onValueChange={handleMultipleValueChange}
        {disabled}
        {loop}
        {orientation}
        class={rootClass}
    >
        {#each items as item, index}
            {@render accordionItem(item, index)}
        {/each}
    </Accordion.Root>
{/if}
