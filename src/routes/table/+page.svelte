<script lang="ts">
    import {
        Table,
        Badge,
        Avatar,
        Button,
        Input,
        Icon,
        Pagination,
        DropdownMenu,
        type TableColumn,
        type SortState,
        type TableCellSlotProps,
        type TableFooterSlotProps,
        type DropdownMenuItem
    } from '$lib/index.js'

    // ==================== Types ====================

    interface User {
        id: string
        name: string
        email: string
        role: string
        status: 'active' | 'inactive' | 'pending'
        avatar: string
    }

    interface Product {
        name: string
        category: string
        price: number
        stock: number
    }

    interface Department {
        id: string
        name: string
        manager: string
        employees: number
        budget: string
        children?: Department[]
    }

    // ==================== Data ====================

    const users: User[] = [
        {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Admin',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=alice'
        },
        {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            role: 'User',
            status: 'inactive',
            avatar: 'https://i.pravatar.cc/150?u=bob'
        },
        {
            id: '3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Editor',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=charlie'
        },
        {
            id: '4',
            name: 'Diana Prince',
            email: 'diana@example.com',
            role: 'Admin',
            status: 'pending',
            avatar: 'https://i.pravatar.cc/150?u=diana'
        },
        {
            id: '5',
            name: 'Eve Wilson',
            email: 'eve@example.com',
            role: 'User',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=eve'
        }
    ]

    const manyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: String(i + 1),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['Admin', 'User', 'Editor'][i % 3],
        status: (['active', 'inactive', 'pending'] as const)[i % 3],
        avatar: `https://i.pravatar.cc/150?u=user${i + 1}`
    }))

    const products: Product[] = [
        { name: 'MacBook Pro', category: 'Electronics', price: 2499, stock: 12 },
        { name: 'iPhone 16', category: 'Electronics', price: 999, stock: 45 },
        { name: 'AirPods Pro', category: 'Accessories', price: 249, stock: 100 },
        { name: 'Magic Keyboard', category: 'Accessories', price: 299, stock: 30 },
        { name: 'Studio Display', category: 'Electronics', price: 1599, stock: 8 }
    ]

    const departments: Department[] = [
        {
            id: 'eng',
            name: 'Engineering',
            manager: 'Alice Johnson',
            employees: 42,
            budget: '$2.1M',
            children: [
                {
                    id: 'eng-fe',
                    name: 'Frontend',
                    manager: 'Bob Smith',
                    employees: 15,
                    budget: '$750K'
                },
                {
                    id: 'eng-be',
                    name: 'Backend',
                    manager: 'Charlie Brown',
                    employees: 18,
                    budget: '$900K'
                },
                {
                    id: 'eng-infra',
                    name: 'Infrastructure',
                    manager: 'Diana Prince',
                    employees: 9,
                    budget: '$450K'
                }
            ]
        },
        {
            id: 'design',
            name: 'Design',
            manager: 'Eve Wilson',
            employees: 12,
            budget: '$600K',
            children: [
                {
                    id: 'design-ux',
                    name: 'UX Research',
                    manager: 'Frank Lee',
                    employees: 5,
                    budget: '$250K'
                },
                {
                    id: 'design-ui',
                    name: 'UI Design',
                    manager: 'Grace Kim',
                    employees: 7,
                    budget: '$350K'
                }
            ]
        },
        {
            id: 'marketing',
            name: 'Marketing',
            manager: 'Henry Zhang',
            employees: 8,
            budget: '$400K'
        }
    ]

    // Flatten departments with parent-child for expandable
    const flatDepartments = $derived.by(() => {
        const result: (Department & { level: number; parentId?: string })[] = []
        for (const dept of departments) {
            result.push({ ...dept, level: 0 })
        }
        return result
    })

    const statusColor: Record<string, 'success' | 'error' | 'warning'> = {
        active: 'success',
        inactive: 'error',
        pending: 'warning'
    }

    const roleColor: Record<string, 'primary' | 'secondary' | 'tertiary'> = {
        Admin: 'primary',
        User: 'secondary',
        Editor: 'tertiary'
    }

    // ==================== Rich Columns ====================
    const richColumns: TableColumn<User>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', cell: userCell },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', cell: roleCell },
        { key: 'status', label: 'Status', cell: statusCell }
    ]

    // ==================== Sorting ====================
    let sorting: SortState = $state([{ key: 'name', direction: 'asc' }])

    const sortColumns: TableColumn<User>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', sortable: true, cell: userCell },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', sortable: true, cell: roleCell },
        { key: 'status', label: 'Status', sortable: true, cell: statusCell }
    ]

    // ==================== Row Actions ====================
    function getRowActions(row: User): DropdownMenuItem[] {
        return [
            {
                label: 'View profile',
                icon: 'lucide:user',
                onSelect: () => alert(`View ${row.name}`)
            },
            {
                label: 'Send email',
                icon: 'lucide:mail',
                onSelect: () => alert(`Email ${row.email}`)
            },
            { type: 'separator' },
            { label: 'Edit', icon: 'lucide:pencil', onSelect: () => alert(`Edit ${row.name}`) },
            {
                label: 'Delete',
                icon: 'lucide:trash-2',
                color: 'error',
                onSelect: () => alert(`Delete ${row.name}`)
            }
        ]
    }

    const actionColumns: TableColumn<User>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', cell: userCell },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', cell: roleCell },
        { key: 'status', label: 'Status', cell: statusCell },
        { key: 'avatar', label: '', cell: actionsCell, align: 'right', width: 60 }
    ]

    // ==================== Column Pinning ====================
    const pinColumns: TableColumn<User>[] = [
        { key: 'id', label: '#', width: 60 },
        { key: 'name', label: 'Name', cell: userCell, width: 200 },
        { key: 'email', label: 'Email', width: 220 },
        { key: 'role', label: 'Role', cell: roleCell, width: 120 },
        { key: 'status', label: 'Status', cell: statusCell, width: 120 },
        { key: 'avatar', label: '', cell: actionsCell, align: 'right', width: 80 }
    ]

    // ==================== Row Pinning ====================
    let pinnedRows: (string | number)[] = $state(['1', '3'])

    const rowPinColumns: TableColumn<User>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', cell: userCell },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', cell: roleCell },
        { key: 'status', label: 'Status', cell: statusCell },
        { key: 'avatar', label: '', cell: pinActionCell, align: 'right', width: 60 }
    ]

    // ==================== Expandable Rows ====================
    let expandedRows: (string | number)[] = $state([])
    let expandedDepts: (string | number)[] = $state([])

    const deptColumns: TableColumn<Department>[] = [
        { key: 'id', label: '', cell: deptExpandCell, width: 40 },
        { key: 'name', label: 'Department', cell: deptNameCell },
        { key: 'manager', label: 'Manager' },
        { key: 'employees', label: 'Employees', align: 'right' },
        { key: 'budget', label: 'Budget', align: 'right' }
    ]

    // ==================== Row Selection ====================
    let selectedRows: User[] = $state([])

    // ==================== Column Visibility ====================
    let columnVisibility: Record<string, boolean> = $state({})

    const visibilityItems = [
        { value: 'id', label: '#' },
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'status', label: 'Status' }
    ]

    function toggleColumnVisibility(col: string) {
        columnVisibility = {
            ...columnVisibility,
            [col]: columnVisibility[col] === false
        }
    }

    // ==================== Pagination ====================
    let paginationPage = $state(1)
    const pageSize = 10
    const tablePage = $derived(paginationPage - 1)

    // ==================== Row Pinning + Pagination ====================
    let pinPagPage = $state(1)
    const pinPagTablePage = $derived(pinPagPage - 1)
    let pinPagPinnedRows: (string | number)[] = $state(['1', '5', '12'])

    const rowPinPagColumns: TableColumn<User>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', cell: userCell },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', cell: roleCell },
        { key: 'status', label: 'Status', cell: statusCell },
        { key: 'avatar', label: '', cell: pinPagActionCell, align: 'right', width: 60 }
    ]

    // ==================== Selection + Pagination ====================
    let selPagPage = $state(1)
    const selPagTablePage = $derived(selPagPage - 1)
    let selPagSelected: User[] = $state([])

    // ==================== Global Filter ====================
    let globalFilter = $state('')

    // ==================== Loading (Replace data) ====================
    let isLoadingReplace = $state(false)
    function simulateLoadingReplace() {
        isLoadingReplace = true
        setTimeout(() => (isLoadingReplace = false), 2000)
    }

    // ==================== Loading (Overlay) ====================
    let isLoadingOverlay = $state(false)
    function simulateLoadingOverlay() {
        isLoadingOverlay = true
        setTimeout(() => (isLoadingOverlay = false), 2000)
    }

    // ==================== Row Click ====================
    let selectedUser: User | undefined = $state(undefined)

    // ==================== Column Resizing ====================
    let columnSizing: Record<string, number> = $state({})

    const resizableColumns: TableColumn<User>[] = [
        { key: 'id', label: '#', width: 60 },
        { key: 'name', label: 'Name', cell: userCell, resizable: true, width: 200, minWidth: 120 },
        { key: 'email', label: 'Email', resizable: true, width: 220, minWidth: 150 },
        { key: 'role', label: 'Role', cell: roleCell, resizable: true, width: 120, minWidth: 80 },
        { key: 'status', label: 'Status', cell: statusCell, width: 120 }
    ]

    // ==================== Hover / Contextmenu ====================
    let hoveredUser: User | null = $state(null)
    let contextUser: { user: User; x: number; y: number } | null = $state(null)

    // ==================== Product columns ====================
    const productColumns: TableColumn<Product>[] = [
        { key: 'name', label: 'Product' },
        { key: 'category', label: 'Category', cell: categoryCell },
        { key: 'price', label: 'Price', cell: priceCell, align: 'right' },
        { key: 'stock', label: 'Stock', cell: stockCell, align: 'right' }
    ]
