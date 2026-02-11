<script lang="ts">
    import {
        DropdownMenu,
        Button,
        Separator,
        type DropdownMenuItem,
        type DropdownMenuRadioGroup
    } from '$lib/index.js'

    let controlledOpen = $state(false)
    let showStatusBar = $state(true)
    let showActivityBar = $state(false)
    let showPanel = $state(true)
    let selectedTheme = $state('system')

    // Basic menu items
    const basicItems: DropdownMenuItem[] = [
        { label: 'New File', icon: 'lucide:file-plus', kbds: ['meta', 'n'] },
        { label: 'New Window', icon: 'lucide:window', kbds: ['meta', 'shift', 'n'] },
        { type: 'separator' },
        { label: 'Open File...', icon: 'lucide:folder-open', kbds: ['meta', 'o'] },
        { label: 'Save', icon: 'lucide:save', kbds: ['meta', 's'] },
        { label: 'Save As...', kbds: ['meta', 'shift', 's'] },
        { type: 'separator' },
        { label: 'Exit', icon: 'lucide:log-out' }
    ]

    // Items with different colors
    const coloredItems: DropdownMenuItem[] = [
        { label: 'Edit', icon: 'lucide:pencil' },
        { label: 'Duplicate', icon: 'lucide:copy' },
        { type: 'separator' },
        { label: 'Archive', icon: 'lucide:archive', color: 'warning' },
        { label: 'Delete', icon: 'lucide:trash-2', color: 'error' }
    ]

    // Checkbox items - use $derived to make them reactive
    const checkboxItems: DropdownMenuItem[] = $derived([
        { type: 'label', label: 'Appearance' },
        {
            type: 'checkbox',
            label: 'Status Bar',
            checked: showStatusBar,
            onCheckedChange: (v: boolean) => (showStatusBar = v)
        },
        {
            type: 'checkbox',
            label: 'Activity Bar',
            checked: showActivityBar,
            onCheckedChange: (v: boolean) => (showActivityBar = v)
        },
        {
            type: 'checkbox',
            label: 'Panel',
            checked: showPanel,
            onCheckedChange: (v: boolean) => (showPanel = v)
        }
    ])

    // Radio items with group
    const radioItems: DropdownMenuItem[] = [
        { type: 'label', label: 'Theme' },
        { type: 'radio', label: 'Light', value: 'light' },
        { type: 'radio', label: 'Dark', value: 'dark' },
        { type: 'radio', label: 'System', value: 'system' }
    ]

    // Close on select demo - counter to show clicks without closing
    let clickCount = $state(0)

    // Items that stay open when clicked
    const closeOnSelectItems: DropdownMenuItem[] = $derived([
        { type: 'label', label: 'Stay Open Items' },
        {
            label: 'Click me (stays open)',
            icon: 'lucide:hand-metal',
            closeOnSelect: false,
            onSelect: () => clickCount++
        },
        {
            label: 'Me too (stays open)',
            icon: 'lucide:hand-metal',
            closeOnSelect: false,
            onSelect: () => clickCount++
        },
        { type: 'separator' },
        { type: 'label', label: 'Default Behavior' },
        {
            label: 'Click me (closes menu)',
            icon: 'lucide:log-out',
            onSelect: () => clickCount++
        }
    ])

    // Checkbox items that stay open
    let option1 = $state(false)
    let option2 = $state(false)
    let option3 = $state(false)

    const checkboxCloseOnSelectItems: DropdownMenuItem[] = $derived([
        { type: 'label', label: 'Select Multiple (stays open)' },
        {
            type: 'checkbox',
            label: 'Option 1',
            checked: option1,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (option1 = v)
        },
        {
            type: 'checkbox',
            label: 'Option 2',
            checked: option2,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (option2 = v)
        },
        {
            type: 'checkbox',
            label: 'Option 3',
            checked: option3,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (option3 = v)
        }
    ])

    // Use $derived for reactive radio groups
    const radioGroups: DropdownMenuRadioGroup[] = $derived([
        {
            name: 'theme',
            value: selectedTheme,
            onValueChange: (v: string) => (selectedTheme = v)
        }
    ])

    // Submenu items
    const submenuItems: DropdownMenuItem[] = [
        { label: 'Back', icon: 'lucide:arrow-left', kbds: ['meta', '['] },
        { label: 'Forward', icon: 'lucide:arrow-right', kbds: ['meta', ']'], disabled: true },
        { label: 'Reload', icon: 'lucide:refresh-cw', kbds: ['meta', 'r'] },
        { type: 'separator' },
        {
            type: 'sub',
            label: 'More Tools',
            icon: 'lucide:wrench',
            items: [
                { label: 'Save Page As...', kbds: ['meta', 's'] },
                { label: 'Create Shortcut...' },
                { label: 'Name Window...' },
                { type: 'separator' },
                { label: 'Developer Tools', kbds: ['meta', 'alt', 'i'] }
            ]
        },
        { type: 'separator' },
        { label: 'Show Full URLs', type: 'checkbox', checked: true }
    ]

    // Profile menu items
    const profileItems: DropdownMenuItem[] = [
        { type: 'label', label: 'My Account' },
        { label: 'Profile', icon: 'lucide:user', kbds: ['meta', 'p'] },
        { label: 'Billing', icon: 'lucide:credit-card', kbds: ['meta', 'b'] },
        { label: 'Settings', icon: 'lucide:settings', kbds: ['meta', ','] },
        { label: 'Keyboard shortcuts', icon: 'lucide:keyboard' },
        { type: 'separator' },
        { label: 'Team', icon: 'lucide:users' },
        {
            type: 'sub',
            label: 'Invite users',
            icon: 'lucide:user-plus',
            items: [
                { label: 'Email', icon: 'lucide:mail' },
                { label: 'Message', icon: 'lucide:message-square' },
                { type: 'separator' },
                { label: 'More...', icon: 'lucide:plus-circle' }
            ]
        },
        { label: 'New Team', icon: 'lucide:plus', kbds: ['meta', 't'] },
        { type: 'separator' },
        { label: 'GitHub', icon: 'lucide:github' },
        { label: 'Support', icon: 'lucide:life-buoy' },
        { label: 'API', icon: 'lucide:cloud', disabled: true },
        { type: 'separator' },
        { label: 'Log out', icon: 'lucide:log-out', kbds: ['meta', 'shift', 'q'] }
    ]
