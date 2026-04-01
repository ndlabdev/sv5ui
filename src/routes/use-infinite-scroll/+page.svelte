<script lang="ts">
    import { useInfiniteScroll } from '$lib/index.js'
    import { Badge, Button, Skeleton } from '$lib/index.js'

    let items = $state<{ id: number; title: string }[]>(
        Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `Item ${i + 1}` }))
    )
    let hasMore = $state(true)
    let loadCount = $state(0)

    async function fetchMore() {
        await new Promise((r) => setTimeout(r, 800))
        const start = items.length
        const next = Array.from({ length: 20 }, (_, i) => ({
            id: start + i + 1,
            title: `Item ${start + i + 1}`
        }))
        items.push(...next)
        loadCount++
        if (items.length >= 100) hasMore = false
    }

    const scroll = useInfiniteScroll({
        onLoad: fetchMore,
        threshold: 150,
        enabled: () => hasMore
    })

    // Reset demo
    function reset() {
        items = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `Item ${i + 1}` }))
        hasMore = true
        loadCount = 0
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useInfiniteScroll</h1>
        <p class="text-on-surface-variant">
            Reactive infinite scroll hook with Svelte action. Triggers a callback when the user
            scrolls near the bottom of a container.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Scroll down inside the container to load more items. Stops at 100 items.
        </p>
        <div class="flex flex-wrap items-center gap-3">
            <Badge label="Items: {items.length}" color="primary" variant="subtle" />
            <Badge label="Loads: {loadCount}" color="info" variant="subtle" />
            <Badge
                label={hasMore ? 'Has more' : 'All loaded'}
                color={hasMore ? 'success' : 'surface'}
                variant="subtle"
            />
            <Button size="xs" variant="outline" onclick={reset}>Reset</Button>
        </div>
        <div
            use:scroll.action
            class="h-80 space-y-2 overflow-y-auto rounded-lg bg-surface-container-high p-4"
        >
            {#each items as item (item.id)}
                <div
                    class="flex items-center justify-between rounded-md bg-surface-container px-4 py-3"
                >
                    <span class="text-sm">{item.title}</span>
                    <Badge label="#{item.id}" color="surface" variant="outline" size="sm" />
                </div>
            {/each}

            {#if scroll.loading}
                <div class="space-y-2 pt-2">
                    <Skeleton class="h-11 w-full rounded-md" />
                    <Skeleton class="h-11 w-full rounded-md" />
                    <Skeleton class="h-11 w-full rounded-md" />
                </div>
            {/if}

            {#if !hasMore}
                <p class="py-4 text-center text-sm text-on-surface-variant">All items loaded</p>
            {/if}
        </div>
    </section>

    <!-- Card Grid -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World: Card Feed</h2>
        <p class="text-sm text-on-surface-variant">
            Infinite scroll works with any scrollable container — grids, lists, feeds.
        </p>
        <div
            use:scroll.action
            class="h-96 overflow-y-auto rounded-lg bg-surface-container-high p-4"
        >
            <div class="grid gap-3 sm:grid-cols-2">
                {#each items as item (item.id)}
                    <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                        <div class="mb-2 flex items-center justify-between">
                            <span class="text-sm font-medium">{item.title}</span>
                            <Badge label="#{item.id}" color="primary" variant="soft" size="sm" />
                        </div>
                        <p class="text-xs text-on-surface-variant">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>
                {/each}
            </div>

            {#if scroll.loading}
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                    {#each Array.from({ length: 4 }, (__, i) => i) as i (i)}
                        <Skeleton class="h-24 w-full rounded-lg" />
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</div>
