<script lang="ts">
    import { useThrottle } from '$lib/index.js'
    import { Button, Badge, Card, Icon, Input } from '$lib/index.js'

    // ==================== Throttled input ====================
    let keystrokes = $state(0)
    let queryUpdates = $state(0)
    let throttledQuery = $state('')
    const searchThrottle = useThrottle({ delay: 300 })

    function handleSearch(e: Event) {
        keystrokes++
        const value = (e.currentTarget as HTMLInputElement).value
        searchThrottle.run(() => {
            throttledQuery = value
            queryUpdates++
        })
    }

    // ==================== Mousemove rate ====================
    let rawMoves = $state(0)
    let throttledRuns = $state(0)
    const moveThrottle = useThrottle({ delay: 100 })

    function handleMove() {
        rawMoves++
        moveThrottle.run(() => throttledRuns++)
    }

    function resetMove() {
        rawMoves = 0
        throttledRuns = 0
    }

    // ==================== Rapid clicks (leading + trailing) ====================
    let log = $state<{ id: number; text: string }[]>([])
    let logId = 0
    const clickThrottle = useThrottle({ delay: 600 })

    function handleClick() {
        clickThrottle.run(() => {
            log = [
                { id: ++logId, text: `Fired at ${new Date().toLocaleTimeString()}` },
                ...log
            ].slice(0, 6)
        })
    }
</script>

<div class="space-y-8">
    <div>
        <h1 class="text-2xl font-bold text-on-surface">useThrottle</h1>
        <p class="mt-1 text-on-surface-variant">
            Cap a callback to at most once per <code>delay</code>, with leading and trailing
            invocation. The companion to <code>useDebounce</code> — ideal for scroll, resize, mousemove,
            and drag handlers.
        </p>
    </div>

    <Card>
        <h2 class="mb-1 font-semibold text-on-surface">Throttled input (delay: 300ms)</h2>
        <p class="mb-4 text-sm text-on-surface-variant">
            Type quickly. Unlike <code>useDebounce</code> (which waits for a pause), throttle
            updates the query at a steady rate <em>while</em> you type — good for live filtering.
        </p>

        <Input placeholder="Type to search…" oninput={handleSearch} />

        <div class="mt-4 flex flex-wrap items-center gap-4">
            <Badge color="secondary">Keystrokes: {keystrokes}</Badge>
            <Badge color="primary">Query updates: {queryUpdates}</Badge>
            <span class="text-sm text-on-surface-variant">
                Throttled value: <span class="font-medium text-on-surface"
                    >{throttledQuery || '—'}</span
                >
            </span>
        </div>
    </Card>

    <Card>
        <h2 class="mb-1 font-semibold text-on-surface">Mousemove rate (delay: 100ms)</h2>
        <p class="mb-4 text-sm text-on-surface-variant">
            Move your cursor across the box. Raw events fire on every pixel; the throttled callback
            runs at most ~10×/second.
        </p>

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            onmousemove={handleMove}
            class="flex h-40 items-center justify-center rounded-lg border border-dashed border-outline bg-surface-container-low text-on-surface-variant"
        >
            <Icon name="lucide:move" size="20" />
            <span class="ml-2">Move here</span>
        </div>

        <div class="mt-4 flex items-center gap-4">
            <Badge color="secondary">Raw events: {rawMoves}</Badge>
            <Badge color="primary">Throttled runs: {throttledRuns}</Badge>
            <Button size="sm" variant="ghost" onclick={resetMove}>Reset</Button>
        </div>
    </Card>

    <Card>
        <h2 class="mb-1 font-semibold text-on-surface">Rapid clicks (delay: 600ms)</h2>
        <p class="mb-4 text-sm text-on-surface-variant">
            Click fast: the first click fires immediately (leading), then bursts collapse into one
            trailing call per window.
        </p>

        <div class="flex items-center gap-3">
            <Button color="primary" onclick={handleClick}>Click me fast</Button>
            {#if clickThrottle.pending}
                <Badge color="warning">trailing pending…</Badge>
            {/if}
        </div>

        {#if log.length}
            <ul class="mt-4 space-y-1 text-sm text-on-surface-variant">
                {#each log as entry (entry.id)}
                    <li class="flex items-center gap-2">
                        <Icon name="lucide:check" size="14" class="text-success" />
                        {entry.text}
                    </li>
                {/each}
            </ul>
        {/if}
    </Card>
</div>
