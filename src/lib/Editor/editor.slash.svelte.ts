import { mount, unmount } from 'svelte'
import { Extension } from '@tiptap/core'
import type { Editor, Range } from '@tiptap/core'
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion'
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom'
import type { SlashCommand } from './editor.types.js'
import SlashPopup from './SlashPopup.svelte'

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
            run: ({ editor }) => {
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
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
// Suggestion popup — mounts the SlashPopup Svelte component imperatively
// (Tiptap's Suggestion render API expects DOM-level lifecycle hooks).
// ----------------------------------------------------------------------------

type MountedComponent = ReturnType<typeof mount>

interface PopupHandle {
    container: HTMLElement
    component: MountedComponent
    state: { items: SlashCommand[]; selectedIndex: number; onPick: (i: number) => void }
    cleanup: (() => void) | null
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
    let handle: PopupHandle | null = null

    return {
        onStart: (props: {
            editor: Editor
            range: Range
            clientRect?: (() => DOMRect | null) | null
            items: SlashCommand[]
            command: (cmd: SlashCommand) => void
        }) => {
            if (typeof document === 'undefined') return

            const container = document.createElement('div')
            container.setAttribute('data-editor-slash-container', '')
            container.style.cssText = 'position:absolute;top:0;left:0;z-index:50;'
            document.body.appendChild(container)

            const state = $state({
                items: props.items,
                selectedIndex: 0,
                onPick: (i: number) => {
                    const cmd = state.items[i]
                    if (!cmd) return
                    props.command(cmd)
                }
            })

            const component = mount(SlashPopup, {
                target: container,
                props: state
            })

            handle = { container, component, state, cleanup: null }

            const rect = props.clientRect?.()
            if (rect) {
                const virtualEl = { getBoundingClientRect: () => rect as DOMRect }
                handle.cleanup = autoUpdate(virtualEl, container, () => {
                    void computePosition(virtualEl, container, {
                        placement: 'bottom-start',
                        middleware: [offset(6), flip(), shift({ padding: 8 })]
                    }).then(({ x, y }: { x: number; y: number }) => {
                        container.style.left = `${x}px`
                        container.style.top = `${y}px`
                    })
                })
            }
        },

        onUpdate: (props: { items: SlashCommand[] }) => {
            if (!handle) return
            handle.state.items = props.items
            handle.state.selectedIndex = 0
        },

        onKeyDown: (props: { event: KeyboardEvent }) => {
            if (!handle) return false
            const len = Math.max(handle.state.items.length, 1)
            if (props.event.key === 'ArrowDown') {
                handle.state.selectedIndex = (handle.state.selectedIndex + 1) % len
                return true
            }
            if (props.event.key === 'ArrowUp') {
                handle.state.selectedIndex = (handle.state.selectedIndex + len - 1) % len
                return true
            }
            if (props.event.key === 'Enter') {
                handle.state.onPick(handle.state.selectedIndex)
                return true
            }
            if (props.event.key === 'Escape') return true
            return false
        },

        onExit: () => {
            if (!handle) return
            handle.cleanup?.()
            unmount(handle.component)
            handle.container.remove()
            handle = null
        }
    }
}

// ----------------------------------------------------------------------------
// Tiptap extension
// ----------------------------------------------------------------------------

interface SlashExtensionOptions {
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
