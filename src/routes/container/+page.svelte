<script lang="ts">
	import { Container } from '$lib/index.js'
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Container</h1>
		<p class="text-on-surface-variant">
			Layout component that centers and constrains content width with responsive padding.
		</p>
	</div>

	<!-- Basic -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Basic</h2>
		<div class="rounded-lg bg-surface-container-high p-4">
			<Container class="bg-primary-container/30 rounded-lg py-4 text-center">
				<p class="text-on-primary-container">Content is centered with max-w-7xl and responsive padding.</p>
			</Container>
		</div>
	</section>

	<!-- Semantic Elements -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Semantic Elements</h2>
		<p class="text-sm text-on-surface-variant">
			Use the <code class="rounded bg-surface-container-highest px-1">as</code> prop to render as different HTML elements.
		</p>
		<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
			<Container as="section" class="bg-secondary-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-secondary-container">Rendered as &lt;section&gt;</p>
			</Container>
			<Container as="main" class="bg-tertiary-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-tertiary-container">Rendered as &lt;main&gt;</p>
			</Container>
			<Container as="article" class="bg-success-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-success-container">Rendered as &lt;article&gt;</p>
			</Container>
			<Container as="nav" class="bg-info-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-info-container">Rendered as &lt;nav&gt;</p>
			</Container>
		</div>
	</section>

	<!-- UI Slot Overrides -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">UI Slot Overrides</h2>
		<p class="text-sm text-on-surface-variant">
			Override the default max-width and padding using the <code class="rounded bg-surface-container-highest px-1">ui</code> prop.
		</p>
		<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
			<Container ui={{ root: 'max-w-sm' }} class="bg-warning-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-warning-container">max-w-sm</p>
			</Container>
			<Container ui={{ root: 'max-w-xl' }} class="bg-primary-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-primary-container">max-w-xl</p>
			</Container>
			<Container ui={{ root: 'max-w-3xl' }} class="bg-secondary-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-secondary-container">max-w-3xl</p>
			</Container>
			<Container class="bg-tertiary-container/30 rounded-lg py-3 text-center">
				<p class="text-sm text-on-tertiary-container">max-w-7xl (default)</p>
			</Container>
		</div>
	</section>

	<!-- Custom Class -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Custom Class</h2>
		<div class="rounded-lg bg-surface-container-high p-4">
			<Container class="rounded-xl border border-outline-variant bg-surface-container p-6">
				<h3 class="mb-2 font-medium">Card-like Container</h3>
				<p class="text-sm text-on-surface-variant">
					Combine Container with custom classes to create card-like layouts with consistent max-width.
				</p>
			</Container>
		</div>
	</section>

	<!-- Real World Examples -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Real World Examples</h2>
		<div class="space-y-6 rounded-lg bg-surface-container-high p-4">
			<!-- Page Layout -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">Page Header</p>
				<Container as="header" class="rounded-lg border border-outline-variant bg-surface-container py-4">
					<div class="flex items-center justify-between">
						<span class="font-bold text-primary">Logo</span>
						<div class="flex gap-4 text-sm text-on-surface-variant">
							<span>Home</span>
							<span>About</span>
							<span>Contact</span>
						</div>
					</div>
				</Container>
			</div>

			<!-- Content Section -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">Content Section</p>
				<Container as="section" ui={{ root: 'max-w-3xl' }} class="rounded-lg border border-outline-variant bg-surface-container py-6">
					<h3 class="mb-2 text-lg font-semibold">Article Title</h3>
					<p class="text-sm text-on-surface-variant">
						A narrow container is ideal for long-form content like blog posts and articles,
						keeping the line length readable and comfortable.
					</p>
				</Container>
			</div>

			<!-- Footer -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">Footer</p>
				<Container as="footer" class="rounded-lg border border-outline-variant bg-surface-container py-4">
					<div class="flex items-center justify-between text-sm text-on-surface-variant">
						<span>&copy; 2026 SV5UI</span>
						<div class="flex gap-4">
							<span>Privacy</span>
							<span>Terms</span>
						</div>
					</div>
				</Container>
			</div>
		</div>
	</section>
</div>
