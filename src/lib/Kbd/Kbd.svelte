<script lang="ts" module>
    import type { KbdProps } from './kbd.types.js'
    import { resolveKey } from './useKbd.svelte.js'

    export type Props = KbdProps
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { kbdVariants, kbdDefaults } from './kbd.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('kbd', kbdDefaults)

    let {
        ref = $bindable(null),
        as = 'kbd',
        value,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        variant = config.defaultVariants.variant,
        ui,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    let mounted = $state(false)
    onMount(() => (mounted = true))

    const displayValue = $derived(resolveKey(value, mounted))
    const kbdClass = $derived(
        kbdVariants({ color, size, variant }).base({
            class: [config.slots.base, className, ui?.base]
        })
    )
</script>

<svelte:element this={as} bind:this={ref} class={kbdClass} {...restProps}>
    {#if children}
        {@render children()}
    {:else if displayValue}
        {displayValue}
    {/if}
</svelte:element>
