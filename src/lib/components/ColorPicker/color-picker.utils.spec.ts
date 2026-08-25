import { describe, expect, it } from 'vitest'
import {
    clamp,
    formatColor,
    hslToHsva,
    hsvaToHsl,
    hsvaToRgba,
    hueCssColor,
    isSameHsva,
    parseColor,
    rgbaToHsva,
    stepAreaValue,
    toCssColor
} from './color-picker.utils.js'

const RED = { h: 0, s: 1, v: 1, a: 1 }

describe('color-picker utils', () => {
    // ==================== CLAMP ====================

    describe('clamp', () => {
        it('should clamp below the minimum', () => {
            expect(clamp(-1, 0, 1)).toBe(0)
        })

        it('should clamp above the maximum', () => {
            expect(clamp(2, 0, 1)).toBe(1)
        })

        it('should keep values inside the range', () => {
            expect(clamp(0.42, 0, 1)).toBe(0.42)
        })
    })

    // ==================== CONVERSION ====================

    describe('hsvaToRgba', () => {
        it('should convert pure red', () => {
            const rgba = hsvaToRgba(RED)
            expect(Math.round(rgba.r)).toBe(255)
            expect(Math.round(rgba.g)).toBe(0)
            expect(Math.round(rgba.b)).toBe(0)
        })

        it('should convert white and black', () => {
            expect(Math.round(hsvaToRgba({ h: 0, s: 0, v: 1, a: 1 }).r)).toBe(255)
            expect(Math.round(hsvaToRgba({ h: 0, s: 0, v: 0, a: 1 }).r)).toBe(0)
        })

        it('should normalize hues outside 0-360', () => {
            expect(hsvaToRgba({ ...RED, h: 720 })).toEqual(hsvaToRgba(RED))
            expect(hsvaToRgba({ ...RED, h: -120 })).toEqual(hsvaToRgba({ ...RED, h: 240 }))
        })

        it('should preserve alpha', () => {
            expect(hsvaToRgba({ ...RED, a: 0.25 }).a).toBe(0.25)
        })
    })

    describe('rgbaToHsva', () => {
        it('should convert pure green', () => {
            const hsva = rgbaToHsva({ r: 0, g: 255, b: 0, a: 1 })
            expect(hsva.h).toBe(120)
            expect(hsva.s).toBe(1)
            expect(hsva.v).toBe(1)
        })

        it('should report zero saturation for grays', () => {
            expect(rgbaToHsva({ r: 128, g: 128, b: 128, a: 1 }).s).toBe(0)
        })

        it('should round-trip through hsvaToRgba', () => {
            for (const hex of ['#3b82f6', '#f97316', '#22c55e', '#a855f7', '#111827']) {
                const hsva = parseColor(hex)!
                expect(formatColor(rgbaToHsva(hsvaToRgba(hsva)), 'hex', false)).toBe(hex)
            }
        })
    })

    describe('hsl conversion', () => {
        it('should round-trip hsv through hsl', () => {
            const hsva = parseColor('#3b82f6')!
            const hsl = hsvaToHsl(hsva)
            const back = hslToHsva(hsl.h, hsl.s, hsl.l, hsva.a)
            expect(formatColor(back, 'hex', false)).toBe('#3b82f6')
        })

        it('should report zero saturation for black and white', () => {
            expect(hsvaToHsl({ h: 0, s: 0, v: 0, a: 1 }).s).toBe(0)
            expect(hsvaToHsl({ h: 0, s: 0, v: 1, a: 1 }).s).toBe(0)
        })

        it('should map lightness correctly', () => {
            expect(hsvaToHsl(RED).l).toBe(0.5)
        })
    })

    // ==================== PARSING ====================

    describe('parseColor', () => {
        it('should parse 6-digit hex', () => {
            expect(formatColor(parseColor('#3b82f6')!, 'hex', false)).toBe('#3b82f6')
        })

        it('should parse uppercase hex', () => {
            expect(formatColor(parseColor('#3B82F6')!, 'hex', false)).toBe('#3b82f6')
        })

        it('should expand 3-digit hex', () => {
            expect(formatColor(parseColor('#f00')!, 'hex', false)).toBe('#ff0000')
        })

        it('should expand 4-digit hex with alpha', () => {
            const parsed = parseColor('#f008')!
            expect(formatColor(parsed, 'hex', false)).toBe('#ff0000')
            expect(parsed.a).toBeCloseTo(0.533, 2)
        })

        it('should parse 8-digit hex alpha', () => {
            expect(parseColor('#3b82f680')!.a).toBeCloseTo(0.502, 3)
        })

        it('should parse comma separated rgb', () => {
            expect(formatColor(parseColor('rgb(59, 130, 246)')!, 'hex', false)).toBe('#3b82f6')
        })

        it('should parse space separated rgb with slash alpha', () => {
            const parsed = parseColor('rgb(59 130 246 / 50%)')!
            expect(formatColor(parsed, 'hex', false)).toBe('#3b82f6')
            expect(parsed.a).toBe(0.5)
        })

        it('should parse rgba with decimal alpha', () => {
            expect(parseColor('rgba(59, 130, 246, 0.25)')!.a).toBe(0.25)
        })

        it('should parse percentage rgb channels', () => {
            expect(formatColor(parseColor('rgb(100%, 0%, 0%)')!, 'hex', false)).toBe('#ff0000')
        })

        it('should parse hsl', () => {
            const hsl = hsvaToHsl(parseColor('hsl(217, 91%, 60%)')!)
            expect(hsl.h).toBeCloseTo(217, 0)
            expect(hsl.s).toBeCloseTo(0.91, 2)
            expect(hsl.l).toBeCloseTo(0.6, 2)
        })

        it('should parse hsl with deg and slash alpha', () => {
            const parsed = parseColor('hsl(217deg 91% 60% / 0.4)')!
            expect(hsvaToHsl(parsed).h).toBeCloseTo(217, 0)
            expect(parsed.a).toBe(0.4)
        })

        it('should parse hsla', () => {
            expect(parseColor('hsla(120, 100%, 50%, 0.5)')!.a).toBe(0.5)
        })

        it('should parse transparent', () => {
            expect(parseColor('transparent')).toEqual({ h: 0, s: 0, v: 0, a: 0 })
        })

        it('should trim whitespace', () => {
            expect(formatColor(parseColor('  #f00  ')!, 'hex', false)).toBe('#ff0000')
        })

        it('should return null for invalid input', () => {
            expect(parseColor('nope')).toBeNull()
            expect(parseColor('')).toBeNull()
            expect(parseColor('   ')).toBeNull()
            expect(parseColor('#12345')).toBeNull()
            expect(parseColor('rgb(1, 2)')).toBeNull()
            expect(parseColor('rgb(1, 2, 3, 4, 5)')).toBeNull()
            expect(parseColor('hsl(a, b, c)')).toBeNull()
            expect(parseColor(undefined)).toBeNull()
            expect(parseColor(null)).toBeNull()
        })
    })

    // ==================== FORMATTING ====================

    describe('formatColor', () => {
        it('should format hex without alpha suffix when opaque', () => {
            expect(formatColor(RED, 'hex', true)).toBe('#ff0000')
        })

        it('should append the alpha byte only when translucent', () => {
            expect(formatColor({ ...RED, a: 0.5 }, 'hex', true)).toBe('#ff000080')
        })

        it('should ignore alpha when the channel is disabled', () => {
            expect(formatColor({ ...RED, a: 0.5 }, 'hex', false)).toBe('#ff0000')
            expect(formatColor({ ...RED, a: 0.5 }, 'rgb', false)).toBe('rgb(255, 0, 0)')
        })

        it('should format rgb and rgba', () => {
            expect(formatColor(RED, 'rgb', false)).toBe('rgb(255, 0, 0)')
            expect(formatColor({ ...RED, a: 0.5 }, 'rgb', true)).toBe('rgba(255, 0, 0, 0.5)')
        })

        it('should format hsl and hsla', () => {
            expect(formatColor(RED, 'hsl', false)).toBe('hsl(0, 100%, 50%)')
            expect(formatColor({ ...RED, a: 0.5 }, 'hsl', true)).toBe('hsla(0, 100%, 50%, 0.5)')
        })

        it('should round the alpha channel to two decimals', () => {
            expect(formatColor({ ...RED, a: 0.123456 }, 'rgb', true)).toBe('rgba(255, 0, 0, 0.12)')
        })

        it('should stay stable across a hex round-trip with alpha', () => {
            const first = formatColor({ ...RED, a: 0.5 }, 'hex', true)
            expect(formatColor(parseColor(first)!, 'hex', true)).toBe(first)
        })
    })

    describe('toCssColor', () => {
        it('should render an opaque rgb string', () => {
            expect(toCssColor(RED, false)).toBe('rgb(255, 0, 0)')
        })

        it('should render rgba when translucent', () => {
            expect(toCssColor({ ...RED, a: 0.4 }, true)).toBe('rgba(255, 0, 0, 0.4)')
        })

        it('should ignore alpha when disabled', () => {
            expect(toCssColor({ ...RED, a: 0.4 }, false)).toBe('rgb(255, 0, 0)')
        })
    })

    describe('hueCssColor', () => {
        it('should render a fully saturated hue', () => {
            expect(hueCssColor(217.4)).toBe('hsl(217, 100%, 50%)')
        })

        it('should normalize out-of-range hues', () => {
            expect(hueCssColor(-60)).toBe('hsl(300, 100%, 50%)')
        })
    })

    describe('isSameHsva', () => {
        it('should compare every channel', () => {
            expect(isSameHsva(RED, { ...RED })).toBe(true)
            expect(isSameHsva(RED, { ...RED, a: 0.5 })).toBe(false)
        })
    })

    // ==================== KEYBOARD STEPS ====================

    describe('stepAreaValue', () => {
        const middle = { s: 0.5, v: 0.5 }

        it('should step saturation with left and right', () => {
            expect(stepAreaValue('ArrowLeft', middle, 0.01)).toEqual({ s: 0.49, v: 0.5 })
            expect(stepAreaValue('ArrowRight', middle, 0.01)).toEqual({ s: 0.51, v: 0.5 })
        })

        it('should step brightness with up and down', () => {
            expect(stepAreaValue('ArrowUp', middle, 0.1)!.v).toBeCloseTo(0.6, 5)
            expect(stepAreaValue('ArrowDown', middle, 0.1)!.v).toBeCloseTo(0.4, 5)
        })

        it('should jump brightness with page keys', () => {
            expect(stepAreaValue('PageUp', middle, 0.01)!.v).toBeCloseTo(0.6, 5)
            expect(stepAreaValue('PageDown', middle, 0.01)!.v).toBeCloseTo(0.4, 5)
        })

        it('should snap saturation with home and end', () => {
            expect(stepAreaValue('Home', middle, 0.01)).toEqual({ s: 0, v: 0.5 })
            expect(stepAreaValue('End', middle, 0.01)).toEqual({ s: 1, v: 0.5 })
        })

        it('should clamp to the 0-1 range', () => {
            expect(stepAreaValue('ArrowLeft', { s: 0, v: 0 }, 0.1)).toEqual({ s: 0, v: 0 })
            expect(stepAreaValue('ArrowUp', { s: 1, v: 1 }, 0.1)).toEqual({ s: 1, v: 1 })
        })

        it('should return null for unhandled keys', () => {
            expect(stepAreaValue('Enter', middle, 0.01)).toBeNull()
        })
    })
})
