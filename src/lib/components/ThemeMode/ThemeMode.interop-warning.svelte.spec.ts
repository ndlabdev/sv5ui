import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { ModeWatcher } from 'mode-watcher'
import ThemeModeButton from '../ThemeModeButton/ThemeModeButton.svelte'

const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
const legacyWarnings = () =>
    warn.mock.calls.filter((call) => String(call[0]).includes('[sv5ui ThemeMode]'))

describe('ThemeMode legacy setup warning', () => {
    it('warns exactly once when a separate mode-watcher instance is mounted', async () => {
        render(ModeWatcher)
        render(ThemeModeButton)
        render(ThemeModeButton)
        await vi.waitFor(() => expect(legacyWarnings()).toHaveLength(1))
        await new Promise((resolve) => setTimeout(resolve, 50))
        expect(legacyWarnings()).toHaveLength(1)
    })
})
