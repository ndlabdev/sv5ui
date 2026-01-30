<script lang="ts" module>
    import type { KbdProps } from './kbd.types.js'

    export type Props = KbdProps

    /** Detect macOS/iOS platform (computed once) */
    const isMac =
        typeof navigator !== 'undefined' && /Macintosh|Mac OS|iPhone|iPad|iPod/i.test(navigator.userAgent)

    /** Resolve key to display symbol */
    function resolveKey(value: string | undefined): string | null {
        if (!value) return null

        const key = value.toLowerCase()

        // Platform-specific keys (meta, ctrl, alt)
        if (key in kbdKeysPlatformMap) {
            return isMac ? kbdKeysPlatformMap[key].mac : kbdKeysPlatformMap[key].other
        }

        // Static key symbols
        return kbdKeysMap[key] ?? value
    }
</script>

<script lang="ts">
    import { kbdVariants, kbdKeysMap, kbdKeysPlatformMap } from './kbd.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('kbd')

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
