<script lang="ts" module>
    import type { SelectProps, SelectItem, SelectItemType } from './select.types.js'

    export type Props = SelectProps
</script>

<script lang="ts">
    import { Select } from 'bits-ui'
    import { selectVariants, selectDefaults } from './select.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import {
        fieldGroupVariantWithRoot,
        type FieldGroupVariantProps
    } from '../FieldGroup/field-group.variants.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'
    import type { FormFieldProps } from '../FormField/form-field.types.js'

    const config = getComponentConfig('select', selectDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        value = $bindable(),
        open = $bindable(false),
        onOpenChange,
        items = [],
        placeholder,
        name,
        required = false,
        disabled = false,
        ui,
        id,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size,
        highlight,
        loading = false,
        loadingIcon = icons.loading,
        icon,
        leadingIcon,
        trailingIcon = icons.chevronDown,
        selectedIcon = icons.check,
        avatar,
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        side = config.defaultVariants.side ?? 'bottom',
        sideOffset = 4,
        align = 'start',
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        onEscapeKeydown,
        onInteractOutside,
        forceMount,
        loop = true,
        class: className,
        leadingSlot,
        trailingSlot,
        item: itemSlot,
        itemLeading,
        itemLabel: itemLabelSlot,
        itemTrailing,
        content: contentSlot
    }: Props = $props()

    // ---- Form context ----
    const formFieldContext = getContext<
        | {
              name?: string
              size: NonNullable<FormFieldProps['size']>
              error?: string | boolean
              ariaId: string
          }
        | undefined
    >('formField')

    const fieldGroupContext = getContext<
        | {
              orientation: NonNullable<FieldGroupVariantProps['orientation']>
              size: NonNullable<FieldGroupVariantProps['size']>
          }
        | undefined
    >('fieldGroup')

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedSize = $derived(
        size ?? formFieldContext?.size ?? fieldGroupContext?.size ?? config.defaultVariants.size
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedHighlight = $derived(highlight ?? hasError)
    const fieldGroupClass = $derived(
        fieldGroupContext
            ? fieldGroupVariantWithRoot.fieldGroup[fieldGroupContext.orientation ?? 'horizontal']
            : undefined
    )
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)

    // ---- ARIA ----
    const ariaDescribedBy = $derived.by(() => {
        if (!formFieldContext) return undefined
        const fid = formFieldContext.ariaId
        return hasError ? `${fid}-error` : `${fid}-description ${fid}-help`
    })

    // ---- Items lookup (O(1) via Map) ----
    const itemsMap = $derived(
        new Map(
            (items as SelectItemType[])
                .filter((i): i is SelectItem => !('type' in i))
                .map((i) => [i.value, i])
        )
    )

    const selectedItem = $derived(value ? itemsMap.get(value) : undefined)
    const displayLabel = $derived(selectedItem?.label ?? selectedItem?.value ?? '')

    // ---- Leading / trailing ----
    const displayAvatar = $derived(selectedItem?.avatar ?? avatar)
    const displayIcon = $derived(selectedItem?.icon ?? leadingIcon ?? icon)
    const isLeading = $derived(!!leadingSlot || !!displayAvatar || !!displayIcon)
    const leadingIconName = $derived(
        loading && isLeading ? loadingIcon : !displayAvatar ? displayIcon : undefined
    )

    // ---- bits-ui items for typeahead ----
    const bitsItems = $derived(
        [...itemsMap.values()].map((i) => ({
            value: i.value,
            label: i.label ?? i.value,
            disabled: i.disabled
        }))
    )

    // ---- Trailing icon ----
    const trailingIconName = $derived(loading && !isLeading ? loadingIcon : trailingIcon)
    const trailingIconClass = $derived(
        `${loading && !isLeading ? 'animate-spin' : 'transition-transform'} ${open && !loading ? 'rotate-180' : ''}`
    )

    // ---- Variant slots ----
    const variantSlots = $derived(
        selectVariants({
            variant,
            color: resolvedColor,
            size: resolvedSize,
            leading: isLeading,
            trailing: true,
            loading,
            highlight: resolvedHighlight,
            side,
            transition
        })
    )

    // ---- Trigger classes (root, base, leading, trailing, value, placeholder) ----
    const rootClass = $derived(
        variantSlots.root({
            class: [config.slots.root, fieldGroupClass?.root, className, ui?.root]
        })
    )
    const baseClass = $derived(
        variantSlots.base({
            class: [config.slots.base, fieldGroupClass?.base, ui?.base]
        })
    )
    const leadingClass = $derived(
        variantSlots.leading({ class: [config.slots.leading, ui?.leading] })
    )
    const leadingIconClass = $derived(
        variantSlots.leadingIcon({ class: [config.slots.leadingIcon, ui?.leadingIcon] })
    )
    const leadingAvatarClass = $derived(
        variantSlots.leadingAvatar({ class: [config.slots.leadingAvatar, ui?.leadingAvatar] })
    )
    const leadingAvatarSizeClass = $derived(variantSlots.leadingAvatarSize() as AvatarSize)
    const trailingClass = $derived(
        variantSlots.trailing({ class: [config.slots.trailing, ui?.trailing] })
    )
    const trailingIconBaseClass = $derived(
        variantSlots.trailingIcon({ class: [config.slots.trailingIcon, ui?.trailingIcon] })
    )
    const valueClass = $derived(variantSlots.value({ class: [config.slots.value, ui?.value] }))
    const placeholderClass = $derived(
        variantSlots.placeholder({ class: [config.slots.placeholder, ui?.placeholder] })
    )

    // ---- Content classes ----
    const contentClass = $derived(
        variantSlots.content({ class: [config.slots.content, ui?.content] })
    )
    const viewportClass = $derived(
        variantSlots.viewport({ class: [config.slots.viewport, ui?.viewport] })
    )
    const groupLabelClass = $derived(
        variantSlots.groupLabel({ class: [config.slots.groupLabel, ui?.groupLabel] })
    )
    const separatorClass = $derived(
        variantSlots.separator({ class: [config.slots.separator, ui?.separator] })
    )

    // ---- Item classes ----
    const itemClass = $derived(variantSlots.item({ class: [config.slots.item, ui?.item] }))
    const itemIconClass = $derived(
        variantSlots.itemIcon({ class: [config.slots.itemIcon, ui?.itemIcon] })
    )
    const itemAvatarClass = $derived(
        variantSlots.itemAvatar({ class: [config.slots.itemAvatar, ui?.itemAvatar] })
    )
    const itemAvatarSizeClass = $derived(variantSlots.itemAvatarSize() as AvatarSize)
    const itemLabelClass = $derived(
        variantSlots.itemLabel({ class: [config.slots.itemLabel, ui?.itemLabel] })
    )
    const itemDescriptionClass = $derived(
        variantSlots.itemDescription({
            class: [config.slots.itemDescription, ui?.itemDescription]
        })
    )
    const itemIndicatorClass = $derived(
        variantSlots.itemIndicator({ class: [config.slots.itemIndicator, ui?.itemIndicator] })
    )

    // ---- Type guards ----
    function isSelectItem(item: SelectItemType): item is SelectItem {
        return !('type' in item)
    }

    function isSeparator(item: SelectItemType): item is { type: 'separator' } {
        return 'type' in item && item.type === 'separator'
    }

    function isLabel(item: SelectItemType): item is { type: 'label'; label: string } {
        return 'type' in item && item.type === 'label'
    }
