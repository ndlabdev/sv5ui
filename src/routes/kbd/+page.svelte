<script lang="ts">
    import { Kbd, useKbd } from '$lib/index.js'

    const colors = [
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ] as const
    const variants = ['solid', 'outline', 'soft', 'subtle'] as const
    const sizes = ['sm', 'md', 'lg'] as const

    let shortcutLog = $state<string[]>([])
    let searchOpen = $state(false)

    const kbd = useKbd({
        shortcuts: {
            'ctrl+k': () => {
                searchOpen = !searchOpen
                shortcutLog = [...shortcutLog, 'Ctrl+K → Toggle search'].slice(-5)
            },
            'ctrl+shift+p': () => {
                shortcutLog = [...shortcutLog, 'Ctrl+Shift+P → Command palette'].slice(-5)
            },
            escape: () => {
                searchOpen = false
                shortcutLog = [...shortcutLog, 'Escape → Close'].slice(-5)
            }
        },
        captureModifiers: true
    })

    const modifierKeys = ['meta', 'ctrl', 'alt', 'shift'] as const
    const specialKeys = [
        'enter',
        'escape',
        'tab',
        'backspace',
        'delete',
        'space',
        'capslock'
    ] as const
    const arrowKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'] as const
    const navKeys = ['pageup', 'pagedown', 'home', 'end'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Kbd</h1>
        <p class="text-on-surface-variant">
            Keyboard key indicator for displaying shortcuts and key combinations.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            <Kbd value="K" />
            <Kbd value="Enter" />
            <Kbd value="Escape" />
            <Kbd value="Tab" />
        </div>
    </section>

    <!-- Modifier Keys -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Modifier Keys</h2>
        <p class="text-sm text-on-surface-variant">
            Platform-aware: Mac shows symbols, others show text labels.
        </p>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each modifierKeys as key (key)}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Special Keys -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Special Keys</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each specialKeys as key (key)}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Arrow & Navigation Keys -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Arrow & Navigation Keys</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each arrowKeys as key (key)}
                <Kbd value={key} />
            {/each}
            <span class="mx-1 text-on-surface-variant">|</span>
            {#each navKeys as key (key)}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex items-center gap-1">
                    <span class="text-sm text-on-surface-variant">{size}:</span>
                    <Kbd value="K" {size} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each variants as variant (variant)}
                <div class="flex flex-wrap items-center gap-2">
                    <span class="w-16 text-sm text-on-surface-variant">{variant}</span>
                    {#each colors as color (color)}
                        <Kbd value="K" {variant} {color} />
                    {/each}
                </div>
            {/each}
        </div>
    </section>

    <!-- Children Slot -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Children Slot</h2>
        <p class="text-sm text-on-surface-variant">
            Use the default snippet for custom key labels.
        </p>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            <Kbd>F1</Kbd>
            <Kbd>F12</Kbd>
            <Kbd>PgUp</Kbd>
            <Kbd>PgDn</Kbd>
            <Kbd>Ins</Kbd>
            <Kbd>Fn</Kbd>
        </div>
    </section>

    <!-- Keyboard Shortcuts -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Keyboard Shortcuts</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each [{ label: 'Copy', keys: ['meta', 'C'] }, { label: 'Paste', keys: ['meta', 'V'] }, { label: 'Save', keys: ['meta', 'S'] }, { label: 'Search', keys: ['meta', 'K'] }, { label: 'Undo', keys: ['meta', 'Z'] }, { label: 'Redo', keys: ['meta', 'shift', 'Z'] }] as shortcut (shortcut.label)}
                <div class="flex items-center justify-between">
                    <span class="text-sm">{shortcut.label}</span>
                    <div class="flex items-center gap-1">
                        {#each shortcut.keys as key, i (i)}
                            {#if i > 0}
                                <span class="text-on-surface-variant">+</span>
                            {/if}
                            <Kbd value={key} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            <Kbd value="K" ui={{ base: 'rounded-md' }} />
            <Kbd value="meta" ui={{ base: 'rounded-full px-2' }} />
            <Kbd value="Enter" ui={{ base: 'rounded-lg px-2 shadow-sm' }} variant="soft" />
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- Command Palette -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Command Palette Trigger</p>
                <div
                    class="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-3"
                >
                    <span class="flex-1 text-sm text-on-surface-variant">Search commands...</span>
                    <div class="flex items-center gap-1">
                        <Kbd value="meta" size="sm" />
                        <Kbd value="K" size="sm" />
                    </div>
                </div>
            </div>

            <!-- Menu Item -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Menu Item with Shortcut</p>
                <div class="max-w-xs rounded-lg border border-outline-variant bg-surface-container">
                    {#each [{ label: 'New File', keys: ['meta', 'N'] }, { label: 'Open File', keys: ['meta', 'O'] }, { label: 'Save', keys: ['meta', 'S'] }] as item (item.label)}
                        <div
                            class="flex items-center justify-between px-3 py-2 hover:bg-surface-container-high"
                        >
                            <span class="text-sm">{item.label}</span>
                            <div class="flex items-center gap-0.5">
                                {#each item.keys as key (key)}
                                    <Kbd value={key} size="sm" variant="soft" />
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Inline Help -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Inline Help Text</p>
                <p class="text-sm text-on-surface-variant">
                    Press <Kbd value="escape" size="sm" class="mx-0.5" /> to close the modal, or
                    <Kbd value="enter" size="sm" class="mx-0.5" /> to confirm.
                </p>
            </div>

            <!-- Navigation Hint -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Navigation Hint</p>
                <div class="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span class="flex items-center gap-1">
                        <Kbd value="arrowup" size="sm" />
                        <Kbd value="arrowdown" size="sm" />
                        to navigate
                    </span>
                    <span class="flex items-center gap-1">
                        <Kbd value="enter" size="sm" />
                        to select
                    </span>
                </div>
            </div>
        </div>
    </section>

    <!-- useKbd: Shortcut Listener -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useKbd — Shortcut Listener</h2>
        <p class="text-sm text-on-surface-variant">
            Try pressing the shortcuts below. The hook listens for keyboard events and fires
            callbacks.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap gap-4 text-sm">
                <span class="flex items-center gap-1">
                    <Kbd value="ctrl" size="sm" /> + <Kbd value="K" size="sm" /> Toggle search
                </span>
                <span class="flex items-center gap-1">
                    <Kbd value="ctrl" size="sm" /> + <Kbd value="shift" size="sm" /> +
                    <Kbd value="P" size="sm" /> Command palette
                </span>
                <span class="flex items-center gap-1">
                    <Kbd value="escape" size="sm" /> Close
                </span>
            </div>

            {#if searchOpen}
                <div
                    class="flex items-center gap-2 rounded-lg border border-primary/50 bg-surface-container p-3"
                >
                    <span class="flex-1 text-sm text-on-surface-variant">
                        Search is open! Press <Kbd value="escape" size="sm" class="mx-0.5" /> to close.
                    </span>
                </div>
            {/if}

            {#if shortcutLog.length > 0}
                <div class="space-y-1 rounded-md bg-surface-container p-3">
                    <p class="text-xs font-medium text-on-surface-variant">Recent shortcuts:</p>
                    {#each shortcutLog as entry, i (i)}
                        <p class="font-mono text-xs text-on-surface">{entry}</p>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <!-- useKbd: Reactive Key State -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useKbd — Reactive Key State</h2>
        <p class="text-sm text-on-surface-variant">Hold any key to see it tracked in real-time.</p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap gap-2">
                {#each ['shift', 'ctrl', 'alt', 'meta'] as key (key)}
                    <div
                        class="rounded-lg border px-3 py-2 text-sm transition-colors {kbd.isPressed(
                            key
                        )
                            ? 'border-primary bg-primary-container text-on-primary-container'
                            : 'border-outline-variant bg-surface-container text-on-surface-variant'}"
                    >
                        <Kbd
                            value={key}
                            size="sm"
                            variant={kbd.isPressed(key) ? 'solid' : 'outline'}
                            color={kbd.isPressed(key) ? 'primary' : 'surface'}
                        />
                        <span class="ml-1">{kbd.isPressed(key) ? 'Pressed' : 'Released'}</span>
                    </div>
                {/each}
            </div>

            <div class="rounded-md bg-surface-container p-3">
                <p class="text-xs font-medium text-on-surface-variant">Currently pressed keys:</p>
                <p class="mt-1 font-mono text-sm text-on-surface">
                    {#if kbd.pressedKeys.size > 0}
                        {[...kbd.pressedKeys].join(' + ')}
                    {:else}
                        <span class="text-on-surface-variant">None</span>
                    {/if}
                </p>
            </div>
        </div>
    </section>

    <!-- Variants x Colors Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants x Colors</h2>
        <div class="overflow-x-auto rounded-lg bg-surface-container-high p-4">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Variant</th
                        >
                        {#each colors as color (color)}
                            <th
                                class="px-3 py-3 text-center text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr class="border-b border-outline-variant/50">
                            <td class="px-3 py-3 text-sm font-medium text-on-surface-variant"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-3 py-3 text-center">
                                    <Kbd value="K" {variant} {color} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>
</div>
