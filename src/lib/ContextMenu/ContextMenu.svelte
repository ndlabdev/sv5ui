<script lang="ts" module>
    import type {
        ContextMenuProps,
        ContextMenuItem,
        ContextMenuItemAction
    } from './context-menu.types.js'

    export type Props = ContextMenuProps
</script>

<script lang="ts">
    import { ContextMenu } from 'bits-ui'
    import {
        contextMenuVariants,
        contextMenuDefaults,
        type ContextMenuVariantProps
    } from './context-menu.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Kbd from '../Kbd/Kbd.svelte'

    const config = getComponentConfig('contextMenu', contextMenuDefaults)

    let {
        open = $bindable(false),
        onOpenChange,
        items = [],
        radioGroups = [],
        checkedIcon = iconsDefaults.check,
        submenuIcon = iconsDefaults.chevronRight,
        sideOffset = 4,
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        hideWhenDetached = false,
        onEscapeKeydown,
        onInteractOutside,
        onCloseAutoFocus,
        forceMount,
        loop = true,
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        size = config.defaultVariants.size ?? 'md',
        ui,
        class: className,
        children,
        header,
        footer,
        item: itemSlot,
        itemLeading,
        itemLabel,
        itemTrailing,
        content: contentSlot
    }: Props = $props()

    const hasRadioItems = $derived(items.some((i) => i.type === 'radio'))
    const firstRadioGroup = $derived(radioGroups[0])

    // Compute variant classes once per transition/size/ui change
    const variantSlots = $derived(contextMenuVariants({ transition, size }))

    function resolveSlot(slot: keyof ReturnType<typeof contextMenuVariants>) {
        return variantSlots[slot]({
            class: [config.slots[slot], ui?.[slot]]
        })
    }

    const classes = $derived({
        content: resolveSlot('content'),
        group: resolveSlot('group'),
        separator: resolveSlot('separator'),
        label: resolveSlot('label'),
        item: resolveSlot('item'),
        itemIcon: resolveSlot('itemIcon'),
        itemLabel: resolveSlot('itemLabel'),
        itemKbd: resolveSlot('itemKbd'),
        subTrigger: resolveSlot('subTrigger'),
        subTriggerIcon: resolveSlot('subTriggerIcon'),
        subContent: resolveSlot('subContent'),
        checkboxIndicator: resolveSlot('checkboxIndicator'),
        radioIndicator: resolveSlot('radioIndicator')
    })

    // Cache color variant computations per color — avoids re-calling contextMenuVariants
    // for every action item with the same color in a single render cycle
    type ColorKey = NonNullable<ContextMenuVariantProps['color']>

    // eslint-disable-next-line svelte/require-svelte-collections -- intentionally non-reactive cache
    const getColorVariant = $derived.by(() => {
        const cache: Partial<Record<ColorKey, ReturnType<typeof contextMenuVariants>>> = {}
        return (color: ColorKey) => {
            cache[color] ??= contextMenuVariants({ size, color })
            return cache[color]
        }
    })

    function close() {
        open = false
    }

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }

    function getItemClasses(item: ContextMenuItemAction) {
        const colorVariant = getColorVariant(item.color ?? 'default')
        return {
            item: colorVariant.item({ class: [config.slots.item, ui?.item, item.class] }),
            itemIcon: colorVariant.itemIcon({ class: [config.slots.itemIcon, ui?.itemIcon] })
        }
    }

    // Collision props shared between Content and SubContent
    const collisionProps = $derived({
        sideOffset,
        alignOffset,
        avoidCollisions,
        collisionBoundary,
        collisionPadding
    })
</script>

