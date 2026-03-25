<script lang="ts">
    import { Avatar, AvatarGroup } from '$lib/index.js'

    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Avatar</h1>
        <p class="text-on-surface-variant">
            Display user profile images with fallback to initials, icons, or custom content.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Usage</h2>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar src="https://i.pravatar.cc/150?img=1" alt="John Doe" />
            <Avatar src="https://i.pravatar.cc/150?img=2" alt="Jane Smith" />
            <Avatar src="https://i.pravatar.cc/150?img=3" alt="Bob Wilson" />
            <Avatar alt="No Image" />
            <Avatar text="AB" />
            <Avatar icon="lucide:user" />
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to
            control dimensions. Available sizes:
            <code class="rounded bg-surface-container-highest px-1">3xs</code>
            to <code class="rounded bg-surface-container-highest px-1">3xl</code>.
        </p>
        <div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex flex-col items-center gap-2">
                    <Avatar src="https://i.pravatar.cc/150?img=5" alt="User" {size} />
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Rounded -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Rounded</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">rounded</code> prop to
            control the border radius. Use
            <code class="rounded bg-surface-container-highest px-1">lg</code>,
            <code class="rounded bg-surface-container-highest px-1">md</code>, or
            <code class="rounded bg-surface-container-highest px-1">none</code> for square-ish avatars
            (e.g. organization logos).
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            {#each ['full', 'lg', 'md', 'sm', 'none'] as r (r)}
                <div class="flex flex-col items-center gap-2">
                    <Avatar
                        src="https://i.pravatar.cc/150?img=8"
                        alt="User"
                        size="xl"
                        rounded={r as 'full' | 'lg' | 'md' | 'sm' | 'none'}
                    />
                    <span class="text-xs text-on-surface-variant">{r}</span>
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
            >
            text when no image. Use
            <code class="rounded bg-surface-container-highest px-1">text</code> to override.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar alt="John Doe" size="lg" />
            <Avatar alt="Jane Smith" size="lg" />
            <Avatar alt="Bob" size="lg" />
            <Avatar alt="Alice Brown Carter" size="lg" />
            <Avatar text="XY" size="lg" />
        </div>
    </section>

    <!-- Icon Fallback -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon Fallback</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">icon</code> prop to display
            an Iconify icon as fallback when no image or text is available.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            <Avatar icon="lucide:user" size="lg" />
            <Avatar icon="lucide:users" size="lg" />
            <Avatar icon="lucide:building-2" size="lg" rounded="lg" />
            <Avatar
                icon="lucide:bot"
                size="lg"
                class="bg-primary"
                ui={{ icon: 'text-on-primary' }}
            />
        </div>
    </section>

    <!-- Status Indicator -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Status</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">status</code> prop to
            show a status indicator. Control position with
            <code class="rounded bg-surface-container-highest px-1">statusPosition</code>.
        </p>
        <p class="text-xs font-medium text-on-surface-variant uppercase">Status colors</p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <Avatar
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Online"
                    size="lg"
                    status="bg-success"
                />
                <span class="text-xs text-on-surface-variant">Online</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Avatar
                    src="https://i.pravatar.cc/150?img=13"
                    alt="Busy"
                    size="lg"
                    status="bg-error"
                />
                <span class="text-xs text-on-surface-variant">Busy</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Avatar
                    src="https://i.pravatar.cc/150?img=14"
                    alt="Away"
                    size="lg"
                    status="bg-warning"
                />
                <span class="text-xs text-on-surface-variant">Away</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Avatar
                    src="https://i.pravatar.cc/150?img=15"
                    alt="Offline"
                    size="lg"
                    status="bg-on-surface/30"
                />
                <span class="text-xs text-on-surface-variant">Offline</span>
            </div>
        </div>

        <p class="text-xs font-medium text-on-surface-variant uppercase">Status positions</p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            {#each ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as pos (pos)}
                <div class="flex flex-col items-center gap-2">
                    <Avatar
                        src="https://i.pravatar.cc/150?img=16"
                        alt="User"
                        size="xl"
                        status="bg-success"
                        statusPosition={pos as
                            | 'top-right'
                            | 'top-left'
                            | 'bottom-right'
                            | 'bottom-left'}
                    />
                    <span class="text-xs text-on-surface-variant">{pos}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Avatar Group -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatar Group</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">AvatarGroup</code> to
            display multiple avatars with overlap. Use
            <code class="rounded bg-surface-container-highest px-1">max</code> to limit the visible count.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <AvatarGroup
                avatars={[
                    { src: 'https://i.pravatar.cc/150?img=20', alt: 'User 1' },
                    { src: 'https://i.pravatar.cc/150?img=21', alt: 'User 2' },
                    { src: 'https://i.pravatar.cc/150?img=22', alt: 'User 3' },
                    { src: 'https://i.pravatar.cc/150?img=23', alt: 'User 4' },
                    { src: 'https://i.pravatar.cc/150?img=24', alt: 'User 5' }
                ]}
            />
            <AvatarGroup
                avatars={[
                    { src: 'https://i.pravatar.cc/150?img=30', alt: 'User 1' },
                    { src: 'https://i.pravatar.cc/150?img=31', alt: 'User 2' },
                    { src: 'https://i.pravatar.cc/150?img=32', alt: 'User 3' },
                    { src: 'https://i.pravatar.cc/150?img=33', alt: 'User 4' },
                    { src: 'https://i.pravatar.cc/150?img=34', alt: 'User 5' },
                    { src: 'https://i.pravatar.cc/150?img=35', alt: 'User 6' },
                    { src: 'https://i.pravatar.cc/150?img=36', alt: 'User 7' }
                ]}
                max={4}
                size="lg"
            />
        </div>
    </section>

    <!-- Custom Styling -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Styling</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">class</code> and
            <code class="rounded bg-surface-container-highest px-1">ui</code> to customize individual
            slots.
        </p>
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

    <!-- Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Examples</h2>

        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">User list</p>
            <div class="flex flex-col gap-3">
                {#each [{ name: 'Alice Johnson', status: 'bg-success', img: 1 }, { name: 'Bob Williams', status: 'bg-error', img: 2 }, { name: 'Carol Davis', status: 'bg-warning', img: 3 }] as user (user.name)}
                    <div class="flex items-center gap-3">
                        <Avatar
                            src="https://i.pravatar.cc/150?img={user.img}"
                            alt={user.name}
                            status={user.status}
                        />
                        <div>
                            <p class="text-sm font-medium">{user.name}</p>
                            <p class="text-xs text-on-surface-variant">Member</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Organization logos</p>
            <div class="flex flex-wrap items-center gap-4">
                <Avatar
                    icon="lucide:building-2"
                    size="xl"
                    rounded="lg"
                    class="bg-primary"
                    ui={{ icon: 'text-on-primary' }}
                />
                <Avatar
                    icon="lucide:code-2"
                    size="xl"
                    rounded="md"
                    class="bg-secondary"
                    ui={{ icon: 'text-on-secondary' }}
                />
                <Avatar
                    icon="lucide:globe"
                    size="xl"
                    rounded="lg"
                    class="bg-tertiary"
                    ui={{ icon: 'text-on-tertiary' }}
                />
            </div>
        </div>
    </section>
</div>
