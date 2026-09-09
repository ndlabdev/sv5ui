import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render } from 'vitest-browser-svelte'
import ResizableTestWrapper from './ResizableTestWrapper.svelte'
import type { ResizableApi, ResizablePane } from './resizable.types.js'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

const basicPanes: ResizablePane[] = [
    { id: 'left', defaultSize: 50, content: snippet('<p>left pane</p>') },
    { id: 'right', defaultSize: 50, content: snippet('<p>right pane</p>') }
]

const getHandles = () => document.querySelectorAll('[role="separator"]')
const getHandle = (index = 0) => getHandles()[index] as HTMLElement
const paneSize = (index: number) => {
    const element = document.querySelectorAll('[style*="flex:"]')[index] as HTMLElement
    return Number.parseFloat(element.style.flexGrow)
}

function pointerEvent(type: string, x: number, y: number, pointerId = 1) {
    return new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId,
        isPrimary: true,
        button: 0,
        buttons: 1,
        pointerType: 'mouse'
    })
}

function dragHandle(index: number, dx: number, dy = 0) {
    const handle = getHandle(index)
    const rect = handle.getBoundingClientRect()
    const from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

    handle.dispatchEvent(pointerEvent('pointerdown', from.x, from.y))
    handle.dispatchEvent(pointerEvent('pointermove', from.x + dx, from.y + dy))
    handle.dispatchEvent(pointerEvent('pointerup', from.x + dx, from.y + dy))
}

function press(key: string, index = 0, shiftKey = false) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    Object.defineProperty(event, 'shiftKey', { value: shiftKey })
    getHandle(index).dispatchEvent(event)

    return event
}

async function renderGroup(props: Record<string, unknown> = {}) {
    let api: ResizableApi | undefined
    render(ResizableTestWrapper, {
        props: {
            panes: basicPanes,
            onReady: (next: ResizableApi) => {
                api = next
            },
            ...props
        }
    })

    await vi.waitFor(() => expect(api).toBeDefined())
    await vi.waitFor(() => {
        const root = document.querySelector('[data-direction]') as HTMLElement
        expect(root.getBoundingClientRect().width).toBeGreaterThan(0)
    })
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

    return () => api!
}

