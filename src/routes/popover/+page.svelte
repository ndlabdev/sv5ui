<script lang="ts">
    import { Popover, Button, Badge, Icon, Separator } from '$lib/index.js'

    let controlledOpen = $state(false)
</script>

<div class="space-y-12">
    <header>
        <h1 class="text-3xl font-bold text-on-surface">Popover</h1>
        <p class="mt-2 text-on-surface-variant">
            Display rich content in a floating panel triggered by click. Built on bits-ui Popover primitive.
        </p>
    </header>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A simple popover with custom content.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover>
                {#snippet children({ open })}
                    <Button variant="outline">Click me</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-72">
                        <p class="text-sm font-medium">Popover Content</p>
                        <p class="mt-1 text-sm opacity-70">
                            This is a simple popover with some informational text.
                        </p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Positions (Side) -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control popover placement with the <code class="text-primary">side</code> prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Popover side="top">
                {#snippet children({ open })}
                    <Button variant="soft">Top</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Popover on top</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover side="right">
                {#snippet children({ open })}
                    <Button variant="soft">Right</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Popover on right</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover side="bottom">
                {#snippet children({ open })}
                    <Button variant="soft">Bottom</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Popover on bottom</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover side="left">
                {#snippet children({ open })}
                    <Button variant="soft">Left</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Popover on left</p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Alignment -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Alignment</h2>
        <p class="text-sm text-on-surface-variant">
            Control alignment with the <code class="text-primary">align</code> prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Popover side="bottom" align="start">
                {#snippet children({ open })}
                    <Button variant="outline">Start</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3 w-48">
                        <p class="text-sm">Aligned to start</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover side="bottom" align="center">
                {#snippet children({ open })}
                    <Button variant="outline">Center</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3 w-48">
                        <p class="text-sm">Aligned to center</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover side="bottom" align="end">
                {#snippet children({ open })}
                    <Button variant="outline">End</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3 w-48">
                        <p class="text-sm">Aligned to end</p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- With Arrow -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Arrow</h2>
        <p class="text-sm text-on-surface-variant">
            Add an arrow pointing to the trigger element.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Popover arrow side="top">
                {#snippet children({ open })}
                    <Button>Top Arrow</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Content with arrow</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover arrow side="right">
                {#snippet children({ open })}
                    <Button>Right Arrow</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Content with arrow</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover arrow side="bottom">
                {#snippet children({ open })}
                    <Button variant="soft">Bottom Arrow</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Content with arrow</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover arrow side="left">
                {#snippet children({ open })}
                    <Button variant="soft">Left Arrow</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Content with arrow</p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Rich Content -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Rich Content</h2>
        <p class="text-sm text-on-surface-variant">
            Popovers can contain rich, interactive content.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <!-- User Profile Card -->
            <Popover ui={{ content: 'bg-surface-container-low text-on-surface [--ui-border-color:var(--color-outline-variant)]' }}>
                {#snippet children({ open })}
                    <Button variant="soft" icon="lucide:user">Profile</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="w-72">
                        <div class="p-4">
                            <div class="flex items-center gap-3">
                                <div class="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary">
                                    <Icon name="lucide:user" size="20" />
                                </div>
                                <div>
                                    <p class="font-medium text-on-surface">John Doe</p>
                                    <p class="text-sm text-on-surface-variant">john@example.com</p>
                                </div>
                            </div>
                            <Separator class="my-3" />
                            <div class="flex gap-4 text-sm text-on-surface-variant">
                                <span><strong class="text-on-surface">128</strong> posts</span>
                                <span><strong class="text-on-surface">1.2k</strong> followers</span>
                                <span><strong class="text-on-surface">256</strong> following</span>
                            </div>
                        </div>
                        <Separator />
                        <div class="p-2">
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:settings">Settings</Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:log-out" color="error">Sign out</Button>
                        </div>
                    </div>
                {/snippet}
            </Popover>

            <!-- Notification Panel -->
            <Popover ui={{ content: 'bg-surface-container-low text-on-surface [--ui-border-color:var(--color-outline-variant)]' }}>
                {#snippet children({ open })}
                    <Button variant="outline" icon="lucide:bell">Notifications</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="w-80">
                        <div class="flex items-center justify-between p-4 pb-2">
                            <p class="font-medium text-on-surface">Notifications</p>
                            <Badge label="3 new" size="xs" color="primary" />
                        </div>
                        <div class="divide-y divide-outline-variant">
                            <div class="flex gap-3 p-4">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon name="lucide:message-circle" size="16" />
                                </div>
                                <div>
                                    <p class="text-sm text-on-surface">New comment on your post</p>
                                    <p class="text-xs text-on-surface-variant">2 minutes ago</p>
                                </div>
                            </div>
                            <div class="flex gap-3 p-4">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                    <Icon name="lucide:user-plus" size="16" />
                                </div>
                                <div>
                                    <p class="text-sm text-on-surface">New follower: Jane Smith</p>
                                    <p class="text-xs text-on-surface-variant">1 hour ago</p>
                                </div>
                            </div>
                            <div class="flex gap-3 p-4">
                                <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                                    <Icon name="lucide:star" size="16" />
                                </div>
                                <div>
                                    <p class="text-sm text-on-surface">Your post was featured</p>
                                    <p class="text-xs text-on-surface-variant">3 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- With Close Button -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Close Action</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="text-primary">content</code> slot exposes a <code class="text-primary">close</code> function to programmatically dismiss the popover.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover>
                {#snippet children({ open })}
                    <Button variant="outline">Open with close button</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-72">
                        <div class="flex items-center justify-between">
                            <p class="font-medium">Confirm Action</p>
                            <Button
                                icon="lucide:x"
                                square
                                variant="ghost"
                                size="xs"
                                onclick={close}
                            />
                        </div>
                        <p class="mt-2 text-sm opacity-70">
                            Are you sure you want to proceed with this action?
                        </p>
                        <div class="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onclick={close}>Cancel</Button>
                            <Button size="sm" onclick={close}>Confirm</Button>
                        </div>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Controlled State -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Controlled State</h2>
        <p class="text-sm text-on-surface-variant">
            Control popover visibility programmatically with <code class="text-primary">open</code> binding.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover bind:open={controlledOpen}>
                {#snippet children({ open })}
                    <Button variant={controlledOpen ? 'solid' : 'outline'}>
                        {controlledOpen ? 'Popover is open' : 'Click to open'}
                    </Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-64">
                        <p class="text-sm">Controlled popover content</p>
                    </div>
                {/snippet}
            </Popover>

            <Button variant="soft" onclick={() => controlledOpen = !controlledOpen}>
                Toggle: {controlledOpen ? 'Close' : 'Open'}
            </Button>

            <span class="text-sm text-on-surface-variant">
                State: <code class="text-primary">{controlledOpen}</code>
            </span>
        </div>
    </section>

    <!-- Not Dismissible -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Non-dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            Prevent dismissing by clicking outside or pressing Escape. Only the close function can dismiss.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover dismissible={false}>
                {#snippet children({ open })}
                    <Button variant="outline">Non-dismissible</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-72">
                        <p class="text-sm font-medium">Cannot dismiss by clicking outside</p>
                        <p class="mt-1 text-sm opacity-70">
                            You must use the close button to dismiss this popover.
                        </p>
                        <div class="mt-3 flex justify-end">
                            <Button size="sm" onclick={close}>Got it</Button>
                        </div>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Without Portal -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            Render popover inline instead of in a portal.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover portal>
                {#snippet children({ open })}
                    <Button variant="outline">With Portal</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Rendered in portal (default)</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover portal={false}>
                {#snippet children({ open })}
                    <Button variant="outline">Without Portal</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-3">
                        <p class="text-sm">Rendered inline</p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Customize individual popover parts with the <code class="text-primary">ui</code> prop.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Popover
                ui={{
                    content: 'bg-primary text-on-primary [--ui-border-color:var(--color-primary)]',
                    arrow: 'fill-primary text-primary'
                }}
                arrow
            >
                {#snippet children({ open })}
                    <Button>Primary Style</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-64">
                        <p class="text-sm font-medium">Custom styled popover</p>
                        <p class="mt-1 text-sm opacity-80">With primary background color.</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover
                ui={{
                    content: 'bg-error text-on-error [--ui-border-color:var(--color-error)]',
                    arrow: 'fill-error text-error'
                }}
                arrow
            >
                {#snippet children({ open })}
                    <Button color="error" variant="soft">Error Style</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-64">
                        <p class="text-sm font-medium">Error popover</p>
                        <p class="mt-1 text-sm opacity-80">Something went wrong.</p>
                    </div>
                {/snippet}
            </Popover>

            <Popover
                ui={{
                    content: 'rounded-xl shadow-2xl'
                }}
            >
                {#snippet children({ open })}
                    <Button variant="outline">Custom Rounding</Button>
                {/snippet}
                {#snippet content({ close })}
                    <div class="p-4 w-64">
                        <p class="text-sm">Extra rounded with larger shadow.</p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Real World Examples</h2>
        <p class="text-sm text-on-surface-variant">
            Common popover use cases in applications.
        </p>

        <!-- Share Menu -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Share Menu</h3>
            <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
                <Popover ui={{ content: 'bg-surface-container-low text-on-surface [--ui-border-color:var(--color-outline-variant)]' }}>
                    {#snippet children({ open })}
                        <Button variant="outline" icon="lucide:share-2">Share</Button>
                    {/snippet}
                    {#snippet content({ close })}
                        <div class="w-56 p-2">
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:link" onclick={close}>Copy link</Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:twitter" onclick={close}>Twitter</Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:facebook" onclick={close}>Facebook</Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start" icon="lucide:mail" onclick={close}>Email</Button>
                        </div>
                    {/snippet}
                </Popover>
            </div>
        </div>

        <!-- Color Picker -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Color Picker</h3>
            <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
                <Popover ui={{ content: 'bg-surface-container-low text-on-surface [--ui-border-color:var(--color-outline-variant)]' }}>
                    {#snippet children({ open })}
                        <Button variant="outline" icon="lucide:palette">Pick Color</Button>
                    {/snippet}
                    {#snippet content({ close })}
                        <div class="p-4 w-56">
                            <p class="mb-3 text-sm font-medium text-on-surface">Choose a color</p>
                            <div class="grid grid-cols-5 gap-2">
                                {#each ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'] as color}
                                    <button
                                        class="size-8 rounded-full {color} hover:ring-2 hover:ring-offset-2 hover:ring-outline transition-all"
                                        aria-label="Select {color.replace('bg-', '').replace('-500', '')} color"
                                        onclick={close}
                                    ></button>
                                {/each}
                            </div>
                        </div>
                    {/snippet}
                </Popover>
            </div>
        </div>

        <!-- Filter Panel -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Filter Panel</h3>
            <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
                <Popover ui={{ content: 'bg-surface-container-low text-on-surface [--ui-border-color:var(--color-outline-variant)]' }}>
                    {#snippet children({ open })}
                        <Button variant="outline" icon="lucide:filter">Filters</Button>
                    {/snippet}
                    {#snippet content({ close })}
                        <div class="w-72">
                            <div class="p-4">
                                <p class="font-medium text-on-surface">Filter Results</p>
                            </div>
                            <Separator />
                            <div class="p-4 space-y-3">
                                <div>
                                    <p class="text-sm font-medium text-on-surface">Status</p>
                                    <div class="mt-1 flex gap-2">
                                        <Badge label="Active" color="success" />
                                        <Badge label="Pending" color="warning" />
                                        <Badge label="Closed" color="error" />
                                    </div>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-on-surface">Priority</p>
                                    <div class="mt-1 flex gap-2">
                                        <Badge label="High" />
                                        <Badge label="Medium" />
                                        <Badge label="Low" />
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div class="p-3 flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onclick={close}>Reset</Button>
                                <Button size="sm" onclick={close}>Apply</Button>
                            </div>
                        </div>
                    {/snippet}
                </Popover>
            </div>
        </div>
    </section>
</div>
