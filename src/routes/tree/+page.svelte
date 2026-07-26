<script lang="ts">
    import {
        Tree,
        Button,
        Badge,
        Checkbox,
        Input,
        Avatar,
        Icon,
        type TreeApi,
        type TreeItem
    } from '$lib/index.js'

    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    const files: TreeItem[] = [
        {
            label: 'app',
            defaultExpanded: true,
            children: [
                {
                    label: 'composables',
                    children: [
                        { label: 'useAuth.ts', icon: 'lucide:file-code' },
                        { label: 'useUser.ts', icon: 'lucide:file-code' }
                    ]
                },
                {
                    label: 'components',
                    defaultExpanded: true,
                    children: [
                        { label: 'Card.svelte', icon: 'lucide:file-code' },
                        { label: 'Button.svelte', icon: 'lucide:file-code' }
                    ]
                }
            ]
        },
        { label: 'app.config.ts', icon: 'lucide:file-cog' },
        { label: 'package.json', icon: 'lucide:file-json' }
    ]

    const plainFiles: TreeItem[] = [
        {
            label: 'src',
            children: [
                {
                    label: 'lib',
                    children: [
                        { label: 'index.ts', icon: 'lucide:file-code' },
                        { label: 'utils.ts', icon: 'lucide:file-code' }
                    ]
                },
                { label: 'routes', children: [{ label: '+page.svelte', icon: 'lucide:file-code' }] }
            ]
        },
        { label: 'static', children: [{ label: 'favicon.png', icon: 'lucide:image' }] },
        { label: 'README.md', icon: 'lucide:file-text' }
    ]

    const permissionItems: TreeItem[] = [
        {
            label: 'Documents',
            value: 'documents',
            defaultExpanded: true,
            children: [
                { label: 'Read', value: 'documents.read' },
                { label: 'Write', value: 'documents.write' },
                { label: 'Delete', value: 'documents.delete' }
            ]
        },
        {
            label: 'Users',
            value: 'users',
            defaultExpanded: true,
            children: [
                { label: 'Invite', value: 'users.invite' },
                { label: 'Remove', value: 'users.remove' }
            ]
        }
    ]

    const disabledItems: TreeItem[] = [
        {
            label: 'public',
            children: [{ label: 'index.html', icon: 'lucide:file-code' }]
        },
        {
            label: 'node_modules',
            disabled: true,
            children: [{ label: 'lots-of-packages' }]
        },
        { label: '.env', icon: 'lucide:file-lock', disabled: true },
        { label: 'vite.config.ts', icon: 'lucide:file-cog' }
    ]

    interface FileItem extends TreeItem {
        size?: string
    }

    const sizedItems: FileItem[] = [
        {
            label: 'assets',
            defaultExpanded: true,
            children: [
                { label: 'logo.svg', icon: 'lucide:image', size: '4.2 KB' },
                { label: 'hero.png', icon: 'lucide:image', size: '1.8 MB' }
            ]
        },
        { label: 'index.html', icon: 'lucide:file-code', size: '2.1 KB' }
    ]

    let api = $state<TreeApi>()
    let expandedKeys = $state<string[]>(['src'])
    let singleValue = $state<string | string[]>()
    let multiValue = $state<string | string[]>(['documents.read'])
    let checkboxValue = $state<string | string[]>([])

    // ---- Search / filter demo ----
    const projectTree: TreeItem[] = [
        {
            label: 'src',
            children: [
                {
                    label: 'components',
                    children: [
                        { label: 'Tree.svelte', icon: 'lucide:file-code' },
                        { label: 'Button.svelte', icon: 'lucide:file-code' },
                        { label: 'Modal.svelte', icon: 'lucide:file-code' }
                    ]
                },
                {
                    label: 'hooks',
                    children: [
                        { label: 'useMediaQuery.ts', icon: 'lucide:file-code' },
                        { label: 'useClipboard.ts', icon: 'lucide:file-code' }
                    ]
                },
                { label: 'index.ts', icon: 'lucide:file-code' }
            ]
        },
        {
            label: 'tests',
            children: [
                { label: 'tree.spec.ts', icon: 'lucide:flask-conical' },
                { label: 'button.spec.ts', icon: 'lucide:flask-conical' }
            ]
        },
        { label: 'package.json', icon: 'lucide:file-json' }
    ]

    function filterTree(nodes: TreeItem[], query: string): TreeItem[] {
        const out: TreeItem[] = []
        for (const node of nodes) {
            const selfMatch = (node.label ?? '').toLowerCase().includes(query)
            const matchedChildren = node.children ? filterTree(node.children, query) : []
            if (selfMatch || matchedChildren.length > 0) {
                out.push({
                    ...node,
                    children: node.children
                        ? selfMatch
                            ? node.children
                            : matchedChildren
                        : undefined
                })
            }
        }
        return out
    }

    function folderKeys(nodes: TreeItem[]): string[] {
        const keys: string[] = []
        for (const node of nodes) {
            if (node.children?.length) {
                keys.push(node.label ?? '')
                keys.push(...folderKeys(node.children))
            }
        }
        return keys
    }

    let query = $state('')
    const filteredTree = $derived(
        query.trim() ? filterTree(projectTree, query.toLowerCase()) : projectTree
    )
    const searchExpanded = $derived(query.trim() ? folderKeys(filteredTree) : ['src'])

    // ---- Programmatic selection demo ----
    let progApi = $state<TreeApi>()
    let progValue = $state<string | string[]>([])

    // ---- File explorer with row actions ----
    interface ExplorerItem extends TreeItem {
        value: string
    }

    const initialExplorer: ExplorerItem[] = [
        {
            label: 'app',
            value: 'app',
            defaultExpanded: true,
            children: [
                { label: 'layout.svelte', value: 'app/layout', icon: 'lucide:file-code' },
                { label: 'page.svelte', value: 'app/page', icon: 'lucide:file-code' }
            ]
        },
        {
            label: 'lib',
            value: 'lib',
            children: [{ label: 'utils.ts', value: 'lib/utils', icon: 'lucide:file-code' }]
        },
        { label: 'README.md', value: 'readme', icon: 'lucide:file-text' }
    ]

    let explorerItems = $state<ExplorerItem[]>(structuredClone(initialExplorer))
    let newFileCount = $state(1)

    function removeNode(nodes: ExplorerItem[], value: string): ExplorerItem[] {
        return nodes
            .filter((node) => node.value !== value)
            .map((node) =>
                node.children ? { ...node, children: removeNode(node.children, value) } : node
            )
    }

    function deleteNode(value: string) {
        explorerItems = removeNode(explorerItems, value)
    }

    function addFile() {
        explorerItems = [
            ...explorerItems,
            {
                label: `untitled-${newFileCount}.ts`,
                value: `untitled-${newFileCount}`,
                icon: 'lucide:file-plus'
            }
        ]
        newFileCount += 1
    }

    function resetExplorer() {
        explorerItems = structuredClone(initialExplorer)
        newFileCount = 1
    }

    // ---- People / org tree ----
    interface PersonItem extends TreeItem {
        initials: string
        role: string
        avatar?: string
    }

    const people: PersonItem[] = [
        {
            label: 'Ada Lovelace',
            initials: 'AL',
            role: 'CTO',
            defaultExpanded: true,
            children: [
                {
                    label: 'Grace Hopper',
                    initials: 'GH',
                    role: 'Eng Lead',
                    children: [
                        { label: 'Linus Torvalds', initials: 'LT', role: 'Engineer' },
                        { label: 'Margaret Hamilton', initials: 'MH', role: 'Engineer' }
                    ]
                },
                { label: 'Alan Turing', initials: 'AT', role: 'Research' }
            ]
        }
    ]
    let peopleValue = $state<string | string[]>()
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Tree</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            An accessible tree view. Parent nodes get folder icons and a chevron by default; use
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">items</code>
            with nested
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">children</code>
            and mark nodes
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >defaultExpanded</code
            >. Navigate with the arrow keys, Home/End, Enter/Space,
            <kbd class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">*</kbd> to expand
            siblings, or just type a label (typeahead).
        </p>
        <Tree items={files} class="max-w-xs" />
    </section>

    <!-- Controlled Expansion -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Controlled Expansion & API</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:expanded</code
            >
            for two-way expansion state, and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">bind:api</code>
            for imperative control from external buttons.
        </p>
        <div class="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onclick={() => api?.expandAll()}>Expand all</Button>
            <Button size="sm" variant="outline" onclick={() => api?.collapseAll()}>
                Collapse all
            </Button>
        </div>
        <Tree items={plainFiles} bind:expanded={expandedKeys} bind:api class="max-w-xs" />
        <p class="text-sm text-on-surface-variant">
            Expanded: <span class="font-mono text-on-surface"
                >[{expandedKeys.map((key) => `'${key}'`).join(', ')}]</span
            >
        </p>
    </section>

    <!-- Single Selection -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Single Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:value</code
            >
            to track the selected node. Clicking a selected node deselects it (<code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >selectionBehavior="toggle"</code
            >, the default).
        </p>
        <Tree items={files} bind:value={singleValue} class="max-w-xs" />
        <p class="text-sm text-on-surface-variant">
            Selected: <span class="font-mono text-on-surface">{singleValue ?? 'none'}</span>
        </p>
    </section>

    <!-- Multiple Selection -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Multiple Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >multiple</code
            >
            to select several nodes;
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">value</code>
            becomes an array of keys.
        </p>
        <Tree items={permissionItems} multiple bind:value={multiValue} class="max-w-xs" />
        <p class="text-sm text-on-surface-variant">
            Selected: <span class="font-mono text-on-surface"
                >{Array.isArray(multiValue) ? JSON.stringify(multiValue) : 'none'}</span
            >
        </p>
    </section>

    <!-- Checkbox Tree -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Checkbox Tree</h2>
        <p class="text-sm text-on-surface-variant">
            Combine <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >propagateSelect</code
            >
            (selecting a parent selects its descendants),
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bubbleSelect</code
            >
            (a parent is selected once all children are) and an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemLeading</code
            > snippet rendering a tri-state Checkbox.
        </p>
        <Tree
            items={permissionItems}
            multiple
            propagateSelect
            bubbleSelect
            bind:value={checkboxValue}
            class="max-w-xs"
        >
            {#snippet itemLeading({ selected, indeterminate })}
                <Checkbox checked={selected} {indeterminate} tabindex={-1} />
            {/snippet}
        </Tree>
        <p class="text-sm text-on-surface-variant">
            Selected: <span class="font-mono text-on-surface"
                >{Array.isArray(checkboxValue) ? JSON.stringify(checkboxValue) : 'none'}</span
            >
        </p>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > to change the selection highlight and focus ring.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each colors as color (color)}
                <div class="space-y-2">
                    <span class="text-sm text-on-surface-variant">{color}</span>
                    <Tree
                        {color}
                        items={[
                            {
                                label: 'components',
                                defaultExpanded: true,
                                children: [
                                    { label: 'Tree.svelte', icon: 'lucide:file-code' },
                                    { label: 'index.ts', icon: 'lucide:file-code' }
                                ]
                            }
                        ]}
                        defaultValue="Tree.svelte"
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code>
            to control row padding, text and icon sizes.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each sizes as size (size)}
                <div class="space-y-2">
                    <span class="text-sm text-on-surface-variant">{size}</span>
                    <Tree
                        {size}
                        items={[
                            {
                                label: 'src',
                                defaultExpanded: true,
                                children: [{ label: 'main.ts', icon: 'lucide:file-code' }]
                            }
                        ]}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Disable individual nodes with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >item.disabled</code
            >
            (skipped by keyboard navigation, not selectable or expandable) or the whole tree with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">disabled</code>
            prop.
        </p>
        <div class="flex flex-wrap gap-10">
            <Tree items={disabledItems} class="max-w-xs" />
            <Tree items={plainFiles} disabled class="max-w-xs" />
        </div>
    </section>

    <!-- Custom Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Override the chevron with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >trailingIcon</code
            >
            and the parent icons with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >expandedIcon</code
            >
            /
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >collapsedIcon</code
            >. Per-item
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            always wins.
        </p>
        <Tree
            items={plainFiles}
            trailingIcon="lucide:chevron-right"
            expandedIcon="lucide:folder-minus"
            collapsedIcon="lucide:folder-plus"
            ui={{ linkTrailingIcon: 'group-data-[expanded=true]/link:rotate-90' }}
            class="max-w-xs"
        />
    </section>

    <!-- Custom Snippets -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Snippets</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemTrailing</code
            >
            snippet (or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">item</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemLeading</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemLabel</code
            >) to customize row content. Extra item fields are available on
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">item</code>.
        </p>
        <Tree items={sizedItems} class="max-w-xs">
            {#snippet itemTrailing({ item, hasChildren })}
                {#if !hasChildren && item.size}
                    <Badge size="sm" color="surface" variant="soft" class="ms-auto">
                        {item.size}
                    </Badge>
                {/if}
            {/snippet}
        </Tree>
    </section>

    <!-- Search / Filter -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Search &amp; Filter</h2>
        <p class="text-sm text-on-surface-variant">
            Derive a filtered <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">items</code
            >
            tree from a query (keeping matched nodes and their ancestors) and pass matched folder keys
            to a controlled
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">expanded</code>
            so results auto-expand.
        </p>
        <div class="max-w-xs space-y-3">
            <Input bind:value={query} leadingIcon="lucide:search" placeholder="Filter files..." />
            {#if filteredTree.length > 0}
                <Tree items={filteredTree} expanded={searchExpanded} size="sm" />
            {:else}
                <p class="px-2 py-1.5 text-sm text-on-surface-variant">
                    No files match &ldquo;{query}&rdquo;.
                </p>
            {/if}
        </div>
    </section>

    <!-- Programmatic Selection -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Programmatic Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Drive selection from outside via <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">bind:api</code
            >
            &mdash;
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >api.select</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >api.deselect</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >api.clearSelection</code
            >. With
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >propagateSelect</code
            > these stay consistent across descendants.
        </p>
        <div class="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="soft" onclick={() => progApi?.select('documents')}>
                Select all Documents
            </Button>
            <Button size="sm" variant="soft" onclick={() => progApi?.deselect('documents.delete')}>
                Revoke Delete
            </Button>
            <Button size="sm" variant="outline" onclick={() => progApi?.clearSelection()}>
                Clear
            </Button>
        </div>
        <Tree
            items={permissionItems}
            multiple
            propagateSelect
            bubbleSelect
            bind:api={progApi}
            bind:value={progValue}
            class="max-w-xs"
        />
        <p class="text-sm text-on-surface-variant">
            Selected: <span class="font-mono text-on-surface"
                >{Array.isArray(progValue) && progValue.length
                    ? JSON.stringify(progValue)
                    : 'none'}</span
            >
        </p>
    </section>

    <!-- File Explorer with row actions -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">File Explorer with Row Actions</h2>
        <p class="text-sm text-on-surface-variant">
            An <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemTrailing</code
            >
            snippet renders a delete button next to each row. Clicking a button (or any non-checkbox control)
            never selects or toggles the row, so actions and navigation stay independent. The
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">items</code>
            array is
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">$state</code>,
            so edits render immediately.
        </p>
        <div class="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="soft" leadingIcon="lucide:plus" onclick={addFile}>
                Add file
            </Button>
            <Button size="sm" variant="outline" onclick={resetExplorer}>Reset</Button>
        </div>
        <Tree items={explorerItems} class="max-w-sm">
            {#snippet itemTrailing({ item, hasChildren, expanded })}
                <span class="ms-auto flex items-center gap-1">
                    <Button
                        icon="lucide:trash-2"
                        size="xs"
                        variant="ghost"
                        color="error"
                        aria-label="Delete {item.label}"
                        onclick={() => deleteNode(item.value as string)}
                    />
                    {#if hasChildren}
                        <Icon
                            name="lucide:chevron-down"
                            class="size-4 text-on-surface-variant transition-transform duration-200 {expanded
                                ? 'rotate-180'
                                : ''}"
                        />
                    {/if}
                </span>
            {/snippet}
        </Tree>
    </section>

    <!-- People / Org tree -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Org Chart</h2>
        <p class="text-sm text-on-surface-variant">
            Rich rows via an <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemLeading</code
            >
            snippet (an Avatar) and an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemTrailing</code
            > snippet (a role badge, plus the chevron re-added for managers).
        </p>
        <Tree items={people} bind:value={peopleValue} color="tertiary" size="lg" class="max-w-md">
            {#snippet itemLeading({ item })}
                <Avatar text={(item as PersonItem).initials} size="xs" />
            {/snippet}
            {#snippet itemTrailing({ item, hasChildren, expanded })}
                <span class="ms-auto flex items-center gap-2">
                    <Badge size="sm" variant="soft" color="surface">
                        {(item as PersonItem).role}
                    </Badge>
                    {#if hasChildren}
                        <Icon
                            name="lucide:chevron-down"
                            class="size-5 text-on-surface-variant transition-transform duration-200 {expanded
                                ? 'rotate-180'
                                : ''}"
                        />
                    {/if}
                </span>
            {/snippet}
        </Tree>
    </section>

    <p class="text-sm text-on-surface-variant">
        Future work: virtualization for very large trees, Shift+Arrow range selection, and async
        (lazy-loaded) children.
    </p>
</div>
