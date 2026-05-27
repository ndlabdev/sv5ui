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
