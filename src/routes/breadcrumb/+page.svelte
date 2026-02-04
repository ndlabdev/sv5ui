<script lang="ts">
	import { Breadcrumb, Icon } from '$lib/index.js'
</script>

<div class="space-y-12">
	<header>
		<h1 class="text-3xl font-bold text-on-surface">Breadcrumb</h1>
		<p class="mt-2 text-on-surface-variant">
			Display a hierarchy of navigation links to show the user's current location within a site.
		</p>
	</header>

	<!-- Basic Usage -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
		<p class="text-sm text-on-surface-variant">
			A simple breadcrumb with text-only items. The last item is automatically marked as the
			current page.
		</p>
		<div
			class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Products', href: '/products' },
					{ label: 'Laptops', href: '/products/laptops' },
					{ label: 'MacBook Pro' }
				]}
			/>
		</div>
	</section>

	<!-- With Icons -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">With Icons</h2>
		<p class="text-sm text-on-surface-variant">
			Add leading icons to breadcrumb items using the <code class="text-primary">icon</code>
			property.
		</p>
		<div
			class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/', icon: 'lucide:home' },
					{ label: 'Settings', href: '/settings', icon: 'lucide:settings' },
					{ label: 'Profile', icon: 'lucide:user' }
				]}
			/>
		</div>
	</section>

	<!-- Custom Separator -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Custom Separator</h2>
		<p class="text-sm text-on-surface-variant">
			Customize the separator icon between items using the
			<code class="text-primary">separatorIcon</code> prop.
		</p>
		<div
			class="flex flex-col gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Chevron (default)</p>
				<Breadcrumb
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Docs', href: '/docs' },
						{ label: 'API' }
					]}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Slash</p>
				<Breadcrumb
					separatorIcon="lucide:slash"
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Docs', href: '/docs' },
						{ label: 'API' }
					]}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Arrow Right</p>
				<Breadcrumb
					separatorIcon="lucide:arrow-right"
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Docs', href: '/docs' },
						{ label: 'API' }
					]}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Dot</p>
				<Breadcrumb
					separatorIcon="lucide:dot"
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Docs', href: '/docs' },
						{ label: 'API' }
					]}
				/>
			</div>
		</div>
	</section>

	<!-- Custom Separator Snippet -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Custom Separator Snippet</h2>
		<p class="text-sm text-on-surface-variant">
			Use the <code class="text-primary">separator</code> snippet slot for fully custom separator
			content.
		</p>
		<div
			class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Category', href: '/category' },
					{ label: 'Current Page' }
				]}
			>
				{#snippet separator()}
					<span class="text-on-surface-variant/40 text-sm">/</span>
				{/snippet}
			</Breadcrumb>
		</div>
	</section>

	<!-- Disabled Items -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Disabled Items</h2>
		<p class="text-sm text-on-surface-variant">
			Individual items can be disabled, preventing navigation while maintaining visual structure.
		</p>
		<div
			class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Archived', href: '/archived', disabled: true },
					{ label: 'Old Post', href: '/archived/old-post', disabled: true },
					{ label: 'Detail' }
				]}
			/>
		</div>
	</section>

	<!-- Custom Item Snippet -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Custom Item Snippet</h2>
		<p class="text-sm text-on-surface-variant">
			Use the <code class="text-primary">item</code> snippet slot for fully custom item rendering.
		</p>
		<div
			class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<Breadcrumb
				items={[
					{ label: 'Home', href: '/', icon: 'lucide:home' },
					{ label: 'Projects', href: '/projects', icon: 'lucide:folder' },
					{ label: 'sv5ui', icon: 'lucide:package' }
				]}
			>
				{#snippet item({ item: crumb, active })}
					{#if active}
						<span
							class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
						>
							{#if crumb.icon}
								<Icon name={crumb.icon} size="14" />
							{/if}
							{crumb.label}
						</span>
					{:else}
						<a
							href={crumb.href}
							class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
						>
							{#if crumb.icon}
								<Icon name={crumb.icon} size="14" />
							{/if}
							{crumb.label}
						</a>
					{/if}
				{/snippet}
			</Breadcrumb>
		</div>
	</section>

	<!-- UI Slot Overrides -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
		<p class="text-sm text-on-surface-variant">
			Customize individual parts with the <code class="text-primary">ui</code> prop.
		</p>
		<div
			class="flex flex-col gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
		>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Custom active color</p>
				<Breadcrumb
					ui={{
						link: 'text-on-surface font-semibold'
					}}
					items={[
						{ label: 'Dashboard', href: '/' },
						{ label: 'Analytics', href: '/analytics' },
						{ label: 'Revenue' }
					]}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">Larger separator</p>
				<Breadcrumb
					ui={{
						separatorIcon: 'size-6 text-primary/40'
					}}
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Blog', href: '/blog' },
						{ label: 'Latest Post' }
					]}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium text-on-surface-variant">With background container</p>
				<Breadcrumb
					ui={{
						root: 'bg-surface-container rounded-lg px-4 py-2'
					}}
					items={[
						{ label: 'Home', href: '/' },
						{ label: 'Shop', href: '/shop' },
						{ label: 'Electronics', href: '/shop/electronics' },
						{ label: 'Phones' }
					]}
				/>
			</div>
		</div>
	</section>

	<!-- Real World Examples -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-on-surface">Real World Examples</h2>
		<p class="text-sm text-on-surface-variant">Common breadcrumb use cases in applications.</p>

		<!-- File Browser -->
		<div class="space-y-2">
			<h3 class="text-lg font-medium text-on-surface">File Browser</h3>
			<div
				class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
			>
				<Breadcrumb
					items={[
						{ label: 'Root', href: '/', icon: 'lucide:hard-drive' },
						{ label: 'Users', href: '/users', icon: 'lucide:users' },
						{ label: 'Documents', href: '/users/documents', icon: 'lucide:folder' },
						{ label: 'Projects', href: '/users/documents/projects', icon: 'lucide:folder' },
						{ label: 'README.md', icon: 'lucide:file-text' }
					]}
					separatorIcon="lucide:chevron-right"
				/>
			</div>
		</div>

		<!-- E-commerce -->
		<div class="space-y-2">
			<h3 class="text-lg font-medium text-on-surface">E-commerce Category</h3>
			<div
				class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
			>
				<Breadcrumb
					items={[
						{ label: 'Store', href: '/' },
						{ label: 'Electronics', href: '/electronics' },
						{ label: 'Computers & Laptops', href: '/electronics/computers' },
						{ label: 'Gaming Laptops', href: '/electronics/computers/gaming' },
						{ label: 'ASUS ROG Strix G16' }
					]}
				/>
			</div>
		</div>

		<!-- Admin Dashboard -->
		<div class="space-y-2">
			<h3 class="text-lg font-medium text-on-surface">Admin Dashboard</h3>
			<div
				class="rounded-lg border border-outline-variant bg-surface-container-low p-6"
			>
				<Breadcrumb
					ui={{ root: 'bg-surface-container rounded-lg px-4 py-2.5' }}
					items={[
						{ label: 'Admin', href: '/admin', icon: 'lucide:shield' },
						{ label: 'Users', href: '/admin/users', icon: 'lucide:users' },
						{ label: 'John Doe', href: '/admin/users/123', icon: 'lucide:user' },
						{ label: 'Permissions', icon: 'lucide:lock' }
					]}
				/>
			</div>
		</div>
	</section>
</div>
