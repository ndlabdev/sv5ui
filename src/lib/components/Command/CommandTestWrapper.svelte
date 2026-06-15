<script lang="ts">
    import Command from './Command.svelte'
    import type { CommandProps } from './command.types.js'

    let {
        ...props
    }: Omit<
        CommandProps,
        'item' | 'itemLeading' | 'itemLabel' | 'itemTrailing' | 'empty' | 'footer'
    > = $props()
</script>

<Command {...props} />
