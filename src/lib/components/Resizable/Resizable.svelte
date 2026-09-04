<script lang="ts" module>
    import type { ResizableProps } from './resizable.types.js'

    export type Props = ResizableProps
</script>

<script lang="ts">
    import { untrack } from 'svelte'
    import { SvelteMap } from 'svelte/reactivity'
    import { useId } from 'bits-ui'
    import { resizableVariants, resizableDefaults } from './resizable.variants.js'
    import { getComponentConfig } from '../../config.js'
    import { useElementSize } from '../../hooks/useResizeObserver/useResizeObserver.svelte.js'
    import { usePointerDrag } from '../../hooks/usePointerDrag/index.js'
    import {
        clampLayout,
        collapsePane,
        defaultSizes,
        expandPane,
        isCollapsed,
        paneIds,
        parseStoredLayout,
        normalizeSizes,
        reconcileSizes,
        resetPair,
        resizeAt,
        resolveConstraints,
        setPaneSize,
        sizesEqual
    } from './resizable.utils.js'
    import type { ResizableApi } from './resizable.types.js'

    const config = getComponentConfig('resizable', resizableDefaults)

    let {
        ref = $bindable(null),
        panes,
        direction = config.defaultVariants.direction,
        sizes = $bindable(),
        storageKey,
        keyboardStep = 5,
        disabled = false,
        color = config.defaultVariants.color,
        size = config.defaultVariants.size,
        api = $bindable(),
        onSizesChange,
        onResizeStart,
        onResizeEnd,
        onCollapse,
        labels,
        handle,
        class: className,
        ui,
        ...restProps
    }: Props = $props()

    const autoId = useId()

    let layout = $state<number[]>(
        untrack(() =>
            sizes && sizes.length === panes.length ? normalizeSizes(sizes) : defaultSizes(panes)
        )
    )
    let activeHandle = $state<number | null>(null)
    const paneEls: (HTMLElement | null)[] = []

    const resolvedDirection = $derived<'horizontal' | 'vertical'>(direction ?? 'horizontal')

    const group = useElementSize(() => ref)
    const hasPixelLimits = $derived(
        panes.some((pane) => typeof pane.minSize === 'string' || typeof pane.maxSize === 'string')
    )
    const groupSize = $derived.by(() => {
        if (!hasPixelLimits) return 0

        return resolvedDirection === 'horizontal' ? group.width : group.height
    })
    const constraints = $derived(resolveConstraints(panes, groupSize))
    const collapsedIds = $derived(
        panes
            .filter((pane, index) => isCollapsed(layout[index] ?? 0, constraints[index]))
            .map((pane) => pane.id)
    )

    const paneId = (index: number) => `${autoId}-pane-${index}`
    const indexOfPane = (id: string) => panes.findIndex((pane) => pane.id === id)

    const restored = new SvelteMap<string, number>()

    function rememberSize(index: number) {
        const pane = panes[index]
        if (!pane || isCollapsed(layout[index], constraints[index])) return

        restored.set(pane.id, layout[index])
    }

    function commit(next: number[], notify = true) {
        if (sizesEqual(layout, next)) return

        layout = next
        if (notify) onResizeEnd?.(next)
    }

    let syncedIds = untrack(() => paneIds(panes))

    $effect(() => {
        const ids = paneIds(panes)

        untrack(() => {
            if (ids.length === syncedIds.length && ids.every((id, i) => id === syncedIds[i])) return

            layout = reconcileSizes(syncedIds, layout, panes)
            syncedIds = ids
        })
    })

    $effect(() => {
        if (!storageKey) return

        untrack(() => {
            try {
                const raw = localStorage.getItem(storageKey)
                if (!raw) return

                const stored = parseStoredLayout(JSON.parse(raw), paneIds(panes))
                if (stored) layout = stored
            } catch {
                return
            }
        })
    })

    $effect(() => {
        const current = layout
        const dragging = activeHandle !== null
        if (!storageKey || dragging) return

        untrack(() => {
            try {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify({ ids: paneIds(panes), sizes: current })
                )
            } catch {
                return
            }
        })
    })

    $effect(() => {
        const current = constraints

        untrack(() => {
            const clamped = clampLayout(layout, current)
            if (!sizesEqual(clamped, layout)) layout = clamped
        })
    })

    let syncedSizes: number[] | null = null

    $effect(() => {
        const current = layout

        untrack(() => {
            if (syncedSizes && sizesEqual(syncedSizes, current)) return
            syncedSizes = current
            sizes = current
            onSizesChange?.(current)
        })
    })

    $effect(() => {
        const incoming = sizes
        if (!incoming || incoming.length !== panes.length) return

        untrack(() => {
            if (syncedSizes && sizesEqual(syncedSizes, incoming)) return
            syncedSizes = incoming
            layout = normalizeSizes(incoming)
        })
    })

    let syncedCollapsed: string[] = []

    $effect(() => {
        const current = collapsedIds

        untrack(() => {
            for (const id of current) {
                if (!syncedCollapsed.includes(id)) onCollapse?.(id, true)
            }
            for (const id of syncedCollapsed) {
                if (!current.includes(id)) onCollapse?.(id, false)
            }
            syncedCollapsed = current
        })
    })

    function contentSize() {
        return paneEls.reduce((sum, element) => {
            if (!element) return sum
            const rect = element.getBoundingClientRect()

            return sum + (resolvedDirection === 'horizontal' ? rect.width : rect.height)
        }, 0)
    }

    let startSizes: number[] = []
    let dragSize = 0

    function applyDrag(dx: number, dy: number) {
        if (activeHandle === null || dragSize <= 0) return

        const distance = resolvedDirection === 'horizontal' ? dx : dy
        if (distance === 0) return

        layout = resizeAt(startSizes, activeHandle, (distance / dragSize) * 100, constraints)
    }

    const drag = usePointerDrag({
        axis: () => (resolvedDirection === 'horizontal' ? 'x' : 'y'),
        disabled: () => disabled,
        onStart: ({ event }) => {
            const index = Number((event.currentTarget as HTMLElement).dataset.index)
            if (!Number.isInteger(index) || isHandleLocked(index)) return false

            activeHandle = index
            startSizes = [...layout]
            dragSize = contentSize()
            rememberSize(index)
            rememberSize(index + 1)
            onResizeStart?.(index)
        },
        onMove: ({ dx, dy }) => applyDrag(dx, dy),
        onEnd: () => {
            activeHandle = null
            onResizeEnd?.(layout)
        }
    })

    function toggleAt(index: number) {
        const pane = panes[index]
        if (!pane || !constraints[index].collapsible) return

        if (isCollapsed(layout[index], constraints[index])) {
            commit(expandPane(layout, index, constraints, restored.get(pane.id)))
            return
        }

        rememberSize(index)
        commit(collapsePane(layout, index, constraints))
    }

    function arrowDelta(event: KeyboardEvent): number | null {
        const step = event.shiftKey ? keyboardStep * 2 : keyboardStep
        const forward = resolvedDirection === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
        const backward = resolvedDirection === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'

        if (event.key === forward) return step
        if (event.key === backward) return -step

        return null
    }

    function runHandleShortcut(event: KeyboardEvent, index: number) {
        if (event.key === 'Home')
            commit(setPaneSize(layout, index, constraints[index].min, constraints))
        else if (event.key === 'End')
            commit(setPaneSize(layout, index, constraints[index].max, constraints))
        else if (event.key === 'Enter') toggleAt(index)
        else return false

        return true
    }

    function handleKeydown(event: KeyboardEvent, index: number) {
        if (disabled || isHandleLocked(index)) return

        const delta = arrowDelta(event)
        if (delta === null) {
            if (runHandleShortcut(event, index)) event.preventDefault()
            return
        }

        event.preventDefault()
        commit(resizeAt(layout, index, delta, constraints))
    }

    function handleDoubleClick(index: number) {
        if (disabled || isHandleLocked(index)) return

        commit(resetPair(layout, index, defaultSizes(panes), constraints))
    }

    const currentApi = $derived<ResizableApi>({
        collapse: (id: string) => {
            const index = indexOfPane(id)
            if (index < 0) return

            rememberSize(index)
            commit(collapsePane(layout, index, constraints), false)
        },
        expand: (id: string) => {
            const index = indexOfPane(id)
            if (index < 0) return

            commit(expandPane(layout, index, constraints, restored.get(id)), false)
        },
        toggle: (id: string) => {
            const index = indexOfPane(id)
            if (index >= 0) toggleAt(index)
        },
        resize: (id: string, size: number) => {
            const index = indexOfPane(id)
            if (index < 0) return

            commit(setPaneSize(layout, index, size, constraints), false)
        },
        setSizes: (next: number[]) => {
            if (next.length !== panes.length) return

            commit(normalizeSizes(next), false)
        },
        reset: () => commit(defaultSizes(panes), false),
        get sizes() {
            return layout
        },
        get collapsed() {
            return collapsedIds
        }
    })

    $effect(() => {
        api = currentApi
    })

    const variantSlots = $derived(
        resizableVariants({ direction: resolvedDirection, color, size, disabled })
    )

    const classes = $derived.by(() => {
        const u = ui ?? {}
        return {
            root: variantSlots.root({ class: [config.slots.root, className, u.root] }),
            pane: variantSlots.pane({ class: [config.slots.pane, u.pane] }),
            handle: variantSlots.handle({ class: [config.slots.handle, u.handle] }),
            grip: variantSlots.grip({ class: [config.slots.grip, u.grip] })
        }
    })

    function paneClass(pane: { class?: unknown }) {
        return variantSlots.pane({
            class: [config.slots.pane, pane.class as string | undefined, ui?.pane]
        })
    }

    function isHandleLocked(index: number) {
        return constraints[index].locked || constraints[index + 1].locked
    }

    function handleLabel(index: number) {
        const base = labels?.handle ?? 'Resize panes'

        return panes.length > 2 ? `${base} ${index + 1}` : base
    }
