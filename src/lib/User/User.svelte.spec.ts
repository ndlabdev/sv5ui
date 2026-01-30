import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import User from './User.svelte'

describe('User', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(User, { name: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(User, { name: 'Test' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply base root classes', async () => {
            const { container } = render(User, { name: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/inline-flex/)
            await expect.element(root).toHaveClass(/items-center/)
            await expect.element(root).toHaveClass(/gap-2/)
        })
    })

    // ==================== NAME & DESCRIPTION ====================

    describe('name and description', () => {
        it('should render name', async () => {
            const { container } = render(User, { name: 'John Doe' })
            expect(container.textContent).toContain('John Doe')
        })

        it('should render description', async () => {
            const { container } = render(User, { description: 'Engineer' })
            expect(container.textContent).toContain('Engineer')
        })

        it('should render both name and description', async () => {
            const { container } = render(User, {
                name: 'John Doe',
                description: 'Engineer'
            })
            expect(container.textContent).toContain('John Doe')
            expect(container.textContent).toContain('Engineer')
        })

        it('should not render wrapper when no name or description', async () => {
            const { container } = render(User, { avatar: { alt: 'User' } })
            const root = container.firstElementChild!
            // Only avatar, no wrapper div
            expect(root.children.length).toBe(1)
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar when avatar prop is provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                avatar: { alt: 'User' }
            })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
        })

        it('should not render avatar when avatar prop is not provided', async () => {
            const { container } = render(User, { name: 'Test' })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).toBeNull()
        })

        it('should pass size to avatar', async () => {
            const { container } = render(User, {
                name: 'Test',
                avatar: { alt: 'User' },
                size: 'lg'
            })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
        })
    })

    // ==================== CHIP ====================

    describe('chip', () => {
        it('should not render chip by default', async () => {
            const { container } = render(User, {
                name: 'Test',
                avatar: { alt: 'User' }
            })
            const chip = container.querySelector('.ring-surface')
            expect(chip).toBeNull()
        })

        it('should render chip when chip=true and avatar is provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                avatar: { alt: 'User' },
                chip: true
            })
            const chip = container.querySelector('.ring-surface')
            expect(chip).not.toBeNull()
        })

        it('should not render chip when avatar is not provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                chip: true
            })
            const chip = container.querySelector('.ring-surface')
            expect(chip).toBeNull()
        })

        it('should accept ChipProps for chip', async () => {
            const { container } = render(User, {
                name: 'Test',
                avatar: { alt: 'User' },
                chip: { color: 'success' }
            })
            const chip = container.querySelector('.ring-surface')
            expect(chip).not.toBeNull()
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const

        for (const size of sizes) {
            it(`should render with size="${size}"`, async () => {
                const { container } = render(User, {
                    name: 'Test',
                    avatar: { alt: 'User' },
                    size
                })
                expect(container.firstElementChild).not.toBeNull()
                expect(container.textContent).toContain('Test')
            })
        }
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should apply horizontal orientation by default', async () => {
            const { container } = render(User, { name: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/flex-row/)
        })

        it('should apply vertical orientation classes', async () => {
            const { container } = render(User, { name: 'Test', orientation: 'vertical' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/flex-col/)
            await expect.element(root).toHaveClass(/text-center/)
        })
    })

    // ==================== CLICKABLE ====================

    describe('clickable', () => {
        it('should apply clickable classes when onclick is provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                onclick: vi.fn()
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/cursor-pointer/)
        })

        it('should not apply clickable classes by default', async () => {
            const { container } = render(User, { name: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).not.toHaveClass(/cursor-pointer/)
        })
    })

    // ==================== HREF / LINK ====================

    describe('href', () => {
        it('should render as anchor when href is provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                href: '/profile'
            })
            expect(container.firstElementChild!.tagName).toBe('A')
        })

        it('should not render as anchor when href is not provided', async () => {
            const { container } = render(User, { name: 'Test' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should set href attribute', async () => {
            const { container } = render(User, {
                name: 'Test',
                href: '/profile'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveAttribute('href', '/profile')
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as span element', async () => {
            const { container } = render(User, { name: 'Test', as: 'span' })
            expect(container.firstElementChild!.tagName).toBe('SPAN')
        })

        it('should render as section element', async () => {
            const { container } = render(User, { name: 'Test', as: 'section' })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })

        it('should ignore as prop when href is provided', async () => {
            const { container } = render(User, {
                name: 'Test',
                as: 'span',
                href: '/profile'
            })
            expect(container.firstElementChild!.tagName).toBe('A')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(User, {
                name: 'Test',
                class: 'my-custom-user'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-user/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(User, {
                name: 'Test',
                ui: { root: 'custom-root' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.name class', async () => {
            const { container } = render(User, {
                name: 'Test Name',
                ui: { name: 'custom-name' }
            })
            const el = container.querySelector('.custom-name')
            expect(el).not.toBeNull()
            expect(el!.textContent).toBe('Test Name')
        })

        it('should apply ui.description class', async () => {
            const { container } = render(User, {
                description: 'Test Desc',
                ui: { description: 'custom-desc' }
            })
            const el = container.querySelector('.custom-desc')
            expect(el).not.toBeNull()
            expect(el!.textContent).toBe('Test Desc')
        })

        it('should apply ui.wrapper class', async () => {
            const { container } = render(User, {
                name: 'Test',
                ui: { wrapper: 'custom-wrapper' }
            })
            const el = container.querySelector('.custom-wrapper')
            expect(el).not.toBeNull()
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with avatar, name, description and chip', async () => {
            const { container } = render(User, {
                name: 'John Doe',
                description: 'Engineer',
                avatar: { alt: 'John' },
                chip: { color: 'success' }
            })

            expect(container.textContent).toContain('John Doe')
            expect(container.textContent).toContain('Engineer')

            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()

            const chip = container.querySelector('.ring-surface')
            expect(chip).not.toBeNull()
        })

        it('should render vertical orientation with all features', async () => {
            const { container } = render(User, {
                name: 'Jane',
                description: 'Designer',
                avatar: { alt: 'Jane' },
                orientation: 'vertical',
                size: 'xl'
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/flex-col/)
            expect(container.textContent).toContain('Jane')
            expect(container.textContent).toContain('Designer')
        })

        it('should render as clickable link with avatar and chip', async () => {
            const { container } = render(User, {
                name: 'Link User',
                avatar: { alt: 'User' },
                chip: true,
                href: '/profile'
            })

            expect(container.firstElementChild!.tagName).toBe('A')
            expect(container.textContent).toContain('Link User')

            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()

            const chip = container.querySelector('.ring-surface')
            expect(chip).not.toBeNull()
        })
    })
})
