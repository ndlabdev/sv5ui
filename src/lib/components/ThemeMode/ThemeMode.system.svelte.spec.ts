import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'

const lists = new Set<FakeMediaQueryList>()
let systemIsLight = false

class FakeMediaQueryList extends EventTarget {
    onchange = null
    constructor(readonly media: string) {
        super()
        lists.add(this)
    }
    get matches() {
        return this.media.includes('light') ? systemIsLight : !systemIsLight
    }
    addListener(listener: EventListener) {
        this.addEventListener('change', listener)
    }
    removeListener(listener: EventListener) {
        this.removeEventListener('change', listener)
    }
}

const realMatchMedia = window.matchMedia.bind(window)

window.matchMedia = (query: string): MediaQueryList =>
    query.includes('prefers-color-scheme')
        ? (new FakeMediaQueryList(query) as unknown as MediaQueryList)
        : realMatchMedia(query)

const setSystem = (light: boolean) => {
    systemIsLight = light
    for (const list of lists) list.dispatchEvent(new Event('change'))
}

localStorage.clear()
localStorage.setItem('mode-watcher-mode', 'system')

const { ThemeMode, mode, systemPrefersMode } = await import('./index.js')

const isDark = () => document.documentElement.classList.contains('dark')

describe('ThemeMode system preference', () => {
    it('resolves the mode on the client before any mount', () => {
        expect(systemPrefersMode.current).toBe('dark')
        expect(mode.current).toBe('dark')
    })

    it('follows the system while tracking', async () => {
        render(ThemeMode)
        await vi.waitFor(() => expect(isDark()).toBe(true))
        setSystem(true)
        await vi.waitFor(() => {
            expect(systemPrefersMode.current).toBe('light')
            expect(isDark()).toBe(false)
        })
        setSystem(false)
        await vi.waitFor(() => expect(isDark()).toBe(true))
    })

    it('keeps the last value when track is false', async () => {
        render(ThemeMode, { track: false })
        await vi.waitFor(() => expect(isDark()).toBe(true))
        setSystem(true)
        await new Promise((resolve) => setTimeout(resolve, 100))
        expect(systemPrefersMode.current).toBe('dark')
        expect(isDark()).toBe(true)
    })
})
