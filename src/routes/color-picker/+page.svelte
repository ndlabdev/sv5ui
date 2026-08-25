<script lang="ts">
    import { ColorPicker, Button, FormField, Popover } from '$lib/index.js'
    import type { ColorFormat } from '$lib/index.js'

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

    const brandSwatches = [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#06b6d4',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#000000',
        '#ffffff'
    ]

    let basicValue = $state('#3b82f6')
    let alphaValue = $state('rgba(59, 130, 246, 0.6)')
    let formatValue = $state('#22c55e')
    let selectedFormat = $state<ColorFormat>('hex')
    let swatchValue = $state('#8b5cf6')
    let popoverValue = $state('#f97316')
    let formValue = $state('#ec4899')
    let errorValue = $state('#ffffff')
    let commitLog = $state('none yet')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Color Picker</h1>
        <p class="text-on-surface-variant">
            An inline color picker with a saturation area, hue and alpha sliders, an eyedropper,
            preset swatches and an editable text field. Emits hex, rgb or hsl strings.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker bind:value={basicValue} />
            <div class="space-y-2">
                <div
                    class="size-16 rounded-lg ring-1 ring-outline-variant"
                    style:background={basicValue}
                ></div>
                <p class="text-sm text-on-surface-variant">Value: {basicValue}</p>
            </div>
        </div>
    </section>

    <!-- Alpha -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Alpha Channel</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">alpha</code
            >
            to add the transparency slider. The alpha channel is only appended to the value when the color
            is not fully opaque.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker bind:value={alphaValue} alpha format="rgb" />
            <p class="text-sm text-on-surface-variant">Value: {alphaValue}</p>
        </div>
    </section>

    <!-- Formats -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Formats</h2>
        <div class="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-high p-6 sm:grid-cols-3">
            {#each ['hex', 'rgb', 'hsl'] as const as format (format)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant">{format}</p>
                    <ColorPicker value={formatValue} {format} size="sm" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Format select -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Format Switcher</h2>
        <p class="text-sm text-on-surface-variant">
            With <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >formatSelect</code
            >
            the user can cycle between formats, and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:format</code
            > keeps the choice in sync.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker bind:value={formatValue} bind:format={selectedFormat} formatSelect alpha />
            <p class="text-sm text-on-surface-variant">
                Format: {selectedFormat} — Value: {formatValue}
            </p>
        </div>
    </section>

    <!-- Swatches -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Swatches</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker bind:value={swatchValue} swatches={brandSwatches} />
            <p class="text-sm text-on-surface-variant">Value: {swatchValue}</p>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            {#each sizes as size (size)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant">{size}</p>
                    <ColorPicker value="#3b82f6" {size} input={false} eyeDropper={false} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Focus Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            >
            prop themes the focus rings and the selected swatch outline.
        </p>
        <div class="grid grid-cols-2 gap-6 rounded-lg bg-surface-container-high p-6 lg:grid-cols-4">
            {#each colors as color (color)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                    <ColorPicker
                        value="#3b82f6"
                        {color}
                        size="xs"
                        input={false}
                        eyeDropper={false}
                        swatches={['#ef4444', '#3b82f6', '#22c55e']}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Events -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Change vs Commit</h2>
        <p class="text-sm text-on-surface-variant">
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onValueChange</code
            >
            fires on every move while dragging,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onValueCommit</code
            > only once the interaction ends.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker value="#06b6d4" onValueCommit={(value) => (commitLog = value)} />
            <p class="text-sm text-on-surface-variant">Last commit: {commitLog}</p>
        </div>
    </section>

    <!-- Popover -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inside a Popover</h2>
        <p class="text-sm text-on-surface-variant">
            The picker renders inline, so wrap it in a Popover to build a dropdown trigger.
        </p>
        <div class="rounded-lg bg-surface-container-high p-6">
            <Popover>
                <Button variant="outline">
                    <span
                        class="size-4 rounded ring-1 ring-outline-variant"
                        style:background={popoverValue}
                    ></span>
                    {popoverValue}
                </Button>
                {#snippet content()}
                    <div class="p-3">
                        <ColorPicker bind:value={popoverValue} swatches={brandSwatches} />
                    </div>
                {/snippet}
            </Popover>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="rounded-lg bg-surface-container-high p-6">
            <ColorPicker value="#3b82f6" disabled swatches={['#ef4444', '#3b82f6']} />
        </div>
    </section>

    <!-- FormField -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <div class="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-high p-6 sm:grid-cols-2">
            <FormField
                name="brand"
                label="Brand color"
                description="Used across buttons and links."
                required
            >
                <ColorPicker bind:value={formValue} class="mt-1" />
            </FormField>

            <FormField
                name="background"
                label="Background"
                error={errorValue === '#ffffff' ? 'Pick a color other than white.' : undefined}
            >
                <ColorPicker bind:value={errorValue} class="mt-1" />
            </FormField>
        </div>
    </section>

    <!-- Custom ui -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI Slots</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-6">
            <ColorPicker
                value="#f97316"
                swatches={brandSwatches}
                ui={{
                    root: 'w-64',
                    area: 'h-44 rounded-xl',
                    track: 'h-4',
                    thumb: 'size-5',
                    swatch: 'size-7 rounded-full'
                }}
            />
        </div>
    </section>
</div>