{#snippet renderKbds(kbds: ContextMenuItemAction['kbds'])}
    {#if kbds?.length}
        <span class={classes.itemKbd}>
            {#each kbds as kbd, i (i)}
                {#if typeof kbd === 'string'}
                    <Kbd value={kbd} size="sm" variant="subtle" />
                {:else}
                    <Kbd {...kbd} size={kbd.size ?? 'sm'} variant={kbd.variant ?? 'subtle'} />
                {/if}
            {/each}
        </span>
    {/if}
{/snippet}

{#snippet renderItem(item: ContextMenuItem, index: number)}
    {#if item.type === 'separator'}
        <ContextMenu.Separator class={classes.separator} />
    {:else if item.type === 'label'}
        <ContextMenu.GroupHeading class={classes.label}>{item.label}</ContextMenu.GroupHeading>
    {:else if !item.type || item.type === 'item'}
        {@const cls = getItemClasses(item as ContextMenuItemAction)}
        <ContextMenu.Item
            disabled={item.disabled}
            closeOnSelect={(item as ContextMenuItemAction).closeOnSelect}
            onSelect={(item as ContextMenuItemAction).onSelect}
            class={cls.item}
        >
            {#if itemLeading}
                {@render itemLeading({ item, index })}
            {:else if item.icon}
                <Icon name={item.icon} class={cls.itemIcon} />
            {/if}

            {#if itemLabel}
                {@render itemLabel({ item, index })}
            {:else if item.label}
                <span class={classes.itemLabel}>{item.label}</span>
            {/if}

            {#if itemTrailing}
                {@render itemTrailing({ item, index })}
            {:else}
                {@render renderKbds((item as ContextMenuItemAction).kbds)}
            {/if}
        </ContextMenu.Item>
    {:else if item.type === 'checkbox'}
        <ContextMenu.CheckboxItem
            checked={item.checked}
            disabled={item.disabled}
            closeOnSelect={item.closeOnSelect}
            onCheckedChange={item.onCheckedChange}
            class={[classes.item, item.class]}
        >
            {#if itemLeading}
                {@render itemLeading({ item, index })}
            {:else}
                <span class={classes.checkboxIndicator}>
                    {#if item.checked}
                        <Icon name={checkedIcon} class={classes.checkboxIndicator} />
                    {/if}
                </span>
            {/if}

            {#if itemLabel}
                {@render itemLabel({ item, index })}
            {:else if item.label}
                <span class={classes.itemLabel}>{item.label}</span>
            {/if}

            {#if itemTrailing}
                {@render itemTrailing({ item, index })}
            {:else}
                {@render renderKbds(item.kbds)}
            {/if}
        </ContextMenu.CheckboxItem>
    {:else if item.type === 'radio'}
        <ContextMenu.RadioItem
            value={item.value}
            disabled={item.disabled}
            closeOnSelect={item.closeOnSelect}
            class={[classes.item, item.class]}
        >
            {#if itemLeading}
                {@render itemLeading({ item, index })}
            {:else}
                <span class={classes.radioIndicator}>
                    {#if firstRadioGroup?.value === item.value}
                        <Icon name={checkedIcon} class={classes.radioIndicator} />
                    {/if}
                </span>
            {/if}

            {#if itemLabel}
                {@render itemLabel({ item, index })}
            {:else if item.label}
                <span class={classes.itemLabel}>{item.label}</span>
            {/if}

            {#if itemTrailing}
                {@render itemTrailing({ item, index })}
            {:else}
                {@render renderKbds(item.kbds)}
            {/if}
        </ContextMenu.RadioItem>
    {:else if item.type === 'sub'}
        <ContextMenu.Sub open={item.open} onOpenChange={item.onOpenChange}>
            <ContextMenu.SubTrigger
                disabled={item.disabled}
                class={[classes.subTrigger, item.class]}
            >
                {#if itemLeading}
                    {@render itemLeading({ item, index })}
                {:else if item.icon}
                    <Icon name={item.icon} class={classes.itemIcon} />
                {/if}

                {#if itemLabel}
                    {@render itemLabel({ item, index })}
                {:else if item.label}
                    <span class={classes.itemLabel}>{item.label}</span>
                {/if}

                <Icon name={submenuIcon} class={classes.subTriggerIcon} />
            </ContextMenu.SubTrigger>

            <ContextMenu.SubContent {...collisionProps} class={classes.subContent}>
                <div class={classes.group}>
                    {#each item.items as subItem, subIndex (subIndex)}
                        {@render renderItem(subItem, subIndex)}
                    {/each}
                </div>
            </ContextMenu.SubContent>
        </ContextMenu.Sub>
    {/if}
{/snippet}

{#snippet renderItems(menuItems: ContextMenuItem[])}
    {#if hasRadioItems && firstRadioGroup}
        <ContextMenu.RadioGroup
            value={firstRadioGroup.value}
            onValueChange={firstRadioGroup.onValueChange}
        >
            {#each menuItems as item, index (index)}
                {@render renderItem(item, index)}
            {/each}
        </ContextMenu.RadioGroup>
    {:else}
        {#each menuItems as item, index (index)}
            {@render renderItem(item, index)}
        {/each}
    {/if}
{/snippet}

{#snippet contextMenuContentEl()}
    <ContextMenu.Content
        {...collisionProps}
        {hideWhenDetached}
        {onEscapeKeydown}
        {onInteractOutside}
        {onCloseAutoFocus}
        {forceMount}
        {loop}
        class={classes.content}
    >
        {#if contentSlot}
            {@render contentSlot({ open, close })}
        {:else}
            {#if header}
                {@render header({ close })}
            {/if}

            <ContextMenu.Group class={classes.group}>
                {#if itemSlot}
                    {#each items as item, index (index)}
                        {#if item.type === 'separator'}
                            <ContextMenu.Separator class={classes.separator} />
                        {:else if item.type === 'label'}
                            <ContextMenu.GroupHeading class={classes.label}
                                >{item.label}</ContextMenu.GroupHeading
                            >
                        {:else}
                            {@render itemSlot({ item, index })}
                        {/if}
                    {/each}
                {:else}
                    {@render renderItems(items)}
                {/if}
            </ContextMenu.Group>

            {#if footer}
                {@render footer({ close })}
            {/if}
        {/if}
    </ContextMenu.Content>
{/snippet}

<ContextMenu.Root bind:open onOpenChange={handleOpenChange}>
    {#if children}
        <ContextMenu.Trigger class={className as string}>
            {@render children({ open })}
        </ContextMenu.Trigger>
    {/if}

    {#if portal}
        <ContextMenu.Portal>
            {@render contextMenuContentEl()}
        </ContextMenu.Portal>
    {:else}
        {@render contextMenuContentEl()}
    {/if}
</ContextMenu.Root>
