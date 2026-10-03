import '../../../routes/layout.css'
import { page } from 'vitest/browser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { ThemeMode, mode, resetMode, setMode, toggleMode, userPrefersMode } from './index.js'
import ThemeModeButton from '../ThemeModeButton/ThemeModeButton.svelte'

const KEY = 'mode-watcher-mode'
const html = document.documentElement

const isDark = () => html.classList.contains('dark')

const expectMode = async (expected: 'light' | 'dark') => {
    await vi.waitFor(() => {
        expect(isDark()).toBe(expected === 'dark')
        expect(html.style.colorScheme).toBe(expected)
    })
}

const headScript = () =>
    Array.from(document.head.querySelectorAll('script')).find((s) => s.textContent?.includes(KEY))

const themeColorMeta = () =>
    document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

beforeEach(() => {
    resetMode()
    localStorage.clear()
    html.className = ''
    html.removeAttribute('style')
    html.removeAttribute('data-theme')
})

describe('ThemeMode', () => {
    describe('environment', () => {
        it('runs on a light operating system preference', () => {
            expect(matchMedia('(prefers-color-scheme: light)').matches).toBe(true)
        })
    })

    describe('mount', () => {
        it('applies the light mode by default on a light system', async () => {
            render(ThemeMode)
            await expectMode('light')
            expect(localStorage.getItem(KEY)).toBe('system')
            expect(mode.current).toBe('light')
        })

        it('applies defaultMode when nothing is stored', async () => {
            render(ThemeMode, { defaultMode: 'dark' })
            await expectMode('dark')
            expect(localStorage.getItem(KEY)).toBe('dark')
        })

        it('prefers the stored mode over defaultMode', async () => {
            localStorage.setItem(KEY, 'dark')
            render(ThemeMode, { defaultMode: 'light' })
            await expectMode('dark')
        })

        it('replaces an invalid stored mode with defaultMode', async () => {
            localStorage.setItem(KEY, 'garbage')
            render(ThemeMode, { defaultMode: 'dark' })
            await expectMode('dark')
            expect(localStorage.getItem(KEY)).toBe('dark')
        })
    })

    describe('mode functions', () => {
        it('setMode stores the raw value and applies it', async () => {
            render(ThemeMode)
            setMode('dark')
            await expectMode('dark')
            expect(localStorage.getItem(KEY)).toBe('dark')
            expect(userPrefersMode.current).toBe('dark')
            expect(mode.current).toBe('dark')
        })

        it('toggleMode flips between light and dark', async () => {
            render(ThemeMode)
            await expectMode('light')
            toggleMode()
            await expectMode('dark')
            toggleMode()
            await expectMode('light')
            expect(localStorage.getItem(KEY)).toBe('light')
        })

        it('toggleMode from system resolves against the system preference', async () => {
            render(ThemeMode)
            await expectMode('light')
            toggleMode()
            await expectMode('dark')
            expect(localStorage.getItem(KEY)).toBe('dark')
        })

        it('resetMode returns to the system preference', async () => {
            render(ThemeMode)
            setMode('dark')
            await expectMode('dark')
            resetMode()
            await expectMode('light')
            expect(localStorage.getItem(KEY)).toBe('system')
            expect(userPrefersMode.current).toBe('system')
        })
    })

    describe('cross tab sync', () => {
        it('follows a storage event for the mode key', async () => {
            render(ThemeMode)
            await expectMode('light')
            localStorage.setItem(KEY, 'dark')
            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: KEY,
                    oldValue: 'system',
                    newValue: 'dark',
                    storageArea: localStorage
                })
            )
            await expectMode('dark')
            expect(mode.current).toBe('dark')
        })
    })

    describe('props', () => {
        it('applies every darkClassNames entry', async () => {
            render(ThemeMode, { darkClassNames: ['dark', 'theme-dark'] })
            setMode('dark')
            await vi.waitFor(() => {
                expect(html.classList.contains('dark')).toBe(true)
                expect(html.classList.contains('theme-dark')).toBe(true)
            })
        })

        it('applies lightClassNames in light mode only', async () => {
            render(ThemeMode, { lightClassNames: ['light'] })
            await vi.waitFor(() => expect(html.classList.contains('light')).toBe(true))
            setMode('dark')
            await vi.waitFor(() => expect(html.classList.contains('light')).toBe(false))
        })

        it('applies defaultTheme as data-theme', async () => {
            render(ThemeMode, { defaultTheme: 'ocean' })
            await vi.waitFor(() => expect(html.getAttribute('data-theme')).toBe('ocean'))
        })

        it('keeps the theme-color meta in step with the mode', async () => {
            render(ThemeMode, { themeColors: { light: '#ffffff', dark: '#000000' } })
            await vi.waitFor(() => expect(themeColorMeta()?.content).toBe('#ffffff'))
            setMode('dark')
            await vi.waitFor(() => expect(themeColorMeta()?.content).toBe('#000000'))
        })

        it('leaves no transition override behind after a switch', async () => {
            render(ThemeMode, { disableTransitions: true })
            setMode('dark')
            await expectMode('dark')
            await vi.waitFor(() => {
                const overrides = Array.from(document.head.querySelectorAll('style')).filter((s) =>
                    s.textContent?.includes('transition: none')
                )
                expect(overrides).toHaveLength(0)
            })
        })
    })

    describe('head script', () => {
        it('is rendered with the storage key', () => {
            render(ThemeMode)
            expect(headScript()).toBeDefined()
        })

        it('is omitted with disableHeadScriptInjection', () => {
            render(ThemeMode, { disableHeadScriptInjection: true })
            expect(headScript()).toBeUndefined()
        })

        it('applies a stored dark mode before mount logic runs', () => {
            render(ThemeMode)
            const script = headScript()
            html.className = ''
            localStorage.setItem(KEY, 'dark')
            new Function(script?.textContent ?? '')()
            expect(isDark()).toBe(true)
        })
    })

    describe('ThemeModeButton', () => {
        it('toggles the mode on click', async () => {
            render(ThemeMode)
            render(ThemeModeButton)
            await expectMode('light')
            await page.getByRole('button').click()
            await expectMode('dark')
        })
    })

    describe('known defects, #224', () => {
        it('finding 10: an invalid stored mode makes the head script apply dark on a light system', () => {
            render(ThemeMode)
            const script = headScript()
            html.className = ''
            localStorage.setItem(KEY, 'garbage')
            new Function(script?.textContent ?? '')()
            expect(isDark()).toBe(true)
        })

        it('finding 11: the head script picks the dark meta color for system on a light system', () => {
            render(ThemeMode, { themeColors: { light: '#ffffff', dark: '#000000' } })
            const script = headScript()
            localStorage.setItem(KEY, 'system')
            new Function(script?.textContent ?? '')()
            expect(themeColorMeta()?.content).toBe('#000000')
        })

        it('finding 12: a user onclick replaces the toggle', async () => {
            const onclick = vi.fn()
            render(ThemeMode)
            render(ThemeModeButton, { onclick })
            await expectMode('light')
            await page.getByRole('button').click()
            expect(onclick).toHaveBeenCalledOnce()
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(isDark()).toBe(false)
            expect(localStorage.getItem(KEY)).toBe('system')
        })
    })
})
