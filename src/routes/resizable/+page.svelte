<script lang="ts">
    import { Resizable, Button, Icon, Badge, Link, Switch, Tree } from '$lib/index.js'
    import type {
        ResizableApi,
        ResizableHandleContext,
        ResizablePane,
        ResizablePaneContext,
        TreeItem
    } from '$lib/index.js'

    const features = [
        {
            icon: 'lucide:columns-2',
            label: 'Two axes',
            desc: 'Horizontal or vertical, nested freely.'
        },
        { icon: 'lucide:ruler', label: 'Constraints', desc: 'Minimum and maximum in % or px.' },
        {
            icon: 'lucide:panel-left-close',
            label: 'Collapsible',
            desc: 'Snap shut past the minimum, spring back.'
        },
        { icon: 'lucide:keyboard', label: 'Keyboard', desc: 'Arrows, Home, End, Enter to toggle.' },
        { icon: 'lucide:save', label: 'Persistent', desc: 'storageKey remembers the split.' },
        { icon: 'lucide:percent', label: 'Percentages', desc: 'Layout survives a window resize.' }
    ]

    const treeItems: TreeItem[] = [
        {
            label: 'src',
            icon: 'lucide:folder',
            children: [
                { label: 'app.svelte', icon: 'lucide:file-code' },
                { label: 'main.ts', icon: 'lucide:file-code' }
            ]
        },
        { label: 'package.json', icon: 'lucide:file-json' }
    ]

    let workspaceApi = $state<ResizableApi>()
    let workspaceSizes = $state<number[]>()
    let mailApi = $state<ResizableApi>()
    let collapsed = $state<string[]>([])
    let showInspector = $state(false)

    const directions = ['horizontal', 'vertical'] as const
    const thicknesses = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'] as const

    let playDirection = $state<'horizontal' | 'vertical'>('horizontal')
    let playSize = $state<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
    let playColor = $state<(typeof colors)[number]>('primary')
    let playDisabled = $state(false)
    let playCollapsible = $state(true)
    let playStep = $state(5)
    let playApi = $state<ResizableApi>()
    let playSizes = $state<number[]>()
    let playLog = $state<string[]>([])

    function log(entry: string) {
        playLog = [entry, ...playLog].slice(0, 5)
    }

    const playPanes = $derived<ResizablePane[]>([
        {
            id: 'aside',
            defaultSize: 25,
            minSize: 15,
            collapsible: playCollapsible,
            content: paneA
        },
        { id: 'main', content: paneB },
        { id: 'panel', defaultSize: 25, minSize: 15, collapsible: playCollapsible, content: paneA }
    ])

    const manyPanes: ResizablePane[] = Array.from({ length: 6 }, (_, index) => ({
        id: `pane-${index}`,
        minSize: 5,
        content: paneA
    }))

    const dynamicPanes = $derived<ResizablePane[]>([
        { id: 'main', content: paneA },
        ...(showInspector
            ? [{ id: 'inspector', defaultSize: 25, minSize: 15, content: inspectorPane }]
            : [])
    ])

    const basicPanes: ResizablePane[] = [
        { id: 'a', defaultSize: 35, content: paneA },
        { id: 'b', content: paneB }
    ]
</script>

