<script lang="ts">
    import { useElementSize, useResizeObserver } from '$lib/index.js'
    import { Badge, Icon } from '$lib/index.js'

    // ==================== useElementSize ====================
    let box = $state<HTMLElement>()
    const size = useElementSize(() => box)

    // ==================== useResizeObserver (lower-level) ====================
    let box2 = $state<HTMLElement>()
    let breakpoint = $state('—')

    useResizeObserver(
        () => box2,
        ([entry]) => {
            const w = entry.contentRect.width
            breakpoint = w < 260 ? 'sm' : w < 420 ? 'md' : 'lg'
        }
    )

    const breakpointColor = $derived(
        breakpoint === 'sm' ? 'warning' : breakpoint === 'md' ? 'info' : 'success'
    )
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useResizeObserver / useElementSize</h1>
        <p class="text-on-surface-variant">
            Observe an element's size with a <code>ResizeObserver</code> and automatic cleanup.
            <code>useElementSize</code> returns the reactive content-box size; the target may be a value
            or a reactive getter. SSR-safe.
        </p>
    </div>

    <!-- useElementSize -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useElementSize</h2>
        <p class="text-sm text-on-surface-variant">
            Drag the bottom-right corner of the box — the size updates live.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div
                bind:this={box}
                class="flex min-h-32 max-w-full min-w-48 resize items-center justify-center overflow-auto rounded-lg border-2 border-dashed border-outline-variant bg-surface p-4"
            >
                <Badge
                    label="{Math.round(size.width)} × {Math.round(size.height)}"
                    color="primary"
                    variant="soft"
                    size="lg"
                />
            </div>
        </div>
    </section>

    <!-- useResizeObserver -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useResizeObserver (lower-level callback)</h2>
        <p class="text-sm text-on-surface-variant">
            The raw callback reads each entry's <code>contentRect</code>. Here it maps the width to
            a responsive breakpoint — resize horizontally to see it change.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div
                bind:this={box2}
                class="flex min-h-24 max-w-full min-w-44 resize-x items-center justify-center gap-2 overflow-auto rounded-lg border-2 border-dashed border-outline-variant bg-surface p-4"
            >
                <Icon name="lucide:scaling" size="16" class="text-on-surface-variant" />
                <Badge label="breakpoint: {breakpoint}" color={breakpointColor} variant="soft" />
            </div>
        </div>
    </section>
</div>
