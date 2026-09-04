<script lang="ts">
    import { useLocalStorage, useSessionStorage } from '$lib/index.js'
    import { Button, Input, Badge, Switch } from '$lib/index.js'

    const note = useLocalStorage('sv5ui-demo-note', '')
    const count = useLocalStorage('sv5ui-demo-count', 0)

    let persist = $state(true)
    const optional = useLocalStorage(() => (persist ? 'sv5ui-demo-optional' : null), '')

    const profiles = ['alice', 'bob'] as const
    let profile = $state<(typeof profiles)[number]>('alice')
    const perProfile = useLocalStorage(() => `sv5ui-demo-profile-${profile}`, '')

    const draft = useSessionStorage('sv5ui-demo-draft', '')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useLocalStorage / useSessionStorage</h1>
        <p class="text-on-surface-variant">
            Reactive storage-backed value. Reads on mount, writes through on change, and syncs
            across tabs via the <code>storage</code> event. The key may be a getter, and a
            <code>null</code> key turns persistence off without branching. SSR-safe; parse and quota errors
            are tolerated.
        </p>
    </div>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Persisted text</h2>
        <p class="text-sm text-on-surface-variant">
            Type below, then reload the page — the value persists. Open this page in a second tab to
            see live cross-tab sync.
        </p>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <Input bind:value={note.current} placeholder="Persists across reloads & tabs..." />
            <p class="text-xs text-on-surface-variant">
                Stored under key <code>sv5ui-demo-note</code>.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Persisted counter</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button size="sm" variant="outline" onclick={() => (count.current -= 1)}>−</Button>
            <Badge label={count.current} color="primary" variant="soft" size="lg" />
            <Button size="sm" variant="outline" onclick={() => (count.current += 1)}>+</Button>
            <Button size="sm" variant="soft" color="error" onclick={() => (count.current = 0)}>
                Reset
            </Button>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Optional persistence</h2>
        <p class="text-sm text-on-surface-variant">
            A <code>null</code> key makes the hook inert: the value still works as ordinary state and
            nothing is written. This is what a component needs when persistence is opt-in through a prop.
        </p>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <Switch size="sm" label="Persist this field" bind:checked={persist} />
            <Input bind:value={optional.current} placeholder="Type, toggle, then reload..." />
            <p class="text-xs text-on-surface-variant">
                enabled: <code>{optional.enabled}</code> · key
                <code>{persist ? 'sv5ui-demo-optional' : 'null'}</code>
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">A key that changes</h2>
        <p class="text-sm text-on-surface-variant">
            Pass a getter and the hook follows it: switching profile reads that profile's slot, and
            falls back to the initial value when the slot is empty.
        </p>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap gap-2">
                {#each profiles as name (name)}
                    <Button
                        size="xs"
                        variant={profile === name ? 'solid' : 'outline'}
                        label={name}
                        onclick={() => (profile = name)}
                    />
                {/each}
            </div>
            <Input bind:value={perProfile.current} placeholder="Note for {profile}..." />
            <p class="text-xs text-on-surface-variant">
                Stored under <code>sv5ui-demo-profile-{profile}</code>.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useSessionStorage</h2>
        <p class="text-sm text-on-surface-variant">
            The same hook backed by <code>sessionStorage</code>: the value belongs to this tab
            alone. It survives a reload, disappears when the tab closes, and is never shared with
            another tab, which suits a wizard draft, a filter set, or a layout that should not
            follow the user forever.
        </p>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <Input bind:value={draft.current} placeholder="Survives a reload, not a new tab..." />
            <p class="text-xs text-on-surface-variant">
                Open this page in a second tab: this field stays empty there, while the fields above
                are shared.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">remove()</h2>
        <p class="text-sm text-on-surface-variant">
            Deletes the entry and returns to the initial value, instead of writing that value back
            the way assigning it would.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                size="sm"
                variant="soft"
                color="error"
                label="remove()"
                onclick={draft.remove}
            />
            <span class="text-xs text-on-surface-variant">
                clears <code>sv5ui-demo-draft</code> from sessionStorage
            </span>
        </div>
    </section>
</div>
