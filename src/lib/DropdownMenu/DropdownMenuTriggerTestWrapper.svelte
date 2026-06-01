<script lang="ts">
    import DropdownMenu from './DropdownMenu.svelte'
    import type { DropdownMenuItem } from './dropdown-menu.types.js'

    let { items = [] }: { items?: DropdownMenuItem[] } = $props()
</script>

<DropdownMenu {items}>
    {#snippet children({ open, props })}
        <button data-testid="trigger" data-open={open} {...props}>Open</button>
    {/snippet}
</DropdownMenu>
