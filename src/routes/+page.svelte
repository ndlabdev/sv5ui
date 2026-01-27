<script lang="ts">
	import { toggleMode, mode } from 'mode-watcher'
	import { Button, Icon, Avatar, AvatarGroup, Alert } from '$lib/index.js'

	const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
	const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
	const avatarSizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="min-h-screen bg-surface text-on-surface">
	<!-- Header with Mode Watcher -->
	<header class="sticky top-0 z-50 border-b border-outline-variant bg-surface-container px-6 py-4">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<h1 class="text-2xl font-bold text-primary">SV5UI Components</h1>
			<div class="flex items-center gap-4">
				<span class="text-sm text-on-surface-variant">
					Current: <strong class="capitalize">{mode.current}</strong>
				</span>
				<Button
					variant="outline"
					color="secondary"
					icon={mode.current === 'dark' ? 'lucide:sun' : 'lucide:moon'}
					onclick={toggleMode}
					square
				/>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-6xl space-y-12 p-6">
		<!-- ==================== MODE WATCHER SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Mode Watcher</h2>
			<p class="text-on-surface-variant">
				Toggle between light and dark mode. The theme persists across page reloads.
			</p>
			<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-6">
				<Button variant="solid" color="primary" onclick={toggleMode} leadingIcon="lucide:sun-moon">
					Toggle Mode
				</Button>
				<Button
					variant="outline"
					color="secondary"
					onclick={toggleMode}
					leadingIcon="lucide:sun"
				>
					Light Mode
				</Button>
				<Button
					variant="outline"
					color="secondary"
					onclick={toggleMode}
					leadingIcon="lucide:moon"
				>
					Dark Mode
				</Button>
			</div>
		</section>

		<!-- ==================== ICON SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Icon</h2>
			<p class="text-on-surface-variant">
				Icons powered by Iconify. Supports any icon from the Iconify library.
			</p>

			<!-- Basic Icons -->
			<div class="space-y-2">
				<h3 class="font-medium">Basic Icons</h3>
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
			</div>

			<!-- Icon Sizes -->
			<div class="space-y-2">
				<h3 class="font-medium">Sizes</h3>
				<div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:rocket" size="16" />
						<span class="text-xs text-on-surface-variant">16px</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:rocket" size="20" />
						<span class="text-xs text-on-surface-variant">20px</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:rocket" size="24" />
						<span class="text-xs text-on-surface-variant">24px</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:rocket" size="32" />
						<span class="text-xs text-on-surface-variant">32px</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:rocket" size="48" />
						<span class="text-xs text-on-surface-variant">48px</span>
					</div>
				</div>
			</div>

			<!-- Icon Colors -->
			<div class="space-y-2">
				<h3 class="font-medium">Colors</h3>
				<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
					<Icon name="lucide:circle" size="24" class="text-primary" />
					<Icon name="lucide:circle" size="24" class="text-secondary" />
					<Icon name="lucide:circle" size="24" class="text-tertiary" />
					<Icon name="lucide:circle" size="24" class="text-success" />
					<Icon name="lucide:circle" size="24" class="text-warning" />
					<Icon name="lucide:circle" size="24" class="text-error" />
					<Icon name="lucide:circle" size="24" class="text-info" />
				</div>
			</div>

			<!-- Icon Transformations -->
			<div class="space-y-2">
				<h3 class="font-medium">Transformations</h3>
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
			</div>

			<!-- Icon Sets -->
			<div class="space-y-2">
				<h3 class="font-medium">Different Icon Sets</h3>
				<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
					<div class="flex flex-col items-center gap-1">
						<Icon name="lucide:github" size="24" />
						<span class="text-xs text-on-surface-variant">Lucide</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="mdi:github" size="24" />
						<span class="text-xs text-on-surface-variant">MDI</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="ph:github-logo" size="24" />
						<span class="text-xs text-on-surface-variant">Phosphor</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="tabler:brand-github" size="24" />
						<span class="text-xs text-on-surface-variant">Tabler</span>
					</div>
					<div class="flex flex-col items-center gap-1">
						<Icon name="heroicons:code-bracket" size="24" />
						<span class="text-xs text-on-surface-variant">Heroicons</span>
					</div>
				</div>
			</div>
		</section>

		<!-- ==================== AVATAR SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Avatar</h2>
			<p class="text-on-surface-variant">
				Display user profile images with fallback to initials.
			</p>

			<!-- Basic Avatar -->
			<div class="space-y-2">
				<h3 class="font-medium">Basic Usage</h3>
				<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
					<Avatar src="https://i.pravatar.cc/150?img=1" alt="John Doe" />
					<Avatar src="https://i.pravatar.cc/150?img=2" alt="Jane Smith" />
					<Avatar src="https://i.pravatar.cc/150?img=3" alt="Bob Wilson" />
					<Avatar alt="No Image" />
					<Avatar text="AB" />
				</div>
			</div>

			<!-- Avatar Sizes -->
			<div class="space-y-2">
				<h3 class="font-medium">Sizes</h3>
				<div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
					{#each avatarSizes as size}
						<div class="flex flex-col items-center gap-2">
							<Avatar src="https://i.pravatar.cc/150?img=5" alt="User" {size} />
							<span class="text-xs text-on-surface-variant">{size}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Fallback Initials -->
			<div class="space-y-2">
				<h3 class="font-medium">Fallback Initials</h3>
				<p class="text-sm text-on-surface-variant">
					Auto-generates initials from <code class="rounded bg-surface-container-highest px-1">alt</code> text when no image.
				</p>
				<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
					<Avatar alt="John Doe" size="lg" />
					<Avatar alt="Jane Smith" size="lg" />
					<Avatar alt="Bob" size="lg" />
					<Avatar alt="Alice Brown Carter" size="lg" />
					<Avatar text="XY" size="lg" />
				</div>
			</div>

			<!-- Custom Styling with ui prop -->
			<div class="space-y-2">
				<h3 class="font-medium">Custom Styling</h3>
				<div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
					<Avatar
						src="https://i.pravatar.cc/150?img=10"
						alt="User"
						size="xl"
						class="ring-2 ring-primary ring-offset-2 ring-offset-surface"
					/>
					<Avatar
						src="https://i.pravatar.cc/150?img=11"
						alt="User"
						size="xl"
						class="ring-2 ring-success"
					/>
					<Avatar
						alt="VIP"
						size="xl"
						class="bg-primary"
						ui={{ fallback: 'text-on-primary' }}
					/>
					<Avatar
						alt="Pro"
						size="xl"
						class="bg-linear-to-br from-primary to-tertiary"
						ui={{ fallback: 'text-white font-bold' }}
					/>
				</div>
			</div>

		</section>

		<!-- ==================== AVATAR GROUP SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Avatar Group</h2>
			<p class="text-on-surface-variant">
				Display a stack of overlapping avatars with optional overflow indicator.
			</p>

			<!-- Basic Usage -->
			<div class="space-y-2">
				<h3 class="font-medium">Basic Usage</h3>
				<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
					<AvatarGroup
						avatars={[
							{ src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
							{ src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
							{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
							{ src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' }
						]}
					/>
				</div>
			</div>

			<!-- Max Limit -->
			<div class="space-y-2">
				<h3 class="font-medium">Max Limit</h3>
				<p class="text-sm text-on-surface-variant">
					Use <code class="rounded bg-surface-container-highest px-1">max</code> to limit visible avatars. Excess shown as "+N".
				</p>
				<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
					<AvatarGroup
						max={3}
						avatars={[
							{ src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
							{ src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
							{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
							{ src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
							{ src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' },
							{ src: 'https://i.pravatar.cc/150?img=6', alt: 'User 6' }
						]}
					/>
				</div>
			</div>

			<!-- Sizes -->
			<div class="space-y-2">
				<h3 class="font-medium">Sizes</h3>
				<div class="flex flex-wrap items-end gap-6 rounded-lg bg-surface-container-high p-4">
					{#each avatarSizes as size}
						<div class="flex flex-col items-center gap-2">
							<AvatarGroup
								{size}
								avatars={[
									{ src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
									{ src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
									{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' }
								]}
							/>
							<span class="text-xs text-on-surface-variant">{size}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- With Children -->
			<div class="space-y-2">
				<h3 class="font-medium">With Children</h3>
				<p class="text-sm text-on-surface-variant">
					Use slot content for full control over child avatars.
				</p>
				<div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
					<AvatarGroup size="lg">
						<Avatar src="https://i.pravatar.cc/150?img=10" alt="User A" />
						<Avatar src="https://i.pravatar.cc/150?img=11" alt="User B" />
						<Avatar alt="New" />
					</AvatarGroup>
				</div>
			</div>
		</section>

		<!-- ==================== ALERT SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Alert</h2>
			<p class="text-on-surface-variant">
				Callout component to draw user's attention with customizable styling and interactive elements.
			</p>

			<!-- Basic Usage -->
			<div class="space-y-2">
				<h3 class="font-medium">Basic Usage</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert title="Information" description="This is a basic alert with title and description." />
					<Alert description="Alert with description only." />
					<Alert title="Alert with title only" />
				</div>
			</div>

			<!-- Variants -->
			<div class="space-y-2">
				<h3 class="font-medium">Variants</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert variant="solid" title="Solid" description="Filled background with contrasting text." />
					<Alert variant="outline" title="Outline" description="Border only with transparent background." />
					<Alert variant="soft" title="Soft" description="Light colored background." />
					<Alert variant="subtle" title="Subtle" description="Light background with border." />
				</div>
			</div>

			<!-- Colors -->
			<div class="space-y-2">
				<h3 class="font-medium">Colors</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert color="primary" title="Primary" description="Primary color alert." />
					<Alert color="secondary" title="Secondary" description="Secondary color alert." />
					<Alert color="success" title="Success" description="Operation completed successfully." />
					<Alert color="warning" title="Warning" description="Please review before proceeding." />
					<Alert color="error" title="Error" description="Something went wrong." />
					<Alert color="info" title="Info" description="Here's some useful information." />
				</div>
			</div>

			<!-- With Icons -->
			<div class="space-y-2">
				<h3 class="font-medium">With Icons</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert
						color="info"
						icon="lucide:info"
						title="Information"
						description="This alert includes an icon for visual emphasis."
					/>
					<Alert
						color="success"
						icon="lucide:check-circle"
						title="Success"
						description="Your changes have been saved."
					/>
					<Alert
						color="warning"
						icon="lucide:alert-triangle"
						title="Warning"
						description="Your session will expire in 5 minutes."
					/>
					<Alert
						color="error"
						icon="lucide:x-circle"
						title="Error"
						description="Failed to connect to server."
					/>
				</div>
			</div>

			<!-- With Avatar -->
			<div class="space-y-2">
				<h3 class="font-medium">With Avatar</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert
						avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John' }}
						title="John Doe"
						description="Sent you a message: 'Hey, are you available for a quick call?'"
					/>
					<Alert
						color="success"
						avatar={{ alt: 'System' }}
						title="System Update"
						description="A new version is available."
					/>
				</div>
			</div>

			<!-- With Close Button -->
			<div class="space-y-2">
				<h3 class="font-medium">With Close Button</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert
						icon="lucide:bell"
						title="Notification"
						description="You have 3 new messages."
						close
					/>
					<Alert
						color="warning"
						icon="lucide:alert-triangle"
						title="Dismissible Warning"
						description="This alert can be dismissed."
						close
					/>
				</div>
			</div>

			<!-- With Actions -->
			<div class="space-y-2">
				<h3 class="font-medium">With Actions</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<Alert
						icon="lucide:download"
						title="Update Available"
						description="A new version of the app is ready to install."
						actions={[
							{ label: 'Update Now' },
							{ label: 'Later', variant: 'ghost' }
						]}
					/>
					<Alert
						color="error"
						icon="lucide:trash-2"
						title="Delete Item?"
						description="This action cannot be undone."
						actions={[
							{ label: 'Delete', color: 'error' },
							{ label: 'Cancel', variant: 'ghost' }
						]}
					/>
				</div>
			</div>

			<!-- Vertical Orientation -->
			<div class="space-y-2">
				<h3 class="font-medium">Vertical Orientation</h3>
				<div class="grid gap-3 rounded-lg bg-surface-container-high p-4 md:grid-cols-2">
					<Alert
						orientation="vertical"
						icon="lucide:cloud-upload"
						title="Upload Complete"
						description="Your files have been uploaded successfully."
						actions={[{ label: 'View Files' }]}
					/>
					<Alert
						orientation="vertical"
						color="warning"
						icon="lucide:shield-alert"
						title="Security Alert"
						description="Unusual login activity detected on your account."
						actions={[
							{ label: 'Review Activity' },
							{ label: 'Ignore', variant: 'ghost' }
						]}
						close
					/>
				</div>
			</div>

			<!-- Variants x Colors Matrix -->
			<div class="space-y-2">
				<h3 class="font-medium">Variants × Colors</h3>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-outline-variant">
								<th class="px-2 py-3 text-left text-sm font-medium text-on-surface-variant">
									Variant
								</th>
								{#each ['primary', 'success', 'warning', 'error', 'info'] as color}
									<th class="px-2 py-3 text-center text-sm font-medium capitalize text-on-surface-variant">
										{color}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each ['solid', 'outline', 'soft', 'subtle'] as variant}
								<tr class="border-b border-outline-variant/50">
									<td class="px-2 py-3 text-sm font-medium capitalize text-on-surface-variant">
										{variant}
									</td>
									{#each ['primary', 'success', 'warning', 'error', 'info'] as color}
										<td class="px-2 py-3">
											<Alert {variant} {color} title={color} class="min-w-48" />
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Real World Examples -->
			<div class="space-y-2">
				<h3 class="font-medium">Real World Examples</h3>
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<!-- Cookie Banner -->
					<Alert
						variant="subtle"
						icon="lucide:cookie"
						title="We use cookies"
						description="This website uses cookies to ensure you get the best experience."
						actions={[
							{ label: 'Accept All' },
							{ label: 'Customize', variant: 'outline' }
						]}
					/>

					<!-- Trial Expiration -->
					<Alert
						color="warning"
						variant="soft"
						icon="lucide:clock"
						title="Trial Ending Soon"
						description="Your free trial expires in 3 days. Upgrade now to keep your data."
						actions={[{ label: 'Upgrade', color: 'warning' }]}
						close
					/>

					<!-- Success Message -->
					<Alert
						color="success"
						variant="soft"
						icon="lucide:check-circle"
						title="Payment Successful"
						description="Thank you for your purchase! A confirmation email has been sent."
						close
					/>

					<!-- Error with Retry -->
					<Alert
						color="error"
						variant="outline"
						icon="lucide:wifi-off"
						title="Connection Lost"
						description="Unable to connect to the server. Please check your internet connection."
						actions={[
							{ label: 'Retry', leadingIcon: 'lucide:refresh-cw' },
							{ label: 'Work Offline', variant: 'ghost' }
						]}
					/>
				</div>
			</div>
		</section>

		<!-- ==================== BUTTON SECTION ==================== -->
		<section class="space-y-6">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Button</h2>

			<!-- Variants x Colors Matrix -->
			<div class="space-y-2">
				<h3 class="font-medium">Variants & Colors</h3>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-outline-variant">
								<th class="px-2 py-3 text-left text-sm font-medium text-on-surface-variant">
									Variant
								</th>
								{#each colors as color}
									<th
										class="px-2 py-3 text-center text-sm font-medium capitalize text-on-surface-variant"
									>
										{color}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each variants as variant}
								<tr class="border-b border-outline-variant/50">
									<td class="px-2 py-3 text-sm font-medium capitalize text-on-surface-variant">
										{variant}
									</td>
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
			</div>

			<!-- Sizes -->
			<div class="space-y-2">
				<h3 class="font-medium">Sizes</h3>
				<div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
					{#each sizes as size}
						<Button variant="solid" color="primary" {size} label={size.toUpperCase()} />
					{/each}
				</div>
			</div>

			<!-- With Icons -->
			<div class="space-y-2">
				<h3 class="font-medium">With Icons</h3>
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<Button variant="solid" color="primary" leadingIcon="lucide:plus" label="Add Item" />
					<Button variant="outline" color="secondary" trailingIcon="lucide:arrow-right" label="Next" />
					<Button
						variant="soft"
						color="success"
						leadingIcon="lucide:check"
						trailingIcon="lucide:chevron-down"
						label="Confirm"
					/>
					<Button variant="ghost" color="error" leadingIcon="lucide:trash-2" label="Delete" />
				</div>
			</div>

			<!-- Icon Only (Square) -->
			<div class="space-y-2">
				<h3 class="font-medium">Icon Only (Square)</h3>
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
			</div>

			<!-- Loading States -->
			<div class="space-y-2">
				<h3 class="font-medium">Loading States</h3>
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<Button variant="solid" color="primary" loading label="Loading..." />
					<Button variant="outline" color="secondary" loading label="Processing" />
					<Button variant="soft" color="success" loading icon="lucide:loader-2" square />
					<Button variant="solid" color="info" loading trailing label="Uploading" />
				</div>
			</div>

			<!-- Disabled States -->
			<div class="space-y-2">
				<h3 class="font-medium">Disabled States</h3>
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<Button variant="solid" color="primary" disabled label="Disabled" />
					<Button variant="outline" color="secondary" disabled label="Disabled" />
					<Button variant="soft" color="success" disabled label="Disabled" />
					<Button variant="subtle" color="warning" disabled label="Disabled" />
					<Button variant="ghost" color="error" disabled label="Disabled" />
					<Button variant="link" color="info" disabled label="Disabled" />
				</div>
			</div>

			<!-- Block (Full Width) -->
			<div class="space-y-2">
				<h3 class="font-medium">Block (Full Width)</h3>
				<div class="space-y-2 rounded-lg bg-surface-container-high p-4">
					<Button variant="solid" color="primary" block label="Full Width Button" />
					<Button
						variant="outline"
						color="secondary"
						block
						leadingIcon="lucide:mail"
						trailingIcon="lucide:arrow-right"
						label="Send Email"
					/>
				</div>
			</div>

			<!-- Button with Children Slot -->
			<div class="space-y-2">
				<h3 class="font-medium">Custom Content (Children Slot)</h3>
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
			</div>

			<!-- Button with Avatar -->
			<div class="space-y-2">
				<h3 class="font-medium">With Avatar</h3>
				<p class="text-sm text-on-surface-variant">
					Use the <code class="rounded bg-surface-container-highest px-1">avatar</code> prop to display an avatar before the label. Size is auto-resolved from button size.
				</p>
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<Button
						variant="soft"
						color="primary"
						avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John' }}
						label="John Doe"
					/>
					<Button
						variant="outline"
						color="secondary"
						avatar={{ src: 'https://i.pravatar.cc/150?img=2', alt: 'Jane' }}
						label="Jane Smith"
					/>
					<Button
						variant="solid"
						color="tertiary"
						avatar={{ alt: 'New' }}
						label="New User"
					/>
					<Button
						variant="ghost"
						color="secondary"
						avatar={{ src: 'https://i.pravatar.cc/150?img=5', alt: 'User' }}
						label="Profile"
						trailingIcon="lucide:chevron-down"
					/>
				</div>

				<!-- Avatar sizes across button sizes -->
				<div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
					{#each sizes as size}
						<Button
							variant="soft"
							color="primary"
							{size}
							avatar={{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User' }}
							label={size.toUpperCase()}
						/>
					{/each}
				</div>

				<!-- User menu style -->
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<Button
						variant="soft"
						color="primary"
						size="lg"
						avatar={{ src: 'https://i.pravatar.cc/150?img=8', alt: 'Alice' }}
						trailingIcon="lucide:chevron-down"
					>
						<span class="flex flex-col items-start text-left">
							<span class="text-sm font-medium">Alice Johnson</span>
							<span class="text-xs opacity-70">alice@example.com</span>
						</span>
					</Button>
					<Button
						variant="outline"
						color="success"
						avatar={{ alt: 'TM' }}
						label="Team Alpha"
					/>
					<Button
						variant="subtle"
						color="info"
						avatar={{ src: 'https://i.pravatar.cc/150?img=12', alt: 'Bot' }}
						label="AI Assistant"
						trailingIcon="lucide:sparkles"
					/>
				</div>
			</div>

			<!-- Leading & Trailing Slots -->
			<div class="space-y-2">
				<h3 class="font-medium">Leading & Trailing Slots</h3>
				<p class="text-sm text-on-surface-variant">
					Use <code class="rounded bg-surface-container-highest px-1">leadingSlot</code> and
					<code class="rounded bg-surface-container-highest px-1">trailingSlot</code> for custom content.
				</p>
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<!-- Avatar + Label -->
					{#snippet avatarSlot()}
						<img
							src="https://i.pravatar.cc/32?img=1"
							alt="User"
							class="size-5 rounded-full object-cover"
						/>
					{/snippet}
					<Button variant="soft" color="primary" leadingSlot={avatarSlot} label="John Doe" />

					<!-- Status Indicator -->
					{#snippet statusSlot()}
						<span class="relative flex size-2">
							<span
								class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
							></span>
							<span class="relative inline-flex size-2 rounded-full bg-success"></span>
						</span>
					{/snippet}
					<Button variant="outline" color="success" leadingSlot={statusSlot} label="Online" />

					<!-- Badge Counter -->
					{#snippet badgeSlot()}
						<span
							class="flex size-5 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error"
						>
							3
						</span>
					{/snippet}
					<Button
						variant="ghost"
						color="secondary"
						leadingIcon="lucide:bell"
						trailingSlot={badgeSlot}
						label="Notifications"
					/>

					<!-- Keyboard Shortcut -->
					{#snippet kbdSlot()}
						<kbd
							class="rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 font-mono text-xs text-on-surface-variant"
						>
							⌘K
						</kbd>
					{/snippet}
					<Button
						variant="outline"
						color="secondary"
						leadingIcon="lucide:search"
						trailingSlot={kbdSlot}
						label="Search"
					/>
				</div>

				<!-- More Slot Examples -->
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					<!-- Emoji Leading -->
					{#snippet emojiSlot()}
						<span class="text-base">🚀</span>
					{/snippet}
					<Button variant="solid" color="tertiary" leadingSlot={emojiSlot} label="Launch" />

					<!-- Custom Icon with Animation -->
					{#snippet pulseIconSlot()}
						<span class="relative">
							<Icon name="lucide:heart" size="18" class="animate-pulse text-error" />
						</span>
					{/snippet}
					<Button variant="soft" color="error" leadingSlot={pulseIconSlot} label="Like" />

					<!-- Multiple Avatars (Avatar Stack) -->
					{#snippet avatarStackSlot()}
						<div class="flex -space-x-2">
							<img
								src="https://i.pravatar.cc/24?img=1"
								alt="User 1"
								class="size-5 rounded-full border-2 border-surface object-cover"
							/>
							<img
								src="https://i.pravatar.cc/24?img=2"
								alt="User 2"
								class="size-5 rounded-full border-2 border-surface object-cover"
							/>
							<img
								src="https://i.pravatar.cc/24?img=3"
								alt="User 3"
								class="size-5 rounded-full border-2 border-surface object-cover"
							/>
						</div>
					{/snippet}
					<Button variant="outline" color="info" leadingSlot={avatarStackSlot} label="3 members" />

					<!-- Dropdown Indicator -->
					{#snippet dropdownSlot()}
						<Icon name="lucide:chevron-down" size="16" class="transition-transform" />
					{/snippet}
					<Button
						variant="soft"
						color="secondary"
						trailingSlot={dropdownSlot}
						label="Select Option"
					/>

					<!-- External Link Indicator -->
					{#snippet externalSlot()}
						<Icon name="lucide:external-link" size="14" class="opacity-60" />
					{/snippet}
					<Button variant="link" color="primary" trailingSlot={externalSlot} label="Documentation" />
				</div>

				<!-- Combined Slots Example -->
				<div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
					{#snippet userAvatarSlot()}
						<img
							src="https://i.pravatar.cc/32?img=5"
							alt="User"
							class="size-6 rounded-full object-cover ring-2 ring-primary/20"
						/>
					{/snippet}
					{#snippet verifiedSlot()}
						<Icon name="lucide:badge-check" size="16" class="text-info" />
					{/snippet}
					<Button
						variant="outline"
						color="primary"
						size="lg"
						leadingSlot={userAvatarSlot}
						trailingSlot={verifiedSlot}
						label="Verified User"
					/>

					{#snippet logoSlot()}
						<div class="flex size-5 items-center justify-center rounded bg-on-surface">
							<Icon name="lucide:github" size="14" class="text-surface" />
						</div>
					{/snippet}
					{#snippet starSlot()}
						<span class="flex items-center gap-1 text-xs text-warning">
							<Icon name="lucide:star" size="12" />
							<span>4.5k</span>
						</span>
					{/snippet}
					<Button
						variant="outline"
						color="secondary"
						leadingSlot={logoSlot}
						trailingSlot={starSlot}
						label="Star on GitHub"
					/>
				</div>
			</div>

			<!-- Real World Examples -->
			<div class="space-y-2">
				<h3 class="font-medium">Real World Examples</h3>
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
			</div>

			<!-- UI Prop (Fine-grained Class Overrides) -->
			<div class="space-y-2">
				<h3 class="font-medium">UI Prop (Fine-grained Class Overrides)</h3>
				<p class="text-sm text-on-surface-variant">
					Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to override
					classes for specific button slots:
					<code class="rounded bg-surface-container-highest px-1">base</code>,
					<code class="rounded bg-surface-container-highest px-1">label</code>,
					<code class="rounded bg-surface-container-highest px-1">leadingIcon</code>,
					<code class="rounded bg-surface-container-highest px-1">trailingIcon</code>.
				</p>

				<!-- Custom Base Styles -->
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<h4 class="text-sm font-medium text-on-surface-variant">Custom Base Styles</h4>
					<div class="flex flex-wrap items-center gap-3">
						<!-- Rounded Full -->
						<Button
							variant="solid"
							color="primary"
							label="Pill Button"
                            class="rounded-full"
						/>

						<!-- Extra Padding -->
						<Button
							variant="outline"
							color="secondary"
							label="Extra Padding"
							ui={{ base: 'px-8 py-4' }}
						/>

						<!-- Custom Shadow -->
						<Button
							variant="solid"
							color="tertiary"
							label="With Shadow"
							ui={{ base: 'shadow-lg shadow-tertiary/30' }}
						/>

						<!-- Gradient Background -->
						<Button
							variant="solid"
							color="primary"
							label="Gradient"
							ui={{ base: 'bg-linear-to-r from-primary to-tertiary hover:from-primary/90 hover:to-tertiary/90' }}
						/>

						<!-- Border Dashed -->
						<Button
							variant="outline"
							color="warning"
							label="Dashed Border"
							ui={{ base: 'border-2 border-dashed ring-0' }}
						/>
					</div>
				</div>

				<!-- Custom Label Styles -->
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<h4 class="text-sm font-medium text-on-surface-variant">Custom Label Styles</h4>
					<div class="flex flex-wrap items-center gap-3">
						<!-- Uppercase -->
						<Button
							variant="solid"
							color="primary"
							label="Uppercase"
							ui={{ label: 'uppercase tracking-wider' }}
						/>

						<!-- Italic -->
						<Button
							variant="outline"
							color="secondary"
							label="Italic Text"
							ui={{ label: 'italic' }}
						/>

						<!-- Font Mono -->
						<Button
							variant="soft"
							color="success"
							label="monospace"
							ui={{ label: 'font-mono' }}
						/>

						<!-- Underline -->
						<Button
							variant="ghost"
							color="info"
							label="Underlined"
							ui={{ label: 'underline underline-offset-2' }}
						/>

						<!-- Text Gradient -->
						<Button
							variant="ghost"
							color="primary"
							label="Gradient Text"
							ui={{ label: 'bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent' }}
						/>
					</div>
				</div>

				<!-- Custom Icon Styles -->
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<h4 class="text-sm font-medium text-on-surface-variant">Custom Icon Styles</h4>
					<div class="flex flex-wrap items-center gap-3">
						<!-- Larger Leading Icon -->
						<Button
							variant="solid"
							color="primary"
							leadingIcon="lucide:rocket"
							label="Large Icon"
							ui={{ leadingIcon: 'size-6' }}
						/>

						<!-- Rotating Icon -->
						<Button
							variant="outline"
							color="secondary"
							leadingIcon="lucide:settings"
							label="Hover Rotate"
							ui={{ leadingIcon: 'transition-transform duration-300 group-hover:rotate-90' }}
							class="group"
						/>

						<!-- Bouncing Icon -->
						<Button
							variant="soft"
							color="success"
							leadingIcon="lucide:bell"
							label="Bouncing"
							ui={{ leadingIcon: 'animate-bounce' }}
						/>

						<!-- Different Icon Color -->
						<Button
							variant="outline"
							color="secondary"
							leadingIcon="lucide:heart"
							label="Colored Icon"
							ui={{ leadingIcon: 'text-error' }}
						/>

						<!-- Trailing Icon Animation -->
						<Button
							variant="solid"
							color="info"
							trailingIcon="lucide:arrow-right"
							label="Hover Slide"
							ui={{ trailingIcon: 'transition-transform duration-200 group-hover:translate-x-1' }}
							class="group"
						/>
					</div>
				</div>

				<!-- Combined UI Overrides -->
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<h4 class="text-sm font-medium text-on-surface-variant">Combined Overrides</h4>
					<div class="flex flex-wrap items-center gap-3">
						<!-- Fancy Button -->
						<Button
							variant="solid"
							color="primary"
							leadingIcon="lucide:sparkles"
							label="Fancy Button"
							ui={{
								base: 'rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-200',
								label: 'font-semibold tracking-wide',
								leadingIcon: 'animate-pulse'
							}}
						/>

						<!-- Minimal Button -->
						<Button
							variant="ghost"
							color="secondary"
							leadingIcon="lucide:menu"
							label="Minimal"
							ui={{
								base: 'rounded-none border-b-2 border-transparent hover:border-secondary hover:bg-transparent',
								label: 'text-xs uppercase tracking-widest',
								leadingIcon: 'size-4'
							}}
						/>

						<!-- Neon Button -->
						<Button
							variant="outline"
							color="success"
							leadingIcon="lucide:zap"
							label="Neon Effect"
							ui={{
								base: 'rounded-lg ring-2 ring-success shadow-[0_0_15px_rgba(var(--color-success),0.5)] hover:shadow-[0_0_25px_rgba(var(--color-success),0.7)]',
								label: 'font-bold',
								leadingIcon: 'animate-pulse'
							}}
						/>

						<!-- Retro Button -->
						<Button
							variant="solid"
							color="warning"
							label="Retro Style"
							ui={{
								base: 'rounded-none border-b-4 border-r-4 border-warning/50 active:border-b-0 active:border-r-0 active:border-t-4 active:border-l-4',
								label: 'font-mono uppercase'
							}}
						/>
					</div>
				</div>

				<!-- Practical Examples -->
				<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
					<h4 class="text-sm font-medium text-on-surface-variant">Practical Examples</h4>
					<div class="flex flex-wrap items-center gap-3">
						<!-- CTA Button -->
						<Button
							variant="solid"
							color="primary"
							size="lg"
							leadingIcon="lucide:download"
							label="Download Now"
							ui={{
								base: 'rounded-full px-8 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow',
								label: 'font-semibold'
							}}
						/>

						<!-- Destructive Action -->
						<Button
							variant="outline"
							color="error"
							leadingIcon="lucide:trash-2"
							label="Delete Account"
							ui={{
								base: 'border-2 hover:bg-error hover:text-on-error transition-colors',
								leadingIcon: 'group-hover:animate-shake'
							}}
							class="group"
						/>

						<!-- Success Action -->
						<Button
							variant="soft"
							color="success"
							leadingIcon="lucide:check-circle"
							trailingIcon="lucide:arrow-right"
							label="Continue"
							ui={{
								base: 'pr-4',
								trailingIcon: 'transition-transform group-hover:translate-x-1'
							}}
							class="group"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- ==================== GETTING STARTED SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Getting Started</h2>
			<p class="text-on-surface-variant">
				Quick setup guide for SV5UI.
			</p>

			<!-- Step 1: Install -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Step 1: Install</h3>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">npm install sv5ui</code></pre>
				</div>
			</div>

			<!-- Step 2: Setup Layout -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Step 2: Setup Layout</h3>
				<p class="text-sm text-on-surface-variant">
					Import theme CSS and ModeWatcher in your root layout:
				</p>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{'// src/routes/+layout.svelte\n<script>\n    import \'sv5ui/theme.css\'          // Theme with dark mode support\n    import { ModeWatcher } from \'sv5ui\' // Dark mode handler\n<\/script>\n\n<ModeWatcher \/>\n<slot \/>'}</code></pre>
				</div>
			</div>

			<!-- Step 3: Use Components -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Step 3: Use Components</h3>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{'<script>\n    import { Button, Icon, toggleMode } from \'sv5ui\'\n<\/script>\n\n<Button label="Click me" \/>\n<Button variant="outline" color="error" label="Delete" \/>\n<Button icon="lucide:moon" onclick={toggleMode} square \/>'}</code></pre>
				</div>
			</div>

			<!-- That's it! -->
			<div class="rounded-lg bg-success-container p-4 text-on-success-container">
				<p class="font-medium">Done! Theme, dark mode, and components are ready to use.</p>
			</div>
		</section>

		<!-- ==================== CUSTOMIZATION SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Customization (Optional)</h2>
			<p class="text-on-surface-variant">
				Customize defaults and colors when needed.
			</p>

			<!-- Custom Defaults -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Custom Component Defaults</h3>
				<p class="text-sm text-on-surface-variant">
					Create a config file to change default props:
				</p>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{`// src/sv5ui.config.ts
import { defineConfig } from 'sv5ui'

defineConfig({
    button: {
        variant: 'outline',  // Change default variant
        color: 'secondary',  // Change default color
        size: 'sm'           // Change default size
    }
})`}</code></pre>
				</div>
				<p class="mt-2 text-sm text-on-surface-variant">
					Then import it in your layout:
				</p>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{'// +layout.svelte\n<script>\n    import \'sv5ui/theme.css\'\n    import \'../sv5ui.config\'  // Add this line\n    import { ModeWatcher } from \'sv5ui\'\n<\/script>'}</code></pre>
				</div>
			</div>

			<!-- Custom Colors -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Custom Colors</h3>
				<p class="text-sm text-on-surface-variant">
					Override theme colors in your own CSS file (after importing theme.css):
				</p>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{`/* src/app.css */
:root {
    --color-primary: oklch(0.6 0.2 260);
    --color-on-primary: oklch(1 0 0);
}

.dark {
    --color-primary: oklch(0.75 0.15 260);
}`}</code></pre>
				</div>
			</div>

			<!-- Reset Config -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Reset Config</h3>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{`import { resetConfig } from 'sv5ui'

// Reset to library defaults
resetConfig()`}</code></pre>
				</div>
			</div>

			<!-- Customizing Variants -->
			<div class="space-y-3 rounded-lg bg-surface-container-high p-4">
				<h3 class="font-medium">Customizing Variants (button.variants.ts)</h3>
				<p class="text-sm text-on-surface-variant">
					To add new variants or modify existing ones, edit the <code class="rounded bg-surface-container-highest px-1">button.variants.ts</code> file:
				</p>
				<div class="rounded-lg bg-surface-container-highest p-4">
					<pre class="overflow-x-auto text-sm"><code class="text-on-surface">{`// src/lib/Button/button.variants.ts
export const buttonVariants = tv({
    variants: {
        variant: {
            solid: '',
            outline: '',
            soft: '',
            // Add your custom variant
            gradient: '',
        },
        // ...
    },
    compoundVariants: [
        // Add styles for your custom variant
        {
            variant: 'gradient',
            color: 'primary',
            class: {
                base: 'bg-linear-to-r from-primary to-tertiary text-on-primary'
            }
        },
        // ...
    ]
})`}</code></pre>
				</div>
			</div>
		</section>

		<!-- ==================== COLOR PALETTE SECTION ==================== -->
		<section class="space-y-4">
			<h2 class="border-b border-outline-variant pb-2 text-xl font-semibold">Color Palette</h2>
			<p class="text-on-surface-variant">Material Design 3 inspired color tokens used in the theme.</p>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each colors as color}
					<div class="overflow-hidden rounded-lg border border-outline-variant">
						<div class="bg-{color} text-on-{color} p-4 font-medium capitalize">{color}</div>
						<div class="bg-{color}-container text-on-{color}-container p-4 text-sm">
							{color}-container
						</div>
					</div>
				{/each}

				<!-- Surface colors -->
				<div class="overflow-hidden rounded-lg border border-outline-variant">
					<div class="bg-surface text-on-surface p-4 font-medium">Surface</div>
					<div class="bg-surface-container text-on-surface p-4 text-sm">surface-container</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-outline-variant bg-surface-container px-6 py-8">
		<div class="mx-auto max-w-6xl text-center text-sm text-on-surface-variant">
			<p>SV5UI - Svelte 5 UI Component Library</p>
			<p class="mt-1">Built with Tailwind CSS v4 & Material Design 3</p>
		</div>
	</footer>
</div>
