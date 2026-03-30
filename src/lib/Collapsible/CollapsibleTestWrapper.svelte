<script lang="ts">
    import Collapsible from './Collapsible.svelte'
    import type { CollapsibleProps } from './collapsible.types.js'

    let { ...props }: Omit<CollapsibleProps, 'trigger' | 'content' | 'children'> = $props()
</script>

<Collapsible {...props}>
    {#snippet trigger({ open, props: triggerProps })}
        <button type="button" {...triggerProps}>
            {open ? 'Close' : 'Open'}
        </button>
    {/snippet}
    {#snippet content()}
        <div data-testid="collapsible-body">Collapsible content</div>
    {/snippet}
</Collapsible>
