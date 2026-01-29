<script lang="ts">
	import { ModeWatcher } from 'mode-watcher'
	import { toggleMode, mode } from 'mode-watcher'
	import { Button, Icon, Link } from '$lib/index.js'
	import './layout.css'
	import '../sv5ui.config.js'

	const { children } = $props()

	const navItems = [
		{ href: '/', label: 'Home', icon: 'lucide:home', exact: true },
		{ href: '/icon', label: 'Icon', icon: 'lucide:shapes' },
		{ href: '/avatar', label: 'Avatar', icon: 'lucide:circle-user' },
		{ href: '/avatar-group', label: 'Avatar Group', icon: 'lucide:users' },
		{ href: '/alert', label: 'Alert', icon: 'lucide:bell' },
		{ href: '/card', label: 'Card', icon: 'lucide:square' },
		{ href: '/link', label: 'Link', icon: 'lucide:link' },
		{ href: '/button', label: 'Button', icon: 'lucide:mouse-pointer-click' },
		{ href: '/separator', label: 'Separator', icon: 'lucide:minus' },
		{ href: '/chip', label: 'Chip', icon: 'lucide:circle-dot' },
		{ href: '/progress', label: 'Progress', icon: 'lucide:loader' },
		{ href: '/badge', label: 'Badge', icon: 'lucide:tag' },
		{ href: '/container', label: 'Container', icon: 'lucide:box' }
	]

	const docItems = [
		{ href: '/getting-started', label: 'Getting Started', icon: 'lucide:rocket' },
		{ href: '/customization', label: 'Customization', icon: 'lucide:palette' },
		{ href: '/colors', label: 'Colors', icon: 'lucide:paintbrush' }
	]

	let sidebarOpen = $state(false)
</script>

<ModeWatcher />

<div class="min-h-screen bg-surface text-on-surface">
	<!-- Header -->
	<header class="sticky top-0 z-50 border-b border-outline-variant bg-surface-container px-4 py-3 lg:px-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<button
					class="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-high lg:hidden"
					onclick={() => (sidebarOpen = !sidebarOpen)}
				>
					<Icon name="lucide:menu" size="20" />
				</button>
				<a href="/" class="text-xl font-bold text-primary">SV5UI</a>
				<span class="hidden text-sm text-on-surface-variant sm:inline">Svelte 5 UI Components</span>
			</div>
			<div class="flex items-center gap-3">
				<span class="hidden text-sm text-on-surface-variant sm:inline capitalize">
					{mode.current}
				</span>
				<Button
					variant="ghost"
					color="secondary"
					icon={mode.current === 'dark' ? 'lucide:sun' : 'lucide:moon'}
					onclick={toggleMode}
					square
					size="sm"
				/>
			</div>
		</div>
	</header>

	<div class="flex">
		<!-- Sidebar Overlay (mobile) -->
		{#if sidebarOpen}
			<button
				class="fixed inset-0 z-30 bg-black/50 lg:hidden"
				onclick={() => (sidebarOpen = false)}
				aria-label="Close sidebar"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside
			class="fixed top-[57px] left-0 z-40 h-[calc(100vh-57px)] w-64 shrink-0 overflow-y-auto border-r border-outline-variant bg-surface-container transition-transform duration-200 lg:sticky lg:translate-x-0 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
		>
			<nav class="p-4">
				<p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
					Components
				</p>
				<div class="flex flex-col gap-0.5">
					{#each navItems as item}
						<Link
							href={item.href}
							raw
							exact={item.exact}
							activeClass="bg-primary-container text-on-primary-container font-medium"
							inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
							onclick={() => (sidebarOpen = false)}
						>
							<Icon name={item.icon} size="18" />
							{item.label}
						</Link>
					{/each}
				</div>

				<p class="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
					Guides
				</p>
				<div class="flex flex-col gap-0.5">
					{#each docItems as item}
						<Link
							href={item.href}
							raw
							activeClass="bg-primary-container text-on-primary-container font-medium"
							inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
							onclick={() => (sidebarOpen = false)}
						>
							<Icon name={item.icon} size="18" />
							{item.label}
						</Link>
					{/each}
				</div>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="min-h-[calc(100vh-57px)] flex-1 p-6 lg:p-8">
			<div class="mx-auto max-w-5xl">
				{@render children()}
			</div>
		</main>
	</div>
</div>
