<script lang="ts">
    import { useClickOutside } from '$lib/index.js'
    import { Button, Badge, Card } from '$lib/index.js'

    let dropdownOpen = $state(false)
    let clickCount = $state(0)

    let editMode = $state(false)
    let editValue = $state('Click to edit this text')

    let popupOpen = $state(false)
    let enabled = $state(true)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useClickOutside</h1>
        <p class="text-on-surface-variant">
            Svelte action that detects clicks outside an element. Use it with
            <code class="rounded bg-surface-container px-1">use:useClickOutside</code>.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Click inside the blue box — nothing happens. Click outside — counter increments.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-4">
                <div
                    use:useClickOutside={{ handler: () => clickCount++ }}
                    class="flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10 p-8"
                >
                    <span class="text-sm font-medium">Click outside me</span>
                </div>
                <Badge
                    label="Outside clicks: {clickCount}"
                    color={clickCount > 0 ? 'primary' : 'surface'}
                    variant="subtle"
                />
            </div>
        </div>
    </section>

    <!-- Dropdown -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dropdown</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="relative inline-block">
                <Button onclick={() => (dropdownOpen = !dropdownOpen)}>
                    {dropdownOpen ? 'Close Menu' : 'Open Menu'}
                </Button>

                {#if dropdownOpen}
                    <div
                        use:useClickOutside={{ handler: () => (dropdownOpen = false) }}
                        class="absolute top-full left-0 z-10 mt-2 w-48 rounded-lg border border-outline-variant bg-surface-container p-1 shadow-lg"
                    >
                        {#each ['Profile', 'Settings', 'Logout'] as item (item)}
                            <button
                                class="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-surface-container-high"
                                onclick={() => (dropdownOpen = false)}
                            >
                                {item}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </section>

    <!-- Inline Edit -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inline Edit</h2>
        <p class="text-sm text-on-surface-variant">
            Click the text to edit. Click outside to save.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            {#if editMode}
                <div use:useClickOutside={{ handler: () => (editMode = false) }}>
                    <input
                        bind:value={editValue}
                        class="w-full max-w-sm rounded-md border border-primary bg-surface px-3 py-2 text-sm ring-2 ring-primary/30 outline-none"
                    />
                </div>
            {:else}
                <button
                    class="rounded-md px-3 py-2 text-sm hover:bg-surface-container"
                    onclick={() => (editMode = true)}
                >
                    {editValue}
                    <span class="ml-2 text-xs text-on-surface-variant">(click to edit)</span>
                </button>
            {/if}
        </div>
    </section>

    <!-- Enabled/Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Enable / Disable</h2>
        <p class="text-sm text-on-surface-variant">
            Toggle the listener on and off with the <code class="rounded bg-surface-container px-1"
                >enabled</code
            > option.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center gap-4">
                <Button variant="outline" size="sm" onclick={() => (enabled = !enabled)}>
                    Listener: {enabled ? 'ON' : 'OFF'}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => (popupOpen = true)}
                    disabled={popupOpen}
                >
                    Show Popup
                </Button>
            </div>

            {#if popupOpen}
                <Card class="mt-3 inline-block p-4">
                    <div
                        use:useClickOutside={{
                            handler: () => (popupOpen = false),
                            enabled
                        }}
                    >
                        <p class="text-sm font-medium">Popup Content</p>
                        <p class="text-xs text-on-surface-variant">
                            {enabled
                                ? 'Click outside to close'
                                : 'Outside click disabled — use button'}
                        </p>
                        <Button
                            size="xs"
                            variant="ghost"
                            class="mt-2"
                            onclick={() => (popupOpen = false)}
                        >
                            Close manually
                        </Button>
                    </div>
                </Card>
            {/if}
        </div>
    </section>
</div>
