import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Accordion from './Accordion.svelte'

describe('Accordion', () => {
    const sampleItems = [
        { label: 'Item 1', content: 'Content 1' },
        { label: 'Item 2', content: 'Content 2' },
        { label: 'Item 3', content: 'Content 3' }
    ]

    const getRoot = () => document.querySelector('[data-accordion-root]') as HTMLElement | null
    const getItems = () => document.querySelectorAll('[data-accordion-item]')
    const getTriggers = () => document.querySelectorAll('[data-accordion-trigger]')
    const getContents = () => document.querySelectorAll('[data-accordion-content]')

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Accordion, { type: 'single', items: sampleItems })
            expect(container).not.toBeNull()
        })

        it('should render all items', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(3)
            })
        })

        it('should render item labels', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await expect.element(page.getByText('Item 1')).toBeVisible()
            await expect.element(page.getByText('Item 2')).toBeVisible()
            await expect.element(page.getByText('Item 3')).toBeVisible()
        })

        it('should render root with correct class', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('w-full')
            })
        })
    })

    // ==================== SINGLE MODE ====================

    describe('single mode', () => {
        it('should expand item on click', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            const trigger = page.getByText('Item 1')
            await trigger.click()
            await expect.element(page.getByText('Content 1')).toBeVisible()
        })

        it('should collapse previous item when another is clicked', async () => {
            render(Accordion, { type: 'single', items: sampleItems })

            await page.getByText('Item 1').click()
            await expect.element(page.getByText('Content 1')).toBeVisible()

            await page.getByText('Item 2').click()
            await expect.element(page.getByText('Content 2')).toBeVisible()

            await vi.waitFor(() => {
                const contents = getContents()
                const openContents = Array.from(contents).filter(
                    (c) => c.getAttribute('data-state') === 'open'
                )
                expect(openContents.length).toBe(1)
            })
        })

        it('should collapse item when clicked again', async () => {
            render(Accordion, { type: 'single', items: sampleItems })

            await page.getByText('Item 1').click()
            await expect.element(page.getByText('Content 1')).toBeVisible()

            await page.getByText('Item 1').click()
            await vi.waitFor(() => {
                const contents = getContents()
                const openContents = Array.from(contents).filter(
                    (c) => c.getAttribute('data-state') === 'open'
                )
                expect(openContents.length).toBe(0)
            })
        })
    })

    // ==================== MULTIPLE MODE ====================

    describe('multiple mode', () => {
        it('should allow multiple items open simultaneously', async () => {
            render(Accordion, { type: 'multiple', items: sampleItems })

            await page.getByText('Item 1').click()
            await page.getByText('Item 2').click()

            await expect.element(page.getByText('Content 1')).toBeVisible()
            await expect.element(page.getByText('Content 2')).toBeVisible()

            await vi.waitFor(() => {
                const contents = getContents()
                const openContents = Array.from(contents).filter(
                    (c) => c.getAttribute('data-state') === 'open'
                )
                expect(openContents.length).toBe(2)
            })
        })

        it('should toggle individual items independently', async () => {
            render(Accordion, { type: 'multiple', items: sampleItems })

            await page.getByText('Item 1').click()
            await page.getByText('Item 2').click()
            await page.getByText('Item 1').click()

            await vi.waitFor(() => {
                const contents = getContents()
                const openContents = Array.from(contents).filter(
                    (c) => c.getAttribute('data-state') === 'open'
                )
                expect(openContents.length).toBe(1)
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled state', () => {
        it('should disable entire accordion', async () => {
            render(Accordion, { type: 'single', items: sampleItems, disabled: true })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                triggers.forEach((trigger) => {
                    expect(
                        trigger.hasAttribute('disabled') ||
                            trigger.getAttribute('data-disabled') !== null
                    ).toBe(true)
                })
            })
        })

        it('should disable individual item', async () => {
            const itemsWithDisabled = [
                { label: 'Item 1', content: 'Content 1' },
                { label: 'Item 2', content: 'Content 2', disabled: true },
                { label: 'Item 3', content: 'Content 3' }
            ]
            render(Accordion, { type: 'single', items: itemsWithDisabled })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const disabledTrigger = triggers[1]
                expect(
                    disabledTrigger.hasAttribute('disabled') ||
                        disabledTrigger.getAttribute('data-disabled') !== null
                ).toBe(true)
            })
        })

        it('should apply disabled variant classes', async () => {
            render(Accordion, { type: 'single', items: sampleItems, disabled: true })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const trigger = triggers[0] as HTMLElement
                expect(trigger.className).toContain('cursor-not-allowed')
                expect(trigger.className).toContain('opacity-75')
            })
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render default trailing icon', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                triggers.forEach((trigger) => {
                    const icon = trigger.querySelector('svg')
                    expect(icon).not.toBeNull()
                })
            })
        })

        it('should render custom trailing icon', async () => {
            render(Accordion, {
                type: 'single',
                items: sampleItems,
                trailingIcon: 'lucide:plus'
            })
            await vi.waitFor(() => {
                expect(getTriggers().length).toBeGreaterThan(0)
            })
        })

        it('should render leading icon when provided', async () => {
            const itemsWithIcon = [{ label: 'Item 1', content: 'Content 1', icon: 'lucide:home' }]
            render(Accordion, { type: 'single', items: itemsWithIcon })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const icons = triggers[0].querySelectorAll('svg')
                expect(icons.length).toBeGreaterThanOrEqual(2)
            })
        })

        it('should render item-specific trailing icon', async () => {
            const itemsWithTrailing = [
                { label: 'Item 1', content: 'Content 1', trailingIcon: 'lucide:arrow-right' }
            ]
            render(Accordion, { type: 'single', items: itemsWithTrailing })
            await vi.waitFor(() => {
                expect(getTriggers().length).toBeGreaterThan(0)
            })
        })
    })

    // ==================== CUSTOM VALUES ====================

    describe('custom values', () => {
        it('should use custom value for items', async () => {
            const itemsWithValues = [
                { label: 'First', content: 'First content', value: 'first' },
                { label: 'Second', content: 'Second content', value: 'second' }
            ]
            render(Accordion, { type: 'single', items: itemsWithValues, value: 'second' })
            await expect.element(page.getByText('Second content')).toBeVisible()
        })

        it('should use index as value when not provided', async () => {
            render(Accordion, { type: 'single', items: sampleItems, value: '0' })
            await expect.element(page.getByText('Content 1')).toBeVisible()
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onValueChange when item is clicked', async () => {
            const onValueChange = vi.fn()
            render(Accordion, { type: 'single', items: sampleItems, onValueChange })
            await page.getByText('Item 1').click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalled()
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply item border classes', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('border-b')
            })
        })

        it('should apply trigger classes', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const trigger = triggers[0] as HTMLElement
                expect(trigger.className).toContain('flex-1')
                expect(trigger.className).toContain('flex')
                expect(trigger.className).toContain('items-center')
            })
        })

        it('should apply content animation classes', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await page.getByText('Item 1').click()
            await vi.waitFor(() => {
                const contents = getContents()
                const openContent = Array.from(contents).find(
                    (c) => c.getAttribute('data-state') === 'open'
                ) as HTMLElement
                expect(openContent).not.toBeNull()
                expect(openContent.className).toContain('overflow-hidden')
            })
        })

        it('should apply trailing icon rotation class when open', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await page.getByText('Item 1').click()
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const trigger = triggers[0]
                expect(trigger.getAttribute('data-state')).toBe('open')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            render(Accordion, {
                type: 'single',
                items: sampleItems,
                ui: { root: 'custom-root' }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('custom-root')
            })
        })

        it('should apply ui.item class', async () => {
            render(Accordion, {
                type: 'single',
                items: sampleItems,
                ui: { item: 'custom-item' }
            })
            await vi.waitFor(() => {
                const items = getItems()
                items.forEach((item) => {
                    expect((item as HTMLElement).className).toContain('custom-item')
                })
            })
        })

        it('should apply ui.trigger class', async () => {
            render(Accordion, {
                type: 'single',
                items: sampleItems,
                ui: { trigger: 'custom-trigger' }
            })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                triggers.forEach((trigger) => {
                    expect((trigger as HTMLElement).className).toContain('custom-trigger')
                })
            })
        })

        it('should apply item-level ui overrides', async () => {
            const itemsWithUi = [
                { label: 'Item 1', content: 'Content 1', ui: { item: 'item-custom' } }
            ]
            render(Accordion, { type: 'single', items: itemsWithUi })
            await vi.waitFor(() => {
                const items = getItems()
                expect((items[0] as HTMLElement).className).toContain('item-custom')
            })
        })

        it('should apply item-level class override', async () => {
            const itemsWithClass = [
                { label: 'Item 1', content: 'Content 1', class: 'my-custom-class' }
            ]
            render(Accordion, { type: 'single', items: itemsWithClass })
            await vi.waitFor(() => {
                const items = getItems()
                expect((items[0] as HTMLElement).className).toContain('my-custom-class')
            })
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should render with vertical orientation by default', async () => {
            render(Accordion, { type: 'single', items: sampleItems })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-orientation')).toBe('vertical')
            })
        })

        it('should render with horizontal orientation', async () => {
            render(Accordion, { type: 'single', items: sampleItems, orientation: 'horizontal' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-orientation')).toBe('horizontal')
            })
        })
    })

    // ==================== LOOP ====================

    describe('loop', () => {
        it('should accept loop prop', async () => {
            render(Accordion, { type: 'single', items: sampleItems, loop: true })
            await vi.waitFor(() => {
                expect(getRoot()).not.toBeNull()
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render multiple mode with icons and custom values', async () => {
            const items = [
                { label: 'Home', content: 'Home content', icon: 'lucide:home', value: 'home' },
                {
                    label: 'Settings',
                    content: 'Settings content',
                    icon: 'lucide:settings',
                    value: 'settings'
                }
            ]
            render(Accordion, { type: 'multiple', items, value: ['home', 'settings'] })
            await expect.element(page.getByText('Home content')).toBeVisible()
            await expect.element(page.getByText('Settings content')).toBeVisible()
        })

        it('should render with all ui overrides', async () => {
            render(Accordion, {
                type: 'single',
                items: sampleItems,
                ui: {
                    root: 'root-custom',
                    item: 'item-custom',
                    header: 'header-custom',
                    trigger: 'trigger-custom',
                    content: 'content-custom',
                    body: 'body-custom',
                    label: 'label-custom',
                    leadingIcon: 'leading-custom',
                    trailingIcon: 'trailing-custom'
                }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('root-custom')

                const items = getItems()
                expect((items[0] as HTMLElement).className).toContain('item-custom')

                const triggers = getTriggers()
                expect((triggers[0] as HTMLElement).className).toContain('trigger-custom')
            })
        })

        it('should render disabled items in multiple mode', async () => {
            const items = [
                { label: 'Item 1', content: 'Content 1' },
                { label: 'Item 2', content: 'Content 2', disabled: true },
                { label: 'Item 3', content: 'Content 3' }
            ]
            render(Accordion, { type: 'multiple', items })
            await page.getByText('Item 1').click()
            await page.getByText('Item 3').click()

            await expect.element(page.getByText('Content 1')).toBeVisible()
            await expect.element(page.getByText('Content 3')).toBeVisible()

            await vi.waitFor(() => {
                const contents = getContents()
                const openContents = Array.from(contents).filter(
                    (c) => c.getAttribute('data-state') === 'open'
                )
                expect(openContents.length).toBe(2)
            })
        })
    })
})
