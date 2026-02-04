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
    const specialKeys = ['enter', 'escape', 'tab', 'backspace', 'delete', 'space'] as const
    const arrowKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Kbd</h1>
        <p class="text-on-surface-variant">
            Keyboard key indicator for displaying keyboard shortcuts and key combinations.
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
        <h2 class="text-lg font-semibold">Modifier Keys (Platform Aware)</h2>
        <p class="text-sm text-on-surface-variant">
            Shows different symbols based on platform: Mac shows ⌘⌃⌥, others show Ctrl/Alt.
        </p>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each modifierKeys as key}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Special Keys -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Special Keys</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each specialKeys as key}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Arrow Keys -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Arrow Keys</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each arrowKeys as key}
                <Kbd value={key} />
            {/each}
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each variants as variant}
                <div class="flex flex-wrap items-center gap-2">
                    <span class="w-16 text-sm text-on-surface-variant">{variant}</span>
                    {#each colors as color}
                        <Kbd value="K" {variant} {color} />
                    {/each}
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size}
                <div class="flex items-center gap-1">
                    <span class="text-sm text-on-surface-variant">{size}:</span>
                    <Kbd value="K" {size} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            {#each colors as color}
                <Kbd value={color.charAt(0).toUpperCase()} {color} />
            {/each}
        </div>
    </section>

    <!-- Variants x Colors Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants x Colors</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Variant</th
                        >
                        {#each colors as color}
                            <th
                                class="px-3 py-3 text-center text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant}
                        <tr class="border-b border-outline-variant/50">
                            <td class="px-3 py-3 text-sm font-medium text-on-surface-variant"
                                >{variant}</td
                            >
                            {#each colors as color}
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

    <!-- Keyboard Shortcuts -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Keyboard Shortcuts</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex items-center justify-between">
                <span class="text-sm">Copy</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="C" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Paste</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="V" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Save</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="S" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Search</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="K" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Undo</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="Z" />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Redo</span>
                <div class="flex items-center gap-1">
                    <Kbd value="meta" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="shift" />
                    <span class="text-on-surface-variant">+</span>
                    <Kbd value="Z" />
                </div>
            </div>
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
                    <div
                        class="flex items-center justify-between px-3 py-2 hover:bg-surface-container-high"
                    >
                        <span class="text-sm">New File</span>
                        <div class="flex items-center gap-0.5">
                            <Kbd value="meta" size="sm" variant="soft" />
                            <Kbd value="N" size="sm" variant="soft" />
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-between px-3 py-2 hover:bg-surface-container-high"
                    >
                        <span class="text-sm">Open File</span>
                        <div class="flex items-center gap-0.5">
                            <Kbd value="meta" size="sm" variant="soft" />
                            <Kbd value="O" size="sm" variant="soft" />
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-between px-3 py-2 hover:bg-surface-container-high"
                    >
                        <span class="text-sm">Save</span>
                        <div class="flex items-center gap-0.5">
                            <Kbd value="meta" size="sm" variant="soft" />
                            <Kbd value="S" size="sm" variant="soft" />
                        </div>
                    </div>
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

    <!-- Custom Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content</h2>
        <div class="flex flex-wrap items-center gap-2 rounded-lg bg-surface-container-high p-4">
            <Kbd>F1</Kbd>
            <Kbd>F12</Kbd>
            <Kbd>PgUp</Kbd>
            <Kbd>PgDn</Kbd>
            <Kbd>Home</Kbd>
            <Kbd>End</Kbd>
        </div>
    </section>

    <!-- useKbd Hook: Shortcut Listener -->
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
                    <Kbd value="ctrl" size="sm" /> + <Kbd value="shift" size="sm" /> + <Kbd>P</Kbd> Command
                    palette
                </span>
                <span class="flex items-center gap-1">
                    <Kbd value="escape" size="sm" /> Close
                </span>
            </div>

            {#if searchOpen}
                <div
                    class="flex items-center gap-2 rounded-lg border border-primary/50 bg-surface-container p-3"
                >
                    <span class="flex-1 text-sm text-on-surface-variant"
                        >Search is open! Press <Kbd value="escape" size="sm" class="mx-0.5" /> to close.</span
                    >
                </div>
            {/if}

            {#if shortcutLog.length > 0}
                <div class="space-y-1 rounded-md bg-surface-container p-3">
                    <p class="text-xs font-medium text-on-surface-variant">Recent shortcuts:</p>
                    {#each shortcutLog as entry}
                        <p class="font-mono text-xs text-on-surface">{entry}</p>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <!-- useKbd Hook: Reactive Key State -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">useKbd — Reactive Key State</h2>
        <p class="text-sm text-on-surface-variant">
            Hold any key to see it tracked in real-time. The <code
                class="rounded bg-surface-container-highest px-1 text-xs">pressedKeys</code
            >
            set and
            <code class="rounded bg-surface-container-highest px-1 text-xs">isPressed()</code> update
            reactively.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-wrap gap-2">
                {#each ['shift', 'ctrl', 'alt', 'meta'] as key}
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
</div>
