<script lang="ts" module>
    import type { MainProps } from './main.types.js'

    export type Props = MainProps
</script>

<script lang="ts">
    import { mainVariants, mainDefaults } from './main.variants.js'
    import { getComponentConfig } from '../../config.js'

    const config = getComponentConfig('main', mainDefaults)

    let {
        ref = $bindable(null),
        as = 'main',
        ui,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const slots = mainVariants()

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
</script>

<svelte:element this={as} bind:this={ref} class={rootClass} {...restProps}>
    {@render children?.()}
</svelte:element>
