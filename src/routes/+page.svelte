<script lang="ts">
    import { Button, Icon, Card, Link } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-3xl font-bold">SV5UI</h1>
        <p class="text-lg text-on-surface-variant">
            A modern Svelte 5 UI component library built with Tailwind CSS v4 and Material Design 3
            color tokens.
        </p>
    </div>

    <div class="flex flex-wrap gap-3">
        <Button
            variant="solid"
            color="primary"
            leadingIcon="lucide:rocket"
            label="Getting Started"
            href="/getting-started"
        />
        <Button
            variant="outline"
            color="secondary"
            leadingIcon="lucide:github"
            label="GitHub"
            href="https://github.com"
        />
    </div>

    <!-- Features -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:palette" size="32" class="text-primary" />
                <h3 class="font-semibold">Material Design 3</h3>
                <p class="text-sm text-on-surface-variant">
                    Color tokens and theming inspired by MD3 with full dark mode support.
                </p>
            </div>
        </Card>

        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:component" size="32" class="text-secondary" />
                <h3 class="font-semibold">Svelte 5 Runes</h3>
                <p class="text-sm text-on-surface-variant">
                    Built with Svelte 5 runes, snippets, and modern reactivity primitives.
                </p>
            </div>
        </Card>

        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:paintbrush" size="32" class="text-tertiary" />
                <h3 class="font-semibold">Tailwind CSS v4</h3>
                <p class="text-sm text-on-surface-variant">
                    Styled with Tailwind v4 and fully customizable via variants and ui props.
                </p>
            </div>
        </Card>

        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:settings" size="32" class="text-success" />
                <h3 class="font-semibold">Configurable</h3>
                <p class="text-sm text-on-surface-variant">
                    Global configuration system for changing default props across all components.
                </p>
            </div>
        </Card>

        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:shapes" size="32" class="text-warning" />
                <h3 class="font-semibold">Iconify Icons</h3>
                <p class="text-sm text-on-surface-variant">
                    Access thousands of icons from any Iconify collection out of the box.
                </p>
            </div>
        </Card>

        <Card variant="soft">
            <div class="flex flex-col items-center gap-3 text-center">
                <Icon name="lucide:code" size="32" class="text-info" />
                <h3 class="font-semibold">TypeScript</h3>
                <p class="text-sm text-on-surface-variant">
                    Full TypeScript support with exported types for all component props.
                </p>
            </div>
        </Card>
    </div>

    <!-- Components Overview -->
    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Components</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each [{ name: 'Icon', desc: 'Iconify-powered icon component', href: '/icon', icon: 'lucide:shapes' }, { name: 'Avatar', desc: 'User profile images with fallbacks', href: '/avatar', icon: 'lucide:circle-user' }, { name: 'Avatar Group', desc: 'Stacked overlapping avatars', href: '/avatar-group', icon: 'lucide:users' }, { name: 'Alert', desc: 'Callout and notification component', href: '/alert', icon: 'lucide:bell' }, { name: 'Card', desc: 'Content container with slots', href: '/card', icon: 'lucide:square' }, { name: 'Link', desc: 'Navigation with active detection', href: '/link', icon: 'lucide:link' }, { name: 'Button', desc: 'Versatile button with variants', href: '/button', icon: 'lucide:mouse-pointer-click' }] as item (item.href)}
                <Link
                    href={item.href}
                    raw
                    class="group flex items-center gap-3 rounded-lg border border-outline-variant p-4 transition-colors hover:bg-surface-container-high"
                >
                    <Icon name={item.icon} size="24" class="text-primary" />
                    <div>
                        <p class="font-medium group-hover:text-primary">{item.name}</p>
                        <p class="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                </Link>
            {/each}
        </div>
    </div>
</div>
