<script lang="ts">
    import { Empty } from '$lib/index.js'

    const variants = ['solid', 'outline', 'soft', 'subtle'] as const
    const colors = ['primary', 'secondary', 'success', 'error'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Empty</h1>
        <p class="text-on-surface-variant">
            Display empty state UI when there's no content to show, with support for icons, avatars,
            and action buttons.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Empty
                icon="lucide:inbox"
                title="No messages"
                description="You don't have any messages yet."
            />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="grid gap-3 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <Empty
                variant="solid"
                icon="lucide:inbox"
                title="Solid"
                description="Filled background style"
            />
            <Empty
                variant="outline"
                icon="lucide:inbox"
                title="Outline"
                description="Border with transparent background"
            />
            <Empty
                variant="soft"
                icon="lucide:inbox"
                title="Soft"
                description="Light colored background"
            />
            <Empty
                variant="subtle"
                icon="lucide:inbox"
                title="Subtle"
                description="Light background with border"
            />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div
            class="grid gap-3 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2 lg:grid-cols-4"
        >
            <Empty color="primary" icon="lucide:inbox" title="Primary" />
            <Empty color="secondary" icon="lucide:inbox" title="Secondary" />
            <Empty color="tertiary" icon="lucide:inbox" title="Tertiary" />
            <Empty color="success" icon="lucide:check-circle" title="Success" />
            <Empty color="warning" icon="lucide:alert-triangle" title="Warning" />
            <Empty color="error" icon="lucide:x-circle" title="Error" />
            <Empty color="info" icon="lucide:info" title="Info" />
            <Empty color="surface" icon="lucide:inbox" title="Surface" />
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <Empty size="xs" icon="lucide:inbox" title="Extra Small" description="Compact size" />
            <Empty size="sm" icon="lucide:inbox" title="Small" description="Small size" />
            <Empty size="md" icon="lucide:inbox" title="Medium" description="Default medium size" />
            <Empty size="lg" icon="lucide:inbox" title="Large" description="Large size" />
            <Empty
                size="xl"
                icon="lucide:inbox"
                title="Extra Large"
                description="Extra large size"
            />
        </div>
    </section>

    <!-- With Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Avatar</h2>
        <div class="grid gap-3 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <Empty
                avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'User' }}
                title="No notifications"
                description="You're all caught up!"
            />
            <Empty
                color="success"
                avatar={{ alt: 'Success' }}
                title="All done"
                description="No pending tasks"
            />
        </div>
    </section>

    <!-- With Actions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Actions</h2>
        <div class="grid gap-3 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <Empty
                icon="lucide:inbox"
                title="No messages"
                description="Start a conversation with your team."
                actions={[{ label: 'New Message', leadingIcon: 'lucide:plus' }]}
            />
            <Empty
                color="warning"
                icon="lucide:shopping-cart"
                title="Cart is empty"
                description="Add some items to get started."
                actions={[
                    { label: 'Browse Products', color: 'warning' },
                    { label: 'View Wishlist', variant: 'ghost' }
                ]}
            />
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <!-- Empty Inbox -->
            <Empty
                variant="soft"
                color="primary"
                icon="lucide:mail"
                title="Inbox Zero!"
                description="You've read all your messages. Great job staying on top of things!"
            />

            <!-- No Search Results -->
            <Empty
                variant="outline"
                icon="lucide:search-x"
                title="No results found"
                description="We couldn't find anything matching your search. Try different keywords."
                actions={[
                    { label: 'Clear Search', leadingIcon: 'lucide:x' },
                    { label: 'Browse All', variant: 'outline' }
                ]}
            />

            <!-- Empty Shopping Cart -->
            <Empty
                variant="subtle"
                color="warning"
                icon="lucide:shopping-cart"
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Start shopping to fill it up!"
                actions={[
                    {
                        label: 'Start Shopping',
                        color: 'warning',
                        leadingIcon: 'lucide:shopping-bag'
                    }
                ]}
            />

            <!-- No Files -->
            <Empty
                variant="soft"
                color="info"
                icon="lucide:file-x"
                title="No files uploaded"
                description="Upload your first file to get started with your project."
                actions={[
                    { label: 'Upload File', color: 'info', leadingIcon: 'lucide:upload' },
                    { label: 'Import from URL', variant: 'ghost' }
                ]}
            />

            <!-- Network Error -->
            <Empty
                variant="outline"
                color="error"
                icon="lucide:wifi-off"
                title="Connection lost"
                description="Unable to load data. Please check your internet connection and try again."
                actions={[{ label: 'Retry', color: 'error', leadingIcon: 'lucide:refresh-cw' }]}
            />

            <!-- Completed Tasks -->
            <Empty
                variant="soft"
                color="success"
                icon="lucide:check-circle-2"
                title="All tasks completed!"
                description="You've finished everything on your list. Time to relax or add new tasks."
                actions={[
                    { label: 'Add Task', color: 'success', leadingIcon: 'lucide:plus' },
                    { label: 'View Archive', variant: 'ghost' }
                ]}
            />
        </div>
    </section>

    <!-- Variants x Colors Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants x Colors</h2>
        <div class="overflow-x-auto rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-3 lg:grid-cols-2">
                {#each variants as variant (variant)}
                    {#each colors as color (color)}
                        <Empty
                            {variant}
                            {color}
                            icon="lucide:inbox"
                            title={`${variant} - ${color}`}
                            description="Example empty state"
                            size="sm"
                        />
                    {/each}
                {/each}
            </div>
        </div>
    </section>

    <!-- Custom Content with Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Content with Slots</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Empty variant="outline" color="tertiary">
                {#snippet leading()}
                    <div
                        class="flex size-16 items-center justify-center rounded-full bg-tertiary/10 text-tertiary"
                    >
                        <span class="text-3xl">🎉</span>
                    </div>
                {/snippet}
                {#snippet titleSlot()}
                    <h3 class="text-lg font-bold text-tertiary">Welcome to SV5UI!</h3>
                {/snippet}
                {#snippet descriptionSlot()}
                    <p class="text-sm text-on-surface-variant">
                        Get started by exploring our components and building amazing UIs.
                    </p>
                {/snippet}
                {#snippet actionsSlot()}
                    <div class="flex flex-wrap gap-2">
                        <button
                            class="rounded-md bg-tertiary px-4 py-2 text-sm font-medium text-on-tertiary hover:bg-tertiary/90"
                        >
                            Get Started
                        </button>
                        <button
                            class="rounded-md px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest"
                        >
                            Learn More
                        </button>
                    </div>
                {/snippet}
            </Empty>
        </div>
    </section>
</div>
