<script lang="ts">
    import { useEscapeKeydown } from '$lib/index.js'
    import { Button, Badge, Card } from '$lib/index.js'

    let escCount = $state(0)

    let panelOpen = $state(false)
    let confirmOpen = $state(false)

    let enabled = $state(true)
    let controlledOpen = $state(false)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useEscapeKeydown</h1>
        <p class="text-on-surface-variant">
            Svelte action that listens for the Escape key. Lightweight alternative to
            <code class="rounded bg-surface-container px-1">useKbd</code> when you only need Escape.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">Press Escape anywhere on this page.</p>
        <div
            use:useEscapeKeydown={{ handler: () => escCount++ }}
            class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4"
        >
            <Badge
                label="Escape pressed: {escCount} time{escCount === 1 ? '' : 's'}"
                color={escCount > 0 ? 'primary' : 'surface'}
                variant="subtle"
                size="md"
            />
            <Button size="xs" variant="ghost" onclick={() => (escCount = 0)}>Reset</Button>
        </div>
    </section>

    <!-- Dismiss Panel -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dismiss Panel</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Button onclick={() => (panelOpen = true)} disabled={panelOpen}>Show Panel</Button>

            {#if panelOpen}
                <Card class="mt-3 p-4">
                    <div use:useEscapeKeydown={{ handler: () => (panelOpen = false) }}>
                        <p class="text-sm font-medium">Info Panel</p>
                        <p class="text-xs text-on-surface-variant">
                            Press <kbd
                                class="rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 font-mono text-xs"
                                >Esc</kbd
                            > to close this panel.
                        </p>
                    </div>
                </Card>
            {/if}
        </div>
    </section>

    <!-- Confirmation Dialog -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Confirmation Dialog</h2>
        <p class="text-sm text-on-surface-variant">Press Escape to cancel the confirmation.</p>
        <div class="rounded-lg bg-surface-container-high p-4">
            {#if !confirmOpen}
                <Button color="error" variant="soft" onclick={() => (confirmOpen = true)}>
                    Delete Item
                </Button>
            {:else}
                <Card class="inline-block p-4">
                    <div use:useEscapeKeydown={{ handler: () => (confirmOpen = false) }}>
                        <p class="text-sm font-medium">Are you sure?</p>
                        <p class="mb-3 text-xs text-on-surface-variant">
                            Press Escape to cancel, or click Confirm.
                        </p>
                        <div class="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onclick={() => (confirmOpen = false)}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" color="error" onclick={() => (confirmOpen = false)}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Card>
            {/if}
        </div>
    </section>

    <!-- Enable/Disable -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Enable / Disable</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-4">
                <Button variant="outline" size="sm" onclick={() => (enabled = !enabled)}>
                    Listener: {enabled ? 'ON' : 'OFF'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => (controlledOpen = true)}
                    disabled={controlledOpen}
                >
                    Show Box
                </Button>
            </div>

            {#if controlledOpen}
                <Card class="mt-3 inline-block p-4">
                    <div
                        use:useEscapeKeydown={{ handler: () => (controlledOpen = false), enabled }}
                    >
                        <p class="text-sm font-medium">Controlled Box</p>
                        <p class="text-xs text-on-surface-variant">
                            {enabled ? 'Press Escape to close' : 'Escape disabled — close manually'}
                        </p>
                        <Button
                            size="xs"
                            variant="ghost"
                            class="mt-2"
                            onclick={() => (controlledOpen = false)}
                        >
                            Close manually
                        </Button>
                    </div>
                </Card>
            {/if}
        </div>
    </section>
</div>
