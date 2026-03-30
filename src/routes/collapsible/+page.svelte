<script lang="ts">
    import { Collapsible, Button, Icon, Badge, Separator } from '$lib/index.js'

    let basicOpen = $state(false)
    let controlledOpen = $state(true)
</script>

<div class="mx-auto max-w-3xl space-y-12 p-8">
    <div>
        <h1 class="text-2xl font-bold">Collapsible</h1>
        <p class="mt-1 text-on-surface-variant">
            An interactive component that expands/collapses content.
        </p>
    </div>

    <Separator />

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <Collapsible>
            {#snippet trigger({ open, props })}
                <Button
                    {...props}
                    variant="subtle"
                    trailingIcon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                >
                    {open ? 'Hide' : 'Show'} content
                </Button>
            {/snippet}
            {#snippet content()}
                <div class="mt-2 rounded-lg border border-outline-variant p-4 text-sm">
                    <p>This is the collapsible content. It can contain any elements you need.</p>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Initially Open -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Initially Open</h2>
        <Collapsible open>
            {#snippet trigger({ open, props })}
                <Button
                    {...props}
                    variant="outline"
                    trailingIcon={open ? 'lucide:minus' : 'lucide:plus'}
                >
                    Toggle section
                </Button>
            {/snippet}
            {#snippet content()}
                <div class="mt-2 rounded-lg bg-surface-container p-4 text-sm">
                    <p>This section is open by default when the page loads.</p>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled (bind:open)</h2>
        <div class="flex items-center gap-2">
            <Badge
                label={controlledOpen ? 'Open' : 'Closed'}
                color={controlledOpen ? 'success' : 'error'}
            />
            <Button variant="ghost" size="xs" onclick={() => (controlledOpen = !controlledOpen)}>
                Toggle externally
            </Button>
        </div>
        <Collapsible bind:open={controlledOpen}>
            {#snippet trigger({ open, props })}
                <Button
                    {...props}
                    variant="soft"
                    color="primary"
                    trailingIcon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                >
                    Controlled collapsible
                </Button>
            {/snippet}
            {#snippet content()}
                <div
                    class="mt-2 rounded-lg border border-primary/30 bg-primary-container/20 p-4 text-sm"
                >
                    <p>
                        This collapsible is controlled externally via <code
                            class="rounded bg-surface-container px-1">bind:open</code
                        >.
                    </p>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- onOpenChange callback -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">onOpenChange Callback</h2>
        <!-- eslint-disable-next-line no-console -->
        <Collapsible bind:open={basicOpen} onOpenChange={(v) => console.log('open changed:', v)}>
            {#snippet trigger({ open, props })}
                <Button
                    {...props}
                    variant="outline"
                    color="secondary"
                    trailingIcon={open ? 'lucide:eye-off' : 'lucide:eye'}
                >
                    {open ? 'Collapse' : 'Expand'} (check console)
                </Button>
            {/snippet}
            {#snippet content()}
                <div class="mt-2 rounded-lg border border-outline-variant p-4 text-sm">
                    <p>
                        Open the console to see the <code class="rounded bg-surface-container px-1"
                            >onOpenChange</code
                        > callback firing.
                    </p>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <Collapsible disabled>
            {#snippet trigger({ props })}
                <Button {...props} variant="outline" disabled trailingIcon="lucide:chevron-down">
                    Cannot toggle (disabled)
                </Button>
            {/snippet}
            {#snippet content()}
                <div class="mt-2 rounded-lg border border-outline-variant p-4 text-sm">
                    <p>You should never see this content.</p>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Custom trigger (non-Button) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Trigger</h2>
        <Collapsible>
            {#snippet trigger({ open, props })}
                <div
                    {...props}
                    class="flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant px-4 py-3 transition-colors hover:bg-surface-container"
                >
                    <Icon name="lucide:settings" class="size-5" />
                    <span class="flex-1 text-sm font-medium">Advanced Settings</span>
                    <Icon
                        name="lucide:chevron-down"
                        class="size-4 transition-transform duration-200 {open ? 'rotate-180' : ''}"
                    />
                </div>
            {/snippet}
            {#snippet content()}
                <div class="mt-1 space-y-3 rounded-lg border border-outline-variant p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Enable notifications</span>
                        <Badge label="On" color="success" variant="soft" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Auto-save drafts</span>
                        <Badge label="Off" color="error" variant="soft" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Dark mode</span>
                        <Badge label="System" color="info" variant="soft" />
                    </div>
                </div>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Custom UI Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI Slots</h2>
        <Collapsible
            ui={{
                root: 'rounded-xl border border-outline-variant p-4',
                content: 'mt-3 border-t border-outline-variant pt-3'
            }}
        >
            {#snippet trigger({ open, props })}
                <Button
                    {...props}
                    variant="ghost"
                    size="sm"
                    trailingIcon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                >
                    Styled with ui prop
                </Button>
            {/snippet}
            {#snippet content()}
                <p class="text-sm text-on-surface-variant">
                    The root has a rounded border and padding. The content has a top border
                    separator.
                </p>
            {/snippet}
        </Collapsible>
    </section>

    <Separator />

    <!-- Multiple collapsibles -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Multiple Collapsibles</h2>
        <div class="divide-y divide-outline-variant rounded-lg border border-outline-variant">
            {#each ['Getting Started', 'Installation', 'Configuration'] as title (title)}
                <Collapsible ui={{ root: 'px-4' }}>
                    {#snippet trigger({ open, props })}
                        <div
                            {...props}
                            class="flex w-full cursor-pointer items-center justify-between py-3"
                        >
                            <span class="text-sm font-medium">{title}</span>
                            <Icon
                                name="lucide:chevron-down"
                                class="size-4 transition-transform duration-200 {open
                                    ? 'rotate-180'
                                    : ''}"
                            />
                        </div>
                    {/snippet}
                    {#snippet content()}
                        <div class="pb-3 text-sm text-on-surface-variant">
                            Content for the "{title}" section. Each collapsible operates
                            independently.
                        </div>
                    {/snippet}
                </Collapsible>
            {/each}
        </div>
    </section>
</div>
