import type { AnyExtension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'

interface BuildExtensionsOptions {
    headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
    placeholder?: string
    autolink?: boolean
    linkOpenInNewTab?: boolean
    maxLength?: number
    extra?: AnyExtension[]
}

export function buildExtensions(options: BuildExtensionsOptions = {}): AnyExtension[] {
    const {
        headingLevels = [1, 2, 3],
        placeholder,
        autolink = true,
        linkOpenInNewTab = true,
        maxLength,
        extra = []
    } = options

    const exts: AnyExtension[] = [
        StarterKit.configure({
            heading: { levels: headingLevels },
            link: {
                autolink,
                openOnClick: false,
                HTMLAttributes: linkOpenInNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {}
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        Typography,
        CharacterCount.configure({
            limit: maxLength
        })
    ]

    if (placeholder) {
        exts.push(Placeholder.configure({ placeholder }))
    }

    if (extra.length > 0) {
        exts.push(...extra)
    }

    return exts
}
