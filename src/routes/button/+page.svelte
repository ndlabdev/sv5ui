<script lang="ts">
	import { Button, Icon } from '$lib/index.js'

	const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
	const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Button</h1>
		<p class="text-on-surface-variant">
			Versatile button component with multiple variants, colors, sizes, icons, and loading states.
		</p>
	</div>

	<!-- Variants x Colors Matrix -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Variants & Colors</h2>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-outline-variant">
						<th class="px-2 py-3 text-left text-sm font-medium text-on-surface-variant">Variant</th>
						{#each colors as color}
							<th class="px-2 py-3 text-center text-sm font-medium capitalize text-on-surface-variant">{color}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each variants as variant}
						<tr class="border-b border-outline-variant/50">
							<td class="px-2 py-3 text-sm font-medium capitalize text-on-surface-variant">{variant}</td>
							{#each colors as color}
								<td class="px-2 py-3 text-center">
									<Button {variant} {color} label="Button" />
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Sizes -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Sizes</h2>
		<div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
			{#each sizes as size}
				<Button variant="solid" color="primary" {size} label={size.toUpperCase()} />
			{/each}
		</div>
	</section>

	<!-- With Icons -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">With Icons</h2>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" leadingIcon="lucide:plus" label="Add Item" />
			<Button variant="outline" color="secondary" trailingIcon="lucide:arrow-right" label="Next" />
			<Button variant="soft" color="success" leadingIcon="lucide:check" trailingIcon="lucide:chevron-down" label="Confirm" />
			<Button variant="ghost" color="error" leadingIcon="lucide:trash-2" label="Delete" />
		</div>
	</section>

	<!-- Icon Only (Square) -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Icon Only (Square)</h2>
		<div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
			{#each sizes as size}
				<Button variant="solid" color="primary" {size} icon="lucide:plus" square />
			{/each}
			<span class="mx-2 text-on-surface-variant">|</span>
			<Button variant="outline" color="secondary" icon="lucide:settings" square />
			<Button variant="soft" color="success" icon="lucide:check" square />
			<Button variant="subtle" color="warning" icon="lucide:alert-triangle" square />
			<Button variant="ghost" color="error" icon="lucide:x" square />
		</div>
	</section>

	<!-- Loading States -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Loading States</h2>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" loading label="Loading..." />
			<Button variant="outline" color="secondary" loading label="Processing" />
			<Button variant="soft" color="success" loading icon="lucide:loader-2" square />
			<Button variant="solid" color="info" loading trailing label="Uploading" />
		</div>
	</section>

	<!-- Disabled States -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Disabled States</h2>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" disabled label="Disabled" />
			<Button variant="outline" color="secondary" disabled label="Disabled" />
			<Button variant="soft" color="success" disabled label="Disabled" />
			<Button variant="subtle" color="warning" disabled label="Disabled" />
			<Button variant="ghost" color="error" disabled label="Disabled" />
			<Button variant="link" color="info" disabled label="Disabled" />
		</div>
	</section>

	<!-- Block (Full Width) -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Block (Full Width)</h2>
		<div class="space-y-2 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" block label="Full Width Button" />
			<Button variant="outline" color="secondary" block leadingIcon="lucide:mail" trailingIcon="lucide:arrow-right" label="Send Email" />
		</div>
	</section>

	<!-- Custom Content -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Custom Content (Children Slot)</h2>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary">
				<Icon name="lucide:sparkles" size="16" />
				<span>Custom Content</span>
			</Button>
			<Button variant="outline" color="tertiary">
				<span class="font-bold">Bold</span>
				<span class="font-light">& Light</span>
			</Button>
		</div>
	</section>

	<!-- With Avatar -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">With Avatar</h2>
		<p class="text-sm text-on-surface-variant">
			Use the <code class="rounded bg-surface-container-highest px-1">avatar</code> prop to display an avatar before the label.
		</p>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="soft" color="primary" avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John' }} label="John Doe" />
			<Button variant="outline" color="secondary" avatar={{ src: 'https://i.pravatar.cc/150?img=2', alt: 'Jane' }} label="Jane Smith" />
			<Button variant="solid" color="tertiary" avatar={{ alt: 'New' }} label="New User" />
			<Button variant="ghost" color="secondary" avatar={{ src: 'https://i.pravatar.cc/150?img=5', alt: 'User' }} label="Profile" trailingIcon="lucide:chevron-down" />
		</div>

		<!-- Avatar sizes across button sizes -->
		<div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
			{#each sizes as size}
				<Button variant="soft" color="primary" {size} avatar={{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User' }} label={size.toUpperCase()} />
			{/each}
		</div>
	</section>

	<!-- Leading & Trailing Slots -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Leading & Trailing Slots</h2>
		<p class="text-sm text-on-surface-variant">
			Use <code class="rounded bg-surface-container-highest px-1">leadingSlot</code> and
			<code class="rounded bg-surface-container-highest px-1">trailingSlot</code> for custom content.
		</p>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			{#snippet statusSlot()}
				<span class="relative flex size-2">
					<span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"></span>
					<span class="relative inline-flex size-2 rounded-full bg-success"></span>
				</span>
			{/snippet}
			<Button variant="outline" color="success" leadingSlot={statusSlot} label="Online" />

			{#snippet badgeSlot()}
				<span class="flex size-5 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">3</span>
			{/snippet}
			<Button variant="ghost" color="secondary" leadingIcon="lucide:bell" trailingSlot={badgeSlot} label="Notifications" />

			{#snippet kbdSlot()}
				<kbd class="rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 font-mono text-xs text-on-surface-variant">⌘K</kbd>
			{/snippet}
			<Button variant="outline" color="secondary" leadingIcon="lucide:search" trailingSlot={kbdSlot} label="Search" />
		</div>
	</section>

	<!-- UI Prop Overrides -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">UI Prop (Class Overrides)</h2>
		<p class="text-sm text-on-surface-variant">
			Override classes for specific slots: <code class="rounded bg-surface-container-highest px-1">base</code>,
			<code class="rounded bg-surface-container-highest px-1">label</code>,
			<code class="rounded bg-surface-container-highest px-1">leadingIcon</code>,
			<code class="rounded bg-surface-container-highest px-1">trailingIcon</code>.
		</p>
		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" label="Pill Button" class="rounded-full" />
			<Button variant="solid" color="tertiary" label="With Shadow" ui={{ base: 'shadow-lg shadow-tertiary/30' }} />
			<Button variant="solid" color="primary" label="Gradient" ui={{ base: 'bg-linear-to-r from-primary to-tertiary hover:from-primary/90 hover:to-tertiary/90' }} />
			<Button variant="outline" color="warning" label="Dashed Border" ui={{ base: 'border-2 border-dashed ring-0' }} />
		</div>

		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="solid" color="primary" label="Uppercase" ui={{ label: 'uppercase tracking-wider' }} />
			<Button variant="outline" color="secondary" label="Italic Text" ui={{ label: 'italic' }} />
			<Button variant="soft" color="success" label="monospace" ui={{ label: 'font-mono' }} />
			<Button variant="ghost" color="primary" label="Gradient Text" ui={{ label: 'bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent' }} />
		</div>

		<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
			<Button variant="outline" color="secondary" leadingIcon="lucide:settings" label="Hover Rotate" ui={{ leadingIcon: 'transition-transform duration-300 group-hover:rotate-90' }} class="group" />
			<Button variant="soft" color="success" leadingIcon="lucide:bell" label="Bouncing" ui={{ leadingIcon: 'animate-bounce' }} />
			<Button variant="outline" color="secondary" leadingIcon="lucide:heart" label="Colored Icon" ui={{ leadingIcon: 'text-error' }} />
			<Button variant="solid" color="info" trailingIcon="lucide:arrow-right" label="Hover Slide" ui={{ trailingIcon: 'transition-transform duration-200 group-hover:translate-x-1' }} class="group" />
		</div>
	</section>

	<!-- Real World Examples -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Real World Examples</h2>
		<div class="space-y-4 rounded-lg bg-surface-container-high p-4">
			<!-- Action Bar -->
			<div class="flex items-center gap-2">
				<Button variant="solid" color="primary" leadingIcon="lucide:save" label="Save" />
				<Button variant="outline" color="secondary" label="Cancel" />
				<div class="flex-1"></div>
				<Button variant="ghost" color="error" leadingIcon="lucide:trash-2" label="Delete" />
			</div>

			<!-- Social Buttons -->
			<div class="flex items-center gap-2">
				<Button variant="soft" color="info" leadingIcon="mdi:twitter" label="Tweet" />
				<Button variant="soft" color="primary" leadingIcon="mdi:facebook" label="Share" />
				<Button variant="soft" color="tertiary" leadingIcon="mdi:linkedin" label="Post" />
			</div>

			<!-- Pagination -->
			<div class="flex items-center gap-1">
				<Button variant="ghost" color="secondary" icon="lucide:chevron-left" square />
				<Button variant="ghost" color="secondary" label="1" />
				<Button variant="solid" color="primary" label="2" />
				<Button variant="ghost" color="secondary" label="3" />
				<Button variant="ghost" color="secondary" label="..." />
				<Button variant="ghost" color="secondary" label="10" />
				<Button variant="ghost" color="secondary" icon="lucide:chevron-right" square />
			</div>
		</div>
	</section>
</div>
