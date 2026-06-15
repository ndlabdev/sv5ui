import { describe, it, expect } from 'vitest'
import { isSafeImageSrc } from './editor.schemas.js'

describe('isSafeImageSrc', () => {
    it('allows http(s) and relative/protocol-relative urls', () => {
        expect(isSafeImageSrc('https://example.com/a.png')).toBe(true)
        expect(isSafeImageSrc('http://example.com/a.png')).toBe(true)
        expect(isSafeImageSrc('/uploads/a.png')).toBe(true)
        expect(isSafeImageSrc('./a.png')).toBe(true)
        expect(isSafeImageSrc('../a.png')).toBe(true)
        expect(isSafeImageSrc('a.png')).toBe(true)
        expect(isSafeImageSrc('//cdn.example.com/a.png')).toBe(true)
    })

    it('allows raster data:image URIs', () => {
        expect(isSafeImageSrc('data:image/png;base64,iVBORw0KGgo=')).toBe(true)
        expect(isSafeImageSrc('data:image/jpeg;base64,/9j/4AAQ')).toBe(true)
        expect(isSafeImageSrc('data:image/gif;base64,R0lGOD')).toBe(true)
        expect(isSafeImageSrc('data:image/webp;base64,UklGR')).toBe(true)
    })

    it('blocks dangerous schemes (case/space-insensitive)', () => {
        expect(isSafeImageSrc('javascript:alert(1)')).toBe(false)
        expect(isSafeImageSrc('  JavaScript:alert(1)')).toBe(false)
        expect(isSafeImageSrc('vbscript:msgbox(1)')).toBe(false)
        expect(isSafeImageSrc('file:///etc/passwd')).toBe(false)
    })

    it('blocks svg and non-image data: URIs', () => {
        expect(isSafeImageSrc('data:image/svg+xml,<svg onload=alert(1)>')).toBe(false)
        expect(isSafeImageSrc('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false)
        expect(isSafeImageSrc('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('rejects empty input', () => {
        expect(isSafeImageSrc('')).toBe(false)
        expect(isSafeImageSrc('   ')).toBe(false)
    })

    it('resists control-character and embedded-newline scheme bypasses', () => {
        const ctrl = String.fromCharCode(1)
        expect(isSafeImageSrc(ctrl + 'javascript:alert(1)')).toBe(false)
        expect(isSafeImageSrc(ctrl + 'data:image/svg+xml,<svg onload=alert(1)>')).toBe(false)
        expect(isSafeImageSrc('java\nscript:alert(1)')).toBe(false)
        expect(isSafeImageSrc('\tvbscript:x')).toBe(false)
        expect(isSafeImageSrc('  https://example.com/a.png  ')).toBe(true)
    })
})
