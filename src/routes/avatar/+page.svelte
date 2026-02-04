<script lang="ts">
    import { Avatar } from '$lib/index.js'

    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Avatar</h1>
        <p class="text-on-surface-variant">
            Display user profile images with fallback to initials.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar src="https://i.pravatar.cc/150?img=1" alt="John Doe" />
            <Avatar src="https://i.pravatar.cc/150?img=2" alt="Jane Smith" />
            <Avatar src="https://i.pravatar.cc/150?img=3" alt="Bob Wilson" />
            <Avatar alt="No Image" />
            <Avatar text="AB" />
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size}
                <div class="flex flex-col items-center gap-2">
                    <Avatar src="https://i.pravatar.cc/150?img=5" alt="User" {size} />
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Fallback Initials -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Fallback Initials</h2>
        <p class="text-sm text-on-surface-variant">
            Auto-generates initials from <code class="rounded bg-surface-container-highest px-1"
                >alt</code
            > text when no image.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar alt="John Doe" size="lg" />
            <Avatar alt="Jane Smith" size="lg" />
            <Avatar alt="Bob" size="lg" />
            <Avatar alt="Alice Brown Carter" size="lg" />
            <Avatar text="XY" size="lg" />
        </div>
    </section>

    <!-- Custom Styling -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Styling</h2>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar
                src="https://i.pravatar.cc/150?img=10"
                alt="User"
                size="xl"
                class="ring-2 ring-primary ring-offset-2 ring-offset-surface"
            />
            <Avatar
                src="https://i.pravatar.cc/150?img=11"
                alt="User"
                size="xl"
                class="ring-2 ring-success"
            />
            <Avatar alt="VIP" size="xl" class="bg-primary" ui={{ fallback: 'text-on-primary' }} />
            <Avatar
                alt="Pro"
                size="xl"
                class="bg-linear-to-br from-primary to-tertiary"
                ui={{ fallback: 'text-white font-bold' }}
            />
        </div>
    </section>
</div>
