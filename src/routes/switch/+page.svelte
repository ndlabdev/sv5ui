<script lang="ts">
    import { Switch, FormField } from '$lib/index.js'

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
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Switch</h1>
        <p class="text-on-surface-variant">
            A toggle switch component for binary states with customizable colors, sizes, icons, and
            FormField integration.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Switch />
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
            <Switch bind:checked={bindChecked} />
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
            next to the switch.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Switch label="Notifications" />
            <Switch label="Dark mode" description="Enable dark mode for the application." />
            <Switch
                label="Marketing emails"
                description="Receive emails about new products and features."
            />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <div class="flex flex-col items-center gap-2">
                    <Switch {color} checked={true} label={color} />
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
                <Switch {size} checked={true} label={size} />
            {/each}
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">checkedIcon</code> and
            <code class="rounded bg-surface-container-highest px-1">uncheckedIcon</code> to display icons
            inside the thumb.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Switch
                checkedIcon="lucide:check"
                uncheckedIcon="lucide:x"
                label="With check/x icons"
            />
            <Switch
                checkedIcon="lucide:sun"
                uncheckedIcon="lucide:moon"
                label="Theme toggle"
                description="Switch between light and dark mode."
            />
            <Switch checkedIcon="lucide:volume-2" uncheckedIcon="lucide:volume-x" label="Sound" />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to show
            a loading spinner inside the thumb.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <Switch loading label="Syncing..." />
            <Switch loading checked={true} label="Saving preferences..." color="success" />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Switch disabled label="Disabled (off)" />
            <Switch disabled checked={true} label="Disabled (on)" />
        </div>
    </section>

    <!-- Required -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Required</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <Switch required label="Accept terms and conditions" />
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            >, the Switch automatically inherits size and error state.
        </p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Notifications" description="Choose how you want to be notified.">
                    <Switch label="Push notifications" />
                </FormField>
            </div>

            <div class="w-full max-w-sm">
                <FormField label="Agreement" error="You must accept the terms.">
                    <Switch label="I accept the terms of service" />
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
                <Switch
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
                <p class="mb-2 text-xs text-on-surface-variant">Rounded track with shadow thumb</p>
                <Switch
                    label="Elevated switch"
                    checked={true}
                    color="success"
                    ui={{
                        base: 'shadow-inner rounded-lg',
                        thumb: 'shadow-xl rounded-lg'
                    }}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">
                    Custom root layout & wrapper spacing
                </p>
                <Switch
                    label="Wide spacing"
                    description="More gap between switch and text."
                    ui={{
                        root: 'gap-1',
                        wrapper: 'ms-4'
                    }}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom container height</p>
                <Switch
                    label="Taller container"
                    checked={true}
                    color="tertiary"
                    ui={{
                        container: 'h-7'
                    }}
                />
            </div>
        </div>
    </section>
</div>
