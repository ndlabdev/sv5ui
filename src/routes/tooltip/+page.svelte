<script lang="ts">
    import { Tooltip, Button, Badge, Icon, Separator } from '$lib/index.js'

    let controlledOpen = $state(false)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Tooltip</h1>
        <p class="text-on-surface-variant">
            Display brief, informative text on hover or focus. Built on bits-ui Tooltip primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip text="This is a tooltip">
                <Button variant="outline">Hover me</Button>
            </Tooltip>

            <Tooltip text="Tooltip for icon button">
                <Button icon="lucide:settings" square variant="ghost" />
            </Tooltip>

            <Tooltip text="Information tooltip">
                <Badge label="Hover for info" color="info" />
            </Tooltip>
        </div>
    </section>

    <!-- Positions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control tooltip placement with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">side</code>
            prop.
        </p>
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-surface-container-high p-8"
        >
            <Tooltip text="I appear on top" side="top">
                <Button variant="soft">Top</Button>
            </Tooltip>

            <Tooltip text="I appear on the right" side="right">
                <Button variant="soft">Right</Button>
            </Tooltip>

            <Tooltip text="I appear on the bottom" side="bottom">
                <Button variant="soft">Bottom</Button>
            </Tooltip>

            <Tooltip text="I appear on the left" side="left">
                <Button variant="soft">Left</Button>
            </Tooltip>
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
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-surface-container-high p-8"
        >
            <Tooltip text="Aligned to start" side="bottom" align="start">
                <Button variant="outline">Start</Button>
            </Tooltip>

            <Tooltip text="Aligned to center" side="bottom" align="center">
                <Button variant="outline">Center</Button>
            </Tooltip>

            <Tooltip text="Aligned to end" side="bottom" align="end">
                <Button variant="outline">End</Button>
            </Tooltip>
        </div>
    </section>

    <!-- Arrow -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Arrow</h2>
        <p class="text-sm text-on-surface-variant">
            Add an arrow pointing to the trigger element with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">arrow</code>
            prop.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            {#each [{ side: 'top' as const, label: 'Top' }, { side: 'right' as const, label: 'Right' }, { side: 'bottom' as const, label: 'Bottom' }, { side: 'left' as const, label: 'Left' }] as item (item.side)}
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <Tooltip text="Arrow on {item.side}" arrow side={item.side}>
                        <Button>{item.label}</Button>
                    </Tooltip>
                </div>
            {/each}
        </div>
    </section>

    <!-- Keyboard Shortcuts -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Keyboard Shortcuts</h2>
        <p class="text-sm text-on-surface-variant">
            Display keyboard shortcuts alongside text using the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">kbds</code>
            prop.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip text="Search" kbds={['meta', 'k']}>
                <Button icon="lucide:search" variant="outline">Search</Button>
            </Tooltip>

            <Tooltip text="Save changes" kbds={['meta', 's']}>
                <Button icon="lucide:save" variant="soft">Save</Button>
            </Tooltip>

            <Tooltip text="Undo action" kbds={['meta', 'z']}>
                <Button icon="lucide:undo" variant="ghost">Undo</Button>
            </Tooltip>

            <Tooltip text="Open command palette" kbds={['meta', 'shift', 'p']}>
                <Button icon="lucide:terminal" variant="outline">Command</Button>
            </Tooltip>
        </div>
    </section>

    <!-- Delay Duration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Delay Duration</h2>
        <p class="text-sm text-on-surface-variant">
            Control how long to wait before showing the tooltip.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip text="Instant (0ms)" delayDuration={0}>
                <Button variant="outline">No Delay</Button>
            </Tooltip>

            <Tooltip text="Fast (200ms)" delayDuration={200}>
                <Button variant="outline">200ms</Button>
            </Tooltip>

            <Tooltip text="Slow (500ms)" delayDuration={500}>
                <Button variant="outline">500ms</Button>
            </Tooltip>

            <Tooltip text="Very slow (1s)" delayDuration={1000}>
                <Button variant="outline">1 second</Button>
            </Tooltip>
        </div>
    </section>

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Control tooltip visibility programmatically with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code>
            binding.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Observe hover state</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <Tooltip text="Hover to see state change" bind:open={controlledOpen}>
                        <Button variant={controlledOpen ? 'solid' : 'outline'}>Hover me</Button>
                    </Tooltip>
                    <span class="text-sm text-on-surface-variant">
                        open: <code class="text-primary">{controlledOpen}</code>
                    </span>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Toggle programmatically</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <Tooltip text="Programmatic tooltip" open={controlledOpen}>
                        <Button variant="outline">Target</Button>
                    </Tooltip>
                    <Button variant="soft" onclick={() => (controlledOpen = !controlledOpen)}>
                        {controlledOpen ? 'Hide' : 'Show'}
                    </Button>
                </div>
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip text="This won't show" disabled>
                <Button>Tooltip Disabled</Button>
            </Tooltip>

            <Tooltip text="This will show">
                <Button variant="soft">Tooltip Enabled</Button>
            </Tooltip>
        </div>
    </section>

    <!-- Custom Content Snippet -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>
            snippet for rich tooltip content.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip>
                <Button variant="soft" icon="lucide:user">User Info</Button>
                {#snippet content()}
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:user-circle" size="16" />
                        <span>John Doe</span>
                        <Badge label="Admin" size="xs" color="success" />
                    </div>
                {/snippet}
            </Tooltip>

            <Tooltip arrow>
                <Button variant="soft" icon="lucide:info">Details</Button>
                {#snippet content()}
                    <div class="flex flex-col gap-1">
                        <span class="font-medium">Server Status</span>
                        <span class="text-inverse-on-surface/80">All systems operational</span>
                    </div>
                {/snippet}
            </Tooltip>

            <Tooltip>
                <Button icon="lucide:palette" variant="outline">Colors</Button>
                {#snippet content()}
                    <div class="flex gap-1">
                        <span class="size-4 rounded-full bg-red-500"></span>
                        <span class="size-4 rounded-full bg-yellow-500"></span>
                        <span class="size-4 rounded-full bg-green-500"></span>
                        <span class="size-4 rounded-full bg-blue-500"></span>
                    </div>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Hoverable Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Hoverable Content</h2>
        <p class="text-sm text-on-surface-variant">
            By default, users can hover over tooltip content. Disable with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disableHoverableContent</code
            >.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <Tooltip text="You can hover over this tooltip" delayDuration={0}>
                <Button variant="outline">Hoverable (default)</Button>
            </Tooltip>

            <Tooltip
                text="This closes immediately when you leave trigger"
                disableHoverableContent
                delayDuration={0}
            >
                <Button variant="outline">Not Hoverable</Button>
            </Tooltip>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Primary style</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <Tooltip
                        text="Custom styled tooltip"
                        ui={{ content: 'bg-primary text-on-primary rounded-full px-4' }}
                    >
                        <Button>Primary</Button>
                    </Tooltip>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Error style</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <Tooltip text="Error styled" ui={{ content: 'bg-error text-on-error' }}>
                        <Button color="error" variant="soft">Error</Button>
                    </Tooltip>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Success style</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <Tooltip text="Success message" ui={{ content: 'bg-success text-on-success' }}>
                        <Button color="success" variant="soft">Success</Button>
                    </Tooltip>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Large size</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <Tooltip text="Large tooltip" ui={{ content: 'text-sm px-4 py-2' }}>
                        <Button variant="outline">Large</Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <!-- Editor Toolbar -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Editor Toolbar</p>
                <div class="flex items-center gap-1 rounded-lg bg-surface-container-high p-2">
                    <Tooltip text="Bold" kbds={['meta', 'b']}>
                        <Button icon="lucide:bold" square variant="ghost" size="sm" />
                    </Tooltip>
                    <Tooltip text="Italic" kbds={['meta', 'i']}>
                        <Button icon="lucide:italic" square variant="ghost" size="sm" />
                    </Tooltip>
                    <Tooltip text="Underline" kbds={['meta', 'u']}>
                        <Button icon="lucide:underline" square variant="ghost" size="sm" />
                    </Tooltip>
                    <div class="mx-1 h-6 w-px bg-outline-variant"></div>
                    <Tooltip text="Align Left">
                        <Button icon="lucide:align-left" square variant="ghost" size="sm" />
                    </Tooltip>
                    <Tooltip text="Align Center">
                        <Button icon="lucide:align-center" square variant="ghost" size="sm" />
                    </Tooltip>
                    <Tooltip text="Align Right">
                        <Button icon="lucide:align-right" square variant="ghost" size="sm" />
                    </Tooltip>
                    <div class="mx-1 h-6 w-px bg-outline-variant"></div>
                    <Tooltip text="Insert Link" kbds={['meta', 'k']}>
                        <Button icon="lucide:link" square variant="ghost" size="sm" />
                    </Tooltip>
                </div>
            </div>

            <!-- Social Actions -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Social Actions</p>
                <div class="flex items-center gap-2 rounded-lg bg-surface-container-high p-4">
                    <Tooltip text="Like this post">
                        <Button icon="lucide:heart" variant="ghost" size="sm">128</Button>
                    </Tooltip>
                    <Tooltip text="Leave a comment">
                        <Button icon="lucide:message-circle" variant="ghost" size="sm">24</Button>
                    </Tooltip>
                    <Tooltip text="Share this post">
                        <Button icon="lucide:share-2" variant="ghost" size="sm">Share</Button>
                    </Tooltip>
                    <Tooltip text="Save to bookmarks">
                        <Button icon="lucide:bookmark" variant="ghost" size="sm" square />
                    </Tooltip>
                </div>
            </div>

            <!-- Status Indicators -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Status Indicators</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <Tooltip text="Server is healthy and responding">
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-success"></span>
                            <span class="text-sm">API Server</span>
                        </span>
                    </Tooltip>
                    <Tooltip text="High CPU usage detected">
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-warning"></span>
                            <span class="text-sm">Worker Node</span>
                        </span>
                    </Tooltip>
                    <Tooltip text="Service unavailable">
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-error"></span>
                            <span class="text-sm">Database</span>
                        </span>
                    </Tooltip>
                </div>
            </div>

            <!-- Truncated Content -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Truncated Content</p>
                <div class="flex flex-col gap-2 rounded-lg bg-surface-container-high p-4">
                    <Tooltip
                        text="This is the full title of a very long document that would normally be truncated in the UI"
                    >
                        <p class="w-64 truncate text-sm">
                            This is the full title of a very long document that would normally be
                            truncated in the UI
                        </p>
                    </Tooltip>
                    <Tooltip text="user@example.com, admin@company.org, support@helpdesk.io">
                        <p class="w-48 truncate text-sm text-on-surface-variant">
                            user@example.com, admin@company.org, support@helpdesk.io
                        </p>
                    </Tooltip>
                </div>
            </div>
        </div>
    </section>
</div>
