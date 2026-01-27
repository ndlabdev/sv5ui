<script lang="ts">
	import { ModeWatcher } from 'mode-watcher'
	import './layout.css'
	import '$lib/sv5ui.config.js'

	const { children } = $props()
</script>

<ModeWatcher />
{@render children()}
