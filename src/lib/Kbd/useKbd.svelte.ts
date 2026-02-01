import { kbdKeysMap, kbdKeysPlatformMap } from './kbd.variants.js'

let cachedIsMac: boolean | undefined

const detectPlatform = () => {
    if (cachedIsMac === undefined) {
        cachedIsMac = typeof navigator !== 'undefined' && /Macintosh|Mac OS|iPhone|iPad|iPod/i.test(navigator.userAgent)
    }
    return cachedIsMac
}

/** @internal Reset platform cache - for testing only */
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

export { kbdKeysMap, kbdKeysPlatformMap }
