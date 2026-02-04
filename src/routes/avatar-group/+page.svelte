<script lang="ts">
    import { Avatar, AvatarGroup } from '$lib/index.js'

    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Avatar Group</h1>
        <p class="text-on-surface-variant">
            Display a stack of overlapping avatars with optional overflow indicator.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <AvatarGroup
                avatars={[
                    { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
                    { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
                    { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
                    { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' }
                ]}
            />
        </div>
    </section>

    <!-- Max Limit -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Max Limit</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">max</code> to limit visible avatars.
            Excess shown as "+N".
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <AvatarGroup
                max={3}
                avatars={[
                    { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
                    { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
                    { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
                    { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
                    { src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' },
                    { src: 'https://i.pravatar.cc/150?img=6', alt: 'User 6' }
                ]}
            />
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-end gap-6 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size}
                <div class="flex flex-col items-center gap-2">
                    <AvatarGroup
                        {size}
                        avatars={[
                            { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
                            { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
                            { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' }
                        ]}
                    />
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- With Children -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Children</h2>
        <p class="text-sm text-on-surface-variant">
            Use slot content for full control over child avatars.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <AvatarGroup size="lg">
                <Avatar src="https://i.pravatar.cc/150?img=10" alt="User A" />
                <Avatar src="https://i.pravatar.cc/150?img=11" alt="User B" />
                <Avatar alt="New" />
            </AvatarGroup>
        </div>
    </section>
</div>
