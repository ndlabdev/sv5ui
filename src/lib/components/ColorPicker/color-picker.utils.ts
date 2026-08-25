export interface Hsva {
    h: number
    s: number
    v: number
    a: number
}

export interface Rgba {
    r: number
    g: number
    b: number
    a: number
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

function normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360
}

export function hsvaToRgba(hsva: Hsva): Rgba {
    const h = normalizeHue(hsva.h)
    const s = clamp(hsva.s, 0, 1)
    const v = clamp(hsva.v, 0, 1)
    const channel = (n: number) => {
        const k = (n + h / 60) % 6
        return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255
    }

    return { r: channel(5), g: channel(3), b: channel(1), a: clamp(hsva.a, 0, 1) }
}

export function rgbaToHsva(rgba: Rgba): Hsva {
    const r = clamp(rgba.r, 0, 255) / 255
    const g = clamp(rgba.g, 0, 255) / 255
    const b = clamp(rgba.b, 0, 255) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    let h = 0
    if (delta !== 0) {
        if (max === r) h = 60 * (((g - b) / delta) % 6)
        else if (max === g) h = 60 * ((b - r) / delta + 2)
        else h = 60 * ((r - g) / delta + 4)
    }

    return {
        h: normalizeHue(h),
        s: max === 0 ? 0 : delta / max,
        v: max,
        a: clamp(rgba.a, 0, 1)
    }
}

export function hsvaToHsl(hsva: Hsva): { h: number; s: number; l: number } {
    const s = clamp(hsva.s, 0, 1)
    const v = clamp(hsva.v, 0, 1)
    const l = v * (1 - s / 2)
    const denominator = Math.min(l, 1 - l)

    return {
        h: normalizeHue(hsva.h),
        s: denominator === 0 ? 0 : (v - l) / denominator,
        l
    }
}

export function hslToHsva(h: number, s: number, l: number, a: number): Hsva {
    const clampedS = clamp(s, 0, 1)
    const clampedL = clamp(l, 0, 1)
    const v = clampedL + clampedS * Math.min(clampedL, 1 - clampedL)

    return {
        h: normalizeHue(h),
        s: v === 0 ? 0 : 2 * (1 - clampedL / v),
        v,
        a: clamp(a, 0, 1)
    }
}

function toHexChannel(value: number): string {
    return Math.round(clamp(value, 0, 255))
        .toString(16)
        .padStart(2, '0')
}

function roundAlpha(alpha: number): number {
    return Math.round(clamp(alpha, 0, 1) * 100) / 100
}

function expandShortHex(hex: string): string {
    return hex
        .split('')
        .map((char) => char + char)
        .join('')
}

function parseHex(input: string): Hsva | null {
    const match = /^#([0-9a-f]{3,8})$/i.exec(input)
    if (!match) return null

    let hex = match[1].toLowerCase()
    if (hex.length === 3 || hex.length === 4) hex = expandShortHex(hex)
    if (hex.length !== 6 && hex.length !== 8) return null

    return rgbaToHsva({
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    })
}

function splitFunctionArgs(input: string): string[] {
    return input.replace(/[,/]/g, ' ').trim().split(/\s+/)
}

function parseNumber(token: string | undefined, scale: number): number | null {
    if (token === undefined) return null

    const isPercentage = token.endsWith('%')
    const parsed = Number.parseFloat(isPercentage ? token.slice(0, -1) : token)
    if (Number.isNaN(parsed)) return null

    return isPercentage ? (parsed / 100) * scale : parsed
}

function parseAlpha(token: string | undefined): number | null {
    if (token === undefined) return 1
    return parseNumber(token, 1)
}

function parseRgb(input: string): Hsva | null {
    const match = /^rgba?\(([^)]*)\)$/i.exec(input)
    if (!match) return null

    const args = splitFunctionArgs(match[1])
    if (args.length < 3 || args.length > 4) return null

    const r = parseNumber(args[0], 255)
    const g = parseNumber(args[1], 255)
    const b = parseNumber(args[2], 255)
    const a = parseAlpha(args[3])
    if (r === null || g === null || b === null || a === null) return null

    return rgbaToHsva({ r, g, b, a })
}

function parseHsl(input: string): Hsva | null {
    const match = /^hsla?\(([^)]*)\)$/i.exec(input)
    if (!match) return null

    const args = splitFunctionArgs(match[1])
    if (args.length < 3 || args.length > 4) return null

    const h = parseNumber(args[0].replace(/deg$/i, ''), 360)
    const s = parseNumber(args[1], 1)
    const l = parseNumber(args[2], 1)
    const a = parseAlpha(args[3])
    if (h === null || s === null || l === null || a === null) return null

    return hslToHsva(h, s, l, a)
}

export function parseColor(input: string | undefined | null): Hsva | null {
    if (typeof input !== 'string') return null

    const value = input.trim().toLowerCase()
    if (value === '') return null
    if (value === 'transparent') return { h: 0, s: 0, v: 0, a: 0 }

    return parseHex(value) ?? parseRgb(value) ?? parseHsl(value)
}

export function formatColor(hsva: Hsva, format: ColorFormat, alpha: boolean): string {
    const a = alpha ? roundAlpha(hsva.a) : 1
    const withAlpha = alpha && a < 1

    if (format === 'hsl') {
        const hsl = hsvaToHsl(hsva)
        const h = Math.round(hsl.h)
        const s = Math.round(hsl.s * 100)
        const l = Math.round(hsl.l * 100)
        return withAlpha ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`
    }

    const rgba = hsvaToRgba(hsva)
    const r = Math.round(rgba.r)
    const g = Math.round(rgba.g)
    const b = Math.round(rgba.b)

    if (format === 'rgb') {
        return withAlpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
    }

    const hex = `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`
    return withAlpha ? `${hex}${toHexChannel(a * 255)}` : hex
}

export function toCssColor(hsva: Hsva, alpha: boolean): string {
    const rgba = hsvaToRgba(hsva)
    const r = Math.round(rgba.r)
    const g = Math.round(rgba.g)
    const b = Math.round(rgba.b)
    const a = alpha ? roundAlpha(rgba.a) : 1

    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
}

export function hueCssColor(hue: number): string {
    return `hsl(${Math.round(normalizeHue(hue))}, 100%, 50%)`
}

export function isSameHsva(a: Hsva, b: Hsva): boolean {
    return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a
}

type AreaPosition = { s: number; v: number }

const areaKeySteps: Record<string, (current: AreaPosition, step: number) => AreaPosition> = {
    ArrowLeft: (current, step) => ({ s: current.s - step, v: current.v }),
    ArrowRight: (current, step) => ({ s: current.s + step, v: current.v }),
    ArrowUp: (current, step) => ({ s: current.s, v: current.v + step }),
    ArrowDown: (current, step) => ({ s: current.s, v: current.v - step }),
    PageUp: (current) => ({ s: current.s, v: current.v + 0.1 }),
    PageDown: (current) => ({ s: current.s, v: current.v - 0.1 }),
    Home: (current) => ({ s: 0, v: current.v }),
    End: (current) => ({ s: 1, v: current.v })
}

export function stepAreaValue(
    key: string,
    current: AreaPosition,
    step: number
): AreaPosition | null {
    const apply = areaKeySteps[key]
    if (!apply) return null

    const next = apply(current, step)
    return { s: clamp(next.s, 0, 1), v: clamp(next.v, 0, 1) }
}
