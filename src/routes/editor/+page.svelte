<script lang="ts">
    import { Editor } from '$lib/Editor/index.js'
    import type { EditorApi, EditorJSON } from '$lib/Editor/index.js'
    import { Button, Badge, Separator, Card, Icon } from '$lib/index.js'

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
            <pre
                class="mt-2 overflow-x-auto rounded bg-surface-container-highest p-3 text-xs"><code
                    >{importExample}</code
                ></pre>
            <p class="mt-3 text-on-surface-variant">
                When your app doesn't reach this import path, Tiptap (~120 KB gzipped) is
                tree-shaken out of the production bundle.
            </p>
        </div>
    </section>
</div>
