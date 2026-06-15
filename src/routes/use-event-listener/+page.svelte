<script lang="ts">
    import { useEventListener } from '$lib/index.js'
    import { Badge, Card, Icon } from '$lib/index.js'

    // ==================== Window resize (value/getter target) ====================
    let width = $state(0)
    let height = $state(0)

    $effect(() => {
        width = window.innerWidth
        height = window.innerHeight
    })

    useEventListener(
        () => window,
        'resize',
        () => {
            width = window.innerWidth
            height = window.innerHeight
        }
    )

    // ==================== Window keydown (multiple-target demo) ====================
    let lastKey = $state('—')
    let keyCount = $state(0)

    useEventListener(
        () => window,
        'keydown',
        (e) => {
            lastKey = e.key === ' ' ? 'Space' : e.key
            keyCount++
        }
    )

    // ==================== Element pointermove (reactive getter target) ====================
    let box = $state<HTMLElement>()
    let pos = $state({ x: 0, y: 0 })
    let inside = $state(false)

    useEventListener(
        () => box,
        'pointermove',
        (e) => {
            const rect = box!.getBoundingClientRect()
            pos = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) }
        }
    )
    useEventListener(
        () => box,
        ['pointerenter', 'pointerleave'],
        (e) => {
            inside = e.type === 'pointerenter'
        }
    )
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useEventListener</h1>
        <p class="text-on-surface-variant">
            Attach event listener(s) to a target with automatic cleanup. The target may be a value
            or a reactive getter, accepts one or many event types, and forwards listener options.
            SSR-safe — a nullish target is a no-op.
        </p>
    </div>

    <!-- Window resize -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Window resize</h2>
        <p class="text-sm text-on-surface-variant">
            Listens to <code>resize</code> on <code>window</code>. Resize the browser window to see
            it update.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Badge label="{width} × {height}" color="primary" variant="soft" size="lg" />
            <span class="text-sm text-on-surface-variant">live viewport size</span>
        </div>
    </section>

    <!-- Keydown -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Keyboard</h2>
        <p class="text-sm text-on-surface-variant">
            Listens to <code>keydown</code> on <code>window</code>. Press any key.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Badge label="Last key: {lastKey}" color="info" variant="soft" />
            <Badge label="Pressed: {keyCount}x" color="surface" variant="subtle" />
        </div>
    </section>

    <!-- Pointer position -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Pointer position (reactive element target)</h2>
        <p class="text-sm text-on-surface-variant">
            Listens to <code>pointermove</code> / <code>pointerenter</code> /
            <code>pointerleave</code> on an element resolved via a <code>() => box</code> getter, so the
            listener binds once the element mounts. Move your cursor inside the box.
        </p>
        <div
            bind:this={box}
            class="relative flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-high transition-colors"
            class:border-primary={inside}
        >
            {#if inside}
                <div
                    class="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                    style="left: {pos.x}px; top: {pos.y}px;"
                ></div>
            {/if}
            <Card class="p-3">
                <div class="flex items-center gap-2 text-sm">
                    <Icon name="lucide:move" size="16" class="text-on-surface-variant" />
                    <span>x: <strong>{pos.x}</strong>, y: <strong>{pos.y}</strong></span>
                </div>
            </Card>
        </div>
    </section>
</div>
