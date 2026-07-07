<script lang="ts">
    import {
        Footer,
        FooterColumns,
        Button,
        Input,
        Link,
        Separator,
        ThemeModeButton
    } from '$lib/index.js'
    import type { FooterColumn } from '$lib/index.js'

    const columns: FooterColumn[] = [
        {
            label: 'Product',
            children: [
                { label: 'Components', href: '/button' },
                { label: 'Hooks', href: '/use-debounce' },
                { label: 'Theming', href: '/customization' },
                { label: 'Colors', href: '/colors' }
            ]
        },
        {
            label: 'Resources',
            children: [
                { label: 'Getting Started', href: '/getting-started' },
                {
                    label: 'Releases',
                    href: 'https://github.com/ndlabdev/sv5ui/releases',
                    target: '_blank'
                },
                {
                    label: 'Issues',
                    href: 'https://github.com/ndlabdev/sv5ui/issues',
                    target: '_blank'
                }
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
                    label: 'Discussions',
                    href: 'https://github.com/ndlabdev/sv5ui/discussions',
                    target: '_blank'
                },
                { label: 'Contribute', href: '/getting-started' }
            ]
        }
    ]

    const navLinks = [
        { label: 'Docs', href: '/getting-started' },
        { label: 'Components', href: '/button' },
        { label: 'Colors', href: '/colors' }
    ]

    const socials = [
        { icon: 'lucide:github', label: 'GitHub' },
        { icon: 'lucide:twitter', label: 'X' },
        { icon: 'lucide:youtube', label: 'YouTube' }
    ]
</script>

<div class="space-y-10">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Footer</h1>
        <p class="text-on-surface-variant">
            App shell footer with top, left, center, right and bottom areas. FooterColumns renders
            link-group grids with an optional side section, designed for the top slot.
        </p>
    </div>

    <!-- Complete example -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Complete example</h2>
        <p class="text-sm text-on-surface-variant">
            FooterColumns with a newsletter block in the top slot, copyright on the left, social
            actions on the right, and a legal bottom row.
        </p>
        <div class="overflow-hidden rounded-xl bg-surface ring ring-outline-variant">
            <div class="flex h-28 items-center justify-center text-sm text-on-surface-variant/50">
                Page content
            </div>
            <Separator icon="lucide:sparkles" type="dashed" />
            <Footer class="border-t-0">
                {#snippet top()}
                    <FooterColumns {columns} aria-label="Footer navigation">
                        {#snippet right()}
                            <div>
                                <p class="text-sm font-semibold text-on-surface">Stay up to date</p>
                                <p class="mt-1 text-sm text-on-surface-variant">
                                    New components and release notes, once a month.
                                </p>
                                <form
                                    class="mt-4 flex items-center gap-2"
                                    onsubmit={(e) => e.preventDefault()}
                                >
                                    <Input
                                        type="email"
                                        placeholder="you@email.com"
                                        size="sm"
                                        class="flex-1"
                                        aria-label="Email address"
                                    />
                                    <Button size="sm" type="submit" label="Subscribe" />
                                </form>
                            </div>
                        {/snippet}
                    </FooterColumns>
                {/snippet}

                {#snippet left()}
                    <span>Copyright 2026 SV5UI. All rights reserved.</span>
                {/snippet}

                {#snippet right()}
                    {#each socials as social (social.label)}
                        <Button
                            size="sm"
                            variant="ghost"
                            color="secondary"
                            icon={social.icon}
                            aria-label={social.label}
                        />
                    {/each}
                {/snippet}

                {#snippet bottom()}
                    <div class="flex items-center justify-center gap-4">
                        <Link href="/getting-started" class="text-xs">Privacy Policy</Link>
                        <Separator orientation="vertical" class="h-3" />
                        <Link href="/getting-started" class="text-xs">Terms of Service</Link>
                        <Separator orientation="vertical" class="h-3" />
                        <Link href="/getting-started" class="text-xs">Cookies</Link>
                    </div>
                {/snippet}
            </Footer>
        </div>
    </section>

    <!-- Single row -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Single row</h2>
        <p class="text-sm text-on-surface-variant">
            The minimal footer: copyright, centered navigation, and actions. Areas stack on small
            screens.
        </p>
        <div class="overflow-hidden rounded-xl bg-surface ring ring-outline-variant">
            <Footer>
                {#snippet left()}
                    <span>Copyright 2026 SV5UI.</span>
                {/snippet}

                {#each navLinks as link (link.href)}
                    <Link href={link.href} class="px-2 text-sm">{link.label}</Link>
                {/each}

                {#snippet right()}
                    <Button
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        icon="lucide:github"
                        aria-label="GitHub"
                    />
                    <ThemeModeButton size="sm" />
                {/snippet}
            </Footer>
        </div>
    </section>

    <!-- Columns standalone -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FooterColumns</h2>
        <p class="text-sm text-on-surface-variant">
            Standalone link-group grid. Columns share the row equally on large screens; links are
            route-aware and external links get an indicator.
        </p>
        <div class="rounded-xl bg-surface p-8 ring ring-outline-variant">
            <FooterColumns {columns} aria-label="Footer navigation" />
        </div>
    </section>
</div>
