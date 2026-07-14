<script lang="ts">
    import { Rating, FormField } from '$lib/index.js'

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
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let bindValue = $state(3)
    let halfValue = $state(2.5)
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Rating</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A star rating input. Click an item or use the arrow keys to set the value.
        </p>
        <Rating />
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:value</code
            > for reactive two-way data binding.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <Rating bind:value={bindValue} />
            <p class="text-sm text-on-surface-variant">
                Value: <span class="font-mono text-on-surface">{bindValue}</span>
            </p>
        </div>
    </section>

    <!-- Half Steps -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Half Steps</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >allowHalf</code
            > to accept half-star values.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <Rating allowHalf bind:value={halfValue} />
            <p class="text-sm text-on-surface-variant">
                Value: <span class="font-mono text-on-surface">{halfValue}</span>
            </p>
        </div>
    </section>

    <!-- Readonly -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Readonly</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >readonly</code
            > to display a rating without allowing changes, e.g. review scores.
        </p>
        <div class="flex items-center gap-3">
            <Rating readonly allowHalf value={4.5} />
            <span class="text-sm text-on-surface-variant">4.5 out of 5</span>
        </div>
    </section>

    <!-- Max -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Max</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">max</code>
            to control the number of items.
        </p>
        <div class="flex flex-col gap-3">
            <Rating max={3} value={2} />
            <Rating max={10} value={7} size="sm" />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > to change the active icon color.
        </p>
        <div class="flex flex-col gap-3">
            {#each colors as color (color)}
                <div class="flex items-center gap-4">
                    <span class="w-20 text-sm text-on-surface-variant">{color}</span>
                    <Rating {color} value={3} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code>
            to control the icon dimensions.
        </p>
        <div class="flex flex-col items-start gap-3">
            {#each sizes as size (size)}
                <Rating {size} value={3} />
            {/each}
        </div>
    </section>

    <!-- Custom Icon -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Icon</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            to swap the star for any Iconify icon.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <Rating icon="lucide:heart" color="error" value={3} />
            <Rating icon="lucide:thumbs-up" color="info" value={2} max={3} />
        </div>
    </section>

    <!-- Fill Styles -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Fill Styles</h2>
        <p class="text-sm text-on-surface-variant">
            Active icons are auto-filled by default. Set <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >fill=&#123;false&#125;</code
            >
            for an outline-only active style, or combine it with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >activeIcon</code
            > to switch to a different icon when active.
        </p>
        <div class="flex flex-col items-start gap-3">
            <div class="flex items-center gap-3">
                <Rating value={3} />
                <span class="text-sm text-on-surface-variant">fill (default)</span>
            </div>
            <div class="flex items-center gap-3">
                <Rating fill={false} value={3} />
                <span class="text-sm text-on-surface-variant"
                    >fill=&#123;false&#125;, outline-only</span
                >
            </div>
            <div class="flex items-center gap-3">
                <Rating icon="lucide:circle" activeIcon="lucide:circle-check" value={3} />
                <span class="text-sm text-on-surface-variant">activeIcon</span>
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            > to prevent interaction.
        </p>
        <Rating disabled value={3} />
    </section>

    <!-- Form -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Form Integration</h2>
        <p class="text-sm text-on-surface-variant">
            With a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >name</code
            >, a hidden input is rendered for native form submission. Inside a FormField, the label,
            size and error state are wired automatically.
        </p>
        <FormField name="score" label="Rate your experience" help="1 = poor, 5 = excellent">
            <Rating name="score" required />
        </FormField>
    </section>
</div>
