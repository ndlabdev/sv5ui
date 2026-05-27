<script lang="ts" module>
    import type { EditorProps } from './editor.types.js'

    export type Props = EditorProps
</script>

<script lang="ts">
    import { Editor } from '@tiptap/core'
    import BubbleMenuExt from '@tiptap/extension-bubble-menu'
    import { untrack } from 'svelte'
    import { editorVariants, editorDefaults } from './editor.variants.js'
    import { getComponentConfig } from '../config.js'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField.svelte.js'
    import { TOOLBAR_ACTIONS, DEFAULT_TOOLBAR, type ToolbarActionDef } from './editor.toolbar.js'
    import { buildExtensions } from './editor.extensions.js'
    import { buildMentionSuggestion } from './editor.suggestion.js'
    import { buildDefaultSlashCommands } from './editor.slash.svelte.js'
    import type {
        EditorApi,
        EditorJSON,
        EditorReactiveState,
        ToolbarAction
    } from './editor.types.js'
    import Icon from '../Icon/Icon.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'
    import EditorUrlPrompt from './EditorUrlPrompt.svelte'
    import { httpUrlSchema, youtubeUrlSchema, type UrlSchema } from './editor.schemas.js'

    const config = getComponentConfig('editor', editorDefaults)

    let {
        ref = $bindable(null),
        api = $bindable(),
        value = $bindable(),
        output = 'html',
        placeholder,
        id,
        name,
        onValueChange,
        onFocus,
        onBlur,
        readonly = false,
        disabled = false,
        autofocus = false,
        maxLength,
        showCount = false,
        toolbar = true,
        stickyToolbar = false,
        bubbleMenu = false,
        headingLevels = [1, 2, 3],
        autolink = true,
        linkOpenInNewTab = true,
        markdownAllowHtml = false,
        image = false,
        onImageUpload,
        tables = false,
        onMention,
        mentionTrigger = '@',
        slash = false,
        slashCommands,
        slashTrigger = '/',
        youtube = false,
        dragHandle = false,
        extensions: extraExtensions,
        extensionsOverride,
        size = config.defaultVariants.size ?? 'md',
        color = config.defaultVariants.color ?? 'primary',
        class: className,
        ui,
        toolbarSlot,
        bubbleMenuSlot,
        header,
        footer,
        ...restProps
    }: Props = $props()

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    let contentElement: HTMLDivElement | null = $state(null)
    let bubbleElement: HTMLDivElement | null = $state(null)
    let editor: Editor | null = $state(null)

    let editorState = $state<EditorReactiveState>({
        active: {},
        can: { undo: false, redo: false },
        charCount: 0,
        wordCount: 0,
        isEmpty: true,
        isFocused: false
    })

    function syncState(ed: Editor): void {
        const cc = ed.storage.characterCount
        const can = ed.can()
        editorState = {
            active: {
                bold: ed.isActive('bold'),
                italic: ed.isActive('italic'),
                underline: ed.isActive('underline'),
                strike: ed.isActive('strike'),
                code: ed.isActive('code'),
                h1: ed.isActive('heading', { level: 1 }),
                h2: ed.isActive('heading', { level: 2 }),
                h3: ed.isActive('heading', { level: 3 }),
                paragraph: ed.isActive('paragraph'),
                bulletList: ed.isActive('bulletList'),
                orderedList: ed.isActive('orderedList'),
                blockquote: ed.isActive('blockquote'),
                codeBlock: ed.isActive('codeBlock'),
                link: ed.isActive('link'),
                alignLeft: ed.isActive({ textAlign: 'left' }),
                alignCenter: ed.isActive({ textAlign: 'center' }),
                alignRight: ed.isActive({ textAlign: 'right' }),
                alignJustify: ed.isActive({ textAlign: 'justify' }),
                image: ed.isActive('image'),
                table: ed.isActive('table'),
                youtube: ed.isActive('youtube')
            },
            can: {
                undo: can.undo(),
                redo: can.redo()
            },
            charCount: typeof cc?.characters === 'function' ? cc.characters() : 0,
            wordCount: typeof cc?.words === 'function' ? cc.words() : 0,
            isEmpty: ed.isEmpty,
            isFocused: ed.isFocused
        }
    }

    function serialize(ed: Editor): string | EditorJSON {
        if (output === 'json') return ed.getJSON() as EditorJSON
        if (output === 'markdown') {
            const md = (ed.storage as unknown as Record<string, unknown>).markdown as
                | { getMarkdown?: () => string }
                | undefined
            if (md && typeof md.getMarkdown === 'function') {
                return md.getMarkdown()
            }
            return ed.getHTML()
        }
        return ed.getHTML()
    }

    function isContentEqual(a: unknown, b: unknown): boolean {
        if (a === b) return true
        if (typeof a !== typeof b) return false
        if (typeof a === 'string' && typeof b === 'string') return a === b
        try {
            return JSON.stringify(a) === JSON.stringify(b)
        } catch {
            return false
        }
    }

    function resolveSlashCommands() {
        if (slashCommands) return slashCommands
        if (!slash) return undefined
        return buildDefaultSlashCommands({
            image,
            tables,
            youtube,
            promptUrl: (opts) =>
                new Promise<string | null>((resolve) => {
                    let done = false
                    const settle = (value: string | null): void => {
                        if (done) return
                        done = true
                        resolve(value)
                    }
                    openUrlPrompt({
                        ...opts,
                        onConfirm: (value) => settle(value),
                        onCancel: () => settle(null)
                    })
                })
        })
    }

    function resolveExtensions() {
        if (extensionsOverride) return extensionsOverride
        return buildExtensions({
            headingLevels,
            placeholder,
            autolink,
            linkOpenInNewTab,
            maxLength,
            image,
            tables,
            youtube,
            dragHandle,
            markdown: output === 'markdown',
            markdownAllowHtml,
            mentionTrigger,
            mentionSuggestion: onMention
                ? buildMentionSuggestion({ onQuery: onMention })
                : undefined,
            slashCommands: resolveSlashCommands(),
            slashTrigger,
            extra: [
                ...(extraExtensions ?? []),
                ...(bubbleMenu && bubbleElement
                    ? [
                          BubbleMenuExt.configure({
                              element: bubbleElement,
                              options: {
                                  placement: 'top'
                              }
                          })
                      ]
                    : [])
            ]
        })
    }

    let suppressUpdate = false

    $effect(() => {
        if (!contentElement) return

        // Untrack: these props would otherwise cause editor recreation on every
        // keystroke (value changes via onUpdate → effect re-runs → destroy + rebuild
        // → cursor lost → can only type 1 char). value sync is handled by a
        // dedicated effect below; disabled/readonly toggle via setEditable.
        const initialContent = untrack(() => value ?? '')
        const initialEditable = untrack(() => !disabled && !readonly)
        const initialAutofocus = untrack(() => autofocus)
        const initialAttrs = untrack(() => ({
            id: resolvedId,
            ...(resolvedName ? { 'data-name': resolvedName } : {}),
            ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
            ...(hasError ? { 'aria-invalid': 'true' } : {})
        }))
        const exts = untrack(() => resolveExtensions())

        const ed = new Editor({
            element: contentElement,
            extensions: exts,
            content: initialContent,
            editable: initialEditable,
            autofocus: initialAutofocus,
            editorProps: {
                attributes: initialAttrs as Record<string, string>
            },
            onCreate: ({ editor: e }) => syncState(e),
            onUpdate: ({ editor: e }) => {
                syncState(e)
                if (suppressUpdate) return
                const serialized = serialize(e)
                value = serialized
                emit.onInput()
                onValueChange?.(serialized)
            },
            onSelectionUpdate: ({ editor: e }) => syncState(e),
            onFocus: ({ editor: e }) => {
                syncState(e)
                emit.onFocus()
                onFocus?.()
            },
            onBlur: ({ editor: e }) => {
                syncState(e)
                emit.onBlur()
                onBlur?.()
            }
        })

        editor = ed

        return () => {
            ed.destroy()
            editor = null
        }
    })

    $effect(() => {
        if (!editor) return
        const target = !disabled && !readonly
        if (editor.isEditable !== target) {
            editor.setEditable(target)
        }
    })

    // Sync aria attributes on the ProseMirror element when error/id state changes.
    // Tiptap's editorProps.attributes is read once at init, so toggling needs
    // direct DOM access. Run on every state change.
    $effect(() => {
        if (!contentElement) return
        const pm = contentElement.querySelector('.ProseMirror') as HTMLElement | null
        if (!pm) return
        if (hasError) pm.setAttribute('aria-invalid', 'true')
        else pm.removeAttribute('aria-invalid')
        if (ariaDescribedBy) pm.setAttribute('aria-describedby', ariaDescribedBy)
        else pm.removeAttribute('aria-describedby')
        if (resolvedId) pm.setAttribute('id', resolvedId)
    })

    $effect(() => {
        if (!editor) return
        if (value === undefined) return
        const current = serialize(editor)
        if (isContentEqual(current, value)) return
        suppressUpdate = true
        editor.commands.setContent(value as string | EditorJSON, { emitUpdate: false })
        suppressUpdate = false
        syncState(editor)
    })

    const apiInstance: EditorApi = {
        get editor() {
            return editor
        },
        get state() {
            return editorState
        },
        focus(position) {
            editor?.commands.focus(position)
        },
        run(action) {
            if (!editor) return
            TOOLBAR_ACTIONS[action].run(editor)
        },
        getValue(format) {
            if (!editor) return output === 'json' ? ({} as EditorJSON) : ''
            const fmt = format ?? output
            if (fmt === 'json') return editor.getJSON() as EditorJSON
            if (fmt === 'markdown') {
                const md = (editor.storage as unknown as Record<string, unknown>).markdown as
                    | { getMarkdown?: () => string }
                    | undefined
                if (md && typeof md.getMarkdown === 'function') return md.getMarkdown()
                return editor.getHTML()
            }
            return editor.getHTML()
        },
        setValue(next) {
            if (!editor) return
            suppressUpdate = true
            editor.commands.setContent(next as string | EditorJSON, { emitUpdate: false })
            suppressUpdate = false
            syncState(editor)
        },
        clear() {
            editor?.chain().focus().clearContent().run()
        },
        insert(content) {
            editor
                ?.chain()
                .focus()
                .insertContent(content as string | EditorJSON)
                .run()
        }
    }

    api = apiInstance

    const resolvedToolbar = $derived.by<(ToolbarAction | '|')[]>(() => {
        if (toolbar === false) return []
        if (toolbar === true) return DEFAULT_TOOLBAR
        return toolbar as (ToolbarAction | '|')[]
    })

    const classes = $derived.by(() => {
        const slots = editorVariants({
            size,
            color: resolvedColor,
            sticky: stickyToolbar
        })
        const c = config.slots
        const u = ui ?? {}
        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            toolbar: slots.toolbar({ class: [c.toolbar, u.toolbar] }),
            toolbarGroup: slots.toolbarGroup({ class: [c.toolbarGroup, u.toolbarGroup] }),
            toolbarButton: slots.toolbarButton({ class: [c.toolbarButton, u.toolbarButton] }),
            toolbarSeparator: slots.toolbarSeparator({
                class: [c.toolbarSeparator, u.toolbarSeparator]
            }),
            content: slots.content({ class: [c.content, u.content] }),
            footer: slots.footer({ class: [c.footer, u.footer] }),
            countLabel: slots.countLabel({ class: [c.countLabel, u.countLabel] }),
            bubbleMenu: slots.bubbleMenu({ class: [c.bubbleMenu, u.bubbleMenu] })
        }
    })

    // ----- URL prompt modal (shared by YouTube/Image/Link toolbar + slash) -----
    interface UrlPromptState {
        open: boolean
        title: string
        description?: string
        placeholder: string
        initialValue: string
        confirmLabel: string
        schema?: UrlSchema
        onConfirm?: (url: string) => void
        onCancel?: () => void
    }

    let urlPrompt = $state<UrlPromptState>({
        open: false,
        title: 'Enter URL',
        placeholder: 'https://',
        initialValue: '',
        confirmLabel: 'Insert'
    })

    function openUrlPrompt(opts: {
        title: string
        description?: string
        placeholder?: string
        initialValue?: string
        confirmLabel?: string
        schema?: UrlSchema
        onConfirm: (url: string) => void
        onCancel?: () => void
    }): void {
        urlPrompt = {
            open: true,
            title: opts.title,
            description: opts.description,
            placeholder: opts.placeholder ?? 'https://',
            initialValue: opts.initialValue ?? '',
            confirmLabel: opts.confirmLabel ?? 'Insert',
            schema: opts.schema,
            onConfirm: opts.onConfirm,
            onCancel: opts.onCancel
        }
    }

    // ----- Image upload via hidden file input -----
    let fileInput: HTMLInputElement | null = $state(null)

    async function handleFileSelected(event: Event): Promise<void> {
        if (!editor) return
        const input = event.currentTarget as HTMLInputElement
        const file = input.files?.[0]
        input.value = ''
        if (!file) return
        if (!onImageUpload) return
        try {
            const url = await onImageUpload(file)
            editor.chain().focus().setImage({ src: url }).run()
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[Editor] image upload failed', err)
        }
    }

    function openImagePicker(): void {
        if (!editor) return
        if (!onImageUpload) {
            openUrlPrompt({
                title: 'Image URL',
                placeholder: 'https://example.com/image.png',
                schema: httpUrlSchema,
                onConfirm: (url) => {
                    editor?.chain().focus().setImage({ src: url }).run()
                }
            })
            return
        }
        fileInput?.click()
    }

    function openYoutubePrompt(): void {
        if (!editor) return
        openUrlPrompt({
            title: 'Embed YouTube video',
            description: 'Paste the share link or full URL.',
            placeholder: 'https://youtu.be/...',
            confirmLabel: 'Embed',
            schema: youtubeUrlSchema,
            onConfirm: (url) => {
                editor?.commands.setYoutubeVideo({ src: url })
            }
        })
    }

    function openLinkPrompt(): void {
        if (!editor) return
        const previous = (editor.getAttributes('link').href as string | undefined) ?? ''
        openUrlPrompt({
            title: 'Insert link',
            placeholder: 'https://',
            initialValue: previous,
            schema: httpUrlSchema,
            onConfirm: (url) => {
                editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
        })
    }

    // ----- Table dimension picker -----
    let tableMenuOpen = $state(false)
    let tablePickerRows = $state(0)
    let tablePickerCols = $state(0)
    let tablePickerEl: HTMLDivElement | null = $state(null)
    let tableButtonEl: HTMLButtonElement | null = $state(null)
    const TABLE_MAX_ROWS = 8
    const TABLE_MAX_COLS = 8

    function insertTable(rows: number, cols: number): void {
        if (!editor) return
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
        tableMenuOpen = false
        tablePickerRows = 0
        tablePickerCols = 0
    }

    $effect(() => {
        if (!tableMenuOpen) return
        function onDocPointerDown(event: PointerEvent): void {
            const target = event.target as Node | null
            if (!target) return
            if (tablePickerEl?.contains(target)) return
            if (tableButtonEl?.contains(target)) return
            tableMenuOpen = false
            tablePickerRows = 0
            tablePickerCols = 0
        }
        document.addEventListener('pointerdown', onDocPointerDown, true)
        return () => document.removeEventListener('pointerdown', onDocPointerDown, true)
    })

    function runAction(def: ToolbarActionDef, id: ToolbarAction): void {
        if (!editor) return
        if (id === 'image') {
            openImagePicker()
            return
        }
        if (id === 'youtube') {
            openYoutubePrompt()
            return
        }
        if (id === 'link') {
            openLinkPrompt()
            return
        }
        if (id === 'table') {
            tableMenuOpen = !tableMenuOpen
            return
        }
        def.run(editor)
    }
</script>

<div
    bind:this={ref}
    class={classes.root}
    data-disabled={disabled}
    data-readonly={readonly}
    data-error={hasError ? '' : undefined}
    {...restProps}
>
    {#if toolbarSlot}
        {@render toolbarSlot({ state: editorState, api: apiInstance })}
    {:else if toolbar !== false}
        <div class={classes.toolbar} role="toolbar" aria-label="Editor toolbar">
            {#each resolvedToolbar as item, i (i)}
                {#if item === '|'}
                    <span class={classes.toolbarSeparator} aria-hidden="true"></span>
                {:else}
                    {@const def = TOOLBAR_ACTIONS[item]}
                    {@const active = def.isActive?.(editorState) ?? false}
                    {@const inactive = def.isDisabled?.(editorState) ?? false}
                    {#if item === 'table'}
                        <Tooltip text={def.label}>
                            <span class="relative inline-flex">
                                <button
                                    bind:this={tableButtonEl}
                                    type="button"
                                    class={classes.toolbarButton}
                                    data-active={active || tableMenuOpen}
                                    data-action={item}
                                    disabled={disabled || readonly || inactive}
                                    aria-label={def.label}
                                    aria-expanded={tableMenuOpen}
                                    aria-haspopup="dialog"
                                    onclick={() => runAction(def, item)}
                                >
                                    <Icon name={def.icon} />
                                </button>
                                {#if tableMenuOpen}
                                    <div
                                        bind:this={tablePickerEl}
                                        class="absolute top-full left-0 z-30 mt-1 w-max rounded-lg border border-outline-variant bg-surface p-2 shadow-md"
                                        data-editor-table-picker
                                        role="dialog"
                                        aria-label="Insert table"
                                    >
                                        <div
                                            class="mb-2 text-center text-xs text-on-surface-variant"
                                        >
                                            {tablePickerRows || 1} × {tablePickerCols || 1}
                                        </div>
                                        <div
                                            class="grid grid-cols-8 gap-0.5"
                                            role="presentation"
                                            onmouseleave={() => {
                                                tablePickerRows = 0
                                                tablePickerCols = 0
                                            }}
                                        >
                                            {#each Array.from({ length: TABLE_MAX_ROWS * TABLE_MAX_COLS }, (_v, i) => i) as idx (idx)}
                                                {@const r = Math.floor(idx / TABLE_MAX_COLS) + 1}
                                                {@const c = (idx % TABLE_MAX_COLS) + 1}
                                                {@const on =
                                                    r <= tablePickerRows && c <= tablePickerCols}
                                                <button
                                                    type="button"
                                                    class="size-5 rounded border border-outline-variant {on
                                                        ? 'border-primary bg-primary'
                                                        : 'bg-surface-container hover:border-primary/50'}"
                                                    aria-label={`Insert ${r}×${c} table`}
                                                    onmouseenter={() => {
                                                        tablePickerRows = r
                                                        tablePickerCols = c
                                                    }}
                                                    onmousedown={(e) => {
                                                        e.preventDefault()
                                                        insertTable(r, c)
                                                    }}
                                                ></button>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </span>
                        </Tooltip>
                    {:else}
                        <Tooltip text={def.label}>
                            <button
                                type="button"
                                class={classes.toolbarButton}
                                data-active={active}
                                data-action={item}
                                disabled={disabled || readonly || inactive}
                                aria-label={def.label}
                                aria-pressed={def.isActive ? active : undefined}
                                onclick={() => runAction(def, item)}
                            >
                                <Icon name={def.icon} />
                            </button>
                        </Tooltip>
                    {/if}
                {/if}
            {/each}
        </div>
    {/if}

    {#if header}
        {@render header()}
    {/if}

    <div
        bind:this={contentElement}
        class={classes.content}
        data-editor-content
        role="textbox"
        aria-multiline="true"
        aria-readonly={readonly}
        aria-disabled={disabled}
    ></div>

    {#if footer}
        {@render footer()}
    {:else if showCount || maxLength !== undefined}
        <div class={classes.footer} data-editor-footer>
            <span class={classes.countLabel} data-editor-count>
                {editorState.charCount}{#if maxLength !== undefined}&nbsp;/&nbsp;{maxLength}{/if}
                &nbsp;chars
            </span>
            <span class={classes.countLabel}>{editorState.wordCount}&nbsp;words</span>
        </div>
    {/if}

    {#if image}
        <input
            bind:this={fileInput}
            type="file"
            accept="image/*"
            class="hidden"
            data-editor-image-input
            tabindex="-1"
            aria-hidden="true"
            onchange={handleFileSelected}
        />
    {/if}

    {#if bubbleMenu}
        <div bind:this={bubbleElement} class={classes.bubbleMenu} data-editor-bubble>
            {#if bubbleMenuSlot}
                {@render bubbleMenuSlot({ state: editorState, api: apiInstance })}
            {:else}
                {#each ['bold', 'italic', 'link'] as const as item (item)}
                    {@const def = TOOLBAR_ACTIONS[item]}
                    {@const active = def.isActive?.(editorState) ?? false}
                    <button
                        type="button"
                        class={classes.toolbarButton}
                        data-active={active}
                        data-action={item}
                        aria-label={def.label}
                        aria-pressed={active}
                        onclick={() => runAction(def, item)}
                    >
                        <Icon name={def.icon} />
                    </button>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<EditorUrlPrompt
    bind:open={urlPrompt.open}
    title={urlPrompt.title}
    description={urlPrompt.description}
    placeholder={urlPrompt.placeholder}
    initialValue={urlPrompt.initialValue}
    confirmLabel={urlPrompt.confirmLabel}
    schema={urlPrompt.schema}
    onConfirm={(url) => urlPrompt.onConfirm?.(url)}
    onCancel={() => urlPrompt.onCancel?.()}
/>
