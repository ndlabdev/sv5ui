<script lang="ts">
    import { Switch, FormField, Separator } from '$lib/index.js'

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
    <h1 class="text-2xl font-bold text-on-surface">Switch</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">A toggle switch component for binary states.</p>
        <Switch />
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:checked</code
            > for reactive two-way data binding.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <Switch bind:checked={bindChecked} label="Toggle me" />
            <p class="text-sm text-on-surface-variant">
                Checked: <span class="font-mono text-on-surface">{bindChecked}</span>
            </p>
        </div>
    </section>

    <!-- Label & Description -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Label &amp; Description</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >description</code
            > to add text next to the switch.
        </p>
        <div class="flex flex-col gap-4">
            <Switch label="Notifications" />
            <Switch label="Dark mode" description="Enable dark mode for the application." />
            <Switch
                label="Marketing emails"
                description="Receive emails about new products and features."
            />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > to control the checked background color.
        </p>
        <div class="flex flex-wrap gap-6">
            {#each colors as color (color)}
                <Switch {color} checked={true} label={color} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to
            control the dimensions.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            {#each sizes as size (size)}
                <Switch {size} checked={true} label={size} />
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >checkedIcon</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >uncheckedIcon</code
            > to display icons inside the thumb.
        </p>
        <div class="flex flex-col gap-4">
            <Switch
                checkedIcon="lucide:check"
                uncheckedIcon="lucide:x"
                label="With check / x icons"
            />
            <Switch
                checkedIcon="lucide:sun"
                uncheckedIcon="lucide:moon"
                label="Theme toggle"
                description="Switch between light and dark mode."
            />
            <Switch checkedIcon="lucide:volume-2" uncheckedIcon="lucide:volume-x" label="Sound" />
            <Switch
                checkedIcon="lucide:wifi"
                uncheckedIcon="lucide:wifi-off"
                label="Wi-Fi"
                color="success"
            />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >loading</code
            > to show a spinner inside the thumb and disable interaction.
        </p>
        <div class="flex flex-col gap-4">
            <Switch loading label="Syncing..." />
            <Switch loading checked={true} label="Saving preferences..." color="success" />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            > to prevent interaction.
        </p>
        <div class="flex flex-wrap gap-6">
            <Switch disabled label="Disabled (off)" />
            <Switch disabled checked={true} label="Disabled (on)" />
        </div>
    </section>

    <!-- Required -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Required</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >required</code
            > to show an asterisk next to the label.
        </p>
        <Switch required label="Accept terms and conditions" />
    </section>

    <!-- Custom Slots -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >labelSlot</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >descriptionSlot</code
            > for fully custom label content.
        </p>
        <div class="flex flex-col gap-4">
            <Switch checked={true} color="success">
                {#snippet labelSlot()}
                    <span class="flex items-center gap-1.5 text-sm font-medium text-on-surface">
                        <span class="inline-block size-2 rounded-full bg-success"></span>
                        System online
                    </span>
                {/snippet}
                {#snippet descriptionSlot()}
                    <span class="text-xs text-on-surface-variant">
                        All services are running normally. Last checked <strong>just now</strong>.
                    </span>
                {/snippet}
            </Switch>

            <Switch>
                {#snippet labelSlot()}
                    <span class="flex items-center gap-2 text-sm font-medium text-on-surface">
                        Beta features
                        <span
                            class="rounded bg-tertiary-container px-1.5 py-0.5 text-[10px] font-bold text-on-tertiary-container"
                            >BETA</span
                        >
                    </span>
                {/snippet}
            </Switch>
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code
            >, the Switch automatically inherits size and error state.
        </p>
        <div class="max-w-sm space-y-4">
            <FormField label="Notifications" description="Choose how you want to be notified.">
                <Switch label="Push notifications" />
            </FormField>
            <FormField label="Agreement" error="You must accept the terms.">
                <Switch label="I accept the terms of service" />
            </FormField>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Notification preferences</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <Switch
                        checked={true}
                        label="Push notifications"
                        description="Receive alerts on your device."
                        color="primary"
                    />
                    <Switch
                        checked={true}
                        label="Email digest"
                        description="Daily summary of activity."
                        color="primary"
                    />
                    <Switch
                        label="SMS alerts"
                        description="Text messages for critical updates."
                        color="primary"
                    />
                    <Switch
                        loading
                        label="Marketing emails"
                        description="Updating preference..."
                        color="primary"
                    />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Privacy settings</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <Switch
                        checked={true}
                        checkedIcon="lucide:eye"
                        uncheckedIcon="lucide:eye-off"
                        label="Profile visibility"
                        description="Make your profile public."
                        color="secondary"
                    />
                    <Switch
                        checkedIcon="lucide:share-2"
                        uncheckedIcon="lucide:share-2"
                        label="Data sharing"
                        description="Share usage data to improve the product."
                        color="secondary"
                    />
                    <Switch
                        checked={true}
                        checkedIcon="lucide:shield-check"
                        uncheckedIcon="lucide:shield-off"
                        label="Two-factor auth"
                        description="Add an extra layer of security."
                        color="success"
                        disabled
                    />
                </div>
            </div>
        </div>
    </section>
</div>
