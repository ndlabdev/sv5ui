<script lang="ts" module>
    import type { CollapsibleProps } from './collapsible.types.js'

    export type Props = CollapsibleProps
</script>

<script lang="ts">
    import { Collapsible } from 'bits-ui'
    import { collapsibleVariants, collapsibleDefaults } from './collapsible.variants.js'
    import { getComponentConfig } from '../config.js'

    const config = getComponentConfig('collapsible', collapsibleDefaults)

    let {
        ref = $bindable(null),
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        disabled = false,
        trigger: triggerSlot,
        content: contentSlot,
        children,
        ui,
        class: className,
        ...restProps
    }: Props = $props()

    const slots = $derived(collapsibleVariants({ disabled }))
    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: slots.root({ class: [config.slots.root, className, u.root] }),
            content: slots.content({ class: [config.slots.content, u.content] })
        }
    })

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }
</script>

<Collapsible.Root
    {...restProps}
    bind:ref
    {open}
    onOpenChange={handleOpenChange}
    {onOpenChangeComplete}
    {disabled}
    class={classes.root}
>
    {#if triggerSlot}
        <Collapsible.Trigger>
            {#snippet child({ props })}
                {@render triggerSlot({ open, props })}
            {/snippet}
        </Collapsible.Trigger>
    {/if}

    {#if contentSlot}
        <Collapsible.Content class={classes.content}>
            {@render contentSlot()}
        </Collapsible.Content>
    {/if}

    {#if children}
        {@render children()}
    {/if}
</Collapsible.Root>
