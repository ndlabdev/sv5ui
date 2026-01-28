<script lang="ts">
	import { Alert } from '$lib/index.js'
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Getting Started</h1>
		<p class="text-on-surface-variant">Quick setup guide for SV5UI.</p>
	</div>

	<!-- Step 1 -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Step 1: Install</h2>
		<div class="rounded-lg bg-surface-container-highest p-4">
			<pre class="overflow-x-auto text-sm"><code class="text-on-surface">npm install sv5ui</code></pre>
		</div>
	</section>

	<!-- Step 2 -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Step 2: Setup Layout</h2>
		<p class="text-sm text-on-surface-variant">
			Import theme CSS and ModeWatcher in your root layout:
		</p>
		<div class="rounded-lg bg-surface-container-highest p-4">
			<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{'// src/routes/+layout.svelte\n<script>\n    import \'sv5ui/theme.css\'          // Theme with dark mode support\n    import { ModeWatcher } from \'sv5ui\' // Dark mode handler\n<\/script>\n\n<ModeWatcher \/>\n<slot \/>'}</code></pre>
		</div>
	</section>

	<!-- Step 3 -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Step 3: Use Components</h2>
		<div class="rounded-lg bg-surface-container-highest p-4">
			<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{'<script>\n    import { Button, Icon, toggleMode } from \'sv5ui\'\n<\/script>\n\n<Button label="Click me" \/>\n<Button variant="outline" color="error" label="Delete" \/>\n<Button icon="lucide:moon" onclick={toggleMode} square \/>'}</code></pre>
		</div>
	</section>

	<!-- Done -->
	<Alert
		color="success"
		variant="soft"
		icon="lucide:check-circle"
		title="Done!"
		description="Theme, dark mode, and components are ready to use."
	/>
</div>
