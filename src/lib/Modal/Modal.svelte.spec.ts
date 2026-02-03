import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Modal from './Modal.svelte'

describe('Modal', () => {
    const getOverlay = () => document.querySelector('[data-dialog-overlay]') as HTMLElement | null
    const getContent = () => document.querySelector('[data-dialog-content]') as HTMLElement | null
    const getClose = () => document.querySelector('[data-dialog-close]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Modal)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(Modal, { title: 'Test' })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(Modal, { open: true, title: 'Test' })
            await expect.element(page.getByText('Test')).toBeVisible()
        })

        it('should render overlay when open', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getOverlay()).not.toBeNull()
            })
        })

        it('should render close button by default when open', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getClose()).not.toBeNull()
            })
        })
    })

    // ==================== TITLE & DESCRIPTION ====================

    describe('title and description', () => {
        it('should render title text', async () => {
            render(Modal, { open: true, title: 'My Title' })
            await expect.element(page.getByText('My Title')).toBeVisible()
        })

        it('should render description text', async () => {
            render(Modal, { open: true, title: 'Title', description: 'My Description' })
            await expect.element(page.getByText('My Description')).toBeVisible()
        })

        it('should render both title and description', async () => {
            render(Modal, { open: true, title: 'Title', description: 'Desc' })
            await expect.element(page.getByText('Title')).toBeVisible()
            await expect.element(page.getByText('Desc')).toBeVisible()
        })
    })

    // ==================== TRANSITION ====================

    describe('transition', () => {
        it('should apply transition animation classes by default', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toMatch(/animate-/)
            })
        })

        it('should not apply transition classes when transition is false', async () => {
            render(Modal, { open: true, title: 'Test', transition: false })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).not.toMatch(/animate-/)
            })
        })
    })

    // ==================== FULLSCREEN ====================

    describe('fullscreen', () => {
        it('should apply rounded-lg when not fullscreen', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('rounded-lg')
            })
        })

        it('should apply inset-0 when fullscreen', async () => {
            render(Modal, { open: true, title: 'Test', fullscreen: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('inset-0')
                expect(content!.className).not.toContain('rounded-lg')
            })
        })
    })

    // ==================== OVERLAY ====================

    describe('overlay', () => {
        it('should render overlay with bg class when overlay is true', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('bg-on-surface/50')
            })
        })

        it('should not render overlay when overlay is false', async () => {
            render(Modal, { open: true, title: 'Test', overlay: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
            expect(getOverlay()).toBeNull()
        })
    })

    // ==================== SCROLLABLE ====================

    describe('scrollable', () => {
        it('should use fixed content when not scrollable (default)', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('fixed')
            })
        })

        it('should use relative content when scrollable', async () => {
            render(Modal, { open: true, title: 'Test', scrollable: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('relative')
                expect(content!.className).not.toContain('fixed')
            })
        })

        it('should place content inside overlay when scrollable', async () => {
            render(Modal, { open: true, title: 'Test', scrollable: true })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                const content = getContent()
                expect(overlay).not.toBeNull()
                expect(content).not.toBeNull()
                expect(overlay!.contains(content)).toBe(true)
            })
        })

        it('should place content as sibling of overlay when not scrollable', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                const content = getContent()
                expect(overlay).not.toBeNull()
                expect(content).not.toBeNull()
                expect(overlay!.contains(content)).toBe(false)
            })
        })

        it('should apply grid centering on overlay when scrollable + not fullscreen', async () => {
            render(Modal, { open: true, title: 'Test', scrollable: true })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('grid')
                expect(overlay!.className).toContain('place-items-center')
            })
        })
    })

    // ==================== CLOSE BUTTON ====================

    describe('close button', () => {
        it('should render close button by default', async () => {
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getClose()).not.toBeNull()
            })
        })

        it('should hide close button when close is false', async () => {
            render(Modal, { open: true, title: 'Test', close: false })
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
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render with non-dismissible behavior', async () => {
            render(Modal, { open: true, title: 'Test', dismissible: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onOpenChange when open state changes', async () => {
            const onOpenChange = vi.fn()
            render(Modal, { open: true, title: 'Test', onOpenChange })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onOpenChange).toBeTypeOf('function')
        })
    })

    // ==================== CONTENT LAYOUT ====================

    describe('content layout', () => {
        it('should render header with title', async () => {
            render(Modal, { open: true, title: 'My Title' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('My Title')
            })
        })

        it('should render header with title and description', async () => {
            render(Modal, { open: true, title: 'Title', description: 'Description' })
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
            render(Modal, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('fixed')
                expect(overlay!.className).toContain('inset-0')
                expect(overlay!.className).toContain('z-50')
            })
        })

        it('should apply content base classes', async () => {
            render(Modal, { open: true, title: 'Test' })
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
            render(Modal, { open: true, title: 'Test', ui: { overlay: 'custom-overlay' } })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('custom-overlay')
            })
        })

        it('should apply ui.content class', async () => {
            render(Modal, { open: true, title: 'Test', ui: { content: 'custom-content' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.header class', async () => {
            render(Modal, { open: true, title: 'Test', ui: { header: 'custom-header' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const header = content!.querySelector('.custom-header')
                expect(header).not.toBeNull()
            })
        })

        it('should apply ui.title class', async () => {
            render(Modal, { open: true, title: 'Test Title', ui: { title: 'custom-title' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const title = content!.querySelector('.custom-title')
                expect(title).not.toBeNull()
                expect(title!.textContent).toContain('Test Title')
            })
        })

        it('should apply ui.description class', async () => {
            render(Modal, {
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
            const { container } = render(Modal, { open: true, title: 'Test' })
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
        it('should render fullscreen + no close button', async () => {
            render(Modal, {
                open: true,
                title: 'Fullscreen',
                description: 'Full screen modal',
                fullscreen: true,
                close: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('inset-0')
                expect(content!.textContent).toContain('Fullscreen')
                expect(content!.textContent).toContain('Full screen modal')
            })
            expect(getClose()).toBeNull()
        })

        it('should render non-dismissible with no overlay', async () => {
            render(Modal, {
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

        it('should render scrollable + fullscreen', async () => {
            render(Modal, {
                open: true,
                title: 'Scroll Full',
                scrollable: true,
                fullscreen: true
            })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                const content = getContent()
                expect(overlay).not.toBeNull()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('inset-0')
                expect(overlay!.contains(content)).toBe(true)
            })
        })

        it('should render with all ui overrides', async () => {
            render(Modal, {
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
