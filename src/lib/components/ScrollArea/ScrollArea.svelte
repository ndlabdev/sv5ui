<script lang="ts" module>
    import type { ScrollAreaProps } from './scroll-area.types.js'

    export type Props = ScrollAreaProps
</script>

<script lang="ts">
    import { ScrollArea } from 'bits-ui'
    import { scrollAreaVariants, scrollAreaDefaults } from './scroll-area.variants.js'
    import { getComponentConfig } from '../../config.js'

    const config = getComponentConfig('scrollArea', scrollAreaDefaults)

    let {
        ref = $bindable(null),
        viewportRef = $bindable(null),
        orientation = config.orientation,
        type = config.type,
        scrollHideDelay = config.scrollHideDelay,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        track = config.defaultVariants.track,
        transition = config.defaultVariants.transition,
        ui,
        class: className,
        children,
        ...restProps
    }: Props = $props()

    const hasVertical = $derived(orientation !== 'horizontal')
    const hasHorizontal = $derived(orientation !== 'vertical')

    const classes = $derived.by(() => {
        const slots = scrollAreaVariants({ color, size, track, transition })
        return {
            root: slots.root({ class: [config.slots.root, className, ui?.root] }),
            viewport: slots.viewport({ class: [config.slots.viewport, ui?.viewport] }),
            content: slots.content({ class: [config.slots.content, ui?.content] }),
            scrollbar: slots.scrollbar({ class: [config.slots.scrollbar, ui?.scrollbar] }),
            thumb: slots.thumb({ class: [config.slots.thumb, ui?.thumb] }),
            corner: slots.corner({ class: [config.slots.corner, ui?.corner] })
        }
    })
</script>

<ScrollArea.Root bind:ref {type} {scrollHideDelay} class={classes.root} {...restProps}>
    <ScrollArea.Viewport bind:ref={viewportRef} class={classes.viewport}>
        <div class={classes.content}>
            {@render children?.()}
        </div>
    </ScrollArea.Viewport>

    {#if hasVertical}
        <ScrollArea.Scrollbar orientation="vertical" class={classes.scrollbar}>
            <ScrollArea.Thumb class={classes.thumb} />
        </ScrollArea.Scrollbar>
    {/if}

    {#if hasHorizontal}
        <ScrollArea.Scrollbar orientation="horizontal" class={classes.scrollbar}>
            <ScrollArea.Thumb class={classes.thumb} />
        </ScrollArea.Scrollbar>
    {/if}

    {#if orientation === 'both'}
        <ScrollArea.Corner class={classes.corner} />
    {/if}
</ScrollArea.Root>
