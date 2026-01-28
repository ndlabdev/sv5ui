import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Alert from './Alert.svelte'

describe('Alert', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(Alert, { title: 'Test' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should have role="alert"', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveAttribute('role', 'alert')
        })

        it('should apply base root classes', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/rounded-lg/)
            await expect.element(root).toHaveClass(/flex/)
        })
    })

    // ==================== TITLE & DESCRIPTION ====================

    describe('title and description', () => {
        it('should render title', async () => {
            const { container } = render(Alert, { title: 'Alert Title' })
            expect(container.textContent).toContain('Alert Title')
        })

        it('should render description', async () => {
            const { container } = render(Alert, { description: 'Alert description text' })
            expect(container.textContent).toContain('Alert description text')
        })

        it('should render both title and description', async () => {
            const { container } = render(Alert, {
                title: 'Title',
                description: 'Description'
            })
            expect(container.textContent).toContain('Title')
            expect(container.textContent).toContain('Description')
        })

        it('should not render wrapper when no title or description', async () => {
            const { container } = render(Alert, { icon: 'lucide:info' })
            const wrapper = container.querySelector('.flex-1')
            expect(wrapper).toBeNull()
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply solid variant classes', async () => {
            const { container } = render(Alert, { title: 'Test', variant: 'solid' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary/)
            await expect.element(root).toHaveClass(/text-on-primary/)
        })

        it('should apply outline variant classes', async () => {
            const { container } = render(Alert, { title: 'Test', variant: 'outline' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/text-primary/)
        })

        it('should apply soft variant classes', async () => {
            const { container } = render(Alert, { title: 'Test', variant: 'soft' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary\/10/)
            await expect.element(root).toHaveClass(/text-primary/)
        })

        it('should apply subtle variant classes', async () => {
            const { container } = render(Alert, { title: 'Test', variant: 'subtle' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary\/10/)
            await expect.element(root).toHaveClass(/ring/)
        })

        it('should default to solid variant', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary/)
            await expect.element(root).toHaveClass(/text-on-primary/)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const

        for (const color of colors) {
            it(`should apply ${color} color classes`, async () => {
                const { container } = render(Alert, { title: 'Test', color, variant: 'soft' })
                const root = page.elementLocator(container.firstElementChild!)
                await expect.element(root).toHaveClass(new RegExp(`text-${color}`))
            })
        }

        it('should default to primary color', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary/)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should apply horizontal orientation by default', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/items-center/)
        })

        it('should apply vertical orientation classes', async () => {
            const { container } = render(Alert, { title: 'Test', orientation: 'vertical' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/items-start/)
        })
    })

    // ==================== ICON ====================

    describe('icon', () => {
        it('should accept icon prop', async () => {
            // Just verify it renders without error when icon is provided
            const { container } = render(Alert, { title: 'Test', icon: 'lucide:info' })
            expect(container.firstElementChild).not.toBeNull()
            expect(container.textContent).toContain('Test')
        })

        it('should not render leading element when icon not provided', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const root = container.firstElementChild!
            // When no icon/avatar: only wrapper div = 1 child
            expect(root.children.length).toBe(1)
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar when avatar prop is provided', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                avatar: { alt: 'User' }
            })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
        })

        it('should prioritize icon over avatar', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                icon: 'lucide:info',
                avatar: { alt: 'User' }
            })
            // Avatar should NOT be rendered when icon is provided
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).toBeNull()
        })
    })

    // ==================== CLOSE BUTTON ====================

    describe('close button', () => {
        it('should not render close button by default', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const closeBtn = container.querySelector('[aria-label="Close alert"]')
            expect(closeBtn).toBeNull()
        })

        it('should render close button when close=true', async () => {
            const { container } = render(Alert, { title: 'Test', close: true })
            const closeBtn = container.querySelector('[aria-label="Close alert"]')
            expect(closeBtn).not.toBeNull()
        })

        it('should call onClose when close button is clicked', async () => {
            const onClose = vi.fn()
            const { container } = render(Alert, { title: 'Test', close: true, onClose })
            const closeBtn = page.elementLocator(container.querySelector('[aria-label="Close alert"]')!)
            await closeBtn.click()
            expect(onClose).toHaveBeenCalledOnce()
        })

        it('should accept ButtonProps for close button', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                close: { 'aria-label': 'Dismiss' }
            })
            const closeBtn = container.querySelector('[aria-label="Dismiss"]')
            expect(closeBtn).not.toBeNull()
        })
    })

    // ==================== ACTIONS ====================

    describe('actions', () => {
        it('should not render actions when not provided', async () => {
            const { container } = render(Alert, { title: 'Test' })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(0)
        })

        it('should render action buttons', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                actions: [{ label: 'Action 1' }, { label: 'Action 2' }]
            })
            expect(container.textContent).toContain('Action 1')
            expect(container.textContent).toContain('Action 2')
        })

        it('should render correct number of action buttons', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                actions: [{ label: 'A' }, { label: 'B' }, { label: 'C' }]
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(3)
        })

        it('should not render actions when actions array is empty', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                actions: []
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(0)
        })
    })

    // ==================== OPEN PROP ====================

    describe('open prop', () => {
        it('should render when open=true (default)', async () => {
            const { container } = render(Alert, { title: 'Test' })
            expect(container.firstElementChild).not.toBeNull()
        })

        it('should not render when open=false', async () => {
            const { container } = render(Alert, { title: 'Test', open: false })
            expect(container.firstElementChild).toBeNull()
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as section element', async () => {
            const { container } = render(Alert, { title: 'Test', as: 'section' })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })

        it('should render as aside element', async () => {
            const { container } = render(Alert, { title: 'Test', as: 'aside' })
            expect(container.firstElementChild!.tagName).toBe('ASIDE')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                class: 'my-custom-alert'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-alert/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Alert, {
                title: 'Test',
                ui: { root: 'custom-root' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.title class', async () => {
            const { container } = render(Alert, {
                title: 'Test Title',
                ui: { title: 'custom-title' }
            })
            const title = container.querySelector('.custom-title')
            expect(title).not.toBeNull()
            expect(title!.textContent).toBe('Test Title')
        })

        it('should apply ui.description class', async () => {
            const { container } = render(Alert, {
                description: 'Test Description',
                ui: { description: 'custom-desc' }
            })
            const desc = container.querySelector('.custom-desc')
            expect(desc).not.toBeNull()
            expect(desc!.textContent).toBe('Test Description')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with icon, title, description, actions and close', async () => {
            const { container } = render(Alert, {
                icon: 'lucide:info',
                title: 'Complete Alert',
                description: 'This alert has all features',
                actions: [{ label: 'Action' }],
                close: true
            })

            // Verify all content is rendered
            expect(container.textContent).toContain('Complete Alert')
            expect(container.textContent).toContain('This alert has all features')
            expect(container.textContent).toContain('Action')

            // Verify close button exists
            const closeBtn = container.querySelector('[aria-label="Close alert"]')
            expect(closeBtn).not.toBeNull()

            // Verify multiple children are rendered (icon + wrapper + actions + close)
            const root = container.firstElementChild!
            expect(root.children.length).toBeGreaterThanOrEqual(3)
        })

        it('should apply solid variant with actions correctly', async () => {
            const { container } = render(Alert, {
                title: 'Solid Alert',
                variant: 'solid',
                color: 'success',
                actions: [{ label: 'Confirm' }]
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-success/)
            await expect.element(root).toHaveClass(/text-on-success/)
        })
    })
})
