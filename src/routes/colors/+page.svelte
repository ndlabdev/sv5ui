<script lang="ts">
    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info'
    ] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Color Palette</h1>
        <p class="text-on-surface-variant">
            Material Design 3 inspired color tokens used in the theme.
        </p>
    </div>

    <!-- Color Grid -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Theme Colors</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each colors as color (color)}
                <div class="overflow-hidden rounded-lg border border-outline-variant">
                    <div class="bg-{color} text-on-{color} p-4 font-medium capitalize">{color}</div>
                    <div class="bg-{color}-container text-on-{color}-container p-4 text-sm">
                        {color}-container
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Surface Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Surface Colors</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div class="overflow-hidden rounded-lg border border-outline-variant">
                <div class="bg-surface p-4 font-medium text-on-surface">Surface</div>
                <div class="bg-surface-container p-4 text-sm text-on-surface">
                    surface-container
                </div>
            </div>
            <div class="overflow-hidden rounded-lg border border-outline-variant">
                <div class="bg-surface-container-low p-4 font-medium text-on-surface">
                    Container Low
                </div>
                <div class="bg-surface-container-lowest p-4 text-sm text-on-surface">
                    container-lowest
                </div>
            </div>
            <div class="overflow-hidden rounded-lg border border-outline-variant">
                <div class="bg-surface-container-high p-4 font-medium text-on-surface">
                    Container High
                </div>
                <div class="bg-surface-container-highest p-4 text-sm text-on-surface">
                    container-highest
                </div>
            </div>
        </div>
    </section>

    <!-- Outline Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Outline Colors</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-lg border-2 border-outline p-4">
                <p class="font-medium">outline</p>
                <p class="text-sm text-on-surface-variant">Primary border color</p>
            </div>
            <div class="rounded-lg border-2 border-outline-variant p-4">
                <p class="font-medium">outline-variant</p>
                <p class="text-sm text-on-surface-variant">Subtle border color</p>
            </div>
        </div>
    </section>
</div>
