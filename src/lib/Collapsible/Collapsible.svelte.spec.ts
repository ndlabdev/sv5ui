import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import CollapsibleTestWrapper from './CollapsibleTestWrapper.svelte'

const getRoot = () => document.querySelector('[data-collapsible-root]') as HTMLElement | null
const getTrigger = () => document.querySelector('[data-collapsible-trigger]') as HTMLElement | null
const getContent = () => document.querySelector('[data-collapsible-content]') as HTMLElement | null

describe('Collapsible', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a collapsible root element', () => {
            render(CollapsibleTestWrapper)
            expect(getRoot()).not.toBeNull()
        })

        it('should render a trigger element', () => {
            render(CollapsibleTestWrapper)
            expect(getTrigger()).not.toBeNull()
        })

        it('should render with data-state=closed by default', () => {
            render(CollapsibleTestWrapper)
            expect(getRoot()!.getAttribute('data-state')).toBe('closed')
        })

        it('should render with data-state=open when open=true', () => {
            render(CollapsibleTestWrapper, { open: true })
            expect(getRoot()!.getAttribute('data-state')).toBe('open')
        })
    })

    // ==================== OPEN/CLOSE ====================

    describe('open/close', () => {
        it('should toggle open state when trigger is clicked', async () => {
            render(CollapsibleTestWrapper)
            expect(getRoot()!.getAttribute('data-state')).toBe('closed')
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('data-state')).toBe('open')
            })
        })

        it('should close when trigger is clicked again', async () => {
            render(CollapsibleTestWrapper, { open: true })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('data-state')).toBe('closed')
            })
        })

        it('should call onOpenChange when toggled', async () => {
            const onOpenChange = vi.fn()
            render(CollapsibleTestWrapper, { onOpenChange })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(true)
            })
        })

        it('should call onOpenChange with false when closing', async () => {
            const onOpenChange = vi.fn()
            render(CollapsibleTestWrapper, { open: true, onOpenChange })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false)
            })
        })
    })

    // ==================== CONTENT ====================

    describe('content', () => {
        it('should have content hidden when closed', () => {
            render(CollapsibleTestWrapper)
            const content = getContent()
            expect(content).not.toBeNull()
            expect(content!.hasAttribute('hidden')).toBe(true)
        })

        it('should render content element when open', () => {
            render(CollapsibleTestWrapper, { open: true })
            expect(getContent()).not.toBeNull()
        })

        it('should show content after trigger click', async () => {
            render(CollapsibleTestWrapper)
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should have data-state=open on content when open', () => {
            render(CollapsibleTestWrapper, { open: true })
            expect(getContent()!.getAttribute('data-state')).toBe('open')
        })

        it('should render content text when open', () => {
            render(CollapsibleTestWrapper, { open: true })
            expect(getContent()!.textContent).toContain('Collapsible content')
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should apply data-disabled on root when disabled', () => {
            render(CollapsibleTestWrapper, { disabled: true })
            expect(getRoot()!.hasAttribute('data-disabled')).toBe(true)
        })

        it('should apply opacity class when disabled', () => {
            render(CollapsibleTestWrapper, { disabled: true })
            expect(getRoot()!.className).toMatch(/opacity-75/)
        })

        it('should apply cursor-not-allowed when disabled', () => {
            render(CollapsibleTestWrapper, { disabled: true })
            expect(getRoot()!.className).toMatch(/cursor-not-allowed/)
        })

        it('should not toggle when disabled and trigger clicked', async () => {
            const onOpenChange = vi.fn()
            render(CollapsibleTestWrapper, { disabled: true, onOpenChange })
            getTrigger()!.click()
            await new Promise((r) => setTimeout(r, 50))
            expect(onOpenChange).not.toHaveBeenCalled()
        })
    })

    // ==================== TRIGGER ====================

    describe('trigger', () => {
        it('should have data-state=closed on trigger by default', () => {
            render(CollapsibleTestWrapper)
            expect(getTrigger()!.getAttribute('data-state')).toBe('closed')
        })

        it('should update trigger data-state when opened', async () => {
            render(CollapsibleTestWrapper)
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getTrigger()!.getAttribute('data-state')).toBe('open')
            })
        })

        it('should show "Open" text when closed', () => {
            render(CollapsibleTestWrapper)
            expect(getTrigger()!.textContent).toContain('Open')
        })

        it('should show "Close" text when open', () => {
            render(CollapsibleTestWrapper, { open: true })
            expect(getTrigger()!.textContent).toContain('Close')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root', () => {
            render(CollapsibleTestWrapper, { class: 'my-custom-class' })
            expect(getRoot()!.className).toContain('my-custom-class')
        })

        it('should apply ui.root override', () => {
            render(CollapsibleTestWrapper, { ui: { root: 'my-root-class' } })
            expect(getRoot()!.className).toContain('my-root-class')
        })

        it('should apply ui.content override when open', () => {
            render(CollapsibleTestWrapper, { open: true, ui: { content: 'my-content-class' } })
            expect(getContent()!.className).toContain('my-content-class')
        })

        it('should not have extra default classes on root', () => {
            render(CollapsibleTestWrapper)
            // root slot is empty by default (matching Nuxt UI)
            expect(getRoot()).not.toBeNull()
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render open and disabled', () => {
            render(CollapsibleTestWrapper, { open: true, disabled: true })
            expect(getRoot()!.getAttribute('data-state')).toBe('open')
            expect(getRoot()!.hasAttribute('data-disabled')).toBe(true)
            expect(getRoot()!.className).toMatch(/opacity-75/)
        })

        it('should render with open and custom class', () => {
            render(CollapsibleTestWrapper, { open: true, class: 'combined-class' })
            expect(getRoot()!.getAttribute('data-state')).toBe('open')
            expect(getRoot()!.className).toContain('combined-class')
        })

        it('should render disabled with data-disabled on trigger', () => {
            render(CollapsibleTestWrapper, { disabled: true })
            expect(getTrigger()!.hasAttribute('data-disabled')).toBe(true)
        })
    })
})
