<script lang="ts">
    import { Footer, FooterColumns, Button, Link, Separator } from '$lib/index.js'
    import type { FooterColumn } from '$lib/index.js'

    const columns: FooterColumn[] = [
        {
            label: 'Components',
            children: [
                { label: 'Button', href: '/button' },
                { label: 'Header', href: '/header' },
                { label: 'Main', href: '/main' },
                { label: 'Error', href: '/error' }
            ]
        },
        {
            label: 'Docs',
            children: [
                { label: 'Getting Started', href: '/getting-started' },
                { label: 'Customization', href: '/customization' },
                { label: 'Colors', href: '/colors' }
            ]
        },
        {
            label: 'Community',
            children: [
                {
                    label: 'GitHub',
                    href: 'https://github.com/ndlabdev/sv5ui',
                    target: '_blank',
                    icon: 'lucide:github'
                },
                {
                    label: 'Releases',
                    href: 'https://github.com/ndlabdev/sv5ui/releases',
                    target: '_blank'
                }
            ]
        }
    ]

    const navLinks = [
        { label: 'Docs', href: '/getting-started' },
        { label: 'Components', href: '/button' },
        { label: 'Colors', href: '/colors' }
    ]
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Footer</h1>
        <p class="text-on-surface-variant">
            App shell footer with left, center and right areas that stack on mobile, plus top and
            bottom rows. FooterColumns renders link-group grids, designed for the top slot.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Footer>
                {#snippet left()}
                    <span>Copyright 2026. All rights reserved.</span>
                {/snippet}

                {#each navLinks as link (link.href)}
                    <Link href={link.href} class="px-2 text-sm">{link.label}</Link>
                {/each}

                {#snippet right()}
                    <Button size="sm" variant="ghost" color="secondary" icon="lucide:github" />
                    <Button size="sm" variant="ghost" color="secondary" icon="lucide:twitter" />
                {/snippet}
            </Footer>
        </div>
    </section>

    <!-- With FooterColumns -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With FooterColumns</h2>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Footer>
                {#snippet top()}
                    <FooterColumns {columns} aria-label="Footer navigation" />
                {/snippet}

                {#snippet left()}
                    <span>Copyright 2026 SV5UI.</span>
                {/snippet}

                {#snippet right()}
                    <Button size="sm" variant="ghost" color="secondary" icon="lucide:github" />
                {/snippet}
            </Footer>
        </div>
    </section>

    <!-- Bottom row -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Bottom row</h2>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Footer>
                {#snippet left()}
                    <span>Copyright 2026 SV5UI.</span>
                {/snippet}

                {#snippet bottom()}
                    <div class="flex items-center justify-center gap-4">
                        <Link href="/getting-started" class="text-xs">Privacy</Link>
                        <Separator orientation="vertical" class="h-3" />
                        <Link href="/getting-started" class="text-xs">Terms</Link>
                    </div>
                {/snippet}
            </Footer>
        </div>
    </section>

    <!-- Columns with snippet overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FooterColumns snippet overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-6">
            <FooterColumns {columns}>
                {#snippet columnLabel({ column })}
                    <p class="text-sm font-bold tracking-wide text-primary uppercase">
                        {column.label}
                    </p>
                {/snippet}
            </FooterColumns>
        </div>
    </section>
</div>
