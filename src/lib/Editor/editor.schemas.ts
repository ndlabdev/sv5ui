import * as v from 'valibot'
import type { StandardSchemaV1 } from '@standard-schema/spec'

export type UrlSchema = StandardSchemaV1<string, string>

export const httpUrlSchema: UrlSchema = v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('URL is required'),
    v.url('Please enter a valid URL'),
    v.regex(/^https?:\/\//i, 'URL must start with http:// or https://')
)

/**
 * Whether a string is safe to use as an `<img src>`. Allows relative URLs,
 * `http`/`https`, and raster `data:image/*` URIs; blocks `javascript:`,
 * `vbscript:`, `data:text/*`, and `data:image/svg+xml` (SVG can execute script).
 *
 * The input is first normalized the way the WHATWG URL parser does — tab/CR/LF
 * are removed and leading/trailing control characters and spaces (code point
 * <= 0x20) are stripped — so prefixed/embedded-control bypasses (a leading
 * control byte before `javascript:`, or `java\nscript:`) cannot slip past the
 * scheme check.
 */
function normalizeUrl(src: string): string {
    const s = src.replace(/[\t\n\r]/g, '')
    let start = 0
    let end = s.length
    while (start < end && s.charCodeAt(start) <= 0x20) start++
    while (end > start && s.charCodeAt(end - 1) <= 0x20) end--
    return s.slice(start, end)
}

export function isSafeImageSrc(src: string): boolean {
    const s = normalizeUrl(src)
    if (!s) return false
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s)?.[1]?.toLowerCase()
    if (!scheme) return true
    if (scheme === 'http' || scheme === 'https') return true
    if (scheme === 'data') {
        return /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp|x-icon|vnd\.microsoft\.icon)[;,]/i.test(
            s
        )
    }
    return false
}

export const youtubeUrlSchema: UrlSchema = v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('URL is required'),
    v.url('Please enter a valid URL'),
    v.regex(
        /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\//i,
        'Must be a YouTube URL (youtube.com or youtu.be)'
    )
)
