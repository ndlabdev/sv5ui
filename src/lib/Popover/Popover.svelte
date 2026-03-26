<script lang="ts" module>
    import type { PopoverProps } from './popover.types.js'

    export type Props = PopoverProps
</script>

<script lang="ts">
    import { Popover } from 'bits-ui'
    import { popoverVariants, popoverDefaults } from './popover.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('popover', popoverDefaults)

    let {
        ref = $bindable(null),
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        side = 'bottom',
        sideOffset = 8,
        align = 'center',
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        sticky = 'partial',
        hideWhenDetached = false,
        trapFocus = true,
        preventScroll = false,
        onOpenAutoFocus,
        onCloseAutoFocus,
        onEscapeKeydown,
        onInteractOutside,
        forceMount,
        arrow = false,
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        dismissible = true,
        ui,
        class: className,
        children,
        content: contentSlot,
        ...restProps
    }: Props = $props()

    const variantSlots = $derived(popoverVariants({ transition }))
    const classes = $derived({
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] })
    })

    const arrowProps = $derived.by(() => {
        if (typeof arrow === 'object') {
            return { width: 12, height: 6, ...arrow }
        }
        return { width: 12, height: 6 }
    })

    const dismissBehavior = $derived(dismissible ? ('close' as const) : ('ignore' as const))

    function close() {
        open = false
    }
</script>

{#snippet popoverContentEl()}
    <Popover.Content
        bind:ref
        {side}
        {sideOffset}
        {align}
        {alignOffset}
        {avoidCollisions}
        {collisionBoundary}
        {collisionPadding}
        {sticky}
        {hideWhenDetached}
        {trapFocus}
        {preventScroll}
        escapeKeydownBehavior={dismissBehavior}
        interactOutsideBehavior={dismissBehavior}
        {onOpenAutoFocus}
        {onCloseAutoFocus}
        {onEscapeKeydown}
        {onInteractOutside}
        {forceMount}
        class={[classes.content, !children ? className : undefined]}
        {...restProps}
    >
        {#if contentSlot}
            {@render contentSlot({ open, close })}
        {/if}

        {#if arrow}
            <Popover.Arrow
                width={arrowProps.width}
                height={arrowProps.height}
                class={classes.arrow}
            />
        {/if}
    </Popover.Content>
{/snippet}

<Popover.Root bind:open {onOpenChange} {onOpenChangeComplete}>
    {#if children}
        <Popover.Trigger>
            {#snippet child({ props })}
                <span {...props} class={className as string}>
                    {@render children({ open })}
                </span>
            {/snippet}
        </Popover.Trigger>
    {/if}

    {#if portal}
        <Popover.Portal>
            {@render popoverContentEl()}
        </Popover.Portal>
    {:else}
        {@render popoverContentEl()}
    {/if}
</Popover.Root>
