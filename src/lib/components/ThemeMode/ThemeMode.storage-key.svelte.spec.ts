import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { ThemeMode, setMode } from './index.js'

describe('ThemeMode storage keys', () => {
    it('stores the mode under a custom key', async () => {
        localStorage.clear()
        render(ThemeMode, { modeStorageKey: 'app-mode' })
        setMode('dark')
        await vi.waitFor(() => {
            expect(localStorage.getItem('app-mode')).toBe('dark')
            expect(document.documentElement.classList.contains('dark')).toBe(true)
        })
    })

    it('moves the stored mode when the key changes at runtime', async () => {
        localStorage.clear()
        const { rerender } = render(ThemeMode, { modeStorageKey: 'first-key' })
        setMode('dark')
        await vi.waitFor(() => expect(localStorage.getItem('first-key')).toBe('dark'))
        await rerender({ modeStorageKey: 'second-key' })
        await vi.waitFor(() => {
            expect(localStorage.getItem('second-key')).toBe('dark')
            expect(localStorage.getItem('first-key')).toBeNull()
        })
    })

    it('persists defaultTheme under the theme key', async () => {
        localStorage.clear()
        render(ThemeMode, { defaultTheme: 'ocean' })
        await vi.waitFor(() => expect(localStorage.getItem('mode-watcher-theme')).toBe('ocean'))
    })
})
