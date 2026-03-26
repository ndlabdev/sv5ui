<script lang="ts">
    import { Breadcrumb, Icon, Link, Separator } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Breadcrumb</h1>
        <p class="text-on-surface-variant">
            Display a hierarchy of navigation links to show the user's current location within a
            site.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Laptops', href: '/products/laptops' },
                    { label: 'MacBook Pro' }
                ]}
            />
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/', icon: 'lucide:home' },
                    { label: 'Settings', href: '/settings', icon: 'lucide:settings' },
                    { label: 'Profile', icon: 'lucide:user' }
                ]}
            />
        </div>
    </section>

    <!-- Separator Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Separator Icon</h2>
        <p class="text-sm text-on-surface-variant">
            Customize the separator between items via the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >separatorIcon</code
            > prop.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            {#each [
                { icon: 'lucide:chevron-right', name: 'Chevron (default)' },
                { icon: 'lucide:slash', name: 'Slash' },
                { icon: 'lucide:arrow-right', name: 'Arrow' },
                { icon: 'lucide:dot', name: 'Dot' }
            ] as sep (sep.icon)}
                <div class="space-y-1 rounded-lg bg-surface-container-high p-4">
                    <p class="text-xs font-medium text-on-surface-variant">{sep.name}</p>
                    <Breadcrumb
                        separatorIcon={sep.icon}
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Docs', href: '/docs' },
                            { label: 'API' }
                        ]}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Separator Snippet -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Separator Snippet</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">separator</code
            > snippet for fully custom separator content.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Category', href: '/category' },
                    { label: 'Current Page' }
                ]}
            >
                {#snippet separator()}
                    <span class="text-sm text-on-surface-variant/40">/</span>
                {/snippet}
            </Breadcrumb>
        </div>
    </section>

    <!-- Disabled Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled Items</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Archived', href: '/archived', disabled: true },
                    { label: 'Old Post', href: '/archived/old-post', disabled: true },
                    { label: 'Detail' }
                ]}
            />
        </div>
    </section>

    <!-- Custom Item Snippet -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Item Snippet</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">item</code>
            snippet for fully custom item rendering.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/', icon: 'lucide:home' },
                    { label: 'Projects', href: '/projects', icon: 'lucide:folder' },
                    { label: 'sv5ui', icon: 'lucide:package' }
                ]}
            >
                {#snippet item({ item: crumb, active })}
                    {#if active}
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
                        >
                            {#if crumb.icon}
                                <Icon name={crumb.icon} size="14" />
                            {/if}
                            {crumb.label}
                        </span>
                    {:else}
                        <Link
                            href={crumb.href ?? ''}
                            raw
                            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest"
                        >
                            {#if crumb.icon}
                                <Icon name={crumb.icon} size="14" />
                            {/if}
                            {crumb.label}
                        </Link>
                    {/if}
                {/snippet}
            </Breadcrumb>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom active color</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        ui={{ link: 'text-on-surface font-semibold' }}
                        items={[
                            { label: 'Dashboard', href: '/' },
                            { label: 'Analytics', href: '/analytics' },
                            { label: 'Revenue' }
                        ]}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Larger separator</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        ui={{ separatorIcon: 'size-6 text-primary/40' }}
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Blog', href: '/blog' },
                            { label: 'Latest Post' }
                        ]}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With background container</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        ui={{ root: 'bg-surface-container rounded-lg px-4 py-2' }}
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Shop', href: '/shop' },
                            { label: 'Electronics', href: '/shop/electronics' },
                            { label: 'Phones' }
                        ]}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Wider gap</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        ui={{ list: 'gap-3' }}
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Team', href: '/team' },
                            { label: 'Members' }
                        ]}
                    />
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <!-- File Browser -->
            <div class="space-y-2">
                <p class="text-sm font-medium">File Browser</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        items={[
                            { label: 'Root', href: '/', icon: 'lucide:hard-drive' },
                            { label: 'Users', href: '/users', icon: 'lucide:users' },
                            { label: 'Documents', href: '/documents', icon: 'lucide:folder' },
                            { label: 'README.md', icon: 'lucide:file-text' }
                        ]}
                    />
                </div>
            </div>

            <!-- E-commerce -->
            <div class="space-y-2">
                <p class="text-sm font-medium">E-commerce</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        items={[
                            { label: 'Store', href: '/' },
                            { label: 'Electronics', href: '/electronics' },
                            { label: 'Laptops', href: '/electronics/laptops' },
                            { label: 'ASUS ROG Strix' }
                        ]}
                    />
                </div>
            </div>

            <!-- Admin Dashboard -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Admin Dashboard</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        ui={{ root: 'bg-surface-container rounded-lg px-4 py-2.5' }}
                        items={[
                            { label: 'Admin', href: '/admin', icon: 'lucide:shield' },
                            { label: 'Users', href: '/admin/users', icon: 'lucide:users' },
                            { label: 'Permissions', icon: 'lucide:lock' }
                        ]}
                    />
                </div>
            </div>

            <!-- Documentation -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Documentation</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Breadcrumb
                        separatorIcon="lucide:slash"
                        items={[
                            { label: 'Docs', href: '/docs', icon: 'lucide:book-open' },
                            { label: 'Components', href: '/docs/components' },
                            { label: 'Breadcrumb' }
                        ]}
                    />
                </div>
            </div>
        </div>
    </section>
</div>
