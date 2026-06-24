<script lang="ts">
    import { useDebouncedState } from '$lib/index.js'
    import { Input, Badge, Card, Button } from '$lib/index.js'

    const fruits = [
        'Apple',
        'Banana',
        'Blueberry',
        'Cherry',
        'Grape',
        'Mango',
        'Orange',
        'Peach',
        'Pear',
        'Pineapple',
        'Strawberry',
        'Watermelon'
    ]

    const search = useDebouncedState('', 300)

    const filtered = $derived(
        search.debounced.trim() === ''
            ? fruits
            : fruits.filter((f) => f.toLowerCase().includes(search.debounced.trim().toLowerCase()))
    )
</script>

<div class="space-y-8">
    <div>
        <h1 class="text-2xl font-bold text-on-surface">useDebouncedState</h1>
        <p class="mt-1 text-on-surface-variant">
            Reactive state whose <code>debounced</code> mirror lags behind <code>current</code> by a
            delay — write <code>current</code> from an input and derive from <code>debounced</code>,
            with no manual two-state wiring.
        </p>
    </div>

    <Card>
        <h2 class="mb-1 font-semibold text-on-surface">Debounced filter (delay: 300ms)</h2>
        <p class="mb-4 text-sm text-on-surface-variant">
            <code>current</code> updates on every keystroke; the list re-filters only once typing settles.
        </p>

        <Input placeholder="Filter fruits…" bind:value={search.current} />

        <div class="mt-4 flex flex-wrap items-center gap-3">
            <Badge color="secondary">current: "{search.current}"</Badge>
            <Badge color="primary">debounced: "{search.debounced}"</Badge>
            <Button size="sm" variant="ghost" onclick={() => search.setImmediate('')}>Clear</Button>
        </div>

        <ul class="mt-4 flex flex-wrap gap-2">
            {#each filtered as fruit (fruit)}
                <li class="rounded-md bg-surface-container px-3 py-1 text-sm text-on-surface">
                    {fruit}
                </li>
            {:else}
                <li class="text-sm text-on-surface-variant">No matches.</li>
            {/each}
        </ul>
    </Card>
</div>
