<script lang="ts">
    import {
        NavigationMenu,
        Button,
        type NavigationMenuItem,
        type NavigationMenuSlotProps
    } from '$lib/index.js'

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

    // ==================== With Avatars ====================
    const avatarItems: NavigationMenuItem[] = [
        {
            label: 'Alice Johnson',
            avatar: { src: 'https://i.pravatar.cc/150?u=alice', alt: 'Alice' },
            href: '/users/alice'
        },
        {
            label: 'Bob Smith',
            avatar: { src: 'https://i.pravatar.cc/150?u=bob', alt: 'Bob' },
            href: '/users/bob'
        },
        {
            label: 'Charlie Brown',
            avatar: { src: 'https://i.pravatar.cc/150?u=charlie', alt: 'Charlie' },
            href: '/users/charlie',
            badge: { label: 'Admin', color: 'primary' }
        }
    ]

    // ==================== Per-item disabled ====================
    const mixedDisabledItems: NavigationMenuItem[] = [
        { label: 'Published', icon: 'lucide:globe', href: '/published' },
        { label: 'Draft', icon: 'lucide:file-edit', href: '/draft' },
        { label: 'Scheduled', icon: 'lucide:clock', href: '/scheduled', disabled: true },
        { label: 'Archived', icon: 'lucide:archive', href: '/archived', disabled: true }
    ]

    // ==================== Children with descriptions ====================
    const childrenDescItems: NavigationMenuItem[] = [
        { label: 'Dashboard', icon: 'lucide:layout-dashboard', href: '/' },
        {
            label: 'Products',
            icon: 'lucide:package',
            defaultOpen: true,
            children: [
                {
                    label: 'All Products',
                    href: '/products',
                    icon: 'lucide:list',
                    description: 'View and manage all products'
                },
                {
                    label: 'Categories',
                    href: '/products/categories',
                    icon: 'lucide:tag',
                    description: 'Organize products by category'
                },
                {
                    label: 'Inventory',
                    href: '/products/inventory',
                    icon: 'lucide:warehouse',
                    description: 'Track stock levels'
                },
                { type: 'separator' },
                {
                    label: 'Add Product',
                    href: '/products/new',
                    icon: 'lucide:plus-circle',
                    description: 'Create a new product listing'
                }
            ]
        },
        {
            label: 'Orders',
            icon: 'lucide:shopping-cart',
            children: [
                { label: 'All Orders', href: '/orders', icon: 'lucide:list-ordered' },
                { label: 'Returns', href: '/orders/returns', icon: 'lucide:undo-2' }
            ]
        }
    ]

    // ==================== Sidebar Items ====================
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
        <p class="text-sm text-on-surface-variant">
            Items can have badges with different colors and variants.
        </p>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={badgeItems} />
        </div>
    </section>

    <!-- ==================== WITH AVATARS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Avatars</h2>
        <p class="text-sm text-on-surface-variant">
            Avatar takes precedence over icon when both are provided.
        </p>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={avatarItems} />
        </div>
    </section>

    <!-- ==================== PER-ITEM DISABLED ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Per-Item Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Individual items can be disabled while others remain interactive.
        </p>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={mixedDisabledItems} />
        </div>
    </section>

    <!-- ==================== NO HIGHLIGHT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">No Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >highlight=false</code
            > to disable active state styling.
        </p>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={basicItems} highlight={false} />
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

    <!-- ==================== CHILDREN WITH DESCRIPTIONS ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Children with Icons & Descriptions</h2>
        <p class="text-sm text-on-surface-variant">
            Child items can have icons, descriptions, and separators.
        </p>
        <div class="max-w-72 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={childrenDescItems} orientation="vertical" />
        </div>
    </section>

    <!-- ==================== COLLAPSED SIDEBAR ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Collapsed Sidebar</h2>
        <p class="text-sm text-on-surface-variant">
            Icon-only mode with tooltips. Click toggle to collapse/expand.
        </p>
        <Button
            size="sm"
            variant="outline"
            color="surface"
            icon={isCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'}
            label={isCollapsed ? 'Expand' : 'Collapse'}
            onclick={() => (isCollapsed = !isCollapsed)}
        />
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

    <!-- ==================== CUSTOM LEADING SNIPPET ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Leading Snippet</h2>
        <p class="text-sm text-on-surface-variant">
            Replace the default icon/avatar with custom content via the <code
                class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs">leading</code
            > snippet.
        </p>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={basicItems}>
                {#snippet leading(props: NavigationMenuSlotProps)}
                    <span
                        class="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                    >
                        {props.item.label?.charAt(0)}
                    </span>
                {/snippet}
            </NavigationMenu>
        </div>
    </section>

    <!-- ==================== CUSTOM TRAILING SNIPPET ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Trailing Snippet</h2>
        <p class="text-sm text-on-surface-variant">
            Add custom trailing content via the <code
                class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs">trailing</code
            > snippet.
        </p>
        <div class="max-w-64 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={badgeItems} orientation="vertical">
                {#snippet trailing(props: NavigationMenuSlotProps)}
                    {#if props.item.badge}
                        <span
                            class="ms-auto flex size-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error"
                        >
                            {props.item.badge.label}
                        </span>
                    {/if}
                {/snippet}
            </NavigationMenu>
        </div>
    </section>

    <!-- ==================== APP SIDEBAR EXAMPLE ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">App Sidebar</h2>
        <p class="text-sm text-on-surface-variant">
            Full example with icons, badges, children, and separators.
        </p>
        <div class="max-w-64 rounded-xl border border-outline-variant/50 bg-surface p-3">
            <NavigationMenu items={appSidebarItems} orientation="vertical" />
        </div>
    </section>

    <!-- ==================== FULL APP LAYOUT ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Full App Layout</h2>
        <p class="text-sm text-on-surface-variant">
            Horizontal top nav + vertical sidebar combined.
        </p>
        <div class="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface">
            <!-- Top nav -->
            <div class="border-b border-outline-variant/30 px-4 py-2">
                <NavigationMenu
                    items={[
                        { label: 'SV5UI', icon: 'lucide:hexagon', href: '/' },
                        { label: 'Docs', href: '/getting-started' },
                        { label: 'Components', href: '/button' },
                        { label: 'Blog', href: '/blog' }
                    ]}
                    variant="link"
                    color="primary"
                />
            </div>
            <!-- Body with sidebar -->
            <div class="flex">
                <div class="w-56 shrink-0 border-r border-outline-variant/30 p-3">
                    <NavigationMenu
                        items={[
                            {
                                label: 'Getting Started',
                                icon: 'lucide:rocket',
                                href: '/getting-started'
                            },
                            {
                                label: 'Installation',
                                icon: 'lucide:download',
                                href: '/installation'
                            },
                            { type: 'separator' },
                            {
                                label: 'Components',
                                icon: 'lucide:layers',
                                defaultOpen: true,
                                children: [
                                    { label: 'Button', href: '/button' },
                                    { label: 'Input', href: '/input' },
                                    { label: 'Table', href: '/table' }
                                ]
                            }
                        ]}
                        orientation="vertical"
                        variant="link"
                        color="primary"
                    />
                </div>
                <div class="flex-1 p-6">
                    <p class="text-sm text-on-surface-variant">Page content here...</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== DISABLED ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled (all)</h2>
        <div class="rounded-xl border border-outline-variant/50 bg-surface p-4">
            <NavigationMenu items={basicItems} disabled />
        </div>
    </section>

    <!-- ==================== CUSTOM UI ==================== -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs"
                >ui</code
            > prop to override slot classes.
        </p>
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
