<script lang="ts">
    import { Empty, Separator } from '$lib/index.js'

    const variants = ['solid', 'outline', 'soft', 'subtle', 'naked'] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Empty</h1>
        <p class="text-on-surface-variant">
            Display empty state UI when there's no content to show, with support for icons, avatars,
            and action buttons.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="grid gap-4 lg:grid-cols-3">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">
                    Icon + title + description
                </p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty
                        icon="lucide:inbox"
                        title="No messages"
                        description="You don't have any messages yet."
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Title only</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty icon="lucide:file-x" title="No files found" />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">With avatar</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty
                        avatar={{ src: 'https://i.pravatar.cc/150?u=empty', alt: 'User' }}
                        title="No notifications"
                        description="You're all caught up!"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Variants with Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants with Icon</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each variants as variant (variant)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant capitalize">{variant}</p>
                    <div class="rounded-lg bg-surface-container-high p-4">
                        <Empty
                            {variant}
                            icon="lucide:inbox"
                            title="No items"
                            description="Nothing to display here."
                            size="sm"
                        />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Variants with Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants with Avatar</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {#each variants as variant (variant)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant capitalize">{variant}</p>
                    <div class="rounded-lg bg-surface-container-high p-4">
                        <Empty
                            {variant}
                            avatar={{
                                src: 'https://i.pravatar.cc/150?u=variant-{variant}',
                                alt: 'User'
                            }}
                            title="No notifications"
                            description="You're all caught up!"
                            size="sm"
                        />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-3">
            {#each sizes as size (size)}
                <div class="flex items-start gap-4">
                    <span class="w-8 pt-4 text-sm font-medium text-on-surface-variant">{size}</span>
                    <div class="flex-1">
                        <Empty
                            {size}
                            icon="lucide:inbox"
                            title="Empty state"
                            description="This is the {size} size."
                        />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- With Actions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Actions</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Single action</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty
                        icon="lucide:inbox"
                        title="No messages"
                        description="Start a conversation with your team."
                        actions={[{ label: 'New Message', leadingIcon: 'lucide:plus' }]}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Multiple actions</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty
                        icon="lucide:shopping-cart"
                        title="Cart is empty"
                        description="Add some items to get started."
                        actions={[
                            { label: 'Browse Products' },
                            { label: 'View Wishlist', variant: 'ghost' }
                        ]}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom leading</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty
                        variant="outline"
                        title="Welcome!"
                        description="Get started by exploring our components."
                    >
                        {#snippet leading()}
                            <div
                                class="flex size-16 items-center justify-center rounded-full bg-tertiary/10 text-tertiary"
                            >
                                <span class="text-3xl">🎉</span>
                            </div>
                        {/snippet}
                    </Empty>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Custom header</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Empty variant="soft">
                        {#snippet header()}
                            <div class="flex flex-col items-center gap-3 text-center">
                                <div
                                    class="flex size-14 items-center justify-center rounded-full bg-primary/10"
                                >
                                    <span class="text-2xl text-primary">✨</span>
                                </div>
                                <div>
                                    <p class="text-lg font-bold text-primary">Custom Header</p>
                                    <p class="text-sm text-on-surface-variant">
                                        Entirely custom header content
                                    </p>
                                </div>
                            </div>
                        {/snippet}
                    </Empty>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer Slot -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Footer</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Empty
                variant="subtle"
                icon="lucide:help-circle"
                title="Need help?"
                description="Check our documentation or contact support."
            >
                {#snippet footer()}
                    <p class="text-xs text-on-surface-variant">
                        Last updated: March 2026 · <a href="/empty" class="underline"
                            >Documentation</a
                        >
                    </p>
                {/snippet}
            </Empty>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <Empty
                    icon="lucide:star"
                    title="Custom Styles"
                    description="With ui slot overrides."
                    actions={[{ label: 'Action' }]}
                    ui={{
                        title: 'text-warning font-bold',
                        description: 'italic',
                        actions: 'mt-2'
                    }}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <Empty
                    icon="lucide:heart"
                    title="Custom Root"
                    description="Dashed border styling."
                    ui={{
                        root: 'border-2 border-dashed border-outline-variant'
                    }}
                />
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <!-- Empty Inbox -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Empty Inbox</p>
            <Empty
                variant="soft"
                icon="lucide:mail"
                title="Inbox Zero!"
                description="You've read all your messages. Great job staying on top of things!"
            />
        </div>

        <!-- No Search Results -->
        <div class="space-y-3">
            <p class="text-sm font-medium">No Search Results</p>
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
        </div>

        <!-- Network Error -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Network Error</p>
            <Empty
                variant="subtle"
                icon="lucide:wifi-off"
                title="Connection lost"
                description="Unable to load data. Please check your internet connection and try again."
                actions={[{ label: 'Retry', leadingIcon: 'lucide:refresh-cw' }]}
            />
        </div>

        <!-- Completed Tasks -->
        <div class="space-y-3">
            <p class="text-sm font-medium">All Tasks Done</p>
            <Empty
                variant="soft"
                icon="lucide:check-circle-2"
                title="All tasks completed!"
                description="You've finished everything on your list. Time to relax or add new tasks."
                actions={[
                    { label: 'Add Task', leadingIcon: 'lucide:plus' },
                    { label: 'View Archive', variant: 'ghost' }
                ]}
            />
        </div>

        <!-- Empty Cart -->
        <div class="space-y-3">
            <p class="text-sm font-medium">Empty Shopping Cart</p>
            <Empty
                variant="naked"
                icon="lucide:shopping-cart"
                title="Your cart is empty"
                description="Looks like you haven't added anything yet."
                actions={[{ label: 'Start Shopping', leadingIcon: 'lucide:shopping-bag' }]}
            />
        </div>

        <!-- No Files -->
        <div class="space-y-3">
            <p class="text-sm font-medium">No Files Uploaded</p>
            <Empty
                variant="soft"
                icon="lucide:file-x"
                title="No files uploaded"
                description="Upload your first file to get started with your project."
                actions={[
                    { label: 'Upload File', leadingIcon: 'lucide:upload' },
                    { label: 'Import from URL', variant: 'ghost' }
                ]}
            />
        </div>
    </section>
</div>
