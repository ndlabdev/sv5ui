import { page } from 'vitest/browser'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import type { ComponentProps } from 'svelte'
import * as upstream from 'mode-watcher'
import * as sv5ui from './index.js'
import ThemeModeButton from '../ThemeModeButton/ThemeModeButton.svelte'

const KEY = 'mode-watcher-mode'
const html = document.documentElement
const isDark = () => html.classList.contains('dark')

const expectBoth = async (expected: 'light' | 'dark') => {
    await vi.waitFor(() => {
        expect(isDark()).toBe(expected === 'dark')
        expect(upstream.mode.current).toBe(expected)
        expect(sv5ui.mode.current).toBe(expected)
        expect(localStorage.getItem(KEY)).toBe(expected)
    })
}

beforeEach(async () => {
    localStorage.clear()
    html.className = ''
    upstream.setMode('system')
    sv5ui.setMode('system')
    await vi.waitFor(() => expect(isDark()).toBe(false))
})

describe('ThemeMode with a separate mode-watcher instance', () => {
    describe('the pre 2.8 setup: upstream watcher plus the sv5ui button', () => {
        it('a click on the sv5ui button reaches the upstream state', async () => {
            render(upstream.ModeWatcher)
            render(ThemeModeButton)
            await page.getByRole('button').click()
            await expectBoth('dark')
        })

        it('an upstream toggle reaches the sv5ui state', async () => {
            render(upstream.ModeWatcher)
            render(ThemeModeButton)
            upstream.toggleMode()
            await expectBoth('dark')
        })

        it('alternating toggles never produce a dead click', async () => {
            render(upstream.ModeWatcher)
            render(ThemeModeButton)
            await page.getByRole('button').click()
            await expectBoth('dark')
            upstream.toggleMode()
            await expectBoth('light')
            await page.getByRole('button').click()
            await expectBoth('dark')
            upstream.toggleMode()
            await expectBoth('light')
        })

        it('toggles from the stored mode while the upstream DOM update is still a frame away', async () => {
            render(upstream.ModeWatcher)
            render(ThemeModeButton)
            await vi.waitFor(() => expect(isDark()).toBe(false))
            const scope = window as unknown as { __vitest_worker__?: unknown }
            const worker = scope.__vitest_worker__
            scope.__vitest_worker__ = undefined
            try {
                upstream.setMode('dark')
                const domBeforeFrame = isDark()
                sv5ui.toggleMode()
                expect(domBeforeFrame).toBe(false)
            } finally {
                scope.__vitest_worker__ = worker
            }
            await expectBoth('light')
        })

        it('keeps a reactive sv5ui reader in step with upstream changes', async () => {
            render(upstream.ModeWatcher)
            const seen: (string | undefined)[] = []
            const stop = $effect.root(() => {
                $effect(() => {
                    seen.push(sv5ui.mode.current)
                })
            })
            upstream.setMode('dark')
            await vi.waitFor(() => expect(seen.at(-1)).toBe('dark'))
            upstream.setMode('light')
            await vi.waitFor(() => expect(seen.at(-1)).toBe('light'))
            stop()
        })
    })

    describe('both watchers mounted', () => {
        it('converge on every change', async () => {
            render(upstream.ModeWatcher)
            render(sv5ui.ThemeMode)
            sv5ui.setMode('dark')
            await expectBoth('dark')
            upstream.setMode('light')
            await expectBoth('light')
            sv5ui.toggleMode()
            await expectBoth('dark')
        })

        it('settle without a feedback loop', async () => {
            render(upstream.ModeWatcher)
            render(sv5ui.ThemeMode)
            sv5ui.setMode('dark')
            await expectBoth('dark')
            let mutations = 0
            const observer = new MutationObserver((records) => (mutations += records.length))
            observer.observe(html, { attributes: true })
            await new Promise((resolve) => setTimeout(resolve, 500))
            observer.disconnect()
            expect(mutations).toBe(0)
        })
    })

    describe('storage event announcement', () => {
        it('announces each sv5ui change as a storage event for the mode key', () => {
            const keys: (string | null)[] = []
            const listener = (event: StorageEvent) => keys.push(event.key)
            window.addEventListener('storage', listener)
            sv5ui.setMode('dark')
            window.removeEventListener('storage', listener)
            expect(keys).toEqual([KEY])
        })
    })

    describe('type compatibility with the upstream shapes', () => {
        it('matches the upstream state and function types member by member', () => {
            expectTypeOf(sv5ui.mode.current).toEqualTypeOf(upstream.mode.current)
            expectTypeOf(sv5ui.userPrefersMode.current).toEqualTypeOf(
                upstream.userPrefersMode.current
            )
            expectTypeOf(sv5ui.systemPrefersMode.current).toEqualTypeOf(
                upstream.systemPrefersMode.current
            )
            expectTypeOf(sv5ui.systemPrefersMode.query).toEqualTypeOf(
                upstream.systemPrefersMode.query
            )
            expectTypeOf(sv5ui.systemPrefersMode.tracking).toEqualTypeOf(
                upstream.systemPrefersMode.tracking
            )
            expectTypeOf(sv5ui.setMode).toEqualTypeOf(upstream.setMode)
            expectTypeOf(sv5ui.toggleMode).toEqualTypeOf(upstream.toggleMode)
            expectTypeOf(sv5ui.resetMode).toEqualTypeOf(upstream.resetMode)
            expectTypeOf(sv5ui.createInitialModeExpression)
                .parameter(0)
                .toEqualTypeOf<Parameters<typeof upstream.createInitialModeExpression>[0]>()
            expect(true).toBe(true)
        })

        it('accepts every upstream watcher prop and nothing else', () => {
            type Upstream = ComponentProps<typeof upstream.ModeWatcher>
            expectTypeOf<sv5ui.ThemeModeProps>().toMatchTypeOf<Upstream>()
            expectTypeOf<Upstream>().toMatchTypeOf<sv5ui.ThemeModeProps>()
            expectTypeOf<keyof sv5ui.ThemeModeProps>().toEqualTypeOf<keyof Upstream>()
            expect(true).toBe(true)
        })
    })
})
