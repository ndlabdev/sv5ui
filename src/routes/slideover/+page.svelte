<script lang="ts">
    import { Slideover, Button, Badge, Icon, Separator } from '$lib/index.js'

    // --- State ---
    let basicOpen = $state(false)
    let leftOpen = $state(false)
    let topOpen = $state(false)
    let bottomOpen = $state(false)
    let insetRightOpen = $state(false)
    let insetLeftOpen = $state(false)
    let insetTopOpen = $state(false)
    let insetBottomOpen = $state(false)
    let noCloseOpen = $state(false)
    let noOverlayOpen = $state(false)
    let noTransitionOpen = $state(false)
    let nonDismissibleOpen = $state(false)
    let slotsOpen = $state(false)
    let customContentOpen = $state(false)
    let titleSlotOpen = $state(false)
    let callbacksOpen = $state(false)
    let callbackLog = $state<string[]>([])
    let noPortalOpen = $state(false)
    let uiOverrideOpen = $state(false)
    let programmaticOpen = $state(false)

    // Real-world demos
    let filtersOpen = $state(false)
    let settingsOpen = $state(false)
    let cartOpen = $state(false)
    let notificationsOpen = $state(false)

    function logCallback(name: string) {
        callbackLog = [...callbackLog.slice(-4), `${new Date().toLocaleTimeString()} — ${name}`]
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Slideover</h1>
        <p class="text-on-surface-variant">
            A slideover panel component built on top of bits-ui Dialog. Slides in from any side with
            support for transitions, inset mode, dismissible control, and full slot customization.
        </p>
    </div>

    <!-- ==================== SIDE VARIANTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Side Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Control which side the slideover appears from with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">side</code> prop.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={basicOpen}
                side="right"
                title="Right Slideover"
                description="Slides in from the right (default)."
            >
                <Button variant="outline" label="Right" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This panel slides in from the right side (default).
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (basicOpen = false)} />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={leftOpen}
                side="left"
                title="Left Slideover"
                description="Slides in from the left."
            >
                <Button variant="outline" label="Left" />
                {#snippet body()}
                    <p class="text-on-surface-variant">This panel slides in from the left side.</p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (leftOpen = false)} />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={topOpen}
                side="top"
                title="Top Slideover"
                description="Slides down from the top."
            >
                <Button variant="outline" label="Top" />
                {#snippet body()}
                    <p class="text-on-surface-variant">This panel slides down from the top.</p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (topOpen = false)} />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={bottomOpen}
                side="bottom"
                title="Bottom Slideover"
                description="Slides up from the bottom."
            >
                <Button variant="outline" label="Bottom" />
                {#snippet body()}
                    <p class="text-on-surface-variant">This panel slides up from the bottom.</p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (bottomOpen = false)} />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== INSET MODE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inset Mode</h2>
        <p class="text-sm text-on-surface-variant">
            Enable <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >inset</code
            > mode to add margins and rounded corners to the slideover.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={insetRightOpen}
                inset
                title="Inset Right"
                description="Inset mode with rounded corners."
            >
                <Button variant="outline" label="Inset (Right)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This slideover has margins and rounded corners, giving it a floating
                        appearance.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (insetRightOpen = false)}
                    />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={insetLeftOpen}
                side="left"
                inset
                title="Inset Left"
                description="Inset mode from the left side."
            >
                <Button variant="outline" label="Inset (Left)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Inset mode from the left with floating panel appearance.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (insetLeftOpen = false)}
                    />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={insetTopOpen}
                side="top"
                inset
                title="Inset Top"
                description="Inset mode from the top."
            >
                <Button variant="outline" label="Inset (Top)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Inset mode from the top with floating panel appearance.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (insetTopOpen = false)}
                    />
                {/snippet}
            </Slideover>

            <Slideover
                bind:open={insetBottomOpen}
                side="bottom"
                inset
                title="Inset Bottom"
                description="Inset mode from the bottom."
            >
                <Button variant="outline" label="Inset (Bottom)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Inset mode from the bottom with floating panel appearance.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (insetBottomOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== TRANSITION ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Transition</h2>
        <p class="text-sm text-on-surface-variant">
            Animations are enabled by default. Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >transition=&#123;false&#125;</code
            >
            to disable.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={noTransitionOpen}
                transition={false}
                title="No Transition"
                description="This slideover appears and disappears instantly."
            >
                <Button variant="outline" label="No Transition" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        No slide or fade animation — the slideover snaps open and closed.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noTransitionOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== CLOSE BUTTON ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Close Button</h2>
        <p class="text-sm text-on-surface-variant">
            Hide the close button with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >close=&#123;false&#125;</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={noCloseOpen}
                close={false}
                title="No Close Button"
                description="The X button is hidden."
            >
                <Button variant="outline" label="No Close Button" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        There's no X button. Use the footer button or Escape key to close.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="solid"
                        color="primary"
                        onclick={() => (noCloseOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== OVERLAY ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Overlay</h2>
        <p class="text-sm text-on-surface-variant">
            Hide the overlay with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >overlay=&#123;false&#125;</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={noOverlayOpen}
                overlay={false}
                title="No Overlay"
                description="The backdrop is hidden."
            >
                <Button variant="outline" label="No Overlay" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The slideover has no backdrop overlay. The page content behind is fully
                        visible.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noOverlayOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== NON-DISMISSIBLE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-Dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >dismissible=&#123;false&#125;</code
            >
            to prevent closing by clicking outside or pressing Escape.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={nonDismissibleOpen}
                dismissible={false}
                close={false}
                title="Non-Dismissible"
                description="You must use the button to close."
            >
                <Button variant="outline" label="Open (Non-Dismissible)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Try clicking outside or pressing Escape — the slideover will not close.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="I Understand"
                        variant="solid"
                        color="primary"
                        onclick={() => (nonDismissibleOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== SLOTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Customize every part: <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">header</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">titleSlot</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >descriptionSlot</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">body</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">footer</code>,
            or replace all with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <!-- Custom header slot -->
            <Slideover bind:open={slotsOpen}>
                <Button variant="outline" label="Custom Header" />
                {#snippet header()}
                    <div class="flex items-center gap-3 p-4 sm:px-6">
                        <div
                            class="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary"
                        >
                            <Icon name="lucide:settings" size="20" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-on-surface">Custom Header</h3>
                            <p class="text-sm text-on-surface-variant">With icon and layout</p>
                        </div>
                    </div>
                {/snippet}
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >header</code
                        > slot replaces the default title + description + close button with fully custom
                        markup.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Cancel" variant="outline" onclick={() => (slotsOpen = false)} />
                    <Button
                        label="Confirm"
                        variant="solid"
                        color="primary"
                        onclick={() => (slotsOpen = false)}
                    />
                {/snippet}
            </Slideover>

            <!-- Custom title/description slots -->
            <Slideover bind:open={titleSlotOpen}>
                <Button variant="outline" label="Custom Title/Desc" />
                {#snippet titleSlot()}
                    <span class="flex items-center gap-2">
                        <Icon name="lucide:sparkles" size="16" class="text-warning" />
                        Rich Title with Icon
                    </span>
                {/snippet}
                {#snippet descriptionSlot()}
                    <span>
                        Description with <Badge
                            variant="soft"
                            color="info"
                            size="xs"
                            label="badge"
                        />
                    </span>
                {/snippet}
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >titleSlot</code
                        >
                        and
                        <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >descriptionSlot</code
                        >
                        let you customize just the title/description while keeping the default header
                        layout.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (titleSlotOpen = false)}
                    />
                {/snippet}
            </Slideover>

            <!-- Full content slot -->
            <Slideover bind:open={customContentOpen} title="Custom Content">
                <Button variant="outline" label="Content Slot" />
                {#snippet content()}
                    <div class="flex h-full flex-col items-center justify-center gap-4 p-6">
                        <div
                            class="flex size-16 items-center justify-center rounded-full bg-success/10"
                        >
                            <Icon name="lucide:check-circle" size="32" class="text-success" />
                        </div>
                        <h3 class="text-xl font-semibold text-on-surface">Action Complete</h3>
                        <p class="text-center text-on-surface-variant">
                            The <code
                                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                                >content</code
                            > slot replaces the entire inner layout (header + body + footer).
                        </p>
                        <Button
                            label="Done"
                            variant="solid"
                            color="primary"
                            onclick={() => (customContentOpen = false)}
                        />
                    </div>
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== CALLBACKS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lifecycle Callbacks</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onOpenChange</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onOpenChangeComplete</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-3 space-y-1">
                {#if callbackLog.length === 0}
                    <p class="text-sm text-on-surface-variant italic">
                        Open/close the slideover to see callback logs...
                    </p>
                {/if}
                {#each callbackLog as log, i (i)}
                    <p class="font-mono text-xs text-on-surface-variant">{log}</p>
                {/each}
            </div>
            <Slideover
                bind:open={callbacksOpen}
                onOpenChange={(v) => logCallback(`onOpenChange(${v})`)}
                onOpenChangeComplete={(v) => logCallback(`onOpenChangeComplete(${v})`)}
                title="Callback Demo"
                description="Check the log above."
            >
                <Button variant="outline" label="Open (With Callbacks)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Open, close, and watch the callback log update in real-time.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (callbacksOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== NO PORTAL ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >portal=&#123;false&#125;</code
            >
            to render inline instead of being portalled to the body.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={noPortalOpen}
                portal={false}
                title="No Portal"
                description="Rendered inline, not in a portal."
            >
                <Button variant="outline" label="Open (No Portal)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This slideover is rendered inline in the DOM.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noPortalOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== PROGRAMMATIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Programmatic Control</h2>
        <p class="text-sm text-on-surface-variant">
            Control the slideover without a trigger by binding
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code> externally.
        </p>
        <div class="flex gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                label="Open Programmatically"
                onclick={() => (programmaticOpen = true)}
            />
            <Slideover
                bind:open={programmaticOpen}
                title="Programmatic Slideover"
                description="Opened without a trigger slot."
            >
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This slideover has no children slot. It was opened by setting
                        <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >open = true</code
                        > externally.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (programmaticOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <!-- ==================== UI OVERRIDES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Prop (Style Overrides)</h2>
        <p class="text-sm text-on-surface-variant">
            Override individual slot styles via the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code> prop.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Slideover
                bind:open={uiOverrideOpen}
                title="Styled Slideover"
                description="Custom styles via the ui prop."
                ui={{
                    content: 'bg-primary-container',
                    title: 'text-on-primary-container',
                    description: 'text-on-primary-container/70'
                }}
            >
                <Button variant="outline" label="Open Styled Slideover" />
                {#snippet body()}
                    <p class="text-on-primary-container/80">
                        This slideover overrides
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >content</code
                        >,
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >title</code
                        >, and
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >description</code
                        > slot classes.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (uiOverrideOpen = false)}
                    />
                {/snippet}
            </Slideover>
        </div>
    </section>

    <Separator />

    <!-- ==================== REAL WORLD EXAMPLES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 sm:grid-cols-2">
            <!-- Filters Panel -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Filters Panel</p>
                <Slideover
                    bind:open={filtersOpen}
                    side="left"
                    title="Filters"
                    description="Refine your search results."
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:sliders-horizontal"
                        label="Filters"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-6">
                            <div>
                                <h4 class="mb-3 text-sm font-medium text-on-surface">Category</h4>
                                <div class="space-y-2">
                                    {#each ['Electronics', 'Clothing', 'Home & Garden', 'Sports'] as category (category)}
                                        <label class="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                class="rounded border-outline-variant text-primary focus:ring-primary"
                                            />
                                            <span class="text-sm text-on-surface-variant"
                                                >{category}</span
                                            >
                                        </label>
                                    {/each}
                                </div>
                            </div>
                            <div>
                                <h4 class="mb-3 text-sm font-medium text-on-surface">
                                    Price Range
                                </h4>
                                <div class="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 class="mb-3 text-sm font-medium text-on-surface">Rating</h4>
                                <div class="space-y-2">
                                    {#each [4, 3, 2, 1] as stars (stars)}
                                        <label class="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="rating"
                                                class="border-outline-variant text-primary focus:ring-primary"
                                            />
                                            <span
                                                class="flex items-center gap-1 text-sm text-on-surface-variant"
                                            >
                                                {stars}+ <Icon
                                                    name="lucide:star"
                                                    size="14"
                                                    class="text-warning"
                                                />
                                            </span>
                                        </label>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Reset"
                            variant="outline"
                            onclick={() => (filtersOpen = false)}
                        />
                        <Button
                            label="Apply Filters"
                            variant="solid"
                            color="primary"
                            onclick={() => (filtersOpen = false)}
                        />
                    {/snippet}
                </Slideover>
            </div>

            <!-- Settings Panel -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Settings Panel</p>
                <Slideover
                    bind:open={settingsOpen}
                    inset
                    title="Settings"
                    description="Customize your experience."
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:settings"
                        label="Settings"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-on-surface">Dark Mode</p>
                                    <p class="text-sm text-on-surface-variant">Enable dark theme</p>
                                </div>
                                <input
                                    type="checkbox"
                                    class="rounded border-outline-variant text-primary focus:ring-primary"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-on-surface">Notifications</p>
                                    <p class="text-sm text-on-surface-variant">
                                        Receive push notifications
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked
                                    class="rounded border-outline-variant text-primary focus:ring-primary"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-on-surface">Sound Effects</p>
                                    <p class="text-sm text-on-surface-variant">
                                        Play sounds for actions
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    class="rounded border-outline-variant text-primary focus:ring-primary"
                                />
                            </div>
                            <div>
                                <p class="mb-2 font-medium text-on-surface">Language</p>
                                <select
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
                                >
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Cancel"
                            variant="outline"
                            onclick={() => (settingsOpen = false)}
                        />
                        <Button
                            label="Save Changes"
                            variant="solid"
                            color="primary"
                            onclick={() => (settingsOpen = false)}
                        />
                    {/snippet}
                </Slideover>
            </div>

            <!-- Shopping Cart -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Shopping Cart</p>
                <Slideover
                    bind:open={cartOpen}
                    title="Shopping Cart"
                    description="3 items in your cart"
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:shopping-cart"
                        label="Cart (3)"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-4">
                            {#each [{ name: 'Wireless Headphones', price: '$199.99', qty: 1 }, { name: 'USB-C Cable', price: '$19.99', qty: 2 }, { name: 'Phone Case', price: '$29.99', qty: 1 }] as item (item.name)}
                                <div
                                    class="flex items-center gap-3 rounded-lg bg-surface-container p-3"
                                >
                                    <div
                                        class="size-12 rounded-md bg-surface-container-highest"
                                    ></div>
                                    <div class="flex-1">
                                        <p class="font-medium text-on-surface">{item.name}</p>
                                        <p class="text-sm text-on-surface-variant">
                                            Qty: {item.qty}
                                        </p>
                                    </div>
                                    <p class="font-medium text-on-surface">{item.price}</p>
                                </div>
                            {/each}
                            <div class="border-t border-outline-variant pt-4">
                                <div class="flex justify-between">
                                    <span class="text-on-surface-variant">Subtotal</span>
                                    <span class="font-medium text-on-surface">$269.96</span>
                                </div>
                                <div class="mt-1 flex justify-between">
                                    <span class="text-on-surface-variant">Shipping</span>
                                    <span class="font-medium text-on-surface">$9.99</span>
                                </div>
                                <div
                                    class="mt-2 flex justify-between border-t border-outline-variant pt-2"
                                >
                                    <span class="font-semibold text-on-surface">Total</span>
                                    <span class="font-semibold text-on-surface">$279.95</span>
                                </div>
                            </div>
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Continue Shopping"
                            variant="outline"
                            onclick={() => (cartOpen = false)}
                        />
                        <Button
                            label="Checkout"
                            variant="solid"
                            color="primary"
                            onclick={() => (cartOpen = false)}
                        />
                    {/snippet}
                </Slideover>
            </div>

            <!-- Notifications Panel -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Notifications Panel</p>
                <Slideover
                    bind:open={notificationsOpen}
                    title="Notifications"
                    description="You have 5 unread notifications"
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:bell"
                        label="Notifications"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-3">
                            {#each [{ icon: 'lucide:package', title: 'Order shipped', desc: 'Your order #1234 has been shipped', time: '2m ago', color: 'text-info' }, { icon: 'lucide:user-plus', title: 'New follower', desc: 'John Doe started following you', time: '1h ago', color: 'text-primary' }, { icon: 'lucide:message-circle', title: 'New comment', desc: 'Sarah commented on your post', time: '3h ago', color: 'text-success' }, { icon: 'lucide:heart', title: 'Post liked', desc: 'Your post received 100 likes', time: '5h ago', color: 'text-error' }, { icon: 'lucide:calendar', title: 'Event reminder', desc: 'Team meeting in 30 minutes', time: '1d ago', color: 'text-warning' }] as notif (notif.title)}
                                <div class="flex gap-3 rounded-lg bg-surface-container p-3">
                                    <div
                                        class={`flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest ${notif.color}`}
                                    >
                                        <Icon name={notif.icon} size="18" />
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-medium text-on-surface">{notif.title}</p>
                                        <p class="text-sm text-on-surface-variant">{notif.desc}</p>
                                        <p class="mt-1 text-xs text-on-surface-variant">
                                            {notif.time}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Mark all as read"
                            variant="outline"
                            class="w-full"
                            onclick={() => (notificationsOpen = false)}
                        />
                    {/snippet}
                </Slideover>
            </div>
        </div>
    </section>
</div>
