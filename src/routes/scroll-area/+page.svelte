<script lang="ts">
    import {
        ScrollArea,
        Card,
        Separator,
        Badge,
        Button,
        Table,
        Sidebar,
        Slideover,
        NavigationMenu,
        Lightbox
    } from '$lib/index.js'
    import type { TableColumn } from '$lib/components/Table/table.types.js'
    import type { NavigationMenuItem } from '$lib/components/NavigationMenu/navigation-menu.types.js'
    import type { LightboxSlide } from '$lib/components/Lightbox/lightbox.types.js'

    const types = ['hover', 'scroll', 'auto', 'always'] as const
    const sizes = ['xs', 'sm', 'md', 'lg'] as const
    const colors = ['surface', 'primary', 'secondary', 'success', 'warning', 'error'] as const

    const tags = [
        'svelte',
        'runes',
        'tailwind',
        'typescript',
        'accessibility',
        'components',
        'design tokens',
        'dark mode',
        'forms',
        'overlays'
    ]

    const people = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        name: `Teammate ${i + 1}`,
        role: i % 3 === 0 ? 'Engineering' : i % 3 === 1 ? 'Design' : 'Product'
    }))

    const paragraphs = Array.from(
        { length: 8 },
        (_, i) =>
            `Section ${i + 1}. Scroll areas keep long content inside a fixed box while the scrollbar stays consistent across browsers and platforms.`
    )

    const wideRows = Array.from(
        { length: 16 },
        (_, i) =>
            `Row ${i + 1}. This single line is deliberately long so it runs past the right edge of the box, and there are enough rows stacked up to run past the bottom edge as well.`
    )

    let logs = $state<string[]>(
        Array.from({ length: 15 }, (_, i) => `[12:0${i % 10}] request handled in ${20 + i}ms`)
    )
    let logViewport = $state<HTMLDivElement | null>(null)

    function appendLog() {
        logs = [...logs, `[12:0${logs.length % 10}] request handled in ${20 + logs.length}ms`]
        requestAnimationFrame(() => {
            if (logViewport) logViewport.scrollTop = logViewport.scrollHeight
        })
    }

    type Member = {
        id: string
        name: string
        email: string
        role: string
        location: string
        timezone: string
        lastActive: string
        joined: string
    }

    const members: Member[] = Array.from({ length: 18 }, (_, i) => ({
        id: String(i + 1),
        name: `Teammate ${i + 1}`,
        email: `teammate.${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Administrator' : i % 3 === 1 ? 'Contributor' : 'Viewer',
        location: i % 2 === 0 ? 'Ho Chi Minh City' : 'Copenhagen',
        timezone: i % 2 === 0 ? 'Asia/Ho_Chi_Minh' : 'Europe/Copenhagen',
        lastActive: `${(i % 12) + 1} hours ago`,
        joined: `2026-0${(i % 9) + 1}-1${i % 10}`
    }))

    const memberColumns: TableColumn<Member>[] = [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Full name' },
        { key: 'email', label: 'Email address' },
        { key: 'role', label: 'Workspace role' },
        { key: 'location', label: 'Location' },
        { key: 'timezone', label: 'Time zone' },
        { key: 'lastActive', label: 'Last active' },
        { key: 'joined', label: 'Joined on' }
    ]

    const sidebarItems: NavigationMenuItem[][] = [
        [
            { label: 'General', type: 'label' },
            { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/scroll-area' },
            { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 12 },
            { label: 'Projects', icon: 'lucide:folder', href: '/projects' },
            { label: 'Reports', icon: 'lucide:chart-line', href: '/reports' },
            { label: 'Automations', icon: 'lucide:workflow', href: '/automations' }
        ],
        [
            { label: 'Workspace', type: 'label' },
            { label: 'Members', icon: 'lucide:users', href: '/members' },
            { label: 'Billing', icon: 'lucide:credit-card', href: '/billing' },
            { label: 'Integrations', icon: 'lucide:plug', href: '/integrations' },
            { label: 'Audit log', icon: 'lucide:scroll-text', href: '/audit' },
            { label: 'Settings', icon: 'lucide:settings', href: '/settings' }
        ],
        [
            { label: 'Support', type: 'label' },
            { label: 'Documentation', icon: 'lucide:book-open', href: '/getting-started' },
            { label: 'Changelog', icon: 'lucide:history', href: '/changelog' },
            { label: 'Community', icon: 'lucide:message-circle', href: '/community' },
            { label: 'Status', icon: 'lucide:activity', href: '/status' }
        ]
    ]

    const menuItems: NavigationMenuItem[] = [
        { label: 'Overview', icon: 'lucide:house', href: '/scroll-area', active: true },
        { label: 'Analytics', icon: 'lucide:chart-line', href: '/analytics' },
        { label: 'Campaigns', icon: 'lucide:megaphone', href: '/campaigns' },
        { label: 'Audiences', icon: 'lucide:users', href: '/audiences' },
        { label: 'Automations', icon: 'lucide:workflow', href: '/automations' },
        { label: 'Integrations', icon: 'lucide:plug', href: '/integrations' },
        { label: 'Billing', icon: 'lucide:credit-card', href: '/billing' },
        { label: 'Settings', icon: 'lucide:settings', href: '/settings' }
    ]

    const galleryTitles = [
        'Sunset Ridge',
        'Harbour Lights',
        'Quiet Fields',
        'Morning Tide',
        'City Lines',
        'Old Boats',
        'Dune Path',
        'Long Shore',
        'Blue Hour',
        'Salt Flats'
    ]

    const gallery: LightboxSlide[] = galleryTitles.map((title, i) => ({
        src: `https://picsum.photos/seed/sv5ui-sa-${i}/1600/1000`,
        thumb: `https://picsum.photos/seed/sv5ui-sa-${i}/400/250`,
        alt: title,
        title,
        width: 1600,
        height: 1000
    }))

    let slideoverOpen = $state(false)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Scroll Area</h1>
        <p class="text-on-surface-variant">
            A scrollable region with a custom overlay scrollbar that looks and behaves the same in
            every browser.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Give the scroll area a height (<code>h-*</code>, <code>max-h-*</code>, or
            <code>flex-1</code>
            with <code>min-h-0</code>) and it takes care of the rest.
        </p>
        <ScrollArea class="h-64 w-full max-w-md rounded-xl border border-outline-variant">
            <div class="space-y-3 p-4">
                {#each paragraphs as text (text)}
                    <p class="text-sm text-on-surface-variant">{text}</p>
                {/each}
            </div>
        </ScrollArea>
    </section>

    <!-- Type -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Type</h2>
        <p class="text-sm text-on-surface-variant">
            Controls when the scrollbar is visible. <code>hover</code> is the default.
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {#each types as type (type)}
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <Badge color="secondary" variant="soft">{type}</Badge>
                    </div>
                    <ScrollArea
                        {type}
                        class="h-40 rounded-xl border border-outline-variant bg-surface"
                    >
                        <div class="space-y-2 p-3">
                            {#each paragraphs as text (text)}
                                <p class="text-xs text-on-surface-variant">{text}</p>
                            {/each}
                        </div>
                    </ScrollArea>
                </div>
            {/each}
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {#each sizes as size (size)}
                <div class="space-y-2">
                    <Badge color="secondary" variant="soft">{size}</Badge>
                    <ScrollArea
                        {size}
                        type="always"
                        class="h-40 rounded-xl border border-outline-variant bg-surface"
                    >
                        <div class="space-y-2 p-3">
                            {#each paragraphs as text (text)}
                                <p class="text-xs text-on-surface-variant">{text}</p>
                            {/each}
                        </div>
                    </ScrollArea>
                </div>
            {/each}
        </div>
    </section>

    <!-- Color -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Color</h2>
        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {#each colors as color (color)}
                <div class="space-y-2">
                    <Badge {color} variant="soft">{color}</Badge>
                    <ScrollArea
                        {color}
                        size="md"
                        type="always"
                        class="h-40 rounded-xl border border-outline-variant bg-surface"
                    >
                        <div class="space-y-2 p-3">
                            {#each paragraphs as text (text)}
                                <p class="text-xs text-on-surface-variant">{text}</p>
                            {/each}
                        </div>
                    </ScrollArea>
                </div>
            {/each}
        </div>
    </section>

    <!-- Track -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Track</h2>
        <p class="text-sm text-on-surface-variant">
            Tint the track permanently instead of only on hover.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <ScrollArea
                track
                size="md"
                type="always"
                class="h-40 rounded-xl border border-outline-variant bg-surface"
            >
                <div class="space-y-2 p-3">
                    {#each paragraphs as text (text)}
                        <p class="text-xs text-on-surface-variant">{text}</p>
                    {/each}
                </div>
            </ScrollArea>
            <ScrollArea
                size="md"
                type="always"
                class="h-40 rounded-xl border border-outline-variant bg-surface"
            >
                <div class="space-y-2 p-3">
                    {#each paragraphs as text (text)}
                        <p class="text-xs text-on-surface-variant">{text}</p>
                    {/each}
                </div>
            </ScrollArea>
        </div>
    </section>

    <!-- Horizontal -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Horizontal</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code>orientation="horizontal"</code> for a row of items that scrolls sideways.
        </p>
        <ScrollArea
            orientation="horizontal"
            type="always"
            class="w-full rounded-xl border border-outline-variant bg-surface"
        >
            <div class="flex w-max gap-3 p-3">
                {#each tags as tag (tag)}
                    <div
                        class="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-sm font-medium"
                    >
                        {tag}
                    </div>
                {/each}
            </div>
        </ScrollArea>
    </section>

    <!-- Both -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Both axes</h2>
        <p class="text-sm text-on-surface-variant">
            <code>orientation="both"</code> renders two scrollbars and a corner.
        </p>
        <ScrollArea
            orientation="both"
            type="always"
            class="h-64 w-full rounded-xl border border-outline-variant bg-surface"
        >
            <div class="space-y-2 p-4">
                {#each wideRows as row (row)}
                    <p class="text-sm whitespace-nowrap text-on-surface-variant">{row}</p>
                {/each}
            </div>
        </ScrollArea>
    </section>

    <!-- In a card -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inside a card</h2>
        <Card class="max-w-md" ui={{ body: 'p-0' }}>
            {#snippet header()}
                <h3 class="font-semibold">Team</h3>
            {/snippet}
            <ScrollArea class="h-72">
                <div class="p-2">
                    {#each people as person, i (person.id)}
                        {#if i > 0}
                            <Separator />
                        {/if}
                        <div class="flex items-center justify-between px-3 py-2">
                            <span class="text-sm font-medium">{person.name}</span>
                            <span class="text-xs text-on-surface-variant">{person.role}</span>
                        </div>
                    {/each}
                </div>
            </ScrollArea>
        </Card>
    </section>

    <!-- Viewport ref -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Viewport reference</h2>
        <p class="text-sm text-on-surface-variant">
            Bind <code>viewportRef</code> to control the scrolling element directly, for example to keep
            a log pinned to the bottom.
        </p>
        <div class="max-w-md space-y-2">
            <ScrollArea
                bind:viewportRef={logViewport}
                type="always"
                class="h-48 rounded-xl border border-outline-variant bg-surface-container-lowest"
            >
                <div class="space-y-1 p-3 font-mono text-xs text-on-surface-variant">
                    {#each logs as line (line)}
                        <p>{line}</p>
                    {/each}
                </div>
            </ScrollArea>
            <Button size="sm" variant="soft" onclick={appendLog}>Append log line</Button>
        </div>
    </section>

    <!-- Customization -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Customization</h2>
        <p class="text-sm text-on-surface-variant">
            Every slot is reachable through <code>ui</code>: <code>root</code>,
            <code>viewport</code>, <code>content</code>, <code>scrollbar</code>,
            <code>thumb</code>, and <code>corner</code>.
        </p>
        <ScrollArea
            type="always"
            size="lg"
            class="h-56 max-w-md rounded-xl border border-outline-variant bg-surface"
            ui={{
                content: 'space-y-2 p-4',
                scrollbar: 'p-0.5',
                thumb: 'bg-primary/60 hover:bg-primary'
            }}
        >
            {#each paragraphs as text (text)}
                <p class="text-sm text-on-surface-variant">{text}</p>
            {/each}
        </ScrollArea>
    </section>

    <!-- Used across the library -->
    <section class="space-y-6">
        <div class="space-y-2">
            <h2 class="text-lg font-semibold">Used across the library</h2>
            <p class="text-sm text-on-surface-variant">
                Components that scroll internally already render a scroll area, so a long table,
                menu or panel looks the same on every platform. Each of them accepts a
                <code>scrollArea</code> prop to tune the scrollbar.
            </p>
        </div>

        <!-- Table -->
        <div class="space-y-3">
            <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="font-semibold">Table</h3>
                <Badge color="secondary" variant="soft">orientation: both</Badge>
            </div>
            <p class="text-sm text-on-surface-variant">
                Scrolls on both axes: sideways through the columns, and vertically under a sticky
                header.
            </p>
            <Table
                data={members}
                columns={memberColumns}
                sticky="header"
                class="max-h-72"
                scrollArea={{ type: 'always', size: 'md' }}
            />
        </div>

        <!-- Sidebar -->
        <div class="space-y-3">
            <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="font-semibold">Sidebar</h3>
                <Badge color="secondary" variant="soft">content</Badge>
            </div>
            <p class="text-sm text-on-surface-variant">
                Navigation scrolls between a pinned header and footer, on desktop and in the mobile
                panel.
            </p>
            <div class="flex h-96 overflow-hidden rounded-xl bg-surface ring ring-outline-variant">
                <Sidebar
                    items={sidebarItems}
                    breakpoint="sm"
                    collapsible="none"
                    title="Acme Inc"
                    description="Workspace"
                    class="static! h-full!"
                    scrollArea={{ type: 'always' }}
                >
                    {#snippet footer()}
                        <span class="px-1 text-xs text-on-surface-variant">v2.5.0</span>
                    {/snippet}
                </Sidebar>

                <div
                    class="flex min-w-0 flex-1 items-center justify-center bg-surface-container-low p-6 text-sm text-on-surface-variant"
                >
                    Page content
                </div>
            </div>
        </div>

        <!-- Slideover -->
        <div class="space-y-3">
            <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="font-semibold">Slideover</h3>
                <Badge color="secondary" variant="soft">body</Badge>
            </div>
            <p class="text-sm text-on-surface-variant">
                The body scrolls while the header and footer stay put.
            </p>
            <Button variant="outline" color="surface" onclick={() => (slideoverOpen = true)}>
                Open slideover
            </Button>
            <Slideover
                bind:open={slideoverOpen}
                title="Release notes"
                description="Everything that shipped this week."
                scrollArea={{ type: 'always' }}
            >
                {#snippet body()}
                    <div class="space-y-3">
                        {#each paragraphs as text (text)}
                            <p class="text-sm text-on-surface-variant">{text}</p>
                        {/each}
                        {#each paragraphs as text (text)}
                            <p class="text-sm text-on-surface-variant">{text}</p>
                        {/each}
                    </div>
                {/snippet}
                {#snippet footer()}
                    <Button size="sm" onclick={() => (slideoverOpen = false)}>Close</Button>
                {/snippet}
            </Slideover>
        </div>

        <!-- NavigationMenu -->
        <div class="space-y-3">
            <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="font-semibold">NavigationMenu</h3>
                <Badge color="secondary" variant="soft">orientation: horizontal</Badge>
            </div>
            <p class="text-sm text-on-surface-variant">
                A horizontal menu that runs out of room scrolls sideways instead of wrapping.
            </p>
            <div class="max-w-lg rounded-xl border border-outline-variant bg-surface px-2 pt-2">
                <NavigationMenu
                    items={menuItems}
                    orientation="horizontal"
                    scrollArea={{ type: 'always', size: 'xs' }}
                />
            </div>
        </div>

        <!-- Lightbox -->
        <div class="space-y-3">
            <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="font-semibold">Lightbox</h3>
                <Badge color="secondary" variant="soft">thumbnails</Badge>
            </div>
            <p class="text-sm text-on-surface-variant">
                Open a photo, then scroll the thumbnail strip at the bottom. The thumb is tinted for
                the dark backdrop.
            </p>
            <Lightbox slides={gallery} scrollArea={{ type: 'always' }} />
        </div>
    </section>
</div>
