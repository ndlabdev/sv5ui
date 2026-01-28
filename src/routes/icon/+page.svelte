<script lang="ts">
	import { Icon } from '$lib/index.js'
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Icon</h1>
		<p class="text-on-surface-variant">
			Icons powered by Iconify. Supports any icon from the Iconify library.
		</p>
	</div>

	<!-- Basic Icons -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Basic Icons</h2>
		<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
			<Icon name="lucide:home" size="24" />
			<Icon name="lucide:settings" size="24" />
			<Icon name="lucide:user" size="24" />
			<Icon name="lucide:mail" size="24" />
			<Icon name="lucide:bell" size="24" />
			<Icon name="lucide:search" size="24" />
			<Icon name="lucide:heart" size="24" />
			<Icon name="lucide:star" size="24" />
		</div>
	</section>

	<!-- Sizes -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Sizes</h2>
		<div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
			{#each [16, 20, 24, 32, 48] as size}
				<div class="flex flex-col items-center gap-1">
					<Icon name="lucide:rocket" {size} />
					<span class="text-xs text-on-surface-variant">{size}px</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Colors -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Colors</h2>
		<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
			<Icon name="lucide:circle" size="24" class="text-primary" />
			<Icon name="lucide:circle" size="24" class="text-secondary" />
			<Icon name="lucide:circle" size="24" class="text-tertiary" />
			<Icon name="lucide:circle" size="24" class="text-success" />
			<Icon name="lucide:circle" size="24" class="text-warning" />
			<Icon name="lucide:circle" size="24" class="text-error" />
			<Icon name="lucide:circle" size="24" class="text-info" />
		</div>
	</section>

	<!-- Transformations -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Transformations</h2>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" />
				<span class="text-xs text-on-surface-variant">Normal</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" flipH />
				<span class="text-xs text-on-surface-variant">Flip H</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" flipV />
				<span class="text-xs text-on-surface-variant">Flip V</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" rotate={90} />
				<span class="text-xs text-on-surface-variant">90°</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" rotate={180} />
				<span class="text-xs text-on-surface-variant">180°</span>
			</div>
			<div class="flex flex-col items-center gap-1">
				<Icon name="lucide:arrow-right" size="24" rotate={270} />
				<span class="text-xs text-on-surface-variant">270°</span>
			</div>
		</div>
	</section>

	<!-- Different Icon Sets -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Different Icon Sets</h2>
		<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
			{#each [
				{ name: 'lucide:github', label: 'Lucide' },
				{ name: 'mdi:github', label: 'MDI' },
				{ name: 'ph:github-logo', label: 'Phosphor' },
				{ name: 'tabler:brand-github', label: 'Tabler' },
				{ name: 'heroicons:code-bracket', label: 'Heroicons' }
			] as icon}
				<div class="flex flex-col items-center gap-1">
					<Icon name={icon.name} size="24" />
					<span class="text-xs text-on-surface-variant">{icon.label}</span>
				</div>
			{/each}
		</div>
	</section>
</div>
