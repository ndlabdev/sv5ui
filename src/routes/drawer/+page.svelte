<script lang="ts">
    import { Drawer, Button, Badge, Icon, Separator } from '$lib/index.js'

    let basicOpen = $state(false)
    let directionOpen = $state<Record<string, boolean>>({
        top: false,
        right: false,
        bottom: false,
        left: false
    })
    let insetOpen = $state<Record<string, boolean>>({
        top: false,
        right: false,
        bottom: false,
        left: false
    })
    let noHandleOpen = $state(false)
    let handleOnlyOpen = $state(false)
    let noOverlayOpen = $state(false)
    let scaleBackgroundOpen = $state(false)
    let nonDismissibleOpen = $state(false)
    let snapOpen = $state(false)
    let snapControlledOpen = $state(false)
    let activeSnap = $state<number | string | null>(0.25)
    let nestedOuterOpen = $state(false)
    let nestedInnerOpen = $state(false)
    let slotsOpen = $state(false)
    let customContentOpen = $state(false)
    let callbacksOpen = $state(false)
    let callbackLog = $state<string[]>([])
    let uiOverrideOpen = $state(false)
    let programmaticOpen = $state(false)

    let settingsOpen = $state(false)
    let notificationsOpen = $state(false)
    let filterOpen = $state(false)
    let confirmOpen = $state(false)

    const directions = ['top', 'right', 'bottom', 'left'] as const

    function logCallback(name: string) {
        callbackLog = [...callbackLog.slice(-4), `${new Date().toLocaleTimeString()} — ${name}`]
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Drawer</h1>
        <p class="text-on-surface-variant">
            A draggable drawer component built on vaul-svelte. Supports swipe-to-dismiss, snap
            points, nested drawers, all 4 directions, and full slot customization.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={basicOpen}
                title="Basic Drawer"
                description="This is a basic drawer with title, description, body and footer."
            >
                <Button variant="outline" label="Open Drawer" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Slides up from the bottom by default. Swipe down or click the overlay to
                        close.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (basicOpen = false)} />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Directions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Directions</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            {#each directions as dir (dir)}
                <Drawer
                    bind:open={directionOpen[dir]}
                    direction={dir}
                    title="{dir.charAt(0).toUpperCase() + dir.slice(1)} Drawer"
                    description="Opens from the {dir}."
                >
                    <Button variant="outline" label={dir.charAt(0).toUpperCase() + dir.slice(1)} />
                    {#snippet body()}
                        <p class="text-on-surface-variant">
                            Drawer from the <strong>{dir}</strong>. Swipe towards the edge to dismiss.
                        </p>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Close"
                            variant="outline"
                            onclick={() => (directionOpen[dir] = false)}
                        />
                    {/snippet}
                </Drawer>
            {/each}
        </div>
    </section>

    <!-- Inset -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inset</h2>
        <p class="text-sm text-on-surface-variant">
            Inset drawers have rounded corners and are offset from screen edges.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            {#each directions as dir (dir)}
                <Drawer
                    bind:open={insetOpen[dir]}
                    inset
                    direction={dir}
                    title="Inset {dir.charAt(0).toUpperCase() + dir.slice(1)}"
                    description="Inset + {dir} direction."
                >
                    <Button
                        variant="soft"
                        size="sm"
                        label="Inset {dir.charAt(0).toUpperCase() + dir.slice(1)}"
                    />
                    {#snippet body()}
                        <p class="text-on-surface-variant">
                            Inset mode combined with <strong>{dir}</strong> direction.
                        </p>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Close"
                            variant="outline"
                            onclick={() => (insetOpen[dir] = false)}
                        />
                    {/snippet}
                </Drawer>
            {/each}
        </div>
    </section>

    <!-- Handle Options -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Handle Options</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={noHandleOpen}
                handle={false}
                title="No Handle"
                description="Handle is hidden."
            >
                <Button variant="outline" label="No Handle" />
                {#snippet body()}
                    <p class="text-on-surface-variant">No drag handle visible. Still swipeable.</p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noHandleOpen = false)}
                    />
                {/snippet}
            </Drawer>

            <Drawer
                bind:open={handleOnlyOpen}
                handleOnly
                title="Handle Only"
                description="Only the handle can be dragged."
            >
                <Button variant="outline" label="Handle Only" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Content area is not draggable — only the handle responds to drag.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (handleOnlyOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Overlay & Modal -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Overlay & Modal</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={noOverlayOpen}
                overlay={false}
                modal={false}
                title="Non-Modal"
                description="No overlay, background is interactive."
            >
                <Button variant="outline" label="Non-Modal" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        No overlay. You can still interact with the page behind.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noOverlayOpen = false)}
                    />
                {/snippet}
            </Drawer>

            <Drawer
                bind:open={scaleBackgroundOpen}
                shouldScaleBackground
                title="Scale Background"
                description="Background scales down when opened."
            >
                <Button variant="outline" label="Scale Background" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        The page content behind scales down, creating a layered depth effect.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (scaleBackgroundOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Non-Dismissible -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-Dismissible</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={nonDismissibleOpen}
                dismissible={false}
                title="Non-Dismissible"
                description="You must use the close button."
            >
                <Button variant="outline" label="Open (Non-Dismissible)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Try swiping or clicking outside — the drawer will not close.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close Drawer"
                        variant="solid"
                        color="primary"
                        onclick={() => (nonDismissibleOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Snap Points -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Snap Points</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={snapOpen}
                snapPoints={[0.25, 0.5, 1]}
                fadeFromIndex={1}
                title="Snap Points"
                description="Snaps at 25%, 50%, 100%."
            >
                <Button variant="outline" label="3 Snap Points" />
                {#snippet body()}
                    <div class="space-y-2">
                        <p class="text-on-surface-variant">
                            Drag between 25%, 50%, and 100% heights.
                        </p>
                        {#each Array.from({ length: 12 }, (_, i) => i) as i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Item {i + 1}</p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
            </Drawer>

            <Drawer
                bind:open={snapControlledOpen}
                snapPoints={[0.25, 0.5, 1]}
                fadeFromIndex={1}
                bind:activeSnapPoint={activeSnap}
                title="Controlled Snap"
                description="Active: {activeSnap}"
            >
                <Button variant="outline" label="Controlled Snap" />
                {#snippet body()}
                    <div class="space-y-3">
                        <p class="text-on-surface-variant">
                            Active snap point: <strong>{activeSnap}</strong>
                        </p>
                        <div class="flex gap-2">
                            <Button size="sm" variant="soft" label="25%" onclick={() => (activeSnap = 0.25)} />
                            <Button size="sm" variant="soft" label="50%" onclick={() => (activeSnap = 0.5)} />
                            <Button size="sm" variant="soft" label="100%" onclick={() => (activeSnap = 1)} />
                        </div>
                    </div>
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Nested Drawers -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Nested Drawers</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={nestedOuterOpen}
                title="Outer Drawer"
                description="This is the parent drawer."
            >
                <Button variant="outline" label="Open Nested" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Click below to open a child drawer on top of this one.
                    </p>
                    <div class="mt-3">
                        <Drawer
                            bind:open={nestedInnerOpen}
                            nested
                            title="Inner Drawer"
                            description="Nested child drawer."
                        >
                            <Button variant="solid" color="primary" label="Open Inner Drawer" />
                            {#snippet body()}
                                <p class="text-on-surface-variant">
                                    This is the nested drawer. Closing it returns to the outer drawer.
                                </p>
                            {/snippet}
                            {#snippet footer()}
                                <Button
                                    label="Close Inner"
                                    variant="outline"
                                    onclick={() => (nestedInnerOpen = false)}
                                />
                            {/snippet}
                        </Drawer>
                    </div>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (nestedOuterOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Slots</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <!-- Custom header -->
            <Drawer bind:open={slotsOpen}>
                <Button variant="outline" label="Custom Header" />
                {#snippet header()}
                    <div class="flex items-center gap-3">
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
                        The header slot replaces the default title + description.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <div class="flex gap-2">
                        <Button
                            label="Cancel"
                            variant="outline"
                            class="flex-1"
                            onclick={() => (slotsOpen = false)}
                        />
                        <Button
                            label="Confirm"
                            variant="solid"
                            color="primary"
                            class="flex-1"
                            onclick={() => (slotsOpen = false)}
                        />
                    </div>
                {/snippet}
            </Drawer>

            <!-- Full content slot -->
            <Drawer bind:open={customContentOpen} title="Custom Content">
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
            </Drawer>
        </div>
    </section>

    <!-- Lifecycle Callbacks -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lifecycle Callbacks</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-3 space-y-1">
                {#if callbackLog.length === 0}
                    <p class="text-sm text-on-surface-variant italic">
                        Open/close the drawer to see callback logs...
                    </p>
                {/if}
                {#each callbackLog as log, i (i)}
                    <p class="font-mono text-xs text-on-surface-variant">{log}</p>
                {/each}
            </div>
            <Drawer
                bind:open={callbacksOpen}
                onOpenChange={(v) => logCallback(`onOpenChange(${v})`)}
                onClose={() => logCallback('onClose()')}
                onAnimationEnd={(v) => logCallback(`onAnimationEnd(open=${v})`)}
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
            </Drawer>
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
            <Drawer
                bind:open={programmaticOpen}
                title="Programmatic Drawer"
                description="Opened without a trigger slot."
            >
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This drawer has no trigger. It was opened by setting open = true externally.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (programmaticOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={uiOverrideOpen}
                title="Styled Drawer"
                description="Custom styles via the ui prop."
                ui={{
                    content: 'bg-primary-container',
                    title: 'text-on-primary-container',
                    description: 'text-on-primary-container/70',
                    handle: 'bg-on-primary-container/40',
                    container: 'gap-3'
                }}
            >
                <Button variant="outline" label="Open Styled Drawer" />
                {#snippet body()}
                    <p class="text-on-primary-container/80">
                        This drawer overrides content, title, description, handle, and container
                        slot classes.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (uiOverrideOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <!-- Mobile Settings -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Mobile Settings Panel</p>
                <Drawer bind:open={settingsOpen} title="Settings">
                    <Button
                        variant="outline"
                        leadingIcon="lucide:settings"
                        label="Settings"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-4">
                            {#each [{ icon: 'lucide:user', label: 'Account', desc: 'Manage your profile' }, { icon: 'lucide:bell', label: 'Notifications', desc: 'Push, email, SMS' }, { icon: 'lucide:shield', label: 'Privacy', desc: 'Data and permissions' }, { icon: 'lucide:palette', label: 'Appearance', desc: 'Theme and display' }, { icon: 'lucide:globe', label: 'Language', desc: 'English (US)' }] as item (item.label)}
                                <button
                                    class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-container"
                                >
                                    <div
                                        class="flex size-10 items-center justify-center rounded-full bg-surface-container-highest"
                                    >
                                        <Icon
                                            name={item.icon}
                                            size="18"
                                            class="text-on-surface-variant"
                                        />
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-on-surface">
                                            {item.label}
                                        </p>
                                        <p class="text-xs text-on-surface-variant">{item.desc}</p>
                                    </div>
                                    <Icon
                                        name="lucide:chevron-right"
                                        size="16"
                                        class="text-on-surface-variant"
                                    />
                                </button>
                            {/each}
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Sign Out"
                            variant="soft"
                            color="error"
                            leadingIcon="lucide:log-out"
                            class="w-full"
                            onclick={() => (settingsOpen = false)}
                        />
                    {/snippet}
                </Drawer>
            </div>

            <!-- Notifications -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Notifications Drawer</p>
                <Drawer bind:open={notificationsOpen} direction="right">
                    <Button
                        variant="outline"
                        leadingIcon="lucide:bell"
                        label="Notifications"
                        class="w-full"
                    />
                    {#snippet header()}
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-on-surface">Notifications</h3>
                            <Badge variant="solid" color="error" size="xs" label="3 new" />
                        </div>
                    {/snippet}
                    {#snippet body()}
                        <div class="space-y-3">
                            {#each [{ title: 'New message', desc: 'John sent you a message', time: '2m ago', unread: true }, { title: 'Build completed', desc: 'Pipeline #482 passed', time: '15m ago', unread: true }, { title: 'Review requested', desc: 'PR #31 needs review', time: '1h ago', unread: true }, { title: 'Deploy finished', desc: 'v2.4.0 deployed to prod', time: '3h ago', unread: false }] as n (n.title)}
                                <div
                                    class="flex gap-3 rounded-lg p-2 {n.unread
                                        ? 'bg-primary/5'
                                        : ''}"
                                >
                                    <div
                                        class="mt-0.5 size-2 shrink-0 rounded-full {n.unread
                                            ? 'bg-primary'
                                            : 'bg-transparent'}"
                                    ></div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-on-surface">{n.title}</p>
                                        <p class="text-xs text-on-surface-variant">{n.desc}</p>
                                        <p class="mt-1 text-xs text-on-surface-variant/60">
                                            {n.time}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <Button
                            label="Mark all as read"
                            variant="ghost"
                            color="primary"
                            class="w-full"
                            onclick={() => (notificationsOpen = false)}
                        />
                    {/snippet}
                </Drawer>
            </div>

            <!-- Filter Drawer -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Filter (Snap Points)</p>
                <Drawer
                    bind:open={filterOpen}
                    snapPoints={[0.4, 0.75, 1]}
                    fadeFromIndex={1}
                    title="Filters"
                    description="Refine your search results."
                >
                    <Button
                        variant="outline"
                        leadingIcon="lucide:filter"
                        label="Filters"
                        class="w-full"
                    />
                    {#snippet body()}
                        <div class="space-y-4">
                            <div>
                                <p class="mb-2 text-sm font-medium text-on-surface">Category</p>
                                <div class="flex flex-wrap gap-2">
                                    {#each ['All', 'Electronics', 'Clothing', 'Books', 'Home'] as cat (cat)}
                                        <Button
                                            size="xs"
                                            variant={cat === 'All' ? 'solid' : 'outline'}
                                            color={cat === 'All' ? 'primary' : 'secondary'}
                                            label={cat}
                                        />
                                    {/each}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p class="mb-2 text-sm font-medium text-on-surface">Price Range</p>
                                <div class="flex flex-wrap gap-2">
                                    {#each ['Under $25', '$25-$50', '$50-$100', '$100+'] as price (price)}
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color="secondary"
                                            label={price}
                                        />
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/snippet}
                    {#snippet footer()}
                        <div class="flex gap-2">
                            <Button
                                label="Reset"
                                variant="outline"
                                class="flex-1"
                                onclick={() => (filterOpen = false)}
                            />
                            <Button
                                label="Apply Filters"
                                variant="solid"
                                color="primary"
                                class="flex-1"
                                onclick={() => (filterOpen = false)}
                            />
                        </div>
                    {/snippet}
                </Drawer>
            </div>

            <!-- Confirmation Drawer -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Confirmation (Non-Dismissible)</p>
                <Drawer bind:open={confirmOpen} dismissible={false} handle={false}>
                    <Button
                        variant="outline"
                        leadingIcon="lucide:trash-2"
                        label="Delete Account"
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
                            <h3 class="text-lg font-semibold text-on-surface">Delete Account?</h3>
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
                </Drawer>
            </div>
        </div>
    </section>
</div>
