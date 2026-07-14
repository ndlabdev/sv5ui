<script lang="ts">
    import { ToggleGroup } from '$lib/index.js'

    const variants = ['outline', 'soft', 'subtle', 'ghost'] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    const alignItems = [
        { value: 'left', icon: 'lucide:align-left', ariaLabel: 'Align left' },
        { value: 'center', icon: 'lucide:align-center', ariaLabel: 'Align center' },
        { value: 'right', icon: 'lucide:align-right', ariaLabel: 'Align right' },
        { value: 'justify', icon: 'lucide:align-justify', ariaLabel: 'Justify' }
    ]

    const formatItems = [
        { value: 'bold', icon: 'lucide:bold', ariaLabel: 'Bold' },
        { value: 'italic', icon: 'lucide:italic', ariaLabel: 'Italic' },
        { value: 'underline', icon: 'lucide:underline', ariaLabel: 'Underline' },
        { value: 'strikethrough', icon: 'lucide:strikethrough', ariaLabel: 'Strikethrough' }
    ]

    const viewItems = [
        { value: 'list', label: 'List', leadingIcon: 'lucide:list' },
        { value: 'grid', label: 'Grid', leadingIcon: 'lucide:layout-grid' },
        { value: 'columns', label: 'Columns', leadingIcon: 'lucide:columns-3' }
    ]

    const periodItems = [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year', disabled: true }
    ]

    let align = $state('left')
    let formats = $state(['bold'])
    let period = $state('week')
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Toggle Group</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A set of two-state buttons where selection is managed by the group. Defaults to <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">single</code
            > mode, where pressing an item releases the others.
        </p>
        <div class="space-y-3">
            <ToggleGroup bind:value={align} items={alignItems} aria-label="Text alignment" />
            <p class="text-sm text-on-surface-variant">
                Alignment: <span class="font-mono text-on-surface">{align || 'none'}</span>
            </p>
        </div>
    </section>

    <!-- Multiple -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Multiple Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="multiple"</code
            > to allow several items to be pressed at once. The bound value becomes a string array.
        </p>
        <div class="space-y-3">
            <ToggleGroup
                type="multiple"
                bind:value={formats}
                items={formatItems}
                aria-label="Text formatting"
            />
            <p class="text-sm text-on-surface-variant">
                Formats: <span class="font-mono text-on-surface"
                    >[{formats.join(', ') || 'none'}]</span
                >
            </p>
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Items share the Toggle component's <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">variant</code
            > styles.
        </p>
        <div class="flex flex-col gap-4">
            {#each variants as variant (variant)}
                <div class="flex items-center gap-4">
                    <span class="w-16 text-sm text-on-surface-variant">{variant}</span>
                    <ToggleGroup
                        {variant}
                        value="grid"
                        items={viewItems}
                        aria-label="View ({variant})"
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Attached -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Attached</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >attached</code
            > to render the items flush against each other for a segmented-control look.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <ToggleGroup
                attached
                variant="outline"
                bind:value={period}
                items={periodItems}
                aria-label="Period"
            />
            <ToggleGroup
                attached
                variant="subtle"
                color="secondary"
                value="center"
                items={alignItems}
                aria-label="Attached alignment"
            />
        </div>
    </section>

    <!-- Colors & Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors &amp; Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> props
            apply to every item.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            <ToggleGroup
                color="success"
                variant="soft"
                value="grid"
                items={viewItems}
                aria-label="View (success)"
            />
            <ToggleGroup
                color="error"
                variant="outline"
                value="list"
                items={viewItems}
                aria-label="View (error)"
            />
        </div>
        <div class="flex flex-col items-start gap-3">
            {#each sizes as size (size)}
                <ToggleGroup
                    {size}
                    attached
                    variant="outline"
                    value="week"
                    items={periodItems}
                    aria-label="Period ({size})"
                />
            {/each}
        </div>
    </section>

    <!-- Vertical -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Vertical</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >orientation="vertical"</code
            > to stack the items; arrow-key navigation follows the orientation.
        </p>
        <ToggleGroup
            orientation="vertical"
            attached
            variant="outline"
            value="list"
            items={viewItems}
            aria-label="View (vertical)"
        />
    </section>

    <!-- Block -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Block</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">block</code
            > to stretch the group to the full container width with equal-width items.
        </p>
        <ToggleGroup
            block
            attached
            variant="subtle"
            value="week"
            items={periodItems}
            aria-label="Period (block)"
        />
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Disable the whole group with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">disabled</code
            >, or individual items via the item's
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">disabled</code>
            field (see Year above).
        </p>
        <ToggleGroup
            disabled
            variant="outline"
            value="grid"
            items={viewItems}
            aria-label="View (disabled)"
        />
    </section>

    <!-- Custom Item Content -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Item Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >itemSlot</code
            > snippet to fully control each item's content.
        </p>
        <ToggleGroup
            variant="soft"
            color="tertiary"
            value="week"
            items={periodItems}
            aria-label="Period (custom)"
        >
            {#snippet itemSlot({ item })}
                <span class="font-mono uppercase">{item.label}</span>
            {/snippet}
        </ToggleGroup>
    </section>
</div>
