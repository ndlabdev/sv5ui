<script lang="ts">
    import { CheckboxGroup } from '$lib/index.js'
    import type { CheckboxGroupItem } from '$lib/index.js'

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

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    const basicItems: CheckboxGroupItem[] = [
        { value: 'svelte', label: 'Svelte' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' }
    ]

    const itemsWithDesc: CheckboxGroupItem[] = [
        {
            value: 'email',
            label: 'Email',
            description: 'Receive notifications via email'
        },
        {
            value: 'sms',
            label: 'SMS',
            description: 'Receive notifications via text message'
        },
        {
            value: 'push',
            label: 'Push',
            description: 'Receive browser push notifications'
        }
    ]

    const itemsWithDisabled: CheckboxGroupItem[] = [
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
        { value: 'delete', label: 'Delete', disabled: true },
        { value: 'admin', label: 'Admin', disabled: true }
    ]

    let basicValue = $state(['svelte'])
    let notifValue = $state(['email'])
    let cardValue = $state(['email'])
    let horizontalValue = $state<string[]>([])
    let permissionValue = $state(['read'])
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">CheckboxGroup</h1>
        <p class="text-on-surface-variant">
            Group of checkboxes for selecting multiple values from a list.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <CheckboxGroup items={basicItems} bind:value={basicValue} legend="Frameworks" />
            <p class="mt-3 text-sm text-on-surface-variant">
                Selected: {basicValue.join(', ') || 'none'}
            </p>
        </div>
    </section>

    <!-- With Description -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Description</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <CheckboxGroup
                items={itemsWithDesc}
                bind:value={notifValue}
                legend="Notifications"
                required
            />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">List (default)</p>
                <CheckboxGroup items={basicItems} value={['svelte']} legend="Pick frameworks" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Card</p>
                <CheckboxGroup
                    items={itemsWithDesc}
                    bind:value={cardValue}
                    variant="card"
                    legend="Notifications"
                />
            </div>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <div>
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Vertical (default)</p>
                <CheckboxGroup items={basicItems} value={['svelte', 'vue']} />
            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Horizontal</p>
                <CheckboxGroup
                    items={basicItems}
                    bind:value={horizontalValue}
                    orientation="horizontal"
                />
            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Horizontal · Card</p>
                <CheckboxGroup
                    items={basicItems}
                    value={['react']}
                    variant="card"
                    orientation="horizontal"
                />
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <CheckboxGroup items={[{ value: color, label: color }]} value={[color]} {color} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex items-center gap-4">
                    <span class="w-6 text-xs text-on-surface-variant">{size}</span>
                    <CheckboxGroup
                        items={basicItems}
                        value={['svelte']}
                        {size}
                        orientation="horizontal"
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Indicator Position -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Indicator Position</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-3">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Start (default)</p>
                <CheckboxGroup items={itemsWithDesc} value={['email']} indicator="start" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">End</p>
                <CheckboxGroup items={itemsWithDesc} value={['email']} indicator="end" />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Hidden</p>
                <CheckboxGroup items={itemsWithDesc} value={['email']} indicator="hidden" />
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="grid grid-cols-1 gap-4 rounded-lg bg-surface-container-high p-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Entire group disabled</p>
                <CheckboxGroup items={basicItems} value={['svelte']} disabled />
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Per-item disabled</p>
                <CheckboxGroup
                    items={itemsWithDisabled}
                    bind:value={permissionValue}
                    legend="Permissions"
                />
            </div>
        </div>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <CheckboxGroup items={itemsWithDesc} value={['email', 'push']}>
                {#snippet legendSlot()}
                    <span class="mb-1 block text-sm font-semibold text-primary">
                        Notification channels
                    </span>
                {/snippet}
                {#snippet labelSlot({ item })}
                    <span class="ms-2 text-sm font-semibold text-on-surface">{item.label}</span>
                {/snippet}
                {#snippet descriptionSlot({ item })}
                    <span class="ms-2 text-xs text-on-surface-variant italic"
                        >{item.description}</span
                    >
                {/snippet}
            </CheckboxGroup>
        </div>
    </section>

    <!-- Real World Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Examples</h2>
        <div class="space-y-6 rounded-lg bg-surface-container-high p-4">
            <!-- Settings form -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Settings Form</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container p-4"
                >
                    <CheckboxGroup
                        items={[
                            {
                                value: 'marketing',
                                label: 'Marketing emails',
                                description: 'Promotions and offers'
                            },
                            {
                                value: 'updates',
                                label: 'Product updates',
                                description: 'New features and improvements'
                            },
                            {
                                value: 'security',
                                label: 'Security alerts',
                                description: 'Login and activity alerts'
                            }
                        ]}
                        value={['security']}
                        legend="Email preferences"
                        variant="card"
                        color="primary"
                    />
                </div>
            </div>

            <!-- Filter tags -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Filter Tags</p>
                <CheckboxGroup
                    items={[
                        { value: 'design', label: 'Design' },
                        { value: 'engineering', label: 'Engineering' },
                        { value: 'product', label: 'Product' },
                        { value: 'marketing', label: 'Marketing' }
                    ]}
                    value={['design', 'engineering']}
                    orientation="horizontal"
                    color="tertiary"
                    size="sm"
                />
            </div>

            <!-- Permission checklist -->
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Permission Checklist</p>
                <CheckboxGroup
                    items={[
                        { value: 'read', label: 'Read', description: 'View resources' },
                        {
                            value: 'write',
                            label: 'Write',
                            description: 'Create and edit resources'
                        },
                        { value: 'delete', label: 'Delete', description: 'Remove resources' },
                        {
                            value: 'admin',
                            label: 'Admin',
                            description: 'Full access',
                            disabled: true
                        }
                    ]}
                    value={['read', 'write']}
                    legend="API permissions"
                    variant="card"
                    color="error"
                    indicator="end"
                />
            </div>
        </div>
    </section>
</div>
