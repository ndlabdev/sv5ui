<script lang="ts">
    import Tooltip from './Tooltip.svelte'
    import type { TooltipProps } from './tooltip.types.js'

    let props: TooltipProps = $props()
</script>

<Tooltip {...props} />
