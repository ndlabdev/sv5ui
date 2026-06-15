import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { AnyExtension, Editor as TiptapEditor } from '@tiptap/core'
import type { EditorVariantProps, EditorSlots } from './editor.variants.js'

// ============================================================================
// Output / content shape
// ============================================================================

/**
 * Tiptap's structural JSON document. Re-exported so consumers don't need a
 * direct `@tiptap/core` dependency just to type their state.
 */
export interface EditorJSON {
    type: string
    attrs?: Record<string, unknown>
    content?: EditorJSON[]
    marks?: { type: string; attrs?: Record<string, unknown> }[]
    text?: string
}

/**
 * Serialization format for the bindable `value`.
 * - `'html'` — string of HTML (e.g. `<p><strong>Hi</strong></p>`)
 * - `'json'` — Tiptap structured document
 * - `'markdown'` — Markdown string (via `tiptap-markdown` extension)
 */
export type EditorOutput = 'html' | 'json' | 'markdown'

// ============================================================================
// Mention types
// ============================================================================

/**
 * Item shown in the mention suggestion popup. The `id` is what gets stored
 * (e.g. user id); `label` is the visible name displayed inline.
 */
export interface MentionItem {
    id: string
    label: string
    /** Optional avatar URL or icon name for the suggestion item. */
    avatar?: string
    /** Free-form metadata available in `attrs.data`. */
    data?: Record<string, unknown>
}

// ============================================================================
// Slash command types
// ============================================================================

/**
 * A single command that appears in the slash menu (triggered by typing `/`).
 *
 * @example
 * ```ts
 * const heading1: SlashCommand = {
 *   id: 'h1',
 *   label: 'Heading 1',
 *   description: 'Big section heading',
 *   icon: 'lucide:heading-1',
 *   keywords: ['h1', 'header', 'title'],
 *   run: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run()
 * }
 * ```
 */
export interface SlashCommand {
    /** Unique key for this command. */
    id: string
    /** Display name in the suggestion popup. */
    label: string
    /** Optional second-line subtitle. */
    description?: string
    /** Iconify icon name. */
    icon?: string
    /** Extra terms used for fuzzy matching. */
    keywords?: string[]
    /**
     * Invoked when the user picks this item. Receives the editor instance —
     * use Tiptap chains to mutate content. Trigger range is auto-removed
     * before this fires.
     */
    run: (props: { editor: TiptapEditor }) => void
}

// ============================================================================
// Toolbar action types
// ============================================================================

/**
 * Built-in toolbar action ids. Use these in the `toolbar` prop to pick
 * which buttons appear and in what order. Use `'|'` for vertical separators.
 *
 * @example
 * ```svelte
 * <Editor toolbar={['bold', 'italic', '|', 'h1', 'h2', '|', 'link']} />
 * ```
 */
export type ToolbarAction =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'paragraph'
    | 'bulletList'
    | 'orderedList'
    | 'blockquote'
    | 'codeBlock'
    | 'horizontalRule'
    | 'link'
    | 'unlink'
    | 'alignLeft'
    | 'alignCenter'
    | 'alignRight'
    | 'alignJustify'
    | 'undo'
    | 'redo'
    | 'clearFormatting'
    | 'image'
    | 'table'
    | 'youtube'

/** Vertical divider between toolbar groups. */
export type ToolbarSeparator = '|'

/**
 * Toolbar configuration.
 * - `true` — show the default toolbar (most common actions)
 * - `false` — hide the toolbar entirely (useful when only `bubbleMenu` is needed)
 * - `(ToolbarAction | '|')[]` — explicit ordered list of actions and separators
 */
export type ToolbarConfig = boolean | (ToolbarAction | ToolbarSeparator)[]

// ============================================================================
// Reactive state mirror
// ============================================================================

/**
 * Snapshot of editor state, kept in sync with Tiptap's internal state via
 * reactive runes. Safe to read inside `$derived` / template — re-evaluates
 * on every selection / transaction.
 */
