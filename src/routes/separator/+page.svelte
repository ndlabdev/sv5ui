<script lang="ts">
    import { Separator, Button } from '$lib/index.js'

    const colors = [
        'surface',
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info'
    ] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const types = ['solid', 'dashed', 'dotted'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Separator</h1>
        <p class="text-on-surface-variant">
            Visual divider for separating content with optional label, icon, or avatar.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p>Content above</p>
            <Separator class="my-4" />
            <p>Content below</p>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <Separator {color} label={color} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Separator {size} color="primary" label={size} />
            {/each}
        </div>
    </section>

    <!-- Types -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Types</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each types as type (type)}
                <Separator {type} size="sm" color="primary" label={type} />
            {/each}
        </div>
    </section>

    <!-- With Label -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Label</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Separator label="OR" color="primary" />
            <Separator label="Continue reading" color="secondary" size="sm" />
            <Separator label="Section break" color="tertiary" type="dashed" />
        </div>
    </section>

    <!-- With Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icon</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Separator icon="lucide:star" color="warning" size="sm" />
            <Separator icon="lucide:heart" color="error" size="md" />
            <Separator icon="lucide:zap" color="primary" size="lg" />
        </div>
    </section>

    <!-- With Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Avatar</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Separator
                avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John Doe', size: 'sm' }}
                color="primary"
            />
            <Separator
                avatar={{ src: 'https://i.pravatar.cc/150?img=2', alt: 'Alice Brown', size: 'md' }}
                color="secondary"
            />
        </div>
    </section>

    <!-- With Custom Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Separator color="primary">
                {#snippet content()}
                    <Button size="sm" variant="soft" color="primary">Load more</Button>
                {/snippet}
            </Separator>
            <Separator color="secondary">
                {#snippet content()}
                    <span
                        class="rounded-full bg-secondary-container px-3 py-1 text-xs text-on-secondary-container"
                    >
                        New messages
                    </span>
                {/snippet}
            </Separator>
        </div>
    </section>

    <!-- Vertical Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Vertical Orientation</h2>
        <div class="flex h-24 items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Center</span>
            <Separator orientation="vertical" color="primary" />
            <span>Right</span>
        </div>
        <div class="flex h-32 items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <span>Item 1</span>
            <Separator orientation="vertical" color="primary" label="OR" size="sm" />
            <span>Item 2</span>
            <Separator orientation="vertical" color="secondary" icon="lucide:plus" size="sm" />
            <span>Item 3</span>
        </div>
    </section>

    <!-- Color x Size Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors × Sizes</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Color</th
                        >
                        {#each sizes as size (size)}
                            <th
                                class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                                >{size}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each colors as color (color)}
                        <tr class="border-b border-outline-variant/50">
                            <td
                                class="px-3 py-3 text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</td
                            >
                            {#each sizes as size (size)}
                                <td class="px-3 py-3">
                                    <div class="w-24">
                                        <Separator {color} {size} />
                                    </div>
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- Login Form Divider -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">Login Form</p>
                <div class="mx-auto max-w-sm space-y-4 rounded-lg bg-surface p-4">
                    <Button block variant="outline">Continue with Google</Button>
                    <Separator label="or continue with email" size="sm" />
                    <Button block>Sign in</Button>
                </div>
            </div>

            <!-- Card Sections -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">Card Sections</p>
                <div class="mx-auto max-w-sm rounded-lg bg-surface p-4">
                    <h3 class="font-semibold">Order Summary</h3>
                    <p class="text-sm text-on-surface-variant">2 items</p>
                    <Separator class="my-3" />
                    <div class="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>$99.00</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>$5.00</span>
                    </div>
                    <Separator class="my-3" type="dashed" />
                    <div class="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>$104.00</span>
                    </div>
                </div>
            </div>

            <!-- Timeline -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">Timeline</p>
                <div class="mx-auto max-w-sm space-y-2">
                    <div class="flex items-center gap-3">
                        <div class="size-2 rounded-full bg-success"></div>
                        <span class="text-sm">Order placed</span>
                        <span class="ml-auto text-xs text-on-surface-variant">Today</span>
                    </div>
                    <Separator color="success" size="xs" class="ml-1" />
                    <div class="flex items-center gap-3">
                        <div class="size-2 rounded-full bg-success"></div>
                        <span class="text-sm">Processing</span>
                        <span class="ml-auto text-xs text-on-surface-variant">Today</span>
                    </div>
                    <Separator color="primary" size="xs" type="dashed" class="ml-1" />
                    <div class="flex items-center gap-3">
                        <div class="size-2 rounded-full bg-outline-variant"></div>
                        <span class="text-sm text-on-surface-variant">Shipped</span>
                        <span class="ml-auto text-xs text-on-surface-variant">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <Separator
                label="Custom label style"
                color="primary"
                ui={{ label: 'font-bold uppercase tracking-wider text-xs' }}
            />
            <Separator
                icon="lucide:sparkles"
                color="warning"
                size="md"
                ui={{ icon: 'animate-pulse' }}
            />
            <Separator
                label="Gradient border"
                ui={{
                    border: 'bg-gradient-to-r from-primary via-secondary to-tertiary h-0.5 border-none'
                }}
            />
        </div>
    </section>
</div>
