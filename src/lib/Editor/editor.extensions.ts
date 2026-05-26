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
import Youtube from '@tiptap/extension-youtube'
import { DragHandle } from '@tiptap/extension-drag-handle'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { SlashCommand } from './editor.types.js'
import { buildSlashExtension } from './editor.slash.js'

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
    slashCommands?: SlashCommand[]
    slashTrigger?: string
    youtube?: boolean
    dragHandle?: boolean
    extra?: AnyExtension[]
}

function buildCore(options: BuildExtensionsOptions): AnyExtension[] {
    const {
        headingLevels = [1, 2, 3],
        autolink = true,
        linkOpenInNewTab = true,
        maxLength
    } = options
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

function buildYoutubeExt(): AnyExtension {
    return Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: 'sv5ui-editor-youtube' }
    })
}

function buildDragHandleExt(): AnyExtension {
    return DragHandle.configure({
        render() {
            const handle = document.createElement('div')
            handle.setAttribute('data-editor-drag-handle', '')
            handle.className = [
                'inline-flex size-5 items-center justify-center',
                'rounded text-on-surface-variant hover:bg-surface-container-high',
                'cursor-grab active:cursor-grabbing select-none'
            ].join(' ')
            handle.innerHTML =
                '<svg viewBox="0 0 16 16" fill="currentColor" class="size-3"><circle cx="5" cy="3.5" r="1.2"/><circle cx="11" cy="3.5" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/><circle cx="5" cy="12.5" r="1.2"/><circle cx="11" cy="12.5" r="1.2"/></svg>'
            return handle
        }
    })
}

type OptionalBuilder = (o: BuildExtensionsOptions) => AnyExtension | AnyExtension[] | null

const OPTIONAL_BUILDERS: OptionalBuilder[] = [
    (o) => (o.placeholder ? Placeholder.configure({ placeholder: o.placeholder }) : null),
    (o) => (o.image ? buildImageExt() : null),
    (o) => (o.tables ? buildTableExts() : null),
    (o) => (o.youtube ? buildYoutubeExt() : null),
    (o) => (o.markdown ? buildMarkdownExt() : null),
    (o) =>
        o.mentionSuggestion ? buildMentionExt(o.mentionSuggestion, o.mentionTrigger ?? '@') : null,
    (o) =>
        o.slashCommands && o.slashCommands.length > 0
            ? buildSlashExtension(o.slashCommands, o.slashTrigger ?? '/')
            : null,
    (o) => (o.dragHandle ? buildDragHandleExt() : null)
]

function collectOptionalExts(options: BuildExtensionsOptions): AnyExtension[] {
    const acc: AnyExtension[] = []
    for (const build of OPTIONAL_BUILDERS) {
        const result = build(options)
        if (result === null) continue
        if (Array.isArray(result)) acc.push(...result)
        else acc.push(result)
    }
    return acc
}

export function buildExtensions(options: BuildExtensionsOptions = {}): AnyExtension[] {
    return [...buildCore(options), ...collectOptionalExts(options), ...(options.extra ?? [])]
}
