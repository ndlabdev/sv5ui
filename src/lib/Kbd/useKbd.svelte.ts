import { SvelteSet } from 'svelte/reactivity'
import { kbdKeysMap, kbdKeysPlatformMap } from './kbd.variants.js'
import type { UseKbdOptions, UseKbdReturn, KeyboardShortcutCallback } from './kbd.types.js'

let cachedIsMac: boolean | undefined

const detectPlatform = () => {
    if (cachedIsMac === undefined) {
        cachedIsMac =
            typeof navigator !== 'undefined' &&
            /Macintosh|Mac OS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    }
    return cachedIsMac
}

/** @internal */
export const __resetPlatformCache = () => {
    cachedIsMac = undefined
}

export const isMac = detectPlatform()

export function resolveKey(value: string | undefined): string | null {
    if (!value) return null
    const key = value.toLowerCase()
    if (key in kbdKeysPlatformMap) {
        return isMac ? kbdKeysPlatformMap[key].mac : kbdKeysPlatformMap[key].other
    }
    return kbdKeysMap[key] ?? value
}

export function resolveShortcut(shortcut: string | undefined): string[] {
    if (!shortcut) return []
    return shortcut
        .split('+')
        .map((key) => resolveKey(key.trim()))
        .filter((key): key is string => key !== null)
}

export function formatShortcut(shortcut: string | undefined, separator: string = ' + '): string {
    return resolveShortcut(shortcut).join(separator)
}

const KEY_NORMALIZE: Record<string, string> = {
    control: 'ctrl',
    ' ': 'space'
}

export function normalizeKey(eventKey: string): string {
    const lower = eventKey.toLowerCase()
    return KEY_NORMALIZE[lower] ?? lower
}

const CAPTURABLE_MODIFIERS: Record<string, true> = { alt: true, meta: true }

const MODIFIER_PROPS: ReadonlyArray<
    readonly [string, 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey']
> = [
    ['ctrl', 'ctrlKey'],
    ['shift', 'shiftKey'],
    ['alt', 'altKey'],
    ['meta', 'metaKey']
] as const

// --- Shared Global Listener Registry ---
// All useKbd instances share one set of window listeners instead of each attaching their own.

interface KbdInstanceCallbacks {
    keydown(event: KeyboardEvent): void
    keyup(event: KeyboardEvent): void
    clear(): void
}

const kbdRegistry = {
    handlers: [] as KbdInstanceCallbacks[],
    active: false,

    register(cb: KbdInstanceCallbacks) {
        this.handlers.push(cb)
        if (!this.active && typeof window !== 'undefined') {
            window.addEventListener('keydown', this._onKeyDown)
            window.addEventListener('keyup', this._onKeyUp)
            window.addEventListener('blur', this._onBlur)
            document.addEventListener('visibilitychange', this._onVisibility)
            this.active = true
        }
    },

    unregister(cb: KbdInstanceCallbacks) {
        const idx = this.handlers.indexOf(cb)
        if (idx !== -1) this.handlers.splice(idx, 1)
        if (this.handlers.length === 0 && this.active) {
            window.removeEventListener('keydown', this._onKeyDown)
            window.removeEventListener('keyup', this._onKeyUp)
            window.removeEventListener('blur', this._onBlur)
            document.removeEventListener('visibilitychange', this._onVisibility)
            this.active = false
        }
    },

    _onKeyDown(event: KeyboardEvent) {
        for (let i = 0; i < kbdRegistry.handlers.length; i++) {
            kbdRegistry.handlers[i].keydown(event)
        }
    },
    _onKeyUp(event: KeyboardEvent) {
        for (let i = 0; i < kbdRegistry.handlers.length; i++) {
            kbdRegistry.handlers[i].keyup(event)
        }
    },
    _onBlur() {
        for (let i = 0; i < kbdRegistry.handlers.length; i++) {
            kbdRegistry.handlers[i].clear()
        }
    },
    _onVisibility() {
        if (document.hidden) kbdRegistry._onBlur()
    }
}

interface ParsedBinding {
    modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }
    key: string
    callback: (event: KeyboardEvent) => void
}

export function parseShortcutBinding(shortcut: string): {
    modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }
    key: string
} {
    const parts = shortcut
        .toLowerCase()
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean)
    const modifiers = { ctrl: false, shift: false, alt: false, meta: false }
    let key = ''

    for (const part of parts) {
        if (part === 'ctrl' || part === 'control') {
            modifiers.ctrl = true
        } else if (part === 'shift') {
            modifiers.shift = true
        } else if (part === 'alt') {
            modifiers.alt = true
        } else if (part === 'meta' || part === 'cmd' || part === 'command') {
            modifiers.meta = true
        } else {
            key = part
        }
    }

    return { modifiers, key }
}

