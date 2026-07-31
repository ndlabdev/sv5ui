<script lang="ts">
    import {
        Sidebar,
        SidebarTrigger,
        Header,
        Main,
        Footer,
        Button,
        User,
        Avatar,
        Link
    } from '$lib/index.js'
    import type { NavigationMenuItem, SidebarProps, SidebarMode } from '$lib/index.js'

    const items: NavigationMenuItem[][] = [
        [
            { label: 'General', type: 'label' },
            { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/sidebar' },
            { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 12 },
            { label: 'Projects', icon: 'lucide:folder', href: '/projects' }
        ],
        [
            { label: 'Workspace', type: 'label' },
            {
                label: 'Settings',
                icon: 'lucide:settings',
                defaultOpen: true,
                children: [
                    { label: 'Profile', href: '/settings/profile' },
                    { label: 'Members', href: '/settings/members' },
                    { label: 'Billing', href: '/settings/billing' }
                ]
            },
            {
                label: 'Resources',
                icon: 'lucide:book-open',
                children: [
                    { label: 'Documentation', href: '/docs' },
                    { label: 'Changelog', href: '/changelog' }
                ]
            },
            { label: 'Support', icon: 'lucide:life-buoy', href: '/support' }
        ]
    ]

    const variants: NonNullable<SidebarProps['variant']>[] = ['sidebar', 'floating', 'inset']
    const modes: SidebarMode[] = ['slideover', 'drawer']

    const teamItems: NavigationMenuItem[] = [
        { label: 'Members', type: 'label' },
        {
            label: 'Long Dang',
            description: 'Owner',
            avatar: { src: 'https://i.pravatar.cc/64?img=12' },
            chip: { color: 'success' },
            href: '/team/long'
        },
        {
            label: 'Jane Cooper',
            description: 'Admin',
            avatar: { src: 'https://i.pravatar.cc/64?img=5' },
            chip: { color: 'warning' },
            href: '/team/jane',
            badge: 3
        },
        {
            label: 'John Smith',
            description: 'Away',
            avatar: { src: 'https://i.pravatar.cc/64?img=8' },
            href: '/team/john'
        }
    ]

    const projectItems: NavigationMenuItem[] = [
        { label: 'Projects', type: 'label' },
        { label: 'Website', icon: 'lucide:globe', href: '/p/website' },
        { label: 'Mobile App', icon: 'lucide:smartphone', href: '/p/mobile' },
        { label: 'Design System', icon: 'lucide:palette', href: '/p/design' }
    ]

    let variant = $state<NonNullable<SidebarProps['variant']>>('sidebar')
    let side = $state<'left' | 'right'>('left')
    let collapsible = $state<'icon' | 'offcanvas'>('icon')
    let collapsed = $state(false)

    let open = $state(false)
    let mode = $state<SidebarMode>('slideover')
    let mobileSide = $state<'left' | 'right'>('left')

    let appCollapsed = $state(false)
    let appOpen = $state(false)

    const stats = [
        { label: 'Revenue', value: '$48.2k', delta: '+12.5%', icon: 'lucide:dollar-sign' },
        { label: 'Users', value: '2,340', delta: '+3.1%', icon: 'lucide:users' },
        { label: 'Orders', value: '1,204', delta: '-1.8%', icon: 'lucide:shopping-cart' },
        { label: 'Churn', value: '0.8%', delta: '-0.2%', icon: 'lucide:trending-down' }
    ]

    function cycle<T>(list: T[], current: T): T {
        return list[(list.indexOf(current) + 1) % list.length]
    }
</script>

{#snippet brand({ collapsed }: { collapsed: boolean })}
    <div class="flex min-w-0 items-center gap-2">
        <span
            class="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-on-primary"
        >
            S
        </span>
        {#if !collapsed}
            <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-semibold text-on-surface">SV5UI</span>
                <span class="truncate text-xs text-on-surface-variant">Workspace</span>
            </div>
        {/if}
    </div>
{/snippet}

{#snippet person({ collapsed }: { collapsed: boolean })}
    {#if collapsed}
        <div class="flex justify-center py-0.5">
            <Avatar src="https://i.pravatar.cc/80?img=12" alt="User" size="sm" />
        </div>
    {:else}
        <User
            name="Long Dang"
            description="Owner"
            avatar={{ src: 'https://i.pravatar.cc/80?img=12', alt: 'User' }}
            size="sm"
        />
    {/if}
{/snippet}

{#snippet stage(label: string, body: string)}
    <div class="flex min-w-0 flex-1 flex-col gap-3 p-3">
        <div class="h-full rounded-xl bg-surface p-5 ring ring-outline-variant">
            <h3 class="text-sm font-semibold text-on-surface">{label}</h3>
            <p class="mt-1 text-sm text-on-surface-variant">{body}</p>
        </div>
    </div>
{/snippet}

{#snippet rowActions()}
    <Button size="xs" variant="ghost" color="secondary" icon="lucide:ellipsis" />
{/snippet}

<div class="space-y-10">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Sidebar</h1>
        <p class="max-w-3xl text-on-surface-variant">
            A collapsible navigation sidebar for dashboard layouts. Data-driven items with nested
            groups and active-route detection, three visual variants, an icon rail with label
            tooltips and flyout groups, an interactive edge rail, a composable header, localStorage
            persistence, and a responsive mobile menu that opens as a slideover, drawer or modal.
        </p>
    </div>

    <!-- Full application layout -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Full application layout</h2>
        <p class="text-sm text-on-surface-variant">
            Header, Sidebar, Main and Footer composed into a complete app shell. The header
            <code>SidebarTrigger</code> collapses the sidebar on desktop and opens the menu on mobile;
            Main scrolls independently.
        </p>
        <div class="flex h-168 overflow-hidden rounded-xl bg-surface ring ring-outline-variant">
            <Sidebar
                {items}
                bind:collapsed={appCollapsed}
                bind:open={appOpen}
                collapsible="icon"
                rail
                breakpoint="md"
                mode="slideover"
                header={brand}
                footer={person}
                class="static! h-full!"
            />

            <div class="flex min-w-0 flex-1 flex-col">
                <Header
                    toggle={false}
                    class="static! z-auto! backdrop-blur-none!"
                    ui={{ container: 'max-w-none px-3' }}
                >
                    {#snippet titleSlot()}
                        <div class="flex items-center gap-1">
                            <SidebarTrigger
                                bind:collapsed={appCollapsed}
                                bind:open={appOpen}
                                breakpoint="md"
                            />
                            <span class="text-sm font-semibold text-on-surface">Dashboard</span>
                        </div>
                    {/snippet}
                    {#snippet right()}
                        <Button size="sm" variant="ghost" color="secondary" icon="lucide:search" />
                        <Button size="sm" variant="ghost" color="secondary" icon="lucide:bell" />
                        <Avatar src="https://i.pravatar.cc/64?img=12" alt="User" size="xs" />
                    {/snippet}
                </Header>

                <Main class="min-h-0! flex-1 overflow-y-auto bg-surface-container-low p-6">
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-xl font-bold text-on-surface">Overview</h3>
                            <p class="text-sm text-on-surface-variant">
                                Welcome back, here is what is happening today.
                            </p>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {#each stats as stat (stat.label)}
                                <div class="rounded-xl bg-surface p-4 ring ring-outline-variant">
                                    <div
                                        class="flex items-center justify-between text-on-surface-variant"
                                    >
                                        <span class="text-sm">{stat.label}</span>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            color="secondary"
                                            icon={stat.icon}
                                        />
                                    </div>
                                    <div class="mt-2 text-2xl font-bold text-on-surface">
                                        {stat.value}
                                    </div>
                                    <div
                                        class="text-xs {stat.delta.startsWith('-')
                                            ? 'text-error'
                                            : 'text-success'}"
                                    >
                                        {stat.delta} vs last week
                                    </div>
                                </div>
                            {/each}
                        </div>

                        <div class="grid gap-4 lg:grid-cols-3">
                            <div
                                class="h-64 rounded-xl bg-surface p-5 ring ring-outline-variant lg:col-span-2"
                            >
                                <h4 class="text-sm font-semibold text-on-surface">Revenue</h4>
                                <div
                                    class="mt-4 flex h-40 items-end gap-2 border-b border-outline-variant"
                                >
                                    {#each [40, 65, 50, 80, 60, 90, 75] as h, i (i)}
                                        <div
                                            class="flex-1 rounded-t bg-primary/70"
                                            style={`height:${h}%`}
                                        ></div>
                                    {/each}
                                </div>
                            </div>
                            <div class="rounded-xl bg-surface p-5 ring ring-outline-variant">
                                <h4 class="text-sm font-semibold text-on-surface">Activity</h4>
                                <ul class="mt-3 space-y-3 text-sm text-on-surface-variant">
                                    {#each ['Deployed v2.5.0', 'Merged PR #182', 'New signup: Acme', 'Invoice paid'] as line (line)}
                                        <li class="flex items-center gap-2">
                                            <span class="size-1.5 rounded-full bg-primary"></span>
                                            {line}
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>

                        <div class="h-48 rounded-xl bg-surface p-5 ring ring-outline-variant">
                            <h4 class="text-sm font-semibold text-on-surface">Recent orders</h4>
                            <p class="mt-2 text-sm text-on-surface-variant">
                                Scroll to see the Main area move under the sticky header while the
                                sidebar and footer stay in place.
                            </p>
                        </div>
                    </div>
                </Main>

                <Footer
                    class="static! h-16!"
                    ui={{ container: 'h-full max-w-none flex-row items-center px-4 py-0' }}
                >
                    {#snippet left()}
                        <span class="text-sm text-on-surface-variant">© 2026 SV5UI</span>
                    {/snippet}
                    {#snippet right()}
                        <Button size="sm" variant="ghost" color="secondary" icon="lucide:github" />
                    {/snippet}
                    <div class="flex items-center gap-4 text-sm text-on-surface-variant">
                        <Link href="/getting-started" class="hover:text-on-surface">Docs</Link>
                        <Link href="/sidebar" class="hover:text-on-surface">Components</Link>
                    </div>
                </Footer>
            </div>
        </div>
    </section>

    <!-- Interactive dashboard -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Playground</h2>
        <div class="flex flex-wrap gap-2">
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={`Variant: ${variant}`}
                icon="lucide:layout-template"
                onclick={() => (variant = cycle(variants, variant))}
            />
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={`Side: ${side}`}
                icon="lucide:flip-horizontal"
                onclick={() => (side = side === 'left' ? 'right' : 'left')}
            />
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={`Collapsible: ${collapsible}`}
                icon="lucide:columns-2"
                onclick={() => (collapsible = collapsible === 'icon' ? 'offcanvas' : 'icon')}
            />
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={collapsed ? 'Expand' : 'Collapse'}
                icon={collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'}
                onclick={() => (collapsed = !collapsed)}
            />
        </div>
        <div
            class="flex h-128 overflow-hidden rounded-xl bg-surface-container-high ring ring-outline-variant"
        >
            {#if side === 'left'}
                <Sidebar
                    {items}
                    {variant}
                    {side}
                    {collapsible}
                    bind:collapsed
                    rail
                    breakpoint="sm"
                    header={brand}
                    footer={person}
                    class="static! h-auto!"
                />
            {/if}
            <div class="flex min-w-0 flex-1 flex-col">
                <div
                    class="flex h-14 shrink-0 items-center gap-2 border-b border-outline-variant bg-surface px-3"
                >
                    <SidebarTrigger bind:collapsed breakpoint="sm" />
                    <span class="text-sm font-semibold text-on-surface">Dashboard</span>
                </div>
                <div class="min-w-0 flex-1 p-3">
                    <div class="h-full rounded-xl bg-surface p-5 ring ring-outline-variant">
                        <p class="text-sm text-on-surface-variant">
                            Click the panel button in the navbar (like Nuxt) or the edge rail to
                            collapse the sidebar. Switch variants or flip the side.
                        </p>
                    </div>
                </div>
            </div>
            {#if side === 'right'}
                <Sidebar
                    {items}
                    {variant}
                    {side}
                    {collapsible}
                    bind:collapsed
                    rail
                    breakpoint="sm"
                    header={brand}
                    footer={person}
                    class="static! h-auto!"
                />
            {/if}
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            <code>sidebar</code> is flush with a divider, <code>floating</code> is a detached
            elevated panel, and <code>inset</code> is transparent for inset layouts.
        </p>
        <div class="grid gap-4 lg:grid-cols-3">
            {#each variants as v (v)}
                <div class="space-y-2">
                    <span class="text-xs font-medium text-on-surface-variant">{v}</span>
                    <div
                        class="flex h-80 overflow-hidden rounded-xl bg-surface-container-high ring ring-outline-variant"
                    >
                        <Sidebar
                            items={items[0]}
                            variant={v}
                            collapsible="none"
                            width={200}
                            breakpoint="sm"
                            header={brand}
                            class="static! h-auto!"
                        />
                        {@render stage('Content', 'Main area.')}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Header, actions & close -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Header, actions &amp; close</h2>
        <p class="text-sm text-on-surface-variant">
            Built-in <code>title</code>/<code>description</code> header with an
            <code>actions</code> slot and a <code>close</code> button that collapses the sidebar.
        </p>
        <div class="flex h-112 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                {items}
                title="Acme Inc."
                description="Pro plan"
                close
                rail
                collapsible="icon"
                breakpoint="sm"
                footer={person}
                class="static! h-auto!"
            >
                {#snippet actions()}
                    <Button size="sm" variant="ghost" color="secondary" icon="lucide:search" />
                {/snippet}
            </Sidebar>
            {@render stage(
                'Content',
                'Click the header collapse button to switch to the icon rail; click the edge rail to expand again.'
            )}
        </div>
    </section>

    <!-- NavigationMenu: highlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Active highlight bar</h2>
        <p class="text-sm text-on-surface-variant">
            Forward NavigationMenu options through <code>menu</code>. Here
            <code>{'{ highlight: true }'}</code> adds a sliding highlight that animates between the active
            routes.
        </p>
        <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                {items}
                menu={{ highlight: true }}
                breakpoint="sm"
                header={brand}
                footer={person}
                class="static! h-auto!"
            />
            {@render stage('Content', 'The highlight bar slides to the hovered / active item.')}
        </div>
    </section>

    <!-- NavigationMenu: variant + color -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variant &amp; color</h2>
        <p class="text-sm text-on-surface-variant">
            <code>menu={'{ variant, color }'}</code> restyles the entries. <code>link</code> drops
            the pill for an underline-on-active look; <code>color</code> recolors the active state.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
                <Sidebar
                    {items}
                    menu={{ variant: 'link', color: 'primary', highlight: true }}
                    breakpoint="sm"
                    header={brand}
                    class="static! h-auto!"
                />
                {@render stage('link', 'variant: link + highlight')}
            </div>
            <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
                <Sidebar
                    {items}
                    menu={{ variant: 'pill', color: 'success' }}
                    breakpoint="sm"
                    header={brand}
                    class="static! h-auto!"
                />
                {@render stage('pill', 'variant: pill + color: success')}
            </div>
        </div>
    </section>

    <!-- NavigationMenu: avatars, chips & badges -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatars, chips &amp; badges</h2>
        <p class="text-sm text-on-surface-variant">
            Items support <code>avatar</code>, a status <code>chip</code> and a
            <code>badge</code> — all rendered by NavigationMenu inside the sidebar.
        </p>
        <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                items={teamItems}
                collapsible="none"
                breakpoint="sm"
                title="Team"
                description="4 members"
                class="static! h-auto!"
            />
            {@render stage(
                'Content',
                'Green / amber chips mark presence; the badge shows a count.'
            )}
        </div>
    </section>

    <!-- NavigationMenu: row actions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Row actions on hover</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an <code>itemActions</code> snippet via <code>menu</code> for Notion-style actions revealed
            on hover (rendered as a sibling of the link, never nested).
        </p>
        <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                items={projectItems}
                menu={{ itemActions: rowActions }}
                collapsible="none"
                breakpoint="sm"
                header={brand}
                class="static! h-auto!"
            />
            {@render stage('Content', 'Hover a project row to reveal the action button.')}
        </div>
    </section>

    <!-- NavigationMenu: single-open groups -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Single-open groups (accordion)</h2>
        <p class="text-sm text-on-surface-variant">
            <code>menu={'{ type: "single" }'}</code> keeps only one expandable group open at a time.
        </p>
        <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                {items}
                menu={{ type: 'single' }}
                breakpoint="sm"
                header={brand}
                class="static! h-auto!"
            />
            {@render stage('Content', 'Open Resources and Settings closes automatically.')}
        </div>
    </section>

    <!-- Mobile menu -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Mobile menu</h2>
        <p class="text-sm text-on-surface-variant">
            Below <code>breakpoint</code> the sidebar becomes a menu. Choose <code>mode</code>
            (slideover or drawer) opening from <code>side</code>.
        </p>
        <div class="flex flex-wrap items-center gap-2">
            <SidebarTrigger
                bind:open
                breakpoint="xl"
                icon="lucide:menu"
                label="Open menu"
                color="primary"
                variant="solid"
            />
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={`Mode: ${mode}`}
                icon="lucide:panels-top-left"
                onclick={() => (mode = cycle(modes, mode))}
            />
            <Button
                size="sm"
                variant="soft"
                color="secondary"
                label={`Side: ${mobileSide}`}
                icon="lucide:flip-horizontal"
                onclick={() => (mobileSide = mobileSide === 'left' ? 'right' : 'left')}
            />
        </div>
        <Sidebar
            {items}
            bind:open
            {mode}
            side={mobileSide}
            breakpoint="xl"
            header={brand}
            footer={person}
        />
    </section>

    <!-- Persisted state -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Persisted collapse state</h2>
        <p class="text-sm text-on-surface-variant">
            With <code>persist</code> the collapsed state is remembered across reloads via localStorage.
        </p>
        <div class="flex h-96 overflow-hidden rounded-xl ring ring-outline-variant">
            <Sidebar
                {items}
                persist={{ key: 'sidebar-demo' }}
                rail
                breakpoint="sm"
                header={brand}
                footer={person}
                class="static! h-auto!"
            />
            {@render stage(
                'Content',
                'Collapse the sidebar, then reload the page: the state persists.'
            )}
        </div>
    </section>
</div>
