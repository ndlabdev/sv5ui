<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import './layout.css';

	const { children } = $props();
</script>

<ModeWatcher />
{@render children()}
