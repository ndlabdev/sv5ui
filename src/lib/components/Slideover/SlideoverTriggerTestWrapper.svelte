<script lang="ts">
    import Slideover from './Slideover.svelte'
</script>

<Slideover title="Trigger test" description="D">
    {#snippet children({ props })}
        <button data-testid="trigger" {...props}>Open</button>
    {/snippet}
    {#snippet body()}<p>Body</p>{/snippet}
</Slideover>
