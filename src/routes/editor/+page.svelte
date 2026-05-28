<script lang="ts">
    import { Editor } from '$lib/Editor/index.js'
    import type { EditorApi, EditorJSON, MentionItem } from '$lib/Editor/index.js'
    import { Button, Badge, Separator, Card, Icon, Form, FormField, Input } from '$lib/index.js'

    let basicHtml = $state('<p>Start writing here…</p>')

    let jsonValue = $state<EditorJSON>({
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This document is stored as JSON.' }]
            }
        ]
    })

    let customToolbarValue = $state('<p>Only <strong>bold</strong> and <em>italic</em>.</p>')

    let api = $state<EditorApi>()
    let apiValue = $state('<p>Drive me from outside.</p>')

    let limitedValue = $state('<p>Type here…</p>')

    let bubbleValue = $state('<p>Select any text to see the floating menu.</p>')

    // ----- Phase 2 demos -----

    let markdownValue = $state('# Hello\n\nThis editor outputs **Markdown**.')

    let imageValue = $state('<p>Click the image button to upload.</p>')
    async function fakeUploadImage(file: File): Promise<string> {
        // Demo: convert to data URL. Real apps would upload to a backend.
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error('FileReader failed'))
            reader.readAsDataURL(file)
        })
    }

    let tableValue = $state('<p>Click the table button → pick dimensions → insert.</p>')

    let slashValue = $state('<p>Type / to open the command menu…</p>')
    let youtubeValue = $state(
        '<p>Click the YouTube button or use / → YouTube to embed a video.</p>'
    )
    let dragHandleValue = $state(
        '<h2>Drag me!</h2><p>Hover any block to see the drag handle appear on the left. Drag to reorder.</p><ul><li>First item</li><li>Second item</li><li>Third item</li></ul>'
    )

    let mentionValue = $state('<p>Type @ to mention someone…</p>')
    const teamMembers: MentionItem[] = [
        { id: 'alice', label: 'Alice Nguyen' },
        { id: 'bob', label: 'Bob Tran' },
        { id: 'charlie', label: 'Charlie Le' },
        { id: 'diana', label: 'Diana Pham' },
        { id: 'evan', label: 'Evan Vo' }
    ]
    async function searchMembers(query: string): Promise<MentionItem[]> {
        await new Promise((r) => setTimeout(r, 50))
        const q = query.toLowerCase()
        return teamMembers.filter((m) => m.label.toLowerCase().includes(q))
    }

    const articleState = $state({ title: '', body: '<p></p>' })
    let articleSubmitted = $state<string | null>(null)
    function validateArticle(values: object) {
        const v = values as { title: string; body: string }
        const errors: { name: string; message: string }[] = []
        if (!v.title.trim()) errors.push({ name: 'title', message: 'Title is required' })
        if (v.body === '<p></p>' || !v.body.trim())
            errors.push({ name: 'body', message: 'Body cannot be empty' })
        return errors
    }
    function submitArticle(e: { data: unknown }) {
        articleSubmitted = JSON.stringify(e.data, null, 2)
    }

    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ] as const

    let serializedJson = $derived(JSON.stringify(jsonValue, null, 2))

    const importExample = "import { Editor } from 'sv5ui/editor'"
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Editor</h1>
        <p class="text-on-surface-variant">
            Rich-text WYSIWYG editor built on <strong>Tiptap v3</strong> + ProseMirror. Imported via
            the sub-export
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >sv5ui/editor</code
            >
            — only adds Tiptap to your bundle when actually used.
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
            <Badge variant="soft" color="info" label="Phase 1 (v1.8)" />
            <Badge variant="soft" color="surface" label="HTML or JSON output" />
            <Badge variant="soft" color="surface" label="Config-driven toolbar" />
        </div>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Minimal usage — default toolbar, HTML output, bindable
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">value</code>.
        </p>
        <Editor bind:value={basicHtml} placeholder="Write something…" />
        <details class="text-sm">
            <summary class="cursor-pointer text-on-surface-variant hover:text-on-surface"
                >Show raw HTML</summary
            >
            <pre
                class="mt-2 overflow-x-auto rounded bg-surface-container-highest p-3 text-xs">{basicHtml}</pre>
        </details>
    </section>

    <!-- JSON output -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">JSON output</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >output="json"</code
            >
            to receive a structured Tiptap document — ideal for database storage and downstream transformations.
        </p>
        <Editor bind:value={jsonValue} output="json" placeholder="JSON-backed editor…" />
        <details class="text-sm">
            <summary class="cursor-pointer text-on-surface-variant hover:text-on-surface"
                >Show serialized JSON</summary
            >
            <pre
                class="mt-2 max-h-80 overflow-auto rounded bg-surface-container-highest p-3 text-xs">{serializedJson}</pre>
        </details>
    </section>

    <!-- Custom toolbar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom toolbar config</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an array of action ids + <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">'|'</code
            > separators to control exactly which buttons appear.
        </p>
        <Editor bind:value={customToolbarValue} toolbar={['bold', 'italic', '|', 'undo', 'redo']} />
    </section>

    <!-- Bubble menu only -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Bubble menu (no top toolbar)</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >toolbar={'{false}'}</code
            >
            +
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bubbleMenu</code
            >
            shows a floating menu only when text is selected — minimal chrome.
        </p>
        <Editor bind:value={bubbleValue} toolbar={false} bubbleMenu />
    </section>

    <!-- Character count + maxLength -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Character limit</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">maxLength</code
            >
            blocks input beyond the limit and shows a counter in the footer.
        </p>
        <Editor bind:value={limitedValue} maxLength={140} placeholder="Tweet-length post…" />
    </section>

    <!-- Read-only / disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Read-only &amp; disabled</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div>
                <p class="mb-2 text-sm font-medium">readonly</p>
                <Editor
                    value="<h3>Read-only</h3><p>Content renders but typing is blocked.</p>"
                    readonly
                />
            </div>
            <div>
                <p class="mb-2 text-sm font-medium">disabled</p>
                <Editor value="<h3>Disabled</h3><p>Faded + non-interactive.</p>" disabled />
            </div>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4">
            {#each ['sm', 'md', 'lg'] as const as size (size)}
                <div>
                    <p class="mb-1 text-xs font-medium tracking-wide uppercase">{size}</p>
                    <Editor
                        {size}
                        value={`<p>Size: <strong>${size}</strong></p>`}
                        toolbar={['bold', 'italic', '|', 'h1', 'h2']}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Colors (focus ring) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Focus ring colors</h2>
        <p class="text-sm text-on-surface-variant">Click into each editor to see the focus ring.</p>
        <div class="grid gap-3 md:grid-cols-2">
            {#each colors as color (color)}
                <div>
                    <p class="mb-1 text-xs font-medium capitalize">{color}</p>
                    <Editor
                        {color}
                        value={`<p>Focus me — <strong>${color}</strong> ring.</p>`}
                        toolbar={['bold', 'italic', '|', 'undo', 'redo']}
                    />
                </div>
            {/each}
        </div>
    </section>

    <Separator />

    <!-- Imperative API -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Imperative API — bind:api</h2>
        <p class="text-sm text-on-surface-variant">
            Drive the editor from outside via <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">bind:api</code
            >. Useful for custom toolbars, form submission, or external controls.
        </p>
        <Editor bind:api bind:value={apiValue} placeholder="Drive me from outside…" />
        <div class="flex flex-wrap items-center gap-2">
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:bold"
                label="Bold"
                onclick={() => api?.run('bold')}
            />
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:italic"
                label="Italic"
                onclick={() => api?.run('italic')}
            />
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:heading-1"
                label="H1"
                onclick={() => api?.run('h1')}
            />
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:link"
                label="Link"
                onclick={() => api?.run('link')}
            />
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:undo-2"
                label="Undo"
                disabled={!api?.state.can.undo}
                onclick={() => api?.run('undo')}
            />
            <Button
                size="xs"
                variant="outline"
                leadingIcon="lucide:redo-2"
                label="Redo"
                disabled={!api?.state.can.redo}
                onclick={() => api?.run('redo')}
            />
            <Button
                size="xs"
                color="error"
                variant="outline"
                leadingIcon="lucide:trash-2"
                label="Clear"
                onclick={() => api?.clear()}
            />
            <Button
                size="xs"
                color="primary"
                variant="solid"
                leadingIcon="lucide:plus"
                label="Insert sample"
                onclick={() => api?.insert(' — <em>inserted</em>')}
            />
        </div>
        <div class="flex flex-wrap items-center gap-2 pt-2 text-xs text-on-surface-variant">
            <span>State:</span>
            <Badge size="xs" variant="soft" color={api?.state.active.bold ? 'primary' : 'surface'}
                >bold {api?.state.active.bold ?? false}</Badge
            >
            <Badge size="xs" variant="soft" color={api?.state.active.italic ? 'primary' : 'surface'}
                >italic {api?.state.active.italic ?? false}</Badge
            >
            <Badge size="xs" variant="soft" color={api?.state.isFocused ? 'success' : 'surface'}
                >focused {api?.state.isFocused ?? false}</Badge
            >
            <Badge size="xs" variant="soft" color={api?.state.isEmpty ? 'warning' : 'surface'}
                >empty {api?.state.isEmpty ?? false}</Badge
            >
            <Badge size="xs" variant="soft" color="info">chars: {api?.state.charCount ?? 0}</Badge>
            <Badge size="xs" variant="soft" color="info">words: {api?.state.wordCount ?? 0}</Badge>
        </div>
    </section>

    <Separator />

    <!-- Phase 2: Markdown output -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Markdown output (Phase 2)</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >output="markdown"</code
            >
            to bind a Markdown string. Powered by the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >tiptap-markdown</code
            > extension — paste markdown is also recognized.
        </p>
        <Editor
            bind:value={markdownValue}
            output="markdown"
            placeholder="Type or paste markdown…"
        />
        <details class="text-sm">
            <summary class="cursor-pointer text-on-surface-variant hover:text-on-surface"
                >Show raw markdown</summary
            >
            <pre
                class="mt-2 overflow-x-auto rounded bg-surface-container-highest p-3 text-xs">{markdownValue}</pre>
        </details>
    </section>

    <!-- Phase 2: Image upload -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Image upload (Phase 2)</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">image</code>
            toolbar action opens a file picker → calls
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onImageUpload(file)</code
            >
            → inserts the returned URL. Demo here converts to a data URL client-side.
        </p>
        <Editor
            bind:value={imageValue}
            image
            onImageUpload={fakeUploadImage}
            toolbar={[
                'bold',
                'italic',
                '|',
                'h1',
                'h2',
                '|',
                'image',
                '|',
                'bulletList',
                'orderedList',
                '|',
                'undo',
                'redo'
            ]}
        />
    </section>

    <!-- Phase 2: Tables -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Tables (Phase 2)</h2>
        <p class="text-sm text-on-surface-variant">
            Enable with <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >tables</code
            >
            and add the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">table</code> toolbar
            action. Click → hover the grid → pick dimensions → click to insert.
        </p>
        <Editor
            bind:value={tableValue}
            tables
            toolbar={['bold', 'italic', '|', 'h2', 'h3', '|', 'table', '|', 'undo', 'redo']}
        />
    </section>

    <!-- Phase 2: Mentions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Mentions (Phase 2)</h2>
        <p class="text-sm text-on-surface-variant">
            Provide <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onMention(query)</code
            >
            to enable @-style suggestions. Type
            <kbd
                class="rounded border border-outline-variant bg-surface-container-high px-1.5 py-0.5 text-xs"
                >@</kbd
            >
            inside the editor — a popup will open with matching items. Arrow keys to navigate, Enter to
            select.
        </p>
        <Editor bind:value={mentionValue} onMention={searchMembers} placeholder="Try typing @al…" />
    </section>

    <Separator />

    <!-- Phase 3: Slash commands -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Slash commands (Phase 3)</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">slash</code
            >
            to enable. Inside the editor, type
            <kbd
                class="rounded border border-outline-variant bg-surface-container-high px-1.5 py-0.5 text-xs"
                >/</kbd
            >
            to open the command menu — fuzzy filter by typing, Arrow keys to navigate, Enter to run. Pass
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >slashCommands</code
            > to customize.
        </p>
        <Editor bind:value={slashValue} slash image tables youtube />
    </section>

    <!-- Phase 3: YouTube embed -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">YouTube embeds (Phase 3)</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">youtube</code>
            enables the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">youtube</code> toolbar
            action which prompts for a URL and inserts a responsive embed.
        </p>
        <Editor
            bind:value={youtubeValue}
            youtube
            toolbar={['bold', 'italic', '|', 'h2', 'h3', '|', 'youtube', '|', 'undo', 'redo']}
        />
    </section>

    <!-- Phase 3: Drag handle -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Drag handle (Phase 3)</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >dragHandle</code
            >
            shows a draggable handle on the left of each block on hover. Drag to reorder paragraphs, headings,
            lists, etc.
        </p>
        <Editor bind:value={dragHandleValue} dragHandle />
    </section>

    <Separator />

    <!-- Phase 2: Form integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form integration (Phase 2)</h2>
        <p class="text-sm text-on-surface-variant">
            Wrap in <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >&lt;FormField&gt;</code
            > to get error highlighting, label association, and per-field validation events.
        </p>
        <Card class="space-y-3 p-4">
            <Form state={articleState} validate={validateArticle} onsubmit={submitArticle}>
                <div class="space-y-4">
                    <FormField name="title" label="Title" required>
                        <Input bind:value={articleState.title} placeholder="Article title…" />
                    </FormField>
                    <FormField name="body" label="Body" required>
                        <Editor
                            bind:value={articleState.body}
                            placeholder="Write your article…"
                            toolbar={[
                                'bold',
                                'italic',
                                '|',
                                'h2',
                                'h3',
                                '|',
                                'bulletList',
                                'orderedList',
                                'blockquote',
                                '|',
                                'link',
                                '|',
                                'undo',
                                'redo'
                            ]}
                        />
                    </FormField>
                    <div class="flex justify-end">
                        <Button type="submit" color="primary" size="sm" label="Submit article" />
                    </div>
                </div>
            </Form>
            {#if articleSubmitted}
                <pre
                    class="mt-2 max-h-60 overflow-auto rounded bg-surface-container-highest p-3 text-xs">{articleSubmitted}</pre>
            {/if}
        </Card>
    </section>

    <Separator />

    <!-- Real-world: comment box -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real-world — Comment box</h2>
        <Card class="space-y-3 p-4">
            <Editor
                bind:value={limitedValue}
                placeholder="Add a thoughtful comment…"
                maxLength={280}
                toolbar={['bold', 'italic', 'code', '|', 'bulletList', 'orderedList', '|', 'link']}
                bubbleMenu
                stickyToolbar
            />
            <div class="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" label="Cancel" />
                <Button color="primary" size="sm" leadingIcon="lucide:send" label="Post comment" />
            </div>
        </Card>
    </section>

    <!-- Note about sub-export -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Import path</h2>
        <div class="rounded-lg border border-outline-variant bg-surface-container p-4 text-sm">
            <p class="mb-2 flex items-center gap-2 font-medium">
                <Icon name="lucide:package" size="18" class="text-primary" />
                Editor is opt-in via a separate entry point
            </p>
            <pre class="mt-2 overflow-x-auto rounded bg-surface-container-highest p-3 text-xs"><code
                    >{importExample}</code
                ></pre>
            <p class="mt-3 text-on-surface-variant">
                When your app doesn't reach this import path, Tiptap (~120 KB gzipped) is
                tree-shaken out of the production bundle.
            </p>
        </div>
    </section>
</div>
