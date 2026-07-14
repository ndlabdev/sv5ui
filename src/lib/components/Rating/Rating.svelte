<script lang="ts" module>
    import type { RatingProps } from './rating.types.js'

    export type Props = RatingProps
</script>

<script lang="ts">
    import { RatingGroup, useId } from 'bits-ui'
    import { ratingVariants, ratingDefaults } from './rating.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'

    const config = getComponentConfig('rating', ratingDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(0),
        onValueChange,
        ui,
        id,
        name,
        color = config.defaultVariants.color,
        size,
        orientation = config.defaultVariants.orientation,
        icon = icons.star,
        activeIcon,
        fill = config.defaultVariants.fill,
        disabled = false,
        required = false,
        readonly = false,
        class: className,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedColor = $derived(hasError ? 'error' : color)
    const autoId = useId()
    const resolvedId = $derived(id ?? formFieldContext?.ariaId ?? autoId)
    const resolvedName = $derived(name ?? formFieldContext?.name)

    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const slots = $derived(
        ratingVariants({
            color: resolvedColor,
            size: resolvedSize,
            orientation,
            fill
        })
    )

    const resolvedActiveIcon = $derived(activeIcon ?? icon)

    const classes = $derived({
        root: slots.root({ class: [config.slots.root, className, ui?.root] }),
        item: slots.item({ class: [config.slots.item, ui?.item] }),
        icon: slots.icon({ class: [config.slots.icon, ui?.icon] }),
        iconActive: slots.iconActive({ class: [config.slots.iconActive, ui?.iconActive] }),
        partial: slots.partial({ class: [config.slots.partial, ui?.partial] })
    })
</script>

<RatingGroup.Root
    {...restProps}
    bind:ref
    bind:value
    onValueChange={(val) => {
        emit.onChange()
        onValueChange?.(val)
    }}
    onblur={() => emit.onBlur()}
    onfocus={() => emit.onFocus()}
    id={resolvedId}
    name={resolvedName}
    {orientation}
    {disabled}
    {required}
    {readonly}
    aria-describedby={ariaDescribedBy}
    aria-invalid={hasError ? true : undefined}
    class={classes.root}
>
    {#snippet children({ items })}
        {#each items as item (item.index)}
            <RatingGroup.Item index={item.index} class={classes.item}>
                {#snippet children({ state })}
                    {#if state === 'active'}
                        <Icon name={resolvedActiveIcon} class={classes.iconActive} />
                    {:else}
                        <Icon name={icon} class={classes.icon} />
                    {/if}
                    {#if state === 'partial'}
                        <span class={classes.partial}>
                            <Icon name={resolvedActiveIcon} class={classes.iconActive} />
                        </span>
                    {/if}
                {/snippet}
            </RatingGroup.Item>
        {/each}
    {/snippet}
</RatingGroup.Root>
