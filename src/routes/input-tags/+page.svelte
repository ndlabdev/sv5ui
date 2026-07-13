<script lang="ts">
    import { InputTags, Icon, Form, FormField, Button } from '$lib/index.js'
    import type { FormApi } from '$lib/index.js'
    import { z } from 'zod'

    let basicValue = $state<string[]>(['svelte', 'tailwind'])
    let pasteValue = $state<string[]>([])
    let maxValue = $state<string[]>(['one', 'two'])
    let customTagValue = $state<string[]>(['design', 'engineering'])

    const tagIcons: Record<string, string> = {
        svelte: 'logos:svelte-icon',
        vue: 'logos:vue',
        react: 'logos:react',
        angular: 'logos:angular-icon'
    }

    const formSchema = z.object({
        skills: z
            .array(z.string())
            .min(2, 'Add at least 2 skills')
            .max(5, 'At most 5 skills allowed')
    })

    let formState = $state<{ skills: string[] }>({ skills: [] })
    let formApi = $state<FormApi<unknown>>()
    let submitted = $state<string | null>(null)

    function handleSubmit(event: { data: unknown }) {
        submitted = JSON.stringify(event.data, null, 2)
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
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Input Tags</h1>
        <p class="text-on-surface-variant">
            A tag entry input rendering values as removable badges. Commit with Enter or the
            delimiter, paste delimited lists, navigate tags with the arrow keys, and remove them
            with Backspace or their delete button.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-md">
                <InputTags bind:value={basicValue} placeholder="Add a tag…" />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Value: {JSON.stringify(basicValue)}
            </p>
        </div>
    </section>

    <!-- Adding behavior -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Adding Behavior</h2>
        <p class="text-sm text-on-surface-variant">
            Enter always commits. Typing the delimiter commits inline, pasting splits on the
            delimiter and newlines, and <code>addOnTab</code>/<code>addOnBlur</code> commit on Tab or
            blur.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Paste "red, green, blue"
                    </p>
                    <InputTags bind:value={pasteValue} placeholder="Paste a list…" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Delimiter ";"</p>
                    <InputTags delimiter=";" placeholder="a;b;c" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Add on blur</p>
                    <InputTags addOnBlur placeholder="Type and click away" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Add on Tab</p>
                    <InputTags addOnTab placeholder="Type and press Tab" />
                </div>
            </div>
        </div>
    </section>

    <!-- Constraints -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Constraints</h2>
        <p class="text-sm text-on-surface-variant">
            Duplicates are rejected by default (the text stays in the input); <code>max</code> caps
            the tag count and <code>maxLength</code> the tag length.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Max 4 tags</p>
                    <InputTags bind:value={maxValue} max={4} placeholder="Up to 4 tags" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Max length 8</p>
                    <InputTags maxLength={8} placeholder="Short tags only" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Allow duplicates</p>
                    <InputTags allowDuplicates placeholder="Same tag twice is fine" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Leading icon</p>
                    <InputTags leadingIcon="lucide:tag" placeholder="With icon" />
                </div>
            </div>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex max-w-md flex-col gap-3">
                {#each sizes as size (size)}
                    <InputTags {size} value={['svelte', 'tailwind']} placeholder={size} />
                {/each}
            </div>
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each variants as variant (variant)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{variant}</p>
                        <InputTags {variant} value={['svelte', 'tailwind']} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each colors as color (color)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                        <InputTags {color} highlight value={['svelte', 'tailwind']} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Custom tags -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Tags</h2>
        <p class="text-sm text-on-surface-variant">
            Restyle tags by forwarding Badge props through <code>tag</code> (color, variant, a
            shared <code>leadingIcon</code> or <code>avatar</code>), or replace the label per tag
            with the <code>tagSlot</code> snippet.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Badge props</p>
                    <InputTags
                        bind:value={customTagValue}
                        tag={{ color: 'primary', variant: 'subtle' }}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">tagSlot</p>
                    <InputTags value={['alpha', 'beta']}>
                        {#snippet tagSlot({ tag })}
                            <span class="font-mono">#{tag}</span>
                        {/snippet}
                    </InputTags>
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Shared leading icon (<code>tag.leadingIcon</code>)
                    </p>
                    <InputTags value={['bug', 'feature']} tag={{ leadingIcon: 'lucide:tag' }} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Shared avatar (<code>tag.avatar</code>)
                    </p>
                    <InputTags
                        value={['ndlabdev', 'sv5ui']}
                        tag={{ avatar: { src: 'https://github.com/ndlabdev.png' } }}
                    />
                </div>
                <div class="space-y-1 sm:col-span-2">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Per-tag icon via <code>tagSlot</code>
                    </p>
                    <InputTags value={['svelte', 'vue', 'react', 'angular']}>
                        {#snippet tagSlot({ tag })}
                            <span class="inline-flex items-center gap-1">
                                <Icon name={tagIcons[tag] ?? 'lucide:tag'} class="size-3" />
                                {tag}
                            </span>
                        {/snippet}
                    </InputTags>
                </div>
            </div>
        </div>
    </section>

    <!-- States -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">States</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Disabled</p>
                    <InputTags disabled value={['svelte', 'tailwind']} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly</p>
                    <InputTags readonly value={['svelte', 'tailwind']} />
                </div>
            </div>
        </div>
    </section>

    <!-- Form integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form Integration</h2>
        <p class="text-sm text-on-surface-variant">
            Wrapped in <code>FormField</code>, the field inherits validation state, error color, and
            aria attributes automatically. One hidden input per tag carries the values for native
            form submission.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Form
                bind:api={formApi}
                schema={formSchema}
                bind:state={formState}
                onsubmit={handleSubmit}
                class="max-w-md space-y-4"
            >
                <FormField name="skills" label="Skills" required help="Between 2 and 5 skills">
                    <InputTags bind:value={formState.skills} placeholder="Add a skill…" />
                </FormField>
                <Button type="submit" loading={formApi?.loading}>Submit</Button>
            </Form>
            {#if submitted}
                <pre class="mt-4 rounded-md bg-surface p-3 text-xs">{submitted}</pre>
            {/if}
        </div>
    </section>
</div>
