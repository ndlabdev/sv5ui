<script lang="ts" module>
    import type {
        SelectMenuProps,
        SelectMenuItem,
        SelectMenuItemType
    } from './select-menu.types.js'

    export type Props = SelectMenuProps
</script>

<script lang="ts">
    import { Combobox } from 'bits-ui'
    import { selectMenuVariants, selectMenuDefaults } from './select-menu.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import {
        fieldGroupVariantWithRoot,
        type FieldGroupVariantProps
    } from '../FieldGroup/field-group.variants.js'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import Input from '../Input/Input.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField.svelte.js'

    const config = getComponentConfig('selectMenu', selectMenuDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        open = $bindable(false),
        onOpenChange,
        items = [],
        placeholder,
        searchPlaceholder = 'Search...',
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
        filterFields = ['label', 'value'] as string[],
        ignoreFilter = false,
        emptyText = 'No results found.',
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        side = config.defaultVariants.side ?? 'bottom',
        sideOffset = 8,
        align = 'start',
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        onEscapeKeydown,
        onInteractOutside,
        forceMount,
        class: className,
        leadingSlot,
        trailingSlot,
        item: itemSlot,
        itemLeading,
        itemLabel: itemLabelSlot,
        itemTrailing,
        empty: emptySlot,
        content: contentSlot
    }: Props = $props()

    // ---- Form context ----
    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

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
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    // ---- Items lookup (O(1) via Map) ----
    const itemsMap = $derived(
        new Map(
            (items as SelectMenuItemType[])
                .filter((i): i is SelectMenuItem => !('type' in i))
                .map((i) => [i.value, i])
        )
    )

    const selectedItem = $derived(value ? itemsMap.get(value) : undefined)
    const displayLabel = $derived(selectedItem?.label ?? selectedItem?.value ?? '')

    // ---- Search & filtering ----
    let searchTerm = $state('')

    const filteredItems = $derived(
        ignoreFilter || !searchTerm.trim()
            ? items
            : items.filter((item) => {
                  if ('type' in item) return true
                  const query = searchTerm.toLowerCase()
                  return filterFields.some((field) => {
                      const val = (item as unknown as Record<string, unknown>)[field]
                      return typeof val === 'string' && val.toLowerCase().includes(query)
                  })
              })
    )

    const hasFilteredSelectItems = $derived(filteredItems.some((item) => !('type' in item)))

    // ---- Leading / trailing ----
    const displayAvatar = $derived(selectedItem?.avatar ?? avatar)
    const displayIcon = $derived(selectedItem?.icon ?? leadingIcon ?? icon)
    const isLeading = $derived(!!leadingSlot || !!displayAvatar || !!displayIcon)
    const leadingIconName = $derived(
        loading && isLeading ? loadingIcon : !displayAvatar ? displayIcon : undefined
    )

    // ---- Trailing icon ----
    const trailingIconName = $derived(loading && !isLeading ? loadingIcon : trailingIcon)
    const trailingIconClass = $derived(
        `${loading && !isLeading ? 'animate-spin' : 'transition-transform'} ${open && !loading ? 'rotate-180' : ''}`
    )

    // ---- Variant slots ----
    const variantSlots = $derived(
        selectMenuVariants({
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

    // ---- Trigger classes ----
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
    const leadingIconStyleClass = $derived(
        variantSlots.leadingIcon({ class: [config.slots.leadingIcon, ui?.leadingIcon] })
    )
    const leadingAvatarClass = $derived(
        variantSlots.leadingAvatar({ class: [config.slots.leadingAvatar, ui?.leadingAvatar] })
    )
    const leadingAvatarSizeClass = $derived(variantSlots.leadingAvatarSize() as AvatarSize)
    const trailingStyleClass = $derived(
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
    const inputClass = $derived(variantSlots.input({ class: [config.slots.input, ui?.input] }))
    const viewportClass = $derived(
        variantSlots.viewport({ class: [config.slots.viewport, ui?.viewport] })
    )
    const groupLabelClass = $derived(
        variantSlots.groupLabel({ class: [config.slots.groupLabel, ui?.groupLabel] })
    )
    const separatorClass = $derived(
        variantSlots.separator({ class: [config.slots.separator, ui?.separator] })
    )
    const emptyClass = $derived(variantSlots.empty({ class: [config.slots.empty, ui?.empty] }))

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
    function isSelectItem(item: SelectMenuItemType): item is SelectMenuItem {
        return !('type' in item)
    }

    function isSeparator(item: SelectMenuItemType): item is { type: 'separator' } {
        return 'type' in item && item.type === 'separator'
    }

    function isLabel(item: SelectMenuItemType): item is { type: 'label'; label: string } {
        return 'type' in item && item.type === 'label'
    }

    // ---- Event handlers (Nuxt UI v4 pattern) ----
    function onUpdateOpen(val: boolean) {
        if (!val) {
            searchTerm = ''
            emit.onBlur()
        } else {
            emit.onFocus()
        }
        onOpenChange?.(val)
    }
</script>

{#snippet renderItem(item: SelectMenuItem, index: number)}
    {@const isSelected = value === item.value}
    <Combobox.Item
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
    </Combobox.Item>
{/snippet}

{#snippet contentEl()}
    <Combobox.Content
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
        class={contentClass}
    >
        <Input
            autofocus
            placeholder={searchPlaceholder}
            value={searchTerm}
            oninput={(e) => (searchTerm = (e.currentTarget as HTMLInputElement).value)}
            variant="none"
            size={resolvedSize}
            class={inputClass}
        />

        {#if contentSlot}
            {@render contentSlot({ open, searchTerm })}
        {:else}
            <div class={viewportClass}>
                {#each filteredItems as selectItem, index ('value' in selectItem ? selectItem.value : `${selectItem.type}-${index}`)}
                    {#if isSeparator(selectItem)}
                        <div role="separator" class={separatorClass}></div>
                    {:else if isLabel(selectItem)}
                        <Combobox.Group>
                            <Combobox.GroupHeading class={groupLabelClass}
                                >{selectItem.label}</Combobox.GroupHeading
                            >
                        </Combobox.Group>
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

                {#if !hasFilteredSelectItems}
                    {#if emptySlot}
                        {@render emptySlot({ searchTerm })}
                    {:else}
                        <div class={emptyClass}>{emptyText}</div>
                    {/if}
                {/if}
            </div>
        {/if}
    </Combobox.Content>
{/snippet}

<Combobox.Root
    type="single"
    bind:open
    onOpenChange={onUpdateOpen}
    {disabled}
    {required}
    {value}
    onValueChange={(val) => {
        value = val
        emit.onChange()
    }}
    name={resolvedName}
>
    <div bind:this={ref} class={rootClass}>
        {#if leadingSlot}
            <span class={leadingClass}>
                {@render leadingSlot()}
            </span>
        {:else if isLeading && leadingIconName}
            <span class={leadingClass}>
                <Icon name={leadingIconName} class={leadingIconStyleClass} />
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

        <Combobox.Input
            class="pointer-events-none absolute inset-0 opacity-0"
            tabindex={-1}
            aria-hidden="true"
        />

        <Combobox.Trigger
            id={resolvedId}
            aria-describedby={ariaDescribedBy}
            aria-invalid={resolvedHighlight ? true : undefined}
            class={baseClass}
        >
            {#if value && displayLabel}
                <span class={valueClass}>{displayLabel}</span>
            {:else if placeholder}
                <span class={placeholderClass}>{placeholder}</span>
            {/if}
        </Combobox.Trigger>

        {#if trailingSlot}
            <span class={trailingStyleClass}>
                {@render trailingSlot()}
            </span>
        {:else}
            <span class={trailingStyleClass}>
                <Icon name={trailingIconName} class="{trailingIconBaseClass} {trailingIconClass}" />
            </span>
        {/if}
    </div>

    {#if portal}
        <Combobox.Portal>
            {@render contentEl()}
        </Combobox.Portal>
    {:else}
        {@render contentEl()}
    {/if}
</Combobox.Root>
