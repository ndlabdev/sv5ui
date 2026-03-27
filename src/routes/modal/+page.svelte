<script lang="ts">
    import { Modal, Button, Badge, Icon, Separator } from '$lib/index.js'

    let basicOpen = $state(false)
    let fullscreenOpen = $state(false)
    let scrollableOpen = $state(false)
    let scrollableFullscreenOpen = $state(false)
    let noCloseOpen = $state(false)
    let noOverlayOpen = $state(false)
    let noTransitionOpen = $state(false)
    let nonDismissibleOpen = $state(false)
    let slotsOpen = $state(false)
    let actionsOpen = $state(false)
    let customContentOpen = $state(false)
    let callbacksOpen = $state(false)
    let callbackLog = $state<string[]>([])
    let uiOverrideOpen = $state(false)
    let programmaticOpen = $state(false)

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
            A modal dialog component built on bits-ui Dialog. Supports transitions, fullscreen,
            scrollable mode, dismissible control, and full slot customization.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={basicOpen}
                title="Basic Modal"
                description="This is a basic modal with title, description, body and footer."
            >
                <Button variant="outline" label="Open Modal" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        A centered modal dialog. Click the X, press Escape, or click outside to
                        close.
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

    <!-- Fullscreen -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Fullscreen</h2>
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
                        Covers the entire viewport. Useful for complex forms or media viewers.
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

    <!-- Scrollable -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Scrollable</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={scrollableOpen}
                scrollable
                title="Scrollable Modal"
                description="The entire modal scrolls within the overlay."
            >
                <Button variant="outline" label="Scrollable" />
                {#snippet body()}
                    <div class="space-y-3">
                        {#each Array.from({ length: 20 }, (_, i) => i) as i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Content item {i + 1}</p>
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
                description="Full viewport with scrollable content."
            >
                <Button variant="outline" label="Scrollable + Fullscreen" />
                {#snippet body()}
                    <div class="space-y-3">
                        {#each Array.from({ length: 30 }, (_, i) => i) as i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Content item {i + 1}</p>
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

    <!-- Options -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Options</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={noTransitionOpen}
                transition={false}
                title="No Transition"
                description="Appears instantly without animation."
            >
                <Button variant="outline" label="No Transition" />
                {#snippet body()}
                    <p class="text-on-surface-variant">Modal opens and closes without animation.</p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noTransitionOpen = false)}
                    />
                {/snippet}
            </Modal>

            <Modal
                bind:open={noCloseOpen}
                close={false}
                title="No Close Button"
                description="Close button is hidden."
            >
                <Button variant="outline" label="No Close Button" />
                {#snippet body()}
                    <p class="text-on-surface-variant">Use the footer button or Escape to close.</p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (noCloseOpen = false)} />
                {/snippet}
            </Modal>

            <Modal
                bind:open={noOverlayOpen}
                overlay={false}
                title="No Overlay"
                description="Background is visible."
            >
                <Button variant="outline" label="No Overlay" />
                {#snippet body()}
                    <p class="text-on-surface-variant">No backdrop overlay behind the modal.</p>
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

    <!-- Non-Dismissible -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-Dismissible</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={nonDismissibleOpen}
                dismissible={false}
                title="Non-Dismissible"
                description="Must use the close button."
            >
                <Button variant="outline" label="Open (Non-Dismissible)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Clicking outside or pressing Escape won't close this modal.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="solid"
                        color="primary"
                        onclick={() => (nonDismissibleOpen = false)}
                    />
                {/snippet}
            </Modal>
        </div>
    </section>

    <!-- Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Slots</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <!-- Custom header -->
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
                        The header slot replaces the default title, description, and close button.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <div class="flex gap-2">
                        <Button
                            label="Cancel"
                            variant="outline"
                            onclick={() => (slotsOpen = false)}
                        />
                        <Button
                            label="Save"
                            variant="solid"
                            color="primary"
                            onclick={() => (slotsOpen = false)}
                        />
                    </div>
                {/snippet}
            </Modal>

            <!-- Actions slot -->
            <Modal
                bind:open={actionsOpen}
                title="User Profile"
                description="Manage your account settings."
            >
                <Button variant="outline" label="Actions Slot" />
                {#snippet actions()}
                    <Badge variant="soft" color="success" size="xs" label="Active" />
                    <Badge variant="soft" color="info" size="xs" label="Pro" />
                {/snippet}
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The actions slot renders between the title/description and the close button.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (actionsOpen = false)} />
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
                            The content slot replaces the entire inner layout.
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

    <!-- Lifecycle Callbacks -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lifecycle Callbacks</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-3 space-y-1">
                {#if callbackLog.length === 0}
                    <p class="text-sm text-on-surface-variant italic">
                        Open/close the modal to see callback logs...
                    </p>
                {/if}
                {#each callbackLog as log, i (i)}
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
                        Open, close, and watch the callback log update.
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

    <!-- Programmatic Control -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Programmatic Control</h2>
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
                        This modal has no trigger. It was opened by setting open = true externally.
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

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Modal
                bind:open={uiOverrideOpen}
                title="Styled Modal"
                description="Custom styles via the ui prop."
                ui={{
                    content: 'bg-primary-container',
                    title: 'text-on-primary-container',
                    description: 'text-on-primary-container/70',
                    header: 'border-on-primary-container/10'
                }}
            >
                <Button variant="outline" label="Open Styled Modal" />
                {#snippet body()}
                    <p class="text-on-primary-container/80">
                        This modal overrides content, title, description, and header slot classes.
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

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <!-- Confirmation Dialog -->
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
                            <h3 class="text-lg font-semibold text-on-surface">Delete this item?</h3>
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
                    title="Create Project"
                    description="Fill in the details to create a new project."
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
                                    for="project-name"
                                    class="mb-1 block text-sm font-medium text-on-surface"
                                    >Project Name</label
                                >
                                <input
                                    id="project-name"
                                    type="text"
                                    placeholder="My Project"
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    for="project-desc"
                                    class="mb-1 block text-sm font-medium text-on-surface"
                                    >Description</label
                                >
                                <textarea
                                    id="project-desc"
                                    rows="3"
                                    placeholder="Describe your project..."
                                    class="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                ></textarea>
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
                            label="Create"
                            variant="solid"
                            color="primary"
                            onclick={() => (formOpen = false)}
                        />
                    {/snippet}
                </Modal>
            </div>

            <!-- Alert Modal -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Alert Modal</p>
                <Modal
                    bind:open={alertOpen}
                    title="Session Expired"
                    description="Your session has timed out due to inactivity."
                    dismissible={false}
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:clock"
                        label="Session Alert"
                        class="w-full"
                    />
                    {#snippet body()}
                        <p class="text-on-surface-variant">
                            Please sign in again to continue using the application.
                        </p>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Sign In"
                            variant="solid"
                            color="primary"
                            class="w-full"
                            onclick={() => (alertOpen = false)}
                        />
                    {/snippet}
                </Modal>
            </div>

            <!-- Image Preview -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Image Preview</p>
                <Modal bind:open={imageOpen} close={{ color: 'surface', size: 'md' }}>
                    <Button
                        variant="outline"
                        leadingIcon="lucide:image"
                        label="View Image"
                        class="w-full"
                    />
                    {#snippet content()}
                        <div class="p-2">
                            <img
                                src="https://picsum.photos/800/600"
                                alt="Preview"
                                class="w-full rounded-md"
                            />
                            <p class="mt-2 text-center text-sm text-on-surface-variant">
                                Photo from Picsum
                            </p>
                        </div>
                    {/snippet}
                </Modal>
            </div>
        </div>
    </section>
</div>
