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

    // Basic items
    const basicItems: TimelineItem[] = [
        { value: 1, title: 'Step 1', description: 'First step', date: 'Jan 1' },
        { value: 2, title: 'Step 2', description: 'Second step', date: 'Jan 5' },
        { value: 3, title: 'Step 3', description: 'Third step', date: 'Jan 10' }
    ]

    // Order tracking
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
            description: 'Preparing your items',
            date: 'Dec 21'
        },
        {
            value: 3,
            icon: 'lucide:truck',
            title: 'Shipped',
            description: 'On the way to you',
            date: 'Dec 22'
        },
        {
            value: 4,
            icon: 'lucide:home',
            title: 'Delivered',
            description: 'Package delivered',
            date: 'Dec 24'
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

    // Activity feed
    const activityItems: TimelineItem[] = [
        {
            avatar: { src: 'https://i.pravatar.cc/150?u=john', alt: 'John' },
            title: 'John merged PR #142',
            description: 'feat: add Timeline component',
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

    // Per-item ui demo
    const perItemUiItems: TimelineItem[] = [
        {
            value: 1,
            icon: 'lucide:star',
            title: 'Highlighted Step',
            date: 'Special',
            ui: {
                indicator: 'ring-2 ring-warning ring-offset-2 ring-offset-surface-container-high',
                title: 'text-warning font-bold'
            }
        },
        {
            value: 2,
            icon: 'lucide:zap',
            title: 'Normal Step',
            date: 'Default'
        },
        {
            value: 3,
            icon: 'lucide:heart',
            title: 'Custom Separator',
            date: 'Styled',
            ui: { separator: 'bg-gradient-to-b from-error to-primary' }
        }
    ]
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Timeline</h1>
        <p class="text-on-surface-variant">
            Display a sequence of events with dates, titles, icons or avatars.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
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
                    <Timeline items={basicItems} value={2} />
                </div>
            </div>
        </div>
    </section>

    <!-- Icons & Avatars -->
    <section class="space-y-3">
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
    <section class="space-y-3">
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

    <!-- Sizes -->
    <section class="space-y-3">
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

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <div class="space-y-4">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Horizontal</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline items={basicItems} value={2} orientation="horizontal" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Horizontal Reversed</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline items={basicItems} value={2} orientation="horizontal" reverse />
                </div>
            </div>
        </div>
    </section>

    <!-- Per-item UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Per-item UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Each item can have its own <code class="rounded bg-surface-container-highest px-1"
                >ui</code
            > prop to override slot classes.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Timeline items={perItemUiItems} value={2} />
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom Indicator</p>
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
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom Content</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Timeline
                        items={[
                            {
                                value: 'v1',
                                icon: 'lucide:package',
                                title: 'v1.0.0',
                                date: 'Jan 2024'
                            },
                            {
                                value: 'v2',
                                icon: 'lucide:sparkles',
                                title: 'v2.0.0',
                                date: 'Jun 2024'
                            },
                            {
                                value: 'v3',
                                icon: 'lucide:rocket',
                                title: 'v3.0.0',
                                date: 'Coming Soon'
                            }
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
                                        <li>Initial release</li>
                                        <li>Core components</li>
                                    </ul>
                                {:else if item.value === 'v2'}
                                    <ul class="space-y-1 text-sm text-on-surface-variant">
                                        <li>Timeline component</li>
                                        <li>Performance improvements</li>
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
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Timeline
                items={[
                    { value: 1, icon: 'lucide:star', title: 'Custom Ring', date: 'Styled' },
                    { value: 2, icon: 'lucide:zap', title: 'Gradient Line', date: 'Colorful' },
                    { value: 3, icon: 'lucide:heart', title: 'Bold Title', date: 'Italic' }
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
    </section>
</div>
