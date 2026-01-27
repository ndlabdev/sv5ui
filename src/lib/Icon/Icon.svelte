<script lang="ts" module>
    import type { IconProps } from './icon.types.js'

    export type Props = IconProps
</script>

<script lang="ts">
    import Icon from '@iconify/svelte'

    let {
        name,
        size = '1em',
        color,
        flipH = false,
        flipV = false,
        rotate = 0,
        class: className
    }: Props = $props()

    const flip = $derived.by(() => {
        if (flipH && flipV) return 'horizontal,vertical'
        if (flipH) return 'horizontal'
        if (flipV) return 'vertical'
        return undefined
    })

    const rotateValue = $derived(rotate ? rotate / 90 : undefined)
</script>

<Icon
    icon={name}
    width={size}
    height={size}
    {color}
    {flip}
    rotate={rotateValue}
    class="shrink-0 {className ?? ''}"
/>
