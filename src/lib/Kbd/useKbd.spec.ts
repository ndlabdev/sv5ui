import { describe, expect, it } from 'vitest'
import {
    isMac,
    resolveKey,
    resolveShortcut,
    formatShortcut,
    kbdKeysMap,
    kbdKeysPlatformMap,
    parseShortcutBinding,
    matchesShortcut,
    normalizeKey
} from './useKbd.svelte.js'

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

    describe('parseShortcutBinding', () => {
        it('should parse a single key', () => {
            const result = parseShortcutBinding('k')
            expect(result.key).toBe('k')
            expect(result.modifiers).toEqual({ ctrl: false, shift: false, alt: false, meta: false })
        })

        it('should parse ctrl+key', () => {
            const result = parseShortcutBinding('ctrl+k')
            expect(result.key).toBe('k')
            expect(result.modifiers.ctrl).toBe(true)
            expect(result.modifiers.shift).toBe(false)
        })

        it('should parse multiple modifiers', () => {
            const result = parseShortcutBinding('ctrl+shift+alt+k')
            expect(result.key).toBe('k')
            expect(result.modifiers.ctrl).toBe(true)
            expect(result.modifiers.shift).toBe(true)
            expect(result.modifiers.alt).toBe(true)
            expect(result.modifiers.meta).toBe(false)
        })

        it('should be case-insensitive', () => {
            const result = parseShortcutBinding('Ctrl+Shift+K')
            expect(result.key).toBe('k')
            expect(result.modifiers.ctrl).toBe(true)
            expect(result.modifiers.shift).toBe(true)
        })

        it('should handle cmd/command as meta', () => {
            expect(parseShortcutBinding('cmd+k').modifiers.meta).toBe(true)
            expect(parseShortcutBinding('command+k').modifiers.meta).toBe(true)
            expect(parseShortcutBinding('meta+k').modifiers.meta).toBe(true)
        })

        it('should handle control as ctrl', () => {
            expect(parseShortcutBinding('control+k').modifiers.ctrl).toBe(true)
        })

        it('should handle spaces around +', () => {
            const result = parseShortcutBinding('ctrl + shift + k')
            expect(result.key).toBe('k')
            expect(result.modifiers.ctrl).toBe(true)
            expect(result.modifiers.shift).toBe(true)
        })

        it('should parse escape as a standalone key', () => {
            const result = parseShortcutBinding('escape')
            expect(result.key).toBe('escape')
            expect(result.modifiers).toEqual({ ctrl: false, shift: false, alt: false, meta: false })
        })
    })

    describe('matchesShortcut', () => {
        const createKeyboardEvent = (
            key: string,
            modifiers: Partial<{
                ctrlKey: boolean
                shiftKey: boolean
                altKey: boolean
                metaKey: boolean
            }> = {}
        ) =>
            ({
                key,
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false,
                ...modifiers
            }) as KeyboardEvent

        it('should match a simple key', () => {
            const binding = parseShortcutBinding('escape')
            expect(matchesShortcut(createKeyboardEvent('Escape'), binding)).toBe(true)
        })

        it('should match ctrl+key', () => {
            const binding = parseShortcutBinding('ctrl+k')
            expect(matchesShortcut(createKeyboardEvent('k', { ctrlKey: true }), binding)).toBe(true)
        })

        it('should not match without required modifier', () => {
            const binding = parseShortcutBinding('ctrl+k')
            expect(matchesShortcut(createKeyboardEvent('k'), binding)).toBe(false)
        })

        it('should not match with extra modifiers (strict)', () => {
            const binding = parseShortcutBinding('ctrl+k')
            expect(
                matchesShortcut(
                    createKeyboardEvent('k', { ctrlKey: true, shiftKey: true }),
                    binding
                )
            ).toBe(false)
        })

        it('should not match wrong key', () => {
            const binding = parseShortcutBinding('ctrl+k')
            expect(matchesShortcut(createKeyboardEvent('j', { ctrlKey: true }), binding)).toBe(
                false
            )
        })

        it('should match complex modifier combos', () => {
            const binding = parseShortcutBinding('ctrl+shift+alt+k')
            expect(
                matchesShortcut(
                    createKeyboardEvent('k', { ctrlKey: true, shiftKey: true, altKey: true }),
                    binding
                )
            ).toBe(true)
        })

        it('should match meta key', () => {
            const binding = parseShortcutBinding('meta+k')
            expect(matchesShortcut(createKeyboardEvent('k', { metaKey: true }), binding)).toBe(true)
        })

        it('should normalize Control to ctrl for matching', () => {
            const binding = parseShortcutBinding('ctrl+k')
            // event.key for Ctrl is 'Control', but the non-modifier key 'k' is what matters
            expect(matchesShortcut(createKeyboardEvent('k', { ctrlKey: true }), binding)).toBe(true)
        })

        it('should normalize space key (event.key is " ")', () => {
            const binding = parseShortcutBinding('ctrl+space')
            expect(matchesShortcut(createKeyboardEvent(' ', { ctrlKey: true }), binding)).toBe(true)
        })

        it('should match space as standalone shortcut', () => {
            const binding = parseShortcutBinding('space')
            expect(matchesShortcut(createKeyboardEvent(' '), binding)).toBe(true)
        })
    })

    describe('normalizeKey', () => {
        it('should normalize Control to ctrl', () => {
            expect(normalizeKey('Control')).toBe('ctrl')
            expect(normalizeKey('control')).toBe('ctrl')
        })

        it('should normalize space', () => {
            expect(normalizeKey(' ')).toBe('space')
        })

        it('should lowercase regular keys', () => {
            expect(normalizeKey('A')).toBe('a')
            expect(normalizeKey('Escape')).toBe('escape')
            expect(normalizeKey('ArrowUp')).toBe('arrowup')
        })

        it('should pass through already-normalized keys', () => {
            expect(normalizeKey('k')).toBe('k')
            expect(normalizeKey('shift')).toBe('shift')
            expect(normalizeKey('alt')).toBe('alt')
            expect(normalizeKey('meta')).toBe('meta')
        })
    })
})
