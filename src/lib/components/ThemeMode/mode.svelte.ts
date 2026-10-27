import { untrack } from 'svelte'
import { on } from 'svelte/events'
import { MediaQuery, SvelteMap, createSubscriber } from 'svelte/reactivity'
import { SCRIPT_SIGNATURE } from './mode-script.js'
import type { ColorMode, ResolvedColorMode, ThemeColors } from './theme-mode.types.js'

export const DEFAULT_MODE_STORAGE_KEY = 'mode-watcher-mode'
export const DEFAULT_THEME_STORAGE_KEY = 'mode-watcher-theme'

const MODES: readonly string[] = ['light', 'dark', 'system']
const TRANSITION_OVERRIDE = '*, *::before, *::after { transition: none !important; }'
const isBrowser = typeof document !== 'undefined'

export type ModeConfig = {
    darkClassNames: string[]
    lightClassNames: string[]
    themeColors: ThemeColors
    disableTransitions: boolean
    synchronousModeChanges: boolean
    modeStorageKey: string
    themeStorageKey: string
}

export const modeConfig: ModeConfig = $state({
    darkClassNames: ['dark'],
    lightClassNames: [],
    themeColors: undefined,
    disableTransitions: true,
    synchronousModeChanges: false,
    modeStorageKey: DEFAULT_MODE_STORAGE_KEY,
    themeStorageKey: DEFAULT_THEME_STORAGE_KEY
})

export const isValidMode = (value: unknown): value is ColorMode =>
    typeof value === 'string' && MODES.includes(value)

const memory = new SvelteMap<string, string>()

function getStorage(): Storage | undefined {
    if (!isBrowser) return undefined
    try {
        return window.localStorage
    } catch {
        return undefined
    }
}

export function readStored(key: string): string | null {
    const storage = getStorage()
    if (!storage) return memory.get(key) ?? null
    try {
        return storage.getItem(key)
    } catch {
        return memory.get(key) ?? null
    }
}

function writeStored(key: string, value: string): void {
    memory.set(key, value)
    try {
        getStorage()?.setItem(key, value)
    } catch {
        return
    }
}

function removeStored(key: string): void {
    memory.delete(key)
    try {
        getStorage()?.removeItem(key)
    } catch {
        return
    }
}

let version = $state(0)

const subscribe = isBrowser
    ? createSubscriber((update) => {
          const off = on(window, 'storage', update)
          const observer = new MutationObserver(update)
          observer.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ['class', 'data-theme']
          })
          return () => {
              off()
              observer.disconnect()
          }
      })
    : () => {}

function track(): void {
    subscribe()
    void version
}

class UserPrefersMode {
    get current(): ColorMode {
        track()
        const stored = readStored(modeConfig.modeStorageKey)
        return isValidMode(stored) ? stored : 'system'
    }

    set current(value: ColorMode) {
        setMode(value)
    }
}

class SystemPrefersMode {
    #media = isBrowser ? new MediaQuery('(prefers-color-scheme: light)') : undefined
    #tracking = $state(true)
    #snapshot: ResolvedColorMode = $state(undefined)

