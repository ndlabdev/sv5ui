<script lang="ts">
	import { Link, Icon } from '$lib/index.js'

	const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Link</h1>
		<p class="text-on-surface-variant">
			Navigation link with automatic active state detection, color variants, and external link handling.
		</p>
	</div>

	<!-- Colors -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Colors</h2>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			{#each colors as color}
				<Link href="/link" {color}>{color}</Link>
			{/each}
		</div>
	</section>

	<!-- Active State -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Active State</h2>
		<p class="text-sm text-on-surface-variant">
			Active state is auto-detected from the current route. Use <code class="rounded bg-surface-container-highest px-1">active</code> to override.
		</p>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<Link href="/link" active={true} color="primary">Active (forced)</Link>
			<Link href="/link" active={false} color="primary">Inactive (forced)</Link>
			<Link href="/link" color="secondary">Auto-detected</Link>
		</div>
	</section>

	<!-- Active with Custom Classes -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Active & Inactive Classes</h2>
		<p class="text-sm text-on-surface-variant">
			Apply custom classes based on active state using <code class="rounded bg-surface-container-highest px-1">activeClass</code> and <code class="rounded bg-surface-container-highest px-1">inactiveClass</code>.
		</p>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<Link href="/link" active={true} activeClass="font-bold underline underline-offset-4">
				Active (bold + underline)
			</Link>
			<Link href="/other" inactiveClass="opacity-50">
				Inactive (dimmed)
			</Link>
		</div>
	</section>

	<!-- Disabled -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Disabled</h2>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			{#each colors as color}
				<Link href="/link" {color} disabled>{color}</Link>
			{/each}
		</div>
	</section>

	<!-- External Links -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">External Links</h2>
		<p class="text-sm text-on-surface-variant">
			External URLs are auto-detected. Adds <code class="rounded bg-surface-container-highest px-1">rel="noopener noreferrer"</code> and <code class="rounded bg-surface-container-highest px-1">target="_blank"</code> automatically.
		</p>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<Link href="https://svelte.dev" color="primary">
				<Icon name="lucide:external-link" size="14" class="mr-1" />
				Svelte
			</Link>
			<Link href="https://tailwindcss.com" color="secondary">
				<Icon name="lucide:external-link" size="14" class="mr-1" />
				Tailwind CSS
			</Link>
			<Link href="https://github.com" color="tertiary">
				<Icon name="lucide:external-link" size="14" class="mr-1" />
				GitHub
			</Link>
		</div>
	</section>

	<!-- Matching Modes -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Matching Modes</h2>
		<p class="text-sm text-on-surface-variant">
			Control how active state is detected using
			<code class="rounded bg-surface-container-highest px-1">exact</code>,
			<code class="rounded bg-surface-container-highest px-1">exactQuery</code>, and
			<code class="rounded bg-surface-container-highest px-1">exactHash</code>.
		</p>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-outline-variant">
						<th class="px-3 py-2 text-left font-medium text-on-surface-variant">Prop</th>
						<th class="px-3 py-2 text-left font-medium text-on-surface-variant">Link</th>
						<th class="px-3 py-2 text-left font-medium text-on-surface-variant">Preview</th>
						<th class="px-3 py-2 text-left font-medium text-on-surface-variant">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-outline-variant/50">
						<td class="px-3 py-2 font-mono text-xs text-on-surface-variant">default</td>
						<td class="px-3 py-2 font-mono text-xs">/link</td>
						<td class="px-3 py-2">
							<Link href="/link" color="primary" activeClass="font-semibold">Link</Link>
						</td>
						<td class="px-3 py-2 text-on-surface-variant">Prefix match — active if URL starts with href</td>
					</tr>
					<tr class="border-b border-outline-variant/50">
						<td class="px-3 py-2 font-mono text-xs text-on-surface-variant">exact</td>
						<td class="px-3 py-2 font-mono text-xs">/link</td>
						<td class="px-3 py-2">
							<Link href="/link" color="primary" exact activeClass="font-semibold">Link (exact)</Link>
						</td>
						<td class="px-3 py-2 text-on-surface-variant">Only active when pathname is exactly "/link"</td>
					</tr>
					<tr class="border-b border-outline-variant/50">
						<td class="px-3 py-2 font-mono text-xs text-on-surface-variant">exactHash</td>
						<td class="px-3 py-2 font-mono text-xs">/link#section</td>
						<td class="px-3 py-2">
							<Link href="/link#section" color="success" exactHash activeClass="font-semibold">#section</Link>
						</td>
						<td class="px-3 py-2 text-on-surface-variant">Hash must also match for active state</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- Raw Mode -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Raw Mode</h2>
		<p class="text-sm text-on-surface-variant">
			Strips all default styling. Only <code class="rounded bg-surface-container-highest px-1">class</code>, <code class="rounded bg-surface-container-highest px-1">activeClass</code>, and <code class="rounded bg-surface-container-highest px-1">inactiveClass</code> apply.
		</p>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<Link href="/link" raw class="text-on-surface underline decoration-primary underline-offset-4 hover:decoration-2">
				Custom styled link
			</Link>
			<Link href="/link" raw class="rounded-md bg-primary-container px-3 py-1 text-on-primary-container hover:bg-primary-container/80">
				Chip-style link
			</Link>
		</div>
	</section>

	<!-- UI Slot Overrides -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">UI Slot Overrides</h2>
		<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
			<Link href="/link" color="primary" ui={{ base: 'underline underline-offset-4 decoration-2' }}>
				Underlined
			</Link>
			<Link href="/link" color="success" ui={{ base: 'font-bold text-lg' }}>
				Bold & Large
			</Link>
			<Link href="/link" color="error" ui={{ base: 'uppercase tracking-wider text-xs font-semibold' }}>
				Uppercase
			</Link>
		</div>
	</section>

	<!-- Colors x State Matrix -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Colors x State</h2>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-outline-variant">
						<th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant">Color</th>
						<th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant">Default</th>
						<th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant">Active</th>
						<th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant">Disabled</th>
					</tr>
				</thead>
				<tbody>
					{#each colors as color}
						<tr class="border-b border-outline-variant/50">
							<td class="px-3 py-3 text-sm font-medium capitalize text-on-surface-variant">{color}</td>
							<td class="px-3 py-3">
								<Link href="/demo" {color}>Link text</Link>
							</td>
							<td class="px-3 py-3">
								<Link href="/link" {color} active={true}>Link text</Link>
							</td>
							<td class="px-3 py-3">
								<Link href="/link" {color} disabled>Link text</Link>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Real World Examples -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Real World Examples</h2>
		<div class="space-y-4 rounded-lg bg-surface-container-high p-4">
			<!-- Navigation Bar -->
			<div>
				<p class="mb-2 text-sm font-medium text-on-surface-variant">Navigation</p>
				<nav class="flex items-center gap-6">
					<Link href="/" color="primary" exact activeClass="font-semibold">Home</Link>
					<Link href="/about" color="primary" activeClass="font-semibold">About</Link>
					<Link href="/link" color="primary" activeClass="font-semibold" active={true}>Docs</Link>
					<Link href="/pricing" color="primary" activeClass="font-semibold">Pricing</Link>
				</nav>
			</div>

			<!-- Sidebar Menu -->
			<div>
				<p class="mb-2 text-sm font-medium text-on-surface-variant">Sidebar</p>
				<div class="flex w-56 flex-col gap-1">
					<Link
						href="/link"
						raw
						active={true}
						activeClass="bg-primary-container text-on-primary-container font-medium"
						inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
						class="rounded-md px-3 py-2 text-sm"
					>
						<Icon name="lucide:layout-dashboard" size="16" class="mr-2" />
						Dashboard
					</Link>
					<Link
						href="/settings"
						raw
						activeClass="bg-primary-container text-on-primary-container font-medium"
						inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
						class="rounded-md px-3 py-2 text-sm"
					>
						<Icon name="lucide:settings" size="16" class="mr-2" />
						Settings
					</Link>
				</div>
			</div>

			<!-- Breadcrumb -->
			<div>
				<p class="mb-2 text-sm font-medium text-on-surface-variant">Breadcrumb</p>
				<nav class="flex items-center gap-1 text-sm">
					<Link href="/" color="secondary">Home</Link>
					<Icon name="lucide:chevron-right" size="14" class="text-on-surface-variant" />
					<Link href="/link" color="secondary">Docs</Link>
					<Icon name="lucide:chevron-right" size="14" class="text-on-surface-variant" />
					<span class="text-on-surface-variant">Components</span>
				</nav>
			</div>
		</div>
	</section>
</div>
