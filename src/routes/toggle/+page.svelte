<script lang="ts">
    import { Toggle } from '$lib/index.js'

    const variants = ['outline', 'soft', 'subtle', 'ghost'] as const
    const colors = [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'surface'
    ] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let bindPressed = $state(false)
    let bold = $state(true)
    let italic = $state(false)
    let underline = $state(false)
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Toggle</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A two-state button that can be toggled on or off. Unlike Switch, it is a plain button
            with <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >aria-pressed</code
            > semantics, not a form control.
        </p>
        <Toggle label="Toggle me" />
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:pressed</code
            > for reactive two-way data binding.
        </p>
        <div class="flex flex-wrap items-center gap-6">
            <Toggle bind:pressed={bindPressed} label="Notifications" icon="lucide:bell" />
            <p class="text-sm text-on-surface-variant">
                Pressed: <span class="font-mono text-on-surface">{bindPressed}</span>
            </p>
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant</code
            > to control the visual style. The off state stays neutral; the color appears when pressed.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            {#each variants as variant (variant)}
                <Toggle {variant} pressed={true} label={variant} />
            {/each}
        </div>
        <div class="flex flex-wrap items-center gap-4">
            {#each variants as variant (variant)}
                <Toggle {variant} label={variant} />
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > to control the pressed color scheme.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            {#each colors as color (color)}
                <Toggle {color} variant="soft" pressed={true} label={color} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code>
            to control the dimensions.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            {#each sizes as size (size)}
                <Toggle {size} variant="outline" label={size} />
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            for icon-only toggles, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >leadingIcon</code
            >
            /
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >trailingIcon</code
            >
            alongside a label. Icon-only toggles need an
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >aria-label</code
            >.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            <Toggle icon="lucide:pin" aria-label="Pin" />
            <Toggle icon="lucide:star" variant="outline" color="warning" aria-label="Favorite" />
            <Toggle leadingIcon="lucide:wifi" label="Wi-Fi" variant="soft" />
            <Toggle trailingIcon="lucide:chevron-down" label="Details" variant="subtle" />
        </div>
    </section>

    <!-- Toolbar Example -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Toolbar Example</h2>
        <p class="text-sm text-on-surface-variant">
            Icon-only toggles composed into a formatting toolbar, the primary use case.
        </p>
        <div
            class="inline-flex items-center gap-1 rounded-lg bg-surface-container p-1"
            role="group"
            aria-label="Text formatting"
        >
            <Toggle bind:pressed={bold} icon="lucide:bold" color="surface" aria-label="Bold" />
            <Toggle
                bind:pressed={italic}
                icon="lucide:italic"
                color="surface"
                aria-label="Italic"
            />
            <Toggle
                bind:pressed={underline}
                icon="lucide:underline"
                color="surface"
                aria-label="Underline"
            />
        </div>
        <p class="text-sm text-on-surface-variant">
            Bold: <span class="font-mono text-on-surface">{bold}</span> · Italic:
            <span class="font-mono text-on-surface">{italic}</span>
            · Underline: <span class="font-mono text-on-surface">{underline}</span>
        </p>
    </section>

    <!-- Block -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Block</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">block</code
            > to stretch the toggle to the full container width.
        </p>
        <Toggle block variant="outline" leadingIcon="lucide:panel-left" label="Show sidebar" />
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            > to prevent interaction.
        </p>
        <div class="flex flex-wrap items-center gap-4">
            <Toggle disabled label="Disabled off" variant="outline" />
            <Toggle disabled pressed={true} label="Disabled on" variant="soft" />
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Content</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >children</code
            > snippet for custom label content.
        </p>
        <Toggle variant="subtle" color="success">
            <span class="font-mono">auto-save</span>
        </Toggle>
    </section>
</div>
