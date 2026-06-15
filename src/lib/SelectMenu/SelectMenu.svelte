<script lang="ts" module>
    import type {
        SelectMenuProps,
        SelectMenuItem,
        SelectMenuItemType
    } from './select-menu.types.js'

    export type Props = SelectMenuProps

    const CREATE_ITEM_VALUE = '@@sv5ui/select-menu/create-item'
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
    import type { AvatarSize } from '../Avatar/avatar.types.js'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField/index.js'
    import { useDebounce } from '../hooks/useDebounce/index.js'

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
        multiple = false,
        separator = ', ',
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
        createItem = false,
        createItemLabel = (value: string) => `Create "${value}"`,
        createItemIcon,
        onCreate,
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
        selected: selectedSlot,
        empty: emptySlot,
        content: contentSlot,
        ...restProps
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

    // ---- Created items (internal state for createItem) ----
    let createdItems = $state<SelectMenuItem[]>([])

    const combinedItems = $derived.by(() => {
        const propValues = new Set(
            (items as SelectMenuItemType[])
                .filter((i): i is SelectMenuItem => !('type' in i))
                .map((i) => i.value)
        )
        const extras = createdItems.filter((c) => !propValues.has(c.value))
        return [...(items as SelectMenuItemType[]), ...extras]
    })

    // ---- Items lookup (O(1) via Map) ----
    const itemsMap = $derived(
        new Map(
            combinedItems
                .filter((i): i is SelectMenuItem => !('type' in i))
                .map((i) => [i.value, i])
        )
    )

    // ---- Selection (single + multiple) ----
    const selectedValues = $derived(
        multiple
            ? Array.isArray(value)
                ? (value as string[])
                : []
            : typeof value === 'string' && value !== ''
              ? [value]
              : []
    )
    const selectedItems = $derived(
        selectedValues
            .map((v) => itemsMap.get(v))
            .filter((i): i is SelectMenuItem => i !== undefined)
    )
    const hasSelection = $derived(selectedValues.length > 0)
    const singleSelectedItem = $derived(multiple ? undefined : selectedItems[0])
    const displayLabel = $derived(
        multiple
            ? selectedItems.map((i) => i.label ?? i.value).join(separator)
            : (singleSelectedItem?.label ?? singleSelectedItem?.value ?? '')
    )

    function removeValue(val: string) {
        if (!multiple) return
        value = selectedValues.filter((v) => v !== val)
        emit.onChange()
    }

    function clearSelection() {
        if (!multiple) return
        value = []
        emit.onChange()
    }

    // ---- Search & filtering ----
    let searchTerm = $state('')
    let debouncedSearch = $state('')
    const searchDebounce = useDebounce({ delay: 200 })

    function setSearch(term: string) {
        searchTerm = term
        searchDebounce.run(() => {
            debouncedSearch = term
        })
    }

    function resetSearch() {
        searchDebounce.cancel()
        searchTerm = ''
        debouncedSearch = ''
    }

    const filteredItems = $derived(
        ignoreFilter || !debouncedSearch.trim()
            ? combinedItems
            : combinedItems.filter((item) => {
                  if ('type' in item) return true
                  const query = debouncedSearch.toLowerCase()
                  return filterFields.some((field) => {
                      const val = (item as unknown as Record<string, unknown>)[field]
                      return typeof val === 'string' && val.toLowerCase().includes(query)
                  })
              })
    )

    const hasFilteredSelectItems = $derived(filteredItems.some((item) => !('type' in item)))

    // ---- Create item ----
    const trimmedSearch = $derived(searchTerm.trim())
    const exactMatchExists = $derived.by(() => {
        if (!trimmedSearch) return false
        const query = trimmedSearch.toLowerCase()
        for (const i of combinedItems) {
            if ('type' in i) continue
            if (i.value.toLowerCase() === query || (i.label ?? i.value).toLowerCase() === query) {
                return true
            }
        }
        return false
    })
    const showCreateItem = $derived.by(() => {
        if (!createItem) return false
        if (!trimmedSearch) return false
        const mode = createItem === true ? 'lazy' : createItem
        if (mode === 'always') return true
        return !exactMatchExists
    })
    const resolvedCreateLabel = $derived(
        typeof createItemLabel === 'function' ? createItemLabel(trimmedSearch) : createItemLabel
    )

    function findItemByCaseInsensitive(query: string): SelectMenuItem | undefined {
        const q = query.toLowerCase()
        for (const it of itemsMap.values()) {
            if (it.value.toLowerCase() === q || (it.label ?? it.value).toLowerCase() === q) {
                return it
            }
        }
        return undefined
    }

    function selectValue(val: string) {
        if (multiple) {
            if (!selectedValues.includes(val)) {
                value = [...selectedValues, val]
            }
        } else {
            value = val
        }
    }

    function handleCreate() {
        if (!showCreateItem) return
        const newValue = trimmedSearch
        if (!newValue) return

        const existing = findItemByCaseInsensitive(newValue)
        if (existing) {
            selectValue(existing.value)
        } else {
            createdItems = [...createdItems, { value: newValue, label: newValue }]
            selectValue(newValue)
            onCreate?.(newValue)
        }

        emit.onChange()
        resetSearch()
    }

    // ---- Leading / trailing ----
    const displayAvatar = $derived(multiple ? avatar : (singleSelectedItem?.avatar ?? avatar))
    const displayIcon = $derived(
        multiple ? (leadingIcon ?? icon) : (singleSelectedItem?.icon ?? leadingIcon ?? icon)
    )
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
    const createItemClass = $derived(
        variantSlots.createItem({ class: [config.slots.createItem, ui?.createItem] })
    )
    const createItemIconClass = $derived(
        variantSlots.createItemIcon({ class: [config.slots.createItemIcon, ui?.createItemIcon] })
    )
    const createItemLabelClass = $derived(
        variantSlots.createItemLabel({
            class: [config.slots.createItemLabel, ui?.createItemLabel]
        })
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
            resetSearch()
            emit.onBlur()
        } else {
            emit.onFocus()
        }
        onOpenChange?.(val)
    }
