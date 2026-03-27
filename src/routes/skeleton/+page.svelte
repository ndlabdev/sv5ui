<script lang="ts">
    import { Skeleton, Card, Avatar, Button, Separator } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Skeleton</h1>
        <p class="text-on-surface-variant">
            Display placeholder content while data is loading to improve perceived performance.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-4 w-2/3" />
        </div>
    </section>

    <!-- Shapes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Shapes</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Text Lines</p>
                <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
                    <Skeleton class="h-4 w-48" />
                    <Skeleton class="h-4 w-40" />
                    <Skeleton class="h-4 w-44" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Circle (Avatar)</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-4"
                >
                    <Skeleton class="size-12 rounded-full" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Square</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-4"
                >
                    <Skeleton class="size-24 rounded-lg" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Rectangle (Image)</p>
                <div
                    class="flex items-center justify-center rounded-lg bg-surface-container-high p-4"
                >
                    <Skeleton class="h-24 w-full rounded-lg" />
                </div>
            </div>
        </div>
    </section>

    <!-- As Different Element -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Different Element</h2>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <Skeleton as="span" class="inline-block h-4 w-32" />
            <Skeleton as="div" class="h-4 w-48" />
            <Skeleton as="p" class="h-4 w-40" />
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom background</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Skeleton class="h-16 w-full" ui={{ root: 'bg-primary/15' }} />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom border radius</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Skeleton class="h-16 w-full" ui={{ root: 'rounded-2xl' }} />
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <!-- Loading Card Comparison -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Card Loading vs Loaded</p>
            <div class="grid gap-4 md:grid-cols-2">
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
                <Card>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <Avatar
                                src="https://i.pravatar.cc/150?img=3"
                                alt="Jane Smith"
                                size="md"
                            />
                            <div>
                                <h3 class="font-semibold">Jane Smith</h3>
                                <p class="text-sm text-on-surface-variant">Product Designer</p>
                            </div>
                        </div>
                        <p class="text-on-surface-variant">
                            Creating beautiful and functional user interfaces with attention to
                            detail and user experience.
                        </p>
                        <div class="flex gap-2">
                            <Button variant="solid" color="primary" label="Follow" size="sm" />
                            <Button variant="ghost" color="secondary" label="Message" size="sm" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        <!-- Loading List -->
        <div class="space-y-3">
            <p class="text-sm font-medium">User List</p>
            <Card>
                <div class="space-y-4">
                    {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
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
        </div>

        <!-- Loading Article -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Article</p>
            <Card as="article">
                <div class="space-y-4">
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
                    <Skeleton class="h-48 w-full rounded-lg" />
                    <div class="space-y-2">
                        <Skeleton class="h-4 w-full" />
                        <Skeleton class="h-4 w-full" />
                        <Skeleton class="h-4 w-5/6" />
                        <Skeleton class="h-4 w-4/6" />
                    </div>
                </div>
            </Card>
        </div>

        <!-- Dashboard Widgets -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Dashboard Widgets</p>
            <div class="grid gap-4 md:grid-cols-3">
                {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
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
        </div>

        <!-- Media Grid -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Media Grid</p>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                {#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
                    <div class="space-y-2">
                        <Skeleton class="aspect-square w-full rounded-lg" />
                        <Skeleton class="h-3 w-3/4" />
                        <Skeleton class="h-3 w-1/2" />
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>
