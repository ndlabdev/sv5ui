<script lang="ts">
    import { Badge } from '$lib/index.js'

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
    const variants = ['solid', 'outline', 'soft', 'subtle'] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Badge</h1>
        <p class="text-on-surface-variant">
            Small status indicator for labeling and categorization.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap gap-2 rounded-lg bg-surface-container-high p-4">
            <Badge label="Badge" />
            <Badge label="New" color="success" />
            <Badge label="Warning" color="warning" />
            <Badge label="Error" color="error" />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each variants as variant (variant)}
                <div class="flex flex-wrap items-center gap-2">
                    <span class="w-16 text-sm text-on-surface-variant">{variant}</span>
                    {#each colors as color (color)}
                        <Badge label={color} {variant} {color} />
                    {/each}
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Badge label={size} {size} />
            {/each}
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <div class="flex flex-wrap gap-2 rounded-lg bg-surface-container-high p-4">
            <Badge label="Star" leadingIcon="lucide:star" color="warning" />
            <Badge label="Check" leadingIcon="lucide:check" color="success" />
            <Badge label="Close" trailingIcon="lucide:x" color="error" />
            <Badge
                label="Info"
                leadingIcon="lucide:info"
                trailingIcon="lucide:chevron-right"
                color="info"
            />
        </div>
    </section>

    <!-- Icon Only -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon Only (Square)</h2>
        <div class="flex flex-wrap gap-2 rounded-lg bg-surface-container-high p-4">
            <Badge icon="lucide:star" color="warning" />
            <Badge icon="lucide:check" color="success" />
            <Badge icon="lucide:x" color="error" />
            <Badge icon="lucide:heart" color="error" variant="soft" />
            <Badge icon="lucide:bell" color="info" variant="outline" />
        </div>
    </section>

    <!-- With Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Avatar</h2>
        <div class="flex flex-wrap gap-2 rounded-lg bg-surface-container-high p-4">
            <Badge label="John" avatar={{ alt: 'John', src: 'https://i.pravatar.cc/32?u=1' }} />
            <Badge
                label="Jane"
                avatar={{ alt: 'Jane', src: 'https://i.pravatar.cc/32?u=2' }}
                color="secondary"
            />
            <Badge
                label="Admin"
                avatar={{ alt: 'Admin' }}
                color="tertiary"
                variant="soft"
                size="lg"
            />
        </div>
    </section>

    <!-- Variants x Colors Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants x Colors</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Variant</th
                        >
                        {#each colors as color (color)}
                            <th
                                class="px-3 py-3 text-center text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr class="border-b border-outline-variant/50">
                            <td class="px-3 py-3 text-sm font-medium text-on-surface-variant"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-3 py-3 text-center">
                                    <Badge label={color} {variant} {color} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="flex flex-wrap gap-2 rounded-lg bg-surface-container-high p-4">
            <Badge label="Rounded Full" ui={{ base: 'rounded-full px-3' }} />
            <Badge
                label="Custom"
                ui={{
                    base: 'bg-gradient-to-r from-primary to-tertiary text-on-primary rounded-full px-3'
                }}
            />
            <Badge
                label="Bold"
                ui={{ label: 'font-bold uppercase tracking-wider' }}
                color="error"
                variant="outline"
            />
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- Status Labels -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Status Labels</p>
                <div class="flex flex-wrap gap-2">
                    <Badge label="Active" color="success" leadingIcon="lucide:circle-check" />
                    <Badge label="Pending" color="warning" leadingIcon="lucide:clock" />
                    <Badge label="Inactive" color="error" leadingIcon="lucide:circle-x" />
                    <Badge label="Draft" color="surface" leadingIcon="lucide:file-edit" />
                </div>
            </div>

            <!-- Tags -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Tags</p>
                <div class="flex flex-wrap gap-2">
                    <Badge label="Svelte" variant="soft" color="tertiary" />
                    <Badge label="TypeScript" variant="soft" color="info" />
                    <Badge label="Tailwind" variant="soft" color="primary" />
                    <Badge label="Vite" variant="soft" color="warning" />
                </div>
            </div>

            <!-- Notification Count -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Counts</p>
                <div class="flex flex-wrap gap-3">
                    <Badge label={3} color="primary" square />
                    <Badge label={12} color="error" square />
                    <Badge label="99+" color="info" size="sm" />
                    <Badge label="NEW" color="success" size="xs" />
                </div>
            </div>

            <!-- Card with Badge -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">In Context</p>
                <div
                    class="max-w-sm rounded-lg border border-outline-variant bg-surface-container p-4"
                >
                    <div class="mb-2 flex items-center justify-between">
                        <h3 class="font-medium">Feature Request</h3>
                        <Badge label="Open" color="success" variant="soft" size="sm" />
                    </div>
                    <p class="mb-3 text-sm text-on-surface-variant">
                        Add dark mode toggle to the settings panel.
                    </p>
                    <div class="flex gap-1.5">
                        <Badge label="enhancement" variant="outline" color="tertiary" size="xs" />
                        <Badge label="ui" variant="outline" color="info" size="xs" />
                        <Badge label="p2" variant="outline" color="warning" size="xs" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
