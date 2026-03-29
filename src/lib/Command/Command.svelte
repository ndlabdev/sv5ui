<script lang="ts" module>
    import type { CommandProps } from './command.types.js'

    export type Props = CommandProps
</script>

<script lang="ts">
    import { Command } from 'bits-ui'
    import { twMerge } from 'tailwind-merge'
    import { commandVariants, commandDefaults } from './command.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('command', commandDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(''),
        search = $bindable(''),
        onValueChange,
        groups = [],
        placeholder = 'Type a command or search...',
        loading = false,
        emptyText = 'No results found.',
        icon,
        label,
        filter,
        shouldFilter = true,
        loop = false,
        vimBindings = true,
        size = config.defaultVariants.size,
        item: itemSlot,
        itemLeading: itemLeadingSlot,
        itemLabel: itemLabelSlot,
        itemTrailing: itemTrailingSlot,
        empty: emptySlot,
        footer: footerSlot,
        ui,
        class: className,
        ...restProps
    }: Props = $props()

    const slots = $derived(commandVariants({ size }))
    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: slots.root({ class: [config.slots.root, className, u.root] }),
            inputWrapper: slots.inputWrapper({
                class: [config.slots.inputWrapper, u.inputWrapper]
            }),
            inputIcon: slots.inputIcon({ class: [config.slots.inputIcon, u.inputIcon] }),
            input: slots.input({ class: [config.slots.input, u.input] }),
            list: slots.list({ class: [config.slots.list, u.list] }),
            empty: slots.empty({ class: [config.slots.empty, u.empty] }),
            loading: slots.loading({ class: [config.slots.loading, u.loading] }),
            group: slots.group({ class: [config.slots.group, u.group] }),
            groupHeading: slots.groupHeading({
                class: [config.slots.groupHeading, u.groupHeading]
            }),
            groupItems: slots.groupItems({ class: [config.slots.groupItems, u.groupItems] }),
            separator: slots.separator({ class: [config.slots.separator, u.separator] }),
            item: slots.item({ class: [config.slots.item, u.item] }),
            itemIcon: slots.itemIcon({ class: [config.slots.itemIcon, u.itemIcon] }),
            itemWrapper: slots.itemWrapper({ class: [config.slots.itemWrapper, u.itemWrapper] }),
            itemLabel: slots.itemLabel({ class: [config.slots.itemLabel, u.itemLabel] }),
            itemDescription: slots.itemDescription({
                class: [config.slots.itemDescription, u.itemDescription]
            }),
            itemTrailing: slots.itemTrailing({
                class: [config.slots.itemTrailing, u.itemTrailing]
            }),
            footer: slots.footer({ class: [config.slots.footer, u.footer] })
        }
    })

    function handleValueChange(v: string) {
        value = v
        onValueChange?.(v)
    }
</script>

<Command.Root
    {...restProps}
    bind:ref
    {value}
    {label}
    onValueChange={handleValueChange}
    {filter}
    {shouldFilter}
    {loop}
    {vimBindings}
    class={classes.root}
>
    <div class={classes.inputWrapper}>
        <Icon name={icon ?? icons.search ?? 'lucide:search'} class={classes.inputIcon} />
        <Command.Input bind:value={search} {placeholder} class={classes.input} />
    </div>

    <Command.List class={classes.list}>
        {#if loading}
            <Command.Loading class={classes.loading}>
                <Icon name={icons.loading} class="mx-auto size-5 animate-spin" />
            </Command.Loading>
        {:else}
            <Command.Empty class={classes.empty}>
                {#if emptySlot}
                    {@render emptySlot({ search })}
                {:else}
                    {emptyText}
                {/if}
            </Command.Empty>

            {#each groups as group, gi (group.id)}
                {#if gi > 0}
                    <Command.Separator class={classes.separator} />
                {/if}

                <Command.Group value={group.id} class={classes.group}>
                    {#if group.label}
                        <Command.GroupHeading class={classes.groupHeading}>
                            {group.label}
                        </Command.GroupHeading>
                    {/if}

                    <Command.GroupItems class={classes.groupItems}>
                        {#each group.items as cmdItem, i (cmdItem.value)}
                            {#if itemSlot}
                                {@render itemSlot({ item: cmdItem, index: i })}
                            {:else}
                                <Command.Item
                                    value={cmdItem.value}
                                    keywords={cmdItem.keywords}
                                    disabled={cmdItem.disabled}
                                    onSelect={cmdItem.onSelect}
                                    class={twMerge(classes.item, cmdItem.class)}
                                >
                                    {#if itemLeadingSlot}
                                        {@render itemLeadingSlot({ item: cmdItem, index: i })}
                                    {:else if cmdItem.icon}
                                        <Icon name={cmdItem.icon} class={classes.itemIcon} />
                                    {/if}

                                    {#if itemLabelSlot}
                                        {@render itemLabelSlot({ item: cmdItem, index: i })}
                                    {:else}
                                        <div class={classes.itemWrapper}>
                                            {#if cmdItem.label}
                                                <span class={classes.itemLabel}
                                                    >{cmdItem.label}</span
                                                >
                                            {/if}
                                            {#if cmdItem.description}
                                                <span class={classes.itemDescription}
                                                    >{cmdItem.description}</span
                                                >
                                            {/if}
                                        </div>
                                    {/if}

                                    {#if itemTrailingSlot}
                                        <span class={classes.itemTrailing}>
                                            {@render itemTrailingSlot({ item: cmdItem, index: i })}
                                        </span>
                                    {/if}
                                </Command.Item>
                            {/if}
                        {/each}
                    </Command.GroupItems>
                </Command.Group>
            {/each}
        {/if}
    </Command.List>

    {#if footerSlot}
        <div class={classes.footer}>
            {@render footerSlot()}
        </div>
    {/if}
</Command.Root>
