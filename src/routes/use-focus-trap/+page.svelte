<script lang="ts">
    import { useFocusTrap } from '$lib/index.js'
    import { Button, Badge, Input } from '$lib/index.js'

    let active = $state(false)
    let panel = $state<HTMLElement>()

    useFocusTrap(() => panel, { active: () => active })
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useFocusTrap</h1>
        <p class="text-on-surface-variant">
            Trap keyboard focus within an element while active, then restore focus on exit. Cycles
            Tab / Shift+Tab among the focusable descendants. Target and <code>active</code> accept a value
            or reactive getter; SSR-safe.
        </p>
        <p class="text-sm text-on-surface-variant">
            Note: components built on bits-ui (Modal, Slideover, Drawer, Popover) already trap focus
            — use this for your own custom focus-scoped UI.
        </p>
    </div>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Toggle a focus trap</h2>
        <p class="text-sm text-on-surface-variant">
            Activate, then press <kbd class="rounded bg-surface-container-high px-1">Tab</kbd> — focus
            stays inside the panel and wraps around. Closing returns focus to the Activate button.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-3">
                <Button
                    variant={active ? 'soft' : 'solid'}
                    disabled={active}
                    onclick={() => (active = true)}
                >
                    Activate trap
                </Button>
                <Badge
                    label={active ? 'Trapped' : 'Free'}
                    color={active ? 'success' : 'surface'}
                    variant="soft"
                />
            </div>

            <div
                bind:this={panel}
                class="space-y-3 rounded-lg border-2 border-dashed p-4 transition-colors {active
                    ? 'border-primary'
                    : 'border-outline-variant'}"
            >
                <p class="text-sm font-medium">Trapped panel</p>
                <Input placeholder="First field" />
                <Input placeholder="Second field" />
                <div class="flex gap-2">
                    <Button size="sm" variant="outline">Action</Button>
                    <Button size="sm" color="error" variant="soft" onclick={() => (active = false)}>
                        Close
                    </Button>
                </div>
            </div>

            <p class="text-xs text-on-surface-variant">
                Try tabbing past the last button — it loops back to the first field.
            </p>
        </div>
    </section>
</div>
