import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Popover from './Popover.svelte'

describe('Popover', () => {
    const getContent = () => document.querySelector('[data-popover-content]') as HTMLElement | null
    const getArrow = () => document.querySelector('[data-popover-arrow]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Popover)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(Popover)
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(Popover, { open: true })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== POSITIONS (SIDE) ====================

    describe('positions', () => {
        it('should apply bottom side by default', async () => {
            render(Popover, { open: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('bottom')
            })
        })

        it('should apply top side', async () => {
            render(Popover, { open: true, side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
            })
        })

        it('should apply right side', async () => {
            render(Popover, { open: true, side: 'right' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
            })
        })

        it('should apply left side', async () => {
            render(Popover, { open: true, side: 'left' })
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
            render(Popover, { open: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('center')
            })
        })

        it('should apply start alignment', async () => {
            render(Popover, { open: true, align: 'start' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('start')
            })
        })

        it('should apply end alignment', async () => {
            render(Popover, { open: true, align: 'end' })
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
            render(Popover, { open: true })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(getArrow()).toBeNull()
        })

        it('should render arrow when arrow is true', async () => {
            render(Popover, { open: true, arrow: true })
            await vi.waitFor(() => {
                expect(getArrow()).not.toBeNull()
            })
        })

        it('should accept custom arrow dimensions', async () => {
            render(Popover, { open: true, arrow: { width: 16, height: 8 } })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
                const svg = arrow!.querySelector('svg')
                expect(svg).not.toBeNull()
                expect(svg!.getAttribute('width')).toBe('16')
                expect(svg!.getAttribute('height')).toBe('8')
            })
        })
    })

    // ==================== DISMISSIBLE ====================

    describe('dismissible', () => {
        it('should render with default dismissible behavior', async () => {
            render(Popover, { open: true })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render with non-dismissible behavior', async () => {
            render(Popover, { open: true, dismissible: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== PORTAL ====================

    describe('portal', () => {
        it('should render in portal by default', async () => {
            const { container } = render(Popover, { open: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(container.contains(content)).toBe(false)
                expect(document.body.contains(content)).toBe(true)
            })
        })
    })

    // ==================== TRANSITION ====================

    describe('transition', () => {
        it('should apply transition animation classes by default', async () => {
            render(Popover, { open: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toMatch(/animate-/)
            })
        })

        it('should not apply transition classes when transition is false', async () => {
            render(Popover, { open: true, transition: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).not.toMatch(/animate-\[fade/)
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply content base classes', async () => {
            render(Popover, { open: true })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('z-50')
                expect(content!.className).toContain('bg-surface-container-low')
                expect(content!.className).toContain('text-on-surface')
                expect(content!.className).toContain('rounded-md')
            })
        })

        it('should apply arrow classes', async () => {
            render(Popover, { open: true, arrow: true })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
                expect(arrow!.className).toContain('fill-surface-container-low')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.content class', async () => {
            render(Popover, { open: true, ui: { content: 'custom-content' } })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.arrow class', async () => {
            render(Popover, { open: true, arrow: true, ui: { arrow: 'custom-arrow' } })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
                expect(arrow!.className).toContain('custom-arrow')
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should accept onOpenChange callback', async () => {
            const onOpenChange = vi.fn()
            render(Popover, { open: true, onOpenChange })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onOpenChange).toBeTypeOf('function')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with arrow and custom side', async () => {
            render(Popover, { open: true, arrow: true, side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
                expect(getArrow()).not.toBeNull()
            })
        })

        it('should render with custom alignment and side', async () => {
            render(Popover, { open: true, side: 'right', align: 'start' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
                expect(content!.getAttribute('data-align')).toBe('start')
            })
        })

        it('should render with all ui overrides', async () => {
            render(Popover, {
                open: true,
                arrow: true,
                ui: {
                    content: 'ct-custom',
                    arrow: 'ar-custom'
                }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('ct-custom')
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
                expect(arrow!.className).toContain('ar-custom')
            })
        })

        it('should render non-dismissible with arrow', async () => {
            render(Popover, { open: true, arrow: true, dismissible: false })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
                expect(getArrow()).not.toBeNull()
            })
        })
    })
})
