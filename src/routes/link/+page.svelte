<script lang="ts">
    import { Link, Icon } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Link</h1>
        <p class="text-on-surface-variant">
            Use the Link component to create hyperlinks with automatic active state detection.
            Renders as an anchor tag when <code class="rounded bg-surface-container-highest px-1"
                >href</code
            >
            is provided, otherwise renders as a button.
        </p>
    </div>

    <!-- Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Usage</h2>
        <p class="text-sm text-on-surface-variant">
            The Link component is styled by default with <code
                class="rounded bg-surface-container-highest px-1">text-on-surface-variant</code
            >
            when inactive and
            <code class="rounded bg-surface-container-highest px-1">text-primary</code>
            when active, with a
            <code class="rounded bg-surface-container-highest px-1">hover:text-on-surface</code> transition.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link">Link</Link>
        </div>
    </section>

    <!-- InactiveClass -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">InactiveClass</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">inactiveClass</code> prop
            to apply additional classes when the link is inactive.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/non-existent" inactiveClass="opacity-50">Dimmed when inactive</Link>
            <Link href="/non-existent" inactiveClass="italic">Italic when inactive</Link>
        </div>
    </section>

    <!-- ActiveClass -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">ActiveClass</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">activeClass</code> prop to
            apply additional classes when the link is active.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link" activeClass="font-bold">Bold when active</Link>
            <Link href="/link" activeClass="underline underline-offset-4"
                >Underlined when active</Link
            >
            <Link href="/link" activeClass="font-bold underline underline-offset-4"
                >Bold + underline</Link
            >
        </div>
    </section>

    <!-- Active -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Active</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">active</code> prop to force
            the active state, overriding auto-detection from the current route.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link" active={true}>Active (forced)</Link>
            <Link href="/link" active={false}>Inactive (forced)</Link>
            <Link href="/link">Auto-detected</Link>
        </div>
    </section>

    <!-- Matching Modes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Matching Modes</h2>
        <p class="text-sm text-on-surface-variant">
            By default, a link is active when the current URL starts with the <code
                class="rounded bg-surface-container-highest px-1">href</code
            >. Use <code class="rounded bg-surface-container-highest px-1">exact</code>,
            <code class="rounded bg-surface-container-highest px-1">exactQuery</code>, and
            <code class="rounded bg-surface-container-highest px-1">exactHash</code> to control this behavior.
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant">Prop</th
                        >
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant">Href</th
                        >
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant"
                            >Preview</th
                        >
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant"
                            >Description</th
                        >
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-outline-variant/50">
                        <td class="px-3 py-2 font-mono text-xs text-on-surface-variant">default</td>
                        <td class="px-3 py-2 font-mono text-xs">/link</td>
                        <td class="px-3 py-2">
                            <Link href="/link" activeClass="font-semibold">Link</Link>
                        </td>
                        <td class="px-3 py-2 text-on-surface-variant"
                            >Prefix match — active if URL starts with href</td
                        >
                    </tr>
                    <tr class="border-b border-outline-variant/50">
                        <td class="px-3 py-2 font-mono text-xs text-on-surface-variant">exact</td>
                        <td class="px-3 py-2 font-mono text-xs">/link</td>
                        <td class="px-3 py-2">
                            <Link href="/link" exact activeClass="font-semibold">Link (exact)</Link>
                        </td>
                        <td class="px-3 py-2 text-on-surface-variant"
                            >Only active when pathname is exactly "/link"</td
                        >
                    </tr>
                    <tr class="border-b border-outline-variant/50">
                        <td class="px-3 py-2 font-mono text-xs text-on-surface-variant"
                            >exactHash</td
                        >
                        <td class="px-3 py-2 font-mono text-xs">/link#section</td>
                        <td class="px-3 py-2">
                            <Link href="/link#section" exactHash activeClass="font-semibold"
                                >#section</Link
                            >
                        </td>
                        <td class="px-3 py-2 text-on-surface-variant"
                            >Hash must also match for active state</td
                        >
                    </tr>
                    <tr>
                        <td class="px-3 py-2 font-mono text-xs text-on-surface-variant"
                            >exactQuery</td
                        >
                        <td class="px-3 py-2 font-mono text-xs">/link?tab=1</td>
                        <td class="px-3 py-2">
                            <Link href="/link?tab=1" exactQuery activeClass="font-semibold"
                                >?tab=1</Link
                            >
                        </td>
                        <td class="px-3 py-2 text-on-surface-variant"
                            >Query params must exactly match</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <!-- disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">disabled</code> prop to
            disable the link. On anchors, it removes
            <code class="rounded bg-surface-container-highest px-1">href</code>, sets
            <code class="rounded bg-surface-container-highest px-1">aria-disabled</code>
            and
            <code class="rounded bg-surface-container-highest px-1">role="link"</code>. On buttons,
            it uses the native disabled attribute.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link" disabled>Disabled anchor</Link>
            <Link disabled>Disabled button</Link>
        </div>
    </section>

    <!-- Raw -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Raw</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">raw</code> prop to strip
            all default styling. Only
            <code class="rounded bg-surface-container-highest px-1">class</code>,
            <code class="rounded bg-surface-container-highest px-1">activeClass</code>, and
            <code class="rounded bg-surface-container-highest px-1">inactiveClass</code> are applied.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link
                href="/link"
                raw
                class="text-on-surface underline decoration-primary underline-offset-4 hover:decoration-2"
            >
                Custom styled
            </Link>
            <Link
                href="/link"
                raw
                class="rounded-md bg-primary-container px-3 py-1 text-on-primary-container hover:bg-primary-container/80"
            >
                Chip style
            </Link>
            <Link
                href="/link"
                raw
                active={true}
                activeClass="bg-primary text-on-primary"
                inactiveClass="bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
                Pill style
            </Link>
        </div>
    </section>

    <!-- External -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">External</h2>
        <p class="text-sm text-on-surface-variant">
            External URLs (<code class="rounded bg-surface-container-highest px-1">http://</code>,
            <code class="rounded bg-surface-container-highest px-1">https://</code>,
            <code class="rounded bg-surface-container-highest px-1">//</code>) are auto-detected.
            The component adds
            <code class="rounded bg-surface-container-highest px-1">target="_blank"</code> and
            <code class="rounded bg-surface-container-highest px-1">rel="noopener noreferrer"</code>
            automatically. Use the
            <code class="rounded bg-surface-container-highest px-1">external</code> prop to force this
            behavior on internal paths.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="https://svelte.dev">
                <Icon name="lucide:external-link" size="14" class="mr-1" />
                Svelte (auto)
            </Link>
            <Link href="https://tailwindcss.com">
                <Icon name="lucide:external-link" size="14" class="mr-1" />
                Tailwind CSS (auto)
            </Link>
            <Link href="/api/docs" external>
                <Icon name="lucide:external-link" size="14" class="mr-1" />
                API Docs (forced)
            </Link>
        </div>
    </section>

    <!-- Prefetch -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Prefetch</h2>
        <p class="text-sm text-on-surface-variant">
            Since the Link component extends native HTML anchor attributes, you can use SvelteKit's
            <code class="rounded bg-surface-container-highest px-1"
                >data-sveltekit-preload-data</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1"
                >data-sveltekit-preload-code</code
            >
            attributes to control prefetching behavior.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link" data-sveltekit-preload-data="hover">Preload on hover</Link>
            <Link href="/link" data-sveltekit-preload-data="tap">Preload on tap</Link>
            <Link href="/link" data-sveltekit-preload-data="off">No preload</Link>
            <Link href="/link" data-sveltekit-preload-code="eager">Preload code eagerly</Link>
        </div>
    </section>

    <!-- As Button -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Button</h2>
        <p class="text-sm text-on-surface-variant">
            When no <code class="rounded bg-surface-container-highest px-1">href</code> is provided,
            the component renders a button element with
            <code class="rounded bg-surface-container-highest px-1">type="button"</code> by default.
            Use the <code class="rounded bg-surface-container-highest px-1">type</code> prop to change
            the button type.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link onclick={() => alert('Clicked!')}>Click action</Link>
            <Link type="submit">Submit type</Link>
            <Link type="reset">Reset type</Link>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to override
            styles on specific slots.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Link href="/link" ui={{ base: 'underline underline-offset-4 decoration-2' }}>
                Underlined
            </Link>
            <Link href="/link" ui={{ base: 'font-bold text-lg' }}>Bold & Large</Link>
            <Link href="/link" ui={{ base: 'uppercase tracking-wider text-xs font-semibold' }}>
                Uppercase
            </Link>
        </div>
    </section>

    <!-- States Overview -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">States</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >State</th
                        >
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >&lt;a&gt;</th
                        >
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >&lt;button&gt;</th
                        >
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-outline-variant/50">
                        <td class="px-3 py-3 text-sm font-medium text-on-surface-variant"
                            >Default</td
                        >
                        <td class="px-3 py-3">
                            <Link href="/demo">Link text</Link>
                        </td>
                        <td class="px-3 py-3">
                            <Link>Button text</Link>
                        </td>
                    </tr>
                    <tr class="border-b border-outline-variant/50">
                        <td class="px-3 py-3 text-sm font-medium text-on-surface-variant">Active</td
                        >
                        <td class="px-3 py-3">
                            <Link href="/link" active={true}>Link text</Link>
                        </td>
                        <td class="px-3 py-3">
                            <Link active={true}>Button text</Link>
                        </td>
                    </tr>
                    <tr>
                        <td class="px-3 py-3 text-sm font-medium text-on-surface-variant"
                            >Disabled</td
                        >
                        <td class="px-3 py-3">
                            <Link href="/link" disabled>Link text</Link>
                        </td>
                        <td class="px-3 py-3">
                            <Link disabled>Button text</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <!-- Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Examples</h2>

        <!-- Navigation Bar -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Navigation bar</p>
            <nav class="flex items-center gap-6">
                <Link href="/" exact activeClass="font-semibold">Home</Link>
                <Link href="/about" activeClass="font-semibold">About</Link>
                <Link href="/link" activeClass="font-semibold" active={true}>Docs</Link>
                <Link href="/pricing" activeClass="font-semibold">Pricing</Link>
            </nav>
        </div>

        <!-- Sidebar Menu -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Sidebar menu</p>
            <div class="flex w-56 flex-col gap-0.5">
                <Link
                    href="/link"
                    raw
                    active={true}
                    activeClass="bg-primary-container text-on-primary-container font-medium"
                    inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                    <Icon name="lucide:layout-dashboard" size="16" />
                    Dashboard
                </Link>
                <Link
                    href="/settings"
                    raw
                    activeClass="bg-primary-container text-on-primary-container font-medium"
                    inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                    <Icon name="lucide:settings" size="16" />
                    Settings
                </Link>
                <Link
                    href="/profile"
                    raw
                    activeClass="bg-primary-container text-on-primary-container font-medium"
                    inactiveClass="text-on-surface-variant hover:bg-surface-container-highest"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                >
                    <Icon name="lucide:user" size="16" />
                    Profile
                </Link>
            </div>
        </div>

        <!-- Breadcrumb -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Breadcrumb</p>
            <nav class="flex items-center gap-1 text-sm">
                <Link href="/">Home</Link>
                <Icon name="lucide:chevron-right" size="14" class="text-on-surface-variant/50" />
                <Link href="/link">Components</Link>
                <Icon name="lucide:chevron-right" size="14" class="text-on-surface-variant/50" />
                <span class="text-on-surface">Link</span>
            </nav>
        </div>

        <!-- Footer Links -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Footer links</p>
            <div class="flex items-center gap-4 text-sm">
                <Link href="https://github.com">
                    <Icon name="lucide:github" size="14" class="mr-1" />
                    GitHub
                </Link>
                <span class="text-outline-variant">|</span>
                <Link href="https://svelte.dev">
                    <Icon name="lucide:external-link" size="14" class="mr-1" />
                    Svelte
                </Link>
                <span class="text-outline-variant">|</span>
                <Link
                    href="/link"
                    raw
                    class="text-on-surface-variant underline hover:text-on-surface"
                    >Privacy Policy</Link
                >
            </div>
        </div>
    </section>
</div>
