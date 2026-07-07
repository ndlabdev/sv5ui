<script lang="ts">
    import { Header, Button, Link } from '$lib/index.js'
    import type { HeaderMode } from '$lib/index.js'

    const modes: HeaderMode[] = ['modal', 'slideover', 'drawer']

    const navLinks = [
        { label: 'Docs', href: '/getting-started' },
        { label: 'Components', href: '/button' },
        { label: 'Colors', href: '/colors' }
    ]
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Header</h1>
        <p class="text-on-surface-variant">
            A responsive app header sized by the --ui-header-height variable, with title, nav and
            action areas plus a mobile menu that composes Modal, Slideover or Drawer. Demos below
            use class="static" to sit inside the page flow.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Resize below the lg breakpoint to see the toggle button and mobile menu.
        </p>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Header title="SV5UI" class="static">
                {#each navLinks as link (link.href)}
                    <Link href={link.href} class="px-3 py-2 text-sm font-medium">
                        {link.label}
                    </Link>
                {/each}

                {#snippet right()}
                    <Button size="sm" variant="ghost" color="secondary" icon="lucide:github" />
                    <Button size="sm" label="Sign in" />
                {/snippet}

                {#snippet body()}
                    <div class="flex flex-col gap-1">
                        {#each navLinks as link (link.href)}
                            <Link href={link.href} class="rounded-md px-3 py-2 text-sm font-medium">
                                {link.label}
                            </Link>
                        {/each}
                    </div>
                {/snippet}
            </Header>
            <div class="bg-surface-container-low p-6 text-sm text-on-surface-variant">
                Page content sits below; Main subtracts the same variable the header consumes.
            </div>
        </div>
    </section>

    <!-- Menu modes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Mobile menu modes</h2>
        <div class="space-y-4">
            {#each modes as mode (mode)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant capitalize">{mode}</p>
                    <div class="overflow-hidden rounded-lg ring ring-outline-variant">
                        <Header title="SV5UI" {mode} class="static" ui={{ toggle: 'lg:flex' }}>
                            {#snippet body()}
                                <div class="flex flex-col gap-1">
                                    {#each navLinks as link (link.href)}
                                        <Link
                                            href={link.href}
                                            class="rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    {/each}
                                </div>
                            {/snippet}
                        </Header>
                    </div>
                </div>
            {/each}
        </div>
        <p class="text-sm text-on-surface-variant">
            The toggle is normally hidden on lg+; these demos force it visible with ui.toggle so
            each mode can be tried on desktop.
        </p>
    </section>

    <!-- Toggle side -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Toggle side</h2>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Header
                title="SV5UI"
                toggleSide="left"
                class="static"
                ui={{ toggle: 'lg:flex' }}
                body={leftToggleBody}
            />
        </div>
    </section>

    <!-- Custom title -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom title and areas</h2>
        <div class="overflow-hidden rounded-lg ring ring-outline-variant">
            <Header class="static">
                {#snippet titleSlot()}
                    <Link href="/" raw class="flex items-center gap-2 text-xl font-bold">
                        <span
                            class="flex size-7 items-center justify-center rounded-md bg-primary text-sm text-on-primary"
                        >
                            S5
                        </span>
                        SV5UI
                    </Link>
                {/snippet}

                {#snippet left()}
                    <span
                        class="rounded-full bg-surface-container-highest px-2 py-0.5 text-xs font-medium"
                    >
                        v2.2
                    </span>
                {/snippet}

                {#snippet right()}
                    <Button size="sm" variant="outline" color="secondary" label="Feedback" />
                {/snippet}
            </Header>
        </div>
    </section>
</div>

{#snippet leftToggleBody()}
    <div class="flex flex-col gap-1">
        {#each navLinks as link (link.href)}
            <Link href={link.href} class="rounded-md px-3 py-2 text-sm font-medium">
                {link.label}
            </Link>
        {/each}
    </div>
{/snippet}
