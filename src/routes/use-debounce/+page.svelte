<script lang="ts">
    import { useDebounce } from '$lib/index.js'
    import { Button, Input, Badge, Card, Icon } from '$lib/index.js'

    // ==================== Basic ====================
    let searchQuery = $state('')
    let searchResult = $state('')
    let searchCount = $state(0)
    const searchDebounce = useDebounce({ delay: 500 })

    function handleSearch(e: Event) {
        searchQuery = (e.currentTarget as HTMLInputElement).value
        searchDebounce.run(() => {
            searchResult = searchQuery
            searchCount++
        })
    }

    // ==================== Auto-save ====================
    let noteText = $state('Start typing to auto-save...')
    let savedText = $state('')
    let saveCount = $state(0)
    const saveDebounce = useDebounce({ delay: 1000 })

    function handleNoteInput(e: Event) {
        noteText = (e.currentTarget as HTMLTextAreaElement).value
        saveDebounce.run(() => {
            savedText = noteText
            saveCount++
        })
    }

    // ==================== API Simulation ====================
    interface UserResult {
        id: number
        name: string
    }

    let apiQuery = $state('')
    let apiResults = $state<UserResult[]>([])
    let apiLoading = $state(false)
    const apiDebounce = useDebounce({ delay: 400 })

    const allUsers: UserResult[] = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
        { id: 3, name: 'Charlie Brown' },
        { id: 4, name: 'Diana Prince' },
        { id: 5, name: 'Eve Davis' },
        { id: 6, name: 'Frank Wilson' },
        { id: 7, name: 'Grace Taylor' },
        { id: 8, name: 'Henry Clark' }
    ]

    function handleApiSearch(e: Event) {
        apiQuery = (e.currentTarget as HTMLInputElement).value
        if (!apiQuery.trim()) {
            apiDebounce.cancel()
            apiResults = []
            apiLoading = false
            return
        }
        apiDebounce.run(async () => {
            apiLoading = true
            await new Promise((r) => setTimeout(r, 300))
            const q = apiQuery.toLowerCase()
            apiResults = allUsers.filter((u) => u.name.toLowerCase().includes(q))
            apiLoading = false
        })
    }

    // ==================== Cancel & Flush ====================
    let controlValue = $state('')
    let controlResult = $state('')
    const controlDebounce = useDebounce({ delay: 2000 })

    function handleControlInput(e: Event) {
        controlValue = (e.currentTarget as HTMLInputElement).value
        controlDebounce.run(() => {
            controlResult = controlValue
        })
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useDebounce</h1>
        <p class="text-on-surface-variant">
            Reactive debounce hook. Delays execution until a pause in calls. Tracks pending state
            and supports cancel/flush.
        </p>
    </div>

    <!-- Basic Search -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic: Search</h2>
        <p class="text-sm text-on-surface-variant">
            Type in the input — the search only fires after 500ms of inactivity.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Input
                value={searchQuery}
                oninput={handleSearch}
                placeholder="Search something..."
                leadingIcon="lucide:search"
            />
            <div class="flex flex-wrap items-center gap-3">
                <Badge
                    label={searchDebounce.pending ? 'Typing...' : 'Idle'}
                    color={searchDebounce.pending ? 'warning' : 'surface'}
                    variant="soft"
                />
                <Badge label="Executed: {searchCount}x" color="info" variant="subtle" />
                {#if searchResult}
                    <span class="text-sm text-on-surface-variant">
                        Last search: <strong>{searchResult}</strong>
                    </span>
                {/if}
            </div>
        </div>
    </section>

    <!-- Auto-save -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Auto-save</h2>
        <p class="text-sm text-on-surface-variant">
            Content auto-saves 1 second after you stop typing.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <textarea
                value={noteText}
                oninput={handleNoteInput}
                rows="3"
                class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            ></textarea>
            <div class="flex items-center gap-3">
                {#if saveDebounce.pending}
                    <Badge label="Unsaved changes..." color="warning" variant="soft" />
                {:else}
                    <Badge
                        label={saveCount > 0 ? 'Saved' : 'No changes'}
                        color={saveCount > 0 ? 'success' : 'surface'}
                        variant="soft"
                    />
                {/if}
                {#if savedText}
                    <span class="text-xs text-on-surface-variant">
                        Last saved: {savedText.length} chars
                    </span>
                {/if}
            </div>
        </div>
    </section>

    <!-- API Search -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World: API Search</h2>
        <p class="text-sm text-on-surface-variant">
            Debounced API call with loading state. Try typing "alice", "bob", or "grace".
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Input
                value={apiQuery}
                oninput={handleApiSearch}
                placeholder="Search users..."
                leadingIcon="lucide:users"
                loading={apiLoading}
            />

            {#if apiResults.length > 0}
                <div class="space-y-1">
                    {#each apiResults as user (user.id)}
                        <div
                            class="flex items-center gap-3 rounded-md bg-surface-container px-3 py-2"
                        >
                            <Icon name="lucide:user" size="16" class="text-on-surface-variant" />
                            <span class="text-sm">{user.name}</span>
                        </div>
                    {/each}
                </div>
            {:else if apiQuery && !apiLoading && !apiDebounce.pending}
                <p class="text-sm text-on-surface-variant">No users found.</p>
            {/if}
        </div>
    </section>

    <!-- Cancel & Flush -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Cancel & Flush</h2>
        <p class="text-sm text-on-surface-variant">
            Delay is 2 seconds. Use <strong>Cancel</strong> to discard, or <strong>Flush</strong> to execute
            immediately.
        </p>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Input
                value={controlValue}
                oninput={handleControlInput}
                placeholder="Type and use buttons below..."
            />
            <div class="flex flex-wrap items-center gap-3">
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => controlDebounce.cancel()}
                    disabled={!controlDebounce.pending}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    variant="soft"
                    onclick={() => controlDebounce.flush(() => (controlResult = controlValue))}
                    disabled={!controlDebounce.pending}
                >
                    Flush Now
                </Button>
                <Badge
                    label={controlDebounce.pending ? 'Pending (2s)...' : 'Idle'}
                    color={controlDebounce.pending ? 'warning' : 'surface'}
                    variant="soft"
                />
            </div>
            {#if controlResult}
                <Card class="p-3">
                    <p class="text-sm">
                        Result: <strong>{controlResult}</strong>
                    </p>
                </Card>
            {/if}
        </div>
    </section>
</div>
