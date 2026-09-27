<script lang="ts" module>
    import type { ThemeModeProps } from './theme-mode.types.js'

    export type Props = ThemeModeProps
</script>

<script lang="ts">
    import { ModeWatcher } from 'mode-watcher'

    let { ...restProps }: Props = $props()
</script>

<ModeWatcher {...restProps} />
