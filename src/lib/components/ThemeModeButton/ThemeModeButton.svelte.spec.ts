import '../../../routes/layout.css'
import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ThemeModeButton from './ThemeModeButton.svelte'
import { buttonVariants } from '../Button/button.variants.js'
import { themeModeButtonVariants } from './theme-mode-button.variants.js'

describe('ThemeModeButton', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a button element', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
        })

        it('should render with a mode-independent aria-label', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            const ariaLabel = btn.element().getAttribute('aria-label')
            expect(ariaLabel).toBe('Toggle theme')
        })

        it('should render both mode icons so CSS picks the visible one', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
            await vi.waitFor(() => {
                const svgs = btn.element().querySelectorAll('svg')
                expect(svgs.length).toBe(2)
            })
        })
    })

    // ==================== SSR-SAFE MODE ICONS ====================

    describe('ssr-safe mode icons', () => {
        const withDarkClass = async (fn: () => void | Promise<void>) => {
            document.documentElement.classList.add('dark')
            try {
                await fn()
            } finally {
                document.documentElement.classList.remove('dark')
            }
        }

        const iconsOf = async (el: HTMLElement) => {
            await vi.waitFor(() => {
                expect(el.querySelectorAll('svg').length).toBe(2)
            })
            const [darkModeOff, darkModeOn] = Array.from(el.querySelectorAll('svg'))
            return { darkModeOff, darkModeOn }
        }

        it('should show only the dark-mode icon in light mode', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button').element() as HTMLElement
            const { darkModeOff, darkModeOn } = await iconsOf(btn)

            expect(getComputedStyle(darkModeOff).display).not.toBe('none')
            expect(getComputedStyle(darkModeOn).display).toBe('none')
        })

        it('should swap the visible icon when the dark class is present', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button').element() as HTMLElement
            const { darkModeOff, darkModeOn } = await iconsOf(btn)

            await withDarkClass(() => {
                expect(getComputedStyle(darkModeOff).display).toBe('none')
                expect(getComputedStyle(darkModeOn).display).not.toBe('none')
            })
        })

        it('should size its icons for every size the button offers', () => {
            expect(Object.keys(themeModeButtonVariants.variants.size)).toEqual(
                Object.keys(buttonVariants.variants.size)
            )
        })

        it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
            'should give both icons a size class at size=%s',
            async (size) => {
                render(ThemeModeButton, { size })
                const btn = page.getByRole('button').element() as HTMLElement
                const { darkModeOff, darkModeOn } = await iconsOf(btn)

                for (const icon of [darkModeOff, darkModeOn]) {
                    expect(icon.getAttribute('class')).toMatch(/\bsize-[\d.]+\b/)
                }
            }
        )

        it('should keep the same markup regardless of the resolved mode', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button').element() as HTMLElement
            await iconsOf(btn)
            const lightHtml = btn.innerHTML

            let darkHtml = ''
            await withDarkClass(() => {
                darkHtml = btn.innerHTML
            })

            expect(darkHtml).toBe(lightHtml)
        })
    })

    // ==================== DEFAULT PROPS ====================

    describe('default props', () => {
        it('should apply ghost variant by default', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-on-surface-variant/)
        })

        it('should be square by default', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).not.toHaveTextContent(/\w+/)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, async () => {
                render(ThemeModeButton, { variant })
                const btn = page.getByRole('button')
                await expect.element(btn).toBeInTheDocument()
            })
        }

        it('should apply solid variant classes', async () => {
            render(ThemeModeButton, { variant: 'solid', color: 'primary' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/bg-primary/)
        })

        it('should apply outline variant classes', async () => {
            render(ThemeModeButton, { variant: 'outline', color: 'primary' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/ring-primary/)
        })

        it('should apply ghost variant classes', async () => {
            render(ThemeModeButton, { variant: 'ghost', color: 'primary' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-primary/)
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
                render(ThemeModeButton, { variant: 'solid', color })
                const btn = page.getByRole('button')
                await expect.element(btn).toHaveClass(new RegExp(`bg-${color}`))
            })
        }

        it('should apply surface color with ghost variant', async () => {
            render(ThemeModeButton, { variant: 'ghost', color: 'surface' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-on-surface-variant/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', async () => {
            render(ThemeModeButton, { size: 'xs' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-xs/)
        })

        it('should apply sm size classes', async () => {
            render(ThemeModeButton, { size: 'sm' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-xs/)
        })

        it('should apply md size classes by default', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-sm/)
        })

        it('should apply lg size classes', async () => {
            render(ThemeModeButton, { size: 'lg' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-sm/)
        })

        it('should apply xl size classes', async () => {
            render(ThemeModeButton, { size: 'xl' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-base/)
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(ThemeModeButton, { disabled: true })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).toBeEnabled()
        })

        it('should not fire click when disabled', async () => {
            const onclick = vi.fn()
            render(ThemeModeButton, { disabled: true, onclick })
            const btn = page.getByRole('button')
            await btn.click({ force: true })
            expect(onclick).not.toHaveBeenCalled()
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(ThemeModeButton, { loading: true })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeDisabled()
        })

        it('should not fire click when loading', async () => {
            const onclick = vi.fn()
            render(ThemeModeButton, { loading: true, onclick })
            const btn = page.getByRole('button')
            await btn.click({ force: true })
            expect(onclick).not.toHaveBeenCalled()
        })
    })

    // ==================== BLOCK ====================

    describe('block', () => {
        it('should apply full width when block is true', async () => {
            render(ThemeModeButton, { block: true, square: false })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/w-full/)
        })

        it('should not apply full width by default', async () => {
            render(ThemeModeButton)
            const btn = page.getByRole('button')
            await expect.element(btn).not.toHaveClass(/w-full/)
        })
    })

    // ==================== EVENTS ====================

    describe('events', () => {
        it('should handle click events', async () => {
            const onclick = vi.fn()
            render(ThemeModeButton, { onclick })
            const btn = page.getByRole('button')
            await btn.click()
            expect(onclick).toHaveBeenCalledOnce()
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class', async () => {
            render(ThemeModeButton, { class: 'my-custom-class' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/my-custom-class/)
        })

        it('should apply rounded-full class', async () => {
            render(ThemeModeButton, { class: 'rounded-full' })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/rounded-full/)
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with multiple props combined', async () => {
            render(ThemeModeButton, {
                variant: 'outline',
                color: 'error',
                size: 'lg'
            })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
            await expect.element(btn).toHaveClass(/ring-error/)
        })

        it('should render disabled with custom variant and color', async () => {
            render(ThemeModeButton, {
                variant: 'solid',
                color: 'primary',
                disabled: true
            })
            const btn = page.getByRole('button')
            await expect.element(btn).toBeDisabled()
            await expect.element(btn).toHaveClass(/bg-primary/)
        })

        it('should render with size and custom class', async () => {
            render(ThemeModeButton, {
                size: 'xl',
                class: 'shadow-lg'
            })
            const btn = page.getByRole('button')
            await expect.element(btn).toHaveClass(/text-base/)
            await expect.element(btn).toHaveClass(/shadow-lg/)
        })
    })
})
