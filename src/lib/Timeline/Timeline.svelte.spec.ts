import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Timeline from './Timeline.svelte'

describe('Timeline', () => {
    // Helpers
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement
    const getItems = (container: Element) => getRoot(container).querySelectorAll('[data-state]') as NodeListOf<HTMLElement>
    const getIndicators = (container: Element) => getRoot(container).querySelectorAll('[class*="inline-flex"][class*="rounded-full"]') as NodeListOf<HTMLElement>
    const getSeparators = (container: Element) => getRoot(container).querySelectorAll('[class*="flex-1"][class*="rounded-full"]') as NodeListOf<HTMLElement>

    const basicItems = [
        { value: 1, title: 'Step 1' },
        { value: 2, title: 'Step 2' },
        { value: 3, title: 'Step 3' }
    ]

    const itemsWithIcons = [
        { value: 1, icon: 'lucide:check', title: 'Done' },
        { value: 2, icon: 'lucide:circle', title: 'Active' },
        { value: 3, icon: 'lucide:clock', title: 'Pending' }
    ]

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Timeline, { items: basicItems })
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render as div by default', () => {
            const { container } = render(Timeline, { items: basicItems })
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('should render as custom element', () => {
            const { container } = render(Timeline, { items: basicItems, as: 'section' })
            expect(getRoot(container).tagName).toBe('SECTION')
        })

        it('should render correct number of items', () => {
            const { container } = render(Timeline, { items: basicItems, value: 2 })
            expect(getItems(container).length).toBe(3)
        })

        it('should render indicators for each item', () => {
            const { container } = render(Timeline, { items: basicItems })
            const indicators = getIndicators(container)
            expect(indicators.length).toBeGreaterThanOrEqual(basicItems.length)
        })

        it('should render separators between items', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1 })
            const separators = getSeparators(container)
            // Should have n-1 separators for n items
            expect(separators.length).toBe(basicItems.length - 1)
        })

        it('should render item titles', () => {
            const { container } = render(Timeline, { items: basicItems })
            expect(container.textContent).toContain('Step 1')
            expect(container.textContent).toContain('Step 2')
            expect(container.textContent).toContain('Step 3')
        })

        it('should render item dates', () => {
            const items = [
                { value: 1, title: 'Event', date: 'Jan 1' },
                { value: 2, title: 'Event 2', date: 'Jan 2' }
            ]
            const { container } = render(Timeline, { items })
            expect(container.textContent).toContain('Jan 1')
            expect(container.textContent).toContain('Jan 2')
        })

        it('should render item descriptions', () => {
            const items = [
                { value: 1, title: 'Step', description: 'First step description' }
            ]
            const { container } = render(Timeline, { items })
            expect(container.textContent).toContain('First step description')
        })

        it('should have flex class on root', () => {
            const { container } = render(Timeline, { items: basicItems })
            expect(getRoot(container).className).toContain('flex')
        })
    })

    // ==================== STATE MANAGEMENT ====================

    describe('state management', () => {
        it('should mark items as pending when no value', () => {
            const { container } = render(Timeline, { items: basicItems })
            const items = getItems(container)
            items.forEach((item) => {
                expect(item.getAttribute('data-state')).toBe('pending')
            })
        })

        it('should mark item as active when value matches', () => {
            const { container } = render(Timeline, { items: basicItems, value: 2 })
            const items = getItems(container)
            expect(items[1].getAttribute('data-state')).toBe('active')
        })

        it('should mark items before active as completed', () => {
            const { container } = render(Timeline, { items: basicItems, value: 2 })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('completed')
        })

        it('should mark items after active as pending', () => {
            const { container } = render(Timeline, { items: basicItems, value: 2 })
            const items = getItems(container)
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('should handle first item as active', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1 })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('active')
            expect(items[1].getAttribute('data-state')).toBe('pending')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('should handle last item as active', () => {
            const { container } = render(Timeline, { items: basicItems, value: 3 })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('completed')
            expect(items[2].getAttribute('data-state')).toBe('active')
        })

        it('should handle string values', () => {
            const items = [
                { value: 'start', title: 'Start' },
                { value: 'middle', title: 'Middle' },
                { value: 'end', title: 'End' }
            ]
            const { container } = render(Timeline, { items, value: 'middle' })
            const itemElements = getItems(container)
            expect(itemElements[0].getAttribute('data-state')).toBe('completed')
            expect(itemElements[1].getAttribute('data-state')).toBe('active')
            expect(itemElements[2].getAttribute('data-state')).toBe('pending')
        })
    })

    // ==================== REVERSE ====================

    describe('reverse', () => {
        it('should not change state logic when reversed', () => {
            const { container } = render(Timeline, { items: basicItems, value: 2, reverse: true })
            const items = getItems(container)
            // State logic stays the same: items before active = completed, items after = pending
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('active')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('should keep same states as non-reversed with value 1', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, reverse: true })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('active')
            expect(items[1].getAttribute('data-state')).toBe('pending')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('should keep same states as non-reversed with value 3', () => {
            const { container } = render(Timeline, { items: basicItems, value: 3, reverse: true })
            const items = getItems(container)
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('completed')
            expect(items[2].getAttribute('data-state')).toBe('active')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to primary color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1 })
            const indicators = getIndicators(container)
            // Active/completed indicators should have primary styles
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-primary')
        })

        it('should apply secondary color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'secondary' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-secondary')
        })

        it('should apply tertiary color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'tertiary' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-tertiary')
        })

        it('should apply success color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'success' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-success')
        })

        it('should apply warning color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'warning' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-warning')
        })

        it('should apply error color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'error' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-error')
        })

        it('should apply info color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'info' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-info')
        })

        it('should apply surface color', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, color: 'surface' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-inverse-surface')
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', () => {
            const { container } = render(Timeline, { items: basicItems })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-8')
        })

        it('should apply 3xs size', () => {
            const { container } = render(Timeline, { items: basicItems, size: '3xs' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-4')
        })

        it('should apply 2xs size', () => {
            const { container } = render(Timeline, { items: basicItems, size: '2xs' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-5')
        })

        it('should apply xs size', () => {
            const { container } = render(Timeline, { items: basicItems, size: 'xs' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-6')
        })

        it('should apply sm size', () => {
            const { container } = render(Timeline, { items: basicItems, size: 'sm' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-7')
        })

        it('should apply lg size', () => {
            const { container } = render(Timeline, { items: basicItems, size: 'lg' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-9')
        })

        it('should apply xl size', () => {
            const { container } = render(Timeline, { items: basicItems, size: 'xl' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-10')
        })

        it('should apply 2xl size', () => {
            const { container } = render(Timeline, { items: basicItems, size: '2xl' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-11')
        })

        it('should apply 3xl size', () => {
            const { container } = render(Timeline, { items: basicItems, size: '3xl' })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-12')
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should be vertical by default', () => {
            const { container } = render(Timeline, { items: basicItems })
            expect(getRoot(container).className).toContain('flex-col')
        })

        it('should apply horizontal orientation', () => {
            const { container } = render(Timeline, { items: basicItems, orientation: 'horizontal' })
            expect(getRoot(container).className).toContain('flex-row')
            expect(getRoot(container).className).toContain('w-full')
        })

        it('should apply vertical separator width', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1 })
            const separators = getSeparators(container)
            if (separators.length > 0) {
                expect(separators[0].className).toContain('w-0.5')
            }
        })

        it('should apply horizontal separator height', () => {
            const { container } = render(Timeline, { items: basicItems, orientation: 'horizontal', value: 1 })
            const separators = getSeparators(container)
            if (separators.length > 0) {
                expect(separators[0].className).toContain('h-0.5')
            }
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render with icons without crashing', () => {
            const { container } = render(Timeline, { items: itemsWithIcons })
            expect(getRoot(container)).not.toBeNull()
            expect(container.textContent).toContain('Done')
        })

        it('should render indicators for items with icons', () => {
            const { container } = render(Timeline, { items: itemsWithIcons })
            const indicators = getIndicators(container)
            expect(indicators.length).toBeGreaterThanOrEqual(itemsWithIcons.length)
        })
    })

    // ==================== AVATARS ====================

    describe('avatars', () => {
        it('should render with avatars without crashing', () => {
            const items = [
                { avatar: { src: 'https://example.com/avatar.jpg', alt: 'User' }, title: 'User action' }
            ]
            const { container } = render(Timeline, { items })
            expect(getRoot(container)).not.toBeNull()
            expect(container.textContent).toContain('User action')
        })

        it('should render avatar without src (fallback)', () => {
            const items = [
                { avatar: { alt: 'JD' }, title: 'John Doe' }
            ]
            const { container } = render(Timeline, { items })
            expect(getRoot(container)).not.toBeNull()
            expect(container.textContent).toContain('John Doe')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Timeline, { items: basicItems, class: 'my-timeline' })
            expect(getRoot(container).className).toContain('my-timeline')
        })

        it('should merge custom class with variant classes', () => {
            const { container } = render(Timeline, { items: basicItems, class: 'my-timeline', orientation: 'horizontal' })
            const root = getRoot(container)
            expect(root.className).toContain('my-timeline')
            expect(root.className).toContain('flex-row')
        })
    })

    // ==================== ITEM CLASS ====================

    describe('item class', () => {
        it('should apply custom class to individual items', () => {
            const items = [
                { value: 1, title: 'Step 1', class: 'custom-item-class' },
                { value: 2, title: 'Step 2' }
            ]
            const { container } = render(Timeline, { items, value: 1 })
            const itemElements = getItems(container)
            expect(itemElements[0].className).toContain('custom-item-class')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', () => {
            const { container } = render(Timeline, { items: basicItems, ui: { root: 'custom-root' } })
            expect(getRoot(container).className).toContain('custom-root')
        })

        it('should apply ui.item class', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, ui: { item: 'custom-item' } })
            const items = getItems(container)
            expect(items[0].className).toContain('custom-item')
        })

        it('should apply ui.indicator class', () => {
            const { container } = render(Timeline, { items: basicItems, ui: { indicator: 'custom-indicator' } })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('custom-indicator')
        })

        it('should apply ui.separator class', () => {
            const { container } = render(Timeline, { items: basicItems, value: 1, ui: { separator: 'custom-separator' } })
            const separators = getSeparators(container)
            if (separators.length > 0) {
                expect(separators[0].className).toContain('custom-separator')
            }
        })

        it('should apply ui.title class', () => {
            const { container } = render(Timeline, { items: basicItems, ui: { title: 'custom-title' } })
            const titles = container.querySelectorAll('.custom-title')
            expect(titles.length).toBeGreaterThan(0)
        })

        it('should apply ui.date class', () => {
            const items = [{ value: 1, title: 'Event', date: 'Jan 1' }]
            const { container } = render(Timeline, { items, ui: { date: 'custom-date' } })
            expect(container.querySelector('.custom-date')).not.toBeNull()
        })

        it('should apply ui.description class', () => {
            const items = [{ value: 1, title: 'Event', description: 'Desc' }]
            const { container } = render(Timeline, { items, ui: { description: 'custom-desc' } })
            expect(container.querySelector('.custom-desc')).not.toBeNull()
        })
    })

    // ==================== HTML ATTRIBUTES ====================

    describe('html attributes', () => {
        it('should pass through HTML attributes', () => {
            const { container } = render(Timeline, { items: basicItems, id: 'my-timeline', title: 'Timeline' })
            const root = getRoot(container)
            expect(root.getAttribute('id')).toBe('my-timeline')
            expect(root.getAttribute('title')).toBe('Timeline')
        })

        it('should apply data attributes', () => {
            const { container } = render(Timeline, { items: basicItems, 'data-testid': 'timeline-1' } as any)
            expect(getRoot(container).getAttribute('data-testid')).toBe('timeline-1')
        })
    })

    // ==================== EMPTY STATE ====================

    describe('empty state', () => {
        it('should render empty root when no items', () => {
            const { container } = render(Timeline, { items: [] })
            const root = getRoot(container)
            expect(root).not.toBeNull()
            expect(getItems(container).length).toBe(0)
        })

        it('should render with single item', () => {
            const items = [{ value: 1, title: 'Only item' }]
            const { container } = render(Timeline, { items, value: 1 })
            expect(getItems(container).length).toBe(1)
            expect(container.textContent).toContain('Only item')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with color, size, and orientation', () => {
            const { container } = render(Timeline, {
                items: basicItems,
                value: 2,
                color: 'success',
                size: 'lg',
                orientation: 'horizontal'
            })
            const root = getRoot(container)
            const indicators = getIndicators(container)
            expect(root.className).toContain('flex-row')
            expect(indicators[0].className).toContain('size-9')
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-success')
        })

        it('should render horizontal with reverse', () => {
            const { container } = render(Timeline, {
                items: basicItems,
                value: 2,
                orientation: 'horizontal',
                reverse: true
            })
            const items = getItems(container)
            // Reverse only affects visual direction, not state logic
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('active')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })

        it('should render with icons, color, and size', () => {
            const { container } = render(Timeline, {
                items: itemsWithIcons,
                value: 2,
                color: 'error',
                size: 'xl'
            })
            const indicators = getIndicators(container)
            expect(indicators[0].className).toContain('size-10')
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-error')
        })

        it('should render with multiple ui overrides', () => {
            const { container } = render(Timeline, {
                items: basicItems,
                value: 2,
                ui: {
                    root: 'custom-root',
                    item: 'custom-item',
                    indicator: 'custom-indicator'
                }
            })
            expect(getRoot(container).className).toContain('custom-root')
            expect(getItems(container)[0].className).toContain('custom-item')
            expect(getIndicators(container)[0].className).toContain('custom-indicator')
        })

        it('should handle all props together', () => {
            const { container } = render(Timeline, {
                items: itemsWithIcons,
                value: 2,
                color: 'tertiary',
                size: '2xl',
                orientation: 'vertical',
                reverse: false,
                class: 'my-timeline',
                ui: { root: 'ui-root' }
            })
            const root = getRoot(container)
            const indicators = getIndicators(container)
            const items = getItems(container)

            expect(root.className).toContain('my-timeline')
            expect(root.className).toContain('ui-root')
            expect(root.className).toContain('flex-col')
            expect(indicators[0].className).toContain('size-11')
            expect(indicators[0].className).toContain('group-data-[state=completed]:bg-tertiary')
            expect(items[0].getAttribute('data-state')).toBe('completed')
            expect(items[1].getAttribute('data-state')).toBe('active')
            expect(items[2].getAttribute('data-state')).toBe('pending')
        })
    })
})
