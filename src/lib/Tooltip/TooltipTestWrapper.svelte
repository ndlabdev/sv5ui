<script lang="ts">
    import { Tooltip as BitsTooltip } from 'bits-ui'
    import Tooltip from './Tooltip.svelte'
    import type { TooltipProps } from './tooltip.types.js'

    let props: TooltipProps = $props()
</script>

<BitsTooltip.Provider delayDuration={0}>
    <Tooltip {...props} />
</BitsTooltip.Provider>