export interface EditorReactiveState {
    /**
     * Which marks / nodes / alignments are active at the current selection.
     * Actions without a meaningful "active" state (e.g. `horizontalRule`,
     * `clearFormatting`, `unlink`, `undo`, `redo`) are omitted.
     */
    active: Partial<Record<ToolbarAction, boolean>>
    /** Whether each command is currently runnable. */
    can: { undo: boolean; redo: boolean }
    /** Total character count (from `@tiptap/extension-character-count`). */
    charCount: number
    /** Total word count. */
    wordCount: number
    /** Whether the document is currently empty (no meaningful content). */
    isEmpty: boolean
    /** Whether the editor currently has focus. */
    isFocused: boolean
}

// ============================================================================
// Imperative API
// ============================================================================

/**
 * Imperative API exposed via `bind:api`. Lets a parent component drive the
 * editor (focus, run commands, set content) without re-implementing Tiptap
 * command chains.
 *
 * @example
 * ```svelte
 * <script>
 *   let api = $state<EditorApi>()
 * </script>
 *
 * <Editor bind:api bind:value />
 * <Button onclick={() => api?.run('bold')}>Toggle bold</Button>
 * <Button onclick={() => api?.clear()}>Clear</Button>
 * ```
 */
export interface EditorApi {
    /** The underlying Tiptap editor instance — `null` until mounted client-side. */
    readonly editor: TiptapEditor | null
    /** Reactive snapshot of editor state. Re-reads automatically. */
    readonly state: EditorReactiveState
    /** Focus the editor. Optional positioning: `'start'`, `'end'`, or a numeric position. */
    focus: (position?: 'start' | 'end' | number) => void
    /** Run a built-in toolbar action by id (bypasses any disabled state). */
    run: (action: ToolbarAction) => void
    /** Serialize current content. Format defaults to the component's `output` prop. */
    getValue: (format?: EditorOutput) => string | EditorJSON
    /** Replace content programmatically. Does NOT fire `onValueChange`. */
    setValue: (value: string | EditorJSON) => void
    /** Empty the document. */
    clear: () => void
    /** Insert content at the current selection. */
    insert: (content: string | EditorJSON) => void
}

// ============================================================================
// Component props
// ============================================================================

/**
 * Props for the Editor component (sub-export `sv5ui/editor`).
 *
 * Rich-text WYSIWYG editor built on Tiptap v3 + ProseMirror. Renders a
 * toolbar (configurable or hidden) and a content area. Bindable `value` in
 * HTML or JSON format. Imperative control via `bind:api`.
 *
 * @remarks
 * Extension config props (`image`, `tables`, `youtube`, `dragHandle`,
 * `bubbleMenu`, `headingLevels`, `placeholder`, `maxLength`, `autolink`,
 * `linkOpenInNewTab`, `mentionTrigger`, `slash`, `slashTrigger`, `extensions`,
 * `extensionsOverride`, `output`) are read once at mount. Changing them
 * after mount does NOT rebuild the editor. To switch configurations, key
 * the `<Editor>` on the relevant prop so Svelte recreates it.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Editor } from 'sv5ui/editor'
 *   let content = $state('<p>Start writing…</p>')
 * </script>
 *
 * <Editor bind:value={content} placeholder="Write something…" />
 * ```
 */
