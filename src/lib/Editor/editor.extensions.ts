import type { AnyExtension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import Youtube from '@tiptap/extension-youtube'
import { DragHandle } from '@tiptap/extension-drag-handle'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { SlashCommand } from './editor.types.js'
import { buildSlashExtension } from './editor.slash.svelte.js'

interface BuildExtensionsOptions {
    headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
    placeholder?: string
    autolink?: boolean
    linkOpenInNewTab?: boolean
    maxLength?: number
    image?: boolean
    tables?: boolean
    markdown?: boolean
    markdownAllowHtml?: boolean
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

async function buildTableExts(): Promise<AnyExtension[]> {
    const [{ Table }, { TableRow }, { TableCell }, { TableHeader }] = await Promise.all([
        import('@tiptap/extension-table'),
        import('@tiptap/extension-table-row'),
        import('@tiptap/extension-table-cell'),
        import('@tiptap/extension-table-header')
    ])
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

async function buildMarkdownExt(allowHtml: boolean): Promise<AnyExtension> {
    const { Markdown } = await import('tiptap-markdown')
    return Markdown.configure({
        html: allowHtml,
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

const GRIP_VERTICAL_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>'

function buildDragHandleExt(): AnyExtension {
    return DragHandle.configure({
        render() {
            const handle = document.createElement('div')
            handle.setAttribute('data-editor-drag-handle', '')
            handle.setAttribute('aria-label', 'Drag to reorder')
            handle.className = [
                'inline-flex size-6 items-center justify-center',
                'rounded text-on-surface-variant/70',
                'hover:bg-surface-container-high hover:text-on-surface',
                'cursor-grab active:cursor-grabbing select-none transition-colors'
            ].join(' ')
            handle.innerHTML = GRIP_VERTICAL_SVG
            return handle
        }
    })
}

type OptionalBuilderResult = AnyExtension | AnyExtension[] | Promise<AnyExtension | AnyExtension[]>
type OptionalBuilder = (o: BuildExtensionsOptions) => OptionalBuilderResult | null

const OPTIONAL_BUILDERS: OptionalBuilder[] = [
    (o) => (o.placeholder ? Placeholder.configure({ placeholder: o.placeholder }) : null),
    (o) => (o.image ? buildImageExt() : null),
    (o) => (o.tables ? buildTableExts() : null),
    (o) => (o.youtube ? buildYoutubeExt() : null),
    (o) => (o.markdown ? buildMarkdownExt(o.markdownAllowHtml ?? false) : null),
    (o) =>
        o.mentionSuggestion ? buildMentionExt(o.mentionSuggestion, o.mentionTrigger ?? '@') : null,
    (o) =>
        o.slashCommands && o.slashCommands.length > 0
            ? buildSlashExtension(o.slashCommands, o.slashTrigger ?? '/')
            : null,
    (o) => (o.dragHandle ? buildDragHandleExt() : null)
]

function collectOptionalExts(
    options: BuildExtensionsOptions
): AnyExtension[] | Promise<AnyExtension[]> {
    const sync: AnyExtension[] = []
    const lazy: Promise<AnyExtension | AnyExtension[]>[] = []
    for (const build of OPTIONAL_BUILDERS) {
        const result = build(options)
        if (result === null || result === undefined) continue
        if (result instanceof Promise) lazy.push(result)
        else if (Array.isArray(result)) sync.push(...result)
        else sync.push(result)
    }
    if (lazy.length === 0) return sync
    return Promise.all(lazy).then((resolved) => [...sync, ...resolved.flat()])
}

export function buildExtensions(
    options: BuildExtensionsOptions = {}
): AnyExtension[] | Promise<AnyExtension[]> {
    const optional = collectOptionalExts(options)
    if (optional instanceof Promise) {
        return optional.then((opt) => [...buildCore(options), ...opt, ...(options.extra ?? [])])
    }
    return [...buildCore(options), ...optional, ...(options.extra ?? [])]
}