export function matchesShortcut(
    event: KeyboardEvent,
    binding: {
        modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }
        key: string
    }
): boolean {
    if (normalizeKey(event.key) !== binding.key) return false
    if (event.ctrlKey !== binding.modifiers.ctrl) return false
    if (event.shiftKey !== binding.modifiers.shift) return false
    if (event.altKey !== binding.modifiers.alt) return false
    if (event.metaKey !== binding.modifiers.meta) return false
    return true
}

function parseShortcuts(shortcuts: Record<string, KeyboardShortcutCallback>): ParsedBinding[] {
    return Object.entries(shortcuts).map(([shortcut, callback]) => ({
        ...parseShortcutBinding(shortcut),
        callback
    }))
}

export function useKbd(options: UseKbdOptions = {}): UseKbdReturn {
    const _pressedKeys = new SvelteSet<string>()

    let _shortcutsRef: Record<string, KeyboardShortcutCallback> | undefined
    let _parsedShortcuts: ParsedBinding[] = []

    if (typeof options.shortcuts !== 'function' && options.shortcuts) {
        _shortcutsRef = options.shortcuts
        _parsedShortcuts = parseShortcuts(options.shortcuts)
    }

    function getParsedShortcuts(): ParsedBinding[] {
        if (typeof options.shortcuts !== 'function') return _parsedShortcuts
        const current = options.shortcuts()
        if (current !== _shortcutsRef) {
            _shortcutsRef = current
            _parsedShortcuts = parseShortcuts(current)
        }
        return _parsedShortcuts
    }

    function getEnabled(): boolean {
        return typeof options.enabled === 'function' ? options.enabled() : (options.enabled ?? true)
    }

    function getTarget(): HTMLElement | Window | null {
        const t = typeof options.target === 'function' ? options.target() : options.target
        return t ?? (typeof window !== 'undefined' ? window : null)
    }

    /** Sync modifier state from event booleans to fix missed keyup (e.g. Alt+Tab) */
    function reconcileModifiers(event: KeyboardEvent) {
        for (const [key, prop] of MODIFIER_PROPS) {
            if (event[prop]) _pressedKeys.add(key)
            else _pressedKeys.delete(key)
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (!getEnabled()) return

        reconcileModifiers(event)

        const key = normalizeKey(event.key)
        _pressedKeys.add(key)

        if (options.captureModifiers && key in CAPTURABLE_MODIFIERS) {
            event.preventDefault()
        }

        if (event.repeat && !options.repeat) return

        const bindings = getParsedShortcuts()
        for (const binding of bindings) {
            if (matchesShortcut(event, binding)) {
                if (options.preventDefault !== false) {
                    event.preventDefault()
                }
                binding.callback(event)
            }
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        if (!getEnabled()) return

        reconcileModifiers(event)

        const key = normalizeKey(event.key)
        _pressedKeys.delete(key)
    }

    function handleClear() {
        _pressedKeys.clear()
    }

    $effect(() => {
        if (!getEnabled()) {
            _pressedKeys.clear()
            return
        }

        const target = getTarget()
        if (!target) return

        const isWindowTarget = typeof window !== 'undefined' && target === window

        const callbacks: KbdInstanceCallbacks = {
            keydown: handleKeyDown,
            keyup: handleKeyUp,
            clear: handleClear
        }

        if (isWindowTarget) {
            kbdRegistry.register(callbacks)
            return () => {
                kbdRegistry.unregister(callbacks)
                _pressedKeys.clear()
            }
        } else {
            const clearOnly: KbdInstanceCallbacks = {
                keydown: () => {},
                keyup: () => {},
                clear: handleClear
            }
            target.addEventListener('keydown', handleKeyDown as EventListener)
            target.addEventListener('keyup', handleKeyUp as EventListener)
            kbdRegistry.register(clearOnly)
            return () => {
                target.removeEventListener('keydown', handleKeyDown as EventListener)
                target.removeEventListener('keyup', handleKeyUp as EventListener)
                kbdRegistry.unregister(clearOnly)
                _pressedKeys.clear()
            }
        }
    })

    return {
        isPressed(key: string): boolean {
            return _pressedKeys.has(normalizeKey(key))
        },
        get pressedKeys(): ReadonlySet<string> {
            return _pressedKeys
        }
    }
}

export { kbdKeysMap, kbdKeysPlatformMap }