</script>

<div class="space-y-16">
    <div>
        <h1 class="text-3xl font-bold text-on-surface">Table</h1>
        <p class="mt-2 text-on-surface-variant">Custom implementation — no external dependency.</p>
    </div>

    <!-- ==================== BASIC ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic</h2>
        <p class="text-sm text-on-surface-variant">Auto-generates columns from data keys.</p>
        <Table
            data={[
                { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
                { name: 'Bob', email: 'bob@example.com', role: 'User' },
                { name: 'Charlie', email: 'charlie@example.com', role: 'Editor' }
            ]}
        />
    </section>

    <!-- ==================== RICH COLUMNS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Rich Columns</h2>
        <p class="text-sm text-on-surface-variant">
            Custom cell snippets with Avatar, Badge components.
        </p>
        <Table data={users} columns={richColumns} rowKey="id" />
    </section>

    <!-- ==================== SORTING (default asc on name) ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sorting</h2>
        <p class="text-sm text-on-surface-variant">
            Default sort on <strong>Name (asc)</strong>. Click headers to toggle.
        </p>
        <Table data={users} columns={sortColumns} bind:sorting rowKey="id" />
        {#if sorting.length > 0}
            <p class="text-xs text-on-surface-variant">
                Sorting: <strong>{sorting[0].key}</strong> ({sorting[0].direction})
            </p>
        {/if}
    </section>

    <!-- ==================== GLOBAL FILTER ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Global Filter</h2>
        <p class="text-sm text-on-surface-variant">Filter across all columns.</p>
        <Input
            placeholder="Search users..."
            bind:value={globalFilter}
            leadingIcon="lucide:search"
            variant="outline"
            class="max-w-sm"
        />
        <Table data={users} columns={richColumns} bind:globalFilter rowKey="id" />
    </section>

    <!-- ==================== ROW ACTIONS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Actions</h2>
        <p class="text-sm text-on-surface-variant">
            DropdownMenu in the last column for per-row actions.
        </p>
        <Table data={users} columns={actionColumns} rowKey="id" />
    </section>

    <!-- ==================== COLUMN PINNING ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Column Pinning</h2>
        <p class="text-sm text-on-surface-variant">
            "#" pinned left, "Actions" pinned right. Scroll horizontally.
        </p>
        <div class="max-w-lg">
            <Table
                data={users}
                columns={pinColumns}
                columnPinning={{ left: ['id'], right: ['avatar'] }}
                rowKey="id"
            />
        </div>
    </section>

    <!-- ==================== ROW PINNING ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Pinning</h2>
        <p class="text-sm text-on-surface-variant">
            Pin rows to the top. Alice and Charlie are pinned by default. Click the pin icon to
            toggle.
        </p>
        <Table data={users} columns={rowPinColumns} bind:pinnedRows rowKey="id" />
        {#if pinnedRows.length > 0}
            <p class="text-xs text-on-surface-variant">
                Pinned: <strong>{pinnedRows.join(', ')}</strong>
            </p>
        {/if}
    </section>

    <!-- ==================== ROW PINNING + PAGINATION ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Pinning + Pagination</h2>
        <p class="text-sm text-on-surface-variant">
            Pinned rows (#1, #5, #12) stay at the top regardless of the current page.
        </p>
        <Table
            data={manyUsers}
            columns={rowPinPagColumns}
            bind:pinnedRows={pinPagPinnedRows}
            page={pinPagTablePage}
            {pageSize}
            rowKey="id"
        />
        <div class="flex items-center justify-between">
            {#if pinPagPinnedRows.length > 0}
                <Badge label="{pinPagPinnedRows.length} pinned" variant="soft" color="primary" />
            {:else}
                <span class="text-sm text-on-surface-variant/50">No pinned rows</span>
            {/if}
            <Pagination
                bind:page={pinPagPage}
                total={manyUsers.length}
                itemsPerPage={pageSize}
                showEdges
                size="sm"
            />
        </div>
    </section>

    <!-- ==================== EXPANDABLE ROWS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Expandable Rows</h2>
        <p class="text-sm text-on-surface-variant">Click the chevron to expand row details.</p>
        <Table
            data={users}
            columns={[
                { key: 'id', label: '', cell: expandCell, width: 40 },
                ...richColumns.slice(1)
            ]}
            bind:expandedRows
            rowKey="id"
        >
            {#snippet expandedSlot({ row })}
                <div class="flex items-start gap-4 p-3">
                    <Avatar src={row.avatar} alt={row.name} size="lg" />
                    <div class="space-y-2">
                        <div>
                            <p class="font-semibold text-on-surface">{row.name}</p>
                            <p class="text-sm text-on-surface-variant">{row.email}</p>
                        </div>
                        <div class="flex gap-2">
                            <Badge
                                label={row.role}
                                variant="soft"
                                color={roleColor[row.role] ?? 'secondary'}
                            />
                            <Badge
                                label={row.status}
                                variant="subtle"
                                color={statusColor[row.status] ?? 'surface'}
                            />
                        </div>
                    </div>
                </div>
            {/snippet}
        </Table>
    </section>

    <!-- ==================== EXPANDABLE: PARENT-CHILD ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Parent-Child Rows</h2>
        <p class="text-sm text-on-surface-variant">
            Expand departments to see sub-departments as a nested table.
        </p>
        <Table
            data={flatDepartments}
            columns={deptColumns}
            bind:expandedRows={expandedDepts}
            rowKey="id"
        >
            {#snippet expandedSlot({ row })}
                {#if row.children && row.children.length > 0}
                    <Table
                        data={row.children}
                        columns={[
                            { key: 'name', label: 'Sub-department' },
                            { key: 'manager', label: 'Manager' },
                            { key: 'employees', label: 'Employees', align: 'right' },
                            { key: 'budget', label: 'Budget', align: 'right' }
                        ]}
                        rowKey="id"
                        ui={{ root: 'border-0 rounded-none shadow-none' }}
                    />
                {:else}
                    <p class="py-2 text-sm text-on-surface-variant">No sub-departments</p>
                {/if}
            {/snippet}
        </Table>
    </section>

    <!-- ==================== ROW SELECTION ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Built-in checkbox column with select-all support.
        </p>
        <Table
            data={users}
            columns={richColumns}
            selection="multiple"
            bind:selectedRows
            rowKey="id"
        />
        {#if selectedRows.length > 0}
            <div class="flex items-center gap-2">
                <Badge label="{selectedRows.length} selected" variant="soft" color="primary" />
                <span class="text-sm text-on-surface-variant"
                    >{selectedRows.map((u) => u.name).join(', ')}</span
                >
            </div>
        {:else}
            <p class="text-sm text-on-surface-variant/50">No rows selected</p>
        {/if}
    </section>

    <!-- ==================== SELECTION + PAGINATION ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Selection + Pagination</h2>
        <p class="text-sm text-on-surface-variant">
            Selections persist across pages. Select some rows, then navigate.
        </p>
        <Table
            data={manyUsers}
            columns={richColumns}
            selection="multiple"
            bind:selectedRows={selPagSelected}
            page={selPagTablePage}
            {pageSize}
            rowKey="id"
        />
        <div class="flex items-center justify-between">
            {#if selPagSelected.length > 0}
                <Badge
                    label="{selPagSelected.length} selected across pages"
                    variant="soft"
                    color="primary"
                />
            {:else}
                <span class="text-sm text-on-surface-variant/50">No rows selected</span>
            {/if}
            <Pagination
                bind:page={selPagPage}
                total={manyUsers.length}
                itemsPerPage={pageSize}
                showEdges
                size="sm"
            />
        </div>
    </section>

    <!-- ==================== COLUMN VISIBILITY ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Column Visibility</h2>
        <p class="text-sm text-on-surface-variant">Toggle columns on/off.</p>
        <div class="flex flex-wrap gap-1.5">
            {#each visibilityItems as item (item.value)}
                <button
                    type="button"
                    class="rounded-full px-2.5 py-1 text-xs transition-colors {columnVisibility[
                        item.value
                    ] === false
                        ? 'bg-surface-container text-on-surface-variant line-through'
                        : 'bg-primary/10 text-primary'}"
                    onclick={() => toggleColumnVisibility(item.value)}
                >
                    {item.label}
                </button>
            {/each}
        </div>
        <Table data={users} columns={richColumns} bind:columnVisibility rowKey="id" />
    </section>

    <!-- ==================== PAGINATION ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Pagination</h2>
        <Table data={manyUsers} columns={richColumns} page={tablePage} {pageSize} rowKey="id" />
        <div class="flex items-center justify-between">
            <p class="text-sm text-on-surface-variant">
                {tablePage * pageSize + 1}–{Math.min((tablePage + 1) * pageSize, manyUsers.length)} of
                {manyUsers.length}
            </p>
            <Pagination
                bind:page={paginationPage}
                total={manyUsers.length}
                itemsPerPage={pageSize}
                showEdges
                size="sm"
            />
        </div>
    </section>

    <!-- ==================== ROW CLICK ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Click</h2>
        <Table
            data={users}
            columns={richColumns}
            onRowClick={(row) => (selectedUser = row)}
            rowKey="id"
        />
        {#if selectedUser}
            <div
                class="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-container/15 p-3"
            >
                <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="sm" />
                <div>
                    <p class="text-sm font-medium text-on-surface">{selectedUser.name}</p>
                    <p class="text-xs text-on-surface-variant">{selectedUser.email}</p>
                </div>
                <Badge
                    label={selectedUser.role}
                    variant="soft"
                    color={roleColor[selectedUser.role] ?? 'secondary'}
                    class="ml-auto"
                />
            </div>
        {/if}
    </section>

    <!-- ==================== ROW HOVER ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Row Hover</h2>
        <p class="text-sm text-on-surface-variant">
            Hover over rows to see the callback in action.
        </p>
        <Table
            data={users}
            columns={richColumns}
            rowKey="id"
            onRowHover={(row) => (hoveredUser = row)}
        />
        {#if hoveredUser}
            <div
                class="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container p-3"
            >
                <Avatar src={hoveredUser.avatar} alt={hoveredUser.name} size="xs" />
                <span class="text-sm text-on-surface"
                    >Hovering: <strong>{hoveredUser.name}</strong></span
                >
                <Badge
                    label={hoveredUser.status}
                    variant="subtle"
                    color={statusColor[hoveredUser.status] ?? 'surface'}
                />
            </div>
        {:else}
            <p class="text-sm text-on-surface-variant/50">Hover over a row</p>
        {/if}
    </section>

    <!-- ==================== CONTEXT MENU ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Context Menu (Right-Click)</h2>
        <p class="text-sm text-on-surface-variant">Right-click a row to trigger the callback.</p>
        <Table
            data={users}
            columns={richColumns}
            rowKey="id"
            onRowContextmenu={(row, _index, e) => {
                e.preventDefault()
                contextUser = { user: row, x: e.clientX, y: e.clientY }
                setTimeout(() => (contextUser = null), 2000)
            }}
        />
        {#if contextUser}
            <div
                class="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container p-3"
            >
                <Icon name="lucide:mouse-pointer" class="size-4 text-on-surface-variant" />
                <span class="text-sm text-on-surface">
                    Right-clicked: <strong>{contextUser.user.name}</strong>
                    at ({contextUser.x}, {contextUser.y})
                </span>
            </div>
        {/if}
    </section>

    <!-- ==================== BODY SLOTS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Body Top / Bottom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Insert custom rows before and after data rows.
        </p>
        <Table data={products} columns={productColumns}>
            {#snippet bodyTopSlot()}
                <tr>
                    <td
                        colspan={4}
                        class="border-b border-primary/10 bg-primary/5 px-4 py-2 text-xs font-medium text-primary"
                    >
                        <Icon name="lucide:info" class="-mt-0.5 mr-1 inline-block size-3.5" />
                        Prices updated March 2026. All items in stock.
                    </td>
                </tr>
            {/snippet}
            {#snippet bodyBottomSlot()}
                <tr>
                    <td
                        colspan={4}
                        class="border-t border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-xs text-on-surface-variant"
                    >
                        <Icon
                            name="lucide:arrow-right"
                            class="-mt-0.5 mr-1 inline-block size-3.5"
                        />
                        Showing {products.length} of {products.length} products
                    </td>
                </tr>
            {/snippet}
        </Table>
    </section>

    <!-- ==================== POLYMORPHIC (as prop) ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Polymorphic Root (as prop)</h2>
        <p class="text-sm text-on-surface-variant">
            Render as <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >&lt;section&gt;</code
            >
            instead of
            <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >&lt;div&gt;</code
            >.
        </p>
        <Table
            as="section"
            data={products.slice(0, 3)}
            columns={productColumns}
            caption="Q1 2026 Product Summary"
        />
    </section>

    <!-- ==================== STRIPED ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Striped</h2>
        <Table data={products} columns={productColumns} striped />
    </section>

    <!-- ==================== COLUMN RESIZING ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Column Resizing</h2>
        <p class="text-sm text-on-surface-variant">
            Drag the right edge of Name, Email, or Role headers to resize.
        </p>
        <Table data={users} columns={resizableColumns} bind:columnSizing rowKey="id" />
        {#if Object.keys(columnSizing).length > 0}
            <p class="text-xs text-on-surface-variant">
                Sizes: {Object.entries(columnSizing)
                    .map(([k, v]) => `${k}: ${Math.round(v)}px`)
                    .join(', ')}
            </p>
        {/if}
    </section>

    <!-- ==================== STICKY HEADER ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sticky Header</h2>
        <Table
            data={[...users, ...users, ...users]}
            columns={richColumns}
            sticky="header"
            class="max-h-72"
        />
    </section>

    <!-- ==================== LOADING (REPLACE DATA) ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Loading — Replace Data</h2>
        <p class="text-sm text-on-surface-variant">Data is hidden during loading.</p>
        <Button onclick={simulateLoadingReplace} size="sm" variant="outline" color="surface">
            Simulate Loading (2s)
        </Button>
        <Table
            data={isLoadingReplace ? [] : users}
            columns={richColumns}
            loading={isLoadingReplace}
            rowKey="id"
        >
            {#snippet loadingSlot()}
                <div class="flex items-center justify-center gap-2">
                    <Icon name="lucide:loader-2" class="size-5 animate-spin text-primary" />
                    <span class="text-sm text-on-surface-variant">Loading data...</span>
                </div>
            {/snippet}
        </Table>
    </section>

    <!-- ==================== LOADING (OVERLAY) ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Loading — Overlay</h2>
        <p class="text-sm text-on-surface-variant">Data stays visible with a frosted overlay.</p>
        <Button onclick={simulateLoadingOverlay} size="sm" variant="outline" color="surface">
            Simulate Loading (2s)
        </Button>
        <Table data={users} columns={richColumns} loading={isLoadingOverlay} rowKey="id" />
    </section>

    <!-- ==================== LOADING ANIMATIONS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Loading Animations</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            {#each ['carousel', 'carousel-inverse', 'swing', 'elastic'] as anim (anim)}
                <div class="space-y-1">
                    <p class="text-xs font-medium text-on-surface-variant">{anim}</p>
                    <Table
                        data={products.slice(0, 2)}
                        columns={productColumns}
                        loading
                        loadingAnimation={anim as
                            | 'carousel'
                            | 'carousel-inverse'
                            | 'swing'
                            | 'elastic'}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- ==================== EMPTY ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Empty State</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-1">
                <p class="text-xs font-medium text-on-surface-variant">Default</p>
                <Table data={[]} columns={richColumns} />
            </div>
            <div class="space-y-1">
                <p class="text-xs font-medium text-on-surface-variant">Custom</p>
                <Table data={[]} columns={richColumns}>
                    {#snippet emptySlot()}
                        <div class="flex flex-col items-center gap-2">
                            <Icon name="lucide:inbox" class="size-8 text-on-surface-variant/40" />
                            <p class="text-sm text-on-surface-variant">No users found</p>
                        </div>
                    {/snippet}
                </Table>
            </div>
        </div>
    </section>

    <!-- ==================== CUSTOM UI OVERRIDES ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >ui</code
            > prop to override slot classes.
        </p>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="space-y-1">
                <p class="text-xs font-medium text-on-surface-variant">
                    Bordered rows + colored header
                </p>
                <Table
                    data={products}
                    columns={productColumns}
                    ui={{
                        root: 'border-2 border-primary/20',
                        thead: 'bg-primary/5',
                        th: 'text-primary',
                        tr: 'border-b border-primary/10'
                    }}
                />
            </div>
            <div class="space-y-1">
                <p class="text-xs font-medium text-on-surface-variant">Compact + no border</p>
                <Table
                    data={products}
                    columns={productColumns}
                    ui={{
                        root: 'border-0 rounded-none',
                        th: 'py-2 px-3 text-[10px]',
                        td: 'py-2 px-3 text-xs'
                    }}
                />
            </div>
        </div>
    </section>

    <!-- ==================== CUSTOM HEADER SLOT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Header Slot</h2>
        <p class="text-sm text-on-surface-variant">
            Use the global <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >headerSlot</code
            > to customize all column headers.
        </p>
        <Table data={users.slice(0, 3)} columns={richColumns} rowKey="id">
            {#snippet headerSlot({ column })}
                <div class="flex items-center gap-1.5">
                    <Icon
                        name={column.key === 'name'
                            ? 'lucide:user'
                            : column.key === 'email'
                              ? 'lucide:mail'
                              : column.key === 'role'
                                ? 'lucide:shield'
                                : column.key === 'status'
                                  ? 'lucide:activity'
                                  : 'lucide:hash'}
                        class="size-3.5 text-primary"
                    />
                    <span>{column.label ?? column.key}</span>
                </div>
            {/snippet}
        </Table>
    </section>

    <!-- ==================== CUSTOM CELL SLOT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Cell Slot</h2>
        <p class="text-sm text-on-surface-variant">
            Use the global <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >cellSlot</code
            > to customize all cells at once.
        </p>
        <Table
            data={[
                { name: 'Alice', score: 95, grade: 'A' },
                { name: 'Bob', score: 72, grade: 'B' },
                { name: 'Charlie', score: 58, grade: 'C' }
            ]}
        >
            {#snippet cellSlot({ column, value })}
                {#if column.key === 'score'}
                    <div class="flex items-center gap-2">
                        <div
                            class="h-1.5 w-20 overflow-hidden rounded-full bg-surface-container-highest"
                        >
                            <div
                                class="h-full rounded-full transition-all {Number(value) >= 80
                                    ? 'bg-success'
                                    : Number(value) >= 60
                                      ? 'bg-warning'
                                      : 'bg-error'}"
                                style="width: {value}%"
                            ></div>
                        </div>
                        <span class="text-xs font-medium">{value}</span>
                    </div>
                {:else if column.key === 'grade'}
                    <Badge
                        label={String(value)}
                        variant="soft"
                        color={value === 'A' ? 'success' : value === 'B' ? 'primary' : 'warning'}
                    />
                {:else}
                    <span class="font-medium">{value}</span>
                {/if}
            {/snippet}
        </Table>
    </section>

    <!-- ==================== FOOTER SLOT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Footer (Aggregation)</h2>
        <p class="text-sm text-on-surface-variant">
            Use per-column <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >footer</code
            > snippet for totals/aggregation.
        </p>
        <Table
            data={products}
            columns={[
                { key: 'name', label: 'Product', footer: footerLabel },
                { key: 'category', label: 'Category', cell: categoryCell },
                {
                    key: 'price',
                    label: 'Price',
                    cell: priceCell,
                    align: 'right',
                    footer: footerTotal
                },
                { key: 'stock', label: 'Stock', cell: stockCell, align: 'right', footer: footerSum }
            ]}
        />
    </section>

    <!-- ==================== CAPTION ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Caption (Accessibility)</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >caption</code
            >
            prop renders a sr-only caption for screen readers. Or use
            <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >captionSlot</code
            > for visible captions.
        </p>
        <Table
            data={products.slice(0, 3)}
            columns={productColumns}
            caption="Product inventory as of March 2026"
        >
            {#snippet captionSlot()}
                <div
                    class="not-sr-only border-b border-outline-variant/30 px-4 py-3 text-left text-sm font-medium text-on-surface-variant"
                >
                    <Icon name="lucide:table-2" class="-mt-0.5 mr-1.5 inline-block size-4" />
                    Product inventory — March 2026
                </div>
            {/snippet}
        </Table>
    </section>
</div>

<!-- ==================== SNIPPET DEFINITIONS ==================== -->

{#snippet userCell(props: TableCellSlotProps<User>)}
    <div class="flex items-center gap-3">
        <Avatar src={props.row.avatar} alt={props.row.name} size="xs" />
        <span class="font-medium">{props.row.name}</span>
    </div>
{/snippet}

{#snippet roleCell(props: TableCellSlotProps<User>)}
    <Badge label={props.row.role} variant="soft" color={roleColor[props.row.role] ?? 'secondary'} />
{/snippet}

{#snippet statusCell(props: TableCellSlotProps<User>)}
    <Badge
        label={props.row.status}
        variant="subtle"
        color={statusColor[props.row.status] ?? 'surface'}
    />
{/snippet}

{#snippet categoryCell(props: TableCellSlotProps<Product>)}
    <Badge
        label={props.row.category}
        variant="soft"
        color={props.row.category === 'Electronics' ? 'primary' : 'tertiary'}
    />
{/snippet}

{#snippet priceCell(props: TableCellSlotProps<Product>)}
    <span class="font-medium">${props.row.price.toLocaleString()}</span>
{/snippet}

{#snippet stockCell(props: TableCellSlotProps<Product>)}
    <Badge
        label={String(props.row.stock)}
        variant="subtle"
        color={props.row.stock < 15 ? 'error' : props.row.stock < 50 ? 'warning' : 'success'}
    />
{/snippet}

{#snippet actionsCell(props: TableCellSlotProps<User>)}
    <DropdownMenu items={getRowActions(props.row)}>
        <Button
            variant="ghost"
            color="surface"
            size="xs"
            icon="lucide:ellipsis"
            aria-label="Row actions"
        />
    </DropdownMenu>
{/snippet}

{#snippet expandCell(props: TableCellSlotProps<User>)}
    {@const rowId = props.row.id}
    {@const isExpanded = expandedRows.includes(rowId)}
    <Button
        variant="ghost"
        color="surface"
        size="xs"
        icon="lucide:chevron-right"
        class="transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}"
        aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
        aria-expanded={isExpanded}
        onclick={() => {
            if (isExpanded) {
                expandedRows = expandedRows.filter((k) => k !== rowId)
            } else {
                expandedRows = [...expandedRows, rowId]
            }
        }}
    />
{/snippet}

{#snippet deptExpandCell(props: TableCellSlotProps<Department>)}
    {@const deptId = props.row.id}
    {@const hasChildren = props.row.children && props.row.children.length > 0}
    {@const isExpanded = expandedDepts.includes(deptId)}
    {#if hasChildren}
        <Button
            variant="ghost"
            color="surface"
            size="xs"
            icon="lucide:chevron-right"
            class="transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            aria-expanded={isExpanded}
            onclick={() => {
                if (isExpanded) {
                    expandedDepts = expandedDepts.filter((k) => k !== deptId)
                } else {
                    expandedDepts = [...expandedDepts, deptId]
                }
            }}
        />
    {/if}
{/snippet}

{#snippet deptNameCell(props: TableCellSlotProps<Department>)}
    <div class="flex items-center gap-2">
        <Icon name="lucide:building-2" class="size-4 text-on-surface-variant" />
        <span class="font-medium">{props.row.name}</span>
        {#if props.row.children}
            <Badge
                label="{props.row.children.length} teams"
                variant="soft"
                color="tertiary"
                size="xs"
            />
        {/if}
    </div>
{/snippet}

{#snippet footerLabel(props: TableFooterSlotProps<Product>)}
    <span class="font-semibold text-on-surface">Total ({props.rows.length} items)</span>
{/snippet}

{#snippet footerTotal(props: TableFooterSlotProps<Product>)}
    <span class="font-semibold text-on-surface"
        >${props.rows.reduce((sum, r) => sum + r.price, 0).toLocaleString()}</span
    >
{/snippet}

{#snippet footerSum(props: TableFooterSlotProps<Product>)}
    <span class="font-semibold text-on-surface"
        >{props.rows.reduce((sum, r) => sum + r.stock, 0)}</span
    >
{/snippet}

{#snippet pinActionCell(props: TableCellSlotProps<User>)}
    {@const isPinned = pinnedRows.includes(props.row.id)}
    <Button
        variant="ghost"
        color={isPinned ? 'primary' : 'surface'}
        size="xs"
        icon={isPinned ? 'lucide:pin-off' : 'lucide:pin'}
        aria-label={isPinned ? 'Unpin row' : 'Pin row'}
        onclick={() => {
            if (isPinned) {
                pinnedRows = pinnedRows.filter((k) => k !== props.row.id)
            } else {
                pinnedRows = [...pinnedRows, props.row.id]
            }
        }}
    />
{/snippet}

{#snippet pinPagActionCell(props: TableCellSlotProps<User>)}
    {@const isPinned = pinPagPinnedRows.includes(props.row.id)}
    <Button
        variant="ghost"
        color={isPinned ? 'primary' : 'surface'}
        size="xs"
        icon={isPinned ? 'lucide:pin-off' : 'lucide:pin'}
        aria-label={isPinned ? 'Unpin row' : 'Pin row'}
        onclick={() => {
            if (isPinned) {
                pinPagPinnedRows = pinPagPinnedRows.filter((k) => k !== props.row.id)
            } else {
                pinPagPinnedRows = [...pinPagPinnedRows, props.row.id]
            }
        }}
    />
{/snippet}
