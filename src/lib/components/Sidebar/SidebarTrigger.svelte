<script lang="ts" module>
    import type { SidebarTriggerProps } from './sidebar-trigger.types.js'

    export type Props = SidebarTriggerProps
</script>

<script lang="ts">
    import Button from '../Button/Button.svelte'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { useMediaQuery } from '../../hooks/useMediaQuery/index.js'

    const icons = getComponentConfig('icons', iconsDefaults)

    const BREAKPOINT_PX = { sm: 640, md: 768, lg: 1024, xl: 1280 }

    let {
        api,
        collapsed = $bindable(undefined),
        open = $bindable(undefined),
        breakpoint = 'lg',
        icon,
        color = 'secondary',
        variant = 'ghost',
        onclick,
        ...restProps
    }: Props = $props()

    const media = useMediaQuery(() => `(max-width: ${BREAKPOINT_PX[breakpoint] - 0.02}px)`)

    const below = $derived(api ? api.below : media.matches)

    const expanded = $derived.by(() => {
        if (api) return below ? api.open : !api.collapsed
        if (below && open !== undefined) return open
        if (collapsed !== undefined) return !collapsed
        if (open !== undefined) return open
        return undefined
    })

    function toggle() {
        if (api) {
            api.toggle()
            return
        }
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
    aria-expanded={expanded}
    {...restProps}
    onclick={handleClick}
/>
