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
    import { TOOLBAR_ACTIONS, DEFAULT_TOOLBAR, type ToolbarActionDef } from './editor.toolbar.js'
    import { buildExtensions } from './editor.extensions.js'
    import type {
        EditorApi,
        EditorJSON,
        EditorReactiveState,
        ToolbarAction
    } from './editor.types.js'
    import Icon from '../Icon/Icon.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'

    const config = getComponentConfig('editor', editorDefaults)

    let {
        ref = $bindable(null),
        api = $bindable(),
        value = $bindable(),
        output = 'html',
        placeholder,
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

    let contentElement: HTMLDivElement | null = $state(null)
    let bubbleElement: HTMLDivElement | null = $state(null)
    let editor: Editor | null = $state(null)

    let editorState = $state<EditorReactiveState>(makeEmptyState())

    function makeEmptyState(): EditorReactiveState {
        const empty = Object.fromEntries(
            (Object.keys(TOOLBAR_ACTIONS) as ToolbarAction[]).map((k) => [k, false])
        ) as Record<ToolbarAction, boolean>
        return {
            active: empty,
            can: { undo: false, redo: false },
            charCount: 0,
            wordCount: 0,
            isEmpty: true,
            isFocused: false
        }
    }

    function syncState(ed: Editor): void {
        const cc = ed.storage.characterCount
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
                horizontalRule: false,
                link: ed.isActive('link'),
                unlink: ed.isActive('link'),
                alignLeft: ed.isActive({ textAlign: 'left' }),
                alignCenter: ed.isActive({ textAlign: 'center' }),
                alignRight: ed.isActive({ textAlign: 'right' }),
                alignJustify: ed.isActive({ textAlign: 'justify' }),
                undo: ed.can().undo(),
                redo: ed.can().redo(),
                clearFormatting: false
            },
            can: {
                undo: ed.can().undo(),
                redo: ed.can().redo()
            },
            charCount: typeof cc?.characters === 'function' ? cc.characters() : 0,
            wordCount: typeof cc?.words === 'function' ? cc.words() : 0,
            isEmpty: ed.isEmpty,
            isFocused: ed.isFocused
        }
    }

    function serialize(ed: Editor): string | EditorJSON {
        return output === 'json' ? (ed.getJSON() as EditorJSON) : ed.getHTML()
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

    function resolveExtensions() {
        if (extensionsOverride) return extensionsOverride
        return buildExtensions({
            headingLevels,
            placeholder,
            autolink,
            linkOpenInNewTab,
            maxLength,
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
        const exts = untrack(() => resolveExtensions())

        const ed = new Editor({
            element: contentElement,
            extensions: exts,
            content: initialContent,
            editable: initialEditable,
            autofocus: initialAutofocus,
            onCreate: ({ editor: e }) => syncState(e),
            onUpdate: ({ editor: e }) => {
                syncState(e)
                if (suppressUpdate) return
                const serialized = serialize(e)
                value = serialized
                onValueChange?.(serialized)
            },
            onSelectionUpdate: ({ editor: e }) => syncState(e),
            onTransaction: ({ editor: e }) => syncState(e),
            onFocus: ({ editor: e }) => {
                syncState(e)
                onFocus?.()
            },
            onBlur: ({ editor: e }) => {
                syncState(e)
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
            return fmt === 'json' ? (editor.getJSON() as EditorJSON) : editor.getHTML()
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

    $effect.pre(() => {
        api = apiInstance
    })

    const resolvedToolbar = $derived.by<(ToolbarAction | '|')[]>(() => {
        if (toolbar === false) return []
        if (toolbar === true) return DEFAULT_TOOLBAR
        return toolbar as (ToolbarAction | '|')[]
    })

    const classes = $derived.by(() => {
        const slots = editorVariants({ size, color, sticky: stickyToolbar })
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

    function runAction(def: ToolbarActionDef): void {
        if (!editor) return
        def.run(editor)
    }
</script>

<div
    bind:this={ref}
    class={classes.root}
    data-disabled={disabled}
    data-readonly={readonly}
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
                    <Tooltip text={def.label}>
                        <button
                            type="button"
                            class={classes.toolbarButton}
                            data-active={active}
                            data-action={item}
                            disabled={disabled || inactive}
                            aria-label={def.label}
                            aria-pressed={def.isActive ? active : undefined}
                            onclick={() => runAction(def)}
                        >
                            <Icon name={def.icon} />
                        </button>
                    </Tooltip>
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
                        onclick={() => runAction(def)}
                    >
                        <Icon name={def.icon} />
                    </button>
                {/each}
            {/if}
        </div>
    {/if}
</div>