export interface EditorProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'class' | 'autofocus' | 'id'
> {
    /** Bindable reference to the root DOM element. */
    ref?: HTMLElement | null
    /** Bindable imperative controller. */
    api?: EditorApi

    /**
     * `id` applied to the inner contenteditable element so an enclosing
     * `<FormField>` label can target it via `for=`. When inside a FormField,
     * this defaults to the FormField's `ariaId` automatically.
     */
    id?: string

    /**
     * Form field name. When inside a `<FormField>`, defaults to the
     * FormField's `name`.
     */
    name?: string

    // ------------------------------------------------------------------------
    // Content
    // ------------------------------------------------------------------------

    /**
     * Bindable content. The runtime type depends on `output`:
     * - `output: 'html'` (default) → `string` of HTML
     * - `output: 'json'` → `EditorJSON` document
     *
     * Security: the serialized value is structurally validated by the editor
     * schema (unknown tags, attributes, and event handlers are dropped), but it
     * is NOT sanitizer-clean. It can still contain arbitrary image `src` values
     * (including `data:` URIs from pasted content). Sanitize the HTML output
     * (e.g. with DOMPurify) before rendering it as raw markup elsewhere.
     */
    value?: string | EditorJSON

    /**
     * Serialization format used for `value` and `onValueChange`.
     *
     * Read once when the editor mounts (it also decides whether the Markdown
     * extension is loaded). Changing it on an existing editor has no effect —
     * re-key the component (e.g. `{#key output}`) to switch formats.
     * @default 'html'
     */
    output?: EditorOutput

    /**
     * Allow raw HTML inside Markdown input/output. Off by default — raw HTML
     * is escaped on serialize and stripped on parse. Turn on only when you
     * trust the source and your downstream renderer sanitizes HTML.
     *
     * Only applies when `output: 'markdown'`.
     * @default false
     */
    markdownAllowHtml?: boolean

    /** Placeholder shown when the editor is empty. */
    placeholder?: string

    /** Fired on content change. Receives the serialized value. */
    onValueChange?: (value: string | EditorJSON) => void
    /** Fired when the editor gains focus. */
    onFocus?: () => void
    /** Fired when the editor loses focus. */
    onBlur?: () => void

    // ------------------------------------------------------------------------
    // Editability
    // ------------------------------------------------------------------------

    /** Render content but disable editing. @default false */
    readonly?: boolean
    /** Visually disable and prevent editing. @default false */
    disabled?: boolean
    /** Focus the editor on mount. Pass position to control caret placement. @default false */
    autofocus?: boolean | 'start' | 'end' | number

    // ------------------------------------------------------------------------
    // Limits
    // ------------------------------------------------------------------------

    /** Hard cap on character count (enforced via `@tiptap/extension-character-count`). */
    maxLength?: number
    /** Show character/word counter in the footer. @default false */
    showCount?: boolean

    // ------------------------------------------------------------------------
    // Toolbar
    // ------------------------------------------------------------------------

    /**
     * Toolbar config. Pass `true` for default, `false` to hide, or an array
     * of action ids + `'|'` separators for explicit control.
     * @default true
     */
    toolbar?: ToolbarConfig

    /** Stick the toolbar to the top of the editor on scroll. @default false */
    stickyToolbar?: boolean

    /** Show a floating bubble menu on text selection. @default false */
    bubbleMenu?: boolean

    // ------------------------------------------------------------------------
    // Headings & link config
    // ------------------------------------------------------------------------

    /** Which heading levels to support. @default [1, 2, 3] */
    headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
    /** Auto-detect URLs as you type. @default true */
    autolink?: boolean
    /** Open links in new tab in readonly mode. @default true */
    linkOpenInNewTab?: boolean

    // ------------------------------------------------------------------------
    // Media (Phase 2)
    // ------------------------------------------------------------------------

    /**
     * Enable image insertion. Adds the `image` toolbar action (opens a file
     * picker). Also accepts pasted/dropped image files when `onImageUpload`
     * is provided.
     * @default false
     */
    image?: boolean

    /**
     * Async upload handler. Called with the selected/pasted/dropped file;
     * must return the resolved URL to insert as `<img src=...>`. When
     * omitted and `image` is `true`, images can only be inserted via URL
     * prompt (toolbar).
     *
     * The returned URL is validated before insertion: relative URLs,
     * `http(s)`, and raster `data:image/*` URIs are allowed; `javascript:`,
     * `data:text/*`, and `data:image/svg+xml` are rejected (the image is not
     * inserted and a warning is logged).
     */
    onImageUpload?: (file: File) => Promise<string>

    /**
     * Called when `onImageUpload` rejects. When omitted, the error is logged to
     * the console. Use this to surface upload failures to the user.
     */
    onImageUploadError?: (error: unknown) => void

    // ------------------------------------------------------------------------
    // Tables (Phase 2)
    // ------------------------------------------------------------------------

    /**
     * Enable tables. Adds the `table` toolbar action which opens a
     * dimension picker (rows × columns) and inserts a new table.
     * @default false
     */
    tables?: boolean

    // ------------------------------------------------------------------------
    // Slash commands (Phase 3)
    // ------------------------------------------------------------------------

    /**
     * Enable slash commands. Typing `/` (or `slashTrigger`) opens a command
     * palette with built-in actions (headings, lists, blockquote, code block,
     * horizontal rule, plus image/table/youtube if their respective flags are
     * enabled). Extend or replace via `slashCommands`.
     * @default false
     */
    slash?: boolean

    /**
     * Customize the slash command list. When provided, replaces the default
     * commands entirely. Use spread + `buildDefaultSlashCommands(opts)` to
     * extend rather than replace.
     */
    slashCommands?: SlashCommand[]

    /**
     * Trigger character for the slash menu.
     * @default '/'
     */
    slashTrigger?: string

    // ------------------------------------------------------------------------
    // Embeds (Phase 3)
    // ------------------------------------------------------------------------

    /**
     * Enable YouTube video embeds. Adds a `youtube` toolbar action that
     * prompts for a video URL and inserts a responsive embed.
     * @default false
     */
    youtube?: boolean

    // ------------------------------------------------------------------------
    // Drag handle (Phase 3)
    // ------------------------------------------------------------------------

    /**
     * Show a drag handle on the left side of each block when hovered. Lets
     * users reorder paragraphs, headings, lists, tables, etc. by drag-and-drop.
     * @default false
     */
    dragHandle?: boolean

    // ------------------------------------------------------------------------
    // Mentions (Phase 2)
    // ------------------------------------------------------------------------

    /**
     * Async lookup for `@`-style mentions. When provided, typing `@` opens
     * a suggestion popup. Receives the current query string after `@`;
     * must return matching items.
     */
    onMention?: (query: string) => Promise<MentionItem[]>

    /**
     * Trigger character for the suggestion popup.
     * @default '@'
     */
    mentionTrigger?: string

    // ------------------------------------------------------------------------
    // Extension escape hatches
    // ------------------------------------------------------------------------

    /**
     * Append custom Tiptap extensions on top of the built-in set. Use this to
     * add features beyond the defaults (e.g. images, tables, mentions).
     */
    extensions?: AnyExtension[]

    /**
     * Replace the entire extension array. When provided, `headingLevels`,
     * `autolink`, `placeholder`, etc. are ignored — bring your own
     * configuration.
     */
    extensionsOverride?: AnyExtension[]

    // ------------------------------------------------------------------------
    // Visual
    // ------------------------------------------------------------------------

    /** @default 'md' */
    size?: NonNullable<EditorVariantProps['size']>
    /** Focus ring color. @default 'primary' */
    color?: NonNullable<EditorVariantProps['color']>

    // ------------------------------------------------------------------------
    // Styling
    // ------------------------------------------------------------------------

    class?: ClassNameValue
    ui?: Partial<Record<EditorSlots, ClassNameValue>>

    // ------------------------------------------------------------------------
    // Snippets
    // ------------------------------------------------------------------------

    /**
     * Replace the entire toolbar. Receives reactive state + api for full
     * control over button rendering and command dispatch.
     */
    toolbarSlot?: Snippet<[{ state: EditorReactiveState; api: EditorApi }]>

    /**
     * Replace bubble menu content. Only rendered when `bubbleMenu={true}`.
     * Receives reactive state + api.
     */
    bubbleMenuSlot?: Snippet<[{ state: EditorReactiveState; api: EditorApi }]>

    /** Custom content rendered between the toolbar and the content area. */
    header?: Snippet

    /** Custom content rendered below the content area (overrides the count footer). */
    footer?: Snippet
}
