import { describe, expect, it, vi } from 'vitest'

Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
        throw new DOMException('Storage access denied', 'SecurityError')
    }
})

describe('ThemeMode with storage access denied', () => {
    it('finding 13: imports and keeps the mode in memory', async () => {
        const { setMode, toggleMode, userPrefersMode, mode } = await import('./index.js')
        setMode('dark')
        expect(userPrefersMode.current).toBe('dark')
        expect(mode.current).toBe('dark')
        await vi.waitFor(() =>
            expect(document.documentElement.classList.contains('dark')).toBe(true)
        )
        toggleMode()
        expect(userPrefersMode.current).toBe('light')
    })
})
