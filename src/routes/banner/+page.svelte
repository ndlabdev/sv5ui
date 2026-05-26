<script lang="ts">
    import { Banner, Button, Icon, Separator, Badge } from '$lib/index.js'

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

    let dismissibleOpen = $state(true)
    let persistedOpen = $state(true)
    let onCloseFired = $state(0)

    function resetPersistedBanner() {
        localStorage.removeItem('sv5ui-banner-demo-persisted')
        persistedOpen = true
    }

    const prehydrationRecipe = [
        '<' + 'script>',
        '  try {',
        "    var v = localStorage.getItem('sv5ui-banner-your-id')",
        "    if (v === '1') document.documentElement.dataset.bannerHidden = 'your-id'",
        '  } catch {}',
        '<' + '/script>',
        '<' + 'style>',
        '  [data-banner-hidden="your-id"] [data-banner-id="your-id"] { display: none }',
        '<' + '/style>'
    ].join('\n')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Banner</h1>
        <p class="text-on-surface-variant">
            Full-width announcement bar typically rendered at the top of a page or layout. Supports
            optional <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >localStorage</code
            >
            persistence — once dismissed by a given
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">id</code>, the
            banner stays hidden across reloads.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <Banner title="Welcome to SV5UI — a Svelte 5 component library." />
    </section>

    <!-- With icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icon</h2>
        <Banner icon="lucide:megaphone" title="New features available — check the changelog!" />
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">All 8 design-token colors are supported.</p>
        <div class="space-y-2">
            {#each colors as color (color)}
                <Banner {color} icon="lucide:info" title={`Color: ${color}`} />
            {/each}
        </div>
    </section>

    <!-- With actions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Actions</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >actions</code
            >
            array of
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >ButtonProps</code
            >. Banner applies
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size="xs"</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >color="surface"</code
            >
            as defaults — override any prop (variant, color, icon, to, etc.) per item.
        </p>
        <div class="space-y-3">
            <Banner
                color="primary"
                icon="lucide:sparkles"
                title="Update available — new features in v1.8.0!"
                actions={[
                    { label: 'Learn more', variant: 'outline' },
                    { label: 'Update now', trailingIcon: 'lucide:arrow-right' }
                ]}
            />
            <Banner
                color="warning"
                icon="lucide:cookie"
                title="We use cookies to improve your experience."
                actions={[
                    { label: 'Accept', leadingIcon: 'lucide:check', variant: 'outline' },
                    { label: 'Reject', variant: 'outline' }
                ]}
            />
        </div>
    </section>

    <!-- Dismissible (session-only) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Dismissible (session-only)</h2>
        <p class="text-sm text-on-surface-variant">
            Without an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">id</code>, the
            banner is hidden only for this page session. Reload to bring it back.
        </p>
        <Banner
            bind:open={dismissibleOpen}
            color="info"
            icon="lucide:bell"
            title="Tap the × to dismiss for this session"
            close
            onClose={() => onCloseFired++}
        />
        <div class="flex flex-wrap items-center gap-2">
            <Button
                size="xs"
                variant="outline"
                label="Show again"
                disabled={dismissibleOpen}
                onclick={() => (dismissibleOpen = true)}
            />
            <span class="text-xs text-on-surface-variant">
                onClose fired: <Badge size="xs" variant="soft" label={String(onCloseFired)} />
            </span>
        </div>
    </section>

    <!-- Persistent (localStorage) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Persistent (localStorage)</h2>
        <p class="text-sm text-on-surface-variant">
            Set an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">id</code> to
            persist the dismissal across reloads. Storage key:
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >sv5ui-banner-demo-persisted</code
            >.
        </p>
        <Banner
            bind:open={persistedOpen}
            id="demo-persisted"
            color="success"
            icon="lucide:save"
            title="Dismiss me, reload the page — I won't come back until you reset."
            close
        />
        <div class="flex flex-wrap items-center gap-2">
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:rotate-ccw"
                label="Reset dismissal"
                onclick={resetPersistedBanner}
            />
        </div>
    </section>

    <!-- Clickable -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Clickable</h2>
        <p class="text-sm text-on-surface-variant">
            Provide a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >to</code
            > prop to make the entire banner a link. Hover styles are applied automatically. The close
            button (if present) stops propagation so it dismisses without navigating.
        </p>
        <Banner
            color="primary"
            icon="lucide:rocket"
            title="Read the v1.7.0 release notes →"
            to="https://github.com/ndlabdev/sv5ui/blob/main/CHANGELOG.md"
            target="_blank"
            close
        />
    </section>

    <Separator />

    <!-- Custom snippets -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Snippets</h2>
        <p class="text-sm text-on-surface-variant">
            Override <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >leading</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">titleSlot</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >actionsSlot</code
            >, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">closeSlot</code
            >
            for full control.
        </p>

        <div class="space-y-3">
            <Banner color="info">
                {#snippet leading()}
                    <span
                        class="flex size-6 items-center justify-center rounded-full bg-info-container"
                    >
                        <Icon name="lucide:sparkles" class="size-4 text-info" />
                    </span>
                {/snippet}
                {#snippet titleSlot()}
                    <span class="text-sm text-on-info">
                        <strong class="font-semibold">New:</strong> Custom indicator + snippet wrapping
                    </span>
                {/snippet}
            </Banner>

            <Banner color="warning" icon="lucide:wrench" title="Custom actions">
                {#snippet actionsSlot()}
                    <div class="ms-2 flex items-center gap-2">
                        <Badge size="xs" color="warning" variant="solid" label="BETA" />
                        <Button size="xs" variant="solid" color="warning" label="Try it" />
                    </div>
                {/snippet}
            </Banner>
        </div>
    </section>

    <!-- UI overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Override slot classes via the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code> prop,
            or stick the banner to viewport top via
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">class</code>.
        </p>
        <Banner
            color="surface"
            icon="lucide:settings"
            title="Taller container + rounded corners"
            ui={{ container: 'min-h-14', root: 'rounded-lg' }}
        />
    </section>

    <Separator />

    <!-- SSR note -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">SSR &amp; hydration notes</h2>
        <div class="rounded-lg border border-outline-variant bg-surface-container p-4 text-sm">
            <p class="mb-2 font-medium">
                When using <code class="text-xs">id</code> for persistence:
            </p>
            <ul class="ms-5 list-disc space-y-1 text-on-surface-variant">
                <li>
                    The banner renders server-side. On the client, a
                    <code class="rounded bg-surface-container-highest px-1 py-0.5 text-xs"
                        >$effect</code
                    >
                    reads localStorage and hides it if previously dismissed.
                </li>
                <li>
                    Users who have <em>already dismissed</em> will see a one-frame flicker on initial
                    page load. First-time visitors don't experience this.
                </li>
                <li>
                    To eliminate the flicker, inject a prehydration script in your SvelteKit
                    <code class="rounded bg-surface-container-highest px-1 py-0.5 text-xs"
                        >app.html</code
                    > head:
                </li>
            </ul>
            <pre class="mt-3 overflow-x-auto rounded bg-surface-container-highest p-3 text-xs"><code
                    >{prehydrationRecipe}</code
                ></pre>
        </div>
    </section>
</div>
