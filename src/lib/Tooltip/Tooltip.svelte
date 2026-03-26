<script lang="ts" module>
    import type { TooltipProps } from './tooltip.types.js'

    export type Props = TooltipProps
</script>

<script lang="ts">
    import { Tooltip } from 'bits-ui'
    import { tooltipVariants, tooltipDefaults } from './tooltip.variants.js'
    import { getComponentConfig } from '../config.js'
    import Kbd from '../Kbd/Kbd.svelte'

    const config = getComponentConfig('tooltip', tooltipDefaults)

    let {
        ref = $bindable(null),
        open = $bindable(false),
        onOpenChange,
        delayDuration,
        disableHoverableContent,
        disableCloseOnTriggerClick,
        ignoreNonKeyboardFocus,
        disabled = false,
        side = 'bottom',
        sideOffset = 8,
        align = 'center',
        alignOffset = 0,
        avoidCollisions = true,
        collisionBoundary,
        collisionPadding = 8,
        sticky = 'partial',
        hideWhenDetached = false,
        onEscapeKeydown,
        forceMount,
        text,
        kbds,
        arrow = false,
        transition = config.defaultVariants.transition ?? true,
        portal = true,
        ui,
        class: className,
        children,
        content: contentSlot,
        ...restProps
    }: Props = $props()

    // Pre-compute booleans
    const hasText = $derived(!!text)
    const hasKbds = $derived(!!kbds?.length)
    const hasContent = $derived(hasText || hasKbds || !!contentSlot)

    // Compute variant classes
    const variantSlots = $derived(tooltipVariants({ transition }))
    const kbdsSize = (config.slots.kbdsSize ?? 'sm') as 'sm' | 'md' | 'lg'
    const classes = $derived({
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] }),
        text: variantSlots.text({ class: [config.slots.text, ui?.text] }),
        kbds: variantSlots.kbds({ class: [config.slots.kbds, ui?.kbds] })
    })

    // Arrow props
    const arrowProps = $derived.by(() => {
        if (typeof arrow === 'object') {
            return { width: 12, height: 6, ...arrow }
        }
        return { width: 12, height: 6 }
    })
</script>

{#snippet tooltipContent()}
    {#if contentSlot}
        {@render contentSlot()}
    {:else}
        {#if hasText}
            <span class={classes.text}>{text}</span>
        {/if}

        {#if hasKbds}
            <span class={classes.kbds}>
                {#each kbds as kbd, index (index)}
                    {#if index > 0}
                        <span class="mx-0.5 text-inverse-on-surface/60">·</span>
                    {/if}
                    {#if typeof kbd === 'string'}
                        <Kbd value={kbd} size={kbdsSize} variant="soft" color="surface" />
                    {:else}
                        <Kbd size={kbdsSize} variant="soft" color="surface" {...kbd} />
                    {/if}
                {/each}
            </span>
        {/if}
    {/if}
{/snippet}

{#snippet tooltipContentEl()}
    <Tooltip.Content
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
        {onEscapeKeydown}
        {forceMount}
        class={classes.content}
        {...restProps}
    >
        {@render tooltipContent()}

        {#if arrow}
            <Tooltip.Arrow
                width={arrowProps.width}
                height={arrowProps.height}
                class={classes.arrow}
            />
        {/if}
    </Tooltip.Content>
{/snippet}

<Tooltip.Provider {delayDuration} {disableHoverableContent}>
    <Tooltip.Root
        bind:open
        {onOpenChange}
        {disableCloseOnTriggerClick}
        {ignoreNonKeyboardFocus}
        disabled={disabled || !hasContent}
    >
        {#if children}
            <Tooltip.Trigger>
                {#snippet child({ props })}
                    <span {...props} class={className as string}>
                        {@render children({ open })}
                    </span>
                {/snippet}
            </Tooltip.Trigger>
        {/if}

        {#if portal}
            <Tooltip.Portal>
                {@render tooltipContentEl()}
            </Tooltip.Portal>
        {:else}
            {@render tooltipContentEl()}
        {/if}
    </Tooltip.Root>
</Tooltip.Provider>
