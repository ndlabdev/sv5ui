<script lang="ts" module>
    import type {
        ContextMenuProps,
        ContextMenuItem,
        ContextMenuItemAction,
        ContextMenuItemCheckbox,
        ContextMenuItemRadio,
        ContextMenuItemSub
    } from './context-menu.types.js'

    export type Props = ContextMenuProps
</script>

<script lang="ts">
    import { ContextMenu } from 'bits-ui'
    import {
        contextMenuVariants,
        contextMenuDefaults,
        itemColorClasses
    } from './context-menu.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Kbd from '../Kbd/Kbd.svelte'

    const config = getComponentConfig('contextMenu', contextMenuDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        open = $bindable(false),
        onOpenChange,
        items = [],
        radioGroups = [],
        checkedIcon = icons.check,
        submenuIcon = icons.chevronRight,
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

    const variantSlots = $derived(contextMenuVariants({ transition, size }))
    const classes = $derived({
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        group: variantSlots.group({ class: [config.slots.group, ui?.group] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        label: variantSlots.label({ class: [config.slots.label, ui?.label] }),
        item: variantSlots.item({ class: [config.slots.item, ui?.item] }),
        itemLeadingIcon: variantSlots.itemLeadingIcon({
            class: [config.slots.itemLeadingIcon, ui?.itemLeadingIcon]
        }),
        itemLabel: variantSlots.itemLabel({ class: [config.slots.itemLabel, ui?.itemLabel] }),
        itemTrailingKbds: variantSlots.itemTrailingKbds({
            class: [config.slots.itemTrailingKbds, ui?.itemTrailingKbds]
        }),
        itemIndicator: variantSlots.itemIndicator({
            class: [config.slots.itemIndicator, ui?.itemIndicator]
        }),
        subTrigger: variantSlots.subTrigger({ class: [config.slots.subTrigger, ui?.subTrigger] }),
        subTriggerIcon: variantSlots.subTriggerIcon({
            class: [config.slots.subTriggerIcon, ui?.subTriggerIcon]
        }),
        subContent: variantSlots.subContent({ class: [config.slots.subContent, ui?.subContent] })
    })

    function close() {
        open = false
    }

    // Type guards
    function isActionItem(item: ContextMenuItem): item is ContextMenuItemAction {
        return !item.type || item.type === 'item'
    }

    function isCheckboxItem(item: ContextMenuItem): item is ContextMenuItemCheckbox {
        return item.type === 'checkbox'
    }

    function isRadioItem(item: ContextMenuItem): item is ContextMenuItemRadio {
        return item.type === 'radio'
    }

    function isSubItem(item: ContextMenuItem): item is ContextMenuItemSub {
        return item.type === 'sub'
    }

    function isSeparator(item: ContextMenuItem): item is { type: 'separator' } {
        return item.type === 'separator'
    }

    function isLabel(item: ContextMenuItem): item is { type: 'label'; label: string } {
        return item.type === 'label'
    }
</script>

{#snippet renderKbds(kbds: ContextMenuItemAction['kbds'])}
    {#if kbds?.length}
        <span class={classes.itemTrailingKbds}>
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
    {#if isSeparator(item)}
        <ContextMenu.Separator class={classes.separator} />
    {:else if isLabel(item)}
        <ContextMenu.GroupHeading class={classes.label}>{item.label}</ContextMenu.GroupHeading>
    {:else if isActionItem(item)}
        {@const colorCls = itemColorClasses[item.color ?? 'default']}
        <ContextMenu.Item
            disabled={item.disabled}
            closeOnSelect={item.closeOnSelect}
            onSelect={item.onSelect}
            class={[classes.item, colorCls.item, item.class]}
        >
            {#if itemLeading}
                {@render itemLeading({ item, index })}
            {:else if item.icon}
                <Icon name={item.icon} class={[classes.itemLeadingIcon, colorCls.itemLeadingIcon]} />
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
        </ContextMenu.Item>
    {:else if isCheckboxItem(item)}
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
                <span class={classes.itemIndicator}>
                    {#if item.checked}
                        <Icon name={checkedIcon} />
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
    {:else if isRadioItem(item)}
        <ContextMenu.RadioItem
            value={item.value}
            disabled={item.disabled}
            closeOnSelect={item.closeOnSelect}
            class={[classes.item, item.class]}
        >
            {#if itemLeading}
                {@render itemLeading({ item, index })}
            {:else}
                <span class={classes.itemIndicator}>
                    {#if firstRadioGroup?.value === item.value}
                        <Icon name={checkedIcon} />
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
    {:else if isSubItem(item)}
        <ContextMenu.Sub open={item.open} onOpenChange={item.onOpenChange}>
            <ContextMenu.SubTrigger
                disabled={item.disabled}
                class={[classes.subTrigger, item.class]}
            >
                {#if itemLeading}
                    {@render itemLeading({ item, index })}
                {:else if item.icon}
                    <Icon name={item.icon} class={classes.itemLeadingIcon} />
                {/if}

                {#if itemLabel}
                    {@render itemLabel({ item, index })}
                {:else if item.label}
                    <span class={classes.itemLabel}>{item.label}</span>
                {/if}

                <Icon name={submenuIcon} class={classes.subTriggerIcon} />
            </ContextMenu.SubTrigger>

            <ContextMenu.SubContent
                {sideOffset}
                {alignOffset}
                {avoidCollisions}
                {collisionBoundary}
                {collisionPadding}
                class={classes.subContent}
            >
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
        bind:ref
        {sideOffset}
        {alignOffset}
        {avoidCollisions}
        {collisionBoundary}
        {collisionPadding}
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
                        {#if isSeparator(item)}
                            <ContextMenu.Separator class={classes.separator} />
                        {:else if isLabel(item)}
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

<ContextMenu.Root bind:open {onOpenChange}>
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