</script>

<div
    {...restProps}
    bind:this={ref}
    class={classes.root}
    data-direction={resolvedDirection}
    data-dragging={activeHandle !== null ? '' : undefined}
>
    {#each panes as pane, index (pane.id)}
        {@const paneSize = layout[index] ?? 0}
        {@const paneCollapsed = isCollapsed(paneSize, constraints[index])}
        <div
            bind:this={paneEls[index]}
            id={paneId(index)}
            class={paneClass(pane)}
            style="flex: {paneSize} 1 0px;"
            data-collapsed={paneCollapsed ? '' : undefined}
            inert={paneCollapsed || undefined}
        >
            {@render pane.content?.({ pane, index, size: paneSize, collapsed: paneCollapsed })}
        </div>

        {#if index < panes.length - 1}
            {@const locked = isHandleLocked(index)}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
                role="separator"
                tabindex={disabled || locked ? -1 : 0}
                class={classes.handle}
                aria-label={handleLabel(index)}
                aria-orientation={resolvedDirection === 'horizontal' ? 'vertical' : 'horizontal'}
                aria-controls={paneId(index)}
                aria-valuenow={Math.round(paneSize)}
                aria-valuemin={Math.round(constraints[index].min)}
                aria-valuemax={Math.round(constraints[index].max)}
                aria-valuetext="{Math.round(paneSize)}%"
                aria-disabled={disabled || locked ? true : undefined}
                data-locked={locked ? '' : undefined}
                data-active={activeHandle === index ? '' : undefined}
                data-index={index}
                {...drag.handlers}
                ondblclick={() => handleDoubleClick(index)}
                onkeydown={(event) => handleKeydown(event, index)}
            >
                {#if handle}
                    {@render handle({
                        index,
                        active: activeHandle === index,
                        direction: resolvedDirection
                    })}
                {:else}
                    <span class={classes.grip}></span>
                {/if}
            </div>
        {/if}
    {/each}
</div>