    get current(): ResolvedColorMode {
        if (!this.#media) return undefined
        return this.#tracking ? this.#live() : this.#snapshot
    }

    query = (): void => {
        if (this.#media) this.#snapshot = this.#live()
    }

    tracking = (active: boolean): void => {
        if (!active) this.query()
        this.#tracking = active
    }

    #live(): 'light' | 'dark' {
        return this.#media?.current ? 'light' : 'dark'
    }
}

export const userPrefersMode = new UserPrefersMode()

export const systemPrefersMode = new SystemPrefersMode()

function resolveMode(): ResolvedColorMode {
    const preference = userPrefersMode.current
    return preference === 'system' ? systemPrefersMode.current : preference
}

export const mode: { readonly current: ResolvedColorMode } = {
    get current() {
        return isBrowser ? resolveMode() : undefined
    }
}

export function readTheme(): string {
    track()
    return readStored(modeConfig.themeStorageKey) ?? ''
}

let applied = false
let transitionOverride: HTMLStyleElement | undefined
let pendingFrame = 0

function withoutTransition(action: () => void): void {
    if (!applied || !modeConfig.disableTransitions) {
        applied = true
        action()
        return
    }
    transitionOverride ??= Object.assign(document.createElement('style'), {
        textContent: TRANSITION_OVERRIDE
    })
    document.head.appendChild(transitionOverride)
    const run = () => {
        action()
        requestAnimationFrame(() => transitionOverride?.remove())
    }
    cancelAnimationFrame(pendingFrame)
    if (modeConfig.synchronousModeChanges) run()
    else pendingFrame = requestAnimationFrame(run)
}

function toggleClasses(root: HTMLElement, names: string[], active: boolean): void {
    for (const name of names) {
        if (name && root.classList.contains(name) !== active) root.classList.toggle(name, active)
    }
}

function writeThemeColor(resolved: 'light' | 'dark'): void {
    const colors = modeConfig.themeColors
    if (!colors) return
    const meta = document.querySelector('meta[name="theme-color"]')
    const content = resolved === 'light' ? colors.light : colors.dark
    if (meta && meta.getAttribute('content') !== content) meta.setAttribute('content', content)
}

function writeMode(): void {
    const resolved = resolveMode() ?? 'light'
    const root = document.documentElement
    const isLight = resolved === 'light'
    toggleClasses(root, isLight ? modeConfig.darkClassNames : modeConfig.lightClassNames, false)
    toggleClasses(root, isLight ? modeConfig.lightClassNames : modeConfig.darkClassNames, true)
    if (root.style.colorScheme !== resolved) root.style.colorScheme = resolved
    writeThemeColor(resolved)
}

export function applyMode(): void {
    if (!isBrowser) return
    untrack(() => withoutTransition(writeMode))
}

export function applyModeOnce(): void {
    if (!applied) applyMode()
}

export function applyTheme(): void {
    if (!isBrowser) return
    untrack(() => {
        const theme = readStored(modeConfig.themeStorageKey) ?? ''
        const root = document.documentElement
        if (root.getAttribute('data-theme') !== theme) root.setAttribute('data-theme', theme)
    })
}

function announce(key: string, oldValue: string | null, newValue: string): void {
    window.dispatchEvent(
        new StorageEvent('storage', {
            key,
            oldValue,
            newValue,
            storageArea: getStorage() ?? null,
            url: location.href
        })
    )
}

export function setMode(value: ColorMode): void {
    if (!isBrowser || !isValidMode(value)) return
    untrack(() => {
        const key = modeConfig.modeStorageKey
        const previous = readStored(key)
        writeStored(key, value)
        version++
        if (previous !== value) announce(key, previous, value)
    })
    applyMode()
}

export function toggleMode(): void {
    if (!isBrowser) return
    setMode(untrack(resolveMode) === 'dark' ? 'light' : 'dark')
}

export function resetMode(): void {
    setMode('system')
}

export function setTheme(theme: string): void {
    if (!isBrowser) return
    untrack(() => {
        writeStored(modeConfig.themeStorageKey, theme)
        version++
    })
    applyTheme()
}

function moveStored(from: string, to: string): void {
    if (from === to) return
    const value = readStored(from)
    if (value !== null) writeStored(to, value)
    removeStored(from)
}

export function configureMode(next: ModeConfig): void {
    if (!isBrowser) return
    untrack(() => {
        moveStored(modeConfig.modeStorageKey, next.modeStorageKey)
        moveStored(modeConfig.themeStorageKey, next.themeStorageKey)
        Object.assign(modeConfig, next)
        version++
    })
}

let warnedForeignWatcher = false

export function warnOnForeignWatcher(): void {
    if (!isBrowser || warnedForeignWatcher) return
    const foreign = Array.from(document.querySelectorAll('script')).some((script) => {
        const source = script.textContent ?? ''
        return source.includes('"modeStorageKey"') && !source.includes(SCRIPT_SIGNATURE)
    })
    if (!foreign) return
    warnedForeignWatcher = true
    // eslint-disable-next-line no-console
    console.warn(
        '[sv5ui ThemeMode] A separate mode-watcher instance is running next to sv5ui. ' +
            'sv5ui keeps both in sync, but mount <ThemeMode /> from sv5ui instead of ' +
            '<ModeWatcher /> and import the mode functions from sv5ui.'
    )
}
