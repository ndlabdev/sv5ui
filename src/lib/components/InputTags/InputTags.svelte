<script lang="ts" module>
    import type { InputTagsProps } from './input-tags.types.js'

    export type Props = InputTagsProps
</script>

<script lang="ts">
    import { setContext } from 'svelte'
    import { inputTagsVariants, inputTagsDefaults } from './input-tags.variants.js'
    import { inputVariants } from '../Input/input.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Badge from '../Badge/Badge.svelte'
    import Icon from '../Icon/Icon.svelte'
    import Avatar from '../Avatar/Avatar.svelte'
    import type { AvatarSize } from '../Avatar/avatar.types.js'
    import type { BadgeProps } from '../Badge/badge.types.js'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'

    const config = getComponentConfig('inputTags', inputTagsDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    setContext('fieldGroup', undefined)

    let {
        ref = $bindable(null),
        value = $bindable([]),
        onValueChange,
        max,
        maxLength,
        delimiter = ',',
        addOnPaste = true,
        addOnTab = false,
        addOnBlur = false,
        allowDuplicates = false,
        deleteIcon = icons.close,
        deleteAriaLabel = 'Remove',
        tag,
        tagSlot,
        icon,
        leadingIcon,
        trailingIcon,
        trailing = false,
        avatar,
        leadingSlot,
        trailingSlot,
        id,
        name,
        required = false,
        disabled = false,
        readonly = false,
        highlight,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size,
        ui,
        class: className,
        onblur,
        oninput,
        onchange,
        onfocus,
        onkeydown,
        onpaste,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    let inputValue = $state('')
    let highlightedIndex = $state<number | null>(null)

    function sanitizeTag(raw: string): string | null {
        const text = raw.trim()
        if (!text) return null
        if (maxLength !== undefined && text.length > maxLength) return null
        return text
    }

    function canAppend(next: string[], text: string | null): text is string {
        if (!text) return false
        if (max !== undefined && next.length >= max) return false
        return allowDuplicates || !next.includes(text)
    }

    function addTags(candidates: string[]): boolean {
        if (disabled || readonly) return false
        const next = [...value]
        for (const raw of candidates) {
            const text = sanitizeTag(raw)
            if (canAppend(next, text)) next.push(text)
        }
        if (next.length === value.length) return false
        value = next
        onValueChange?.(value)
        emit.onChange()
        return true
    }

    function commitInput() {
        if (addTags([inputValue])) inputValue = ''
    }

    function removeTag(index: number) {
        if (disabled || readonly) return
        if (index < 0 || index >= value.length) return
        value = value.filter((_, i) => i !== index)
        highlightedIndex = null
        onValueChange?.(value)
        emit.onChange()
    }

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        highlightedIndex = null
        if (delimiter && inputValue.includes(delimiter)) {
            const parts = inputValue.split(delimiter)
            const rest = parts.pop() ?? ''
            addTags(parts)
            inputValue = rest
        }
        emit.onInput()
        oninput?.(event)
    }

    function isCaretAtStart(input: HTMLInputElement): boolean {
        return input.selectionStart === 0 && input.selectionEnd === 0
    }

    type TagKeyEvent = KeyboardEvent & { currentTarget: HTMLInputElement }

    const keydownHandlers: Record<string, (event: TagKeyEvent) => void> = {
        Enter(event) {
            if (event.isComposing || inputValue === '') return
            event.preventDefault()
            commitInput()
        },
        Tab(event) {
            if (!addOnTab || inputValue === '') return
            event.preventDefault()
            commitInput()
        },
        Backspace(event) {
            if (inputValue !== '' || value.length === 0) return
            event.preventDefault()
            if (highlightedIndex === null) {
                highlightedIndex = value.length - 1
                return
            }
            const index = highlightedIndex
            removeTag(index)
            if (index > 0) highlightedIndex = index - 1
        },
        Delete(event) {
            if (inputValue !== '' || highlightedIndex === null) return
            event.preventDefault()
            const index = highlightedIndex
            removeTag(index)
            if (index < value.length) highlightedIndex = index
        },
        ArrowLeft(event) {
            if (value.length === 0 || !isCaretAtStart(event.currentTarget)) return
            event.preventDefault()
            highlightedIndex =
                highlightedIndex === null ? value.length - 1 : Math.max(highlightedIndex - 1, 0)
        },
        ArrowRight(event) {
            if (highlightedIndex === null) return
            event.preventDefault()
            highlightedIndex = highlightedIndex >= value.length - 1 ? null : highlightedIndex + 1
        },
        Escape() {
            highlightedIndex = null
        }
    }

    function handleKeydown(event: TagKeyEvent) {
        if (!disabled && !readonly && Object.hasOwn(keydownHandlers, event.key)) {
            keydownHandlers[event.key](event)
        }
        onkeydown?.(event)
    }

    function handlePaste(event: ClipboardEvent & { currentTarget: HTMLInputElement }) {
        if (addOnPaste && !disabled && !readonly) {
            event.preventDefault()
            const text = event.clipboardData?.getData('text') ?? ''
            const parts = text
                .split(/\r?\n/)
                .flatMap((line) => (delimiter ? line.split(delimiter) : [line]))
            addTags(parts)
        }
        onpaste?.(event)
    }

    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        highlightedIndex = null
        if (addOnBlur) commitInput()
        emit.onBlur()
        onblur?.(event)
    }

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        emit.onFocus()
        onfocus?.(event)
    }

    function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
        emit.onChange()
        onchange?.(event)
    }

    function handleRootPointerDown(event: PointerEvent) {
        if (disabled) return
        const target = event.target as HTMLElement
        if (target === ref || target.closest('button')) return
        event.preventDefault()
        ref?.focus()
    }

    function handleDeleteClick(index: number) {
        removeTag(index)
        ref?.focus()
    }

    const canRemove = $derived(!disabled && !readonly)

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedHighlight = $derived(highlight ?? hasError)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const isLeading = $derived((!!icon && !trailing) || !!leadingIcon || !!avatar)
    const isTrailing = $derived((!!icon && trailing) || !!trailingIcon)
    const leadingIconName = $derived(leadingIcon || (!!icon && !trailing ? icon : undefined))
    const trailingIconName = $derived(trailingIcon || (!!icon && trailing ? icon : undefined))

    const inputSlotFns = $derived(
        inputVariants({
            variant,
            color: resolvedColor,
            size: resolvedSize,
            highlight: resolvedHighlight,
            leading: isLeading,
            trailing: isTrailing
        })
    )
    const variantSlots = $derived(
        inputTagsVariants({ variant, color: resolvedColor, size: resolvedSize })
    )
    const classes = $derived({
        root: variantSlots.root({
            class: [
                inputSlotFns.root(),
                inputSlotFns.base(),
                config.slots.root,
                className,
                ui?.root
            ]
        }),
        base: variantSlots.base({ class: [config.slots.base, ui?.base] }),
        tag: variantSlots.tag({ class: [config.slots.tag, ui?.tag] }),
        tagDelete: variantSlots.tagDelete({ class: [config.slots.tagDelete, ui?.tagDelete] }),
        tagDeleteIcon: variantSlots.tagDeleteIcon({
            class: [config.slots.tagDeleteIcon, ui?.tagDeleteIcon]
        }),
        tagSize: variantSlots.tagSize() as NonNullable<BadgeProps['size']>,
        leading: inputSlotFns.leading({ class: [ui?.leading] }),
        leadingIcon: inputSlotFns.leadingIcon({ class: [ui?.leadingIcon] }),
        leadingAvatar: inputSlotFns.leadingAvatar({ class: [ui?.leadingAvatar] }),
        leadingAvatarSize: inputSlotFns.leadingAvatarSize() as AvatarSize,
        trailing: inputSlotFns.trailing({ class: [ui?.trailing] }),
        trailingIcon: inputSlotFns.trailingIcon({ class: [ui?.trailingIcon] })
    })
