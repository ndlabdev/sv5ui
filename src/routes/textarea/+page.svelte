<script lang="ts">
    import { Textarea, FormField, FieldGroup } from '$lib/index.js'

    const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
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
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let bindValue = $state('')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Textarea</h1>
        <p class="text-on-surface-variant">
            A multi-line text input component with variants, colors, icons, autoresize, and
            integration with FormField and FieldGroup.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <Textarea placeholder="Enter text..." />
            </div>
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">bind:value</code> for reactive
            two-way data binding.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-3">
                <Textarea
                    bind:value={bindValue}
                    leadingIcon="lucide:pencil"
                    placeholder="Type something..."
                />
                <p class="text-sm text-on-surface-variant">
                    Value: <span class="font-mono text-on-surface">{bindValue || '(empty)'}</span>
                </p>
                <p class="text-sm text-on-surface-variant">
                    Length: <span class="font-mono text-on-surface">{bindValue.length}</span>
                </p>
            </div>
        </div>
    </section>

    <!-- Variants × Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants &times; Colors</h2>
        <div class="overflow-x-auto rounded-lg bg-surface-container-high p-4">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant"
                        ></th>
                        {#each colors as color (color)}
                            <th
                                class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr>
                            <td
                                class="px-3 py-2 text-xs font-medium text-on-surface-variant capitalize"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-3 py-2">
                                    <Textarea {variant} {color} placeholder={color} rows={2} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to control
            the dimensions and text size.
        </p>
        <div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="w-48">
                    <Textarea {size} placeholder="{size} size" rows={2} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Rows -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Rows</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">rows</code> prop to set the
            number of visible text lines.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Textarea rows={2} placeholder="2 rows" />
            </div>
            <div class="w-64">
                <Textarea rows={4} placeholder="4 rows" />
            </div>
            <div class="w-64">
                <Textarea rows={6} placeholder="6 rows" />
            </div>
        </div>
    </section>

    <!-- Autoresize -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Autoresize</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">autoresize</code> prop
            to automatically adjust the height based on content. Combine with
            <code class="rounded bg-surface-container-highest px-1">maxrows</code> to limit growth.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Unlimited autoresize</p>
                <Textarea autoresize placeholder="Type to grow..." rows={1} />
            </div>
            <div class="w-full max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Autoresize with maxrows=5</p>
                <Textarea autoresize maxrows={5} placeholder="Grows up to 5 rows..." rows={1} />
            </div>
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">leadingIcon</code> and
            <code class="rounded bg-surface-container-highest px-1">trailingIcon</code> to add icons.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Textarea leadingIcon="lucide:message-square" placeholder="Comment..." rows={2} />
            </div>
            <div class="w-64">
                <Textarea trailingIcon="lucide:send" placeholder="Message..." rows={2} />
            </div>
            <div class="w-64">
                <Textarea
                    leadingIcon="lucide:file-text"
                    trailingIcon="lucide:check"
                    placeholder="Description..."
                    rows={2}
                />
            </div>
        </div>
    </section>

    <!-- Icon prop with trailing -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon (with trailing)</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">icon</code> prop with
            <code class="rounded bg-surface-container-highest px-1">trailing</code> to position it.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Textarea icon="lucide:pencil" placeholder="Leading icon" rows={2} />
            </div>
            <div class="w-64">
                <Textarea icon="lucide:pencil" trailing placeholder="Trailing icon" rows={2} />
            </div>
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to show
            a loading spinner.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Textarea loading placeholder="Loading (leading)..." rows={2} />
            </div>
            <div class="w-64">
                <Textarea loading trailing placeholder="Loading (trailing)..." rows={2} />
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Textarea disabled placeholder="Disabled" rows={2} />
            </div>
            <div class="w-64">
                <Textarea disabled value="Disabled with value" rows={2} />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">highlight</code> prop to emphasize
            the ring color.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <Textarea highlight {color} placeholder={color} rows={2} />
                </div>
            {/each}
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            >, the Textarea automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-4">
                <FormField
                    label="Description"
                    description="Provide a detailed description of the issue."
                    required
                >
                    <Textarea leadingIcon="lucide:file-text" placeholder="Describe the issue..." />
                </FormField>

                <FormField
                    label="Notes"
                    help="Optional additional notes."
                    error="Notes cannot be empty."
                >
                    <Textarea placeholder="Enter notes..." />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Custom UI -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to
            override classes on specific slots:
            <code class="rounded bg-surface-container-highest px-1">root</code>,
            <code class="rounded bg-surface-container-highest px-1">base</code>,
            <code class="rounded bg-surface-container-highest px-1">leading</code>,
            <code class="rounded bg-surface-container-highest px-1">leadingIcon</code>,
            <code class="rounded bg-surface-container-highest px-1">trailing</code>,
            <code class="rounded bg-surface-container-highest px-1">trailingIcon</code>.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Custom base & root</p>
                <Textarea
                    placeholder="Rounded with shadow..."
                    rows={2}
                    ui={{
                        root: 'shadow-lg rounded-xl',
                        base: 'rounded-xl'
                    }}
                />
            </div>
            <div class="w-full max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Custom icon colors</p>
                <Textarea
                    leadingIcon="lucide:sparkles"
                    trailingIcon="lucide:send"
                    placeholder="Colorful icons..."
                    rows={2}
                    ui={{
                        leadingIcon: 'text-primary',
                        trailingIcon: 'text-success'
                    }}
                />
            </div>
            <div class="w-full max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Custom font & background</p>
                <Textarea
                    variant="soft"
                    color="tertiary"
                    placeholder="Italic monospace..."
                    rows={2}
                    ui={{
                        base: 'font-mono italic'
                    }}
                />
            </div>
        </div>
    </section>

    <!-- FieldGroup Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FieldGroup Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FieldGroup</code
            >, textareas are visually connected.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="space-y-4">
                <div>
                    <p class="mb-2 text-xs text-on-surface-variant">Vertical</p>
                    <FieldGroup orientation="vertical">
                        <Textarea placeholder="Title" rows={1} />
                        <Textarea placeholder="Description" rows={3} />
                        <Textarea placeholder="Additional notes" rows={2} />
                    </FieldGroup>
                </div>
            </div>
        </div>
    </section>
</div>
