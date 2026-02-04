<script lang="ts">
    import { Drawer, Button, Badge, Icon, Separator } from '$lib/index.js'

    // --- State ---
    let basicOpen = $state(false)
    let directionOpen = $state<Record<string, boolean>>({
        top: false,
        right: false,
        bottom: false,
        left: false
    })
    let insetOpen = $state(false)
    let insetDirectionOpen = $state<Record<string, boolean>>({
        top: false,
        right: false,
        bottom: false,
        left: false
    })
    let noHandleOpen = $state(false)
    let handleOnlyOpen = $state(false)
    let noOverlayOpen = $state(false)
    let nonDismissibleOpen = $state(false)
    let scaleBackgroundOpen = $state(false)
    let slotsOpen = $state(false)
    let customContentOpen = $state(false)
    let titleSlotOpen = $state(false)
    let snapOpen = $state(false)
    let snapControlledOpen = $state(false)
    let snapSequentialOpen = $state(false)
    let activeSnap = $state<number | string | null>(0.25)
    let nestedOuterOpen = $state(false)
    let nestedInnerOpen = $state(false)
    let dragTrackOpen = $state(false)
    let dragPercent = $state(0)
    let closeThresholdOpen = $state(false)
    let scrollLockOpen = $state(false)
    let callbacksOpen = $state(false)
    let callbackLog = $state<string[]>([])
    let noPortalOpen = $state(false)
    let uiOverrideOpen = $state(false)
    let programmaticOpen = $state(false)

    // Real-world demos
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
            A draggable drawer component built on top of vaul-svelte. Supports swipe-to-dismiss,
            snap points, nested drawers, all 4 directions, and full slot customization.
        </p>
    </div>

    <!-- ==================== BASIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
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

    <!-- ==================== DIRECTIONS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Directions</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >direction</code
            > prop to open from any edge.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            {#each directions as dir}
                <Drawer
                    bind:open={directionOpen[dir]}
                    direction={dir}
                    title="{dir.charAt(0).toUpperCase() + dir.slice(1)} Drawer"
                    description="Opens from the {dir}."
                >
                    <Button variant="outline" label={dir.charAt(0).toUpperCase() + dir.slice(1)} />
                    {#snippet body()}
                        <p class="text-on-surface-variant">
                            Drawer from the <strong>{dir}</strong>. Swipe towards the edge to
                            dismiss.
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

    <!-- ==================== INSET ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inset</h2>
        <p class="text-sm text-on-surface-variant">
            Inset drawers have rounded corners and are offset from screen edges.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={insetOpen}
                inset
                title="Inset Drawer"
                description="Rounded, offset from edges."
            >
                <Button variant="outline" label="Bottom Inset" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This drawer floats with rounded corners on all sides.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button label="Close" variant="outline" onclick={() => (insetOpen = false)} />
                {/snippet}
            </Drawer>
            {#each directions as dir}
                <Drawer
                    bind:open={insetDirectionOpen[dir]}
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
                            onclick={() => (insetDirectionOpen[dir] = false)}
                        />
                    {/snippet}
                </Drawer>
            {/each}
        </div>
    </section>

    <!-- ==================== HANDLE VARIANTS ==================== -->
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
                    <p class="text-on-surface-variant">
                        No drag handle visible. Still swipeable via the content area.
                    </p>
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
                        Content area is not draggable — only the handle responds to drag gestures.
                        Useful when the drawer contains scrollable or interactive content.
                    </p>
                    <div class="mt-3 space-y-2">
                        {#each Array(5) as _, i (i)}
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
                        onclick={() => (handleOnlyOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== OVERLAY & MODAL ==================== -->
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
                <Button variant="outline" label="Non-Modal (No Overlay)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        No overlay and non-modal. You can still interact with the page behind.
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
                        Requires a <code
                            class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >[data-vaul-drawer-wrapper]</code
                        > attribute on the app container.
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

    <!-- ==================== NON-DISMISSIBLE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-Dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            Swipe, outside click, and Escape key are all disabled. Must be closed programmatically.
        </p>
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

    <!-- ==================== CLOSE THRESHOLD ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Close Threshold</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >closeThreshold</code
            > (0–1) controls how far the user must swipe before the drawer closes. Default is 0.25.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={closeThresholdOpen}
                closeThreshold={0.8}
                title="High Threshold (0.8)"
                description="Must swipe 80% to close."
            >
                <Button variant="outline" label="Threshold = 0.8" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        You need to swipe 80% of the drawer height before it will close. Short
                        swipes will snap back.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (closeThresholdOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== DRAG TRACKING ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Drag & Release Callbacks</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">onDrag</code>
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">onRelease</code
            > let you track the drawer's drag state in real-time.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-3">
                <Badge variant="soft" color="info" label="Drag: {Math.round(dragPercent * 100)}%" />
            </div>
            <Drawer
                bind:open={dragTrackOpen}
                onDrag={(_, pct) => (dragPercent = pct)}
                onRelease={() => (dragPercent = 0)}
                title="Drag Tracking"
                description="Drag percentage is shown in real-time."
            >
                <Button variant="outline" label="Open (Drag Tracking)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        Drag the drawer and watch the badge update in real-time. Current drag: <strong
                            >{Math.round(dragPercent * 100)}%</strong
                        >
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (dragTrackOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== SCROLL LOCK TIMEOUT ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Scroll Lock Timeout</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >scrollLockTimeout</code
            >
            controls how long (ms) the drawer is not draggable after scrolling content inside.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={scrollLockOpen}
                scrollLockTimeout={1000}
                title="Scroll Lock (1000ms)"
                description="After scrolling content, drawer drag is locked for 1s."
            >
                <Button variant="outline" label="Open (1s Scroll Lock)" />
                {#snippet body()}
                    <div class="max-h-48 space-y-2 overflow-y-auto">
                        <p class="text-on-surface-variant">
                            Scroll this list, then try dragging the drawer immediately:
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
                        onclick={() => (scrollLockOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== SNAP POINTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Snap Points</h2>
        <p class="text-sm text-on-surface-variant">
            Define specific heights/positions the drawer snaps to when dragged.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <!-- Basic snap -->
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
                            Drag between 25%, 50%, and 100% heights. Overlay fades from the 2nd snap
                            point.
                        </p>
                        {#each Array(12) as _, i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Item {i + 1}</p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
            </Drawer>

            <!-- Controlled snap -->
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
                            <Button
                                size="sm"
                                variant="soft"
                                label="25%"
                                onclick={() => (activeSnap = 0.25)}
                            />
                            <Button
                                size="sm"
                                variant="soft"
                                label="50%"
                                onclick={() => (activeSnap = 0.5)}
                            />
                            <Button
                                size="sm"
                                variant="soft"
                                label="100%"
                                onclick={() => (activeSnap = 1)}
                            />
                        </div>
                        {#each Array(10) as _, i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Item {i + 1}</p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
            </Drawer>

            <!-- Sequential snap -->
            <Drawer
                bind:open={snapSequentialOpen}
                snapPoints={[0.2, 0.4, 0.6, 0.8, 1]}
                snapToSequentialPoint
                title="Sequential Snap"
                description="Cannot skip snap points."
            >
                <Button variant="outline" label="Sequential (5 Points)" />
                {#snippet body()}
                    <div class="space-y-2">
                        <p class="text-on-surface-variant">
                            With <code
                                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                                >snapToSequentialPoint</code
                            >, fast swipes won't skip snap points. Each point must be visited in
                            order.
                        </p>
                        {#each Array(15) as _, i (i)}
                            <div class="rounded-md bg-surface-container p-3">
                                <p class="text-sm text-on-surface-variant">Item {i + 1}</p>
                            </div>
                        {/each}
                    </div>
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== NESTED ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Nested Drawers</h2>
        <p class="text-sm text-on-surface-variant">
            Open a second drawer from within the first using the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">nested</code> prop.
        </p>
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
                                    This is the nested drawer. Closing it returns to the outer
                                    drawer.
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
                        The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >header</code
                        > slot replaces the default title + description with fully custom markup.
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

            <!-- Custom title/description slots -->
            <Drawer bind:open={titleSlotOpen}>
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
            </Drawer>
        </div>
    </section>

    <!-- ==================== CALLBACKS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Lifecycle Callbacks</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onOpenChange</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">onClose</code>,
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onAnimationEnd</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-3 space-y-1">
                {#if callbackLog.length === 0}
                    <p class="text-sm text-on-surface-variant italic">
                        Open/close the drawer to see callback logs...
                    </p>
                {/if}
                {#each callbackLog as log}
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
            </Drawer>
        </div>
    </section>

    <!-- ==================== NO PORTAL ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            By default the drawer renders in a portal (appended to body). Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >portal={'{'}false{'}'}</code
            >
            to render inline.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Drawer
                bind:open={noPortalOpen}
                portal={false}
                title="No Portal"
                description="Rendered inline, not in a portal."
            >
                <Button variant="outline" label="Open (No Portal)" />
                {#snippet body()}
                    <p class="text-on-surface-variant">
                        This drawer is rendered inline in the DOM rather than being portalled to the
                        body.
                    </p>
                {/snippet}
                {#snippet footer()}
                    <Button
                        label="Close"
                        variant="outline"
                        onclick={() => (noPortalOpen = false)}
                    />
                {/snippet}
            </Drawer>
        </div>
    </section>

    <!-- ==================== PROGRAMMATIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Programmatic Control</h2>
        <p class="text-sm text-on-surface-variant">
            Control the drawer without a trigger by binding
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code> and toggling
            it externally.
        </p>
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
                        This drawer has no <code
                            class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                            >children</code
                        >
                        slot. It was opened by setting
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
            </Drawer>
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
                        This drawer overrides <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >content</code
                        >,
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >title</code
                        >,
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >description</code
                        >,
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >handle</code
                        >, and
                        <code
                            class="rounded bg-on-primary-container/10 px-1.5 py-0.5 text-xs text-on-primary-container"
                            >container</code
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
            </Drawer>
        </div>
    </section>

    <Separator />

    <!-- ==================== REAL WORLD EXAMPLES ==================== -->
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
                            {#each [{ icon: 'lucide:user', label: 'Account', desc: 'Manage your profile' }, { icon: 'lucide:bell', label: 'Notifications', desc: 'Push, email, SMS' }, { icon: 'lucide:shield', label: 'Privacy', desc: 'Data and permissions' }, { icon: 'lucide:palette', label: 'Appearance', desc: 'Theme and display' }, { icon: 'lucide:globe', label: 'Language', desc: 'English (US)' }] as item}
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
                            {#each [{ title: 'New message', desc: 'John sent you a message', time: '2m ago', unread: true }, { title: 'Build completed', desc: 'Pipeline #482 passed', time: '15m ago', unread: true }, { title: 'Review requested', desc: 'PR #31 needs review', time: '1h ago', unread: true }, { title: 'Deploy finished', desc: 'v2.4.0 deployed to prod', time: '3h ago', unread: false }, { title: 'Comment added', desc: 'Alice commented on issue', time: '5h ago', unread: false }] as n}
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
                                    {#each ['All', 'Electronics', 'Clothing', 'Books', 'Home'] as cat}
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
                                    {#each ['Under $25', '$25-$50', '$50-$100', '$100+'] as price}
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color="secondary"
                                            label={price}
                                        />
                                    {/each}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p class="mb-2 text-sm font-medium text-on-surface">Rating</p>
                                <div class="flex flex-wrap gap-2">
                                    {#each ['4+', '3+', '2+', 'Any'] as r}
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color="secondary"
                                            label="{r} stars"
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
                                This action is permanent and cannot be undone. All your data will be
                                lost.
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