</script>

<div class="space-y-12">
    <header>
        <h1 class="text-3xl font-bold text-on-surface">DropdownMenu</h1>
        <p class="mt-2 text-on-surface-variant">
            Display a menu of actions or options triggered by a button. Built on bits-ui
            DropdownMenu primitive.
        </p>
    </header>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A simple dropdown menu with icons and keyboard shortcuts.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={basicItems}>
                <Button variant="outline">
                    File
                    <span class="ml-2 text-xs opacity-60">Alt+F</span>
                </Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Positions -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control dropdown placement with the <code class="text-primary">side</code> prop.
        </p>
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} side="top">
                <Button variant="soft">Top</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} side="right">
                <Button variant="soft">Right</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} side="bottom">
                <Button variant="soft">Bottom</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} side="left">
                <Button variant="soft">Left</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Alignment -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Alignment</h2>
        <p class="text-sm text-on-surface-variant">
            Control alignment with the <code class="text-primary">align</code> prop.
        </p>
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} align="start">
                <Button variant="outline">Align Start</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} align="center">
                <Button variant="outline">Align Center</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} align="end">
                <Button variant="outline">Align End</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- With Arrow -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Arrow</h2>
        <p class="text-sm text-on-surface-variant">Add an arrow pointing to the trigger element.</p>
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg border border-outline-variant bg-surface-container-low p-12"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} arrow side="bottom" align="center">
                <Button>With Arrow</Button>
            </DropdownMenu>

            <DropdownMenu
                items={basicItems.slice(0, 4)}
                arrow={{ width: 16, height: 8 }}
                side="bottom"
                align="center"
            >
                <Button variant="soft">Custom Arrow Size</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Control the menu size with the <code class="text-primary">size</code> prop.
        </p>
        <div
            class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} size="xs">
                <Button size="xs" variant="outline">Extra Small</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} size="sm">
                <Button size="sm" variant="outline">Small</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} size="md">
                <Button size="md" variant="outline">Medium</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} size="lg">
                <Button size="lg" variant="outline">Large</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} size="xl">
                <Button size="xl" variant="outline">Extra Large</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Colored Items -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colored Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="text-primary">color</code> prop on items for semantic coloring.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={coloredItems}>
                <Button variant="outline" icon="lucide:more-horizontal">Actions</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Checkbox Items -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Checkbox Items</h2>
        <p class="text-sm text-on-surface-variant">Toggle boolean states with checkbox items.</p>
        <div
            class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={checkboxItems}>
                <Button variant="outline" icon="lucide:layout">View</Button>
            </DropdownMenu>

            <div class="text-sm text-on-surface-variant">
                <p>Status Bar: <code class="text-primary">{showStatusBar}</code></p>
                <p>Activity Bar: <code class="text-primary">{showActivityBar}</code></p>
                <p>Panel: <code class="text-primary">{showPanel}</code></p>
            </div>
        </div>
    </section>

    <!-- Close On Select -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Close On Select</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">closeOnSelect: false</code> to keep the menu open after clicking
            an item. Useful for multi-select scenarios or actions that don't require closing.
        </p>
        <div
            class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={closeOnSelectItems}>
                <Button variant="outline" icon="lucide:mouse-pointer-click">Action Items</Button>
            </DropdownMenu>

            <DropdownMenu items={checkboxCloseOnSelectItems}>
                <Button variant="outline" icon="lucide:check-square">Multi-Select</Button>
            </DropdownMenu>

            <div class="text-sm text-on-surface-variant">
                <p>Click count: <code class="text-primary">{clickCount}</code></p>
                <p>Options: <code class="text-primary">[{option1}, {option2}, {option3}]</code></p>
            </div>
        </div>
    </section>

    <!-- Radio Items -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Radio Items</h2>
        <p class="text-sm text-on-surface-variant">Single selection with radio items and groups.</p>
        <div
            class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={radioItems} {radioGroups}>
                <Button variant="outline" icon="lucide:sun-moon">Theme</Button>
            </DropdownMenu>

            <div class="text-sm text-on-surface-variant">
                Selected: <code class="text-primary">{selectedTheme}</code>
            </div>
        </div>
    </section>

    <!-- Submenus -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Submenus</h2>
        <p class="text-sm text-on-surface-variant">
            Nested menus for complex navigation structures.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={submenuItems}>
                <Button variant="outline" icon="lucide:menu">Navigate</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Controlled State -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Controlled State</h2>
        <p class="text-sm text-on-surface-variant">
            Control dropdown visibility programmatically with <code class="text-primary">open</code> binding.
        </p>
        <div
            class="flex flex-wrap items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} bind:open={controlledOpen}>
                <Button variant={controlledOpen ? 'solid' : 'outline'}>
                    {controlledOpen ? 'Menu is open' : 'Click to open'}
                </Button>
            </DropdownMenu>

            <Button variant="soft" onclick={() => (controlledOpen = !controlledOpen)}>
                Toggle: {controlledOpen ? 'Close' : 'Open'}
            </Button>

            <span class="text-sm text-on-surface-variant">
                State: <code class="text-primary">{controlledOpen}</code>
            </span>
        </div>
    </section>

    <!-- Custom Header/Footer -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Header/Footer</h2>
        <p class="text-sm text-on-surface-variant">
            Add custom content at the top or bottom of the menu.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={basicItems.slice(0, 4)}>
                <Button variant="outline" icon="lucide:user-circle">Account</Button>
                {#snippet header()}
                    <div class="px-3 py-2">
                        <p class="text-sm font-medium">John Doe</p>
                        <p class="text-xs text-on-surface-variant">john@example.com</p>
                    </div>
                    <Separator />
                {/snippet}
                {#snippet footer({ close })}
                    <Separator />
                    <div class="p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            class="w-full justify-start"
                            icon="lucide:log-out"
                            color="error"
                            onclick={close}
                        >
                            Log out
                        </Button>
                    </div>
                {/snippet}
            </DropdownMenu>
        </div>
    </section>

    <!-- Profile Menu Example -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Profile Menu Example</h2>
        <p class="text-sm text-on-surface-variant">
            A complete profile dropdown menu with multiple features.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={profileItems}>
                <Button icon="lucide:chevron-down" trailing>
                    <span class="flex items-center gap-2">
                        <span
                            class="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-on-primary"
                        >
                            JD
                        </span>
                        shadcn
                    </span>
                </Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Custom Content -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="text-primary">content</code> slot for fully custom dropdown content.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu>
                <Button variant="outline" icon="lucide:palette">Colors</Button>
                {#snippet content({ close })}
                    <div class="p-4">
                        <p class="mb-3 text-sm font-medium">Choose a color</p>
                        <div class="grid grid-cols-5 gap-2">
                            {#each ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'] as color (color)}
                                <button
                                    class="size-8 rounded-full {color} transition-all hover:ring-2 hover:ring-outline hover:ring-offset-2"
                                    aria-label="Select {color
                                        .replace('bg-', '')
                                        .replace('-500', '')} color"
                                    onclick={close}
                                ></button>
                            {/each}
                        </div>
                    </div>
                {/snippet}
            </DropdownMenu>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Customize individual parts with the <code class="text-primary">ui</code> prop.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu
                items={basicItems.slice(0, 4)}
                ui={{
                    content: 'bg-primary text-on-primary ring-primary/50',
                    item: 'data-[highlighted]:bg-on-primary/20',
                    separator: 'bg-on-primary/20'
                }}
            >
                <Button>Primary Style</Button>
            </DropdownMenu>

            <DropdownMenu
                items={basicItems.slice(0, 4)}
                ui={{
                    content: 'rounded-xl shadow-2xl'
                }}
            >
                <Button variant="outline">Custom Rounding</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Without Portal -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Without Portal</h2>
        <p class="text-sm text-on-surface-variant">
            Render dropdown inline instead of in a portal.
        </p>
        <div
            class="flex flex-wrap gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <DropdownMenu items={basicItems.slice(0, 4)} portal>
                <Button variant="outline">With Portal</Button>
            </DropdownMenu>

            <DropdownMenu items={basicItems.slice(0, 4)} portal={false}>
                <Button variant="outline">Without Portal</Button>
            </DropdownMenu>
        </div>
    </section>
</div>
