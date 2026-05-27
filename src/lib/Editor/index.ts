/**
 * SV5UI Editor — rich-text WYSIWYG built on Tiptap v3 + ProseMirror.
 *
 * ## Installation
 *
 * Tiptap is declared as an optional peer dependency of sv5ui, so consumers
 * who don't use `<Editor>` pay zero install/bundle cost. When you do use it,
 * install Tiptap alongside sv5ui:
 *
 * ```bash
 * pnpm add sv5ui \
 *   @tiptap/core @tiptap/pm @tiptap/starter-kit \
 *   @tiptap/extension-bubble-menu \
 *   @tiptap/extension-character-count \
 *   @tiptap/extension-drag-handle \
 *   @tiptap/extension-image \
 *   @tiptap/extension-mention \
 *   @tiptap/extension-placeholder \
 *   @tiptap/extension-table \
 *   @tiptap/extension-table-cell \
 *   @tiptap/extension-table-header \
 *   @tiptap/extension-table-row \
 *   @tiptap/extension-text-align \
 *   @tiptap/extension-typography \
 *   @tiptap/extension-youtube \
 *   @tiptap/suggestion \
 *   tiptap-markdown
 * ```
 *
 * (`npm add` / `yarn add` work equally well.)
 *
 * All 18 packages are required, even if you only enable a subset of
 * features. Editor imports every extension at module load so toggling
 * `image`, `tables`, `youtube`, etc. via props doesn't trigger a dynamic
 * import. Missing peers fail at runtime with module-resolution errors.
 *
 * ## Usage
 *
 * ```svelte
 * <script lang="ts">
 *   import { Editor, type EditorApi } from 'sv5ui/editor'
 *   let value = $state('<p>Hello</p>')
 *   let api = $state<EditorApi>()
 * </script>
 *
 * <Editor bind:value bind:api placeholder="Write something…" />
 * ```
 *
 * See {@link EditorProps} for every option.
 */

export { default as Editor } from './Editor.svelte'
export { buildDefaultSlashCommands } from './editor.slash.svelte.js'
export type {
    EditorProps,
    EditorApi,
    EditorJSON,
    EditorReactiveState,
    MentionItem,
    SlashCommand,
    ToolbarAction
} from './editor.types.js'
