import { describe, expect, it } from 'vitest'
import { isMac, resolveKey, resolveShortcut, formatShortcut, kbdKeysMap, kbdKeysPlatformMap } from './useKbd.svelte.js'

describe('Kbd utilities', () => {
    describe('resolveKey', () => {
        it('should resolve static key symbols', () => {
            expect(resolveKey('command')).toBe('⌘')
            expect(resolveKey('shift')).toBe('⇧')
            expect(resolveKey('enter')).toBe('↵')
            expect(resolveKey('escape')).toBe('Esc')
            expect(resolveKey('tab')).toBe('⇥')
            expect(resolveKey('backspace')).toBe('⌫')
            expect(resolveKey('delete')).toBe('⌦')
            expect(resolveKey('space')).toBe('␣')
        })

        it('should resolve arrow keys', () => {
            expect(resolveKey('arrowup')).toBe('↑')
            expect(resolveKey('arrowdown')).toBe('↓')
            expect(resolveKey('arrowleft')).toBe('←')
            expect(resolveKey('arrowright')).toBe('→')
        })

        it('should be case-insensitive', () => {
            expect(resolveKey('ENTER')).toBe('↵')
            expect(resolveKey('Enter')).toBe('↵')
            expect(resolveKey('eNtEr')).toBe('↵')
        })

        it('should preserve unknown keys as-is', () => {
            expect(resolveKey('A')).toBe('A')
            expect(resolveKey('1')).toBe('1')
            expect(resolveKey('custom')).toBe('custom')
        })

        it('should return null for undefined/empty values', () => {
            expect(resolveKey(undefined)).toBeNull()
            expect(resolveKey('')).toBeNull()
        })
    })

    describe('resolveShortcut', () => {
        it('should parse simple shortcuts', () => {
            expect(resolveShortcut('ctrl+k')).toEqual(['Ctrl', 'k'])
            expect(resolveShortcut('shift+enter')).toEqual(['⇧', '↵'])
        })

        it('should parse complex shortcuts', () => {
            expect(resolveShortcut('ctrl+shift+p')).toEqual(['Ctrl', '⇧', 'p'])
            expect(resolveShortcut('meta+alt+delete')).toContain('⌦')
        })

        it('should handle spaces around +', () => {
            expect(resolveShortcut('ctrl + k')).toEqual(['Ctrl', 'k'])
            expect(resolveShortcut('ctrl  +  k')).toEqual(['Ctrl', 'k'])
        })

        it('should return empty array for undefined/empty', () => {
            expect(resolveShortcut(undefined)).toEqual([])
            expect(resolveShortcut('')).toEqual([])
        })

        it('should filter out null values', () => {
            expect(resolveShortcut('ctrl++')).toHaveLength(1)
        })
    })

    describe('formatShortcut', () => {
        it('should format shortcuts with default separator', () => {
            expect(formatShortcut('ctrl+k')).toBe('Ctrl + k')
            expect(formatShortcut('ctrl+shift+p')).toBe('Ctrl + ⇧ + p')
        })

        it('should format shortcuts with custom separator', () => {
            expect(formatShortcut('ctrl+k', '-')).toBe('Ctrl-k')
            expect(formatShortcut('ctrl+shift+p', ' → ')).toBe('Ctrl → ⇧ → p')
            expect(formatShortcut('shift+enter', '')).toBe('⇧↵')
        })

        it('should return empty string for undefined/empty', () => {
            expect(formatShortcut(undefined)).toBe('')
            expect(formatShortcut('')).toBe('')
        })
    })

    describe('platform detection', () => {
        it('should detect platform', () => {
            expect(typeof isMac).toBe('boolean')
        })
    })

    describe('exports', () => {
        it('should export kbdKeysMap', () => {
            expect(kbdKeysMap).toBeDefined()
            expect(kbdKeysMap.command).toBe('⌘')
            expect(kbdKeysMap.enter).toBe('↵')
        })

        it('should export kbdKeysPlatformMap', () => {
            expect(kbdKeysPlatformMap).toBeDefined()
            expect(kbdKeysPlatformMap.meta).toBeDefined()
            expect(kbdKeysPlatformMap.meta.mac).toBe('⌘')
            expect(kbdKeysPlatformMap.meta.other).toBe('Ctrl')
        })
    })
})
