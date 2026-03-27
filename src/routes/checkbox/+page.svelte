<script lang="ts">
    import { Checkbox, FormField, Separator } from '$lib/index.js'

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

    let allChecked = $state(false)
    let items = $state([
        { label: 'Emails', checked: false },
        { label: 'Push notifications', checked: false },
        { label: 'SMS alerts', checked: false }
    ])

    function syncSelectAll() {
        const all = items.every((i) => i.checked)
        const none = items.every((i) => !i.checked)
        allChecked = all
        indeterminate = !all && !none
    }

    function toggleAll(checked: boolean) {
        allChecked = checked
        indeterminate = false
        items = items.map((i) => ({ ...i, checked }))
    }
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Checkbox</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A checkbox component for boolean and indeterminate states.
        </p>
        <div class="flex flex-wrap gap-6">
            <Checkbox />
            <Checkbox checked={true} />
        </div>
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
            <Checkbox bind:checked={bindChecked} label="Toggle me" />
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
            > to add text next to the checkbox.
        </p>
        <div class="flex flex-col gap-4">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Indeterminate</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:indeterminate</code
            > for tri-state behavior, useful for "select all" patterns.
        </p>
        <div class="flex flex-col gap-3">
            <Checkbox
                checked={allChecked}
                {indeterminate}
                label="Select all"
                onCheckedChange={toggleAll}
            />
            <div class="ms-6 flex flex-col gap-2">
                {#each items as item, i (item.label)}
                    <Checkbox
                        bind:checked={items[i].checked}
                        label={item.label}
                        onCheckedChange={() => syncSelectAll()}
                    />
                {/each}
            </div>
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
                <Checkbox {color} checked={true} label={color} />
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
                <Checkbox {size} checked={true} label={size} />
            {/each}
        </div>
    </section>

    <!-- Variant -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variant</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant="card"</code
            > to display the checkbox inside a bordered card. The border highlights when checked.
        </p>
        <div class="flex max-w-sm flex-col gap-3">
            <Checkbox
                variant="card"
                label="Email notifications"
                description="Receive alerts in your inbox."
            />
            <Checkbox
                variant="card"
                checked={true}
                label="Push notifications"
                description="Alerts on your device."
                color="primary"
            />
            <Checkbox
                variant="card"
                checked={true}
                label="SMS alerts"
                description="Text messages for critical updates."
                color="success"
            />
            <Checkbox
                variant="card"
                disabled
                label="Fax (unavailable)"
                description="This option is currently disabled."
            />
        </div>
    </section>

    <!-- Indicator -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Indicator Position</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >indicator</code
            >
            to control where the checkbox appears:
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">start</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">end</code>, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">hidden</code>.
        </p>
        <div class="flex max-w-sm flex-col gap-4">
            <Checkbox
                indicator="start"
                label="Start (default)"
                description="Checkbox on the left."
            />
            <Checkbox
                indicator="end"
                label="End"
                description="Checkbox on the right."
                checked={true}
            />
            <Checkbox
                indicator="hidden"
                label="Hidden"
                description="Checkbox hidden, label only."
                checked={true}
                color="secondary"
            />
        </div>
        <div class="flex max-w-sm flex-col gap-3">
            <p class="text-xs text-on-surface-variant">Combined with card variant</p>
            <Checkbox
                variant="card"
                indicator="end"
                label="Opt in to beta features"
                description="Get early access to new features."
                checked={true}
                color="tertiary"
            />
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >indeterminateIcon</code
            > to customize the icons.
        </p>
        <div class="flex flex-col gap-4">
            <Checkbox icon="lucide:heart" checked={true} label="Favorite" color="error" />
            <Checkbox icon="lucide:star" checked={true} label="Starred" color="warning" />
            <Checkbox icon="lucide:thumbs-up" checked={true} label="Liked" color="success" />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >loading</code
            > to show a spinner and disable interaction.
        </p>
        <div class="flex flex-col gap-4">
            <Checkbox loading label="Syncing..." />
            <Checkbox loading checked={true} label="Saving preferences..." color="success" />
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
            <Checkbox disabled label="Disabled (off)" />
            <Checkbox disabled checked={true} label="Disabled (on)" />
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
        <Checkbox required label="Accept terms and conditions" />
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
            <Checkbox checked={true} color="success">
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
            </Checkbox>

            <Checkbox>
                {#snippet labelSlot()}
                    <span class="flex items-center gap-2 text-sm font-medium text-on-surface">
                        Beta features
                        <span
                            class="rounded bg-tertiary-container px-1.5 py-0.5 text-[10px] font-bold text-on-tertiary-container"
                            >BETA</span
                        >
                    </span>
                {/snippet}
            </Checkbox>
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code
            >, the Checkbox automatically inherits size and error state.
        </p>
        <div class="max-w-sm space-y-4">
            <FormField label="Preferences" description="Choose your notification preferences.">
                <Checkbox label="Email notifications" />
            </FormField>
            <FormField label="Agreement" error="You must accept the terms.">
                <Checkbox label="I accept the terms of service" />
            </FormField>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Notification preferences (list)</p>
                <div
                    class="max-w-sm space-y-3 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <Checkbox
                        checked={true}
                        label="Email digest"
                        description="Daily summary of activity."
                        color="primary"
                    />
                    <Checkbox
                        checked={true}
                        label="Push notifications"
                        description="Alerts on your device."
                        color="primary"
                    />
                    <Checkbox
                        label="SMS alerts"
                        description="Text messages for critical updates."
                        color="primary"
                    />
                    <Checkbox
                        loading
                        label="Marketing emails"
                        description="Updating preference..."
                        color="primary"
                    />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Plan selection (card variant)</p>
                <div class="max-w-sm space-y-3">
                    <Checkbox
                        variant="card"
                        indicator="end"
                        checked={true}
                        color="primary"
                        label="Starter"
                        description="$9/mo · Up to 3 projects"
                    />
                    <Checkbox
                        variant="card"
                        indicator="end"
                        color="primary"
                        label="Pro"
                        description="$29/mo · Unlimited projects"
                    />
                    <Checkbox
                        variant="card"
                        indicator="end"
                        color="primary"
                        label="Enterprise"
                        description="Custom pricing · SSO + advanced security"
                    />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Permissions (hidden indicator)</p>
                <div
                    class="max-w-sm space-y-2 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <Checkbox indicator="hidden" checked={true} color="success">
                        {#snippet labelSlot()}
                            <span
                                class="flex w-full items-center justify-between text-sm text-on-surface"
                            >
                                Read
                                <span
                                    class="rounded bg-success-container px-1.5 py-0.5 text-[10px] font-semibold text-on-success-container"
                                    >Granted</span
                                >
                            </span>
                        {/snippet}
                    </Checkbox>
                    <Checkbox indicator="hidden" checked={true} color="success">
                        {#snippet labelSlot()}
                            <span
                                class="flex w-full items-center justify-between text-sm text-on-surface"
                            >
                                Write
                                <span
                                    class="rounded bg-success-container px-1.5 py-0.5 text-[10px] font-semibold text-on-success-container"
                                    >Granted</span
                                >
                            </span>
                        {/snippet}
                    </Checkbox>
                    <Checkbox indicator="hidden">
                        {#snippet labelSlot()}
                            <span
                                class="flex w-full items-center justify-between text-sm text-on-surface-variant"
                            >
                                Admin
                                <span
                                    class="rounded bg-surface-container-highest px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant"
                                    >Denied</span
                                >
                            </span>
                        {/snippet}
                    </Checkbox>
                </div>
            </div>
        </div>
    </section>
</div>
