import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Input from './Input.svelte'

const AVATAR_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const getInput = () => document.querySelector('input') as HTMLInputElement | null

describe('Input', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render an input element', async () => {
            render(Input)
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
        })

        it('should render with placeholder', async () => {
            render(Input, { placeholder: 'Enter text...' })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
            expect(getInput()!.placeholder).toBe('Enter text...')
        })

        it('should render with type text by default', () => {
            render(Input)
            expect(getInput()!.type).toBe('text')
        })

        it('should render with custom type', () => {
            render(Input, { type: 'email' })
            expect(getInput()!.type).toBe('email')
        })

        it('should render with id', () => {
            render(Input, { id: 'my-input' })
            expect(getInput()!.id).toBe('my-input')
        })

        it('should render with name', () => {
            render(Input, { name: 'email' })
            expect(getInput()!.name).toBe('email')
        })

        it('should render with value', async () => {
            render(Input, { value: 'hello' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveValue('hello')
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Input, { disabled: true })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Input)
            const input = page.getByRole('textbox')
            await expect.element(input).toBeEnabled()
        })

        it('should apply disabled styling', async () => {
            render(Input, { disabled: true })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/disabled:cursor-not-allowed/)
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(Input, { loading: true })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeDisabled()
        })

        it('should render loading icon on leading side by default', () => {
            const { container } = render(Input, { loading: true })
            const spans = container.querySelectorAll('span')
            expect(spans.length).toBeGreaterThanOrEqual(1)
        })

        it('should render loading icon on trailing side when trailing is true', () => {
            const { container } = render(Input, { loading: true, trailing: true })
            const spans = container.querySelectorAll('span')
            expect(spans.length).toBeGreaterThanOrEqual(1)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, async () => {
                render(Input, { variant })
                const input = page.getByRole('textbox')
                await expect.element(input).toBeInTheDocument()
            })
        }

        it('should apply outline variant classes by default', async () => {
            render(Input)
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ring/)
            await expect.element(input).toHaveClass(/ring-inset/)
        })

        it('should apply soft variant classes', async () => {
            render(Input, { variant: 'soft', color: 'primary' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/bg-primary-container/)
        })

        it('should apply ghost variant classes', async () => {
            render(Input, { variant: 'ghost', color: 'primary' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/bg-transparent/)
        })

        it('should apply none variant classes', async () => {
            render(Input, { variant: 'none' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/bg-transparent/)
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
                render(Input, { color })
                const input = page.getByRole('textbox')
                await expect.element(input).toHaveClass(new RegExp(`ring-${color}`))
            })
        }

        it('should apply surface color with outline variant', async () => {
            render(Input, { color: 'surface', variant: 'outline' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ring-outline-variant/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', async () => {
            render(Input, { size: 'xs' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/text-xs/)
            await expect.element(input).toHaveClass(/py-1/)
        })

        it('should apply sm size classes', async () => {
            render(Input, { size: 'sm' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/text-xs/)
        })

        it('should apply md size classes by default', async () => {
            render(Input, { size: 'md' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/text-sm/)
        })

        it('should apply lg size classes', async () => {
            render(Input, { size: 'lg' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/text-sm/)
        })

        it('should apply xl size classes', async () => {
            render(Input, { size: 'xl' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/text-base/)
        })
    })

    // ==================== HIGHLIGHT ====================

    describe('highlight', () => {
        it('should apply highlight ring when highlight is true', async () => {
            render(Input, { highlight: true, color: 'primary' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ring-2/)
            await expect.element(input).toHaveClass(/ring-primary/)
        })

        it('should apply error highlight ring', async () => {
            render(Input, { highlight: true, color: 'error' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ring-2/)
            await expect.element(input).toHaveClass(/ring-error/)
        })

        it('should set aria-invalid when highlight is true', () => {
            render(Input, { highlight: true })
            expect(getInput()!.getAttribute('aria-invalid')).toBe('true')
        })

        it('should not set aria-invalid when highlight is false', () => {
            render(Input)
            expect(getInput()!.getAttribute('aria-invalid')).toBeNull()
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render with leadingIcon and adjust padding', async () => {
            render(Input, { leadingIcon: 'lucide:search' })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
            await expect.element(input).toHaveClass(/ps-9/)
        })

        it('should render with trailingIcon and adjust padding', async () => {
            render(Input, { trailingIcon: 'lucide:eye' })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
            await expect.element(input).toHaveClass(/pe-9/)
        })

        it('should render icon on leading side by default', async () => {
            render(Input, { icon: 'lucide:user' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ps-9/)
        })

        it('should render icon on trailing side when trailing is true', async () => {
            render(Input, { icon: 'lucide:user', trailing: true })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/pe-9/)
        })

        it('should render both leading and trailing icons', async () => {
            render(Input, {
                leadingIcon: 'lucide:mail',
                trailingIcon: 'lucide:check'
            })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ps-9/)
            await expect.element(input).toHaveClass(/pe-9/)
        })

        it('should adjust leading padding per size', async () => {
            render(Input, { leadingIcon: 'lucide:search', size: 'xs' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ps-7/)
        })

        it('should adjust trailing padding per size', async () => {
            render(Input, { trailingIcon: 'lucide:eye', size: 'xl' })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/pe-12/)
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar with alt initials as fallback', () => {
            const { container } = render(Input, {
                avatar: { alt: 'John Doe' }
            })
            expect(container.textContent).toContain('JD')
        })

        it('should render avatar with src as img element', async () => {
            render(Input, {
                avatar: { src: AVATAR_SRC, alt: 'User avatar' }
            })
            const img = page.getByRole('img', { name: 'User avatar' })
            await expect.element(img).toBeInTheDocument()
        })

        it('should apply leading padding when avatar is present', async () => {
            render(Input, { avatar: { alt: 'User' } })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ps-9/)
        })

        it('should not render avatar when leadingIcon is provided', () => {
            const { container } = render(Input, {
                leadingIcon: 'lucide:user',
                avatar: { alt: 'John Doe' }
            })
            expect(container.textContent).not.toContain('JD')
        })

        it('should not render avatar when loading', () => {
            const { container } = render(Input, {
                avatar: { alt: 'John Doe' },
                loading: true
            })
            expect(container.textContent).not.toContain('JD')
        })
    })

    // ==================== EVENTS ====================

    describe('events', () => {
        it('should handle input events', async () => {
            const oninput = vi.fn()
            render(Input, { oninput })
            const input = page.getByRole('textbox')
            await input.fill('hello')
            expect(oninput).toHaveBeenCalled()
        })

        it('should handle focus events', async () => {
            const onfocus = vi.fn()
            render(Input, { onfocus })
            const input = page.getByRole('textbox')
            await input.click()
            expect(onfocus).toHaveBeenCalledOnce()
        })

        it('should handle blur events', async () => {
            const onblur = vi.fn()
            render(Input, { onblur })
            await page.getByRole('textbox').click()
            getInput()!.blur()
            expect(onblur).toHaveBeenCalledOnce()
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Input, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot overrides to input element', async () => {
            render(Input, { ui: { base: 'my-input-class' } })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/my-input-class/)
        })

        it('should apply ui slot overrides to root element', () => {
            const { container } = render(Input, { ui: { root: 'my-root-class' } })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should support aria-label', () => {
            render(Input, { 'aria-label': 'Search input' })
            expect(getInput()!.getAttribute('aria-label')).toBe('Search input')
        })

        it('should support readonly', () => {
            render(Input, { readonly: true })
            expect(getInput()!.readOnly).toBe(true)
        })

        it('should support required', () => {
            render(Input, { required: true })
            expect(getInput()!.required).toBe(true)
        })

        it('should support autocomplete', () => {
            render(Input, { autocomplete: 'email' })
            expect(getInput()!.autocomplete).toBe('email')
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with multiple props combined', async () => {
            render(Input, {
                variant: 'outline',
                color: 'error',
                size: 'lg',
                highlight: true
            })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
            await expect.element(input).toHaveClass(/ring-2/)
            await expect.element(input).toHaveClass(/ring-error/)
            await expect.element(input).toHaveClass(/text-sm/)
        })

        it('should render loading with leadingIcon', async () => {
            render(Input, {
                leadingIcon: 'lucide:search',
                loading: true
            })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeDisabled()
            await expect.element(input).toHaveClass(/ps-9/)
        })

        it('should render disabled with highlight', async () => {
            render(Input, {
                disabled: true,
                highlight: true,
                color: 'error'
            })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeDisabled()
            await expect.element(input).toHaveClass(/ring-error/)
        })

        it('should render with both icons and highlight', async () => {
            render(Input, {
                leadingIcon: 'lucide:mail',
                trailingIcon: 'lucide:check',
                highlight: true,
                color: 'success'
            })
            const input = page.getByRole('textbox')
            await expect.element(input).toHaveClass(/ps-9/)
            await expect.element(input).toHaveClass(/pe-9/)
            await expect.element(input).toHaveClass(/ring-success/)
        })
    })
})
