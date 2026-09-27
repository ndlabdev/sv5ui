<script lang="ts">
    import { BitsConfig } from 'bits-ui'
    import type { Snippet } from 'svelte'

    let { active, children }: { active: boolean; children: Snippet } = $props()

    let hostEl = $state<HTMLElement | null>(null)
</script>

{#if active}
    <div bind:this={hostEl} class="fixed top-0 left-0 z-51" data-portal-host></div>
{/if}
<BitsConfig defaultPortalTo={active ? (hostEl ?? undefined) : undefined}>
    {@render children()}
</BitsConfig>
