import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Pagination from './Pagination.svelte'

describe('Pagination', () => {
    const defaultProps = { total: 100, itemsPerPage: 10 }

    const getRoot = () => document.querySelector('[data-pagination-root]') as HTMLElement | null
    const getPageButtons = () => document.querySelectorAll('[data-pagination-page]')
    const getPrevButton = () =>
        document.querySelector('[data-pagination-prev]') as HTMLButtonElement | null
    const getNextButton = () =>
        document.querySelector('[data-pagination-next]') as HTMLButtonElement | null
    const getFirstButton = () =>
        document.querySelector('button[aria-label="First page"]') as HTMLButtonElement | null
    const getLastButton = () =>
        document.querySelector('button[aria-label="Last page"]') as HTMLButtonElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Pagination, defaultProps)
            expect(container).not.toBeNull()
        })

        it('should render pagination root', async () => {
            render(Pagination, defaultProps)
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should render page buttons', async () => {
            render(Pagination, defaultProps)
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBeGreaterThan(0)
            })
        })

        it('should render prev and next buttons by default', async () => {
            render(Pagination, defaultProps)
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should not render first and last buttons by default', async () => {
            render(Pagination, defaultProps)
            await vi.waitFor(() => {
                expect(getFirstButton()).toBeNull()
                expect(getLastButton()).toBeNull()
            })
        })
    })

    // ==================== DEFAULT PAGE ====================

    describe('default page', () => {
        it('should select first page by default', async () => {
            render(Pagination, defaultProps)
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const selected = Array.from(buttons).find(
                    (b) => b.getAttribute('data-selected') !== null
                )
                expect(selected).not.toBeUndefined()
                expect(selected?.textContent?.trim()).toBe('1')
            })
        })

        it('should select specified page', async () => {
            render(Pagination, { ...defaultProps, page: 5 })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const selected = Array.from(buttons).find(
                    (b) => b.getAttribute('data-selected') !== null
                )
                expect(selected?.textContent?.trim()).toBe('5')
            })
        })

        it('should select defaultPage when page is not provided', async () => {
            render(Pagination, { ...defaultProps, defaultPage: 3 })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const selected = Array.from(buttons).find(
                    (b) => b.getAttribute('data-selected') !== null
                )
                expect(selected?.textContent?.trim()).toBe('3')
            })
        })
    })

    // ==================== PAGE NAVIGATION ====================

    describe('page navigation', () => {
        it('should navigate to next page on next button click', async () => {
            render(Pagination, defaultProps)

            await vi.waitFor(() => {
                const nextBtn = getNextButton()
                expect(nextBtn).not.toBeNull()
            })

            getNextButton()!.click()

            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const selected = Array.from(buttons).find(
                    (b) => b.getAttribute('data-selected') !== null
                )
                expect(selected?.textContent?.trim()).toBe('2')
            })
        })

        it('should navigate to page on page button click', async () => {
            render(Pagination, defaultProps)

            await page.getByText('3').click()

            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const selected = Array.from(buttons).find(
                    (b) => b.getAttribute('data-selected') !== null
                )
                expect(selected?.textContent?.trim()).toBe('3')
            })
        })

        it('should disable prev button on first page', async () => {
            render(Pagination, { ...defaultProps, page: 1 })
            await vi.waitFor(() => {
                const prevBtn = getPrevButton()
                expect(prevBtn).not.toBeNull()
                expect(prevBtn!.disabled).toBe(true)
            })
        })

        it('should disable next button on last page', async () => {
            render(Pagination, { ...defaultProps, page: 10 })
            await vi.waitFor(() => {
                const nextBtn = getNextButton()
                expect(nextBtn).not.toBeNull()
                expect(nextBtn!.disabled).toBe(true)
            })
        })
    })

    // ==================== SHOW EDGES ====================

    describe('showEdges', () => {
        it('should render first and last buttons when showEdges is true', async () => {
            render(Pagination, { ...defaultProps, showEdges: true })
            await vi.waitFor(() => {
                expect(getFirstButton()).not.toBeNull()
                expect(getLastButton()).not.toBeNull()
            })
        })

        it('should disable first button on first page', async () => {
            render(Pagination, { ...defaultProps, showEdges: true, page: 1 })
            await vi.waitFor(() => {
                const firstBtn = getFirstButton()
                expect(firstBtn).not.toBeNull()
                expect(firstBtn!.disabled).toBe(true)
            })
        })

        it('should disable last button on last page', async () => {
            render(Pagination, { ...defaultProps, showEdges: true, page: 10 })
            await vi.waitFor(() => {
                const lastBtn = getLastButton()
                expect(lastBtn).not.toBeNull()
                expect(lastBtn!.disabled).toBe(true)
            })
        })
    })

    // ==================== SHOW CONTROLS ====================

    describe('showControls', () => {
        it('should hide prev and next buttons when showControls is false', async () => {
            render(Pagination, { ...defaultProps, showControls: false })
            await vi.waitFor(() => {
                expect(getPrevButton()).toBeNull()
                expect(getNextButton()).toBeNull()
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled state', () => {
        it('should apply disabled styles when disabled', async () => {
            render(Pagination, { ...defaultProps, disabled: true })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('opacity-50')
                expect(root!.className).toContain('pointer-events-none')
            })
        })

        it('should disable prev and next buttons when disabled', async () => {
            render(Pagination, { ...defaultProps, disabled: true })
            await vi.waitFor(() => {
                const prevBtn = getPrevButton()
                const nextBtn = getNextButton()
                expect(prevBtn).not.toBeNull()
                expect(nextBtn).not.toBeNull()
                expect(prevBtn!.disabled).toBe(true)
                expect(nextBtn!.disabled).toBe(true)
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onPageChange when page changes', async () => {
            const onPageChange = vi.fn()
            render(Pagination, { ...defaultProps, onPageChange })

            await page.getByText('3').click()

            await vi.waitFor(() => {
                expect(onPageChange).toHaveBeenCalledWith(3)
            })
        })
    })

    // ==================== SIZE VARIANTS ====================

    describe('size variants', () => {
        it('should apply xs size classes', async () => {
            render(Pagination, { ...defaultProps, size: 'xs' })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBeGreaterThan(0)
                const btn = buttons[0] as HTMLElement
                expect(btn.className).toContain('text-xs')
            })
        })

        it('should apply md size classes', async () => {
            render(Pagination, { ...defaultProps, size: 'md' })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBeGreaterThan(0)
                const btn = buttons[0] as HTMLElement
                expect(btn.className).toContain('text-sm')
            })
        })

        it('should apply xl size classes', async () => {
            render(Pagination, { ...defaultProps, size: 'xl' })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBeGreaterThan(0)
                const btn = buttons[0] as HTMLElement
                expect(btn.className).toContain('text-base')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.list class', async () => {
            render(Pagination, {
                ...defaultProps,
                ui: { list: 'custom-list' }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                const list = root!.querySelector('.custom-list')
                expect(list).not.toBeNull()
            })
        })

        it('should apply ui.item class', async () => {
            render(Pagination, {
                ...defaultProps,
                ui: { item: 'custom-item' }
            })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBeGreaterThan(0)
                expect((buttons[0] as HTMLElement).className).toContain('custom-item')
            })
        })
    })

    // ==================== ITEMS PER PAGE ====================

    describe('itemsPerPage', () => {
        it('should calculate correct number of pages', async () => {
            render(Pagination, { total: 50, itemsPerPage: 5, page: 1 })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                const lastPageButton = buttons[buttons.length - 1]
                expect(lastPageButton?.textContent?.trim()).toBe('10')
            })
        })

        it('should handle single page', async () => {
            render(Pagination, { total: 5, itemsPerPage: 10, page: 1 })
            await vi.waitFor(() => {
                const buttons = getPageButtons()
                expect(buttons.length).toBe(1)
                expect(buttons[0]?.textContent?.trim()).toBe('1')
            })
        })
    })
})
