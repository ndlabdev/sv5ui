<script lang="ts">
    import { Popover, Button, Badge, Icon, Separator } from '$lib/index.js'

    let controlledOpen = $state(false)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Popover</h1>
        <p class="text-on-surface-variant">
            Display rich content in a floating panel triggered by click. Built on bits-ui Popover
            primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Popover>
                <Button variant="outline">Click me</Button>
                {#snippet content()}
                    <div class="w-72 p-4">
                        <p class="text-sm font-medium">Popover Content</p>
                        <p class="mt-1 text-sm text-on-surface-variant">
                            This is a simple popover with some informational text.
                        </p>
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Positions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control popover placement with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">side</code>
            prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-surface-container-high p-8">
            {#each [
                { side: 'top' as const, label: 'Top' },
                { side: 'right' as const, label: 'Right' },
                { side: 'bottom' as const, label: 'Bottom' },
                { side: 'left' as const, label: 'Left' }
            ] as item (item.side)}
                <Popover side={item.side}>
                    <Button variant="soft">{item.label}</Button>
                    {#snippet content()}
                        <div class="p-3">
                            <p class="text-sm">Popover on {item.side}</p>
                        </div>
                    {/snippet}
                </Popover>
            {/each}
        </div>
    </section>

    <!-- Alignment -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Alignment</h2>
        <p class="text-sm text-on-surface-variant">
            Control alignment with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">align</code>
            prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-surface-container-high p-8">
            {#each [
                { align: 'start' as const, label: 'Start' },
                { align: 'center' as const, label: 'Center' },
                { align: 'end' as const, label: 'End' }
            ] as item (item.align)}
                <Popover side="bottom" align={item.align}>
                    <Button variant="outline">{item.label}</Button>
                    {#snippet content()}
                        <div class="w-48 p-3">
                            <p class="text-sm">Aligned to {item.align}</p>
                        </div>
                    {/snippet}
                </Popover>
            {/each}
        </div>
    </section>

    <!-- Arrow -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Arrow</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            {#each [
                { side: 'top' as const, label: 'Top' },
                { side: 'right' as const, label: 'Right' },
                { side: 'bottom' as const, label: 'Bottom' },
                { side: 'left' as const, label: 'Left' }
            ] as item (item.side)}
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover arrow side={item.side}>
                        <Button>{item.label}</Button>
                        {#snippet content()}
                            <div class="p-3">
                                <p class="text-sm">Content with arrow</p>
                            </div>
                        {/snippet}
                    </Popover>
                </div>
            {/each}
        </div>
    </section>

    <!-- Close Action -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Close Action</h2>
        <p class="text-sm text-on-surface-variant">
            The
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>
            snippet exposes a
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">close</code>
            function to programmatically dismiss the popover.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Popover>
                <Button variant="outline">Confirm Action</Button>
                {#snippet content({ close })}
                    <div class="w-72 p-4">
                        <div class="flex items-center justify-between">
                            <p class="font-medium">Confirm Action</p>
                            <Button icon="lucide:x" square variant="ghost" size="xs" onclick={close} />
                        </div>
                        <p class="mt-2 text-sm text-on-surface-variant">
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

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Control popover visibility programmatically with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code>
            binding.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Observe click state</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <Popover bind:open={controlledOpen}>
                        <Button variant={controlledOpen ? 'solid' : 'outline'}>Click me</Button>
                        {#snippet content()}
                            <div class="w-64 p-4">
                                <p class="text-sm">Controlled popover content</p>
                            </div>
                        {/snippet}
                    </Popover>
                    <span class="text-sm text-on-surface-variant">
                        open: <code class="text-primary">{controlledOpen}</code>
                    </span>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Toggle programmatically</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <Popover open={controlledOpen}>
                        <Button variant="outline">Target</Button>
                        {#snippet content()}
                            <div class="w-64 p-4">
                                <p class="text-sm">Programmatic popover</p>
                            </div>
                        {/snippet}
                    </Popover>
                    <Button variant="soft" onclick={() => (controlledOpen = !controlledOpen)}>
                        {controlledOpen ? 'Close' : 'Open'}
                    </Button>
                </div>
            </div>
        </div>
    </section>

    <!-- Non-dismissible -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            Prevent dismissing by clicking outside or pressing Escape.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Popover dismissible={false}>
                <Button variant="outline">Non-dismissible</Button>
                {#snippet content({ close })}
                    <div class="w-72 p-4">
                        <p class="text-sm font-medium">Cannot dismiss by clicking outside</p>
                        <p class="mt-1 text-sm text-on-surface-variant">
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

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom rounding</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover ui={{ content: 'rounded-xl shadow-2xl' }}>
                        <Button variant="outline">Rounded</Button>
                        {#snippet content()}
                            <div class="w-64 p-4">
                                <p class="text-sm">Extra rounded with larger shadow.</p>
                            </div>
                        {/snippet}
                    </Popover>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">No ring border</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover ui={{ content: 'ring-0 shadow-xl' }}>
                        <Button variant="outline">No Ring</Button>
                        {#snippet content()}
                            <div class="w-64 p-4">
                                <p class="text-sm">Ring removed, shadow only.</p>
                            </div>
                        {/snippet}
                    </Popover>
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <!-- User Profile Card -->
            <div class="space-y-2">
                <p class="text-sm font-medium">User Profile Card</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover>
                        <Button variant="soft" icon="lucide:user">Profile</Button>
                        {#snippet content()}
                            <div class="w-72">
                                <div class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary"
                                        >
                                            <Icon name="lucide:user" size="20" />
                                        </div>
                                        <div>
                                            <p class="font-medium">John Doe</p>
                                            <p class="text-sm text-on-surface-variant">john@example.com</p>
                                        </div>
                                    </div>
                                    <Separator class="my-3" />
                                    <div class="flex gap-4 text-sm text-on-surface-variant">
                                        <span><strong class="text-on-surface">128</strong> posts</span>
                                        <span><strong class="text-on-surface">1.2k</strong> followers</span>
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
                </div>
            </div>

            <!-- Share Menu -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Share Menu</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover>
                        <Button variant="outline" icon="lucide:share-2">Share</Button>
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

            <!-- Notification Panel -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Notification Panel</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover>
                        <Button variant="outline" icon="lucide:bell">Notifications</Button>
                        {#snippet content()}
                            <div class="w-80">
                                <div class="flex items-center justify-between p-4 pb-2">
                                    <p class="font-medium">Notifications</p>
                                    <Badge label="3 new" size="xs" color="primary" />
                                </div>
                                <div class="divide-y divide-outline-variant">
                                    <div class="flex gap-3 p-4">
                                        <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon name="lucide:message-circle" size="16" />
                                        </div>
                                        <div>
                                            <p class="text-sm">New comment on your post</p>
                                            <p class="text-xs text-on-surface-variant">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 p-4">
                                        <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                            <Icon name="lucide:user-plus" size="16" />
                                        </div>
                                        <div>
                                            <p class="text-sm">New follower: Jane Smith</p>
                                            <p class="text-xs text-on-surface-variant">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/snippet}
                    </Popover>
                </div>
            </div>

            <!-- Filter Panel -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Filter Panel</p>
                <div class="flex items-center justify-center rounded-lg bg-surface-container-high p-6">
                    <Popover>
                        <Button variant="outline" icon="lucide:filter">Filters</Button>
                        {#snippet content({ close })}
                            <div class="w-72">
                                <div class="p-4">
                                    <p class="font-medium">Filter Results</p>
                                </div>
                                <Separator />
                                <div class="space-y-3 p-4">
                                    <div>
                                        <p class="text-sm font-medium">Status</p>
                                        <div class="mt-1 flex gap-2">
                                            <Badge label="Active" color="success" />
                                            <Badge label="Pending" color="warning" />
                                            <Badge label="Closed" color="error" />
                                        </div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium">Priority</p>
                                        <div class="mt-1 flex gap-2">
                                            <Badge label="High" />
                                            <Badge label="Medium" />
                                            <Badge label="Low" />
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div class="flex justify-end gap-2 p-3">
                                    <Button variant="ghost" size="sm" onclick={close}>Reset</Button>
                                    <Button size="sm" onclick={close}>Apply</Button>
                                </div>
                            </div>
                        {/snippet}
                    </Popover>
                </div>
            </div>
        </div>
    </section>
</div>
