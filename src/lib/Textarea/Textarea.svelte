<script lang="ts" module>
    import type { TextareaProps } from './textarea.types.js'

    export type Props = TextareaProps
</script>

<script lang="ts">
    import { textareaVariants, textareaDefaults } from './textarea.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import { getContext } from 'svelte'
    import {
        fieldGroupVariantWithRoot,
        type FieldGroupVariantProps
    } from '../FieldGroup/field-group.variants.js'
    import Icon from '../Icon/Icon.svelte'
    import type { FormFieldProps } from '../FormField/form-field.types.js'

    const config = getComponentConfig('textarea', textareaDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        ui,
        id,
        name,
        color = config.defaultVariants.color,
        variant = config.defaultVariants.variant,
        size,
        highlight,
        loading = false,
        loadingIcon = icons.loading,
        disabled = false,
        icon,
        leadingIcon,
        trailingIcon,
        trailing = false,
        leadingSlot,
        trailingSlot,
        autoresize = false,
        rows = 3,
        maxrows = 0,
        class: className,
        ...restProps
    }: Props = $props()

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

    const isLeading = $derived((!!icon && !trailing) || (loading && !trailing) || !!leadingIcon)
    const isTrailing = $derived((!!icon && trailing) || (loading && trailing) || !!trailingIcon)

    const leadingIconName = $derived(
        loading && isLeading
            ? loadingIcon
            : leadingIcon || (isLeading && !trailing ? icon : undefined)
    )
    const trailingIconName = $derived(
        loading && isTrailing ? loadingIcon : trailingIcon || (trailing ? icon : undefined)
    )

    const ariaDescribedBy = $derived.by(() => {
        if (!formFieldContext) return undefined
        const id = formFieldContext.ariaId
        if (hasError) return `${id}-error`
        return `${id}-description ${id}-help`
    })

    const classes = $derived.by(() => {
        const slots = textareaVariants({
            variant,
            color: resolvedColor,
            size: resolvedSize,
            leading: isLeading,
            trailing: isTrailing,
            loading,
            highlight: resolvedHighlight,
            autoresize
        })
        return {
            root: slots.root({
                class: [config.slots.root, fieldGroupClass?.root, className, ui?.root]
            }),
            base: slots.base({
                class: [config.slots.base, fieldGroupClass?.base, ui?.base]
            }),
            leading: slots.leading({ class: [config.slots.leading, ui?.leading] }),
            leadingIcon: slots.leadingIcon({
                class: [config.slots.leadingIcon, ui?.leadingIcon]
            }),
            trailing: slots.trailing({ class: [config.slots.trailing, ui?.trailing] }),
            trailingIcon: slots.trailingIcon({
                class: [config.slots.trailingIcon, ui?.trailingIcon]
            })
        }
    })

    let cachedMaxHeight = $state(0)

    $effect(() => {
        if (!autoresize || !ref || maxrows <= 0) {
            cachedMaxHeight = 0
            return
        }

        const style = window.getComputedStyle(ref)
        cachedMaxHeight =
            parseFloat(style.lineHeight) * maxrows +
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom)
    })

    $effect(() => {
        if (!autoresize || !ref) return

        void value

        ref.style.height = 'auto'
        const scrollHeight = ref.scrollHeight

        if (cachedMaxHeight > 0 && scrollHeight > cachedMaxHeight) {
            ref.style.height = `${cachedMaxHeight}px`
            ref.style.overflowY = 'auto'
        } else {
            ref.style.height = `${scrollHeight}px`
            ref.style.overflowY = 'hidden'
        }
    })
</script>

<div class={classes.root}>
    {#if leadingSlot}
        <span class={classes.leading}>
            {@render leadingSlot()}
        </span>
    {:else if isLeading && leadingIconName}
        <span class={classes.leading}>
            <Icon name={leadingIconName} class={classes.leadingIcon} />
        </span>
    {/if}

    <textarea
        bind:this={ref}
        bind:value
        {rows}
        id={resolvedId}
        name={resolvedName}
        disabled={disabled || loading}
        aria-describedby={ariaDescribedBy}
        aria-invalid={resolvedHighlight ? true : undefined}
        class={classes.base}
        {...restProps}
    ></textarea>

    {#if trailingSlot}
        <span class={classes.trailing}>
            {@render trailingSlot()}
        </span>
    {:else if isTrailing && trailingIconName}
        <span class={classes.trailing}>
            <Icon name={trailingIconName} class={classes.trailingIcon} />
        </span>
    {/if}
</div>
