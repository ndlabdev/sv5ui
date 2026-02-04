<script lang="ts">
    import { Modal, Button, Badge, Icon, Separator } from '$lib/index.js'

    // --- State ---
    let basicOpen = $state(false)
    let fullscreenOpen = $state(false)
    let scrollableOpen = $state(false)
    let scrollableFullscreenOpen = $state(false)
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
    let confirmOpen = $state(false)
    let formOpen = $state(false)
    let alertOpen = $state(false)
    let imageOpen = $state(false)

    function logCallback(name: string) {
        callbackLog = [...callbackLog.slice(-4), `${new Date().toLocaleTimeString()} — ${name}`]
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Modal</h1>
        <p class="text-on-surface-variant">
            A modal dialog component built on top of bits-ui Dialog. Supports transitions,
            fullscreen, scrollable mode, dismissible control, and full slot customization.
        </p>
    </div>

    <!-- ==================== BASIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={basicOpen}
                title="Basic Modal"
                description="This is a basic modal with title, description, body and footer."
            >
                <Button variant="outline" label="Open Modal" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        A centered modal dialog. Click the X button, press Escape, or click outside
                        to close.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Cancel" variant="outline" onclick={() => (basicOpen = false)} />
                    <Button
                        label="Confirm"
                        variant="solid"
                        color="primary"
                        onclick={() => (basicOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== FULLSCREEN ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Fullscreen</h2>
        <p class="text-sm text-on-surface-variant">
            Enable fullscreen mode to cover the entire viewport.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={fullscreenOpen}
                fullscreen
                title="Fullscreen Modal"
                description="This modal takes up the entire screen."
            >
                <Button variant="outline" label="Open Fullscreen" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The modal covers the entire viewport. Useful for complex forms, media
                        viewers, or immersive content.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (fullscreenOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== SCROLLABLE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Scrollable</h2>
        <p class="text-sm text-on-surface-variant">
            When <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >scrollable</code
            >
            is
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">true</code>,
            the entire overlay scrolls with the content placed inside it. When
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">false</code> (default),
            only the body area scrolls.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={scrollableOpen}
                scrollable
                title="Scrollable Modal"
                description="Content scrolls within the overlay."
            >
                <Button variant="outline" label="Scrollable" />
                {#snippet body()}
                    <div class="space-y-3">
                        <p class="text-on-surface-variant">
                            The entire overlay area is scrollable. The modal scrolls within the
                            viewport.
                        </p>
                        {#each Array(20) as _, i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">
                                    Scrollable item {i + 1}
                                </p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (scrollableOpen = false)}
                    />
                {/snippet}
            </Modal>

            <Modal
                bind:open={scrollableFullscreenOpen}
                scrollable
                fullscreen
                title="Scrollable + Fullscreen"
                description="Fullscreen with scrollable overlay."
            >
                <Button variant="outline" label="Scrollable + Fullscreen" />
                {#snippet body()}
                    <div class="space-y-3">
                        {#each Array(30) as _, i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Item {i + 1}</p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (scrollableFullscreenOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== TRANSITION ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Transition</h2>
        <p class="text-sm text-on-surface-variant">
            Animations are enabled by default. Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >transition={'{'}false{'}'}</code
            >
            to disable.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={noTransitionOpen}
                transition={false}
                title="No Transition"
                description="This modal appears and disappears instantly."
            >
                <Button variant="outline" label="No Transition" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        No fade or scale animation — the modal snaps open and closed.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noTransitionOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== CLOSE BUTTON ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Close Button</h2>
        <p class="text-sm text-on-surface-variant">
            Hide the close button with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >close={'{'}false{'}'}</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
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
            </Modal>
        </div>
    </section>

    <!-- ==================== OVERLAY ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Overlay</h2>
        <p class="text-sm text-on-surface-variant">
            Hide the overlay with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >overlay={'{'}false{'}'}</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={noOverlayOpen}
                overlay={false}
                title="No Overlay"
                description="The backdrop is hidden."
            >
                <Button variant="outline" label="No Overlay" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The modal has no backdrop overlay. The page content behind is fully visible.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noOverlayOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== NON-DISMISSIBLE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-Dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >dismissible={'{'}false{'}'}</code
            >
            to prevent closing by clicking outside or pressing Escape.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={nonDismissibleOpen}
                dismissible={false}
                close={false}
                title="Non-Dismissible"
                description="You must use the button to close."
            >
                <Button variant="outline" label="Open (Non-Dismissible)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Try clicking outside or pressing Escape — the modal will not close.
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
            </Modal>
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
            <Modal bind:open={slotsOpen}>
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
            </Modal>

            <!-- Custom title/description slots -->
            <Modal bind:open={titleSlotOpen}>
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
            </Modal>

            <!-- Full content slot -->
            <Modal bind:open={customContentOpen} title="Custom Content">
                <Button variant="outline" label="Content Slot" />
                {#snippet content()}
                    <div class="flex flex-col items-center gap-4 p-6">
                        <div
                            class="flex size-16 items-center justify-center rounded-full bg-success/10"
                        >
                            <Icon name="lucide:check-circle" size="32" class="text-success" />
                        </div>
                        <h3 class="text-xl font-semibold text-on-surface">Payment Successful</h3>
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
            </Modal>
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
                        Open/close the modal to see callback logs...
                    </p>
                {/if}
                {#each callbackLog as log}
                    <p class="font-mono text-xs text-on-surface-variant">{log}</p>
                {/each}
            </div>
            <Modal
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
            </Modal>
        </div>
    </section>

    <!-- ==================== NO PORTAL ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >portal={'{'}false{'}'}</code
            >
            to render inline instead of being portalled to the body.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={noPortalOpen}
                portal={false}
                title="No Portal"
                description="Rendered inline, not in a portal."
            >
                <Button variant="outline" label="Open (No Portal)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">This modal is rendered inline in the DOM.</p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noPortalOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- ==================== PROGRAMMATIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Programmatic Control</h2>
        <p class="text-sm text-on-surface-variant">
            Control the modal without a trigger by binding
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code> externally.
        </p>
        <div class="flex gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                label="Open Programmatically"
                onclick={() => (programmaticOpen = true)}
            />
            <Modal
                bind:open={programmaticOpen}
                title="Programmatic Modal"
                description="Opened without a trigger slot."
            >
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This modal has no children slot. It was opened by setting
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
            </Modal>
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
            <Modal
                bind:open={uiOverrideOpen}
                title="Styled Modal"
                description="Custom styles via the ui prop."
                ui={{
                    content: 'bg-primary-container ring-primary-container',
                    title: 'text-on-primary-container',
                    description: 'text-on-primary-container/70'
                }}
            >
                <Button variant="outline" label="Open Styled Modal" />
                {#snippet body()}
                    <p class="text-on-primary-container/80">
                        This modal overrides
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
            </Modal>
        </div>
    </section>

    <Separator />

    <!-- ==================== REAL WORLD EXAMPLES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 sm:grid-cols-2">
            <!-- Confirmation Modal -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Confirmation Dialog</p>
                <Modal bind:open={confirmOpen} dismissible={false} close={false}>
                    <Button
                        variant="outline"
                        leadingIcon="lucide:trash-2"
                        label="Delete Item"
                        color="error"
                        class="w-full"
                    />
                    {#snippet content()}
                        <div class="flex flex-col items-center gap-4 p-6 text-center">
                            <div
                                class="flex size-14 items-center justify-center rounded-full bg-error/10"
                            >
                                <Icon name="lucide:alert-triangle" size="28" class="text-error" />
                            </div>
                            <h3 class="text-lg font-semibold text-on-surface">Delete Item?</h3>
                            <p class="text-sm text-on-surface-variant">
                                This action is permanent and cannot be undone.
                            </p>
                            <div class="flex w-full gap-2">
                                <Button
                                    label="Cancel"
                                    variant="outline"
                                    class="flex-1"
                                    onclick={() => (confirmOpen = false)}
                                />
                                <Button
                                    label="Delete"
                                    variant="solid"
                                    color="error"
                                    class="flex-1"
                                    onclick={() => (confirmOpen = false)}
                                />
                            </div>
                        </div>
                    {/snippet}
                </Modal>
            </div>

            <!-- Form Modal -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Form Modal</p>
                <Modal
                    bind:open={formOpen}
                    title="Create New Project"
                    description="Fill in the details below to create a new project."
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:plus"
                        label="New Project"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-4">
                            <div>
                                <label
                                    for="name"
                                    class="mb-1.5 block text-sm font-medium text-on-surface"
                                    >Project Name</label
                                >
                                <input
                                    type="text"
                                    id="name"
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    placeholder="My Awesome Project"
                                />
                            </div>
                            <div>
                                <label
                                    for="desc"
                                    class="mb-1.5 block text-sm font-medium text-on-surface"
                                    >Description</label
                                >
                                <textarea
                                    id="desc"
                                    rows="3"
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    placeholder="A brief description of your project..."
                                ></textarea>
                            </div>
                            <div>
                                <label
                                    for="visibility"
                                    class="mb-1.5 block text-sm font-medium text-on-surface"
                                    >Visibility</label
                                >
                                <select
                                    id="visibility"
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    <option>Public</option>
                                    <option>Private</option>
                                    <option>Team Only</option>
                                </select>
                            </div>
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Cancel"
                            variant="outline"
                            onclick={() => (formOpen = false)}
                        />
                        <Button
                            label="Create Project"
                            variant="solid"
                            color="primary"
                            onclick={() => (formOpen = false)}
                        />
                    {/snippet}
                </Modal>
            </div>

            <!-- Alert Modal -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Alert / Info</p>
                <Modal bind:open={alertOpen}>
                    <Button
                        variant="outline"
                        leadingIcon="lucide:info"
                        label="Show Alert"
                        class="w-full"
                    />
                    {#snippet content()}
                        <div class="flex flex-col items-center gap-4 p-6 text-center">
                            <div
                                class="flex size-14 items-center justify-center rounded-full bg-info/10"
                            >
                                <Icon name="lucide:info" size="28" class="text-info" />
                            </div>
                            <h3 class="text-lg font-semibold text-on-surface">
                                New Features Available
                            </h3>
                            <p class="text-sm text-on-surface-variant">
                                We've added new features to improve your experience. Check out the
                                changelog for more details.
                            </p>
                            <Button
                                label="Got it!"
                                variant="solid"
                                color="primary"
                                class="w-full"
                                onclick={() => (alertOpen = false)}
                            />
                        </div>
                    {/snippet}
                </Modal>
            </div>

            <!-- Scrollable Long Content -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Scrollable Long Content</p>
                <Modal
                    bind:open={imageOpen}
                    scrollable
                    title="Terms of Service"
                    description="Please read and accept the terms below."
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:scroll-text"
                        label="Terms"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-4 text-sm text-on-surface-variant">
                            {#each Array(15) as _, i (i)}
                                <div>
                                    <h4 class="mb-1 font-medium text-on-surface">
                                        Section {i + 1}
                                    </h4>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            {/each}
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Decline"
                            variant="outline"
                            onclick={() => (imageOpen = false)}
                        />
                        <Button
                            label="Accept"
                            variant="solid"
                            color="primary"
                            onclick={() => (imageOpen = false)}
                        />
                    {/snippet}
                </Modal>
            </div>
        </div>
    </section>
</div>
