<script lang="ts">
    import { usePointerDrag } from '$lib/index.js'
    import { Badge, Button } from '$lib/index.js'

    let position = $state({ x: 0, y: 0 })
    let start = { x: 0, y: 0 }

    const move = usePointerDrag({
        onStart: () => (start = { ...position }),
        onMove: ({ dx, dy }) => (position = { x: start.x + dx, y: start.y + dy })
    })

    let width = $state(240)
    let startWidth = 240

    const resize = usePointerDrag({
        axis: 'x',
        onStart: () => (startWidth = width),
        onMove: ({ dx }) => (width = Math.min(420, Math.max(120, startWidth + dx)))
    })

    let readout = $state({ dx: 0, dy: 0 })
    let ended = $state(0)

    const inspect = usePointerDrag({
        onMove: ({ dx, dy }) => (readout = { dx: Math.round(dx), dy: Math.round(dy) }),
        onEnd: () => (ended += 1)
    })

    let handleOnly = $state(0)
    let handleStart = 0

    const gated = usePointerDrag({
        axis: 'x',
        onStart: ({ event }) => {
            if (!(event.target as HTMLElement).closest('[data-grip]')) return false
            handleStart = handleOnly
        },
        onMove: ({ dx }) => (handleOnly = Math.min(200, Math.max(-200, handleStart + dx)))
    })
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">usePointerDrag</h1>
        <p class="text-on-surface-variant">
            Pointer dragging with the parts every component gets wrong: pointer capture with a
            <code>window</code> fallback, moves coalesced to one update per frame, and the final position
            always flushed on release so the result matches the pointer. Every update is computed from
            the position the drag started at, so a dropped move never accumulates error.
        </p>
    </div>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Drag a box</h2>
        <p class="text-sm text-on-surface-variant">
            <code>onStart</code> snapshots the position, <code>onMove</code> applies the delta. Drag fast
            and far outside the box: the gesture keeps following the pointer.
        </p>
        <div class="relative h-56 overflow-hidden rounded-lg bg-surface-container-high">
            <div
                {...move.handlers}
                class="absolute flex size-24 cursor-grab touch-none items-center justify-center rounded-xl bg-primary text-sm font-medium text-on-primary select-none active:cursor-grabbing"
                style="left: {position.x + 16}px; top: {position.y + 16}px;"
                data-active={move.active ? '' : undefined}
            >
                drag me
            </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Badge
                label={move.active ? 'dragging' : 'idle'}
                color={move.active ? 'success' : 'secondary'}
                variant="soft"
            />
            <Button
                size="sm"
                variant="outline"
                label="Reset"
                onclick={() => (position = { x: 0, y: 0 })}
            />
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Axis lock</h2>
        <p class="text-sm text-on-surface-variant">
            <code>axis: 'x'</code> reports movement on one direction only, which is what a splitter or
            a one-dimensional slider wants.
        </p>
        <div class="flex items-stretch rounded-lg bg-surface-container-high p-4">
            <div
                class="flex items-center justify-center rounded-l-lg bg-surface-container-highest text-sm text-on-surface-variant"
                style="width: {width}px"
            >
                {Math.round(width)}px
            </div>
            <div
                {...resize.handlers}
                class="w-2 shrink-0 cursor-col-resize touch-none rounded-r-lg bg-primary/70 hover:bg-primary"
                data-active={resize.active ? '' : undefined}
            ></div>
        </div>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">What the callbacks receive</h2>
        <div
            {...inspect.handlers}
            class="flex h-40 touch-none items-center justify-center rounded-lg bg-surface-container-high text-sm text-on-surface-variant select-none"
        >
            drag anywhere in this area
        </div>
        <dl class="grid grid-cols-2 gap-x-3 gap-y-1 text-sm sm:grid-cols-4">
            <dt class="text-on-surface-variant">active</dt>
            <dd>{inspect.active}</dd>
            <dt class="text-on-surface-variant">dx / dy</dt>
            <dd>{readout.dx} / {readout.dy}</dd>
            <dt class="text-on-surface-variant">onEnd calls</dt>
            <dd>{ended}</dd>
        </dl>
    </section>

    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Rejecting a gesture</h2>
        <p class="text-sm text-on-surface-variant">
            Returning <code>false</code> from <code>onStart</code> declines the drag and releases the
            capture. Here only the grip starts it; dragging the body does nothing.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div
                {...gated.handlers}
                class="flex touch-none items-center gap-3 rounded-lg bg-surface-container-highest p-3 select-none"
                style="transform: translateX({handleOnly}px)"
            >
                <span
                    data-grip
                    class="cursor-grab rounded bg-primary px-2 py-1 text-xs text-on-primary"
                >
                    grip
                </span>
                <span class="text-sm text-on-surface-variant">the rest of the card is inert</span>
            </div>
        </div>
    </section>
</div>
