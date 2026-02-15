<script lang="ts" module>
    import type { FieldGroupProps } from './field-group.types.js'

    export type Props = FieldGroupProps
</script>

<script lang="ts">
    import { fieldGroupVariants, fieldGroupDefaults } from './field-group.variants.js'
    import { getComponentConfig } from '../config.js'
    import { setContext } from 'svelte'

    const config = getComponentConfig('fieldGroup', fieldGroupDefaults)

    let {
        as = 'div',
        ui,
        size = config.defaultVariants.size ?? 'md',
        orientation = config.defaultVariants.orientation ?? 'horizontal',
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = fieldGroupVariants({ size, orientation })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] })
        }
    })

    setContext<{
        orientation: NonNullable<Props['orientation']>
        size: NonNullable<Props['size']>
    }>('fieldGroup', {
        get orientation() {
            return orientation
        },
        get size() {
            return size
        }
    })
</script>

<svelte:element this={as} class={classes.root} data-orientation={orientation} {...restProps}>
    {#if children}
        {@render children()}
    {/if}
</svelte:element>
