<script lang="ts">
    import { Pagination, Button } from '$lib/index.js'

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

    let currentPage = $state(1)
    let controlledPage = $state(5)
    let callbackPage = $state(1)
    let callbackLog = $state('')
</script>

<div class="space-y-12">
    <header>
        <h1 class="text-3xl font-bold text-on-surface">Pagination</h1>
        <p class="mt-2 text-on-surface-variant">
            Navigate through paginated content with page controls. Built on bits-ui Pagination
            primitive.
        </p>
    </header>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Simple pagination with previous/next controls and page numbers.
        </p>
        <Pagination total={100} itemsPerPage={10} />
    </section>

    <!-- Default Page -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Default Page</h2>
        <p class="text-sm text-on-surface-variant">
            Set the initial page with the <code class="text-primary">defaultPage</code> prop.
        </p>
        <Pagination total={100} itemsPerPage={10} defaultPage={5} />
    </section>

    <!-- With Show Edges -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Show Edges</h2>
        <p class="text-sm text-on-surface-variant">
            Display first/last page buttons with the <code class="text-primary">showEdges</code> prop.
        </p>
        <Pagination total={100} itemsPerPage={10} showEdges />
    </section>

    <!-- Without Controls -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Without Controls</h2>
        <p class="text-sm text-on-surface-variant">
            Hide prev/next buttons with <code class="text-primary">showControls=false</code>.
        </p>
        <Pagination total={100} itemsPerPage={10} showControls={false} />
    </section>

    <!-- Show Edges Without Controls -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Show Edges Without Controls</h2>
        <p class="text-sm text-on-surface-variant">
            Combine <code class="text-primary">showEdges</code> with
            <code class="text-primary">showControls=false</code> to show only first/last buttons.
        </p>
        <Pagination total={100} itemsPerPage={10} showEdges showControls={false} />
    </section>

    <!-- Sibling Count -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sibling Count</h2>
        <p class="text-sm text-on-surface-variant">
            Control visible siblings around current page with the <code class="text-primary"
                >siblingCount</code
            > prop.
        </p>
        <div class="space-y-3">
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">siblingCount=0</p>
                <Pagination total={100} itemsPerPage={10} page={5} siblingCount={0} />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">siblingCount=1 (default)</p>
                <Pagination total={100} itemsPerPage={10} page={5} siblingCount={1} />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">siblingCount=2</p>
                <Pagination total={100} itemsPerPage={10} page={5} siblingCount={2} />
            </div>
        </div>
    </section>

    <!-- Items Per Page -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Items Per Page</h2>
        <p class="text-sm text-on-surface-variant">
            Control page count with the <code class="text-primary">itemsPerPage</code> prop. Same total
            (100) with different items per page.
        </p>
        <div class="space-y-3">
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">5 items/page (20 pages)</p>
                <Pagination total={100} itemsPerPage={5} />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">10 items/page (10 pages)</p>
                <Pagination total={100} itemsPerPage={10} />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">25 items/page (4 pages)</p>
                <Pagination total={100} itemsPerPage={25} />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">50 items/page (2 pages)</p>
                <Pagination total={100} itemsPerPage={50} />
            </div>
        </div>
    </section>

    <!-- Controlled State -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Controlled State</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">bind:page</code> for two-way binding. Current page:
            <code class="text-primary">{controlledPage}</code>
        </p>
        <Pagination total={200} itemsPerPage={10} bind:page={controlledPage} showEdges />
        <div class="flex gap-2">
            <Button
                variant="solid"
                color="primary"
                size="sm"
                label="Go to page 1"
                onclick={() => (controlledPage = 1)}
            />
            <Button
                variant="solid"
                color="primary"
                size="sm"
                label="Go to page 10"
                onclick={() => (controlledPage = 10)}
            />
            <Button
                variant="solid"
                color="primary"
                size="sm"
                label="Go to page 20"
                onclick={() => (controlledPage = 20)}
            />
        </div>
    </section>

    <!-- Active Colors -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Active Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Customize the active page color with the <code class="text-primary">activeColor</code> prop.
        </p>
        <div class="space-y-3">
            {#each colors as color (color)}
                <div class="flex items-center gap-4">
                    <span class="w-20 text-sm text-on-surface-variant">{color}</span>
                    <Pagination total={100} itemsPerPage={10} page={3} activeColor={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Control the pagination size with the <code class="text-primary">size</code> prop.
        </p>
        <div class="space-y-4">
            {#each sizes as size (size)}
                <div class="flex items-center gap-4">
                    <span class="w-8 text-sm text-on-surface-variant">{size}</span>
                    <Pagination total={100} itemsPerPage={10} {size} showEdges />
                </div>
            {/each}
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Disable all pagination controls with the <code class="text-primary">disabled</code> prop.
        </p>
        <Pagination total={100} itemsPerPage={10} page={3} disabled showEdges />
    </section>

    <!-- Page Change Callback -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Page Change Callback</h2>
        <p class="text-sm text-on-surface-variant">
            Listen for page changes with <code class="text-primary">onPageChange</code>. Current
            page: <code class="text-primary">{callbackPage}</code>
        </p>
        <Pagination
            total={100}
            itemsPerPage={10}
            bind:page={callbackPage}
            onPageChange={(p) => (callbackLog = `Page changed to ${p}`)}
            showEdges
        />
        {#if callbackLog}
            <p class="text-xs text-on-surface-variant">{callbackLog}</p>
        {/if}
    </section>

    <!-- Custom Icons -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Customize navigation icons with
            <code class="text-primary">firstIcon</code>,
            <code class="text-primary">prevIcon</code>,
            <code class="text-primary">nextIcon</code>,
            <code class="text-primary">lastIcon</code>, and
            <code class="text-primary">ellipsisIcon</code> props.
        </p>
        <Pagination
            total={100}
            itemsPerPage={10}
            page={5}
            showEdges
            firstIcon="lucide:chevrons-left"
            prevIcon="lucide:arrow-left"
            nextIcon="lucide:arrow-right"
            lastIcon="lucide:chevrons-right"
            ellipsisIcon="lucide:more-horizontal"
        />
    </section>

    <!-- Custom Snippet Slots -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Snippet Slots</h2>
        <p class="text-sm text-on-surface-variant">Override individual parts with snippet slots.</p>

        <div class="space-y-4">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom item slot</p>
                <Pagination total={50} itemsPerPage={10} page={2}>
                    {#snippet itemSlot({ page, selected })}
                        <span
                            class="inline-flex size-9 items-center justify-center rounded-full text-sm font-bold {selected
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant'}"
                        >
                            {page}
                        </span>
                    {/snippet}
                </Pagination>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom prev/next slots</p>
                <Pagination total={100} itemsPerPage={10} page={3}>
                    {#snippet prevSlot({ disabled })}
                        <span
                            class="text-sm font-medium {disabled
                                ? 'text-on-surface-variant/50'
                                : 'text-primary'}"
                        >
                            Prev
                        </span>
                    {/snippet}
                    {#snippet nextSlot({ disabled })}
                        <span
                            class="text-sm font-medium {disabled
                                ? 'text-on-surface-variant/50'
                                : 'text-primary'}"
                        >
                            Next
                        </span>
                    {/snippet}
                </Pagination>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom first/last slots</p>
                <Pagination total={100} itemsPerPage={10} page={5} showEdges>
                    {#snippet firstSlot({ disabled })}
                        <span
                            class="text-xs {disabled
                                ? 'text-on-surface-variant/50'
                                : 'text-primary'}"
                        >
                            First
                        </span>
                    {/snippet}
                    {#snippet lastSlot({ disabled })}
                        <span
                            class="text-xs {disabled
                                ? 'text-on-surface-variant/50'
                                : 'text-primary'}"
                        >
                            Last
                        </span>
                    {/snippet}
                </Pagination>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom ellipsis slot</p>
                <Pagination total={100} itemsPerPage={10} page={5}>
                    {#snippet ellipsisSlot()}
                        <span class="text-on-surface-variant">---</span>
                    {/snippet}
                </Pagination>
            </div>
        </div>
    </section>

    <!-- Edge Cases -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Edge Cases</h2>
        <p class="text-sm text-on-surface-variant">
            Handling special scenarios like single page, few pages, or many pages.
        </p>
        <div class="space-y-3">
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">Single page (total=5, 10/page)</p>
                <Pagination total={5} itemsPerPage={10} showEdges />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">Few pages (total=30, 10/page)</p>
                <Pagination total={30} itemsPerPage={10} showEdges />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">Many pages (total=1000, 10/page)</p>
                <Pagination total={1000} itemsPerPage={10} page={50} showEdges />
            </div>
            <div>
                <p class="mb-1 text-xs text-on-surface-variant">Zero total</p>
                <Pagination total={0} itemsPerPage={10} />
            </div>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Customize individual parts with the <code class="text-primary">ui</code> prop.
        </p>
        <div class="space-y-4">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Rounded buttons</p>
                <Pagination
                    total={100}
                    itemsPerPage={10}
                    page={3}
                    showEdges
                    ui={{
                        item: 'rounded-full',
                        first: 'rounded-full',
                        prev: 'rounded-full',
                        next: 'rounded-full',
                        last: 'rounded-full'
                    }}
                />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom gap</p>
                <Pagination total={100} itemsPerPage={10} page={3} ui={{ list: 'gap-2' }} />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom root class</p>
                <Pagination
                    total={100}
                    itemsPerPage={10}
                    page={3}
                    class="rounded-lg border border-outline-variant bg-surface-container p-3"
                />
            </div>
        </div>
    </section>

    <!-- Combined Features -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Combined Features</h2>
        <p class="text-sm text-on-surface-variant">
            Full example combining multiple features together.
        </p>
        <Pagination
            total={200}
            itemsPerPage={10}
            bind:page={currentPage}
            activeColor="success"
            size="lg"
            showEdges
            siblingCount={2}
            ui={{
                item: 'rounded-full',
                first: 'rounded-full',
                prev: 'rounded-full',
                next: 'rounded-full',
                last: 'rounded-full',
                list: 'gap-1.5'
            }}
        />
        <p class="text-xs text-on-surface-variant">
            Current page: <code class="text-primary">{currentPage}</code> | Size: lg | Color: success
            | Edges: on | Siblings: 2 | Rounded
        </p>
    </section>
</div>
