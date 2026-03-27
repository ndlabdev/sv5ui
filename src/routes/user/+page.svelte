<script lang="ts">
    import { User, Separator } from '$lib/index.js'

    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">User</h1>
        <p class="text-on-surface-variant">
            Displays user information with avatar, name, and description.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="grid gap-6 lg:grid-cols-3">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With avatar & description</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="John Doe"
                        description="Software Engineer"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=john' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Avatar with initials</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User name="Alex Chen" description="Product Manager" avatar={{ alt: 'AC' }} />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Name only</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User name="Jane Smith" avatar={{ src: 'https://i.pravatar.cc/128?u=jane' }} />
                </div>
            </div>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex items-center gap-4">
                    <span class="w-10 text-sm font-medium text-on-surface-variant">{size}</span>
                    <User
                        name="John Doe"
                        description="Software Engineer"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=size-{size}' }}
                        {size}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Horizontal (default)</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="John Doe"
                        description="Software Engineer"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=h' }}
                        orientation="horizontal"
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Vertical</p>
                <div class="flex justify-center rounded-lg bg-surface-container-high p-4">
                    <User
                        name="John Doe"
                        description="Software Engineer"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=v' }}
                        orientation="vertical"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- With Chip -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Chip</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Online</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Alice"
                        description="Available"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=online' }}
                        chip={{ color: 'success' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Busy</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Bob"
                        description="In a meeting"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=busy' }}
                        chip={{ color: 'error' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Away</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Carol"
                        description="Be right back"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=away' }}
                        chip={{ color: 'warning' }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Default chip</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Dave"
                        description="Offline"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=offline' }}
                        chip={true}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- As Link -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Link</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <User
                name="John Doe"
                description="View profile →"
                avatar={{ src: 'https://i.pravatar.cc/128?u=link' }}
                href="/user"
            />
        </div>
    </section>

    <!-- Clickable -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Clickable</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <User
                name="Click me"
                description="Has onclick handler"
                avatar={{ src: 'https://i.pravatar.cc/128?u=click' }}
                onclick={() => alert('Clicked!')}
            />
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom avatar slot</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User name="Custom Avatar" description="With emoji avatar">
                        {#snippet avatarSlot()}
                            <div
                                class="flex size-10 items-center justify-center rounded-full bg-primary text-lg"
                            >
                                🎨
                            </div>
                        {/snippet}
                    </User>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom name & description</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User avatar={{ src: 'https://i.pravatar.cc/128?u=slot' }}>
                        {#snippet nameSlot()}
                            <p class="text-sm font-bold text-primary">Premium User</p>
                        {/snippet}
                        {#snippet descriptionSlot()}
                            <div class="flex items-center gap-1">
                                <span class="inline-block size-2 rounded-full bg-success"></span>
                                <span class="text-xs text-on-surface-variant">Active now</span>
                            </div>
                        {/snippet}
                    </User>
                </div>
            </div>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-6 lg:grid-cols-3">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom text styles</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Styled Name"
                        description="Styled description"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=ui1' }}
                        ui={{
                            name: 'text-primary font-bold',
                            description: 'text-tertiary italic'
                        }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Bordered root</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Bordered"
                        description="With root override"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=ui2' }}
                        ui={{
                            root: 'border border-outline-variant rounded-xl p-3'
                        }}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom avatar class</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <User
                        name="Ring Avatar"
                        description="Avatar with ring"
                        avatar={{ src: 'https://i.pravatar.cc/128?u=ui3' }}
                        ui={{
                            avatar: 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high'
                        }}
                    />
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <!-- User List -->
        <div class="space-y-3">
            <p class="text-sm font-medium">User List</p>
            <div
                class="max-w-sm space-y-1 rounded-lg border border-outline-variant bg-surface-container p-2"
            >
                {#each [{ name: 'Alice Johnson', desc: 'Admin', u: 'alice' }, { name: 'Bob Williams', desc: 'Editor', u: 'bob' }, { name: 'Carol Davis', desc: 'Viewer', u: 'carol' }] as item (item.u)}
                    <User
                        name={item.name}
                        description={item.desc}
                        avatar={{
                            src: `https://i.pravatar.cc/128?u=${item.u}`,
                            alt: item.name
                        }}
                        onclick={() => alert(item.name)}
                        size="sm"
                    />
                {/each}
            </div>
        </div>

        <!-- Comment Header -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Comment Header</p>
            <div class="max-w-md rounded-lg border border-outline-variant bg-surface-container p-4">
                <User
                    name="Sarah Chen"
                    description="2 hours ago"
                    avatar={{ src: 'https://i.pravatar.cc/128?u=sarah' }}
                    size="sm"
                />
                <p class="mt-2 text-sm text-on-surface-variant">
                    This looks great! I love the new design direction. The component feels much more
                    polished now.
                </p>
            </div>
        </div>

        <!-- Profile Card -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Profile Card</p>
            <div class="max-w-xs rounded-lg border border-outline-variant bg-surface-container p-6">
                <User
                    name="Emily Parker"
                    description="Senior Developer at Acme Corp"
                    avatar={{ src: 'https://i.pravatar.cc/128?u=emily' }}
                    orientation="vertical"
                    size="xl"
                    chip={{ color: 'success' }}
                />
            </div>
        </div>

        <!-- Team Members -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Team Members</p>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {#each [{ name: 'Mike Ross', role: 'Frontend', u: 'mike', color: 'primary' as const }, { name: 'Rachel Zane', role: 'Backend', u: 'rachel', color: 'secondary' as const }, { name: 'Harvey Specter', role: 'Lead', u: 'harvey', color: 'tertiary' as const }] as member (member.u)}
                    <div class="rounded-lg border border-outline-variant bg-surface-container p-4">
                        <User
                            name={member.name}
                            description={member.role}
                            avatar={{ src: `https://i.pravatar.cc/128?u=${member.u}` }}
                            chip={{ color: member.color }}
                            href="/user"
                        />
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>
