import { Extension } from '@tiptap/core'
import type { Editor, Range } from '@tiptap/core'
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion'
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom'
import type { SlashCommand } from './editor.types.js'

interface SlashCommandsContext {
    image?: boolean
    tables?: boolean
    youtube?: boolean
}

/**
 * Returns the built-in slash command list, optionally including media
 * commands based on which features are enabled in the host Editor.
 */
export function buildDefaultSlashCommands(ctx: SlashCommandsContext = {}): SlashCommand[] {
    const commands: SlashCommand[] = [
        {
            id: 'paragraph',
            label: 'Text',
            description: 'Plain paragraph',
            icon: 'lucide:pilcrow',
            keywords: ['p', 'text', 'paragraph'],
            run: ({ editor }) => editor.chain().focus().setParagraph().run()
        },
        {
            id: 'h1',
            label: 'Heading 1',
            description: 'Large section heading',
            icon: 'lucide:heading-1',
            keywords: ['h1', 'header', 'title'],
            run: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run()
        },
        {
            id: 'h2',
            label: 'Heading 2',
            description: 'Medium section heading',
            icon: 'lucide:heading-2',
            keywords: ['h2', 'subtitle'],
            run: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
        {
            id: 'h3',
            label: 'Heading 3',
            description: 'Small section heading',
            icon: 'lucide:heading-3',
            keywords: ['h3'],
            run: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run()
        },
        {
            id: 'bulletList',
            label: 'Bullet list',
            description: 'Unordered list',
            icon: 'lucide:list',
            keywords: ['ul', 'bullet', 'list'],
            run: ({ editor }) => editor.chain().focus().toggleBulletList().run()
        },
        {
            id: 'orderedList',
            label: 'Numbered list',
            description: 'Ordered list',
            icon: 'lucide:list-ordered',
            keywords: ['ol', 'numbered', 'ordered'],
            run: ({ editor }) => editor.chain().focus().toggleOrderedList().run()
        },
        {
            id: 'blockquote',
            label: 'Quote',
            description: 'Highlight a passage',
            icon: 'lucide:quote',
            keywords: ['quote', 'blockquote'],
            run: ({ editor }) => editor.chain().focus().toggleBlockquote().run()
        },
        {
            id: 'codeBlock',
            label: 'Code block',
            description: 'Fenced code with syntax highlighting',
            icon: 'lucide:square-code',
            keywords: ['code', 'pre', 'fence'],
            run: ({ editor }) => editor.chain().focus().toggleCodeBlock().run()
        },
        {
            id: 'horizontalRule',
            label: 'Divider',
            description: 'Horizontal rule',
            icon: 'lucide:minus',
            keywords: ['hr', 'divider', 'rule', 'separator'],
            run: ({ editor }) => editor.chain().focus().setHorizontalRule().run()
        }
    ]

    if (ctx.image) {
        commands.push({
            id: 'image',
            label: 'Image',
            description: 'Insert an image from URL',
            icon: 'lucide:image',
            keywords: ['image', 'picture', 'photo'],
            run: ({ editor }) => {
                if (typeof window === 'undefined') return
                const url = window.prompt('Image URL', 'https://')
                if (!url) return
                editor.chain().focus().setImage({ src: url }).run()
            }
        })
    }

    if (ctx.tables) {
        commands.push({
            id: 'table',
            label: 'Table',
            description: 'Insert a 3×3 table',
            icon: 'lucide:table',
            keywords: ['table', 'grid'],
            run: ({ editor }) =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        })
    }

    if (ctx.youtube) {
        commands.push({
            id: 'youtube',
            label: 'YouTube',
            description: 'Embed a YouTube video',
            icon: 'lucide:youtube',
            keywords: ['youtube', 'video', 'embed'],
            run: ({ editor }) => {
                if (typeof window === 'undefined') return
                const url = window.prompt('YouTube URL', 'https://youtu.be/')
                if (!url) return
                editor.commands.setYoutubeVideo({ src: url })
            }
        })
    }

    return commands
}

// ----------------------------------------------------------------------------
// Suggestion popup (vanilla DOM + Floating UI) for the slash menu.
// ----------------------------------------------------------------------------

interface SlashState {
    items: SlashCommand[]
    selectedIndex: number
    popupEl: HTMLElement
    listEl: HTMLElement
    cleanup: (() => void) | null
    pick: (i: number) => void
}

function createPopup(): HTMLElement {
    const popup = document.createElement('div')
    popup.setAttribute('data-editor-slash-popup', '')
    popup.className = [
        'absolute z-50 min-w-64 max-w-80 overflow-hidden',
        'rounded-lg border border-outline-variant bg-surface shadow-lg',
        'py-1 max-h-72 overflow-y-auto'
    ].join(' ')
    return popup
}

function renderItems(state: SlashState): void {
    state.listEl.innerHTML = ''
    if (state.items.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'px-3 py-2 text-sm text-on-surface-variant'
        empty.textContent = 'No matches'
        state.listEl.appendChild(empty)
        return
    }
    let activeRow: HTMLButtonElement | null = null
    state.items.forEach((cmd, i) => {
        const row = document.createElement('button')
        row.type = 'button'
        row.setAttribute('data-slash-item', '')
        row.setAttribute('data-id', cmd.id)
        row.setAttribute('data-index', String(i))
        const isActive = i === state.selectedIndex
        if (isActive) activeRow = row
        row.className = [
            'flex w-full items-start gap-3 px-3 py-2 text-start',
            'hover:bg-surface-container-high',
            isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface'
        ].join(' ')

        if (cmd.icon) {
            const iconWrap = document.createElement('span')
            iconWrap.className =
                'flex size-7 shrink-0 items-center justify-center rounded border border-outline-variant'
            const icon = document.createElement('iconify-icon')
            icon.setAttribute('icon', cmd.icon)
            icon.className = 'size-4'
            iconWrap.appendChild(icon)
            row.appendChild(iconWrap)
        }

        const textWrap = document.createElement('span')
        textWrap.className = 'flex flex-col min-w-0'
        const label = document.createElement('span')
        label.className = 'text-sm font-medium truncate'
        label.textContent = cmd.label
        textWrap.appendChild(label)
        if (cmd.description) {
            const desc = document.createElement('span')
            desc.className = 'text-xs text-on-surface-variant truncate'
            desc.textContent = cmd.description
            textWrap.appendChild(desc)
        }
        row.appendChild(textWrap)

        row.addEventListener('mousedown', (e) => {
            e.preventDefault()
            state.pick(i)
        })
        state.listEl.appendChild(row)
    })
    // Defer to next frame so DOM is laid out before measuring scroll position
    if (activeRow) {
        requestAnimationFrame(() => {
            ;(activeRow as HTMLElement | null)?.scrollIntoView({
                block: 'nearest',
                behavior: 'instant' as ScrollBehavior
            })
        })
    }
}

function fuzzyFilter(commands: SlashCommand[], query: string): SlashCommand[] {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((cmd) => {
        if (cmd.label.toLowerCase().includes(q)) return true
        if (cmd.description?.toLowerCase().includes(q)) return true
        if (cmd.keywords?.some((k) => k.toLowerCase().includes(q))) return true
        return cmd.id.toLowerCase().includes(q)
    })
}

function buildSuggestionRender() {
    let state: SlashState | null = null

    return {
        onStart: (props: {
            editor: Editor
            range: Range
            clientRect?: (() => DOMRect | null) | null
            items: SlashCommand[]
            command: (cmd: SlashCommand) => void
        }) => {
            if (typeof document === 'undefined') return
            const popupEl = createPopup()
            const listEl = document.createElement('div')
            listEl.setAttribute('role', 'listbox')
            popupEl.appendChild(listEl)
            document.body.appendChild(popupEl)

            state = {
                items: props.items,
                selectedIndex: 0,
                popupEl,
                listEl,
                cleanup: null,
                pick: (i: number) => {
                    const cmd = state?.items[i]
                    if (!cmd) return
                    props.command(cmd)
                }
            }
            renderItems(state)

            const rect = props.clientRect?.()
            if (rect) {
                const virtualEl = { getBoundingClientRect: () => rect as DOMRect }
                state.cleanup = autoUpdate(virtualEl, popupEl, () => {
                    void computePosition(virtualEl, popupEl, {
                        placement: 'bottom-start',
                        middleware: [offset(6), flip(), shift({ padding: 8 })]
                    }).then(({ x, y }: { x: number; y: number }) => {
                        popupEl.style.left = `${x}px`
                        popupEl.style.top = `${y}px`
                    })
                })
            }
        },

        onUpdate: (props: { items: SlashCommand[] }) => {
            if (!state) return
            state.items = props.items
            state.selectedIndex = 0
            renderItems(state)
        },

        onKeyDown: (props: { event: KeyboardEvent }) => {
            if (!state) return false
            const len = Math.max(state.items.length, 1)
            if (props.event.key === 'ArrowDown') {
                state.selectedIndex = (state.selectedIndex + 1) % len
                renderItems(state)
                return true
            }
            if (props.event.key === 'ArrowUp') {
                state.selectedIndex = (state.selectedIndex + len - 1) % len
                renderItems(state)
                return true
            }
            if (props.event.key === 'Enter') {
                state.pick(state.selectedIndex)
                return true
            }
            if (props.event.key === 'Escape') return true
            return false
        },

        onExit: () => {
            state?.cleanup?.()
            state?.popupEl.remove()
            state = null
        }
    }
}

// ----------------------------------------------------------------------------
// Tiptap extension
// ----------------------------------------------------------------------------

interface SlashExtensionOptions {
    // Tiptap's SuggestionOptions generics are awkward to fully type here;
    // we widen to allow our shape (items=SlashCommand[], render functions).
    suggestion: Partial<SuggestionOptions>
}

export const SlashCommandsExtension = Extension.create<SlashExtensionOptions>({
    name: 'slashCommands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                startOfLine: false,
                allowSpaces: false,
                command: ({ editor, range, props }) => {
                    editor.chain().focus().deleteRange(range).run()
                    ;(props as SlashCommand).run({ editor })
                }
            }
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion
            })
        ]
    }
})

export function buildSlashExtension(commands: SlashCommand[], trigger: string = '/'): Extension {
    return SlashCommandsExtension.configure({
        suggestion: {
            char: trigger,
            startOfLine: false,
            allowSpaces: false,
            items: ({ query }: { query: string }) => fuzzyFilter(commands, query),
            render: buildSuggestionRender as unknown as SuggestionOptions['render'],
            // Tiptap merges `suggestion` shallowly when an extension is .configure()'d,
            // so the command default in addOptions gets overwritten. Include it here.
            command: ({ editor, range, props }) => {
                editor.chain().focus().deleteRange(range).run()
                ;(props as SlashCommand).run({ editor })
            }
        }
    })
}
