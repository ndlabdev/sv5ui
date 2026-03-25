<script lang="ts">
    import { Icon } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Icon</h1>
        <p class="text-on-surface-variant">
            Use the Icon component to display any icon from the
            <a
                href="https://icon-sets.iconify.design/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline">Iconify</a
            >
            library. Renders as an inline SVG with
            <code class="rounded bg-surface-container-highest px-1">aria-hidden="true"</code> by default.
        </p>
    </div>

    <!-- Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">name</code> prop with
            the Iconify format
            <code class="rounded bg-surface-container-highest px-1">collection:icon-name</code>.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Icon name="lucide:home" />
            <Icon name="lucide:settings" />
            <Icon name="lucide:user" />
            <Icon name="lucide:mail" />
            <Icon name="lucide:bell" />
            <Icon name="lucide:search" />
            <Icon name="lucide:heart" />
            <Icon name="lucide:star" />
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to set
            both width and height. Accepts a number (pixels) or CSS string value. Defaults to
            <code class="rounded bg-surface-container-highest px-1">24</code>.
        </p>
        <div class="flex flex-wrap items-end gap-6 rounded-lg bg-surface-container-high p-4">
            {#each [16, 20, 24, 32, 48] as size (size)}
                <div class="flex flex-col items-center gap-2">
                    <Icon name="lucide:rocket" {size} />
                    <span class="text-xs text-on-surface-variant">{size}px</span>
                </div>
            {/each}
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:rocket" size="2rem" />
                <span class="text-xs text-on-surface-variant">2rem</span>
            </div>
        </div>
    </section>

    <!-- Color -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Color</h2>
        <p class="text-sm text-on-surface-variant">
            The icon inherits <code class="rounded bg-surface-container-highest px-1"
                >currentColor</code
            >
            from its parent by default. Use the
            <code class="rounded bg-surface-container-highest px-1">color</code> prop for a CSS
            color value, or Tailwind
            <code class="rounded bg-surface-container-highest px-1">text-*</code> classes via
            <code class="rounded bg-surface-container-highest px-1">class</code>.
        </p>

        <p class="text-xs font-medium text-on-surface-variant uppercase">With Tailwind classes</p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Icon name="lucide:circle" class="text-primary" />
            <Icon name="lucide:circle" class="text-secondary" />
            <Icon name="lucide:circle" class="text-tertiary" />
            <Icon name="lucide:circle" class="text-success" />
            <Icon name="lucide:circle" class="text-warning" />
            <Icon name="lucide:circle" class="text-error" />
            <Icon name="lucide:circle" class="text-info" />
        </div>

        <p class="text-xs font-medium text-on-surface-variant uppercase">With color prop</p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Icon name="lucide:circle" color="red" />
            <Icon name="lucide:circle" color="#22c55e" />
            <Icon name="lucide:circle" color="rgb(59, 130, 246)" />
            <Icon name="lucide:circle" color="orange" />
        </div>

        <p class="text-xs font-medium text-on-surface-variant uppercase">Inheriting parent color</p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <span class="flex items-center gap-1 text-primary">
                <Icon name="lucide:info" size={16} />
                Inherits primary
            </span>
            <span class="flex items-center gap-1 text-error">
                <Icon name="lucide:alert-triangle" size={16} />
                Inherits error
            </span>
            <span class="flex items-center gap-1 text-success">
                <Icon name="lucide:check-circle" size={16} />
                Inherits success
            </span>
        </div>
    </section>

    <!-- Flip -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Flip</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">flipH</code> and
            <code class="rounded bg-surface-container-highest px-1">flipV</code> to mirror the icon horizontally
            or vertically. Combining both is optimized into a 180&deg; rotation.
        </p>
        <div class="flex flex-wrap items-center gap-8 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:arrow-right" />
                <span class="text-xs text-on-surface-variant">Normal</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:arrow-right" flipH />
                <span class="text-xs text-on-surface-variant">flipH</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:arrow-right" flipV />
                <span class="text-xs text-on-surface-variant">flipV</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:arrow-right" flipH flipV />
                <span class="text-xs text-on-surface-variant">flipH + flipV</span>
            </div>
        </div>
    </section>

    <!-- Rotate -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Rotate</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">rotate</code> prop for
            quarter-turn rotation (<code class="rounded bg-surface-container-highest px-1">0</code>,
            <code class="rounded bg-surface-container-highest px-1">90</code>,
            <code class="rounded bg-surface-container-highest px-1">180</code>,
            <code class="rounded bg-surface-container-highest px-1">270</code>). For arbitrary
            angles, use a Tailwind class like
            <code class="rounded bg-surface-container-highest px-1">rotate-45</code>.
        </p>
        <div class="flex flex-wrap items-center gap-8 rounded-lg bg-surface-container-high p-4">
            {#each [0, 90, 180, 270] as deg (deg)}
                <div class="flex flex-col items-center gap-2">
                    <Icon name="lucide:arrow-up" rotate={deg as 0 | 90 | 180 | 270} />
                    <span class="text-xs text-on-surface-variant">{deg}&deg;</span>
                </div>
            {/each}
            <span class="mx-2 text-on-surface-variant">|</span>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:arrow-up" class="rotate-45" />
                <span class="text-xs text-on-surface-variant">CSS 45&deg;</span>
            </div>
        </div>
    </section>

    <!-- Class -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Class</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">class</code> prop to add
            Tailwind utilities. Classes are merged with
            <code class="rounded bg-surface-container-highest px-1">tailwind-merge</code>, so
            conflicting utilities like
            <code class="rounded bg-surface-container-highest px-1">shrink</code> correctly override
            the default
            <code class="rounded bg-surface-container-highest px-1">shrink-0</code>.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:star" class="text-warning" />
                <span class="text-xs text-on-surface-variant">text-warning</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:heart" class="animate-pulse text-error" />
                <span class="text-xs text-on-surface-variant">animate-pulse</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:loader" class="animate-spin text-primary" />
                <span class="text-xs text-on-surface-variant">animate-spin</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:zap" class="text-warning drop-shadow-lg" />
                <span class="text-xs text-on-surface-variant">drop-shadow</span>
            </div>
        </div>
    </section>

    <!-- Icon Sets -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon Sets</h2>
        <p class="text-sm text-on-surface-variant">
            Supports any collection from the Iconify library. Use the format
            <code class="rounded bg-surface-container-highest px-1">collection:icon-name</code>.
        </p>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant"
                            >Collection</th
                        >
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant">Icon</th
                        >
                        <th class="px-3 py-2 text-left font-medium text-on-surface-variant">Name</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each [{ name: 'lucide:github', label: 'Lucide' }, { name: 'mdi:github', label: 'Material Design Icons' }, { name: 'ph:github-logo', label: 'Phosphor' }, { name: 'tabler:brand-github', label: 'Tabler' }, { name: 'heroicons:code-bracket', label: 'Heroicons' }, { name: 'ri:github-fill', label: 'Remix Icon' }, { name: 'solar:star-bold', label: 'Solar' }] as icon (icon.name)}
                        <tr class="border-b border-outline-variant/50">
                            <td class="px-3 py-2 text-on-surface-variant">{icon.label}</td>
                            <td class="px-3 py-2">
                                <Icon name={icon.name} />
                            </td>
                            <td class="px-3 py-2 font-mono text-xs">{icon.name}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Examples</h2>

        <!-- Inline with text -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Inline with text</p>
            <div class="flex flex-col gap-2">
                <p class="flex items-center gap-1.5 text-sm">
                    <Icon name="lucide:check-circle" size={16} class="text-success" />
                    Payment successful
                </p>
                <p class="flex items-center gap-1.5 text-sm">
                    <Icon name="lucide:alert-triangle" size={16} class="text-warning" />
                    Storage almost full
                </p>
                <p class="flex items-center gap-1.5 text-sm">
                    <Icon name="lucide:x-circle" size={16} class="text-error" />
                    Connection failed
                </p>
            </div>
        </div>

        <!-- Icon grid -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Feature grid</p>
            <div class="grid grid-cols-4 gap-4">
                {#each [{ name: 'lucide:shield-check', label: 'Secure', color: 'text-success' }, { name: 'lucide:zap', label: 'Fast', color: 'text-warning' }, { name: 'lucide:globe', label: 'Global', color: 'text-info' }, { name: 'lucide:heart', label: 'Loved', color: 'text-error' }] as item (item.name)}
                    <div
                        class="flex flex-col items-center gap-2 rounded-lg bg-surface-container p-3"
                    >
                        <Icon name={item.name} size={32} class={item.color} />
                        <span class="text-xs font-medium">{item.label}</span>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Loading states -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Loading states</p>
            <div class="flex items-center gap-6">
                <div class="flex flex-col items-center gap-2">
                    <Icon name="lucide:loader-2" class="animate-spin text-primary" />
                    <span class="text-xs text-on-surface-variant">Spinner</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <Icon name="svg-spinners:ring-resize" class="text-secondary" />
                    <span class="text-xs text-on-surface-variant">SVG Spinner</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <Icon name="svg-spinners:3-dots-bounce" class="text-tertiary" />
                    <span class="text-xs text-on-surface-variant">Dots</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <Icon name="svg-spinners:pulse-3" class="text-info" />
                    <span class="text-xs text-on-surface-variant">Pulse</span>
                </div>
            </div>
        </div>
    </section>
</div>
