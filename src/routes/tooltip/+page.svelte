<script lang="ts">
    import { Tooltip, Button, Badge, Icon, Kbd } from '$lib/index.js'

    let controlledOpen = $state(false)
</script>

<div class="space-y-12">
    <header>
        <h1 class="text-3xl font-bold text-on-surface">Tooltip</h1>
        <p class="mt-2 text-on-surface-variant">
            Display brief, informative text on hover or focus. Built on bits-ui Tooltip primitive.
        </p>
    </header>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            The simplest tooltip with just text content.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="This is a tooltip">
                {#snippet children({ open })}
                    <Button variant="outline">Hover me</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Tooltip for icon button">
                {#snippet children({ open })}
                    <Button icon="lucide:settings" square variant="ghost" />
                {/snippet}
            </Tooltip>

            <Tooltip text="Information tooltip">
                {#snippet children({ open })}
                    <Badge label="Hover for info" color="info" />
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Positions (Side) -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control tooltip placement with the <code class="text-primary">side</code> prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Tooltip text="I appear on top" side="top">
                {#snippet children({ open })}
                    <Button variant="soft">Top</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="I appear on the right" side="right">
                {#snippet children({ open })}
                    <Button variant="soft">Right</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="I appear on the bottom" side="bottom">
                {#snippet children({ open })}
                    <Button variant="soft">Bottom</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="I appear on the left" side="left">
                {#snippet children({ open })}
                    <Button variant="soft">Left</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Alignment -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Alignment</h2>
        <p class="text-sm text-on-surface-variant">
            Control alignment with the <code class="text-primary">align</code> prop.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Tooltip text="Aligned to start" side="bottom" align="start">
                {#snippet children({ open })}
                    <Button variant="outline">Start</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Aligned to center" side="bottom" align="center">
                {#snippet children({ open })}
                    <Button variant="outline">Center</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Aligned to end" side="bottom" align="end">
                {#snippet children({ open })}
                    <Button variant="outline">End</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- With Arrow -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Arrow</h2>
        <p class="text-sm text-on-surface-variant">
            Add an arrow pointing to the trigger element.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Tooltip text="With default arrow" arrow side="top">
                {#snippet children({ open })}
                    <Button>Top Arrow</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Custom arrow size" arrow={{ width: 12, height: 6 }} side="right">
                {#snippet children({ open })}
                    <Button>Large Arrow</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Bottom with arrow" arrow side="bottom">
                {#snippet children({ open })}
                    <Button variant="soft">Bottom Arrow</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Left with arrow" arrow side="left">
                {#snippet children({ open })}
                    <Button variant="soft">Left Arrow</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- With Keyboard Shortcuts -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Keyboard Shortcuts</h2>
        <p class="text-sm text-on-surface-variant">
            Display keyboard shortcuts alongside text using the <code class="text-primary">kbds</code> prop.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="Search" kbds={['meta', 'k']}>
                {#snippet children({ open })}
                    <Button icon="lucide:search" variant="outline">Search</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Save changes" kbds={['meta', 's']}>
                {#snippet children({ open })}
                    <Button icon="lucide:save" variant="soft">Save</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Undo action" kbds={['meta', 'z']}>
                {#snippet children({ open })}
                    <Button icon="lucide:undo" variant="ghost">Undo</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Copy selection" kbds={['meta', 'c']}>
                {#snippet children({ open })}
                    <Button icon="lucide:copy" variant="outline">Copy</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Multiple Shortcuts -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Multiple Shortcuts</h2>
        <p class="text-sm text-on-surface-variant">
            Display multiple key combinations separated by dots.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="Open command palette" kbds={['meta', 'shift', 'p']}>
                {#snippet children({ open })}
                    <Button>Command Palette</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Quick switch" kbds={['alt', 'tab']}>
                {#snippet children({ open })}
                    <Button variant="soft">Quick Switch</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Force refresh" kbds={['meta', 'shift', 'r']}>
                {#snippet children({ open })}
                    <Button icon="lucide:refresh-cw" variant="outline">Hard Refresh</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Delay Duration -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Delay Duration</h2>
        <p class="text-sm text-on-surface-variant">
            Control how long to wait before showing the tooltip.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="Instant (0ms)" delayDuration={0}>
                {#snippet children({ open })}
                    <Button variant="outline">No Delay</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Fast (100ms)" delayDuration={100}>
                {#snippet children({ open })}
                    <Button variant="outline">100ms</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Default (200ms)" delayDuration={200}>
                {#snippet children({ open })}
                    <Button variant="outline">200ms (default)</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Slow (500ms)" delayDuration={500}>
                {#snippet children({ open })}
                    <Button variant="outline">500ms</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Very slow (1000ms)" delayDuration={1000}>
                {#snippet children({ open })}
                    <Button variant="outline">1 second</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Offset -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Offset</h2>
        <p class="text-sm text-on-surface-variant">
            Adjust distance from trigger with <code class="text-primary">sideOffset</code>.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12">
            <Tooltip text="No offset" sideOffset={0} arrow>
                {#snippet children({ open })}
                    <Button variant="soft">0px</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Default offset" sideOffset={8} arrow>
                {#snippet children({ open })}
                    <Button variant="soft">8px (default)</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Large offset" sideOffset={16} arrow>
                {#snippet children({ open })}
                    <Button variant="soft">16px</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Extra large offset" sideOffset={24} arrow>
                {#snippet children({ open })}
                    <Button variant="soft">24px</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Controlled State -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Controlled State</h2>
        <p class="text-sm text-on-surface-variant">
            Control tooltip visibility programmatically with <code class="text-primary">open</code> binding.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="Controlled tooltip" bind:open={controlledOpen}>
                {#snippet children({ open })}
                    <Button variant={controlledOpen ? 'solid' : 'outline'}>
                        {controlledOpen ? 'Tooltip is open' : 'Hover or click toggle'}
                    </Button>
                {/snippet}
            </Tooltip>

            <Button variant="soft" onclick={() => controlledOpen = !controlledOpen}>
                Toggle: {controlledOpen ? 'Hide' : 'Show'}
            </Button>

            <span class="text-sm text-on-surface-variant">
                State: <code class="text-primary">{controlledOpen}</code>
            </span>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Disable the tooltip while keeping the trigger functional.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="This won't show" disabled>
                {#snippet children({ open })}
                    <Button>Tooltip Disabled</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="This will show">
                {#snippet children({ open })}
                    <Button variant="soft">Tooltip Enabled</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Without Portal -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            Render tooltip inline instead of in a portal (useful for specific CSS contexts).
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="Rendered in portal (default)" portal>
                {#snippet children({ open })}
                    <Button variant="outline">With Portal</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="Rendered inline" portal={false}>
                {#snippet children({ open })}
                    <Button variant="outline">Without Portal</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Custom Content -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="text-primary">content</code> slot for rich tooltip content.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip>
                {#snippet children({ open })}
                    <Button variant="soft" icon="lucide:user">User Info</Button>
                {/snippet}
                {#snippet content()}
                    <div class="flex items-center gap-2">
                        <Icon name="lucide:user-circle" size="16" />
                        <span>John Doe</span>
                        <Badge label="Admin" size="xs" color="success" />
                    </div>
                {/snippet}
            </Tooltip>

            <Tooltip arrow>
                {#snippet children({ open })}
                    <Button variant="soft" icon="lucide:info">Details</Button>
                {/snippet}
                {#snippet content()}
                    <div class="flex flex-col gap-1">
                        <span class="font-medium">Server Status</span>
                        <span class="text-inverse-on-surface/80">All systems operational</span>
                    </div>
                {/snippet}
            </Tooltip>

            <Tooltip>
                {#snippet children({ open })}
                    <Button icon="lucide:palette" variant="outline">Colors</Button>
                {/snippet}
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

    <!-- Hover Behavior -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Hoverable Content</h2>
        <p class="text-sm text-on-surface-variant">
            By default, users can hover over tooltip content. Disable with <code class="text-primary">disableHoverableContent</code>.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip text="You can hover over this tooltip" delayDuration={0}>
                {#snippet children({ open })}
                    <Button variant="outline">Hoverable (default)</Button>
                {/snippet}
            </Tooltip>

            <Tooltip text="This closes immediately when you leave trigger" disableHoverableContent delayDuration={0}>
                {#snippet children({ open })}
                    <Button variant="outline">Not Hoverable</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Customize individual tooltip parts with the <code class="text-primary">ui</code> prop.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6">
            <Tooltip
                text="Custom styled tooltip"
                ui={{
                    content: 'bg-primary text-on-primary rounded-full px-4'
                }}
            >
                {#snippet children({ open })}
                    <Button>Primary Style</Button>
                {/snippet}
            </Tooltip>

            <Tooltip
                text="Error styled"
                ui={{
                    content: 'bg-error text-on-error'
                }}
                arrow
            >
                {#snippet children({ open })}
                    <Button color="error" variant="soft">Error Style</Button>
                {/snippet}
            </Tooltip>

            <Tooltip
                text="Success message"
                ui={{
                    content: 'bg-success text-on-success',
                    arrow: 'fill-success'
                }}
                arrow
            >
                {#snippet children({ open })}
                    <Button color="success" variant="soft">Success Style</Button>
                {/snippet}
            </Tooltip>

            <Tooltip
                text="Large tooltip"
                ui={{
                    content: 'text-sm px-4 py-2'
                }}
            >
                {#snippet children({ open })}
                    <Button variant="outline">Large Size</Button>
                {/snippet}
            </Tooltip>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Real World Examples</h2>
        <p class="text-sm text-on-surface-variant">
            Common tooltip use cases in applications.
        </p>

        <!-- Toolbar -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Editor Toolbar</h3>
            <div class="flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-2">
                <Tooltip text="Bold" kbds={['meta', 'b']}>
                    {#snippet children({ open })}
                        <Button icon="lucide:bold" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <Tooltip text="Italic" kbds={['meta', 'i']}>
                    {#snippet children({ open })}
                        <Button icon="lucide:italic" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <Tooltip text="Underline" kbds={['meta', 'u']}>
                    {#snippet children({ open })}
                        <Button icon="lucide:underline" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <div class="mx-1 h-6 w-px bg-outline-variant"></div>
                <Tooltip text="Align Left">
                    {#snippet children({ open })}
                        <Button icon="lucide:align-left" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <Tooltip text="Align Center">
                    {#snippet children({ open })}
                        <Button icon="lucide:align-center" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <Tooltip text="Align Right">
                    {#snippet children({ open })}
                        <Button icon="lucide:align-right" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <div class="mx-1 h-6 w-px bg-outline-variant"></div>
                <Tooltip text="Insert Link" kbds={['meta', 'k']}>
                    {#snippet children({ open })}
                        <Button icon="lucide:link" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
                <Tooltip text="Insert Image">
                    {#snippet children({ open })}
                        <Button icon="lucide:image" square variant="ghost" size="sm" />
                    {/snippet}
                </Tooltip>
            </div>
        </div>

        <!-- Social Actions -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Social Actions</h3>
            <div class="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                <Tooltip text="Like this post">
                    {#snippet children({ open })}
                        <Button icon="lucide:heart" variant="ghost" size="sm">128</Button>
                    {/snippet}
                </Tooltip>
                <Tooltip text="Leave a comment">
                    {#snippet children({ open })}
                        <Button icon="lucide:message-circle" variant="ghost" size="sm">24</Button>
                    {/snippet}
                </Tooltip>
                <Tooltip text="Share this post">
                    {#snippet children({ open })}
                        <Button icon="lucide:share-2" variant="ghost" size="sm">Share</Button>
                    {/snippet}
                </Tooltip>
                <Tooltip text="Save to bookmarks">
                    {#snippet children({ open })}
                        <Button icon="lucide:bookmark" variant="ghost" size="sm" square />
                    {/snippet}
                </Tooltip>
            </div>
        </div>

        <!-- Status Indicators -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Status Indicators</h3>
            <div class="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                <Tooltip text="Server is healthy and responding">
                    {#snippet children({ open })}
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-success"></span>
                            <span class="text-sm">API Server</span>
                        </span>
                    {/snippet}
                </Tooltip>

                <Tooltip text="High CPU usage detected">
                    {#snippet children({ open })}
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-warning"></span>
                            <span class="text-sm">Worker Node</span>
                        </span>
                    {/snippet}
                </Tooltip>

                <Tooltip text="Service unavailable - investigating">
                    {#snippet children({ open })}
                        <span class="flex items-center gap-2">
                            <span class="size-3 rounded-full bg-error"></span>
                            <span class="text-sm">Database</span>
                        </span>
                    {/snippet}
                </Tooltip>
            </div>
        </div>

        <!-- Truncated Text -->
        <div class="space-y-2">
            <h3 class="text-lg font-medium text-on-surface">Truncated Content</h3>
            <div class="flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                <Tooltip text="This is the full title of a very long document that would normally be truncated in the UI">
                    {#snippet children({ open })}
                        <p class="w-64 truncate text-sm">
                            This is the full title of a very long document that would normally be truncated in the UI
                        </p>
                    {/snippet}
                </Tooltip>

                <Tooltip text="user@example.com, admin@company.org, support@helpdesk.io">
                    {#snippet children({ open })}
                        <p class="w-48 truncate text-sm text-on-surface-variant">
                            user@example.com, admin@company.org, support@helpdesk.io
                        </p>
                    {/snippet}
                </Tooltip>
            </div>
        </div>
    </section>
</div>
