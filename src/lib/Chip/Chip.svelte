<script lang="ts" module>
    import type { ChipProps } from './chip.types.js'

    export type Props = ChipProps
</script>

<script lang="ts">
    import { chipVariants, chipDefaults } from './chip.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('chip', chipDefaults)

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

    const classes = $derived.by(() => {
        const slots = chipVariants({ color, size, position, inset, standalone })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            base: slots.base({ class: [config.slots.base, ui?.base] })
        }
    })
</script>

<svelte:element this={as} class={classes.root} {...restProps}>
    {@render children?.()}

    {#if show}
        <span class={classes.base}>
            {#if content}
                {@render content()}
            {:else if text !== undefined}
                {text}
            {/if}
        </span>
    {/if}
</svelte:element>