{#snippet filler(title: string, tone = 'bg-surface-container')}
    <div class="flex h-full items-center justify-center {tone} text-sm text-on-surface-variant">
        {title}
    </div>
{/snippet}

{#snippet paneA()}
    {@render filler('Pane A')}
{/snippet}

{#snippet paneB()}
    {@render filler('Pane B', 'bg-surface-container-high')}
{/snippet}

{#snippet inspectorPane({ size, collapsed }: ResizablePaneContext)}
    <div
        class="flex h-full flex-col items-center justify-center gap-1 bg-surface-container-high text-sm text-on-surface-variant"
    >
        <span>Inspector</span>
        <span class="text-xs">{collapsed ? 'collapsed' : `${Math.round(size)}% wide`}</span>
    </div>
{/snippet}

<div class="space-y-10">
    <header class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold">Resizable</h1>
            <Badge color="primary" variant="soft">Drag · Collapse · Persist</Badge>
        </div>
        <p class="max-w-3xl text-on-surface-variant">
            Split a workspace into panes the user can drag. Sizes are percentages that always add up
            to 100, so the layout survives a window resize, while
            <code class="rounded bg-surface-container px-1">minSize</code> and
            <code class="rounded bg-surface-container px-1">maxSize</code> also accept pixels. Pair
            it with <Link href="/sidebar">Sidebar</Link>, <Link href="/tree">Tree</Link> and
            <Link href="/scroll-area">Scroll Area</Link> to build an editor or dashboard layout.
        </p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each features as feature (feature.label)}
                <div
                    class="flex items-start gap-3 rounded-lg border border-outline-variant/60 bg-surface-container p-3"
                >
                    <Icon name={feature.icon} class="mt-0.5 size-5 shrink-0 text-primary" />
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-on-surface">{feature.label}</p>
                        <p class="text-xs text-on-surface-variant">{feature.desc}</p>
                    </div>
                </div>
            {/each}
        </div>
    </header>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Basic</h2>
            <p class="text-xs text-on-surface-variant">
                drag the handle, or focus it and use arrows
            </p>
        </div>
        <div class="h-56 overflow-hidden rounded-xl border border-outline-variant/60">
            <Resizable panes={basicPanes} />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Vertical</h2>
            <p class="text-xs text-on-surface-variant">direction="vertical"</p>
        </div>
        <div class="h-64 overflow-hidden rounded-xl border border-outline-variant/60">
            <Resizable
                direction="vertical"
                panes={[
                    { id: 'top', defaultSize: 60, content: paneA },
                    { id: 'bottom', content: paneB }
                ]}
            />
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Workspace layout</h2>
            <p class="text-xs text-on-surface-variant">
                nested groups · pixel minimum · bind:sizes
            </p>
        </div>
        <div class="space-y-3">
            <div class="h-80 overflow-hidden rounded-xl border border-outline-variant/60">
                <Resizable
                    bind:api={workspaceApi}
                    bind:sizes={workspaceSizes}
                    storageKey="sv5ui-docs-workspace"
                    panes={[
                        {
                            id: 'files',
                            defaultSize: 24,
                            minSize: '160px',
                            collapsible: true,
                            content: filesPane
                        },
                        { id: 'work', content: workPane }
                    ]}
                    onCollapse={() => (collapsed = workspaceApi?.collapsed ?? [])}
                />
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    label={collapsed.includes('files') ? 'Show files' : 'Hide files'}
                    leadingIcon="lucide:panel-left"
                    onclick={() => workspaceApi?.toggle('files')}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Reset"
                    leadingIcon="lucide:rotate-ccw"
                    onclick={() => workspaceApi?.reset()}
                />
                <span class="text-xs text-on-surface-variant">
                    {workspaceSizes?.map((value) => `${Math.round(value)}%`).join(' · ') ?? ''} · the
                    split is stored under a
                    <code class="rounded bg-surface-container-high px-1">storageKey</code>, so it
                    survives a reload
                </span>
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Collapsible panes</h2>
            <p class="text-xs text-on-surface-variant">collapsible · api.toggle()</p>
        </div>
        <div class="space-y-3">
            <div class="h-64 overflow-hidden rounded-xl border border-outline-variant/60">
                <Resizable
                    bind:api={mailApi}
                    panes={[
                        {
                            id: 'list',
                            defaultSize: 30,
                            minSize: 20,
                            collapsible: true,
                            content: paneA
                        },
                        { id: 'message', content: messagePane },
                        {
                            id: 'details',
                            defaultSize: 25,
                            minSize: 18,
                            collapsible: true,
                            content: paneB
                        }
                    ]}
                />
            </div>
            <div class="flex flex-wrap gap-2">
                <Button size="sm" label="Toggle list" onclick={() => mailApi?.toggle('list')} />
                <Button
                    size="sm"
                    label="Toggle details"
                    onclick={() => mailApi?.toggle('details')}
                />
                <Button
                    size="sm"
                    variant="outline"
                    label="Even split"
                    onclick={() => mailApi?.setSizes([33.34, 33.33, 33.33])}
                />
            </div>
            <p class="text-xs text-on-surface-variant">
                Drag a handle past the minimum of a collapsible pane and it snaps shut; drag back
                out and it returns. Focus a handle and press Enter for the same thing.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Panes that come and go</h2>
            <p class="text-xs text-on-surface-variant">the surviving panes keep their ratio</p>
        </div>
        <div class="space-y-3">
            <Button
                size="sm"
                variant="outline"
                label={showInspector ? 'Hide inspector' : 'Show inspector'}
                leadingIcon="lucide:panel-right"
                onclick={() => (showInspector = !showInspector)}
            />
            <div class="h-48 overflow-hidden rounded-xl border border-outline-variant/60">
                <Resizable panes={dynamicPanes} />
            </div>
            <p class="text-xs text-on-surface-variant">
                Drag the split, hide the inspector, bring it back: the panes that stay keep the
                proportions you left them at instead of snapping back to an even split.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Pinned pane</h2>
            <p class="text-xs text-on-surface-variant">resizable: false</p>
        </div>
        <div class="space-y-3">
            <div class="h-48 overflow-hidden rounded-xl border border-outline-variant/60">
                <Resizable
                    panes={[
                        { id: 'rail', defaultSize: 20, resizable: false, content: paneA },
                        { id: 'flex-1', content: paneB },
                        { id: 'flex-2', defaultSize: 30, content: paneA }
                    ]}
                />
            </div>
            <p class="text-xs text-on-surface-variant">
                The first pane is pinned: the handle next to it is inert and not focusable, and
                dragging the second handle never steals space from it.
            </p>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Playground</h2>
            <p class="text-xs text-on-surface-variant">every prop on one group</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-[2fr_1fr]"
        >
            <div class="space-y-3">
                <div class="flex flex-wrap gap-3">
                    <div class="flex flex-wrap gap-1">
                        {#each directions as value (value)}
                            <Button
                                size="xs"
                                variant={playDirection === value ? 'solid' : 'outline'}
                                label={value}
                                onclick={() => (playDirection = value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each thicknesses as value (value)}
                            <Button
                                size="xs"
                                variant={playSize === value ? 'solid' : 'outline'}
                                label={value}
                                onclick={() => (playSize = value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each colors as value (value)}
                            <Button
                                size="xs"
                                color={value}
                                variant={playColor === value ? 'solid' : 'outline'}
                                label={value}
                                onclick={() => (playColor = value)}
                            />
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-1">
                        {#each [2, 5, 10] as value (value)}
                            <Button
                                size="xs"
                                variant={playStep === value ? 'solid' : 'outline'}
                                label="step {value}"
                                onclick={() => (playStep = value)}
                            />
                        {/each}
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-4">
                    <Switch size="sm" label="collapsible" bind:checked={playCollapsible} />
                    <Switch size="sm" label="disabled" bind:checked={playDisabled} />
                </div>

                <div class="h-64 overflow-hidden rounded-lg border border-outline-variant/60">
                    <Resizable
                        bind:api={playApi}
                        bind:sizes={playSizes}
                        panes={playPanes}
                        direction={playDirection}
                        size={playSize}
                        color={playColor}
                        disabled={playDisabled}
                        keyboardStep={playStep}
                        onResizeStart={(index) => log(`resize start on handle ${index}`)}
                        onResizeEnd={(next) =>
                            log(`resize end at ${next.map((v) => Math.round(v)).join('/')}`)}
                        onCollapse={(id, collapsed) =>
                            log(`${id} ${collapsed ? 'collapsed' : 'expanded'}`)}
                    />
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex flex-wrap gap-1">
                    <Button
                        size="xs"
                        label="Toggle aside"
                        onclick={() => playApi?.toggle('aside')}
                    />
                    <Button
                        size="xs"
                        label="Toggle panel"
                        onclick={() => playApi?.toggle('panel')}
                    />
                    <Button
                        size="xs"
                        variant="outline"
                        label="Main 60%"
                        onclick={() => playApi?.resize('main', 60)}
                    />
                    <Button
                        size="xs"
                        variant="outline"
                        label="Reset"
                        onclick={() => playApi?.reset()}
                    />
                </div>
                <dl class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-on-surface-variant">
                    <dt>sizes</dt>
                    <dd class="text-on-surface">
                        {playSizes?.map((value) => Math.round(value)).join(' / ') ?? '—'}
                    </dd>
                    <dt>collapsed</dt>
                    <dd class="text-on-surface">{playApi?.collapsed.join(', ') || 'none'}</dd>
                </dl>
                <div class="space-y-1">
                    <p class="text-xs font-medium text-on-surface-variant">Recent events</p>
                    {#each playLog as entry, index (`${entry}-${index}`)}
                        <p class="truncate text-xs text-on-surface-variant">{entry}</p>
                    {:else}
                        <p class="text-xs text-on-surface-variant">
                            Drag a handle, or focus one and press the arrow keys.
                        </p>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Edge cases</h2>
            <p class="text-xs text-on-surface-variant">many panes · tight limits · deep nesting</p>
        </div>
        <div
            class="grid gap-4 rounded-xl border border-outline-variant/60 bg-surface-container p-4 lg:grid-cols-2"
        >
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">
                    Six panes, minimum 5% each
                </p>
                <div class="h-40 overflow-hidden rounded-lg border border-outline-variant/60">
                    <Resizable size="sm" panes={manyPanes} />
                </div>
            </div>

            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">
                    Tight window: min 30%, max 45%
                </p>
                <div class="h-40 overflow-hidden rounded-lg border border-outline-variant/60">
                    <Resizable
                        panes={[
                            {
                                id: 'bounded',
                                defaultSize: 40,
                                minSize: 30,
                                maxSize: 45,
                                content: paneA
                            },
                            { id: 'rest', content: paneB }
                        ]}
                    />
                </div>
            </div>

            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Three levels of nesting</p>
                <div class="h-56 overflow-hidden rounded-lg border border-outline-variant/60">
                    <Resizable
                        panes={[
                            { id: 'outer-left', defaultSize: 30, content: paneA },
                            { id: 'outer-right', content: nestedLevelTwo }
                        ]}
                    />
                </div>
            </div>

            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">
                    Disabled group, and a pane that starts collapsed
                </p>
                <div class="h-40 overflow-hidden rounded-lg border border-outline-variant/60">
                    <Resizable
                        disabled
                        panes={[
                            {
                                id: 'shut',
                                defaultSize: 0,
                                minSize: 20,
                                collapsible: true,
                                content: paneA
                            },
                            { id: 'open', content: paneB }
                        ]}
                    />
                </div>
            </div>
        </div>
    </section>

    <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Custom handle</h2>
            <p class="text-xs text-on-surface-variant">handle snippet · ui overrides</p>
        </div>
        <div class="h-56 overflow-hidden rounded-xl border border-outline-variant/60">
            <Resizable
                size="xl"
                color="tertiary"
                ui={{ handle: 'bg-tertiary/20 hover:bg-tertiary/40' }}
                panes={[
                    { id: 'one', content: paneA },
                    { id: 'two', content: paneB }
                ]}
                handle={customHandle}
            />
        </div>
    </section>
</div>

{#snippet filesPane()}
    <div class="h-full overflow-auto bg-surface-container p-2">
        <Tree items={treeItems} />
    </div>
{/snippet}

{#snippet messagePane()}
    {@render filler('Message', 'bg-surface-container-low')}
{/snippet}

{#snippet workPane()}
    <Resizable
        direction="vertical"
        panes={[
            { id: 'editor', defaultSize: 70, content: editorPane },
            { id: 'terminal', minSize: 10, collapsible: true, content: terminalPane }
        ]}
    />
{/snippet}

{#snippet editorPane()}
    {@render filler('Editor', 'bg-surface-container-low')}
{/snippet}

{#snippet terminalPane()}
    {@render filler('Terminal', 'bg-surface-container-high')}
{/snippet}

{#snippet nestedLevelTwo()}
    <Resizable
        direction="vertical"
        size="sm"
        panes={[
            { id: 'level-2-top', defaultSize: 60, content: nestedLevelThree },
            { id: 'level-2-bottom', content: paneB }
        ]}
    />
{/snippet}

{#snippet nestedLevelThree()}
    <Resizable
        size="xs"
        panes={[
            { id: 'level-3-a', content: paneA },
            { id: 'level-3-b', content: paneB }
        ]}
    />
{/snippet}

{#snippet customHandle({ active }: ResizableHandleContext)}
    <span
        class="flex size-6 items-center justify-center rounded-full border border-outline-variant bg-surface shadow-sm"
    >
        <Icon
            name="lucide:grip-vertical"
            class="size-4 {active ? 'text-tertiary' : 'text-on-surface-variant'}"
        />
    </span>
{/snippet}