</script>

<div class={classes.root} onpointerdown={handleRootPointerDown}>
    {#if leadingSlot}
        <span class={classes.leading}>
            {@render leadingSlot()}
        </span>
    {:else if avatar}
        <span class={classes.leading}>
            <Avatar {...avatar} size={classes.leadingAvatarSize} class={classes.leadingAvatar} />
        </span>
    {:else if leadingIconName}
        <span class={classes.leading}>
            <Icon name={leadingIconName} class={classes.leadingIcon} />
        </span>
    {/if}

    {#each value as tagValue, index (index)}
        {#snippet tagDelete()}
            <button
                type="button"
                tabindex={-1}
                aria-label={`${deleteAriaLabel} ${tagValue}`}
                class={classes.tagDelete}
                onpointerdown={(event) => event.preventDefault()}
                onclick={() => handleDeleteClick(index)}
            >
                <Icon name={deleteIcon} class={classes.tagDeleteIcon} />
            </button>
        {/snippet}
        <Badge
            color="surface"
            size={classes.tagSize}
            label={tagSlot ? undefined : tagValue}
            {...tag}
            variant={highlightedIndex === index ? 'solid' : (tag?.variant ?? 'soft')}
            class={[classes.tag, tag?.class]}
            data-tag={tagValue}
            data-highlighted={highlightedIndex === index ? true : undefined}
            trailing={canRemove ? tagDelete : undefined}
        >
            {#if tagSlot}
                {@render tagSlot({ tag: tagValue, index })}
            {/if}
        </Badge>
    {/each}

    <input
        {...restProps}
        bind:this={ref}
        bind:value={inputValue}
        type="text"
        id={resolvedId}
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        maxlength={maxLength}
        required={required && value.length === 0}
        {disabled}
        {readonly}
        aria-describedby={ariaDescribedBy}
        aria-invalid={resolvedHighlight ? true : undefined}
        class={classes.base}
        oninput={handleInput}
        onchange={handleChange}
        onblur={handleBlur}
        onfocus={handleFocus}
        onkeydown={handleKeydown}
        onpaste={handlePaste}
    />

    {#if trailingSlot}
        <span class={classes.trailing}>
            {@render trailingSlot()}
        </span>
    {:else if trailingIconName}
        <span class={classes.trailing}>
            <Icon name={trailingIconName} class={classes.trailingIcon} />
        </span>
    {/if}

    {#if resolvedName}
        {#each value as tagValue, index (index)}
            <input type="hidden" name={resolvedName} value={tagValue} {disabled} />
        {/each}
    {/if}
</div>
