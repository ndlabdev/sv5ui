<script lang="ts">
	import { User } from '$lib/index.js'

	const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">User</h1>
		<p class="text-on-surface-variant">
			Displays user information with avatar, name, and description.
		</p>
	</div>

	<!-- Basic -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Basic</h2>
		<div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
			<User
				name="John Doe"
				description="Software Engineer"
				avatar={{ src: 'https://i.pravatar.cc/128?u=john', alt: 'John Doe' }}
			/>
			<User
				name="Jane Smith"
				description="Product Designer"
				avatar={{ src: 'https://i.pravatar.cc/128?u=jane', alt: 'Jane Smith' }}
			/>
			<User
				name="Alex Chen"
				avatar={{ alt: 'Alex Chen' }}
			/>
		</div>
	</section>

	<!-- Sizes -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Sizes</h2>
		<div class="space-y-4 rounded-lg bg-surface-container-high p-4">
			{#each sizes as size}
				<div class="flex items-center gap-4">
					<span class="w-10 text-sm text-on-surface-variant">{size}</span>
					<User
						name="John Doe"
						description="Software Engineer"
						avatar={{ src: 'https://i.pravatar.cc/128?u=size-{size}', alt: 'John Doe' }}
						{size}
					/>
				</div>
			{/each}
		</div>
	</section>

	<!-- Orientation -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Orientation</h2>
		<div class="flex flex-wrap gap-8 rounded-lg bg-surface-container-high p-4">
			<div class="space-y-2">
				<p class="text-sm text-on-surface-variant">Horizontal</p>
				<User
					name="John Doe"
					description="Software Engineer"
					avatar={{ src: 'https://i.pravatar.cc/128?u=h', alt: 'John Doe' }}
					orientation="horizontal"
				/>
			</div>
			<div class="space-y-2">
				<p class="text-sm text-on-surface-variant">Vertical</p>
				<User
					name="John Doe"
					description="Software Engineer"
					avatar={{ src: 'https://i.pravatar.cc/128?u=v', alt: 'John Doe' }}
					orientation="vertical"
				/>
			</div>
		</div>
	</section>

	<!-- With Chip -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">With Chip</h2>
		<div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
			<User
				name="Online"
				description="Available"
				avatar={{ src: 'https://i.pravatar.cc/128?u=online', alt: 'Online' }}
				chip={{ color: 'success' }}
			/>
			<User
				name="Busy"
				description="In a meeting"
				avatar={{ src: 'https://i.pravatar.cc/128?u=busy', alt: 'Busy' }}
				chip={{ color: 'error' }}
			/>
			<User
				name="Away"
				description="Be right back"
				avatar={{ src: 'https://i.pravatar.cc/128?u=away', alt: 'Away' }}
				chip={{ color: 'warning' }}
			/>
		</div>
	</section>

	<!-- As Link -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">As Link</h2>
		<div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
			<User
				name="John Doe"
				description="View profile"
				avatar={{ src: 'https://i.pravatar.cc/128?u=link', alt: 'John Doe' }}
				href="/user"
			/>
		</div>
	</section>

	<!-- Clickable -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Clickable</h2>
		<div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
			<User
				name="Click me"
				description="Has onclick handler"
				avatar={{ src: 'https://i.pravatar.cc/128?u=click', alt: 'Click' }}
				onclick={() => alert('Clicked!')}
			/>
		</div>
	</section>

	<!-- UI Slot Overrides -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">UI Slot Overrides</h2>
		<div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
			<User
				name="Custom Name"
				description="Custom description style"
				avatar={{ src: 'https://i.pravatar.cc/128?u=ui1', alt: 'Custom' }}
				ui={{
					name: 'text-primary font-bold',
					description: 'text-tertiary italic'
				}}
			/>
			<User
				name="Bordered"
				description="With root override"
				avatar={{ src: 'https://i.pravatar.cc/128?u=ui2', alt: 'Bordered' }}
				ui={{
					root: 'border border-outline-variant rounded-xl p-3'
				}}
			/>
		</div>
	</section>

	<!-- Real World Examples -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Real World Examples</h2>
		<div class="space-y-6 rounded-lg bg-surface-container-high p-4">
			<!-- User List -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">User List</p>
				<div class="max-w-sm space-y-1 rounded-lg border border-outline-variant bg-surface-container p-2">
					{#each [
						{ name: 'Alice Johnson', desc: 'Admin', u: 'alice' },
						{ name: 'Bob Williams', desc: 'Editor', u: 'bob' },
						{ name: 'Carol Davis', desc: 'Viewer', u: 'carol' }
					] as item}
						<User
							name={item.name}
							description={item.desc}
							avatar={{ src: `https://i.pravatar.cc/128?u=${item.u}`, alt: item.name }}
							onclick={() => alert(item.name)}
							size="sm"
						/>
					{/each}
				</div>
			</div>

			<!-- Comment -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">Comment Header</p>
				<div class="max-w-md rounded-lg border border-outline-variant bg-surface-container p-4">
					<div class="flex items-start justify-between">
						<User
							name="Sarah Chen"
							description="2 hours ago"
							avatar={{ src: 'https://i.pravatar.cc/128?u=sarah', alt: 'Sarah Chen' }}
							size="sm"
						/>
					</div>
					<p class="mt-2 text-sm text-on-surface-variant">
						This looks great! I love the new design direction.
					</p>
				</div>
			</div>

			<!-- Profile Card -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-on-surface-variant">Profile Card</p>
				<div class="max-w-xs rounded-lg border border-outline-variant bg-surface-container p-6">
					<User
						name="Emily Parker"
						description="Senior Developer at Acme Corp"
						avatar={{ src: 'https://i.pravatar.cc/128?u=emily', alt: 'Emily Parker' }}
						orientation="vertical"
						size="xl"
					/>
				</div>
			</div>
		</div>
	</section>
</div>
