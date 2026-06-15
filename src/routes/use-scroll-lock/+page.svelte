<script lang="ts">
    import { useScrollLock } from '$lib/index.js'
    import { Button, Badge, Icon } from '$lib/index.js'

    // ==================== Element target ====================
    let box = $state<HTMLElement>()
    let boxLocked = $state(false)
    useScrollLock(
        () => boxLocked,
        () => box
    )

    // ==================== Page (body) target ====================
    let pageLocked = $state(false)
    useScrollLock(() => pageLocked)

    const rows = Array.from({ length: 24 }, (_, i) => i + 1)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useScrollLock</h1>
        <p class="text-on-surface-variant">
            Lock scroll on an element (default <code>document.body</code>) while a reactive
            <code>locked</code> is true. Compensates for the scrollbar width to avoid layout jump, reference-counts
            nested locks, and restores the original styles on release. SSR-safe.
        </p>
    </div>

    <!-- Element target -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lock an element</h2>
        <p class="text-sm text-on-surface-variant">
            Toggle to lock scrolling inside the box below. Try scrolling it while locked.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-3">
                <Button
                    size="sm"
                    variant={boxLocked ? 'solid' : 'outline'}
                    color={boxLocked ? 'error' : 'primary'}
                    onclick={() => (boxLocked = !boxLocked)}
                >
                    {boxLocked ? 'Unlock' : 'Lock'} box
                </Button>
                <Badge
                    label={boxLocked ? 'Locked' : 'Scrollable'}
                    color={boxLocked ? 'error' : 'success'}
                    variant="soft"
                />
            </div>
            <div
                bind:this={box}
                class="h-48 space-y-1 overflow-auto rounded-lg border border-outline-variant bg-surface p-3"
            >
                {#each rows as n (n)}
                    <div class="rounded-md bg-surface-container px-3 py-2 text-sm">Row {n}</div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Page target -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lock the page (body)</h2>
        <p class="text-sm text-on-surface-variant">
            The default target is <code>document.body</code> — this is what Modal / Slideover / Drawer
            use to freeze the page behind an overlay. Toggle and try scrolling the page.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                size="sm"
                variant={pageLocked ? 'solid' : 'outline'}
                color={pageLocked ? 'error' : 'primary'}
                onclick={() => (pageLocked = !pageLocked)}
            >
                <Icon name={pageLocked ? 'lucide:lock' : 'lucide:lock-open'} size="16" />
                {pageLocked ? 'Unlock' : 'Lock'} page
            </Button>
            <Badge
                label={pageLocked ? 'Page locked' : 'Page scrollable'}
                color={pageLocked ? 'error' : 'success'}
                variant="soft"
            />
        </div>
    </section>
</div>
