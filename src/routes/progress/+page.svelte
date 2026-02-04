<script lang="ts">
    import { Progress, Button } from '$lib/index.js'

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
    const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    const animations = ['carousel', 'carousel-inverse', 'swing', 'elastic'] as const

    let value = $state(65)
    let stepValue = $state(2)
    const steps = ['Cart', 'Shipping', 'Payment', 'Confirm']
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Progress</h1>
        <p class="text-on-surface-variant">
            Visual indicator for task completion or loading status.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress value={25} />
            <Progress value={50} />
            <Progress value={75} />
            <Progress value={100} />
        </div>
    </section>

    <!-- Interactive -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Interactive</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress {value} status />
            <div class="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => (value = Math.max(0, value - 10))}
                >
                    -10
                </Button>
                <input type="range" min="0" max="100" bind:value class="flex-1" />
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => (value = Math.min(100, value + 10))}
                >
                    +10
                </Button>
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each colors as color}
                <div class="flex items-center gap-3">
                    <span class="w-20 text-sm text-on-surface-variant capitalize">{color}</span>
                    <Progress {color} value={70} class="flex-1" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size}
                <div class="flex items-center gap-3">
                    <span class="w-12 text-sm text-on-surface-variant">{size}</span>
                    <Progress {size} value={60} class="flex-1" />
                </div>
            {/each}
        </div>
    </section>

    <!-- With Status -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Status</h2>
        <p class="text-sm text-on-surface-variant">
            Display percentage text above the progress bar.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress value={33} status />
            <Progress value={66} status color="success" />
            <Progress value={100} status color="tertiary" />
        </div>
    </section>

    <!-- Indeterminate -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Indeterminate</h2>
        <p class="text-sm text-on-surface-variant">
            When value is null or undefined, the progress shows an animated indeterminate state.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress value={null} />
            <Progress value={null} color="success" />
            <Progress value={null} color="tertiary" />
        </div>
    </section>

    <!-- Animations -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Animations</h2>
        <p class="text-sm text-on-surface-variant">
            Different animation styles for the indeterminate state.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each animations as animation}
                <div class="flex items-center gap-3">
                    <span class="w-32 text-sm text-on-surface-variant">{animation}</span>
                    <Progress {animation} class="flex-1" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Vertical -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Vertical Orientation</h2>
        <div class="flex flex-wrap gap-8 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <div class="h-32">
                    <Progress value={75} orientation="vertical" />
                </div>
                <span class="text-xs text-on-surface-variant">75%</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="h-32">
                    <Progress value={50} orientation="vertical" color="success" />
                </div>
                <span class="text-xs text-on-surface-variant">50%</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="h-32">
                    <Progress value={null} orientation="vertical" color="tertiary" />
                </div>
                <span class="text-xs text-on-surface-variant">loading</span>
            </div>
            {#each sizes as size}
                <div class="flex flex-col items-center gap-2">
                    <div class="h-32">
                        <Progress value={60} orientation="vertical" {size} />
                    </div>
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Inverted -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inverted</h2>
        <p class="text-sm text-on-surface-variant">
            Reverse the fill direction and status position.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <span class="text-sm text-on-surface-variant">Normal</span>
                    <Progress value={60} status />
                </div>
                <div class="space-y-2">
                    <span class="text-sm text-on-surface-variant">Inverted</span>
                    <Progress value={60} status inverted />
                </div>
            </div>
            <div class="flex gap-8">
                <div class="flex flex-col items-center gap-2">
                    <div class="h-32">
                        <Progress value={60} orientation="vertical" />
                    </div>
                    <span class="text-xs text-on-surface-variant">Normal</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div class="h-32">
                        <Progress value={60} orientation="vertical" inverted />
                    </div>
                    <span class="text-xs text-on-surface-variant">Inverted</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Steps -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Step-based Progress</h2>
        <p class="text-sm text-on-surface-variant">
            Use an array of strings as max to display labeled steps.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress value={stepValue} max={steps} />
            <div class="flex items-center justify-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => (stepValue = Math.max(0, stepValue - 1))}
                    disabled={stepValue === 0}
                >
                    Previous
                </Button>
                <span class="px-4 text-sm text-on-surface-variant">
                    Step {stepValue + 1} of {steps.length}
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => (stepValue = Math.min(steps.length - 1, stepValue + 1))}
                    disabled={stepValue === steps.length - 1}
                >
                    Next
                </Button>
            </div>
        </div>
    </section>

    <!-- Custom Status Slot -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Status Slot</h2>
        <p class="text-sm text-on-surface-variant">Customize the status display with a snippet.</p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress value={75} status>
                {#snippet statusSlot({ percent })}
                    <span class="font-medium text-primary">{percent}% completed</span>
                {/snippet}
            </Progress>
            <Progress value={40} status color="warning">
                {#snippet statusSlot({ percent })}
                    <span class="text-warning">Uploading... {percent}%</span>
                {/snippet}
            </Progress>
        </div>
    </section>

    <!-- Colors x Sizes Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors x Sizes</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Color</th
                        >
                        {#each sizes as size}
                            <th
                                class="px-3 py-3 text-center text-sm font-medium text-on-surface-variant"
                                >{size}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each colors as color}
                        <tr class="border-b border-outline-variant/50">
                            <td
                                class="px-3 py-3 text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</td
                            >
                            {#each sizes as size}
                                <td class="px-3 py-3">
                                    <Progress {color} {size} value={65} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Progress
                value={70}
                ui={{
                    base: 'rounded-none',
                    indicator: 'rounded-none bg-gradient-to-r from-primary to-tertiary'
                }}
            />
            <Progress
                value={50}
                status
                ui={{
                    base: 'h-4 rounded-lg',
                    indicator: 'rounded-lg',
                    status: 'font-bold text-primary'
                }}
            />
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- File Upload -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">File Upload</p>
                <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                    <div class="mb-2 flex items-center justify-between">
                        <span class="text-sm">document.pdf</span>
                        <span class="text-sm text-on-surface-variant">2.4 MB / 3.2 MB</span>
                    </div>
                    <Progress value={75} color="primary" size="sm" />
                </div>
            </div>

            <!-- Loading State -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Loading State</p>
                <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                    <div class="mb-2 flex items-center gap-2">
                        <span class="text-sm">Processing data...</span>
                    </div>
                    <Progress value={null} color="info" size="xs" />
                </div>
            </div>

            <!-- Multi-step Form -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Checkout Flow</p>
                <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                    <Progress
                        value={2}
                        max={['Cart', 'Shipping', 'Payment', 'Done']}
                        color="success"
                    />
                </div>
            </div>

            <!-- Skill Bars -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Skill Bars</p>
                <div
                    class="space-y-3 rounded-lg border border-outline-variant bg-surface-container p-4"
                >
                    <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>TypeScript</span>
                            <span class="text-on-surface-variant">90%</span>
                        </div>
                        <Progress value={90} color="primary" size="sm" />
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>Svelte</span>
                            <span class="text-on-surface-variant">85%</span>
                        </div>
                        <Progress value={85} color="tertiary" size="sm" />
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>Rust</span>
                            <span class="text-on-surface-variant">60%</span>
                        </div>
                        <Progress value={60} color="warning" size="sm" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
