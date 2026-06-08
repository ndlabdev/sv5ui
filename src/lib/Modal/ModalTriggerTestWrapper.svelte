<script lang="ts">
    import Modal from './Modal.svelte'
</script>

<Modal title="Trigger test" description="D">
    {#snippet children({ props })}
        <button data-testid="trigger" {...props}>Open</button>
    {/snippet}
    {#snippet body()}<p>Body</p>{/snippet}
</Modal>
