import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tooltip from './TooltipTestWrapper.svelte'

describe('Tooltip', () => {
    // Helper: query inside the portal (document.body) since Tooltip portals its content
    // bits-ui adds these data attributes to tooltip elements
    const getContent = () => document.querySelector('[data-tooltip-content]') as HTMLElement | null
    const getArrow = () => document.querySelector('[data-arrow]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Tooltip, { text: 'Test' })
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(Tooltip, { text: 'Test' })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(Tooltip, { open: true, text: 'Test tooltip' })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render text content', async () => {
            render(Tooltip, { open: true, text: 'Hello World' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Hello World')
            })
        })
    })

    // ==================== POSITIONS (SIDE) ====================

    describe('positions', () => {
        it('should apply bottom side by default', async () => {
            render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('bottom')
            })
        })

        it('should apply top side', async () => {
            render(Tooltip, { open: true, text: 'Test', side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
            })
        })

        it('should apply right side', async () => {
            render(Tooltip, { open: true, text: 'Test', side: 'right' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
            })
        })

        it('should apply left side', async () => {
            render(Tooltip, { open: true, text: 'Test', side: 'left' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('left')
            })
        })
    })

    // ==================== ALIGNMENT ====================

    describe('alignment', () => {
        it('should apply center alignment by default', async () => {
            render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('center')
            })
        })

        it('should apply start alignment', async () => {
            render(Tooltip, { open: true, text: 'Test', align: 'start' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('start')
            })
        })

        it('should apply end alignment', async () => {
            render(Tooltip, { open: true, text: 'Test', align: 'end' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('end')
            })
        })
    })

    // ==================== ARROW ====================

    describe('arrow', () => {
        it('should not render arrow by default', async () => {
            render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(getArrow()).toBeNull()
        })

        it('should render arrow when arrow is true', async () => {
            render(Tooltip, { open: true, text: 'Test', arrow: true })
            await vi.waitFor(() => {
                expect(getArrow()).not.toBeNull()
            })
        })

        it('should accept custom arrow dimensions', async () => {
            render(Tooltip, { open: true, text: 'Test', arrow: { width: 12, height: 6 } })
            await vi.waitFor(() => {
                expect(getArrow()).not.toBeNull()
            })
        })
    })

    // ==================== KEYBOARD SHORTCUTS ====================

    describe('keyboard shortcuts', () => {
        it('should render keyboard shortcuts', async () => {
            render(Tooltip, { open: true, text: 'Search', kbds: ['meta', 'k'] })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                // Should have kbd elements
                const kbdElements = content!.querySelectorAll('kbd')
                expect(kbdElements.length).toBeGreaterThan(0)
            })
        })

        it('should render multiple kbd elements', async () => {
            render(Tooltip, { open: true, text: 'Test', kbds: ['ctrl', 'shift', 'p'] })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const kbdElements = content!.querySelectorAll('kbd')
                expect(kbdElements.length).toBe(3)
            })
        })

        it('should render text without kbds', async () => {
            render(Tooltip, { open: true, text: 'Just text' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Just text')
            })
            const content = getContent()
            expect(content!.querySelectorAll('kbd').length).toBe(0)
        })

        it('should render kbds without text', async () => {
            render(Tooltip, { open: true, kbds: ['meta', 's'] })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const kbdElements = content!.querySelectorAll('kbd')
                expect(kbdElements.length).toBe(2)
            })
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should show tooltip when not disabled', async () => {
            render(Tooltip, { open: true, text: 'Test', disabled: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should accept disabled prop', () => {
            // Tooltip disabled state is controlled via the disabled prop
            // When disabled, it prevents opening on hover/focus but may still show if open=true
            const { container } = render(Tooltip, { text: 'Test', disabled: true })
            expect(container).not.toBeNull()
        })
    })

    // ==================== PORTAL ====================

    describe('portal', () => {
        it('should render in portal by default', async () => {
            const { container } = render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                // Content should be in body (portaled), not in render container
                expect(container.contains(content)).toBe(false)
                expect(document.body.contains(content)).toBe(true)
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply content base classes', async () => {
            render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('z-50')
                expect(content!.className).toContain('flex')
                expect(content!.className).toContain('items-center')
                expect(content!.className).toContain('bg-inverse-surface')
                expect(content!.className).toContain('text-inverse-on-surface')
            })
        })

        it('should apply text truncate class', async () => {
            render(Tooltip, { open: true, text: 'Test' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const textSpan = content!.querySelector('span.truncate')
                expect(textSpan).not.toBeNull()
            })
        })

        it('should render arrow element', async () => {
            render(Tooltip, { open: true, text: 'Test', arrow: true })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.content class', async () => {
            render(Tooltip, { open: true, text: 'Test', ui: { content: 'custom-content' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.text class', async () => {
            render(Tooltip, { open: true, text: 'Test', ui: { text: 'custom-text' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const textSpan = content!.querySelector('.custom-text')
                expect(textSpan).not.toBeNull()
            })
        })

        it('should accept ui.arrow prop', async () => {
            render(Tooltip, {
                open: true,
                text: 'Test',
                arrow: true,
                ui: { arrow: 'custom-arrow' }
            })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
            })
        })

        it('should apply ui.kbds class', async () => {
            render(Tooltip, {
                open: true,
                text: 'Test',
                kbds: ['meta'],
                ui: { kbds: 'custom-kbds' }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                const kbdsSpan = content!.querySelector('.custom-kbds')
                expect(kbdsSpan).not.toBeNull()
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with text, kbds, and arrow', async () => {
            render(Tooltip, {
                open: true,
                text: 'Save',
                kbds: ['meta', 's'],
                arrow: true,
                side: 'top'
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.textContent).toContain('Save')
                expect(content!.querySelectorAll('kbd').length).toBe(2)
                expect(getArrow()).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
            })
        })

        it('should render with all ui overrides', async () => {
            render(Tooltip, {
                open: true,
                text: 'Styled',
                kbds: ['ctrl'],
                arrow: true,
                ui: {
                    content: 'ct-custom',
                    text: 'tx-custom',
                    arrow: 'ar-custom',
                    kbds: 'kb-custom'
                }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content!.className).toContain('ct-custom')
                expect(content!.querySelector('.tx-custom')).not.toBeNull()
                expect(getArrow()).not.toBeNull()
                expect(content!.querySelector('.kb-custom')).not.toBeNull()
            })
        })

        it('should render with custom alignment and side', async () => {
            render(Tooltip, {
                open: true,
                text: 'Test',
                side: 'right',
                align: 'start'
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
                expect(content!.getAttribute('data-align')).toBe('start')
            })
        })
    })
})
