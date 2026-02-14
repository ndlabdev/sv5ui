import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Tabs from './Tabs.svelte'

describe('Tabs', () => {
    const sampleItems = [
        { label: 'Tab 1', content: 'Content 1', value: 'tab1' },
        { label: 'Tab 2', content: 'Content 2', value: 'tab2' },
        { label: 'Tab 3', content: 'Content 3', value: 'tab3' }
    ]

    const getRoot = () => document.querySelector('[data-tabs-root]') as HTMLElement | null
    const getList = () => document.querySelector('[data-tabs-list]') as HTMLElement | null
    const getTriggers = () => document.querySelectorAll('[data-tabs-trigger]')
    const getContents = () => document.querySelectorAll('[data-tabs-content]')

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Tabs, { items: sampleItems })
            expect(container).not.toBeNull()
        })

        it('should render all tab triggers', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                expect(getTriggers().length).toBe(3)
            })
        })

        it('should render tab labels', async () => {
            render(Tabs, { items: sampleItems })
            await expect.element(page.getByText('Tab 1')).toBeVisible()
            await expect.element(page.getByText('Tab 2')).toBeVisible()
            await expect.element(page.getByText('Tab 3')).toBeVisible()
        })

        it('should render root with correct class', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('flex')
                expect(root!.className).toContain('w-full')
            })
        })

        it('should render tab list', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const list = getList()
                expect(list).not.toBeNull()
                expect(list!.className).toContain('inline-flex')
            })
        })

        it('should render indicator element', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const list = getList()
                expect(list).not.toBeNull()
                const indicator = list!.querySelector('.transition-all')
                expect(indicator).not.toBeNull()
            })
        })
    })

    // ==================== DEFAULT VALUE ====================

    describe('default value', () => {
        it('should select first tab by default', async () => {
            render(Tabs, { items: sampleItems })
            await expect.element(page.getByText('Content 1')).toBeVisible()
        })

        it('should select tab specified by value', async () => {
            render(Tabs, { items: sampleItems, value: 'tab2' })
            await expect.element(page.getByText('Content 2')).toBeVisible()
        })

        it('should select tab specified by defaultValue', async () => {
            render(Tabs, { items: sampleItems, defaultValue: 'tab3' })
            await expect.element(page.getByText('Content 3')).toBeVisible()
        })

        it('should use index as value when not provided', async () => {
            const items = [
                { label: 'First', content: 'First content' },
                { label: 'Second', content: 'Second content' }
            ]
            render(Tabs, { items, value: '1' })
            await expect.element(page.getByText('Second content')).toBeVisible()
        })
    })

    // ==================== TAB SWITCHING ====================

    describe('tab switching', () => {
        it('should switch tab on click', async () => {
            render(Tabs, { items: sampleItems })
            await expect.element(page.getByText('Content 1')).toBeVisible()

            await page.getByText('Tab 2').click()
            await expect.element(page.getByText('Content 2')).toBeVisible()
        })

        it('should update active trigger state on click', async () => {
            render(Tabs, { items: sampleItems })

            await page.getByText('Tab 2').click()
            await vi.waitFor(() => {
                const triggers = getTriggers()
                expect(triggers[1].getAttribute('data-state')).toBe('active')
                expect(triggers[0].getAttribute('data-state')).toBe('inactive')
            })
        })

        it('should show only one active content at a time', async () => {
            render(Tabs, { items: sampleItems })

            await page.getByText('Tab 1').click()
            await expect.element(page.getByText('Content 1')).toBeVisible()

            await page.getByText('Tab 2').click()
            await expect.element(page.getByText('Content 2')).toBeVisible()

            await vi.waitFor(() => {
                const triggers = getTriggers()
                const activeTriggers = Array.from(triggers).filter(
                    (t) => t.getAttribute('data-state') === 'active'
                )
                expect(activeTriggers.length).toBe(1)
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled state', () => {
        it('should disable entire tabs', async () => {
            render(Tabs, { items: sampleItems, disabled: true })
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

        it('should disable individual tab', async () => {
            const itemsWithDisabled = [
                { label: 'Tab 1', content: 'Content 1', value: 'tab1' },
                { label: 'Tab 2', content: 'Content 2', value: 'tab2', disabled: true },
                { label: 'Tab 3', content: 'Content 3', value: 'tab3' }
            ]
            render(Tabs, { items: itemsWithDisabled })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const disabledTrigger = triggers[1]
                expect(
                    disabledTrigger.hasAttribute('disabled') ||
                        disabledTrigger.getAttribute('data-disabled') !== null
                ).toBe(true)
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onValueChange when tab is clicked', async () => {
            const onValueChange = vi.fn()
            render(Tabs, { items: sampleItems, onValueChange })
            await page.getByText('Tab 2').click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith('tab2')
            })
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render leading icon when provided', async () => {
            const itemsWithIcon = [
                { label: 'Home', content: 'Home content', value: 'home', icon: 'lucide:home' }
            ]
            render(Tabs, { items: itemsWithIcon })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const icons = triggers[0].querySelectorAll('svg')
                expect(icons.length).toBeGreaterThanOrEqual(1)
            })
        })
    })

    // ==================== CONTENT PROP ====================

    describe('content prop', () => {
        it('should not render content panels when content is false', async () => {
            render(Tabs, { items: sampleItems, content: false })
            await vi.waitFor(() => {
                expect(getTriggers().length).toBe(3)
                expect(getContents().length).toBe(0)
            })
        })

        it('should render content panels when content is true', async () => {
            render(Tabs, { items: sampleItems, content: true })
            await vi.waitFor(() => {
                const contents = getContents()
                expect(contents.length).toBeGreaterThan(0)
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply pill variant classes', async () => {
            render(Tabs, { items: sampleItems, variant: 'pill' })
            await vi.waitFor(() => {
                const list = getList()
                expect(list).not.toBeNull()
                expect(list!.className).toContain('bg-surface-container')
                expect(list!.className).toContain('rounded-lg')
            })
        })

        it('should apply link variant classes', async () => {
            render(Tabs, { items: sampleItems, variant: 'link' })
            await vi.waitFor(() => {
                const list = getList()
                expect(list).not.toBeNull()
                expect(list!.className).toContain('border-b')
            })
        })

        it('should apply trigger classes', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                const trigger = triggers[0] as HTMLElement
                expect(trigger.className).toContain('inline-flex')
                expect(trigger.className).toContain('items-center')
                expect(trigger.className).toContain('font-medium')
            })
        })

        it('should apply horizontal orientation by default', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('flex-col')

                const list = getList()
                expect(list!.className).toContain('flex-row')
            })
        })

        it('should apply vertical orientation classes', async () => {
            render(Tabs, { items: sampleItems, orientation: 'vertical' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('flex-row')

                const list = getList()
                expect(list!.className).toContain('flex-col')
            })
        })
    })

    // ==================== SIZE VARIANTS ====================

    describe('size variants', () => {
        it('should apply xs size classes', async () => {
            render(Tabs, { items: sampleItems, size: 'xs' })
            await vi.waitFor(() => {
                const trigger = getTriggers()[0] as HTMLElement
                expect(trigger.className).toContain('text-xs')
            })
        })

        it('should apply md size classes', async () => {
            render(Tabs, { items: sampleItems, size: 'md' })
            await vi.waitFor(() => {
                const trigger = getTriggers()[0] as HTMLElement
                expect(trigger.className).toContain('text-sm')
            })
        })

        it('should apply xl size classes', async () => {
            render(Tabs, { items: sampleItems, size: 'xl' })
            await vi.waitFor(() => {
                const trigger = getTriggers()[0] as HTMLElement
                expect(trigger.className).toContain('text-base')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            render(Tabs, {
                items: sampleItems,
                ui: { root: 'custom-root' }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('custom-root')
            })
        })

        it('should apply ui.list class', async () => {
            render(Tabs, {
                items: sampleItems,
                ui: { list: 'custom-list' }
            })
            await vi.waitFor(() => {
                const list = getList()
                expect(list).not.toBeNull()
                expect(list!.className).toContain('custom-list')
            })
        })

        it('should apply ui.trigger class', async () => {
            render(Tabs, {
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

        it('should apply item-level class override', async () => {
            const itemsWithClass = [
                { label: 'Tab 1', content: 'Content 1', class: 'my-custom-tab' }
            ]
            render(Tabs, { items: itemsWithClass })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                expect((triggers[0] as HTMLElement).className).toContain('my-custom-tab')
            })
        })

        it('should apply item-level ui.trigger override', async () => {
            const itemsWithUi = [
                {
                    label: 'Tab 1',
                    content: 'Content 1',
                    ui: { trigger: 'item-trigger-custom' }
                }
            ]
            render(Tabs, { items: itemsWithUi })
            await vi.waitFor(() => {
                const triggers = getTriggers()
                expect((triggers[0] as HTMLElement).className).toContain('item-trigger-custom')
            })
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should render with horizontal orientation by default', async () => {
            render(Tabs, { items: sampleItems })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-orientation')).toBe('horizontal')
            })
        })

        it('should render with vertical orientation', async () => {
            render(Tabs, { items: sampleItems, orientation: 'vertical' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-orientation')).toBe('vertical')
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with icons and custom values', async () => {
            const items = [
                {
                    label: 'Home',
                    content: 'Home content',
                    icon: 'lucide:home',
                    value: 'home'
                },
                {
                    label: 'Settings',
                    content: 'Settings content',
                    icon: 'lucide:settings',
                    value: 'settings'
                }
            ]
            render(Tabs, { items, value: 'settings' })
            await expect.element(page.getByText('Settings content')).toBeVisible()
        })

        it('should render with all ui overrides', async () => {
            render(Tabs, {
                items: sampleItems,
                ui: {
                    root: 'root-custom',
                    list: 'list-custom',
                    trigger: 'trigger-custom',
                    content: 'content-custom',
                    label: 'label-custom',
                    leadingIcon: 'leading-custom',
                    indicator: 'indicator-custom'
                }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('root-custom')

                const list = getList()
                expect(list!.className).toContain('list-custom')

                const triggers = getTriggers()
                expect((triggers[0] as HTMLElement).className).toContain('trigger-custom')
            })
        })

        it('should render disabled items alongside active ones', async () => {
            const items = [
                { label: 'Tab 1', content: 'Content 1', value: 'tab1' },
                { label: 'Tab 2', content: 'Content 2', value: 'tab2', disabled: true },
                { label: 'Tab 3', content: 'Content 3', value: 'tab3' }
            ]
            render(Tabs, { items })

            await page.getByText('Tab 3').click()
            await expect.element(page.getByText('Content 3')).toBeVisible()

            await vi.waitFor(() => {
                const triggers = getTriggers()
                expect(triggers[2].getAttribute('data-state')).toBe('active')
            })
        })

        it('should render link variant with vertical orientation', async () => {
            render(Tabs, {
                items: sampleItems,
                variant: 'link',
                orientation: 'vertical'
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root!.className).toContain('flex-row')

                const list = getList()
                expect(list!.className).toContain('border-e')
                expect(list!.className).toContain('flex-col')
            })
        })
    })
})
