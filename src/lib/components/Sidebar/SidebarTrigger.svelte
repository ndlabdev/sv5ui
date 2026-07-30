<script lang="ts" module>
    import type { SidebarTriggerProps } from './sidebar-trigger.types.js'

    export type Props = SidebarTriggerProps
</script>

<script lang="ts">
    import Button from '../Button/Button.svelte'
    import { getComponentConfig, iconsDefaults } from '../../config.js'

    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        collapsed = $bindable(undefined),
        open = $bindable(undefined),
        breakpoint = 'lg',
        icon,
        color = 'secondary',
        variant = 'ghost',
        onclick,
        ...restProps
    }: Props = $props()

    const breakpointPx = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const

    let below = $state(false)
    $effect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return
        const mq = window.matchMedia(`(max-width: ${breakpointPx[breakpoint] - 0.02}px)`)
        const update = () => (below = mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    })

    function toggle() {
        if (below && open !== undefined) {
            open = !open
            return
        }
        if (collapsed !== undefined) {
            collapsed = !collapsed
            return
        }
        if (open !== undefined) {
            open = !open
        }
    }

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLElement }) {
        onclick?.(event)
        if (!event.defaultPrevented) {
            toggle()
        }
    }
</script>

<Button
    {color}
    {variant}
    icon={icon ?? icons.panelLeft}
    aria-label="Toggle sidebar"
    {...restProps}
    onclick={handleClick}
/>
