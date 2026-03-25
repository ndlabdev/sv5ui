<script lang="ts" module>
    import type { IconProps } from './icon.types.js'

    export type Props = IconProps
</script>

<script lang="ts">
    import Icon from '@iconify/svelte'
    import { twMerge } from 'tailwind-merge'

    let {
        name,
        size = 24,
        color,
        flipH = false,
        flipV = false,
        rotate = 0,
        class: className,
        ...restProps
    }: Props = $props()

    const flip = $derived(
        flipH && flipV
            ? 'horizontal,vertical'
            : flipH
              ? 'horizontal'
              : flipV
                ? 'vertical'
                : undefined
    )

    const rotateValue = $derived(rotate ? rotate / 90 : undefined)

    const iconClass = $derived(twMerge('shrink-0', className))
</script>

<Icon
    icon={name}
    width={size}
    height={size}
    {color}
    {flip}
    rotate={rotateValue}
    class={iconClass}
    {...restProps}
/>
