import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'

localStorage.clear()
localStorage.setItem('mode-watcher-mode', 'dark')
document.documentElement.classList.remove('dark')

const { default: ThemeModeButton } = await import('./ThemeModeButton.svelte')
const { mode } = await import('../ThemeMode/mode.svelte.js')

describe('ThemeModeButton without ThemeMode, after a reload', () => {
    it('applies the stored mode on mount and switches it on the first click', async () => {
        render(ThemeModeButton)
        await vi.waitFor(() =>
            expect(document.documentElement.classList.contains('dark')).toBe(true)
        )
        expect(mode.current).toBe('dark')

        await page.getByRole('button').click()
        await vi.waitFor(() => {
            expect(localStorage.getItem('mode-watcher-mode')).toBe('light')
            expect(document.documentElement.classList.contains('dark')).toBe(false)
        })
    })
})
