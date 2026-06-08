import type { Editor } from '@tiptap/core'
import type { EditorReactiveState, ToolbarAction } from './editor.types.js'

export interface ToolbarActionDef {
    icon: string
    label: string
    isActive?: (state: EditorReactiveState) => boolean | undefined
    isDisabled?: (state: EditorReactiveState) => boolean | undefined
    run: (editor: Editor) => void
}

function promptForLink(editor: Editor): void {
    const previous = (editor.getAttributes('link').href as string | undefined) ?? 'https://'
    const url = typeof window === 'undefined' ? null : window.prompt('URL', previous)
    if (url === null) return
    if (url.trim() === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

export const TOOLBAR_ACTIONS: Record<ToolbarAction, ToolbarActionDef> = {
    bold: {
        icon: 'lucide:bold',
        label: 'Bold',
        isActive: (s) => s.active.bold,
        run: (ed) => ed.chain().focus().toggleBold().run()
    },
    italic: {
        icon: 'lucide:italic',
        label: 'Italic',
        isActive: (s) => s.active.italic,
        run: (ed) => ed.chain().focus().toggleItalic().run()
    },
    underline: {
        icon: 'lucide:underline',
        label: 'Underline',
        isActive: (s) => s.active.underline,
        run: (ed) => ed.chain().focus().toggleUnderline().run()
    },
    strike: {
        icon: 'lucide:strikethrough',
        label: 'Strikethrough',
        isActive: (s) => s.active.strike,
        run: (ed) => ed.chain().focus().toggleStrike().run()
    },
    code: {
        icon: 'lucide:code',
        label: 'Inline code',
        isActive: (s) => s.active.code,
        run: (ed) => ed.chain().focus().toggleCode().run()
    },
    h1: {
        icon: 'lucide:heading-1',
        label: 'Heading 1',
        isActive: (s) => s.active.h1,
        run: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run()
    },
    h2: {
        icon: 'lucide:heading-2',
        label: 'Heading 2',
        isActive: (s) => s.active.h2,
        run: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run()
    },
    h3: {
        icon: 'lucide:heading-3',
        label: 'Heading 3',
        isActive: (s) => s.active.h3,
        run: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run()
    },
    paragraph: {
        icon: 'lucide:pilcrow',
        label: 'Paragraph',
        isActive: (s) => s.active.paragraph,
        run: (ed) => ed.chain().focus().setParagraph().run()
    },
    bulletList: {
        icon: 'lucide:list',
        label: 'Bullet list',
        isActive: (s) => s.active.bulletList,
        run: (ed) => ed.chain().focus().toggleBulletList().run()
    },
    orderedList: {
        icon: 'lucide:list-ordered',
        label: 'Numbered list',
        isActive: (s) => s.active.orderedList,
        run: (ed) => ed.chain().focus().toggleOrderedList().run()
    },
    blockquote: {
        icon: 'lucide:quote',
        label: 'Quote',
        isActive: (s) => s.active.blockquote,
        run: (ed) => ed.chain().focus().toggleBlockquote().run()
    },
    codeBlock: {
        icon: 'lucide:square-code',
        label: 'Code block',
        isActive: (s) => s.active.codeBlock,
        run: (ed) => ed.chain().focus().toggleCodeBlock().run()
    },
    horizontalRule: {
        icon: 'lucide:minus',
        label: 'Horizontal rule',
        run: (ed) => ed.chain().focus().setHorizontalRule().run()
    },
    link: {
        icon: 'lucide:link',
        label: 'Insert link',
        isActive: (s) => s.active.link,
        run: promptForLink
    },
    unlink: {
        icon: 'lucide:unlink',
        label: 'Remove link',
        isDisabled: (s) => !s.active.link,
        run: (ed) => ed.chain().focus().unsetLink().run()
    },
    alignLeft: {
        icon: 'lucide:align-left',
        label: 'Align left',
        isActive: (s) => s.active.alignLeft,
        run: (ed) => ed.chain().focus().setTextAlign('left').run()
    },
    alignCenter: {
        icon: 'lucide:align-center',
        label: 'Align center',
        isActive: (s) => s.active.alignCenter,
        run: (ed) => ed.chain().focus().setTextAlign('center').run()
    },
    alignRight: {
        icon: 'lucide:align-right',
        label: 'Align right',
        isActive: (s) => s.active.alignRight,
        run: (ed) => ed.chain().focus().setTextAlign('right').run()
    },
    alignJustify: {
        icon: 'lucide:align-justify',
        label: 'Align justify',
        isActive: (s) => s.active.alignJustify,
        run: (ed) => ed.chain().focus().setTextAlign('justify').run()
    },
    undo: {
        icon: 'lucide:undo-2',
        label: 'Undo',
        isDisabled: (s) => !s.can.undo,
        run: (ed) => ed.chain().focus().undo().run()
    },
    redo: {
        icon: 'lucide:redo-2',
        label: 'Redo',
        isDisabled: (s) => !s.can.redo,
        run: (ed) => ed.chain().focus().redo().run()
    },
    clearFormatting: {
        icon: 'lucide:remove-formatting',
        label: 'Clear formatting',
        run: (ed) => ed.chain().focus().unsetAllMarks().clearNodes().run()
    },
    image: {
        icon: 'lucide:image',
        label: 'Insert image',
        run: (ed) => {
            if (typeof window === 'undefined') return
            const url = window.prompt('Image URL', 'https://')
            if (!url) return
            ed.chain().focus().setImage({ src: url }).run()
        }
    },
    table: {
        icon: 'lucide:table',
        label: 'Insert table',
        run: (ed) => {
            ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
    },
    youtube: {
        icon: 'lucide:youtube',
        label: 'Insert YouTube video',
        run: (ed) => {
            if (typeof window === 'undefined') return
            const url = window.prompt('YouTube URL', 'https://youtu.be/')
            if (!url) return
            ed.commands.setYoutubeVideo({ src: url })
        }
    }
}

export const DEFAULT_TOOLBAR: (ToolbarAction | '|')[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    '|',
    'h1',
    'h2',
    'h3',
    '|',
    'bulletList',
    'orderedList',
    'blockquote',
    'codeBlock',
    '|',
    'link',
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    '|',
    'undo',
    'redo'
]
