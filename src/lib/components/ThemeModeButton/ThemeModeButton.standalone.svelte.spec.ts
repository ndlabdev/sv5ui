import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'

localStorage.clear()
localStorage.setItem('mode-watcher-mode', 'light')

const { default: ThemeModeButton } = await import('./ThemeModeButton.svelte')

describe('ThemeModeButton without ThemeMode', () => {
    it('finding 14: a click flips storage but never the dark class', async () => {
        render(ThemeModeButton)
        await page.getByRole('button').click()
        await new Promise((resolve) => setTimeout(resolve, 100))
        expect(localStorage.getItem('mode-watcher-mode')).toBe('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
})