</script>

{#snippet renderItem(item: SelectItem, index: number)}
    {@const isSelected = value === item.value}
    <Select.Item
        value={item.value}
        label={item.label ?? item.value}
        disabled={item.disabled}
        class={itemClass}
    >
        {#if itemLeading}
            {@render itemLeading({ item, index, selected: isSelected })}
        {:else if item.avatar}
            <Avatar {...item.avatar} size={itemAvatarSizeClass} class={itemAvatarClass} />
        {:else if item.icon}
            <Icon name={item.icon} class={itemIconClass} />
        {/if}

        {#if itemLabelSlot}
            {@render itemLabelSlot({ item, index, selected: isSelected })}
        {:else}
            <div class={item.description ? 'flex flex-col' : undefined}>
                <span class={itemLabelClass}>{item.label ?? item.value}</span>
                {#if item.description}
                    <span class={itemDescriptionClass}>{item.description}</span>
                {/if}
            </div>
        {/if}

        {#if itemTrailing}
            {@render itemTrailing({ item, index, selected: isSelected })}
        {:else if isSelected}
            <Icon name={selectedIcon} class={itemIndicatorClass} />
        {/if}
    </Select.Item>
{/snippet}

{#snippet selectContentEl()}
    <Select.Content
        {side}
        {sideOffset}
        {align}
        {alignOffset}
        {avoidCollisions}
        {collisionBoundary}
        {collisionPadding}
        {onEscapeKeydown}
        {onInteractOutside}
        {forceMount}
        {loop}
        class={contentClass}
    >
        <Select.Viewport class={viewportClass}>
            {#if contentSlot}
                {@render contentSlot({ open })}
            {:else}
                {#each items as selectItem, index (index)}
                    {#if isSeparator(selectItem)}
                        <div role="separator" class={separatorClass}></div>
                    {:else if isLabel(selectItem)}
                        <Select.Group>
                            <Select.GroupHeading class={groupLabelClass}
                                >{selectItem.label}</Select.GroupHeading
                            >
                        </Select.Group>
                    {:else if isSelectItem(selectItem)}
                        {#if itemSlot}
                            {@render itemSlot({
                                item: selectItem,
                                index,
                                selected: value === selectItem.value
                            })}
                        {:else}
                            {@render renderItem(selectItem, index)}
                        {/if}
                    {/if}
                {/each}
            {/if}
        </Select.Viewport>
    </Select.Content>
{/snippet}

<Select.Root
    type="single"
    bind:open
    onOpenChange={(val) => onOpenChange?.(val)}
    {disabled}
    {required}
    items={bitsItems}
    {value}
    onValueChange={(val) => (value = val)}
>
    <div class={rootClass}>
        {#if leadingSlot}
            <span class={leadingClass}>
                {@render leadingSlot()}
            </span>
        {:else if isLeading && leadingIconName}
            <span class={leadingClass}>
                <Icon name={leadingIconName} class={leadingIconClass} />
            </span>
        {:else if displayAvatar}
            <span class={leadingClass}>
                <Avatar
                    {...displayAvatar}
                    size={leadingAvatarSizeClass}
                    class={leadingAvatarClass}
                />
            </span>
        {/if}

        <Select.Trigger
            id={resolvedId}
            name={resolvedName}
            aria-describedby={ariaDescribedBy}
            aria-invalid={resolvedHighlight ? true : undefined}
            class={baseClass}
        >
            {#if value && displayLabel}
                <span class={valueClass}>{displayLabel}</span>
            {:else if placeholder}
                <span class={placeholderClass}>{placeholder}</span>
            {/if}
        </Select.Trigger>

        {#if trailingSlot}
            <span class={trailingClass}>
                {@render trailingSlot()}
            </span>
        {:else}
            <span class={trailingClass}>
                <Icon name={trailingIconName} class="{trailingIconBaseClass} {trailingIconClass}" />
            </span>
        {/if}
    </div>

    {#if portal}
        <Select.Portal>
            {@render selectContentEl()}
        </Select.Portal>
    {:else}
        {@render selectContentEl()}
    {/if}
</Select.Root>
