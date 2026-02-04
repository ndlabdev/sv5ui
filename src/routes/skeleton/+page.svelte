<script lang="ts">
    import { Skeleton, Card, Avatar, Button } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Skeleton</h1>
        <p class="text-on-surface-variant">
            Display placeholder content while data is loading to improve perceived performance.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-4 w-2/3" />
        </div>
    </section>

    <!-- Different Shapes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Different Shapes</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <!-- Text Lines -->
            <div class="space-y-2">
                <p class="mb-2 text-sm font-medium">Text Lines</p>
                <Skeleton class="h-4 w-48" />
                <Skeleton class="h-4 w-40" />
                <Skeleton class="h-4 w-44" />
            </div>

            <!-- Circle (Avatar) -->
            <div class="space-y-2">
                <p class="mb-2 text-sm font-medium">Circle</p>
                <Skeleton class="size-12 rounded-full" />
            </div>

            <!-- Square -->
            <div class="space-y-2">
                <p class="mb-2 text-sm font-medium">Square</p>
                <Skeleton class="size-24 rounded-lg" />
            </div>

            <!-- Rectangle (Image) -->
            <div class="space-y-2">
                <p class="mb-2 text-sm font-medium">Rectangle</p>
                <Skeleton class="h-32 w-48 rounded-lg" />
            </div>
        </div>
    </section>

    <!-- Loading Card -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading Card</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <!-- Skeleton Card -->
            <Card>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <Skeleton class="size-12 rounded-full" />
                        <div class="flex-1 space-y-2">
                            <Skeleton class="h-4 w-1/3" />
                            <Skeleton class="h-3 w-1/2" />
                        </div>
                    </div>
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-5/6" />
                    <Skeleton class="h-4 w-4/6" />
                    <div class="flex gap-2 pt-2">
                        <Skeleton class="h-9 w-24" />
                        <Skeleton class="h-9 w-20" />
                    </div>
                </div>
            </Card>

            <!-- Actual Card -->
            <Card>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <Avatar src="https://i.pravatar.cc/150?img=3" alt="Jane Smith" size="md" />
                        <div>
                            <h3 class="font-semibold">Jane Smith</h3>
                            <p class="text-sm text-on-surface-variant">Product Designer</p>
                        </div>
                    </div>
                    <p class="text-on-surface-variant">
                        Creating beautiful and functional user interfaces with attention to detail
                        and user experience.
                    </p>
                    <div class="flex gap-2">
                        <Button variant="solid" color="primary" label="Follow" size="sm" />
                        <Button variant="ghost" color="secondary" label="Message" size="sm" />
                    </div>
                </div>
            </Card>
        </div>
    </section>

    <!-- Loading List -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading List</h2>
        <Card>
            <div class="space-y-4">
                {#each Array(4) as _, i (i)}
                    <div
                        class="flex items-center gap-3 border-b border-outline-variant pb-4 last:border-0 last:pb-0"
                    >
                        <Skeleton class="size-10 rounded-full" />
                        <div class="flex-1 space-y-2">
                            <Skeleton class="h-4 w-1/4" />
                            <Skeleton class="h-3 w-3/4" />
                        </div>
                    </div>
                {/each}
            </div>
        </Card>
    </section>

    <!-- Loading Article -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading Article</h2>
        <Card as="article">
            <div class="space-y-4">
                <!-- Header -->
                <div class="space-y-3">
                    <Skeleton class="h-8 w-3/4" />
                    <div class="flex items-center gap-3">
                        <Skeleton class="size-8 rounded-full" />
                        <div class="space-y-2">
                            <Skeleton class="h-3 w-24" />
                            <Skeleton class="h-3 w-32" />
                        </div>
                    </div>
                </div>

                <!-- Featured Image -->
                <Skeleton class="h-64 w-full rounded-lg" />

                <!-- Content -->
                <div class="space-y-2">
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-5/6" />
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-4/6" />
                </div>
            </div>
        </Card>
    </section>

    <!-- Loading Dashboard Widgets -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading Dashboard Widgets</h2>
        <div class="grid gap-4 md:grid-cols-3">
            {#each Array(3) as _, i (i)}
                <Card>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <Skeleton class="h-4 w-24" />
                            <Skeleton class="size-6 rounded" />
                        </div>
                        <Skeleton class="h-10 w-20" />
                        <Skeleton class="h-20 w-full rounded" />
                    </div>
                </Card>
            {/each}
        </div>
    </section>

    <!-- Custom Styling -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Styling</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-5/6 rounded-full" />
            <Skeleton class="h-24 w-full rounded-2xl" />
            <div class="flex gap-2">
                <Skeleton class="h-10 w-20 rounded-full" />
                <Skeleton class="h-10 w-20 rounded-full" />
                <Skeleton class="h-10 w-20 rounded-full" />
            </div>
        </div>
    </section>

    <!-- As Different Element -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Different Element</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Skeleton as="span" class="inline-block h-4 w-32" />
            <Skeleton as="div" class="my-2 h-4 w-48" />
            <Skeleton as="p" class="h-4 w-40" />
        </div>
    </section>
</div>
