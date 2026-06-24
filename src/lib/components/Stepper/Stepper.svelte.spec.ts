import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Stepper from './Stepper.svelte'
import type { StepperApi, StepperItem } from './stepper.types.js'

describe('Stepper', () => {
    const sampleItems: StepperItem[] = [
        { value: 'a', title: 'Step A', description: 'First step' },
        { value: 'b', title: 'Step B', description: 'Second step' },
        { value: 'c', title: 'Step C', description: 'Third step' }
    ]

    const getRoot = (container: Element) => container.firstElementChild as HTMLElement
    const getItems = (container: Element) =>
        container.querySelectorAll('[data-stepper-item]') as NodeListOf<HTMLLIElement>
    const getTriggers = (container: Element) =>
        container.querySelectorAll('[data-stepper-item] > button') as NodeListOf<HTMLButtonElement>
    const getIndicators = (container: Element) =>
        container.querySelectorAll('[data-stepper-indicator]') as NodeListOf<HTMLElement>
    const getSeparators = (container: Element) =>
        container.querySelectorAll('[data-stepper-separator]') as NodeListOf<HTMLElement>
    const getContents = (container: Element) =>
        container.querySelectorAll('[data-stepper-content]') as NodeListOf<HTMLElement>

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('renders root element', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(getRoot(container)).not.toBeNull()
        })

        it('renders as div by default', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('renders as custom element', () => {
            const { container } = render(Stepper, { items: sampleItems, as: 'section' })
            expect(getRoot(container).tagName).toBe('SECTION')
        })

        it('renders correct number of items', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(getItems(container).length).toBe(3)
        })

        it('renders item titles', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(container.textContent).toContain('Step A')
            expect(container.textContent).toContain('Step B')
            expect(container.textContent).toContain('Step C')
        })

        it('renders item descriptions', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(container.textContent).toContain('First step')
        })

        it('renders n-1 separators for n items', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(getSeparators(container).length).toBe(2)
        })

        it('renders numeric indicator for pending/active steps', () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'a' })
            const indicators = getIndicators(container)
            expect(indicators[0].textContent?.trim()).toBe('1')
            expect(indicators[1].textContent?.trim()).toBe('2')
            expect(indicators[2].textContent?.trim()).toBe('3')
        })

        it('renders check icon for completed steps', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'c' })
            const indicators = getIndicators(container)
            expect(indicators[0].textContent?.trim()).not.toBe('1')
            expect(indicators[1].textContent?.trim()).not.toBe('2')
        })

        it('honors item.icon over default indicator', async () => {
            const items = [
                { value: 1, title: 'Step', icon: 'lucide:star' },
                { value: 2, title: 'Step 2' }
            ]
            const { container } = render(Stepper, { items, value: 1 })
            const indicators = getIndicators(container)
            expect(indicators[0].textContent?.trim()).not.toBe('1')
        })
    })

    // ==================== STATE MANAGEMENT ====================

    describe('state management', () => {
        it('defaults active to first item when value omitted', () => {
            const { container } = render(Stepper, { items: sampleItems })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('active')
            expect(items[1].getAttribute('data-state')).toBe('pending')
        })

        it('uses defaultValue when value undefined', () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                defaultValue: 'b'
            })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('active')
        })

        it('marks active item correctly via value', () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'b' })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('active')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('marks all items pending when value matches nothing', () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                value: 'no-such-value'
            })
            const items = getItems(container)
            items.forEach((item) => {
                expect(item.getAttribute('data-state')).toBe('pending')
            })
        })

        it('supports numeric values', () => {
            const items = [
                { value: 0, title: 'A' },
                { value: 1, title: 'B' },
                { value: 2, title: 'C' }
            ]
            const { container } = render(Stepper, { items, value: 1 })
            const els = getItems(container)
            expect(els[0].getAttribute('data-state')).toBe('completed')
            expect(els[1].getAttribute('data-state')).toBe('active')
        })

        it('falls back to index when value omitted on items', () => {
            const items = [{ title: 'A' }, { title: 'B' }, { title: 'C' }]
            const { container } = render(Stepper, { items, value: 1 })
            const els = getItems(container)
            expect(els[1].getAttribute('data-state')).toBe('active')
        })
    })

    // ==================== CLICK NAVIGATION ====================

    describe('click navigation', () => {
        it('activates the next step on click when linear (one step forward allowed)', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'a' })
            const triggers = getTriggers(container)
            await triggers[1].click()
            await vi.waitFor(() => {
                expect(getItems(container)[1].getAttribute('data-state')).toBe('active')
            })
        })

        it('allows clicking back to completed steps when linear', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'b' })
            const triggers = getTriggers(container)
            await triggers[0].click()
            await vi.waitFor(() => {
                expect(getItems(container)[0].getAttribute('data-state')).toBe('active')
            })
        })

        it('blocks jumping past pending step when linear', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'a' })
            const triggers = getTriggers(container)
            expect(triggers[2].hasAttribute('disabled')).toBe(true)
        })

        it('allows free navigation when linear=false', async () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                value: 'a',
                linear: false
            })
            const triggers = getTriggers(container)
            await triggers[2].click()
            await vi.waitFor(() => {
                expect(getItems(container)[2].getAttribute('data-state')).toBe('active')
            })
        })

        it('fires onValueChange with new value', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Stepper, {
                items: sampleItems,
                value: 'a',
                onValueChange
            })
            await getTriggers(container)[1].click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith('b')
            })
        })
    })

    // ==================== DISABLED ====================

    describe('disabled state', () => {
        it('disables every trigger when disabled=true', () => {
            const { container } = render(Stepper, { items: sampleItems, disabled: true })
            const triggers = getTriggers(container)
            triggers.forEach((t) => {
                expect(t.hasAttribute('disabled')).toBe(true)
            })
        })

        it('disables individual item', () => {
            const items: StepperItem[] = [
                { value: 'a', title: 'A' },
                { value: 'b', title: 'B', disabled: true },
                { value: 'c', title: 'C' }
            ]
            const { container } = render(Stepper, { items, value: 'a', linear: false })
            const triggers = getTriggers(container)
            expect(triggers[1].hasAttribute('disabled')).toBe(true)
            expect(triggers[0].hasAttribute('disabled')).toBe(false)
        })
    })

    // ==================== IMPERATIVE API ====================

    describe('imperative API', () => {
        it('exposes api via bind', async () => {
            let api: StepperApi | undefined
            const TestHarness = {
                items: sampleItems,
                value: 'a',
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            }
            render(Stepper, TestHarness)
            await vi.waitFor(() => {
                expect(api).toBeDefined()
                expect(typeof api?.next).toBe('function')
                expect(typeof api?.prev).toBe('function')
                expect(typeof api?.goTo).toBe('function')
            })
        })

        it('api.next advances even when linear would block from UI', async () => {
            const onValueChange = vi.fn()
            let api: StepperApi | undefined
            const props = {
                items: sampleItems,
                value: 'a',
                onValueChange,
                get api() {
                    return api
                },
                set api(v: StepperApi | undefined) {
                    api = v
                }
            }
            render(Stepper, props)
            await vi.waitFor(() => expect(api).toBeDefined())
            api?.next()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith('b')
            })
        })

        it('api.prev goes back one step', async () => {
            const onValueChange = vi.fn()
            let api: StepperApi | undefined
            const props = {
                items: sampleItems,
                value: 'c',
                onValueChange,
                get api() {
                    return api
                },
                set api(v: StepperApi | undefined) {
                    api = v
                }
            }
            render(Stepper, props)
            await vi.waitFor(() => expect(api).toBeDefined())
            api?.prev()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith('b')
            })
        })

        it('api.goTo jumps to arbitrary step', async () => {
            const onValueChange = vi.fn()
            let api: StepperApi | undefined
            const props = {
                items: sampleItems,
                value: 'a',
                onValueChange,
                get api() {
                    return api
                },
                set api(v: StepperApi | undefined) {
                    api = v
                }
            }
            render(Stepper, props)
            await vi.waitFor(() => expect(api).toBeDefined())
            api?.goTo('c')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith('c')
            })
        })

        it('hasPrev reflects boundary at first step', async () => {
            let api: StepperApi | undefined
            const props = {
                items: sampleItems,
                value: 'a',
                get api() {
                    return api
                },
                set api(v: StepperApi | undefined) {
                    api = v
                }
            }
            render(Stepper, props)
            await vi.waitFor(() => expect(api?.hasPrev).toBe(false))
            expect(api?.hasNext).toBe(true)
        })

        it('hasNext reflects boundary at last step', async () => {
            let api: StepperApi | undefined
            const props = {
                items: sampleItems,
                value: 'c',
                get api() {
                    return api
                },
                set api(v: StepperApi | undefined) {
                    api = v
                }
            }
            render(Stepper, props)
            await vi.waitFor(() => expect(api?.hasNext).toBe(false))
            expect(api?.hasPrev).toBe(true)
        })
    })

    // ==================== KEYBOARD ====================

    describe('keyboard navigation', () => {
        it('ArrowRight moves focus to next trigger (horizontal)', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'a' })
            const triggers = getTriggers(container)
            triggers[0].focus()
            triggers[0].dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
            )
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(triggers[1])
            })
        })

        it('ArrowLeft moves focus to previous trigger (horizontal)', async () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'b' })
            const triggers = getTriggers(container)
            triggers[1].focus()
            triggers[1].dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
            )
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(triggers[0])
            })
        })

        it('Home/End focus first/last triggers', async () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                value: 'b',
                linear: false
            })
            const triggers = getTriggers(container)
            triggers[1].focus()
            triggers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(triggers[2])
            })
            triggers[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(triggers[0])
            })
        })
    })

    // ==================== CONTENT PANEL ====================

    describe('content panel', () => {
        it('renders content for the active item', () => {
            const items: StepperItem[] = [
                { value: 'a', title: 'A', content: 'Body A' },
                { value: 'b', title: 'B', content: 'Body B' }
            ]
            const { container } = render(Stepper, { items, value: 'a' })
            const contents = getContents(container)
            expect(contents.length).toBe(1)
            expect(contents[0].textContent).toContain('Body A')
        })

        it('omits content panel when content=false', () => {
            const items: StepperItem[] = [{ value: 'a', title: 'A', content: 'Body A' }]
            const { container } = render(Stepper, { items, value: 'a', content: false })
            expect(getContents(container).length).toBe(0)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('applies horizontal classes by default', () => {
            const { container } = render(Stepper, { items: sampleItems })
            expect(getRoot(container).getAttribute('data-orientation')).toBe('horizontal')
        })

        it('applies vertical classes when set', () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                orientation: 'vertical'
            })
            expect(getRoot(container).getAttribute('data-orientation')).toBe('vertical')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = [
            'primary',
            'secondary',
            'tertiary',
            'success',
            'warning',
            'error',
            'info'
        ] as const

        colors.forEach((c) => {
            it(`applies ${c} color classes`, () => {
                const { container } = render(Stepper, {
                    items: sampleItems,
                    value: 'b',
                    color: c
                })
                const indicators = getIndicators(container)
                expect(indicators[0].className).toContain(`group-data-[state=completed]:bg-${c}`)
            })
        })
    })

    // ==================== ARIA ====================

    describe('aria attributes', () => {
        it('marks active trigger with aria-current="step"', () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'b' })
            const triggers = getTriggers(container)
            expect(triggers[1].getAttribute('aria-current')).toBe('step')
            expect(triggers[0].hasAttribute('aria-current')).toBe(false)
        })

        it('roving tabindex: active = 0, others = -1', () => {
            const { container } = render(Stepper, { items: sampleItems, value: 'b' })
            const triggers = getTriggers(container)
            expect(triggers[1].getAttribute('tabindex')).toBe('0')
            expect(triggers[0].getAttribute('tabindex')).toBe('-1')
            expect(triggers[2].getAttribute('tabindex')).toBe('-1')
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui overrides', () => {
        it('applies root override class', () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                class: 'custom-root-cls'
            })
            expect(getRoot(container).className).toContain('custom-root-cls')
        })

        it('applies ui slot overrides', () => {
            const { container } = render(Stepper, {
                items: sampleItems,
                ui: { indicator: 'custom-indicator-cls' }
            })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('custom-indicator-cls')
        })

        it('applies per-item ui overrides only to that item', () => {
            const items: StepperItem[] = [
                { value: 'a', title: 'A' },
                { value: 'b', title: 'B', ui: { indicator: 'b-only-cls' } }
            ]
            const { container } = render(Stepper, { items })
            const indicators = getIndicators(container)
            expect(indicators[1].className).toContain('b-only-cls')
            expect(indicators[0].className).not.toContain('b-only-cls')
        })
    })
})
