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
    let clickCount = $state(0)
    let option1 = $state(false)
    let option2 = $state(false)
    let option3 = $state(false)

    const basicItems: DropdownMenuItem[] = [
        { label: 'New File', icon: 'lucide:file-plus', kbds: ['meta', 'n'] },
        { label: 'New Window', icon: 'lucide:window', kbds: ['meta', 'shift', 'n'] },
        { type: 'separator' },
        { label: 'Open File...', icon: 'lucide:folder-open', kbds: ['meta', 'o'] },
        { label: 'Save', icon: 'lucide:save', kbds: ['meta', 's'] },
        { type: 'separator' },
        { label: 'Exit', icon: 'lucide:log-out' }
    ]

    const coloredItems: DropdownMenuItem[] = [
        { label: 'Edit', icon: 'lucide:pencil' },
        { label: 'Duplicate', icon: 'lucide:copy' },
        { type: 'separator' },
        { label: 'Archive', icon: 'lucide:archive', color: 'warning' },
        { label: 'Delete', icon: 'lucide:trash-2', color: 'error' }
    ]

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

    const radioItems: DropdownMenuItem[] = [
        { type: 'label', label: 'Theme' },
        { type: 'radio', label: 'Light', value: 'light' },
        { type: 'radio', label: 'Dark', value: 'dark' },
        { type: 'radio', label: 'System', value: 'system' }
    ]

    const radioGroups: DropdownMenuRadioGroup[] = $derived([
        {
            name: 'theme',
            value: selectedTheme,
            onValueChange: (v: string) => (selectedTheme = v)
        }
    ])

    const closeOnSelectItems: DropdownMenuItem[] = $derived([
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
        {
            label: 'Click me (closes menu)',
            icon: 'lucide:log-out',
            onSelect: () => clickCount++
        }
    ])

    const checkboxCloseOnSelectItems: DropdownMenuItem[] = $derived([
        { type: 'label', label: 'Select Multiple' },
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
        }
    ]

    const profileItems: DropdownMenuItem[] = [
        { type: 'label', label: 'My Account' },
        { label: 'Profile', icon: 'lucide:user', kbds: ['meta', 'p'] },
        { label: 'Billing', icon: 'lucide:credit-card', kbds: ['meta', 'b'] },
        { label: 'Settings', icon: 'lucide:settings', kbds: ['meta', ','] },
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

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">DropdownMenu</h1>
        <p class="text-on-surface-variant">
            Display a menu of actions or options triggered by a button. Built on bits-ui
            DropdownMenu primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <DropdownMenu items={basicItems}>
                <Button variant="outline">
                    File
                    <span class="ml-2 text-xs opacity-60">Alt+F</span>
                </Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Positions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Positions</h2>
        <p class="text-sm text-on-surface-variant">
            Control dropdown placement with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">side</code>
            prop.
        </p>
        <div
            class="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-surface-container-high p-8"
        >
            {#each [{ side: 'top' as const, label: 'Top' }, { side: 'right' as const, label: 'Right' }, { side: 'bottom' as const, label: 'Bottom' }, { side: 'left' as const, label: 'Left' }] as item (item.side)}
                <DropdownMenu items={basicItems.slice(0, 4)} side={item.side}>
                    <Button variant="soft">{item.label}</Button>
                </DropdownMenu>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            {#each [{ size: 'xs' as const, label: 'XS' }, { size: 'sm' as const, label: 'SM' }, { size: 'md' as const, label: 'MD' }, { size: 'lg' as const, label: 'LG' }, { size: 'xl' as const, label: 'XL' }] as item (item.size)}
                <DropdownMenu items={basicItems.slice(0, 4)} size={item.size}>
                    <Button size={item.size} variant="outline">{item.label}</Button>
                </DropdownMenu>
            {/each}
        </div>
    </section>

    <!-- Colored Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colored Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code>
            prop on items for semantic coloring.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <DropdownMenu items={coloredItems}>
                <Button variant="outline" icon="lucide:more-horizontal">Actions</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Checkbox Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Checkbox Items</h2>
        <p class="text-sm text-on-surface-variant">Toggle boolean states with checkbox items.</p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
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

    <!-- Radio Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Radio Items</h2>
        <p class="text-sm text-on-surface-variant">Single selection with radio items and groups.</p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <DropdownMenu items={radioItems} {radioGroups}>
                <Button variant="outline" icon="lucide:sun-moon">Theme</Button>
            </DropdownMenu>
            <div class="text-sm text-on-surface-variant">
                Selected: <code class="text-primary">{selectedTheme}</code>
            </div>
        </div>
    </section>

    <!-- Submenus -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Submenus</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <DropdownMenu items={submenuItems}>
                <Button variant="outline" icon="lucide:menu">Navigate</Button>
            </DropdownMenu>
        </div>
    </section>

    <!-- Close On Select -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Close On Select</h2>
        <p class="text-sm text-on-surface-variant">
            Use
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >closeOnSelect: false</code
            >
            to keep the menu open after clicking an item.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <DropdownMenu items={closeOnSelectItems}>
                <Button variant="outline" icon="lucide:mouse-pointer-click">Actions</Button>
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

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Control dropdown visibility programmatically with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">open</code>
            binding.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Observe click state</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <DropdownMenu items={basicItems.slice(0, 4)} bind:open={controlledOpen}>
                        <Button variant={controlledOpen ? 'solid' : 'outline'}>Click me</Button>
                    </DropdownMenu>
                    <span class="text-sm text-on-surface-variant">
                        open: <code class="text-primary">{controlledOpen}</code>
                    </span>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Toggle programmatically</p>
                <div class="flex items-center gap-4 rounded-lg bg-surface-container-high p-4">
                    <DropdownMenu items={basicItems.slice(0, 4)} open={controlledOpen}>
                        <Button variant="outline">Target</Button>
                    </DropdownMenu>
                    <Button variant="soft" onclick={() => (controlledOpen = !controlledOpen)}>
                        {controlledOpen ? 'Close' : 'Open'}
                    </Button>
                </div>
            </div>
        </div>
    </section>

    <!-- Custom Header/Footer -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Header/Footer</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
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

    <!-- Custom Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>
            slot for fully custom dropdown content.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Primary theme</p>
                <div class="rounded-lg bg-surface-container-high p-4">
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
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom rounding</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <DropdownMenu
                        items={basicItems.slice(0, 4)}
                        ui={{ content: 'rounded-xl shadow-2xl' }}
                    >
                        <Button variant="outline">Rounded</Button>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <!-- Profile Menu -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Profile Menu</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
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
            </div>

            <!-- Context Menu Style -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Right-Click Style</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-6"
                >
                    <DropdownMenu items={coloredItems} arrow align="center">
                        <Button
                            variant="outline"
                            icon="lucide:more-vertical"
                            square
                            aria-label="More options"
                        />
                    </DropdownMenu>
                </div>
            </div>
        </div>
    </section>
</div>
