<script lang="ts">
    import { Slider } from '$lib/index.js'

    const colors = [
        'primary', 'secondary', 'tertiary',
        'success', 'warning', 'error', 'info', 'surface'
    ] as const

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let basicValue = $state(40)
    let rangeValue = $state([20, 80])
    let stepValue = $state(50)
    let tooltipValue = $state(65)
    let tooltipRangeValue = $state([30, 70])
    let verticalValue = $state(60)
    let verticalRangeValue = $state([25, 75])
    let formValue = $state(50)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Slider</h1>
        <p class="text-on-surface-variant">
            Accessible range input built on bits-ui. Supports single thumb, range, tooltip, and all orientations.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-6 space-y-4">
            <Slider bind:value={basicValue} />
            <p class="text-sm text-on-surface-variant">Value: {basicValue}</p>
        </div>
    </section>

    <!-- Range -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Range (Multiple Thumbs)</h2>
        <div class="rounded-lg bg-surface-container-high p-6 space-y-4">
            <Slider bind:value={rangeValue} />
            <p class="text-sm text-on-surface-variant">Value: [{rangeValue.join(', ')}]</p>
        </div>
    </section>

    <!-- Step -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Step</h2>
        <div class="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-high p-6 sm:grid-cols-2">
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">step=10</p>
                <Slider bind:value={stepValue} step={10} />
                <p class="text-sm text-on-surface-variant">Value: {stepValue}</p>
            </div>
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">Discrete steps: [0, 25, 50, 75, 100]</p>
                <Slider value={25} step={[0, 25, 50, 75, 100]} />
            </div>
        </div>
    </section>

    <!-- Tooltip -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Tooltip</h2>
        <div class="grid grid-cols-1 gap-8 rounded-lg bg-surface-container-high p-6 sm:grid-cols-2">
            <div class="space-y-3 pt-6">
                <p class="text-sm font-medium text-on-surface-variant">Single</p>
                <Slider bind:value={tooltipValue} tooltip />
            </div>
            <div class="space-y-3 pt-6">
                <p class="text-sm font-medium text-on-surface-variant">Range</p>
                <Slider bind:value={tooltipRangeValue} tooltip />
            </div>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <div class="rounded-lg bg-surface-container-high p-6">
            <div class="flex items-start gap-12">
                <div class="space-y-3">
                    <p class="text-sm font-medium text-on-surface-variant">Horizontal (default)</p>
                    <div class="w-64">
                        <Slider bind:value={verticalValue} />
                    </div>
                </div>
                <div class="space-y-3">
                    <p class="text-sm font-medium text-on-surface-variant">Vertical</p>
                    <div class="h-40">
                        <Slider bind:value={verticalValue} orientation="vertical" />
                    </div>
                </div>
                <div class="space-y-3">
                    <p class="text-sm font-medium text-on-surface-variant">Vertical Range</p>
                    <div class="h-40">
                        <Slider bind:value={verticalRangeValue} orientation="vertical" />
                    </div>
                </div>
                <div class="space-y-3">
                    <p class="text-sm font-medium text-on-surface-variant">Vertical + Tooltip</p>
                    <div class="h-40 ps-6">
                        <Slider bind:value={verticalValue} orientation="vertical" tooltip />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-6">
            {#each colors as color (color)}
                <div class="flex items-center gap-4">
                    <span class="w-20 text-sm text-on-surface-variant">{color}</span>
                    <div class="flex-1">
                        <Slider {color} value={55} />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-5 rounded-lg bg-surface-container-high p-6">
            {#each sizes as size (size)}
                <div class="flex items-center gap-4">
                    <span class="w-6 text-xs text-on-surface-variant">{size}</span>
                    <div class="flex-1">
                        <Slider {size} value={60} />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-high p-6 sm:grid-cols-2">
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">Single</p>
                <Slider value={40} disabled />
            </div>
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">Range</p>
                <Slider value={[25, 75]} disabled />
            </div>
        </div>
    </section>

    <!-- Min / Max -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Min / Max</h2>
        <div class="grid grid-cols-1 gap-6 rounded-lg bg-surface-container-high p-6 sm:grid-cols-2">
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">min=20, max=80</p>
                <Slider min={20} max={80} value={50} tooltip />
            </div>
            <div class="space-y-3">
                <p class="text-sm font-medium text-on-surface-variant">min=-50, max=50</p>
                <Slider min={-50} max={50} value={0} tooltip />
            </div>
        </div>
    </section>

    <!-- Form Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form Integration</h2>
        <div class="rounded-lg bg-surface-container-high p-6">
            <form
                class="max-w-sm space-y-4"
                onsubmit={(e) => { e.preventDefault(); alert(`volume = ${formValue}`) }}
            >
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-on-surface" for="vol-out">
                        Volume: {formValue}
                    </label>
                    <Slider name="volume" bind:value={formValue} color="success" />
                </div>
                <button
                    type="submit"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary"
                >
                    Submit
                </button>
            </form>
        </div>
    </section>

    <!-- Custom ui -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI Slots</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-6">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Thick track + large rounded thumb</p>
                <Slider
                    value={55}
                    color="tertiary"
                    ui={{
                        track: 'h-4 rounded-md',
                        range: 'rounded-md',
                        thumb: 'size-6 rounded-md shadow-md'
                    }}
                />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom tooltip style</p>
                <Slider
                    value={70}
                    tooltip
                    color="info"
                    ui={{ tooltip: 'bg-info text-on-info rounded-full px-2' }}
                    class="pt-6"
                />
            </div>
        </div>
    </section>
</div>
