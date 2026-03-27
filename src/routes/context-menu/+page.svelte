<script lang="ts">
    import {
        ContextMenu,
        Separator,
        type ContextMenuItem,
        type ContextMenuRadioGroup
    } from '$lib/index.js'

    let showStatusBar = $state(true)
    let showActivityBar = $state(false)
    let showPanel = $state(true)
    let selectedTheme = $state('system')

    const basicItems: ContextMenuItem[] = [
        { label: 'Back', icon: 'lucide:arrow-left', kbds: ['alt', 'left'] },
        { label: 'Forward', icon: 'lucide:arrow-right', kbds: ['alt', 'right'], disabled: true },
        { label: 'Reload', icon: 'lucide:refresh-cw', kbds: ['meta', 'r'] },
        { type: 'separator' },
        { label: 'Save As...', icon: 'lucide:save', kbds: ['meta', 's'] },
        { label: 'Print...', icon: 'lucide:printer', kbds: ['meta', 'p'] }
    ]

    const coloredItems: ContextMenuItem[] = [
        { label: 'Edit', icon: 'lucide:pencil' },
        { label: 'Duplicate', icon: 'lucide:copy' },
        { type: 'separator' },
        { label: 'Archive', icon: 'lucide:archive', color: 'warning' },
        { label: 'Delete', icon: 'lucide:trash-2', color: 'error' }
    ]

    const checkboxItems: ContextMenuItem[] = $derived([
        { type: 'label', label: 'Appearance' },
        {
            type: 'checkbox',
            label: 'Status Bar',
            checked: showStatusBar,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (showStatusBar = v)
        },
        {
            type: 'checkbox',
            label: 'Activity Bar',
            checked: showActivityBar,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (showActivityBar = v)
        },
        {
            type: 'checkbox',
            label: 'Panel',
            checked: showPanel,
            closeOnSelect: false,
            onCheckedChange: (v: boolean) => (showPanel = v)
        }
    ])

    const radioItems: ContextMenuItem[] = [
        { type: 'label', label: 'Theme' },
        { type: 'radio', label: 'Light', value: 'light' },
        { type: 'radio', label: 'Dark', value: 'dark' },
        { type: 'radio', label: 'System', value: 'system' }
    ]

    const radioGroups: ContextMenuRadioGroup[] = $derived([
        {
            name: 'theme',
            value: selectedTheme,
            onValueChange: (v: string) => (selectedTheme = v)
        }
    ])

    const submenuItems: ContextMenuItem[] = [
        { label: 'Cut', icon: 'lucide:scissors', kbds: ['meta', 'x'] },
        { label: 'Copy', icon: 'lucide:copy', kbds: ['meta', 'c'] },
        { label: 'Paste', icon: 'lucide:clipboard', kbds: ['meta', 'v'] },
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
        {
            type: 'sub',
            label: 'Share',
            icon: 'lucide:share-2',
            items: [
                { label: 'Email', icon: 'lucide:mail' },
                { label: 'Message', icon: 'lucide:message-square' },
                { type: 'separator' },
                { label: 'Copy Link', icon: 'lucide:link' }
            ]
        }
    ]

    const fullItems: ContextMenuItem[] = $derived([
        { label: 'Cut', icon: 'lucide:scissors', kbds: ['meta', 'x'] },
        { label: 'Copy', icon: 'lucide:copy', kbds: ['meta', 'c'] },
        { label: 'Paste', icon: 'lucide:clipboard', kbds: ['meta', 'v'] },
        { type: 'separator' },
        { type: 'label', label: 'View' },
        {
            type: 'checkbox',
            label: 'Show Bookmarks',
            checked: showStatusBar,
            onCheckedChange: (v: boolean) => (showStatusBar = v)
        },
        {
            type: 'checkbox',
            label: 'Show Full URLs',
            checked: showActivityBar,
            onCheckedChange: (v: boolean) => (showActivityBar = v)
        },
        { type: 'separator' },
        {
            type: 'sub',
            label: 'More Tools',
            icon: 'lucide:wrench',
            items: [
                { label: 'Save Page As...', kbds: ['meta', 's'] },
                { label: 'Create Shortcut...' },
                { type: 'separator' },
                { label: 'Developer Tools', kbds: ['meta', 'alt', 'i'] }
            ]
        },
        { type: 'separator' },
        { label: 'Delete', icon: 'lucide:trash-2', color: 'error', kbds: ['delete'] }
    ])

    const triggerClass =
        'flex items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-surface-container cursor-context-menu select-none'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">ContextMenu</h1>
        <p class="text-on-surface-variant">
            Display a menu of actions or options triggered by right-click. Built on bits-ui
            ContextMenu primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Right-click on the area below to open a context menu with icons and keyboard shortcuts.
        </p>
        <ContextMenu items={basicItems}>
            <div class="{triggerClass} h-36 w-full">
                <span class="text-sm">Right-click here</span>
            </div>
        </ContextMenu>
    </section>

    <!-- Colored Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colored Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code>
            prop on items for semantic coloring.
        </p>
        <ContextMenu items={coloredItems}>
            <div class="{triggerClass} h-36 w-full">
                <span class="text-sm">Right-click for colored items</span>
            </div>
        </ContextMenu>
    </section>

    <!-- Checkbox Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Checkbox Items</h2>
        <p class="text-sm text-on-surface-variant">Toggle boolean states with checkbox items.</p>
        <div class="flex items-start gap-4 rounded-lg bg-surface-container-high p-4">
            <ContextMenu items={checkboxItems} class="flex-1">
                <div class="{triggerClass} h-36 w-full">
                    <span class="text-sm">Right-click for checkboxes</span>
                </div>
            </ContextMenu>
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
        <div class="flex items-start gap-4 rounded-lg bg-surface-container-high p-4">
            <ContextMenu items={radioItems} {radioGroups} class="flex-1">
                <div class="{triggerClass} h-36 w-full">
                    <span class="text-sm">Right-click for radio selection</span>
                </div>
            </ContextMenu>
            <div class="text-sm text-on-surface-variant">
                Selected: <code class="text-primary">{selectedTheme}</code>
            </div>
        </div>
    </section>

    <!-- Submenus -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Submenus</h2>
        <ContextMenu items={submenuItems}>
            <div class="{triggerClass} h-36 w-full">
                <span class="text-sm">Right-click for submenus</span>
            </div>
        </ContextMenu>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Control the menu size with the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code>
            prop.
        </p>
        <div class="grid gap-4 md:grid-cols-3">
            {#each [{ size: 'xs' as const, label: 'XS' }, { size: 'sm' as const, label: 'SM' }, { size: 'md' as const, label: 'MD (default)' }, { size: 'lg' as const, label: 'LG' }, { size: 'xl' as const, label: 'XL' }] as item (item.size)}
                <ContextMenu items={basicItems.slice(0, 5)} size={item.size}>
                    <div class="{triggerClass} h-28">
                        <span class="text-xs">{item.label}</span>
                    </div>
                </ContextMenu>
            {/each}
        </div>
    </section>

    <!-- Custom Header/Footer -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Header/Footer</h2>
        <ContextMenu items={basicItems.slice(0, 4)}>
            <div class="{triggerClass} h-36 w-full">
                <span class="text-sm">Right-click for header/footer</span>
            </div>
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
                    <button
                        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-error hover:bg-error-container hover:text-on-error-container"
                        onclick={close}
                    >
                        Log out
                    </button>
                </div>
            {/snippet}
        </ContextMenu>
    </section>

    <!-- Custom Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>
            slot for fully custom context menu content.
        </p>
        <ContextMenu>
            <div class="{triggerClass} h-36 w-full">
                <span class="text-sm">Right-click for custom content</span>
            </div>
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
        </ContextMenu>
    </section>

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Overrides</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Primary theme</p>
                <ContextMenu
                    items={basicItems.slice(0, 4)}
                    ui={{
                        content: 'bg-primary text-on-primary ring-primary/50',
                        item: 'data-[highlighted]:bg-on-primary/20',
                        separator: 'bg-on-primary/20'
                    }}
                >
                    <div class="{triggerClass} h-28">
                        <span class="text-sm">Primary Style</span>
                    </div>
                </ContextMenu>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom rounding</p>
                <ContextMenu
                    items={basicItems.slice(0, 4)}
                    ui={{ content: 'rounded-xl shadow-2xl' }}
                >
                    <div class="{triggerClass} h-28">
                        <span class="text-sm">Custom Rounding</span>
                    </div>
                </ContextMenu>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="space-y-4">
            <div class="space-y-2">
                <p class="text-sm font-medium">Browser Context Menu</p>
                <ContextMenu items={fullItems}>
                    <div class="{triggerClass} h-48 w-full">
                        <div class="text-center">
                            <p class="text-sm font-medium text-on-surface">Interactive Area</p>
                            <p class="mt-1 text-xs text-on-surface-variant">
                                Right-click anywhere in this area
                            </p>
                        </div>
                    </div>
                </ContextMenu>
            </div>
        </div>
    </section>
</div>
