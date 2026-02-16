<script lang="ts">
    import { Timeline, Button, Separator } from '$lib/index.js'
    import type { TimelineItem } from '$lib/index.js'

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
    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const

    // Playground state
    let playgroundColor = $state<(typeof colors)[number]>('primary')
    let playgroundSize = $state<(typeof sizes)[number]>('md')
    let playgroundOrientation = $state<'vertical' | 'horizontal'>('vertical')
    let playgroundReverse = $state(false)
    let playgroundValue = $state(2)

    const playgroundItems: TimelineItem[] = [
        {
            value: 1,
            icon: 'lucide:file-text',
            title: 'Step 1',
            description: 'First step description',
            date: 'Jan 1'
        },
        {
            value: 2,
            icon: 'lucide:settings',
            title: 'Step 2',
            description: 'Second step description',
            date: 'Jan 2'
        },
        {
            value: 3,
            icon: 'lucide:check-circle',
            title: 'Step 3',
            description: 'Third step description',
            date: 'Jan 3'
        },
        {
            value: 4,
            icon: 'lucide:flag',
            title: 'Step 4',
            description: 'Final step description',
            date: 'Jan 4'
        }
    ]

    // Order tracking demo
    let orderStep = $state(2)
    const orderItems: TimelineItem[] = [
        {
            value: 1,
            icon: 'lucide:shopping-cart',
            title: 'Order Placed',
            description: 'Your order has been confirmed',
            date: 'Dec 20'
        },
        {
            value: 2,
            icon: 'lucide:package',
            title: 'Processing',
            description: 'We are preparing your items',
            date: 'Dec 21'
        },
        {
            value: 3,
            icon: 'lucide:truck',
            title: 'Shipped',
            description: 'On the way to delivery address',
            date: 'Dec 22'
        },
        {
            value: 4,
            icon: 'lucide:home',
            title: 'Delivered',
            description: 'Package delivered successfully',
            date: 'Dec 24'
        }
    ]

    // Activity feed
    const activityItems: TimelineItem[] = [
        {
            avatar: { src: 'https://i.pravatar.cc/150?u=john', alt: 'John' },
            title: 'John merged PR #142',
            description: 'feat: add new Timeline component',
            date: '5 min ago'
        },
        {
            avatar: { src: 'https://i.pravatar.cc/150?u=sarah', alt: 'Sarah' },
            title: 'Sarah commented',
            description: 'Looks great! Ready for review.',
            date: '15 min ago'
        },
        {
            avatar: { src: 'https://i.pravatar.cc/150?u=mike', alt: 'Mike' },
            title: 'Mike pushed 3 commits',
            description: 'fix: resolve styling issues',
            date: '1 hour ago'
        },
        {
            avatar: { src: 'https://i.pravatar.cc/150?u=emma', alt: 'Emma' },
            title: 'Emma created issue #38',
            description: 'Bug: Timeline not rendering correctly',
            date: '2 hours ago'
        }
    ]

    // Checkout stepper
    let checkoutStep = $state(2)
    const checkoutItems: TimelineItem[] = [
        { value: 1, icon: 'lucide:shopping-bag', title: 'Cart' },
        { value: 2, icon: 'lucide:map-pin', title: 'Address' },
        { value: 3, icon: 'lucide:credit-card', title: 'Payment' },
        { value: 4, icon: 'lucide:check', title: 'Confirm' }
    ]

    // Project milestones
    const milestoneItems: TimelineItem[] = [
        { value: 'planning', icon: 'lucide:lightbulb', title: 'Planning', date: 'Q1 2024' },
        { value: 'design', icon: 'lucide:palette', title: 'Design', date: 'Q2 2024' },
        { value: 'development', icon: 'lucide:code', title: 'Development', date: 'Q3 2024' },
        { value: 'testing', icon: 'lucide:bug', title: 'Testing', date: 'Q4 2024' },
        { value: 'launch', icon: 'lucide:rocket', title: 'Launch', date: 'Q1 2025' }
    ]
</script>

