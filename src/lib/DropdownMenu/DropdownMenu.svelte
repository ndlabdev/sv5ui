<script lang="ts" module>
    import type {
        DropdownMenuProps,
        DropdownMenuItem,
        DropdownMenuItemAction,
        DropdownMenuItemCheckbox,
        DropdownMenuItemRadio,
        DropdownMenuItemSub
    } from './dropdown-menu.types.js'

    export type Props = DropdownMenuProps
</script>

<script lang="ts">
    import { DropdownMenu } from 'bits-ui'
    import { dropdownMenuVariants, dropdownMenuDefaults } from './dropdown-menu.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Kbd from '../Kbd/Kbd.svelte'

    const config = getComponentConfig('dropdownMenu', dropdownMenuDefaults)

    let {
        open = $bindable(false),
        onOpenChange,
        items = [],
        radioGroups = [],
        checkedIcon = iconsDefaults.check,
        submenuIcon = iconsDefaults.chevronRight,
        side = config.defaultVariants.side ?? 'bottom',
        sideOffset = 4,
        align = 'start',
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        sticky = 'partial',
        hideWhenDetached = false,
        onEscapeKeydown,
        onInteractOutside,
        onCloseAutoFocus,
        forceMount,
        loop = true,
        arrow = false,
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

    // Pre-compute booleans
    const showArrow = $derived(!!arrow)
    const hasRadioItems = $derived(items.some((i) => i.type === 'radio'))
    const firstRadioGroup = $derived(radioGroups[0])

    // Compute variant classes
    const variantSlots = $derived(dropdownMenuVariants({ side, transition, size }))
    const classes = $derived({
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        group: variantSlots.group({ class: [config.slots.group, ui?.group] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        label: variantSlots.label({ class: [config.slots.label, ui?.label] }),
        item: variantSlots.item({ class: [config.slots.item, ui?.item] }),
        itemIcon: variantSlots.itemIcon({ class: [config.slots.itemIcon, ui?.itemIcon] }),
        itemLabel: variantSlots.itemLabel({ class: [config.slots.itemLabel, ui?.itemLabel] }),
        itemKbd: variantSlots.itemKbd({ class: [config.slots.itemKbd, ui?.itemKbd] }),
        subTrigger: variantSlots.subTrigger({ class: [config.slots.subTrigger, ui?.subTrigger] }),
        subTriggerIcon: variantSlots.subTriggerIcon({
            class: [config.slots.subTriggerIcon, ui?.subTriggerIcon]
        }),
        subContent: variantSlots.subContent({ class: [config.slots.subContent, ui?.subContent] }),
        checkboxIndicator: variantSlots.checkboxIndicator({
            class: [config.slots.checkboxIndicator, ui?.checkboxIndicator]
        }),
        radioIndicator: variantSlots.radioIndicator({
            class: [config.slots.radioIndicator, ui?.radioIndicator]
        })
    })

    // Arrow props
    const arrowProps = $derived.by(() => {
        if (typeof arrow === 'object') return { width: 12, height: 6, ...arrow }
        return { width: 12, height: 6 }
    })

    function close() {
        open = false
    }

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }

    // Get classes for action items with color variants
    function getItemClasses(item: DropdownMenuItemAction) {
        const colorVariant = dropdownMenuVariants({ size, color: item.color ?? 'default' })
        return {
            item: colorVariant.item({ class: [config.slots.item, ui?.item, item.class] }),
            itemIcon: colorVariant.itemIcon({ class: [config.slots.itemIcon, ui?.itemIcon] })
        }
    }

    // Type guards
    function isActionItem(item: DropdownMenuItem): item is DropdownMenuItemAction {
        return !item.type || item.type === 'item'
    }

    function isCheckboxItem(item: DropdownMenuItem): item is DropdownMenuItemCheckbox {
        return item.type === 'checkbox'
    }

    function isRadioItem(item: DropdownMenuItem): item is DropdownMenuItemRadio {
        return item.type === 'radio'
    }

    function isSubItem(item: DropdownMenuItem): item is DropdownMenuItemSub {
        return item.type === 'sub'
    }

    function isSeparator(item: DropdownMenuItem): item is { type: 'separator' } {
        return item.type === 'separator'
    }

    function isLabel(item: DropdownMenuItem): item is { type: 'label'; label: string } {
        return item.type === 'label'
    }
</script>

{#snippet renderKbds(kbds: DropdownMenuItemAction['kbds'])}
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

{#snippet renderItem(item: DropdownMenuItem, index: number)}
    {#if isSeparator(item)}
        <DropdownMenu.Separator class={classes.separator} />
    {:else if isLabel(item)}
        <DropdownMenu.GroupHeading class={classes.label}>{item.label}</DropdownMenu.GroupHeading>
    {:else if isActionItem(item)}
        {@const cls = getItemClasses(item)}
        <DropdownMenu.Item
            disabled={item.disabled}
            closeOnSelect={item.closeOnSelect}
            onSelect={item.onSelect}
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
                {@render renderKbds(item.kbds)}
            {/if}
        </DropdownMenu.Item>
    {:else if isCheckboxItem(item)}
        <DropdownMenu.CheckboxItem
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
        </DropdownMenu.CheckboxItem>
    {:else if isRadioItem(item)}
        <DropdownMenu.RadioItem
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
        </DropdownMenu.RadioItem>
    {:else if isSubItem(item)}
        <DropdownMenu.Sub open={item.open} onOpenChange={item.onOpenChange}>
            <DropdownMenu.SubTrigger
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
            </DropdownMenu.SubTrigger>

            <DropdownMenu.SubContent
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
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    {/if}
{/snippet}

{#snippet renderItems(menuItems: DropdownMenuItem[])}
    {#if hasRadioItems && firstRadioGroup}
        <DropdownMenu.RadioGroup
            value={firstRadioGroup.value}
            onValueChange={firstRadioGroup.onValueChange}
        >
            {#each menuItems as item, index (index)}
                {@render renderItem(item, index)}
            {/each}
        </DropdownMenu.RadioGroup>
    {:else}
        {#each menuItems as item, index (index)}
            {@render renderItem(item, index)}
        {/each}
    {/if}
{/snippet}

{#snippet dropdownContentEl()}
    <DropdownMenu.Content
        {side}
        {sideOffset}
        {align}
        {alignOffset}
        {avoidCollisions}
        {collisionBoundary}
        {collisionPadding}
        {sticky}
        {hideWhenDetached}
        {onEscapeKeydown}
        {onInteractOutside}
        {onCloseAutoFocus}
        {forceMount}
        {loop}
        class={[classes.content, !children ? className : undefined]}
    >
        {#if contentSlot}
            {@render contentSlot({ open, close })}
        {:else}
            {#if header}
                {@render header({ close })}
            {/if}

            <DropdownMenu.Group class={classes.group}>
                {#if itemSlot}
                    {#each items as item, index (index)}
                        {#if isSeparator(item)}
                            <DropdownMenu.Separator class={classes.separator} />
                        {:else if isLabel(item)}
                            <DropdownMenu.GroupHeading class={classes.label}
                                >{item.label}</DropdownMenu.GroupHeading
                            >
                        {:else}
                            {@render itemSlot({ item, index })}
                        {/if}
                    {/each}
                {:else}
                    {@render renderItems(items)}
                {/if}
            </DropdownMenu.Group>

            {#if footer}
                {@render footer({ close })}
            {/if}
        {/if}

        {#if showArrow}
            <DropdownMenu.Arrow width={arrowProps.width} height={arrowProps.height} />
        {/if}
    </DropdownMenu.Content>
{/snippet}

<DropdownMenu.Root bind:open onOpenChange={handleOpenChange}>
    {#if children}
        <DropdownMenu.Trigger>
            {#snippet child({ props })}
                <span {...props} class={className as string}>
                    {@render children({ open })}
                </span>
            {/snippet}
        </DropdownMenu.Trigger>
    {/if}

    {#if portal}
        <DropdownMenu.Portal>
            {@render dropdownContentEl()}
        </DropdownMenu.Portal>
    {:else}
        {@render dropdownContentEl()}
    {/if}
</DropdownMenu.Root>
