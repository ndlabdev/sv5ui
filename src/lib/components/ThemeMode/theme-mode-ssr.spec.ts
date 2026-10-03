import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import { ThemeMode, mode, setMode, userPrefersMode } from './index.js'

const scriptTag = (head: string) => head.match(/<script[^>]*>/)?.[0] ?? ''

describe('ThemeMode SSR', () => {
    it('renders the head script with the storage key', () => {
        const { head } = render(ThemeMode)
        expect(head).toContain('<script')
        expect(head).toContain('mode-watcher-mode')
    })

    it('omits the head script with disableHeadScriptInjection', () => {
        const { head } = render(ThemeMode, { props: { disableHeadScriptInjection: true } })
        expect(head).not.toContain('<script')
    })

    it('renders the nonce on the script tag', () => {
        const { head } = render(ThemeMode, { props: { nonce: 'abc123' } })
        expect(scriptTag(head)).toMatch(/nonce="?abc123"?/)
    })

    it('renders the theme-color meta only with themeColors', () => {
        const meta = /<meta[^>]*name="theme-color"/
        expect(render(ThemeMode).head).not.toMatch(meta)
        const { head } = render(ThemeMode, {
            props: { themeColors: { light: '#ffffff', dark: '#000000' } }
        })
        expect(head).toMatch(meta)
    })

    it('renders no body markup', () => {
        expect(render(ThemeMode).body).not.toMatch(/<(?!!)[a-z]/)
    })

    it('reports no resolved mode on the server', () => {
        expect(mode.current).toBeUndefined()
    })

    it('ignores setMode on the server', () => {
        const before = userPrefersMode.current
        setMode('dark')
        expect(userPrefersMode.current).toBe(before)
        expect(mode.current).toBeUndefined()
    })

    describe('fixed in #224', () => {
        it('finding 8: quotes the nonce and drops one outside the nonce character set', () => {
            expect(scriptTag(render(ThemeMode, { props: { nonce: 'abc123' } }).head)).toBe(
                '<script nonce="abc123">'
            )
            const { head } = render(ThemeMode, {
                props: { nonce: 'x><img src=x onerror=alert(1)>' }
            })
            expect(head).not.toContain('<img')
            expect(scriptTag(head)).toBe('<script>')
        })

        it('finding 9: escapes config values so they cannot close the script', () => {
            const { head } = render(ThemeMode, {
                props: { defaultTheme: '</script><img src=x onerror=alert(1)>' }
            })
            expect(head).not.toContain('<img')
            expect(head.match(/<\/script>/g)).toHaveLength(1)
        })
    })
})
