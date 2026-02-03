import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Slideover from './Slideover.svelte'

describe('Slideover', () => {
    const getOverlay = () => document.querySelector('[data-dialog-overlay]') as HTMLElement | null
    const getContent = () => document.querySelector('[data-dialog-content]') as HTMLElement | null
    const getClose = () => document.querySelector('[data-dialog-close]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Slideover)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(Slideover, { title: 'Test' })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await expect.element(page.getByText('Test')).toBeVisible()
        })

        it('should render overlay when open', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getOverlay()).not.toBeNull()
            })
        })

        it('should render close button by default when open', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getClose()).not.toBeNull()
            })
        })
    })

    // ==================== TITLE & DESCRIPTION ====================

    describe('title and description', () => {
        it('should render title text', async () => {
            render(Slideover, { open: true, title: 'My Title' })
            await expect.element(page.getByText('My Title')).toBeVisible()
        })

        it('should render description text', async () => {
            render(Slideover, { open: true, title: 'Title', description: 'My Description' })
            await expect.element(page.getByText('My Description')).toBeVisible()
        })

        it('should render both title and description', async () => {
            render(Slideover, { open: true, title: 'Title', description: 'Desc' })
            await expect.element(page.getByText('Title')).toBeVisible()
            await expect.element(page.getByText('Desc')).toBeVisible()
        })
    })

    // ==================== SIDE VARIANTS ====================

    describe('side variants', () => {
        it('should apply right side classes by default', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('right-0')
                expect(content!.className).toContain('inset-y-0')
            })
        })

        it('should apply left side classes', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'left' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-0')
                expect(content!.className).toContain('inset-y-0')
            })
        })

        it('should apply top side classes', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('top-0')
                expect(content!.className).toContain('inset-x-0')
            })
        })

        it('should apply bottom side classes', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'bottom' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('bottom-0')
                expect(content!.className).toContain('inset-x-0')
            })
        })
    })

    // ==================== INSET MODE ====================

    describe('inset mode', () => {
        it('should not have rounded corners by default (non-inset)', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).not.toContain('rounded-xl')
            })
        })

        it('should apply inset styling with rounded corners', async () => {
            render(Slideover, { open: true, title: 'Test', inset: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('rounded-xl')
                expect(content!.className).toContain('ring')
            })
        })

        it('should apply inset margins for right side while keeping max-width', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'right', inset: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('right-4')
                expect(content!.className).toContain('inset-y-4')
                expect(content!.className).toContain('max-w-md')
            })
        })

        it('should apply inset margins for left side while keeping max-width', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'left', inset: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-4')
                expect(content!.className).toContain('inset-y-4')
                expect(content!.className).toContain('max-w-md')
            })
        })

        it('should apply inset margins for top side', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'top', inset: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('top-4')
                expect(content!.className).toContain('inset-x-4')
            })
        })

        it('should apply inset margins for bottom side', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'bottom', inset: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('bottom-4')
                expect(content!.className).toContain('inset-x-4')
            })
        })
    })

    // ==================== TRANSITION ====================

    describe('transition', () => {
        it('should apply transition animation classes by default', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toMatch(/animate-/)
            })
        })

        it('should not apply transition classes when transition is false', async () => {
            render(Slideover, { open: true, title: 'Test', transition: false })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).not.toMatch(/animate-/)
            })
        })

        it('should apply side-specific transition for right', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'right' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('slide-in-full-right')
            })
        })

        it('should apply side-specific transition for left', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'left' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('slide-in-full-left')
            })
        })

        it('should apply side-specific transition for top', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('slide-in-full-top')
            })
        })

        it('should apply side-specific transition for bottom', async () => {
            render(Slideover, { open: true, title: 'Test', side: 'bottom' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('slide-in-full-bottom')
            })
        })
    })

    // ==================== OVERLAY ====================

    describe('overlay', () => {
        it('should render overlay with bg class when overlay is true', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('bg-on-surface/50')
            })
        })

        it('should not render overlay when overlay is false', async () => {
            render(Slideover, { open: true, title: 'Test', overlay: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
            expect(getOverlay()).toBeNull()
        })
    })

    // ==================== CLOSE BUTTON ====================

    describe('close button', () => {
        it('should render close button by default', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getClose()).not.toBeNull()
            })
        })

        it('should hide close button when close is false', async () => {
            render(Slideover, { open: true, title: 'Test', close: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
            expect(getClose()).toBeNull()
        })
    })

    // ==================== DISMISSIBLE ====================

    describe('dismissible', () => {
        it('should render with default dismissible behavior', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render with non-dismissible behavior', async () => {
            render(Slideover, { open: true, title: 'Test', dismissible: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onOpenChange when open state changes', async () => {
            const onOpenChange = vi.fn()
            render(Slideover, { open: true, title: 'Test', onOpenChange })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onOpenChange).toBeTypeOf('function')
        })
    })

    // ==================== CONTENT LAYOUT ====================

    describe('content layout', () => {
        it('should render header with title', async () => {
            render(Slideover, { open: true, title: 'My Title' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('My Title')
            })
        })

        it('should render header with title and description', async () => {
            render(Slideover, { open: true, title: 'Title', description: 'Description' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Title')
                expect(content!.textContent).toContain('Description')
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply overlay base classes', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('fixed')
                expect(overlay!.className).toContain('inset-0')
                expect(overlay!.className).toContain('z-50')
            })
        })

        it('should apply content base classes', async () => {
            render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('z-50')
                expect(content!.className).toContain('bg-surface-container-low')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.overlay class', async () => {
            render(Slideover, { open: true, title: 'Test', ui: { overlay: 'custom-overlay' } })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('custom-overlay')
            })
        })

        it('should apply ui.content class', async () => {
            render(Slideover, { open: true, title: 'Test', ui: { content: 'custom-content' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.header class', async () => {
            render(Slideover, { open: true, title: 'Test', ui: { header: 'custom-header' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const header = content!.querySelector('.custom-header')
                expect(header).not.toBeNull()
            })
        })

        it('should apply ui.title class', async () => {
            render(Slideover, { open: true, title: 'Test Title', ui: { title: 'custom-title' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const title = content!.querySelector('.custom-title')
                expect(title).not.toBeNull()
                expect(title!.textContent).toContain('Test Title')
            })
        })

        it('should apply ui.description class', async () => {
            render(Slideover, {
                open: true,
                title: 'Title',
                description: 'Test Desc',
                ui: { description: 'custom-desc' }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const desc = content!.querySelector('.custom-desc')
                expect(desc).not.toBeNull()
                expect(desc!.textContent).toContain('Test Desc')
            })
        })
    })

    // ==================== PORTAL ====================

    describe('portal', () => {
        it('should render content in body when portal is true (default)', async () => {
            const { container } = render(Slideover, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(container.contains(content)).toBe(false)
                expect(document.body.contains(content)).toBe(true)
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render inset + no close button', async () => {
            render(Slideover, {
                open: true,
                title: 'Inset Panel',
                description: 'Inset slideover',
                inset: true,
                close: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('rounded-xl')
                expect(content!.textContent).toContain('Inset Panel')
                expect(content!.textContent).toContain('Inset slideover')
            })
            expect(getClose()).toBeNull()
        })

        it('should render non-dismissible with no overlay', async () => {
            render(Slideover, {
                open: true,
                title: 'Minimal',
                overlay: false,
                dismissible: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Minimal')
            })
            expect(getOverlay()).toBeNull()
        })

        it('should render left side with inset', async () => {
            render(Slideover, {
                open: true,
                title: 'Left Inset',
                side: 'left',
                inset: true
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-4')
                expect(content!.className).toContain('rounded-xl')
            })
        })

        it('should render with all ui overrides', async () => {
            render(Slideover, {
                open: true,
                title: 'Full Override',
                description: 'Override desc',
                ui: {
                    overlay: 'ov-custom',
                    content: 'ct-custom',
                    header: 'hd-custom',
                    title: 'tt-custom',
                    description: 'dc-custom'
                }
            })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('ov-custom')

                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('ct-custom')
                expect(content!.querySelector('.hd-custom')).not.toBeNull()
                expect(content!.querySelector('.tt-custom')).not.toBeNull()
                expect(content!.querySelector('.dc-custom')).not.toBeNull()
            })
        })
    })
})
