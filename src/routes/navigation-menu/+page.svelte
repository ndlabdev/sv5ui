<script lang="ts">
    import { NavigationMenu, type NavigationMenuItem } from '$lib/index.js'

    // ==================== Basic Items ====================
    const basicItems: NavigationMenuItem[] = [
        { label: 'Home', icon: 'lucide:home', href: '/' },
        { label: 'Components', icon: 'lucide:layers', href: '/button' },
        { label: 'Documentation', icon: 'lucide:book-open', href: '/getting-started' },
        { label: 'GitHub', icon: 'lucide:github', href: 'https://github.com/ndlabdev/sv5ui' }
    ]

    // ==================== With Badges ====================
    const badgeItems: NavigationMenuItem[] = [
        { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/dashboard' },
        {
            label: 'Inbox',
            icon: 'lucide:inbox',
            href: '/inbox',
            badge: { label: '12', color: 'error' }
        },
        {
            label: 'Tasks',
            icon: 'lucide:check-square',
            href: '/tasks',
            badge: { label: 'New', color: 'success' }
        },
        { label: 'Settings', icon: 'lucide:settings', href: '/settings' }
    ]

    // ==================== Sidebar Items (with children) ====================
    const sidebarItems: NavigationMenuItem[] = [
        { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/' },
        {
            label: 'Components',
            icon: 'lucide:layers',
            defaultOpen: true,
            children: [
                { label: 'Button', href: '/button' },
                { label: 'Avatar', href: '/avatar' },
                { label: 'Badge', href: '/badge' },
                { label: 'Card', href: '/card' },
                { label: 'Table', href: '/table' }
            ]
        },
        { type: 'separator' },
        {
            label: 'Forms',
            icon: 'lucide:text-cursor-input',
            children: [
                { label: 'Input', href: '/input' },
                { label: 'Select', href: '/select' },
                { label: 'Checkbox', href: '/checkbox' },
                { label: 'Switch', href: '/switch' }
            ]
        },
        {
            label: 'Overlays',
            icon: 'lucide:square-stack',
            children: [
                { label: 'Modal', href: '/modal' },
                { label: 'Drawer', href: '/drawer' },
                { label: 'Tooltip', href: '/tooltip' }
            ]
        },
        { type: 'separator' },
        { label: 'Settings', icon: 'lucide:settings', href: '/settings' },
        { label: 'Help', icon: 'lucide:circle-help', href: '/help', disabled: true }
    ]

    // ==================== App Sidebar ====================
    const appSidebarItems: NavigationMenuItem[] = [
        { label: 'Overview', icon: 'lucide:home', href: '/' },
        {
            label: 'Analytics',
            icon: 'lucide:bar-chart-3',
            href: '/analytics',
            badge: { label: 'Beta', color: 'warning', variant: 'subtle' }
        },
        {
            label: 'Projects',
            icon: 'lucide:folder',
            children: [
                { label: 'Active', href: '/projects/active' },
                { label: 'Archived', href: '/projects/archived' },
                { label: 'Templates', href: '/projects/templates' }
            ]
        },
        {
            label: 'Team',
            icon: 'lucide:users',
            children: [
                { label: 'Members', href: '/team/members', icon: 'lucide:user' },
                { label: 'Invitations', href: '/team/invitations', icon: 'lucide:mail' },
                { label: 'Roles', href: '/team/roles', icon: 'lucide:shield' }
            ]
        },
        { type: 'separator' },
        { label: 'Settings', icon: 'lucide:settings', href: '/settings' },
        { label: 'Billing', icon: 'lucide:credit-card', href: '/billing' }
    ]

    let isCollapsed = $state(false)
</script>

<div class="space-y-16">
    <div>
        <h1 class="text-3xl font-bold text-on-surface">NavigationMenu</h1>
        <p class="mt-2 text-on-surface-variant">
            Accessible navigation with horizontal, vertical, collapsed modes.
        </p>
    </div>

    <!-- ==================== BASIC HORIZONTAL ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Horizontal</h2>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={basicItems} />
        </div>
    </section>

    <!-- ==================== VARIANTS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Variants</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Pill (default)</p>
                <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
                    <NavigationMenu items={basicItems} variant="pill" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Link</p>
                <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
                    <NavigationMenu items={basicItems} variant="link" />
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== COLORS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            {#each ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'] as color (color)}
                <div class="space-y-1">
                    <p class="text-xs font-medium text-on-surface-variant">{color}</p>
                    <div class="rounded-xl border border-outline-variant/50 bg-surface p-3">
                        <NavigationMenu items={basicItems.slice(0, 3)} color={color as 'primary'} />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- ==================== WITH BADGES ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Badges</h2>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={badgeItems} />
        </div>
    </section>

    <!-- ==================== VERTICAL SIDEBAR ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Vertical Sidebar</h2>
        <p class="text-sm text-on-surface-variant">
            With nested children (accordion-style expand).
        </p>
        <div class="max-w-64 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={sidebarItems} orientation="vertical" />
        </div>
    </section>

    <!-- ==================== VERTICAL LINK VARIANT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Vertical — Link Variant</h2>
        <div class="max-w-64 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={sidebarItems} orientation="vertical" variant="link" />
        </div>
    </section>

    <!-- ==================== COLLAPSED SIDEBAR ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Collapsed Sidebar</h2>
        <p class="text-sm text-on-surface-variant">
            Icon-only mode with tooltips. Click toggle to collapse/expand.
        </p>
        <div class="flex items-start gap-4">
            <button
                class="rounded-lg bg-primary px-3 py-1.5 text-sm text-on-primary"
                onclick={() => (isCollapsed = !isCollapsed)}
            >
                {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
        </div>
        <div
            class="rounded-xl border border-outline-variant/50 bg-surface p-3 transition-all duration-200 {isCollapsed
                ? 'w-16'
                : 'w-64'}"
        >
            <NavigationMenu
                items={appSidebarItems}
                orientation="vertical"
                collapsed={isCollapsed}
            />
        </div>
    </section>

    <!-- ==================== APP SIDEBAR EXAMPLE ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">App Sidebar</h2>
        <p class="text-sm text-on-surface-variant">
            Full example with icons, badges, children, and separators.
        </p>
        <div class="max-w-64 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={appSidebarItems} orientation="vertical" color="primary" />
        </div>
    </section>

    <!-- ==================== DISABLED ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled</h2>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={basicItems} disabled />
        </div>
    </section>

    <!-- ==================== CUSTOM UI ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom UI Overrides</h2>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu
                items={basicItems}
                ui={{
                    list: 'gap-2',
                    link: 'rounded-full px-4'
                }}
            />
        </div>
    </section>
</div>