describe('Resizable', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
        localStorage.clear()
        const style = document.createElement('style')
        style.textContent = [
            '[data-direction] { display: flex; width: 400px; height: 200px; }',
            '[data-direction="horizontal"] { flex-direction: row; }',
            '[data-direction="vertical"] { flex-direction: column; }',
            '[role="separator"] { flex: 0 0 6px; }'
        ].join('\n')
        document.head.appendChild(style)
    })

    describe('rendering', () => {
        it('should render every pane and one handle between them', async () => {
            await renderGroup()

            expect(document.body.textContent).toContain('left pane')
            expect(document.body.textContent).toContain('right pane')
            expect(getHandles()).toHaveLength(1)
        })

        it('should render one handle less than the number of panes', async () => {
            await renderGroup({
                panes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
            })

            expect(getHandles()).toHaveLength(2)
        })

        it('should apply the declared default sizes', async () => {
            await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 30 },
                    { id: 'b', defaultSize: 70 }
                ]
            })

            expect(paneSize(0)).toBeCloseTo(30, 1)
            expect(paneSize(1)).toBeCloseTo(70, 1)
        })

        it('should share the remaining space between panes without a default', async () => {
            await renderGroup({ panes: [{ id: 'a', defaultSize: 50 }, { id: 'b' }, { id: 'c' }] })

            expect(paneSize(1)).toBeCloseTo(25, 1)
            expect(paneSize(2)).toBeCloseTo(25, 1)
        })

        it('should point each handle at the pane it resizes', async () => {
            await renderGroup()

            expect(getHandle().getAttribute('aria-controls')).toBe(
                (document.querySelector('[style*="flex:"]') as HTMLElement).id
            )
        })

        it('should render a custom handle snippet', async () => {
            await renderGroup({ handle: snippet('<span>grip</span>') })

            expect(document.body.textContent).toContain('grip')
        })

        it('should apply ui overrides and per-pane classes', async () => {
            await renderGroup({
                ui: { handle: 'ring-4' },
                panes: [{ id: 'a', class: 'bg-red-500' }, { id: 'b' }]
            })

            expect(getHandle().className).toContain('ring-4')
            expect((document.querySelector('[style*="flex:"]') as HTMLElement).className).toContain(
                'bg-red-500'
            )
        })
    })

    describe('dragging', () => {
        it('should grow the first pane when dragged forward', async () => {
            const api = await renderGroup()

            dragHandle(0, 40)

            expect(api().sizes[0]).toBeGreaterThan(55)
            expect(api().sizes[0] + api().sizes[1]).toBeCloseTo(100, 1)
        })

        it('should grow the second pane when dragged backward', async () => {
            const api = await renderGroup()

            dragHandle(0, -40)

            expect(api().sizes[1]).toBeGreaterThan(55)
        })

        it('should respect a percentage minimum', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a' }, { id: 'b', minSize: 30 }]
            })

            dragHandle(0, 400)

            expect(api().sizes[1]).toBeCloseTo(30, 0)
        })

        it('should respect a pixel minimum', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a' }, { id: 'b', minSize: '100px' }]
            })

            dragHandle(0, 400)

            expect(api().sizes[1]).toBeGreaterThan(20)
            expect(api().sizes[1]).toBeLessThan(30)
        })

        it('should cascade into the third pane once the neighbour is at its minimum', async () => {
            const api = await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 20 },
                    { id: 'b', defaultSize: 40, minSize: 10 },
                    { id: 'c', defaultSize: 40, minSize: 10 }
                ]
            })

            dragHandle(0, 200)

            expect(api().sizes[1]).toBeCloseTo(10, 0)
            expect(api().sizes[2]).toBeLessThan(40)
        })

        it('should collapse a collapsible pane dragged shut', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a' }, { id: 'b', minSize: 20, collapsible: true }]
            })

            dragHandle(0, 400)

            expect(api().sizes[1]).toBe(0)
            expect(api().collapsed).toEqual(['b'])
        })

        it('should mark the dragged handle while it is active', async () => {
            await renderGroup()
            const handle = getHandle()
            const rect = handle.getBoundingClientRect()

            handle.dispatchEvent(pointerEvent('pointerdown', rect.left, rect.top))
            await vi.waitFor(() => expect(handle.hasAttribute('data-active')).toBe(true))

            handle.dispatchEvent(pointerEvent('pointerup', rect.left, rect.top))
            await vi.waitFor(() => expect(handle.hasAttribute('data-active')).toBe(false))
        })

        it('should ignore dragging while disabled', async () => {
            const api = await renderGroup({ disabled: true })

            dragHandle(0, 60)

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should drag along the vertical axis', async () => {
            const api = await renderGroup({ direction: 'vertical' })

            dragHandle(0, 0, 40)

            expect(api().sizes[0]).toBeGreaterThan(55)
        })
    })

    describe('keyboard', () => {
        it('should resize with the arrow keys', async () => {
            const api = await renderGroup()

            press('ArrowRight')

            expect(api().sizes[0]).toBeCloseTo(55, 1)
        })

        it('should take a bigger step with shift held', async () => {
            const api = await renderGroup()

            press('ArrowRight', 0, true)

            expect(api().sizes[0]).toBeCloseTo(60, 1)
        })

        it('should honour a custom keyboardStep', async () => {
            const api = await renderGroup({ keyboardStep: 20 })

            press('ArrowLeft')

            expect(api().sizes[0]).toBeCloseTo(30, 1)
        })

        it('should use the vertical arrows for a vertical group', async () => {
            const api = await renderGroup({ direction: 'vertical' })

            press('ArrowDown')

            expect(api().sizes[0]).toBeCloseTo(55, 1)
        })

        it('should jump to the minimum and maximum with Home and End', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a', minSize: 20, maxSize: 80 }, { id: 'b' }]
            })

            press('Home')
            expect(api().sizes[0]).toBeCloseTo(20, 0)

            press('End')
            expect(api().sizes[0]).toBeCloseTo(80, 0)
        })

        it('should toggle a collapsible pane with Enter', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a', minSize: 20, collapsible: true }, { id: 'b' }]
            })

            press('Enter')
            expect(api().collapsed).toEqual(['a'])

            press('Enter')
            expect(api().collapsed).toEqual([])
        })

        it('should not swallow unrelated keys', async () => {
            await renderGroup()

            expect(press('Tab').defaultPrevented).toBe(false)
        })

        it('should ignore keys while disabled', async () => {
            const api = await renderGroup({ disabled: true })

            press('ArrowRight')

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should reset the pair on a double click', async () => {
            const api = await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 30 },
                    { id: 'b', defaultSize: 70 }
                ]
            })

            press('ArrowRight')
            expect(api().sizes[0]).toBeCloseTo(35, 1)

            getHandle().dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
            expect(api().sizes[0]).toBeCloseTo(30, 1)
        })
    })

    describe('api', () => {
        const collapsible: ResizablePane[] = [
            { id: 'a', defaultSize: 30, minSize: 20, collapsible: true },
            { id: 'b', defaultSize: 70 }
        ]

        it('should collapse and expand back to the previous size', async () => {
            const api = await renderGroup({ panes: collapsible })

            api().collapse('a')
            expect(api().sizes[0]).toBe(0)
            expect(api().collapsed).toEqual(['a'])

            api().expand('a')
            expect(api().sizes[0]).toBeCloseTo(30, 0)
            expect(api().collapsed).toEqual([])
        })

        it('should toggle a pane', async () => {
            const api = await renderGroup({ panes: collapsible })

            api().toggle('a')
            expect(api().collapsed).toEqual(['a'])

            api().toggle('a')
            expect(api().collapsed).toEqual([])
        })

        it('should ignore an unknown pane id', async () => {
            const api = await renderGroup({ panes: collapsible })

            api().collapse('nope')

            expect(api().sizes[0]).toBeCloseTo(30, 1)
        })

        it('should resize one pane by id', async () => {
            const api = await renderGroup()

            api().resize('left', 70)

            expect(api().sizes[0]).toBeCloseTo(70, 1)
            expect(api().sizes[0] + api().sizes[1]).toBeCloseTo(100, 1)
        })

        it('should ignore a resize for an unknown pane', async () => {
            const api = await renderGroup()

            api().resize('nope', 70)

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should set an explicit layout', async () => {
            const api = await renderGroup()

            api().setSizes([25, 75])

            expect(api().sizes[0]).toBeCloseTo(25, 1)
        })

        it('should ignore a layout with the wrong number of panes', async () => {
            const api = await renderGroup()

            api().setSizes([25, 25, 50])

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should reset to the declared defaults', async () => {
            const api = await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 30 },
                    { id: 'b', defaultSize: 70 }
                ]
            })

            api().setSizes([80, 20])
            api().reset()

            expect(api().sizes[0]).toBeCloseTo(30, 1)
        })
    })

    describe('callbacks', () => {
        it('should report every layout change', async () => {
            const onSizesChange = vi.fn()
            await renderGroup({ onSizesChange })
            onSizesChange.mockClear()

            press('ArrowRight')

            await vi.waitFor(() => {
                expect(onSizesChange).toHaveBeenCalled()
                expect(onSizesChange.mock.lastCall![0][0]).toBeCloseTo(55, 1)
            })
        })

        it('should bracket a drag with onResizeStart and onResizeEnd', async () => {
            const onResizeStart = vi.fn()
            const onResizeEnd = vi.fn()
            await renderGroup({ onResizeStart, onResizeEnd })

            dragHandle(0, 30)

            expect(onResizeStart).toHaveBeenCalledWith(0)
            expect(onResizeEnd).toHaveBeenCalledTimes(1)
        })

        it('should report a pane collapsing and coming back', async () => {
            const onCollapse = vi.fn()
            const api = await renderGroup({
                panes: [{ id: 'a', minSize: 20, collapsible: true }, { id: 'b' }],
                onCollapse
            })

            api().collapse('a')
            await vi.waitFor(() => expect(onCollapse).toHaveBeenCalledWith('a', true))

            api().expand('a')
            await vi.waitFor(() => expect(onCollapse).toHaveBeenCalledWith('a', false))
        })
    })

    describe('persistence', () => {
        it('should write the layout under the storage key', async () => {
            const api = await renderGroup({ storageKey: 'sv5ui-test-layout' })

            api().setSizes([70, 30])

            await vi.waitFor(() => {
                const stored = JSON.parse(localStorage.getItem('sv5ui-test-layout') ?? '{}')
                expect(stored.ids).toEqual(['left', 'right'])
                expect(stored.sizes[0]).toBeCloseTo(70, 1)
            })
        })

        it('should restore a stored layout on mount', async () => {
            localStorage.setItem(
                'sv5ui-test-restore',
                JSON.stringify({ ids: ['left', 'right'], sizes: [25, 75] })
            )
            const api = await renderGroup({ storageKey: 'sv5ui-test-restore' })

            await vi.waitFor(() => expect(api().sizes[0]).toBeCloseTo(25, 1))
        })

        it('should ignore a stored layout that no longer matches the panes', async () => {
            localStorage.setItem(
                'sv5ui-test-stale',
                JSON.stringify({ ids: ['left', 'right', 'extra'], sizes: [20, 30, 50] })
            )
            const api = await renderGroup({ storageKey: 'sv5ui-test-stale' })

            await vi.waitFor(() => expect(api().sizes[0]).toBeCloseTo(50, 1))
        })

        it('should ignore a stored layout whose pane ids changed', async () => {
            localStorage.setItem(
                'sv5ui-test-renamed',
                JSON.stringify({ ids: ['left', 'other'], sizes: [25, 75] })
            )
            const api = await renderGroup({ storageKey: 'sv5ui-test-renamed' })

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should ignore malformed stored data', async () => {
            localStorage.setItem('sv5ui-test-broken', 'not json')
            const api = await renderGroup({ storageKey: 'sv5ui-test-broken' })

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })
    })

    describe('robustness', () => {
        it('should opt the handle out of browser touch scrolling', async () => {
            await renderGroup()

            expect(getHandle().className).toContain('touch-none')
        })

        it('should widen the hit area beyond the visible handle', async () => {
            await renderGroup()

            expect(getHandle().className).toContain('before:-inset-x-2')
        })

        it('should suppress text selection only while dragging', async () => {
            await renderGroup()
            const root = document.querySelector('[data-direction]') as HTMLElement
            const handle = getHandle()
            const rect = handle.getBoundingClientRect()

            expect(root.hasAttribute('data-dragging')).toBe(false)

            handle.dispatchEvent(pointerEvent('pointerdown', rect.left, rect.top))
            await vi.waitFor(() => expect(root.hasAttribute('data-dragging')).toBe(true))

            handle.dispatchEvent(pointerEvent('pointerup', rect.left, rect.top))
            await vi.waitFor(() => expect(root.hasAttribute('data-dragging')).toBe(false))
        })

        it('should take a collapsed pane out of the tab order', async () => {
            const api = await renderGroup({
                panes: [
                    {
                        id: 'a',
                        minSize: 20,
                        collapsible: true,
                        content: snippet('<button>hidden</button>')
                    },
                    { id: 'b' }
                ]
            })
            const pane = document.querySelector('[style*="flex:"]') as HTMLElement

            expect(pane.hasAttribute('inert')).toBe(false)

            api().collapse('a')
            await vi.waitFor(() => expect(pane.hasAttribute('inert')).toBe(true))

            api().expand('a')
            await vi.waitFor(() => expect(pane.hasAttribute('inert')).toBe(false))
        })

        it('should pull a pane back to a pixel minimum after the group shrinks', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a', minSize: '150px' }, { id: 'b' }]
            })
            const root = document.querySelector('[data-direction]') as HTMLElement

            api().setSizes([20, 80])
            await vi.waitFor(() => expect(api().sizes[0]).toBeCloseTo(37.5, 0))

            root.style.width = '200px'
            await vi.waitFor(() => expect(api().sizes[0]).toBeCloseTo(75, 0), { timeout: 2000 })
        })
    })

    describe('efficiency', () => {
        it('should not write to storage on every dragged frame', async () => {
            await renderGroup({ storageKey: 'sv5ui-test-throttle' })
            const handle = getHandle()
            const rect = handle.getBoundingClientRect()
            const from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

            await vi.waitFor(() =>
                expect(localStorage.getItem('sv5ui-test-throttle')).not.toBeNull()
            )
            localStorage.removeItem('sv5ui-test-throttle')

            handle.dispatchEvent(pointerEvent('pointerdown', from.x, from.y))
            handle.dispatchEvent(pointerEvent('pointermove', from.x + 20, from.y))
            handle.dispatchEvent(pointerEvent('pointermove', from.x + 40, from.y))
            await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

            expect(localStorage.getItem('sv5ui-test-throttle')).toBeNull()

            handle.dispatchEvent(pointerEvent('pointerup', from.x + 40, from.y))

            await vi.waitFor(() => {
                const stored = JSON.parse(localStorage.getItem('sv5ui-test-throttle') ?? '{}')
                expect(stored.sizes[0]).toBeGreaterThan(55)
            })
        })

        it('should not touch the layout when a handle is clicked without moving', async () => {
            const onSizesChange = vi.fn()
            const api = await renderGroup({ onSizesChange })
            await vi.waitFor(() => expect(onSizesChange).toHaveBeenCalled())
            onSizesChange.mockClear()

            const handle = getHandle()
            const rect = handle.getBoundingClientRect()
            const point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

            handle.dispatchEvent(pointerEvent('pointerdown', point.x, point.y))
            handle.dispatchEvent(pointerEvent('pointerup', point.x, point.y))
            await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

            expect(api().sizes[0]).toBeCloseTo(50, 1)
            expect(onSizesChange).not.toHaveBeenCalled()
        })

        it('should keep resizing when the pointer leaves the handle', async () => {
            const api = await renderGroup()
            const handle = getHandle()
            const rect = handle.getBoundingClientRect()
            const from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            const root = document.querySelector('[data-direction]') as HTMLElement

            handle.dispatchEvent(pointerEvent('pointerdown', from.x, from.y))
            await vi.waitFor(() => expect(root.hasAttribute('data-dragging')).toBe(true))

            window.dispatchEvent(pointerEvent('pointermove', from.x + 60, from.y + 400))
            window.dispatchEvent(pointerEvent('pointerup', from.x + 60, from.y + 400))

            await vi.waitFor(() => expect(api().sizes[0]).toBeGreaterThan(58))
        })

        it('should reset only the pair around a double clicked handle', async () => {
            const api = await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 20 },
                    { id: 'b', defaultSize: 30 },
                    { id: 'c', defaultSize: 50 }
                ]
            })

            api().setSizes([50, 10, 40])
            getHandle(0).dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

            expect(api().sizes[0]).toBeCloseTo(20, 0)
            expect(api().sizes[1]).toBeCloseTo(40, 0)
            expect(api().sizes[2]).toBeCloseTo(40, 0)
        })

        it('should start from a layout given through the sizes prop', async () => {
            const api = await renderGroup({ sizes: [70, 30] })

            expect(api().sizes[0]).toBeCloseTo(70, 1)
        })
    })

    describe('dynamic panes', () => {
        it('should keep the sizes of the panes that stay', async () => {
            let api: ResizableApi | undefined
            const onReady = (next: ResizableApi) => (api = next)
            const screen = render(ResizableTestWrapper, {
                props: {
                    panes: [
                        { id: 'a', defaultSize: 30 },
                        { id: 'b', defaultSize: 70 }
                    ],
                    onReady
                }
            })

            await vi.waitFor(() => expect(api?.sizes[0]).toBeCloseTo(30, 1))
            await screen.rerender({
                panes: [
                    { id: 'a', defaultSize: 30 },
                    { id: 'b', defaultSize: 70 },
                    { id: 'c', defaultSize: 20 }
                ],
                onReady
            })

            await vi.waitFor(() => {
                expect(api!.sizes).toHaveLength(3)
                expect(api!.sizes[2]).toBeCloseTo(16.7, 0)
                expect(api!.sizes[0] / api!.sizes[1]).toBeCloseTo(30 / 70, 1)
            })
        })

        it('should share out the space of a removed pane', async () => {
            let api: ResizableApi | undefined
            const onReady = (next: ResizableApi) => (api = next)
            const screen = render(ResizableTestWrapper, {
                props: {
                    panes: [
                        { id: 'a', defaultSize: 20 },
                        { id: 'b', defaultSize: 30 },
                        { id: 'c', defaultSize: 50 }
                    ],
                    onReady
                }
            })

            await vi.waitFor(() => expect(api?.sizes).toHaveLength(3))
            await screen.rerender({
                panes: [
                    { id: 'a', defaultSize: 20 },
                    { id: 'c', defaultSize: 50 }
                ],
                onReady
            })

            await vi.waitFor(() => {
                expect(api!.sizes).toHaveLength(2)
                expect(api!.sizes[0] + api!.sizes[1]).toBeCloseTo(100, 1)
                expect(api!.sizes[0]).toBeCloseTo(28.6, 0)
            })
        })
    })

    describe('locked panes', () => {
        it('should refuse to drag a handle next to a pinned pane', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a', resizable: false }, { id: 'b' }]
            })

            dragHandle(0, 60)

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should take a pinned handle out of the tab order', async () => {
            await renderGroup({ panes: [{ id: 'a', resizable: false }, { id: 'b' }] })

            expect(getHandle().tabIndex).toBe(-1)
            expect(getHandle().getAttribute('aria-disabled')).toBe('true')
            expect(getHandle().hasAttribute('data-locked')).toBe(true)
        })

        it('should ignore the keyboard on a pinned handle', async () => {
            const api = await renderGroup({
                panes: [{ id: 'a', resizable: false }, { id: 'b' }]
            })

            press('ArrowRight')

            expect(api().sizes[0]).toBeCloseTo(50, 1)
        })

        it('should keep a pinned pane out of a cascade from another handle', async () => {
            const api = await renderGroup({
                panes: [
                    { id: 'a', defaultSize: 25 },
                    { id: 'b', defaultSize: 25 },
                    { id: 'c', defaultSize: 25, resizable: false },
                    { id: 'd', defaultSize: 25 }
                ]
            })

            dragHandle(0, 160)

            expect(api().sizes[2]).toBeCloseTo(25, 0)
        })
    })

    describe('labels', () => {
        it('should announce the size as a percentage', async () => {
            await renderGroup({ panes: [{ id: 'a', defaultSize: 40 }, { id: 'b' }] })

            expect(getHandle().getAttribute('aria-valuetext')).toBe('40%')
        })

        it('should override the handle label', async () => {
            await renderGroup({ labels: { handle: 'Keo de chia' } })

            expect(getHandle().getAttribute('aria-label')).toBe('Keo de chia')
        })

        it('should number the handles when there are more than two panes', async () => {
            await renderGroup({ panes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })

            expect(getHandle(0).getAttribute('aria-label')).toBe('Resize panes 1')
            expect(getHandle(1).getAttribute('aria-label')).toBe('Resize panes 2')
        })
    })
})
