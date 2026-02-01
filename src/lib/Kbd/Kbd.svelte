<script lang="ts" module>
    import type { KbdProps } from './kbd.types.js'
    import { resolveKey } from './useKbd.svelte.js'

    export type Props = KbdProps
</script>

<script lang="ts">
    import { kbdVariants, kbdDefaults } from './kbd.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('kbd', kbdDefaults)

    let {
        as = 'kbd',
        value,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        variant = config.defaultVariants.variant,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const displayValue = $derived(resolveKey(value))
    const kbdClass = $derived(kbdVariants({ color, size, variant, class: className }))
</script>

<svelte:element this={as} class={kbdClass} {...restProps}>
    {#if children}
        {@render children()}
    {:else if displayValue}
        {displayValue}
    {/if}
</svelte:element>
