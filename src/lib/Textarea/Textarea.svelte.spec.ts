import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Textarea from './Textarea.svelte'

const getTextarea = () => document.querySelector('textarea') as HTMLTextAreaElement | null

describe('Textarea', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a textarea element', async () => {
            render(Textarea)
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeInTheDocument()
        })

        it('should render with placeholder', async () => {
            render(Textarea, { placeholder: 'Enter text...' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeInTheDocument()
            expect(getTextarea()!.placeholder).toBe('Enter text...')
        })

        it('should render with id', () => {
            render(Textarea, { id: 'my-textarea' })
            expect(getTextarea()!.id).toBe('my-textarea')
        })

        it('should render with name', () => {
            render(Textarea, { name: 'description' })
            expect(getTextarea()!.name).toBe('description')
        })

        it('should render with value', async () => {
            render(Textarea, { value: 'hello' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveValue('hello')
        })

        it('should render with default rows of 3', () => {
            render(Textarea)
            expect(getTextarea()!.rows).toBe(3)
        })

        it('should render with custom rows', () => {
            render(Textarea, { rows: 5 })
            expect(getTextarea()!.rows).toBe(5)
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Textarea, { disabled: true })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Textarea)
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeEnabled()
        })

        it('should apply disabled styling', async () => {
            render(Textarea, { disabled: true })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/disabled:cursor-not-allowed/)
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(Textarea, { loading: true })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeDisabled()
        })

        it('should render loading icon on leading side by default', () => {
            const { container } = render(Textarea, { loading: true })
            const spans = container.querySelectorAll('span')
            expect(spans.length).toBeGreaterThanOrEqual(1)
        })

        it('should render loading icon on trailing side when trailing is true', () => {
            const { container } = render(Textarea, { loading: true, trailing: true })
            const spans = container.querySelectorAll('span')
            expect(spans.length).toBeGreaterThanOrEqual(1)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, async () => {
                render(Textarea, { variant })
                const textarea = page.getByRole('textbox')
                await expect.element(textarea).toBeInTheDocument()
            })
        }

        it('should apply outline variant classes by default', async () => {
            render(Textarea)
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ring/)
            await expect.element(textarea).toHaveClass(/ring-inset/)
        })

        it('should apply soft variant classes', async () => {
            render(Textarea, { variant: 'soft', color: 'primary' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/bg-primary-container/)
        })

        it('should apply ghost variant classes', async () => {
            render(Textarea, { variant: 'ghost', color: 'primary' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/bg-transparent/)
        })

        it('should apply none variant classes', async () => {
            render(Textarea, { variant: 'none' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/bg-transparent/)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = [
            'primary',
            'secondary',
            'tertiary',
            'success',
            'warning',
            'error',
            'info'
        ] as const

        for (const color of colors) {
            it(`should render with color="${color}"`, async () => {
                render(Textarea, { color })
                const textarea = page.getByRole('textbox')
                await expect.element(textarea).toHaveClass(new RegExp(`ring-${color}`))
            })
        }

        it('should apply surface color with outline variant', async () => {
            render(Textarea, { color: 'surface', variant: 'outline' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ring-outline-variant/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', async () => {
            render(Textarea, { size: 'xs' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/text-xs/)
            await expect.element(textarea).toHaveClass(/py-1/)
        })

        it('should apply sm size classes', async () => {
            render(Textarea, { size: 'sm' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/text-xs/)
        })

        it('should apply md size classes by default', async () => {
            render(Textarea, { size: 'md' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/text-sm/)
        })

        it('should apply lg size classes', async () => {
            render(Textarea, { size: 'lg' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/text-sm/)
        })

        it('should apply xl size classes', async () => {
            render(Textarea, { size: 'xl' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/text-base/)
        })
    })

    // ==================== HIGHLIGHT ====================

    describe('highlight', () => {
        it('should apply highlight ring when highlight is true', async () => {
            render(Textarea, { highlight: true, color: 'primary' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ring-2/)
            await expect.element(textarea).toHaveClass(/ring-primary/)
        })

        it('should apply error highlight ring', async () => {
            render(Textarea, { highlight: true, color: 'error' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ring-2/)
            await expect.element(textarea).toHaveClass(/ring-error/)
        })

        it('should set aria-invalid when highlight is true', () => {
            render(Textarea, { highlight: true })
            expect(getTextarea()!.getAttribute('aria-invalid')).toBe('true')
        })

        it('should not set aria-invalid when highlight is false', () => {
            render(Textarea)
            expect(getTextarea()!.getAttribute('aria-invalid')).toBeNull()
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render with leadingIcon and adjust padding', async () => {
            render(Textarea, { leadingIcon: 'lucide:search' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeInTheDocument()
            await expect.element(textarea).toHaveClass(/ps-9/)
        })

        it('should render with trailingIcon and adjust padding', async () => {
            render(Textarea, { trailingIcon: 'lucide:eye' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeInTheDocument()
            await expect.element(textarea).toHaveClass(/pe-9/)
        })

        it('should render icon on leading side by default', async () => {
            render(Textarea, { icon: 'lucide:user' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ps-9/)
        })

        it('should render icon on trailing side when trailing is true', async () => {
            render(Textarea, { icon: 'lucide:user', trailing: true })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/pe-9/)
        })

        it('should render both leading and trailing icons', async () => {
            render(Textarea, {
                leadingIcon: 'lucide:mail',
                trailingIcon: 'lucide:check'
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ps-9/)
            await expect.element(textarea).toHaveClass(/pe-9/)
        })

        it('should adjust leading padding per size', async () => {
            render(Textarea, { leadingIcon: 'lucide:search', size: 'xs' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ps-7/)
        })

        it('should adjust trailing padding per size', async () => {
            render(Textarea, { trailingIcon: 'lucide:eye', size: 'xl' })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/pe-12/)
        })
    })

    // ==================== AUTORESIZE ====================

    describe('autoresize', () => {
        it('should apply resize-none class when autoresize is true', async () => {
            render(Textarea, { autoresize: true })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/resize-none/)
        })

        it('should not apply resize-none class when autoresize is false', async () => {
            render(Textarea, { autoresize: false })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).not.toHaveClass(/resize-none/)
        })
    })

    // ==================== EVENTS ====================

    describe('events', () => {
        it('should handle input events', async () => {
            const oninput = vi.fn()
            render(Textarea, { oninput })
            const textarea = page.getByRole('textbox')
            await textarea.fill('hello')
            expect(oninput).toHaveBeenCalled()
        })

        it('should handle focus events', async () => {
            const onfocus = vi.fn()
            render(Textarea, { onfocus })
            const textarea = page.getByRole('textbox')
            await textarea.click()
            expect(onfocus).toHaveBeenCalledOnce()
        })

        it('should handle blur events', async () => {
            const onblur = vi.fn()
            render(Textarea, { onblur })
            await page.getByRole('textbox').click()
            getTextarea()!.blur()
            expect(onblur).toHaveBeenCalledOnce()
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Textarea, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot overrides to textarea element', async () => {
            render(Textarea, { ui: { base: 'my-textarea-class' } })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/my-textarea-class/)
        })

        it('should apply ui slot overrides to root element', () => {
            const { container } = render(Textarea, { ui: { root: 'my-root-class' } })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should support aria-label', () => {
            render(Textarea, { 'aria-label': 'Description input' })
            expect(getTextarea()!.getAttribute('aria-label')).toBe('Description input')
        })

        it('should support readonly', () => {
            render(Textarea, { readonly: true })
            expect(getTextarea()!.readOnly).toBe(true)
        })

        it('should support required', () => {
            render(Textarea, { required: true })
            expect(getTextarea()!.required).toBe(true)
        })

        it('should support autocomplete', () => {
            render(Textarea, { autocomplete: 'off' })
            expect(getTextarea()!.autocomplete).toBe('off')
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with multiple props combined', async () => {
            render(Textarea, {
                variant: 'outline',
                color: 'error',
                size: 'lg',
                highlight: true
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeInTheDocument()
            await expect.element(textarea).toHaveClass(/ring-2/)
            await expect.element(textarea).toHaveClass(/ring-error/)
            await expect.element(textarea).toHaveClass(/text-sm/)
        })

        it('should render loading with leadingIcon', async () => {
            render(Textarea, {
                leadingIcon: 'lucide:search',
                loading: true
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeDisabled()
            await expect.element(textarea).toHaveClass(/ps-9/)
        })

        it('should render disabled with highlight', async () => {
            render(Textarea, {
                disabled: true,
                highlight: true,
                color: 'error'
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toBeDisabled()
            await expect.element(textarea).toHaveClass(/ring-error/)
        })

        it('should render with both icons and highlight', async () => {
            render(Textarea, {
                leadingIcon: 'lucide:mail',
                trailingIcon: 'lucide:check',
                highlight: true,
                color: 'success'
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/ps-9/)
            await expect.element(textarea).toHaveClass(/pe-9/)
            await expect.element(textarea).toHaveClass(/ring-success/)
        })

        it('should render autoresize with custom rows', async () => {
            render(Textarea, {
                autoresize: true,
                rows: 5
            })
            const textarea = page.getByRole('textbox')
            await expect.element(textarea).toHaveClass(/resize-none/)
            expect(getTextarea()!.rows).toBe(5)
        })
    })
})