<div class="space-y-12">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Timeline</h1>
        <p class="text-on-surface-variant">
            Display a sequence of events with dates, titles, icons or avatars. Supports vertical and
            horizontal orientations.
        </p>
    </div>

    <!-- Interactive Playground -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold">Interactive Playground</h2>
        <div class="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div class="rounded-lg bg-surface-container-high p-6">
                <Timeline
                    items={playgroundItems}
                    color={playgroundColor}
                    size={playgroundSize}
                    orientation={playgroundOrientation}
                    reverse={playgroundReverse}
                    value={playgroundValue}
                />
            </div>
            <div class="space-y-4 rounded-lg border border-outline-variant p-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Color</label>
                    <div class="flex flex-wrap gap-1">
                        {#each colors as color (color)}
                            <button
                                class="rounded px-2 py-1 text-xs capitalize transition-colors"
                                class:bg-primary={playgroundColor === color}
                                class:text-on-primary={playgroundColor === color}
                                class:bg-surface-container-highest={playgroundColor !== color}
                                onclick={() => (playgroundColor = color)}
                            >
                                {color}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Size</label>
                    <div class="flex flex-wrap gap-1">
                        {#each sizes as size (size)}
                            <button
                                class="rounded px-2 py-1 text-xs transition-colors"
                                class:bg-primary={playgroundSize === size}
                                class:text-on-primary={playgroundSize === size}
                                class:bg-surface-container-highest={playgroundSize !== size}
                                onclick={() => (playgroundSize = size)}
                            >
                                {size}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Orientation</label>
                    <div class="flex gap-2">
                        <button
                            class="flex-1 rounded px-3 py-1.5 text-sm transition-colors"
                            class:bg-primary={playgroundOrientation === 'vertical'}
                            class:text-on-primary={playgroundOrientation === 'vertical'}
                            class:bg-surface-container-highest={playgroundOrientation !==
                                'vertical'}
                            onclick={() => (playgroundOrientation = 'vertical')}
                        >
                            Vertical
                        </button>
                        <button
                            class="flex-1 rounded px-3 py-1.5 text-sm transition-colors"
                            class:bg-primary={playgroundOrientation === 'horizontal'}
                            class:text-on-primary={playgroundOrientation === 'horizontal'}
                            class:bg-surface-container-highest={playgroundOrientation !==
                                'horizontal'}
                            onclick={() => (playgroundOrientation = 'horizontal')}
                        >
                            Horizontal
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">Options</label>
                    <label class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            bind:checked={playgroundReverse}
                            class="accent-primary"
                        />
                        <span class="text-sm">Reverse direction</span>
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">
                        Active Step: {playgroundValue}
                        <input
                            type="range"
                            min="1"
                            max="4"
                            bind:value={playgroundValue}
                            class="w-full accent-primary"
                        />
                    </label>
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Without active state</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline
                        items={[
                            { title: 'Event 1', date: 'Jan 1' },
                            { title: 'Event 2', date: 'Jan 5' },
                            { title: 'Event 3', date: 'Jan 10' }
                        ]}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With active state</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline
                        items={[
                            { value: 1, title: 'Completed', date: 'Jan 1' },
                            { value: 2, title: 'Active', date: 'Jan 5' },
                            { value: 3, title: 'Pending', date: 'Jan 10' }
                        ]}
                        value={2}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- With Icons & Avatars -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold">Icons & Avatars</h2>
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With Icons</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline
                        items={[
                            { value: 1, icon: 'lucide:file-plus', title: 'Created', date: 'Dec 1' },
                            { value: 2, icon: 'lucide:edit', title: 'Edited', date: 'Dec 5' },
                            {
                                value: 3,
                                icon: 'lucide:check-circle',
                                title: 'Approved',
                                date: 'Dec 8'
                            }
                        ]}
                        value={2}
                        color="success"
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With Avatars</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline
                        items={[
                            {
                                avatar: { src: 'https://i.pravatar.cc/150?u=a', alt: 'Alice' },
                                title: 'Alice started',
                                date: '2h ago'
                            },
                            {
                                avatar: { src: 'https://i.pravatar.cc/150?u=b', alt: 'Bob' },
                                title: 'Bob reviewed',
                                date: '1h ago'
                            },
                            { avatar: { alt: 'You' }, title: 'You approved', date: 'Just now' }
                        ]}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {#each colors as color (color)}
                <div class="rounded-lg bg-surface-container-high p-3">
                    <p class="mb-2 text-xs font-medium text-on-surface-variant capitalize">
                        {color}
                    </p>
                    <Timeline
                        items={[
                            { value: 1, title: 'Done' },
                            { value: 2, title: 'Active' },
                            { value: 3, title: 'Next' }
                        ]}
                        value={2}
                        {color}
                        size="sm"
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes Comparison -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="overflow-x-auto">
            <div
                class="flex gap-6 rounded-lg bg-surface-container-high p-4"
                style="min-width: max-content;"
            >
                {#each sizes as size (size)}
                    <div class="flex flex-col items-center gap-2">
                        <span class="text-xs font-medium text-on-surface-variant">{size}</span>
                        <Timeline
                            items={[
                                { value: 1, icon: 'lucide:check' },
                                { value: 2, icon: 'lucide:circle' }
                            ]}
                            value={1}
                            {size}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <!-- Order Tracking -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Order Tracking</p>
            <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                <Timeline items={orderItems} value={orderStep} color="success" />
                <div class="mt-4 flex items-center justify-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onclick={() => (orderStep = Math.max(1, orderStep - 1))}
                        disabled={orderStep === 1}
                    >
                        Previous
                    </Button>
                    <span class="px-3 text-sm text-on-surface-variant">Step {orderStep} of 4</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onclick={() => (orderStep = Math.min(4, orderStep + 1))}
                        disabled={orderStep === 4}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>

        <!-- Checkout Stepper -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Checkout Stepper (Horizontal)</p>
            <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                <Timeline
                    items={checkoutItems}
                    value={checkoutStep}
                    orientation="horizontal"
                    size="lg"
                />
                <div class="mt-4 flex items-center justify-between">
                    <Button
                        size="sm"
                        variant="ghost"
                        onclick={() => (checkoutStep = Math.max(1, checkoutStep - 1))}
                        disabled={checkoutStep === 1}
                    >
                        Back
                    </Button>
                    <Button
                        size="sm"
                        onclick={() => (checkoutStep = Math.min(4, checkoutStep + 1))}
                        disabled={checkoutStep === 4}
                    >
                        {checkoutStep === 3 ? 'Place Order' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>

        <!-- Activity Feed -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Activity Feed</p>
            <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                <Timeline items={activityItems} size="lg" />
            </div>
        </div>

        <!-- Project Milestones -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Project Milestones</p>
            <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                <Timeline items={milestoneItems} value="development" color="tertiary" />
            </div>
        </div>
    </section>

    <Separator />

    <!-- Custom Slots -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Customization</h2>

        <!-- Custom Indicator -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Custom Indicator Slot</p>
            <div class="rounded-lg bg-surface-container-high p-4">
                <Timeline
                    items={[
                        { value: 1, title: 'Phase 1', date: 'Q1' },
                        { value: 2, title: 'Phase 2', date: 'Q2' },
                        { value: 3, title: 'Phase 3', date: 'Q3' }
                    ]}
                    value={2}
                >
                    {#snippet indicator({ state, index })}
                        <div
                            class="flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all"
                            class:bg-primary={state !== 'pending'}
                            class:text-on-primary={state !== 'pending'}
                            class:bg-surface-container-highest={state === 'pending'}
                            class:text-on-surface-variant={state === 'pending'}
                            class:scale-110={state === 'active'}
                        >
                            {index + 1}
                        </div>
                    {/snippet}
                </Timeline>
            </div>
        </div>

        <!-- Custom Content -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Custom Content Slot</p>
            <div class="rounded-lg bg-surface-container-high p-4">
                <Timeline
                    items={[
                        { value: 'v1', icon: 'lucide:package', title: 'v1.0.0', date: 'Jan 2024' },
                        { value: 'v2', icon: 'lucide:sparkles', title: 'v2.0.0', date: 'Jun 2024' },
                        { value: 'v3', icon: 'lucide:rocket', title: 'v3.0.0', date: 'Coming Soon' }
                    ]}
                    value="v2"
                    color="info"
                >
                    {#snippet content({ item, state })}
                        <div
                            class="mt-2 rounded-lg border border-outline-variant bg-surface-container p-3"
                        >
                            {#if item.value === 'v1'}
                                <ul class="space-y-1 text-sm text-on-surface-variant">
                                    <li>• Initial release</li>
                                    <li>• Core components</li>
                                </ul>
                            {:else if item.value === 'v2'}
                                <ul class="space-y-1 text-sm text-on-surface-variant">
                                    <li>• Timeline component</li>
                                    <li>• Performance improvements</li>
                                </ul>
                            {:else}
                                <p class="text-sm text-on-surface-variant">
                                    {state === 'pending'
                                        ? 'Exciting features coming!'
                                        : 'Released!'}
                                </p>
                            {/if}
                        </div>
                    {/snippet}
                </Timeline>
            </div>
        </div>

        <!-- UI Overrides -->
        <div class="space-y-3">
            <p class="text-sm font-medium">UI Slot Overrides</p>
            <div class="rounded-lg bg-surface-container-high p-4">
                <Timeline
                    items={[
                        {
                            value: 1,
                            icon: 'lucide:star',
                            title: 'Styled indicator',
                            date: 'Custom ring'
                        },
                        {
                            value: 2,
                            icon: 'lucide:zap',
                            title: 'Gradient separator',
                            date: 'Colorful'
                        },
                        { value: 3, icon: 'lucide:heart', title: 'Bold title', date: 'Italic date' }
                    ]}
                    value={2}
                    ui={{
                        indicator:
                            'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high',
                        separator: 'bg-gradient-to-b from-primary to-tertiary',
                        title: 'text-primary font-bold',
                        date: 'italic'
                    }}
                />
            </div>
        </div>
    </section>
</div>
