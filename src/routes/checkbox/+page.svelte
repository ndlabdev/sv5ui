<script lang="ts">
    import { Checkbox, FormField } from '$lib/index.js'

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

    let bindChecked = $state(false)
    let indeterminate = $state(true)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Checkbox</h1>
        <p class="text-on-surface-variant">
            A checkbox component for boolean and indeterminate states with customizable colors,
            sizes, icons, and FormField integration.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Checkbox />
            <Checkbox checked={true} />
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">bind:checked</code> for reactive
            two-way data binding.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Checkbox bind:checked={bindChecked} label="Toggle me" />
            <p class="text-sm text-on-surface-variant">
                Checked: <span class="font-mono text-on-surface">{bindChecked}</span>
            </p>
        </div>
    </section>

    <!-- With Label & Description -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Label & Description</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">label</code> and
            <code class="rounded bg-surface-container-highest px-1">description</code> props to add text
            next to the checkbox.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Checkbox label="Accept terms" />
            <Checkbox
                label="Marketing emails"
                description="Receive emails about new products and features."
            />
            <Checkbox
                label="Push notifications"
                description="Get notified when someone mentions you."
            />
        </div>
    </section>

    <!-- Indeterminate -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Indeterminate</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">bind:indeterminate</code> for
            tri-state checkbox behavior, useful for "select all" patterns.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Checkbox bind:indeterminate label="Select all" />
            <p class="text-sm text-on-surface-variant">
                Indeterminate: <span class="font-mono text-on-surface">{indeterminate}</span>
            </p>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <div class="flex flex-col items-center gap-2">
                    <Checkbox {color} checked={true} label={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to control
            the dimensions.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Checkbox {size} checked={true} label={size} />
            {/each}
        </div>
    </section>

    <!-- Custom Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">icon</code> and
            <code class="rounded bg-surface-container-highest px-1">indeterminateIcon</code> to customize
            the icons.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Checkbox icon="lucide:heart" checked={true} label="Favorite" color="error" />
            <Checkbox icon="lucide:star" checked={true} label="Starred" color="warning" />
            <Checkbox icon="lucide:thumbs-up" checked={true} label="Liked" color="success" />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to show
            a loading spinner.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Checkbox loading label="Syncing..." />
            <Checkbox loading checked={true} label="Saving preferences..." color="success" />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Checkbox disabled label="Disabled (off)" />
            <Checkbox disabled checked={true} label="Disabled (on)" />
        </div>
    </section>

    <!-- Required -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Required</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Checkbox required label="Accept terms and conditions" />
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            >, the Checkbox automatically inherits size and error state.
        </p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Preferences" description="Choose your notification preferences.">
                    <Checkbox label="Email notifications" />
                </FormField>
            </div>

            <div class="w-full max-w-sm">
                <FormField label="Agreement" error="You must accept the terms.">
                    <Checkbox label="I accept the terms of service" />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Custom UI -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to override
            classes on specific slots.
        </p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom label & description</p>
                <Checkbox
                    label="Bold primary label"
                    description="Italic description text"
                    checked={true}
                    ui={{
                        label: 'font-bold text-primary',
                        description: 'italic text-tertiary'
                    }}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">
                    Custom root layout & wrapper spacing
                </p>
                <Checkbox
                    label="Wide spacing"
                    description="More gap between checkbox and text."
                    ui={{
                        root: 'gap-1',
                        wrapper: 'ms-4'
                    }}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Rounded checkbox</p>
                <Checkbox
                    label="Fully rounded"
                    checked={true}
                    color="tertiary"
                    ui={{
                        base: 'rounded-full'
                    }}
                />
            </div>
        </div>
    </section>
</div>
