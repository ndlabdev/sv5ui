<script lang="ts">
    import Drawer from './Drawer.svelte'
</script>

<Drawer>
    {#snippet children({ props })}
        <button data-testid="trigger" {...props}>Open</button>
    {/snippet}
    {#snippet content()}<p>Body</p>{/snippet}
</Drawer>
