import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tour from './Tour.svelte'
import { useTour } from '../../hooks/useTour/index.js'
import type { TourController, TourStep } from './tour.types.js'

const dialogSteps: TourStep[] = [
    { id: 'a', title: 'Welcome', description: 'Step one', target: null, disableSpotlight: true },
    { id: 'b', title: 'Middle', description: 'Step two', target: null, disableSpotlight: true },
    { id: 'c', title: 'End', description: 'Last step', target: null, disableSpotlight: true }
]

function makeController(opts: Parameters<typeof useTour>[0]) {
    let api!: TourController
    const cleanup = $effect.root(() => {
        api = useTour(opts)
    })
    flushSync()
    return { api, cleanup }
}

const panel = () => document.body.querySelector('[role="dialog"]') as HTMLElement | null

describe('Tour', () => {
    it('renders nothing until started', () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api })
        flushSync()
        expect(panel()).toBeNull()
        cleanup()
    })

    it('shows the panel with the current step when started', async () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start()
        flushSync()

        await vi.waitFor(() => {
            const p = panel()
            expect(p).not.toBeNull()
            expect(p!.textContent).toContain('Welcome')
        })
        cleanup()
    })

    it('advances and goes back through the controller', async () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Welcome'))

        api.next()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Middle'))

        api.prev()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Welcome'))
        cleanup()
    })

    it('closes after completing the last step', async () => {
        const onComplete = vi.fn()
        const { api, cleanup } = makeController({ steps: dialogSteps, onComplete })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start(2)
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Last step'))

        api.next()
        flushSync()
        await vi.waitFor(() => expect(panel()).toBeNull())
        expect(onComplete).toHaveBeenCalledTimes(1)
        cleanup()
    })

    it('renders progress dots for each step', async () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => {
            const dots = panel()!.querySelectorAll('span.rounded-full')
            expect(dots.length).toBe(3)
        })
        cleanup()
    })

    it('positions against a real target element', async () => {
        const target = document.createElement('button')
        target.id = 'tour-target-test'
        target.textContent = 'Target'
        document.body.appendChild(target)

        const steps: TourStep[] = [
            {
                id: 'x',
                title: 'Anchored',
                description: 'Points at the button',
                target: '#tour-target-test'
            }
        ]
        const { api, cleanup } = makeController({ steps })
        render(Tour, { steps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => {
            const p = panel()
            expect(p).not.toBeNull()
            expect(p!.style.position).toBe('fixed')
        })

        cleanup()
        target.remove()
    })

    it('advances and retreats with arrow keys', async () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Welcome'))

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Middle'))

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Welcome'))
        cleanup()
    })

    it('closes on Escape only when dismissible', async () => {
        const { api, cleanup } = makeController({ steps: dialogSteps })
        render(Tour, { steps: dialogSteps, controller: api, dismissible: false })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()).not.toBeNull())

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        flushSync()
        expect(panel()).not.toBeNull()
        cleanup()
    })

    it('blocks navigation when onBeforeNext returns false', async () => {
        let allow = false
        const steps: TourStep[] = [
            {
                id: 'a',
                title: 'Gate',
                description: 'guarded',
                target: null,
                onBeforeNext: () => allow
            },
            { id: 'b', title: 'Passed', description: 'after gate', target: null }
        ]
        const { api, cleanup } = makeController({ steps })
        render(Tour, { steps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Gate'))

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        flushSync()
        await new Promise((r) => setTimeout(r, 20))
        expect(panel()?.textContent).toContain('Gate')

        allow = true
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Passed'))
        cleanup()
    })

    it('waits for a late-rendered target', async () => {
        const steps: TourStep[] = [
            {
                id: 'late',
                title: 'Late',
                description: 'appears soon',
                target: '#late-target',
                waitForTarget: 2000
            }
        ]
        const { api, cleanup } = makeController({ steps })
        render(Tour, { steps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Late'))

        const late = document.createElement('div')
        late.id = 'late-target'
        late.textContent = 'here'
        document.body.appendChild(late)

        await vi.waitFor(() => expect(panel()?.style.position).toBe('fixed'))
        cleanup()
        late.remove()
    })

    it('fires onSkip when dismissed before completing', async () => {
        const onSkip = vi.fn()
        const { api, cleanup } = makeController({ steps: dialogSteps, onSkip })
        render(Tour, { steps: dialogSteps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()).not.toBeNull())

        api.stop()
        flushSync()
        expect(onSkip).toHaveBeenCalledWith(0)
        cleanup()
    })

    it('does not loop when onEnter reads and writes reactive state', async () => {
        const calls: number[] = []
        let counter = $state(0)
        const steps: TourStep[] = [
            {
                id: 'e',
                title: 'Enter',
                description: 'mutates state',
                target: null,
                onEnter: () => {
                    counter = counter + 1
                    calls.push(counter)
                }
            }
        ]
        const { api, cleanup } = makeController({ steps })
        render(Tour, { steps, controller: api })

        api.start()
        flushSync()
        await vi.waitFor(() => expect(panel()?.textContent).toContain('Enter'))
        await new Promise((r) => setTimeout(r, 50))

        expect(calls.length).toBe(1)
        cleanup()
    })
})