</script>

{#snippet renderItem(item: SelectMenuItem, index: number)}
    {@const isSelected = selectedValues.includes(item.value)}
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
        <!-- svelte-ignore a11y_autofocus -->
        <input
            type="text"
            autofocus
            placeholder={searchPlaceholder}
            value={searchTerm}
            oninput={(e) => setSearch((e.currentTarget as HTMLInputElement).value)}
            onkeydown={(e: KeyboardEvent) => {
                if (e.key !== 'Enter') return
                if (!showCreateItem) return
                e.preventDefault()
                handleCreate()
            }}
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
                                selected: selectedValues.includes(selectItem.value)
                            })}
                        {:else}
                            {@render renderItem(selectItem, index)}
                        {/if}
                    {/if}
                {/each}

                {#if !hasFilteredSelectItems && !showCreateItem}
                    {#if emptySlot}
                        {@render emptySlot({ searchTerm })}
                    {:else}
                        <div class={emptyClass}>{emptyText}</div>
                    {/if}
                {/if}

                {#if showCreateItem}
                    <Combobox.Item
                        value={CREATE_ITEM_VALUE}
                        label={resolvedCreateLabel}
                        {disabled}
                        class={createItemClass}
                    >
                        {#if createItemIcon}
                            <Icon name={createItemIcon} class={createItemIconClass} />
                        {/if}
                        <span class={createItemLabelClass}>{resolvedCreateLabel}</span>
                    </Combobox.Item>
                {/if}
            </div>
        {/if}
    </Combobox.Content>
{/snippet}

{#snippet rootChildren()}
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
            {...restProps}
            id={resolvedId}
            aria-describedby={ariaDescribedBy}
            aria-invalid={resolvedHighlight ? true : undefined}
            class={baseClass}
        >
            {#if selectedSlot && hasSelection}
                {@render selectedSlot({
                    items: selectedItems,
                    remove: removeValue,
                    clear: clearSelection
                })}
            {:else if hasSelection && displayLabel}
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
{/snippet}

{#if multiple}
    <Combobox.Root
        type="multiple"
        bind:open
        onOpenChange={onUpdateOpen}
        {disabled}
        {required}
        value={selectedValues}
        onValueChange={(val) => {
            if (Array.isArray(val) && val.includes(CREATE_ITEM_VALUE)) {
                handleCreate()
                return
            }
            value = val
            emit.onChange()
        }}
        name={resolvedName}
    >
        {@render rootChildren()}
    </Combobox.Root>
{:else}
    <Combobox.Root
        type="single"
        bind:open
        onOpenChange={onUpdateOpen}
        {disabled}
        {required}
        value={selectedValues[0] ?? ''}
        onValueChange={(val) => {
            if (val === CREATE_ITEM_VALUE) {
                handleCreate()
                return
            }
            value = val
            emit.onChange()
        }}
        name={resolvedName}
    >
        {@render rootChildren()}
    </Combobox.Root>
{/if}
