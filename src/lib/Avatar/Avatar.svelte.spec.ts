import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Avatar from './Avatar.svelte'

const AVATAR_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

/** Helper: get a locator for a data-attribute element inside the render container */
function getByData(container: HTMLElement, attr: string) {
    const el = container.querySelector(`[${attr}]`)
    return page.elementLocator(el!)
}

describe('Avatar', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the avatar root element', async () => {
            const { container } = render(Avatar, { alt: 'User' })
            const root = getByData(container, 'data-avatar-root')
            await expect.element(root).toBeInTheDocument()
        })

        it('should render with default size md', async () => {
            const { container } = render(Avatar, { alt: 'User' })
            const root = getByData(container, 'data-avatar-root')
            await expect.element(root).toHaveClass(/size-8/)
        })
    })

    // ==================== INITIALS / FALLBACK ====================

    describe('initials fallback', () => {
        it('should generate initials from two-word alt', async () => {
            const { container } = render(Avatar, { alt: 'John Doe' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('JD')
        })

        it('should generate single initial from one-word alt', async () => {
            const { container } = render(Avatar, { alt: 'Alice' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('A')
        })

        it('should take only first two words for initials', async () => {
            const { container } = render(Avatar, { alt: 'John Michael Doe' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('JM')
        })

        it('should uppercase initials', async () => {
            const { container } = render(Avatar, { alt: 'john doe' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('JD')
        })

        it('should show empty fallback when no alt and no text', async () => {
            const { container } = render(Avatar)
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toBeInTheDocument()
            await expect.element(fallback).toHaveTextContent('')
        })
    })

    // ==================== TEXT PROP ====================

    describe('text prop', () => {
        it('should display custom text', async () => {
            const { container } = render(Avatar, { text: 'AB' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('AB')
        })

        it('should override alt initials when text is provided', async () => {
            const { container } = render(Avatar, { alt: 'John Doe', text: 'XX' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveTextContent('XX')
        })
    })

    // ==================== IMAGE ====================

    describe('image', () => {
        it('should render img element when src is provided', async () => {
            render(Avatar, { src: AVATAR_SRC, alt: 'User photo' })
            const img = page.getByRole('img', { name: 'User photo' })
            await expect.element(img).toBeInTheDocument()
        })

        it('should set alt attribute on img', async () => {
            render(Avatar, { src: AVATAR_SRC, alt: 'Profile pic' })
            const img = page.getByRole('img', { name: 'Profile pic' })
            await expect.element(img).toHaveAttribute('alt', 'Profile pic')
        })

        it('should set empty alt when alt is not provided', async () => {
            const { container } = render(Avatar, { src: AVATAR_SRC })
            const img = page.elementLocator(container.querySelector('img')!)
            await expect.element(img).toHaveAttribute('alt', '')
        })

        it('should set width and height based on size', async () => {
            render(Avatar, { src: AVATAR_SRC, alt: 'User', size: 'lg' })
            const img = page.getByRole('img', { name: 'User' })
            await expect.element(img).toHaveAttribute('width', '36')
            await expect.element(img).toHaveAttribute('height', '36')
        })

        it('should still render fallback alongside img', async () => {
            const { container } = render(Avatar, {
                src: AVATAR_SRC,
                alt: 'John Doe'
            })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toBeInTheDocument()
            await expect.element(fallback).toHaveTextContent('JD')
        })

        it('should not render img when src is not provided', async () => {
            const { container } = render(Avatar, { alt: 'John Doe' })
            const img = container.querySelector('[data-avatar-image]')
            expect(img).toBeNull()
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        const sizeMap = [
            { size: '3xs', class: 'size-4' },
            { size: '2xs', class: 'size-5' },
            { size: 'xs', class: 'size-6' },
            { size: 'sm', class: 'size-7' },
            { size: 'md', class: 'size-8' },
            { size: 'lg', class: 'size-9' },
            { size: 'xl', class: 'size-10' },
            { size: '2xl', class: 'size-11' },
            { size: '3xl', class: 'size-12' }
        ] as const

        for (const { size, class: expected } of sizeMap) {
            it(`should apply size="${size}" with class "${expected}"`, async () => {
                const { container } = render(Avatar, { alt: 'User', size })
                const root = getByData(container, 'data-avatar-root')
                await expect.element(root).toHaveClass(new RegExp(expected))
            })
        }
    })

    // ==================== IMAGE SIZE PX ====================

    describe('image size in pixels', () => {
        const sizePxMap = [
            { size: '3xs', px: '16' },
            { size: '2xs', px: '20' },
            { size: 'xs', px: '24' },
            { size: 'sm', px: '28' },
            { size: 'md', px: '32' },
            { size: 'lg', px: '36' },
            { size: 'xl', px: '40' },
            { size: '2xl', px: '44' },
            { size: '3xl', px: '48' }
        ] as const

        for (const { size, px } of sizePxMap) {
            it(`should set img width/height to ${px}px for size="${size}"`, async () => {
                render(Avatar, { src: AVATAR_SRC, alt: 'User', size })
                const img = page.getByRole('img', { name: 'User' })
                await expect.element(img).toHaveAttribute('width', px)
                await expect.element(img).toHaveAttribute('height', px)
            })
        }
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Avatar, { alt: 'User', class: 'my-avatar' })
            const root = getByData(container, 'data-avatar-root')
            await expect.element(root).toHaveClass(/my-avatar/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Avatar, { alt: 'User', ui: { root: 'custom-root' } })
            const root = getByData(container, 'data-avatar-root')
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.fallback class', async () => {
            const { container } = render(Avatar, {
                alt: 'User',
                ui: { fallback: 'custom-fallback' }
            })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveClass(/custom-fallback/)
        })

        it('should apply ui.image class', async () => {
            render(Avatar, {
                src: AVATAR_SRC,
                alt: 'User',
                ui: { image: 'custom-img' }
            })
            const img = page.getByRole('img', { name: 'User' })
            await expect.element(img).toHaveClass(/custom-img/)
        })
    })

    // ==================== BASE CLASSES ====================

    describe('base classes', () => {
        it('should apply root base classes', async () => {
            const { container } = render(Avatar, { alt: 'User' })
            const root = getByData(container, 'data-avatar-root')
            await expect.element(root).toHaveClass(/rounded-full/)
            await expect.element(root).toHaveClass(/overflow-hidden/)
        })

        it('should apply fallback base classes', async () => {
            const { container } = render(Avatar, { alt: 'User' })
            const fallback = getByData(container, 'data-avatar-fallback')
            await expect.element(fallback).toHaveClass(/font-medium/)
        })
    })
})
