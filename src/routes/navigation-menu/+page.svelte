<script lang="ts">
    import {
        NavigationMenu,
        Button,
        Avatar,
        Badge,
        Link,
        type NavigationMenuItem
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

    const simpleItems: NavigationMenuItem[] = [
        { label: 'Home', icon: 'lucide:house', href: '/navigation-menu', active: true },
        { label: 'Docs', icon: 'lucide:book-open', href: '/getting-started' },
        { label: 'Components', icon: 'lucide:shapes', href: '/button' },
        { label: 'GitHub', icon: 'lucide:github', href: 'https://github.com', target: '_blank' }
    ]

    const megaItems: NavigationMenuItem[] = [
        {
            label: 'Product',
            icon: 'lucide:box',
            children: [
                {
                    label: 'Analytics',
                    description: 'Track engagement and conversions in real time.',
                    icon: 'lucide:chart-line',
                    href: '/analytics'
                },
                {
                    label: 'Automation',
                    description: 'Build no-code workflows across your stack.',
                    icon: 'lucide:workflow',
                    href: '/automation'
                },
                {
                    label: 'Reports',
                    description: 'Schedule and export shareable dashboards.',
                    icon: 'lucide:file-chart-column',
                    href: '/reports'
                }
            ]
        },
        {
            label: 'Resources',
            icon: 'lucide:library',
            children: [
                {
                    label: 'Guides',
                    description: 'Step-by-step tutorials.',
                    icon: 'lucide:compass',
                    href: '/guides'
                },
                {
                    label: 'Blog',
                    description: 'Product news and deep dives.',
                    icon: 'lucide:rss',
                    href: '/blog'
                },
                {
                    label: 'Changelog',
                    description: 'What shipped, and when.',
                    icon: 'lucide:git-commit-horizontal',
                    href: '/changelog'
                }
            ]
        },
        { label: 'Pricing', icon: 'lucide:credit-card', href: '/pricing' }
    ]

    const badgedItems: NavigationMenuItem[] = [
        { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 12 },
        { label: 'Drafts', icon: 'lucide:file-pen', href: '/drafts', badge: 3 },
        { label: 'Archive', icon: 'lucide:archive', href: '/archive' },
        { label: 'Spam', icon: 'lucide:shield-alert', href: '/spam', disabled: true }
    ]

    const groupedItems: NavigationMenuItem[][] = [
        [
            { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/dashboard' },
            { label: 'Projects', icon: 'lucide:folder-kanban', href: '/projects' }
        ],
        [
            { label: 'Settings', icon: 'lucide:settings', href: '/settings' },
            { label: 'Members', icon: 'lucide:users', href: '/members' }
        ]
    ]

    const verticalItems: NavigationMenuItem[] = [
        { label: 'Getting Started', icon: 'lucide:rocket', href: '/getting-started' },
        {
            label: 'Components',
            value: 'components',
            icon: 'lucide:shapes',
            defaultOpen: true,
            children: [
                { label: 'Button', href: '/button' },
                { label: 'Tree', href: '/tree' },
                { label: 'Navigation Menu', href: '/navigation-menu', active: true }
            ]
        },
        {
            label: 'Composables',
            value: 'composables',
            icon: 'lucide:function-square',
            children: [
                { label: 'useMediaQuery', href: '/use-media-query' },
                { label: 'useClipboard', href: '/use-clipboard' }
            ]
        },
        { label: 'Customization', icon: 'lucide:palette', href: '/customization' }
    ]

    const collapsedItems: NavigationMenuItem[] = [
        { label: 'Home', icon: 'lucide:house', href: '/home' },
        { label: 'Search', icon: 'lucide:search', href: '/search' },
        { label: 'Notifications', icon: 'lucide:bell', href: '/notifications', badge: 5 },
        { label: 'Profile', icon: 'lucide:user', href: '/profile' }
    ]

    const teamItems: NavigationMenuItem[] = [
        {
            label: 'Ada Lovelace',
            value: 'ada',
            avatar: { text: 'AL' },
            chip: { color: 'success' },
            children: [
                {
                    label: 'Profile',
                    description: 'View and edit your profile',
                    icon: 'lucide:user',
                    href: '/profile'
                },
                {
                    label: 'Billing',
                    description: 'Plans and invoices',
                    icon: 'lucide:credit-card',
                    href: '/billing'
                },
                {
                    label: 'Sign out',
                    description: 'End your session',
                    icon: 'lucide:log-out',
                    href: '/logout'
                }
            ]
        },
        { label: 'Grace Hopper', avatar: { text: 'GH' }, href: '/u/grace' },
        {
            label: 'Alan Turing',
            avatar: { text: 'AT' },
            chip: { color: 'warning' },
            href: '/u/alan'
        }
    ]

    const featuredItems: NavigationMenuItem[] = [
        { label: 'Solutions', value: 'solutions', type: 'trigger' },
        { label: 'Enterprise', href: '/enterprise' }
    ]

    const ctaItems: NavigationMenuItem[] = [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Docs', href: '/docs' }
    ]

    let verticalValue = $state<string | string[]>(['components'])

    // ---- Real-world: SaaS marketing header ----
    const appNavItems: NavigationMenuItem[] = [
        {
            label: 'Product',
            children: [
                {
                    label: 'Overview',
                    description: 'The all-in-one platform',
                    icon: 'lucide:layout-dashboard',
                    href: '/product'
                },
                {
                    label: 'Analytics',
                    description: 'Real-time insights',
                    icon: 'lucide:chart-line',
                    href: '/analytics'
                },
                {
                    label: 'Automations',
                    description: 'Workflows without code',
                    icon: 'lucide:workflow',
                    href: '/automations'
                },
                {
                    label: 'Integrations',
                    description: '120+ connected apps',
                    icon: 'lucide:blocks',
                    href: '/integrations'
                }
            ]
        },
        {
            label: 'Solutions',
            children: [
                {
                    label: 'Startups',
                    description: 'Ship fast on a budget',
                    icon: 'lucide:rocket',
                    href: '/startups'
                },
                {
                    label: 'Enterprise',
                    description: 'Security and scale',
                    icon: 'lucide:building-2',
                    href: '/enterprise'
                },
                {
                    label: 'Agencies',
                    description: 'Manage many clients',
                    icon: 'lucide:users',
                    href: '/agencies'
                }
            ]
        },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Customers', href: '/customers' },
        { label: 'Blog', href: '/blog' }
    ]

    // ---- Real-world: documentation sidebar ----
    const docsNavItems: NavigationMenuItem[] = [
        { label: 'Get Started', type: 'label' },
        { label: 'Introduction', icon: 'lucide:book-open', href: '/docs/introduction' },
        { label: 'Installation', icon: 'lucide:download', href: '/docs/installation' },
        { label: 'Reference', type: 'label' },
        {
            label: 'Components',
            value: 'docs-components',
            icon: 'lucide:shapes',
            defaultOpen: true,
            children: [
                { label: 'Button', href: '/docs/button' },
                { label: 'Navigation Menu', href: '/navigation-menu', active: true },
                { label: 'Tree', href: '/docs/tree' },
                { label: 'Table', href: '/docs/table' }
            ]
        },
        {
            label: 'Composables',
            value: 'docs-composables',
            icon: 'lucide:function-square',
            children: [
                { label: 'useMediaQuery', href: '/docs/use-media-query' },
                { label: 'useClipboard', href: '/docs/use-clipboard' },
                { label: 'useFocusTrap', href: '/docs/use-focus-trap' }
            ]
        },
        {
            label: 'Theming',
            value: 'docs-theming',
            icon: 'lucide:palette',
            children: [
                { label: 'Colors', href: '/docs/colors' },
                { label: 'Dark mode', href: '/docs/dark-mode' }
            ]
        },
        { label: 'Changelog', icon: 'lucide:history', href: '/docs/changelog' }
    ]

    // ---- Real-world: dashboard rail ----
    const dashboardItems: NavigationMenuItem[][] = [
        [
            { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/app', active: true },
            { label: 'Inbox', icon: 'lucide:inbox', href: '/app/inbox', badge: 8 },
            {
                label: 'Projects',
                value: 'projects',
                icon: 'lucide:folder-kanban',
                children: [
                    {
                        label: 'Active',
                        description: '12 in progress',
                        icon: 'lucide:circle-play',
                        href: '/app/projects/active'
                    },
                    {
                        label: 'Archived',
                        description: 'Read-only history',
                        icon: 'lucide:archive',
                        href: '/app/projects/archived'
                    },
                    {
                        label: 'Templates',
                        description: 'Reusable blueprints',
                        icon: 'lucide:copy',
                        href: '/app/projects/templates'
                    }
                ]
            },
            { label: 'Calendar', icon: 'lucide:calendar', href: '/app/calendar' }
        ],
        [
            { label: 'Team', icon: 'lucide:users', href: '/app/team' },
            { label: 'Settings', icon: 'lucide:settings', href: '/app/settings' }
        ]
    ]

    let railCollapsed = $state(false)
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Navigation Menu</h1>

    <!-- Basic -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A horizontal navigation bar. Each item with an <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">href</code
            >
            renders a real
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">&lt;a&gt;</code
            >
            (crawlable for SEO); external links get an icon and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">rel</code> automatically.
        </p>
        <NavigationMenu items={simpleItems} />
    </section>

    <!-- Mega menu -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Dropdown / Mega Menu</h2>
        <p class="text-sm text-on-surface-variant">
            Items with <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >children</code
            > open a dropdown on hover or click. Children support icons and descriptions for a mega-menu
            layout. Keyboard, focus and dismissal are handled by the primitive.
        </p>
        <NavigationMenu items={megaItems} />
    </section>

    <!-- Variants -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">pill</code>
            (default) vs
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">link</code>.
        </p>
        <div class="space-y-3">
            <NavigationMenu items={simpleItems} variant="pill" />
            <NavigationMenu items={simpleItems} variant="link" highlight />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <div class="space-y-2">
            {#each colors as color (color)}
                <div class="flex items-center gap-4">
                    <span class="w-20 text-sm text-on-surface-variant">{color}</span>
                    <NavigationMenu items={simpleItems} {color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Badges -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Badges & Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Add a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >badge</code
            >
            (count or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >BadgeProps</code
            >) to an item; disabled items are non-interactive.
        </p>
        <NavigationMenu items={badgedItems} />
    </section>

    <!-- Groups -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Groups</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an array of arrays to render separated groups.
        </p>
        <NavigationMenu items={groupedItems} />
    </section>

    <!-- Vertical -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Vertical</h2>
        <p class="text-sm text-on-surface-variant">
            Vertical menus render a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">&lt;nav&gt;</code
            >
            landmark with inline expandable sections.
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="multiple"</code
            >
            (default) keeps several open;
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="single"</code
            > closes others.
        </p>
        <div class="grid max-w-3xl gap-6 sm:grid-cols-2">
            <div class="rounded-lg border border-outline-variant p-2">
                <NavigationMenu
                    items={verticalItems}
                    orientation="vertical"
                    bind:value={verticalValue}
                />
            </div>
            <div class="rounded-lg border border-outline-variant p-2">
                <NavigationMenu
                    items={verticalItems}
                    orientation="vertical"
                    type="single"
                    variant="link"
                />
            </div>
        </div>
    </section>

    <!-- Collapsed -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Collapsed Rail</h2>
        <p class="text-sm text-on-surface-variant">
            A vertical menu with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">collapsed</code
            >
            shows icons only; labels surface via
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">tooltip</code>.
        </p>
        <div class="w-14 rounded-lg border border-outline-variant p-2">
            <NavigationMenu items={collapsedItems} orientation="vertical" collapsed tooltip />
        </div>
    </section>

    <!-- Responsive drawer -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Responsive Drawer</h2>
        <p class="text-sm text-on-surface-variant">
            With <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >drawer</code
            >, the menu collapses into a toggle button + Drawer below
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >mobileBreakpoint</code
            > (default 768px). Resize the window to try it. It auto-closes on navigation.
        </p>
        <NavigationMenu items={megaItems} drawer />
    </section>

    <!-- Avatars & Chips -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Avatars & Status Chips</h2>
        <p class="text-sm text-on-surface-variant">
            Items accept an <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >avatar</code
            >
            (leading) and a
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">chip</code>
            status dot, useful for account or team switchers.
        </p>
        <NavigationMenu items={teamItems} variant="link" />
    </section>

    <!-- Custom content snippet -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Dropdown Content</h2>
        <p class="text-sm text-on-surface-variant">
            Replace a dropdown's body entirely with the <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemContent</code
            > snippet for a fully custom mega-menu (promos, grids, media).
        </p>
        <NavigationMenu items={featuredItems}>
            {#snippet itemContent({ item })}
                <div class="grid gap-4 p-4 sm:w-120 sm:grid-cols-2">
                    <Link
                        href="/get-started"
                        raw
                        class="flex flex-col justify-end gap-1 rounded-lg bg-primary p-4 text-on-primary"
                    >
                        <span class="text-base font-semibold">{item.label}</span>
                        <span class="text-xs opacity-90">Start building in minutes.</span>
                    </Link>
                    <div class="grid gap-1">
                        <Link
                            href="/templates"
                            raw
                            class="rounded-md px-3 py-2 text-sm hover:bg-surface-container-high"
                        >
                            <span class="font-medium text-on-surface">Templates</span>
                            <p class="text-xs text-on-surface-variant">
                                Production-ready starters.
                            </p>
                        </Link>
                        <Link
                            href="/integrations"
                            raw
                            class="rounded-md px-3 py-2 text-sm hover:bg-surface-container-high"
                        >
                            <span class="font-medium text-on-surface">Integrations</span>
                            <p class="text-xs text-on-surface-variant">Connect your tools.</p>
                        </Link>
                    </div>
                </div>
            {/snippet}
        </NavigationMenu>
    </section>

    <!-- List trailing + arrow -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">List Slots & Arrow</h2>
        <p class="text-sm text-on-surface-variant">
            Add content around the items with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">listLeading</code
            >
            /
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >listTrailing</code
            >, and point an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">arrow</code>
            at the open dropdown.
        </p>
        <div
            class="flex items-center justify-between gap-4 rounded-lg border border-outline-variant p-2"
        >
            <NavigationMenu items={ctaItems} variant="link" arrow>
                {#snippet listLeading()}
                    <li class="me-2 flex items-center gap-1.5 font-semibold text-on-surface">
                        <Avatar text="S5" size="2xs" />
                        <span>SV5UI</span>
                    </li>
                {/snippet}
                {#snippet listTrailing()}
                    <li class="ms-2 flex items-center gap-2">
                        <Button size="sm" variant="ghost">Sign in</Button>
                        <Button size="sm">Get started</Button>
                    </li>
                {/snippet}
            </NavigationMenu>
            <Badge label="v1" color="primary" variant="soft" />
        </div>
    </section>

    <!-- ==================== REAL-WORLD EXAMPLES ==================== -->
    <section class="space-y-4 border-t border-outline-variant pt-8">
        <h2 class="text-xl font-bold text-on-surface">Real-world Examples</h2>
        <p class="text-sm text-on-surface-variant">
            Complete compositions to sanity-check stability: a marketing header, a docs sidebar and
            a collapsible dashboard rail.
        </p>
    </section>

    <!-- SaaS marketing header -->
    <section class="space-y-3">
        <h3 class="text-base font-semibold text-on-surface">SaaS Marketing Header</h3>
        <div class="rounded-xl border border-outline-variant bg-surface-container-lowest">
            <header
                class="flex items-center gap-4 rounded-t-xl border-b border-outline-variant px-4 py-2.5"
            >
                <Link
                    href="/navigation-menu"
                    raw
                    class="flex shrink-0 items-center gap-2 font-bold text-on-surface"
                >
                    <span
                        class="grid size-7 place-items-center rounded-md bg-primary text-on-primary"
                    >
                        S5
                    </span>
                    <span class="hidden sm:inline">Acme</span>
                </Link>
                <NavigationMenu items={appNavItems} variant="link" class="hidden md:block" drawer />
                <div class="ms-auto flex items-center gap-2">
                    <Button size="sm" variant="ghost" class="hidden sm:inline-flex">Sign in</Button>
                    <Button size="sm">Get started</Button>
                </div>
            </header>
            <div class="grid place-items-center gap-2 px-4 py-14 text-center">
                <h4 class="text-2xl font-bold text-on-surface">Build faster with Acme</h4>
                <p class="max-w-md text-sm text-on-surface-variant">
                    Hover the nav items to open the mega-menus. Resize below 768px to collapse into
                    a drawer.
                </p>
            </div>
        </div>
    </section>

    <!-- Documentation layout -->
    <section class="space-y-3">
        <h3 class="text-base font-semibold text-on-surface">Documentation Sidebar</h3>
        <div
            class="flex overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest"
        >
            <aside class="w-60 shrink-0 border-e border-outline-variant p-3">
                <NavigationMenu items={docsNavItems} orientation="vertical" variant="link" />
            </aside>
            <div class="min-w-0 flex-1 space-y-3 p-6">
                <h4 class="text-xl font-bold text-on-surface">Navigation Menu</h4>
                <p class="text-sm text-on-surface-variant">
                    The active page is highlighted in the sidebar via <code
                        class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                        >active</code
                    >; sections expand inline and keep their scroll position.
                </p>
                <div class="h-24 rounded-lg bg-surface-container"></div>
                <div class="h-24 rounded-lg bg-surface-container"></div>
            </div>
        </div>
    </section>

    <!-- Dashboard rail -->
    <section class="space-y-3">
        <h3 class="text-base font-semibold text-on-surface">Dashboard Rail (collapsible)</h3>
        <div
            class="flex h-80 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest"
        >
            <aside
                class="flex shrink-0 flex-col border-e border-outline-variant p-2 transition-[width] duration-200"
                class:w-16={railCollapsed}
                class:w-52={!railCollapsed}
            >
                <div class="min-h-0 scrollbar-thin flex-1 overflow-y-auto">
                    <NavigationMenu
                        items={dashboardItems}
                        orientation="vertical"
                        collapsed={railCollapsed}
                        tooltip
                    />
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    color="surface"
                    class="mt-2 w-full shrink-0"
                    leadingIcon={railCollapsed
                        ? 'lucide:panel-left-open'
                        : 'lucide:panel-left-close'}
                    onclick={() => (railCollapsed = !railCollapsed)}
                >
                    {#if !railCollapsed}Collapse{/if}
                </Button>
            </aside>
            <div class="min-w-0 flex-1 p-6">
                <h4 class="text-lg font-bold text-on-surface">Good morning, Ada</h4>
                <p class="text-sm text-on-surface-variant">
                    Toggle the rail to collapse it to icons; labels then surface as tooltips on
                    hover. Badges (e.g. Inbox) stay hidden while collapsed.
                </p>
            </div>
        </div>
    </section>

    <p class="text-sm text-on-surface-variant">
        Keyboard and accessibility (roving focus, arrow keys, Escape, aria-current, real anchors)
        are provided by the underlying primitive. Future work: animated highlight indicator,
        submenus in mega-menu content.
    </p>
</div>
