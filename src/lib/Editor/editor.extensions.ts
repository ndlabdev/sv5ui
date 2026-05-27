import type { AnyExtension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Markdown } from 'tiptap-markdown'
import type { SuggestionOptions } from '@tiptap/suggestion'

interface BuildExtensionsOptions {
    headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
    placeholder?: string
    autolink?: boolean
    linkOpenInNewTab?: boolean
    maxLength?: number
    image?: boolean
    tables?: boolean
    markdown?: boolean
    mentionSuggestion?: Omit<SuggestionOptions, 'editor'>
    mentionTrigger?: string
    extra?: AnyExtension[]
}

function buildCore(options: BuildExtensionsOptions): AnyExtension[] {
    const { headingLevels = [1, 2, 3], autolink = true, linkOpenInNewTab = true, maxLength } = options
    return [
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
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Typography,
        CharacterCount.configure({ limit: maxLength })
    ]
}

function buildImageExt(): AnyExtension {
    return Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: 'sv5ui-editor-image' }
    })
}

function buildTableExts(): AnyExtension[] {
    return [
        Table.configure({
            resizable: true,
            HTMLAttributes: { class: 'sv5ui-editor-table' }
        }),
        TableRow,
        TableHeader,
        TableCell
    ]
}

function buildMarkdownExt(): AnyExtension {
    return Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: false
    })
}

function buildMentionExt(
    suggestion: Omit<SuggestionOptions, 'editor'>,
    trigger: string
): AnyExtension {
    return Mention.configure({
        HTMLAttributes: { class: 'sv5ui-editor-mention' },
        suggestion: { char: trigger, ...suggestion }
    })
}

function collectOptionalExts(options: BuildExtensionsOptions): AnyExtension[] {
    const acc: AnyExtension[] = []
    if (options.placeholder) acc.push(Placeholder.configure({ placeholder: options.placeholder }))
    if (options.image) acc.push(buildImageExt())
    if (options.tables) acc.push(...buildTableExts())
    if (options.markdown) acc.push(buildMarkdownExt())
    if (options.mentionSuggestion) {
        acc.push(buildMentionExt(options.mentionSuggestion, options.mentionTrigger ?? '@'))
    }
    return acc
}

export function buildExtensions(options: BuildExtensionsOptions = {}): AnyExtension[] {
    return [...buildCore(options), ...collectOptionalExts(options), ...(options.extra ?? [])]
}
