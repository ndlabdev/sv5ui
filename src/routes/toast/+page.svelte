<script lang="ts">
    import { toast, Toaster } from '$lib/index.js'
    import { Button, Icon } from '$lib/index.js'
    import type { ToasterProps } from '$lib/Toast/toast.types.js'

    type Variant = NonNullable<ToasterProps['variant']>
    type Position = NonNullable<ToasterProps['position']>

    const variants: Variant[] = ['outline', 'soft', 'subtle', 'solid', 'accent']
    const positions: Position[] = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
    ]

    let activeVariant: Variant = $state('outline')
    let activePosition: Position = $state('bottom-right')
    let expandToasts = $state(false)
    let showCloseButton = $state(true)

    let counter = $state(0)
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Toast</h1>
        <p class="text-on-surface-variant">
            Non-intrusive notification messages that appear temporarily. Powered by svelte-sonner
            with SV5UI semantic color theming.
        </p>
    </div>

    <!-- Toaster Configuration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Toaster Configuration</h2>
        <p class="text-sm text-on-surface-variant">
            Adjust the Toaster props to see how they affect all toasts.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <!-- Variant -->
            <div class="space-y-1.5">
                <p class="text-sm font-medium">Variant</p>
                <div class="flex flex-wrap gap-2">
                    {#each variants as v (v)}
                        <Button
                            variant={activeVariant === v ? 'solid' : 'outline'}
                            size="xs"
                            onclick={() => (activeVariant = v)}
                        >
                            {v}
                        </Button>
                    {/each}
                </div>
            </div>

            <!-- Position -->
            <div class="space-y-1.5">
                <p class="text-sm font-medium">Position</p>
                <div class="flex flex-wrap gap-2">
                    {#each positions as p (p)}
                        <Button
                            variant={activePosition === p ? 'solid' : 'outline'}
                            size="xs"
                            onclick={() => (activePosition = p)}
                        >
                            {p}
                        </Button>
                    {/each}
                </div>
            </div>

            <!-- Toggles -->
            <div class="flex flex-wrap gap-4">
                <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" bind:checked={expandToasts} class="accent-primary" />
                    Expand
                </label>
                <label class="flex items-center gap-2 text-sm">
                    <input type="checkbox" bind:checked={showCloseButton} class="accent-primary" />
                    Close Button
                </label>
            </div>
        </div>
    </section>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button variant="outline" onclick={() => toast('This is a default toast')}>
                Default
            </Button>
            <Button
                variant="outline"
                onclick={() => toast('Title only toast — no description needed')}
            >
                Title Only
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast('Event has been created', {
                        description: 'Monday, January 3rd at 6:00 PM'
                    })}
            >
                With Description
            </Button>
        </div>
    </section>

    <!-- Types -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Types</h2>
        <p class="text-sm text-on-surface-variant">
            Each type automatically maps to a semantic color from the theme.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                color="success"
                variant="soft"
                onclick={() => toast.success('Operation completed successfully')}
            >
                Success
            </Button>
            <Button
                color="error"
                variant="soft"
                onclick={() => toast.error('Something went wrong')}
            >
                Error
            </Button>
            <Button
                color="warning"
                variant="soft"
                onclick={() => toast.warning('Please review before proceeding')}
            >
                Warning
            </Button>
            <Button
                color="info"
                variant="soft"
                onclick={() => toast.info('Here is some useful information')}
            >
                Info
            </Button>
            <Button variant="soft" onclick={() => toast.loading('Loading data...')}>Loading</Button>
        </div>
    </section>

    <!-- Types with Description -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Types with Description</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                color="success"
                variant="soft"
                onclick={() =>
                    toast.success('Payment Successful', {
                        description: 'Your payment of $49.99 has been processed.'
                    })}
            >
                Success
            </Button>
            <Button
                color="error"
                variant="soft"
                onclick={() =>
                    toast.error('Upload Failed', {
                        description: 'The file exceeds the maximum size of 10MB.'
                    })}
            >
                Error
            </Button>
            <Button
                color="warning"
                variant="soft"
                onclick={() =>
                    toast.warning('Storage Almost Full', {
                        description: 'You have used 90% of your storage quota.'
                    })}
            >
                Warning
            </Button>
            <Button
                color="info"
                variant="soft"
                onclick={() =>
                    toast.info('New Update Available', {
                        description: 'Version 2.0 is ready to install.'
                    })}
            >
                Info
            </Button>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >color</code
            >
            option to apply any semantic color, beyond the 4 built-in types.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                color="primary"
                variant="soft"
                onclick={() => toast('Primary notification', { color: 'primary' })}
            >
                Primary
            </Button>
            <Button
                color="secondary"
                variant="soft"
                onclick={() => toast('Secondary notification', { color: 'secondary' })}
            >
                Secondary
            </Button>
            <Button
                color="tertiary"
                variant="soft"
                onclick={() => toast('Tertiary notification', { color: 'tertiary' })}
            >
                Tertiary
            </Button>
            <Button
                color="success"
                variant="soft"
                onclick={() =>
                    toast('Success notification', {
                        color: 'success',
                        description: 'Same as toast.success() but via color option'
                    })}
            >
                Success
            </Button>
            <Button
                color="warning"
                variant="soft"
                onclick={() => toast('Warning notification', { color: 'warning' })}
            >
                Warning
            </Button>
            <Button
                color="error"
                variant="soft"
                onclick={() => toast('Error notification', { color: 'error' })}
            >
                Error
            </Button>
            <Button
                color="info"
                variant="soft"
                onclick={() => toast('Info notification', { color: 'info' })}
            >
                Info
            </Button>
        </div>
    </section>

    <!-- Custom Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Icons</h2>

        <!-- Global icons -->
        <div class="space-y-1.5">
            <p class="text-sm font-medium">Global Icons (via Toaster snippets)</p>
            <p class="text-sm text-on-surface-variant">
                The Toaster below uses Iconify icons instead of sonner's default SVGs. All typed
                toasts inherit them automatically.
            </p>
            <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
                <Button
                    variant="outline"
                    color="success"
                    onclick={() =>
                        toast.success('Deployed to production', {
                            description: 'Uses global successIcon snippet.'
                        })}
                >
                    Success (global)
                </Button>
                <Button
                    variant="outline"
                    color="error"
                    onclick={() =>
                        toast.error('Build failed', {
                            description: 'Uses global errorIcon snippet.'
                        })}
                >
                    Error (global)
                </Button>
                <Button
                    variant="outline"
                    color="warning"
                    onclick={() =>
                        toast.warning('Disk usage at 92%', {
                            description: 'Uses global warningIcon snippet.'
                        })}
                >
                    Warning (global)
                </Button>
                <Button
                    variant="outline"
                    color="info"
                    onclick={() =>
                        toast.info('Maintenance scheduled', {
                            description: 'Uses global infoIcon snippet.'
                        })}
                >
                    Info (global)
                </Button>
            </div>
        </div>

        <!-- Per-toast icon override -->
        <div class="space-y-1.5">
            <p class="text-sm font-medium">Per-toast Icon Override</p>
            <p class="text-sm text-on-surface-variant">
                Pass an Iconify icon name string, or
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">null</code>
                to hide the icon.
            </p>
            <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
                <Button
                    variant="outline"
                    onclick={() =>
                        toast('Rocket launched!', {
                            description: 'icon: "lucide:rocket"',
                            icon: 'lucide:rocket'
                        })}
                >
                    Rocket
                </Button>
                <Button
                    variant="outline"
                    onclick={() =>
                        toast.success('Git push complete', {
                            description: 'icon: "lucide:git-branch"',
                            icon: 'lucide:git-branch'
                        })}
                >
                    Git Branch
                </Button>
                <Button
                    variant="outline"
                    onclick={() =>
                        toast.warning('Battery low', {
                            description: 'icon: "lucide:battery-low"',
                            icon: 'lucide:battery-low'
                        })}
                >
                    Battery
                </Button>
                <Button
                    variant="outline"
                    onclick={() =>
                        toast.error('Server offline', {
                            description: 'icon: "lucide:server-off"',
                            icon: 'lucide:server-off'
                        })}
                >
                    Server
                </Button>
                <Button
                    variant="outline"
                    onclick={() =>
                        toast.success('No icon toast', {
                            description: 'icon: null',
                            icon: null
                        })}
                >
                    icon: null
                </Button>
            </div>
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >avatar</code
            >
            option to show an avatar in the icon slot.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() =>
                    toast('John commented on your post', {
                        description: '"Great article! Thanks for sharing."',
                        avatar: {
                            src: 'https://i.pravatar.cc/150?img=1',
                            alt: 'John'
                        }
                    })}
            >
                With Photo
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.info('Jane sent you a message', {
                        description: '"Hey, are you free for a call?"',
                        avatar: {
                            src: 'https://i.pravatar.cc/150?img=5',
                            alt: 'Jane'
                        }
                    })}
            >
                Info + Avatar
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast('Alex invited you to a project', {
                        description: 'Project: SV5UI Design System',
                        avatar: { alt: 'Alex' },
                        action: {
                            label: 'Accept',
                            onClick: () => toast.success('Invitation accepted')
                        }
                    })}
            >
                Initials + Action
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.success('Team joined!', {
                        description: 'You are now a member of the Design team.',
                        avatar: { icon: 'lucide:users' }
                    })}
            >
                Icon Fallback
            </Button>
        </div>
    </section>

    <!-- Action & Cancel -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Action & Cancel</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() =>
                    toast('File deleted', {
                        action: {
                            label: 'Undo',
                            onClick: () => toast.success('File restored')
                        }
                    })}
            >
                Action Button
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast('Accept cookies?', {
                        action: {
                            label: 'Accept',
                            onClick: () => toast.success('Cookies accepted')
                        },
                        cancel: {
                            label: 'Decline',
                            onClick: () => toast('Cookies declined')
                        }
                    })}
            >
                Action + Cancel
            </Button>
            <Button
                variant="outline"
                color="info"
                onclick={() =>
                    toast.info('New version available', {
                        action: {
                            label: 'Update Now',
                            onClick: () => toast.success('Updating...')
                        },
                        cancel: {
                            label: 'Later',
                            onClick: () => {}
                        }
                    })}
            >
                Info with Actions
            </Button>
            <Button
                variant="outline"
                color="error"
                onclick={() =>
                    toast.error('Delete this item?', {
                        description: 'This action cannot be undone.',
                        action: {
                            label: 'Delete',
                            onClick: () => toast.success('Item deleted')
                        },
                        cancel: {
                            label: 'Keep',
                            onClick: () => {}
                        }
                    })}
            >
                Error with Confirm
            </Button>
        </div>
    </section>

    <!-- Promise -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Promise</h2>
        <p class="text-sm text-on-surface-variant">
            Automatically transitions between loading, success, and error states.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                        loading: 'Saving changes...',
                        success: 'Changes saved successfully!',
                        error: 'Failed to save changes'
                    })
                }}
            >
                Save (Resolves)
            </Button>
            <Button
                variant="outline"
                color="error"
                onclick={() => {
                    toast.promise(
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('timeout')), 2000)
                        ),
                        {
                            loading: 'Connecting to server...',
                            success: 'Connected!',
                            error: 'Connection failed'
                        }
                    )
                }}
            >
                Connect (Rejects)
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
                        loading: 'Uploading file (0%)...',
                        success: 'File uploaded!',
                        error: 'Upload failed'
                    })
                }}
            >
                Upload File
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 4000)), {
                        loading: 'Deploying to production...',
                        success: 'Deployed! Live at https://example.com',
                        error: 'Deploy failed — check CI logs'
                    })
                }}
            >
                Deploy
            </Button>
        </div>
    </section>

    <!-- Duration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Duration</h2>
        <p class="text-sm text-on-surface-variant">
            Control how long a toast stays visible before auto-dismiss.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button variant="outline" onclick={() => toast('Gone in a flash', { duration: 1000 })}>
                1 second
            </Button>
            <Button
                variant="outline"
                onclick={() => toast('Standard duration', { duration: 3000 })}
            >
                3 seconds
            </Button>
            <Button
                variant="outline"
                onclick={() => toast('Longer reading time', { duration: 8000 })}
            >
                8 seconds
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast('This toast will stay until dismissed', { duration: Infinity })}
            >
                Persistent (Infinity)
            </Button>
        </div>
    </section>

    <!-- Update Existing Toast -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Update Existing Toast</h2>
        <p class="text-sm text-on-surface-variant">
            Reuse the same ID to update an existing toast in-place.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast.loading('Uploading...', { duration: Infinity })
                    setTimeout(() => toast.success('Upload complete!', { id }), 2000)
                }}
            >
                Loading → Success
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast.loading('Validating...', { duration: Infinity })
                    setTimeout(() => toast.error('Validation failed!', { id }), 2000)
                }}
            >
                Loading → Error
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast('Step 1 of 3...', { duration: Infinity })
                    setTimeout(() => toast('Step 2 of 3...', { id, duration: Infinity }), 1000)
                    setTimeout(() => toast('Step 3 of 3...', { id, duration: Infinity }), 2000)
                    setTimeout(() => toast.success('All steps complete!', { id }), 3000)
                }}
            >
                Multi-step Progress
            </Button>
        </div>
    </section>

    <!-- Deduplicated -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Deduplicated Toasts</h2>
        <p class="text-sm text-on-surface-variant">
            Pass the same <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >id</code
            >
            to prevent duplicate toasts. Clicking multiple times updates the existing toast instead of
            creating new ones.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() =>
                    toast('You have 3 new messages', {
                        id: 'new-messages',
                        description: 'Click again — no duplicate!'
                    })}
            >
                Same ID (click many times)
            </Button>
            <Button
                variant="outline"
                color="warning"
                onclick={() =>
                    toast.warning('Rate limit reached', {
                        id: 'rate-limit',
                        description: 'Try again in 30 seconds.'
                    })}
            >
                Rate Limit (deduplicated)
            </Button>
        </div>
    </section>

    <!-- Dismiss -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Programmatic Dismiss</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast('Processing...', { duration: Infinity })
                    setTimeout(() => {
                        toast.dismiss(id)
                        toast.success('Done!')
                    }, 2000)
                }}
            >
                Auto Dismiss After 2s
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast('Toast 1', { duration: Infinity })
                    toast.success('Toast 2', { duration: Infinity })
                    toast.error('Toast 3', { duration: Infinity })
                }}
            >
                Create 3 Toasts
            </Button>
            <Button variant="outline" color="error" onclick={() => toast.dismiss()}>
                Dismiss All
            </Button>
        </div>
    </section>

    <!-- Stacking -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Stacking</h2>
        <p class="text-sm text-on-surface-variant">
            Toggle "Expand" in the config above, then fire multiple toasts to see stacked vs
            expanded behavior.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    counter++
                    toast.success(`Notification #${counter}`, {
                        description: 'Hover or expand to see all stacked toasts.'
                    })
                }}
            >
                Add Toast (#{counter + 1})
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast.info('Info toast', { description: 'First in stack' })
                    setTimeout(
                        () => toast.warning('Warning toast', { description: 'Second in stack' }),
                        300
                    )
                    setTimeout(
                        () => toast.error('Error toast', { description: 'Third in stack' }),
                        600
                    )
                }}
            >
                Fire 3 Different Types
            </Button>
        </div>
    </section>

    <!-- Non-dismissible -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Non-dismissible</h2>
        <p class="text-sm text-on-surface-variant">
            A toast that cannot be swiped away or closed by the user.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast.warning('Processing payment...', {
                        description: 'Please do not close this page.',
                        dismissible: false,
                        duration: Infinity
                    })
                    setTimeout(() => {
                        toast.success('Payment complete!', { id })
                    }, 3000)
                }}
            >
                Non-dismissible (3s)
            </Button>
        </div>
    </section>

    <!-- All Types at Once (visual test) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">All Types at Once</h2>
        <p class="text-sm text-on-surface-variant">
            Fire every type simultaneously to visually compare styling.
        </p>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() => {
                    toast('Default toast', {
                        description: 'Neutral surface styling',
                        duration: 10000
                    })
                    toast.success('Success toast', {
                        description: 'Operation successful',
                        duration: 10000
                    })
                    toast.error('Error toast', {
                        description: 'Something went wrong',
                        duration: 10000
                    })
                    toast.warning('Warning toast', {
                        description: 'Proceed with caution',
                        duration: 10000
                    })
                    toast.info('Info toast', {
                        description: 'Here is some context',
                        duration: 10000
                    })
                    toast.loading('Loading toast', {
                        description: 'Please wait...',
                        duration: 10000
                    })
                }}
            >
                Fire All Types (10s)
            </Button>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="flex flex-wrap gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                onclick={() =>
                    toast.success('Profile Updated', {
                        description: 'Your profile changes have been saved.'
                    })}
            >
                Save Profile
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.error('Permission Denied', {
                        description: 'You do not have access to this resource.',
                        action: {
                            label: 'Request Access',
                            onClick: () => toast.info('Access request sent to admin')
                        }
                    })}
            >
                Access Denied
            </Button>
            <Button
                variant="outline"
                onclick={() =>
                    toast.warning('Session Expiring', {
                        description: 'Your session will expire in 5 minutes.',
                        duration: 8000,
                        action: {
                            label: 'Extend',
                            onClick: () => toast.success('Session extended by 30 minutes')
                        }
                    })}
            >
                Session Warning
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
                        loading: 'Sending email...',
                        success: 'Email sent to john@example.com',
                        error: 'Failed to send email'
                    })
                }}
            >
                Send Email
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    const id = toast('Item moved to trash', {
                        action: {
                            label: 'Undo',
                            onClick: () => toast.success('Item restored')
                        },
                        cancel: {
                            label: 'Delete permanently',
                            onClick: () => {
                                toast.dismiss(id)
                                toast.error('Item permanently deleted')
                            }
                        }
                    })
                }}
            >
                Move to Trash
            </Button>
            <Button
                variant="outline"
                onclick={() => {
                    toast.info('New comment on your post', {
                        description: '"Great article! Thanks for sharing." — Jane',
                        action: {
                            label: 'View',
                            onClick: () => toast('Opening post...')
                        }
                    })
                }}
            >
                New Comment
            </Button>
        </div>
    </section>
</div>

<!-- Dynamic Toaster with configurable props -->
<Toaster
    variant={activeVariant}
    position={activePosition}
    expand={expandToasts}
    closeButton={showCloseButton}
>
    {#snippet successIcon()}<Icon name="lucide:circle-check" size="18" />{/snippet}
    {#snippet errorIcon()}<Icon name="lucide:circle-x" size="18" />{/snippet}
    {#snippet warningIcon()}<Icon name="lucide:triangle-alert" size="18" />{/snippet}
    {#snippet infoIcon()}<Icon name="lucide:info" size="18" />{/snippet}
</Toaster>
