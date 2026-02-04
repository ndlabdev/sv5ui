<script lang="ts">
    import { Chip, Avatar, Button } from '$lib/index.js'

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
    const positions = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Chip</h1>
        <p class="text-on-surface-variant">
            Small indicator badge for notifications, status, or counts.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Chip>
                <div class="size-10 rounded-lg bg-surface-container-highest"></div>
            </Chip>
            <Chip color="error">
                <Avatar src="https://i.pravatar.cc/150?img=1" alt="User" />
            </Chip>
            <Chip color="success" text="3">
                <Button icon="lucide:bell" variant="ghost" />
            </Chip>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            {#each colors as color}
                <Chip {color}>
                    <div class="size-10 rounded-lg bg-surface-container-highest"></div>
                </Chip>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size}
                <div class="flex flex-col items-center gap-2">
                    <Chip {size} color="primary">
                        <div class="size-12 rounded-lg bg-surface-container-highest"></div>
                    </Chip>
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Positions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Positions</h2>
        <div class="flex flex-wrap items-center gap-8 rounded-lg bg-surface-container-high p-4">
            {#each positions as position}
                <div class="flex flex-col items-center gap-2">
                    <Chip {position} color="error">
                        <div class="size-12 rounded-lg bg-surface-container-highest"></div>
                    </Chip>
                    <span class="text-xs text-on-surface-variant">{position}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- With Text -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Text</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Chip text="5" size="lg" color="error">
                <Button icon="lucide:bell" variant="ghost" size="lg" />
            </Chip>
            <Chip text="99+" size="xl" color="primary">
                <Button icon="lucide:mail" variant="ghost" size="lg" />
            </Chip>
            <Chip text="NEW" size="2xl" color="success">
                <Button icon="lucide:gift" variant="ghost" size="lg" />
            </Chip>
        </div>
    </section>

    <!-- Inset -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Inset</h2>
        <p class="text-sm text-on-surface-variant">Keep the chip inside the component bounds.</p>
        <div class="flex flex-wrap items-center gap-8 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <Chip color="error">
                    <div class="size-12 rounded-lg bg-surface-container-highest"></div>
                </Chip>
                <span class="text-xs text-on-surface-variant">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Chip color="error" inset>
                    <div class="size-12 rounded-lg bg-surface-container-highest"></div>
                </Chip>
                <span class="text-xs text-on-surface-variant">inset</span>
            </div>
        </div>
    </section>

    <!-- Standalone -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Standalone</h2>
        <p class="text-sm text-on-surface-variant">
            Render chip without positioning, useful for inline indicators.
        </p>
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-high p-4">
            {#each colors as color}
                <Chip {color} standalone size="md" />
            {/each}
        </div>
        <div class="flex items-center gap-2 rounded-lg bg-surface-container-high p-4">
            <span>Status:</span>
            <Chip color="success" standalone size="sm" />
            <span class="text-sm text-on-surface-variant">Online</span>
        </div>
    </section>

    <!-- Show/Hide -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Show / Hide</h2>
        <p class="text-sm text-on-surface-variant">
            Control visibility with the <code class="rounded bg-surface-container-highest px-1"
                >show</code
            > prop.
        </p>
        <div class="flex flex-wrap items-center gap-8 rounded-lg bg-surface-container-high p-4">
            <div class="flex flex-col items-center gap-2">
                <Chip color="error" show={true}>
                    <Button icon="lucide:bell" variant="ghost" />
                </Chip>
                <span class="text-xs text-on-surface-variant">show=true</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <Chip color="error" show={false}>
                    <Button icon="lucide:bell" variant="ghost" />
                </Chip>
                <span class="text-xs text-on-surface-variant">show=false</span>
            </div>
        </div>
    </section>

    <!-- Colors x Positions Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors × Positions</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-3 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Color</th
                        >
                        {#each positions as position}
                            <th
                                class="px-3 py-3 text-center text-sm font-medium text-on-surface-variant"
                                >{position}</th
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
                            {#each positions as position}
                                <td class="px-3 py-3">
                                    <div class="flex justify-center">
                                        <Chip {color} {position}>
                                            <div
                                                class="size-10 rounded-lg bg-surface-container-highest"
                                            ></div>
                                        </Chip>
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
            <!-- Notification Bell -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">Notification Bell</p>
                <div class="flex items-center gap-4">
                    <Chip text="3" size="lg" color="error">
                        <Button icon="lucide:bell" variant="ghost" size="lg" />
                    </Chip>
                    <Chip text="12" size="lg" color="primary">
                        <Button icon="lucide:mail" variant="ghost" size="lg" />
                    </Chip>
                    <Chip text="99+" size="xl" color="warning">
                        <Button icon="lucide:message-circle" variant="ghost" size="lg" />
                    </Chip>
                </div>
            </div>

            <!-- User Avatar Status -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">User Status</p>
                <div class="flex items-center gap-4">
                    <Chip color="success" position="bottom-right" inset size="sm">
                        <Avatar src="https://i.pravatar.cc/150?img=1" alt="Online user" size="lg" />
                    </Chip>
                    <Chip color="warning" position="bottom-right" inset size="sm">
                        <Avatar src="https://i.pravatar.cc/150?img=2" alt="Away user" size="lg" />
                    </Chip>
                    <Chip color="surface" position="bottom-right" inset size="sm">
                        <Avatar
                            src="https://i.pravatar.cc/150?img=3"
                            alt="Offline user"
                            size="lg"
                        />
                    </Chip>
                </div>
            </div>

            <!-- Navigation with badges -->
            <div>
                <p class="mb-3 text-sm font-medium text-on-surface-variant">Navigation</p>
                <nav class="flex items-center gap-2">
                    <Button variant="ghost">Home</Button>
                    <Chip text="5" size="lg" color="error" inset>
                        <Button variant="ghost">Messages</Button>
                    </Chip>
                    <Chip text="2" size="lg" color="primary" inset>
                        <Button variant="ghost">Notifications</Button>
                    </Chip>
                    <Button variant="ghost">Settings</Button>
                </nav>
            </div>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <Chip color="error" ui={{ base: 'animate-pulse' }}>
                <Button icon="lucide:bell" variant="ghost" />
            </Chip>
            <Chip color="primary" size="2xs" inset ui={{ base: 'ring-2 ring-primary' }}>
                <Avatar src="https://i.pravatar.cc/150?img=4" alt="User" size="2xl" />
            </Chip>
        </div>
    </section>
</div>
