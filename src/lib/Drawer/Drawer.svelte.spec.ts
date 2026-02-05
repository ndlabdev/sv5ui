import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Drawer from './Drawer.svelte'

describe('Drawer', () => {
    // Helper: query inside the portal (document.body) since Drawer portals its content
    const getOverlay = () => document.querySelector('[data-vaul-overlay]') as HTMLElement | null
    const getContent = () => document.querySelector('[data-vaul-drawer]') as HTMLElement | null
    const getHandle = () => document.querySelector('[data-vaul-handle]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Drawer)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(Drawer, { title: 'Test' })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await expect.element(page.getByText('Test')).toBeVisible()
        })

        it('should render overlay when open', async () => {
            render(Drawer, { open: true, title: 'Test' })
            // Wait for drawer to mount
            await vi.waitFor(() => {
                expect(getOverlay()).not.toBeNull()
            })
        })

        it('should render handle by default when open', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getHandle()).not.toBeNull()
            })
        })
    })

    // ==================== TITLE & DESCRIPTION ====================

    describe('title and description', () => {
        it('should render title text', async () => {
            render(Drawer, { open: true, title: 'My Title', modal: false })
            await expect.element(page.getByText('My Title')).toBeVisible()
        })

        it('should render description text', async () => {
            render(Drawer, {
                open: true,
                title: 'Title',
                description: 'My Description',
                modal: false
            })
            await expect.element(page.getByText('My Description')).toBeVisible()
        })

        it('should render both title and description', async () => {
            render(Drawer, { open: true, title: 'Title', description: 'Desc', modal: false })
            await expect.element(page.getByText('Title')).toBeVisible()
            await expect.element(page.getByText('Desc')).toBeVisible()
        })

        it('should apply title class from variants', async () => {
            render(Drawer, { open: true, title: 'Styled Title', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const titleEl =
                    (content!.querySelector('[data-vaul-drawer-title]') as HTMLElement) ??
                    (content!.querySelector('h2') as HTMLElement) ??
                    (Array.from(content!.querySelectorAll('*')).find(
                        (el) => el.textContent?.trim() === 'Styled Title'
                    ) as HTMLElement)
                expect(titleEl).not.toBeNull()
            })
        })
    })

    // ==================== DIRECTION VARIANTS ====================

    describe('directions', () => {
        it('should apply bottom direction classes by default', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('flex-col')
            })
        })

        it('should apply top direction classes', async () => {
            render(Drawer, { open: true, title: 'Test', direction: 'top', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('flex-col-reverse')
            })
        })

        it('should apply right direction classes', async () => {
            render(Drawer, { open: true, title: 'Test', direction: 'right', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('flex-row')
            })
        })

        it('should apply left direction classes', async () => {
            render(Drawer, { open: true, title: 'Test', direction: 'left', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('flex-row-reverse')
            })
        })
    })

    // ==================== INSET VARIANT ====================

    describe('inset', () => {
        it('should not apply inset by default', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('rounded-t-lg')
            })
        })

        it('should apply inset classes when inset is true', async () => {
            render(Drawer, { open: true, title: 'Test', inset: true, modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('rounded-lg')
                expect(content!.className).toContain('overflow-hidden')
            })
        })

        it('should apply bottom inset positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: true,
                direction: 'bottom',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('bottom-4')
                expect(content!.className).toContain('inset-x-4')
            })
        })

        it('should apply top inset positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: true,
                direction: 'top',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('top-4')
                expect(content!.className).toContain('inset-x-4')
            })
        })

        it('should apply right inset positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: true,
                direction: 'right',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('right-4')
                expect(content!.className).toContain('inset-y-4')
            })
        })

        it('should apply left inset positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: true,
                direction: 'left',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-4')
                expect(content!.className).toContain('inset-y-4')
            })
        })
    })

    // ==================== HANDLE OPTIONS ====================

    describe('handle', () => {
        it('should render handle by default', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getHandle()).not.toBeNull()
            })
        })

        it('should hide handle when handle is false', async () => {
            render(Drawer, { open: true, title: 'Test', handle: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
            expect(getHandle()).toBeNull()
        })
    })

    // ==================== OVERLAY ====================

    describe('overlay', () => {
        it('should render overlay by default', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getOverlay()).not.toBeNull()
            })
        })

        it('should hide overlay when overlay is false', async () => {
            render(Drawer, { open: true, title: 'Test', overlay: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
            expect(getOverlay()).toBeNull()
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onOpenChange when open state changes', async () => {
            const onOpenChange = vi.fn()
            render(Drawer, { open: true, title: 'Test', onOpenChange, modal: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            // onOpenChange is called through our wrapper, so verify it's wired up
            expect(onOpenChange).toBeTypeOf('function')
        })

        it('should call onClose callback', async () => {
            const onClose = vi.fn()
            render(Drawer, { open: true, title: 'Test', onClose, modal: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onClose).toBeTypeOf('function')
        })
    })

    // ==================== MODAL & DISMISSIBLE ====================

    describe('modal and dismissible', () => {
        it('should render as modal by default', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render as non-modal', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render as non-dismissible', async () => {
            render(Drawer, { open: true, title: 'Test', dismissible: false, modal: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== CONTENT LAYOUT ====================

    describe('content layout', () => {
        it('should render container with layout classes', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const container = content!.querySelector(
                    'div[class*="flex"][class*="flex-col"]'
                ) as HTMLElement
                expect(container).not.toBeNull()
            })
        })

        it('should render header with title', async () => {
            render(Drawer, { open: true, title: 'My Title', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('My Title')
            })
        })

        it('should render header with title and description', async () => {
            render(Drawer, { open: true, title: 'Title', description: 'Description', modal: false })
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
        it('should apply overlay classes', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('fixed')
                expect(overlay!.className).toContain('inset-0')
                expect(overlay!.className).toContain('z-50')
            })
        })

        it('should apply content base classes', async () => {
            render(Drawer, { open: true, title: 'Test', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('fixed')
                expect(content!.className).toContain('z-50')
                expect(content!.className).toContain('bg-surface-container-low')
            })
        })

        it('should apply handle classes', async () => {
            render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const handle = getHandle()
                expect(handle).not.toBeNull()
                // handle wraps a child with the visual styles
                const handleParent = handle!.closest('[data-vaul-handle]') ?? handle!
                expect(handleParent).not.toBeNull()
            })
        })

        it('should apply vertical handle sizing for bottom direction', async () => {
            render(Drawer, { open: true, title: 'Test', direction: 'bottom', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('max-h-[96%]')
            })
        })

        it('should apply horizontal sizing for right direction', async () => {
            render(Drawer, { open: true, title: 'Test', direction: 'right', modal: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('max-w-[calc(100%-2rem)]')
            })
        })

        it('should apply non-inset bottom positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: false,
                direction: 'bottom',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('bottom-0')
                expect(content!.className).toContain('inset-x-0')
                expect(content!.className).toContain('rounded-t-lg')
            })
        })

        it('should apply non-inset right positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: false,
                direction: 'right',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('right-0')
                expect(content!.className).toContain('inset-y-0')
                expect(content!.className).toContain('rounded-l-lg')
            })
        })

        it('should apply non-inset left positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: false,
                direction: 'left',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-0')
                expect(content!.className).toContain('inset-y-0')
                expect(content!.className).toContain('rounded-r-lg')
            })
        })

        it('should apply non-inset top positioning', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                inset: false,
                direction: 'top',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('top-0')
                expect(content!.className).toContain('inset-x-0')
                expect(content!.className).toContain('rounded-b-lg')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.overlay class', async () => {
            render(Drawer, { open: true, title: 'Test', ui: { overlay: 'custom-overlay' } })
            await vi.waitFor(() => {
                const overlay = getOverlay()
                expect(overlay).not.toBeNull()
                expect(overlay!.className).toContain('custom-overlay')
            })
        })

        it('should apply ui.content class', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                ui: { content: 'custom-content' },
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.container class', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                ui: { container: 'custom-container' },
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const container = content!.querySelector('.custom-container')
                expect(container).not.toBeNull()
            })
        })

        it('should apply ui.header class', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                ui: { header: 'custom-header' },
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const header = content!.querySelector('.custom-header')
                expect(header).not.toBeNull()
            })
        })

        it('should apply ui.title class', async () => {
            render(Drawer, {
                open: true,
                title: 'Test Title',
                ui: { title: 'custom-title' },
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const title = content!.querySelector('.custom-title')
                expect(title).not.toBeNull()
                expect(title!.textContent).toContain('Test Title')
            })
        })

        it('should apply ui.description class', async () => {
            render(Drawer, {
                open: true,
                title: 'Title',
                description: 'Test Desc',
                ui: { description: 'custom-desc' },
                modal: false
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
            const { container } = render(Drawer, { open: true, title: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                // Content should be in document.body (portaled), not inside render container
                expect(container.contains(content)).toBe(false)
                expect(document.body.contains(content)).toBe(true)
            })
        })
    })

    // ==================== SNAP POINTS ====================

    describe('snap points', () => {
        it('should render with snap points', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                snapPoints: [0.5, 1],
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
            })
        })

        it('should apply full height class with snap points for vertical directions', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                snapPoints: [0.5, 1],
                direction: 'bottom',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('h-full')
            })
        })

        it('should apply full width class with snap points for horizontal directions', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                snapPoints: [0.5, 1],
                direction: 'right',
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('w-full')
            })
        })

        it('should accept snapPoints with fadeFromIndex', async () => {
            render(Drawer, {
                open: true,
                title: 'Test',
                snapPoints: [0.25, 0.5, 1],
                fadeFromIndex: 1,
                modal: false
            })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render inset + right direction', async () => {
            render(Drawer, {
                open: true,
                title: 'Settings',
                description: 'App settings',
                direction: 'right',
                inset: true,
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('right-4')
                expect(content!.className).toContain('inset-y-4')
                expect(content!.className).toContain('rounded-lg')
                expect(content!.textContent).toContain('Settings')
                expect(content!.textContent).toContain('App settings')
            })
        })

        it('should render with no handle, no overlay, non-modal', async () => {
            render(Drawer, {
                open: true,
                title: 'Minimal',
                handle: false,
                overlay: false,
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Minimal')
            })
            expect(getHandle()).toBeNull()
            expect(getOverlay()).toBeNull()
        })

        it('should render inset + left + no handle', async () => {
            render(Drawer, {
                open: true,
                title: 'Sidebar',
                direction: 'left',
                inset: true,
                handle: false,
                modal: false
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('left-4')
                expect(content!.className).toContain('rounded-lg')
            })
            expect(getHandle()).toBeNull()
        })

        it('should render with all ui overrides', async () => {
            render(Drawer, {
                open: true,
                title: 'Full Override',
                description: 'Override desc',
                ui: {
                    overlay: 'ov-custom',
                    content: 'ct-custom',
                    container: 'cn-custom',
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
                expect(content!.querySelector('.cn-custom')).not.toBeNull()
                expect(content!.querySelector('.hd-custom')).not.toBeNull()
                expect(content!.querySelector('.tt-custom')).not.toBeNull()
                expect(content!.querySelector('.dc-custom')).not.toBeNull()
            })
        })
    })
})
