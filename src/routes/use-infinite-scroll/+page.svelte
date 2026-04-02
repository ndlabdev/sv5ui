<script lang="ts">
    import { useInfiniteScroll } from '$lib/index.js'
    import { Badge, Button, Skeleton, Table, type TableColumn } from '$lib/index.js'

    // ==================== Basic List ====================

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

    function reset() {
        items = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `Item ${i + 1}` }))
        hasMore = true
        loadCount = 0
    }

    // ==================== Table ====================

    interface User {
        id: number
        name: string
        email: string
        role: string
        status: 'active' | 'inactive' | 'pending'
    }

    const roles = ['Admin', 'Editor', 'Viewer', 'Moderator']
    const statuses = ['active', 'inactive', 'pending'] as const
    const firstNames = [
        'Alice',
        'Bob',
        'Charlie',
        'Diana',
        'Eve',
        'Frank',
        'Grace',
        'Henry',
        'Iris',
        'Jack'
    ]
    const lastNames = [
        'Johnson',
        'Smith',
        'Brown',
        'Prince',
        'Davis',
        'Wilson',
        'Taylor',
        'Clark',
        'Lee',
        'Hall'
    ]

    function generateUsers(start: number, count: number): User[] {
        return Array.from({ length: count }, (_, i) => {
            const id = start + i + 1
            const first = firstNames[id % firstNames.length]
            const last = lastNames[Math.floor(id / firstNames.length) % lastNames.length]
            return {
                id,
                name: `${first} ${last}`,
                email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@example.com`,
                role: roles[id % roles.length],
                status: statuses[id % statuses.length]
            }
        })
    }

    let users = $state<User[]>(generateUsers(0, 30))
    let tableHasMore = $state(true)
    let tableLoadCount = $state(0)

    async function fetchMoreUsers() {
        await new Promise((r) => setTimeout(r, 1000))
        const next = generateUsers(users.length, 30)
        users.push(...next)
        tableLoadCount++
        if (users.length >= 150) tableHasMore = false
    }

    const tableScroll = useInfiniteScroll({
        onLoad: fetchMoreUsers,
        threshold: 200,
        enabled: () => tableHasMore
    })

    const columns: TableColumn<User>[] = [
        { key: 'id', label: '#', width: 60, align: 'center' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' }
    ]

    function resetTable() {
        users = generateUsers(0, 30)
        tableHasMore = true
        tableLoadCount = 0
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

    <!-- Basic List -->
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

    <!-- Table + Infinite Scroll -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Table + Infinite Scroll</h2>
        <p class="text-sm text-on-surface-variant">
            Combine with the Table component for paginated data loading. Scroll the table to
            automatically load more rows. Stops at 150 users.
        </p>
        <div class="flex flex-wrap items-center gap-3">
            <Badge label="Users: {users.length}" color="primary" variant="subtle" />
            <Badge label="Loads: {tableLoadCount}" color="info" variant="subtle" />
            <Badge
                label={tableHasMore ? 'Has more' : 'All loaded'}
                color={tableHasMore ? 'success' : 'surface'}
                variant="subtle"
            />
            <Button size="xs" variant="outline" onclick={resetTable}>Reset</Button>
        </div>
        <Table
            data={users}
            {columns}
            rowKey="id"
            manualPagination
            total={users.length}
            pageSize={users.length}
            sticky="header"
            hoverable
            loading={tableScroll.loading}
            action={tableScroll.action}
            class="h-112 overflow-y-auto"
        >
            {#snippet cellSlot({ column, value })}
                {@const cellValue = String(value ?? '')}
                {#if column.key === 'status'}
                    <Badge
                        label={cellValue}
                        color={cellValue === 'active'
                            ? 'success'
                            : cellValue === 'pending'
                              ? 'warning'
                              : 'surface'}
                        variant="soft"
                        size="sm"
                    />
                {:else if column.key === 'role'}
                    <Badge label={cellValue} color="info" variant="subtle" size="sm" />
                {:else}
                    {cellValue}
                {/if}
            {/snippet}

            {#snippet bodyBottomSlot()}
                {#if !tableHasMore}
                    <tr>
                        <td
                            colspan={columns.length}
                            class="py-4 text-center text-sm text-on-surface-variant"
                        >
                            All users loaded
                        </td>
                    </tr>
                {/if}
            {/snippet}
        </Table>
    </section>
</div>
