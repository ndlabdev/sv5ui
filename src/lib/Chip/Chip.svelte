<script lang="ts" module>
    import type { ChipProps } from './chip.types.js'

    export type Props = ChipProps
</script>

<script lang="ts">
    import { chipVariants } from './chip.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('chip')

    let {
        as = 'div',
        ui,
        text,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        position = config.defaultVariants.position,
        inset = false,
        standalone = false,
        show = true,
        class: className,
        children,
        content,
        ...restProps
    }: Props = $props()

    const slots = $derived(chipVariants({ color, size, position, inset, standalone }))

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
    const baseClass = $derived(slots.base({ class: [config.slots.base, ui?.base] }))
</script>

<svelte:element this={as} class={rootClass} {...restProps}>
    {@render children?.()}

    {#if show}
        <span class={baseClass}>
            {#if content}
                {@render content()}
            {:else if text !== undefined}
                {text}
            {/if}
        </span>
    {/if}
</svelte:element>
