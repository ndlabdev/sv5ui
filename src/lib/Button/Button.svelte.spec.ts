import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Button from './Button.svelte'

describe('Button', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a button element', async () => {
            render(Button, { label: 'Click me' })
            const btn = page.getByRole('button', { name: 'Click me' })
            await expect.element(btn).toBeInTheDocument()
        })

        it('should render with label prop', async () => {
            render(Button, { label: 'Submit' })
            const btn = page.getByRole('button', { name: 'Submit' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveTextContent('Submit')
        })

        it('should render without label when icon-only', async () => {
            render(Button, { icon: 'lucide:star' })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).not.toHaveTextContent(/\w+/)
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Button, { label: 'Disabled', disabled: true })
            const btn = page.getByRole('button', { name: 'Disabled' })
            await expect.element(btn).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Button, { label: 'Enabled' })
            const btn = page.getByRole('button', { name: 'Enabled' })
            await expect.element(btn).toBeEnabled()
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(Button, { label: 'Loading', loading: true })
            const btn = page.getByRole('button', { name: 'Loading' })
            await expect.element(btn).toBeDisabled()
        })

        it('should still display the label when loading', async () => {
            render(Button, { label: 'Loading', loading: true })
            const btn = page.getByRole('button', { name: 'Loading' })
            await expect.element(btn).toHaveTextContent('Loading')
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, async () => {
                render(Button, { label: variant, variant })
                const btn = page.getByRole('button', { name: variant })
                await expect.element(btn).toBeInTheDocument()
            })
        }

        it('should apply solid/primary classes by default', async () => {
            render(Button, { label: 'Default' })
            const btn = page.getByRole('button', { name: 'Default' })
            await expect.element(btn).toHaveClass(/bg-primary/)
        })

        it('should apply outline variant classes', async () => {
            render(Button, { label: 'Outline', variant: 'outline', color: 'primary' })
            const btn = page.getByRole('button', { name: 'Outline' })
            await expect.element(btn).toHaveClass(/ring-primary/)
        })

        it('should apply ghost variant classes', async () => {
            render(Button, { label: 'Ghost', variant: 'ghost', color: 'primary' })
            const btn = page.getByRole('button', { name: 'Ghost' })
            await expect.element(btn).toHaveClass(/text-primary/)
        })

        it('should apply link variant classes', async () => {
            render(Button, { label: 'Link', variant: 'link', color: 'primary' })
            const btn = page.getByRole('button', { name: 'Link' })
            await expect.element(btn).toHaveClass(/underline-offset-4/)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const

        for (const color of colors) {
            it(`should render with color="${color}"`, async () => {
                render(Button, { label: color, color })
                const btn = page.getByRole('button', { name: color })
                await expect.element(btn).toHaveClass(new RegExp(`bg-${color}`))
            })
        }
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', async () => {
            render(Button, { label: 'XS', size: 'xs' })
            const btn = page.getByRole('button', { name: 'XS' })
            await expect.element(btn).toHaveClass(/text-xs/)
        })

        it('should apply sm size classes', async () => {
            render(Button, { label: 'SM', size: 'sm' })
            const btn = page.getByRole('button', { name: 'SM' })
            await expect.element(btn).toHaveClass(/text-xs/)
        })

        it('should apply md size classes by default', async () => {
            render(Button, { label: 'MD' })
            const btn = page.getByRole('button', { name: 'MD' })
            await expect.element(btn).toHaveClass(/text-sm/)
        })

        it('should apply lg size classes', async () => {
            render(Button, { label: 'LG', size: 'lg' })
            const btn = page.getByRole('button', { name: 'LG' })
            await expect.element(btn).toHaveClass(/text-sm/)
        })

        it('should apply xl size classes', async () => {
            render(Button, { label: 'XL', size: 'xl' })
            const btn = page.getByRole('button', { name: 'XL' })
            await expect.element(btn).toHaveClass(/text-base/)
        })
    })

    // ==================== BLOCK ====================

    describe('block', () => {
        it('should apply full width when block is true', async () => {
            render(Button, { label: 'Block', block: true })
            const btn = page.getByRole('button', { name: 'Block' })
            await expect.element(btn).toHaveClass(/w-full/)
        })

        it('should not apply full width by default', async () => {
            render(Button, { label: 'Inline' })
            const btn = page.getByRole('button', { name: 'Inline' })
            await expect.element(btn).not.toHaveClass(/w-full/)
        })
    })

    // ==================== SQUARE / ICON-ONLY ====================

    describe('square / icon-only', () => {
        it('should not render label when square is true', async () => {
            render(Button, { label: 'Hidden', square: true, icon: 'lucide:star' })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).not.toHaveTextContent('Hidden')
        })

        it('should not render label when only icon is provided (no label)', async () => {
            render(Button, { icon: 'lucide:star' })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render with leadingIcon', async () => {
            render(Button, { label: 'Leading', leadingIcon: 'lucide:arrow-left' })
            const btn = page.getByRole('button', { name: 'Leading' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveTextContent('Leading')
        })

        it('should render with trailingIcon', async () => {
            render(Button, { label: 'Trailing', trailingIcon: 'lucide:arrow-right' })
            const btn = page.getByRole('button', { name: 'Trailing' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveTextContent('Trailing')
        })

        it('should render icon on trailing side when trailing prop is true', async () => {
            render(Button, { label: 'Trail', icon: 'lucide:star', trailing: true })
            const btn = page.getByRole('button', { name: 'Trail' })
            await expect.element(btn).toBeInTheDocument()
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar with alt initials as fallback', async () => {
            render(Button, {
                label: 'Profile',
                avatar: { alt: 'John Doe' }
            })
            const btn = page.getByRole('button', { name: 'Profile' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveTextContent(/JD/)
        })

        it('should render avatar with single-word alt initial', async () => {
            render(Button, {
                label: 'User',
                avatar: { alt: 'Alice' }
            })
            const btn = page.getByRole('button', { name: 'User' })
            await expect.element(btn).toHaveTextContent(/A/)
        })

        it('should render avatar with custom text prop', async () => {
            render(Button, {
                label: 'Admin',
                avatar: { text: 'AB' }
            })
            const btn = page.getByRole('button', { name: 'Admin' })
            await expect.element(btn).toHaveTextContent(/AB/)
        })

        it('should render avatar with src as img element', async () => {
            render(Button, {
                label: 'Photo',
                avatar: { src: 'https://i.pravatar.cc/64', alt: 'User avatar' }
            })
            const btn = page.getByRole('button', { name: 'Photo' })
            await expect.element(btn).toBeInTheDocument()
            const img = page.getByRole('img', { name: 'User avatar' })
            await expect.element(img).toBeInTheDocument()
        })

        it('should display label alongside avatar', async () => {
            render(Button, {
                label: 'Jane Smith',
                avatar: { alt: 'Jane Smith' }
            })
            const btn = page.getByRole('button', { name: 'Jane Smith' })
            await expect.element(btn).toHaveTextContent(/Jane Smith/)
            await expect.element(btn).toHaveTextContent(/JS/)
        })

        it('should not render avatar when leadingIcon is provided', async () => {
            render(Button, {
                label: 'Icon wins',
                leadingIcon: 'lucide:user',
                avatar: { alt: 'John Doe' }
            })
            const btn = page.getByRole('button', { name: 'Icon wins' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).not.toHaveTextContent(/JD/)
        })

        it('should not render avatar when loading with leading icon', async () => {
            render(Button, {
                label: 'Saving',
                avatar: { alt: 'John Doe' },
                loading: true
            })
            const btn = page.getByRole('button', { name: 'Saving' })
            await expect.element(btn).toBeDisabled()
            await expect.element(btn).not.toHaveTextContent(/JD/)
        })

        it('should render avatar in icon-only mode (no label)', async () => {
            render(Button, {
                avatar: { alt: 'John Doe' },
                square: true
            })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveTextContent(/JD/)
        })
    })

    // ==================== EVENTS ====================

    describe('events', () => {
        it('should handle click events', async () => {
            const onclick = vi.fn()
            render(Button, { label: 'Clickable', onclick })
            const btn = page.getByRole('button', { name: 'Clickable' })
            await btn.click()
            expect(onclick).toHaveBeenCalledOnce()
        })

        it('should not fire click when disabled', async () => {
            const onclick = vi.fn()
            render(Button, { label: 'Disabled', disabled: true, onclick })
            const btn = page.getByRole('button', { name: 'Disabled' })
            await expect.element(btn).toBeDisabled()
            await btn.click({ force: true })
            expect(onclick).not.toHaveBeenCalled()
        })

        it('should not fire click when loading', async () => {
            const onclick = vi.fn()
            render(Button, { label: 'Loading', loading: true, onclick })
            const btn = page.getByRole('button', { name: 'Loading' })
            await expect.element(btn).toBeDisabled()
            await btn.click({ force: true })
            expect(onclick).not.toHaveBeenCalled()
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class', async () => {
            render(Button, { label: 'Custom', class: 'my-custom-class' })
            const btn = page.getByRole('button', { name: 'Custom' })
            await expect.element(btn).toHaveClass(/my-custom-class/)
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with multiple props combined', async () => {
            render(Button, {
                label: 'Combined',
                variant: 'outline',
                color: 'error',
                size: 'lg',
                block: true
            })
            const btn = page.getByRole('button', { name: 'Combined' })
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveClass(/w-full/)
            await expect.element(btn).toHaveClass(/ring-error/)
        })

        it('should render loading with leadingIcon', async () => {
            render(Button, {
                label: 'Saving',
                leadingIcon: 'lucide:save',
                loading: true
            })
            const btn = page.getByRole('button', { name: 'Saving' })
            await expect.element(btn).toBeDisabled()
            await expect.element(btn).toHaveTextContent('Saving')
        })
    })
})
