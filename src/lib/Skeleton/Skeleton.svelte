<script lang="ts" module>
    import type { SkeletonProps } from './skeleton.types.js'

    export type Props = SkeletonProps
</script>

<script lang="ts">
    import { skeletonVariants, skeletonDefaults } from './skeleton.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('skeleton', skeletonDefaults)

    let {
        as = 'div',
        ui,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const classes = $derived.by(() => {
        const slots = skeletonVariants()
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] })
        }
    })
</script>

<svelte:element this={as} class={classes.root} {...restProps}>
    {@render children?.()}
</svelte:element>
