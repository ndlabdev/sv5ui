<script lang="ts" module>
    import type { ContainerProps } from './container.types.js'

    export type Props = ContainerProps
</script>

<script lang="ts">
    import { containerVariants, containerDefaults } from './container.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('container', containerDefaults)
    const slots = containerVariants()

    let { as = 'div', ui, class: className, children, ...restProps }: Props = $props()

    const rootClass = $derived(slots.root({ class: [config.slots.root, className, ui?.root] }))
</script>

<svelte:element this={as} class={rootClass} {...restProps}>
    {@render children?.()}
</svelte:element>
