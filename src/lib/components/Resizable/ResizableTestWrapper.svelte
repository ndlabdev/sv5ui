<script lang="ts">
    import Resizable from './Resizable.svelte'
    import type { ResizableApi, ResizableProps } from './resizable.types.js'

    let { onReady, ...props }: ResizableProps & { onReady?: (api: ResizableApi) => void } = $props()

    let api = $state<ResizableApi>()

    $effect(() => {
        if (api) onReady?.(api)
    })
</script>

<Resizable bind:api {...props} />
