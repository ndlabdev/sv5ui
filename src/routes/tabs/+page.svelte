<script lang="ts">
    import { Tabs, Badge, Button, Icon, Separator } from '$lib/index.js'
    import type { TabsItem } from '$lib/index.js'

    // --- Basic items ---
    const basicItems: TabsItem[] = [
        {
            label: 'Account',
            content: 'Manage your account settings, profile information, and preferences.',
            value: 'account'
        },
        {
            label: 'Password',
            content:
                'Change your password, enable two-factor authentication, and manage security keys.',
            value: 'password'
        },
        {
            label: 'Notifications',
            content: 'Configure email, push, and SMS notification preferences.',
            value: 'notifications'
        }
    ]

    // --- Items with icons ---
    const iconItems: TabsItem[] = [
        {
            label: 'Profile',
            icon: 'lucide:user',
            content: 'Update your profile picture, display name, and bio.',
            value: 'profile'
        },
        {
            label: 'Security',
            icon: 'lucide:shield',
            content: 'Manage two-factor authentication, sessions, and security logs.',
            value: 'security'
        },
        {
            label: 'Billing',
            icon: 'lucide:credit-card',
            content: 'View invoices, update payment methods, and manage your subscription.',
            value: 'billing'
        },
        {
            label: 'Integrations',
            icon: 'lucide:plug',
            content: 'Connect third-party services and manage API keys.',
            value: 'integrations'
        }
    ]

    // --- Disabled items ---
    const disabledItems: TabsItem[] = [
        { label: 'General', content: 'General settings available to all users.', value: 'general' },
        {
            label: 'Advanced',
            content: 'Advanced settings require a premium subscription.',
            value: 'advanced',
            disabled: true
        },
        { label: 'About', content: 'Application version and license information.', value: 'about' }
    ]

    // --- Many items ---
    const manyItems: TabsItem[] = [
        { label: 'Overview', content: 'Project overview and summary.', value: 'overview' },
        { label: 'Tasks', content: 'Manage project tasks and assignments.', value: 'tasks' },
        { label: 'Files', content: 'Browse and manage project files.', value: 'files' },
        { label: 'Members', content: 'View and manage team members.', value: 'members' },
        { label: 'Settings', content: 'Configure project settings.', value: 'settings' },
        { label: 'Activity', content: 'View project activity log.', value: 'activity' }
    ]

    // --- Colors ---
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

    // --- Controlled value ---
    let controlledValue = $state<string>('account')

    // --- Callback demo ---
    let lastChange = $state<string>('')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Tabs</h1>
        <p class="text-on-surface-variant">
            A set of layered panels of content, where only one panel is visible at a time. Built on
            top of bits-ui Tabs.
        </p>
    </div>

    <!-- ==================== BASIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an array of items with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">value</code>,
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>
            properties.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs items={basicItems} />
        </div>
    </section>

    <!-- ==================== VARIANTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant="pill"</code
            >
            for a rounded background indicator, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant="link"</code
            > for a thin line indicator.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Pill (default)</p>
                <Tabs items={basicItems} variant="pill" />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Link</p>
                <Tabs items={basicItems} variant="link" />
            </div>
        </div>
    </section>

    <!-- ==================== COLORS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > prop controls the indicator and active text color.
        </p>

        <div class="space-y-4">
            <div>
                <p class="mb-3 text-sm font-medium">Pill variant</p>
                <div class="grid gap-4 md:grid-cols-2">
                    {#each colors as color (color)}
                        <div class="rounded-lg bg-surface-container-high p-4">
                            <p class="mb-2 text-xs font-medium capitalize">{color}</p>
                            <Tabs items={basicItems} {color} variant="pill" content={false} />
                        </div>
                    {/each}
                </div>
            </div>

            <div>
                <p class="mb-3 text-sm font-medium">Link variant</p>
                <div class="grid gap-4 md:grid-cols-2">
                    {#each colors as color (color)}
                        <div class="rounded-lg bg-surface-container-high p-4">
                            <p class="mb-2 text-xs font-medium capitalize">{color}</p>
                            <Tabs items={basicItems} {color} variant="link" content={false} />
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== SIZES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >size</code
            > prop to control padding, text size, and icon dimensions.
        </p>
        <div class="space-y-4">
            {#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
                <div class="rounded-lg bg-surface-container-high p-4">
                    <p class="mb-2 text-xs font-medium uppercase">{size}</p>
                    <Tabs items={basicItems} {size} content={false} />
                </div>
            {/each}
        </div>
    </section>

    <!-- ==================== WITH ICONS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Add leading icons via the <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code
            > property on each item.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Pill variant</p>
                <Tabs items={iconItems} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Link variant</p>
                <Tabs items={iconItems} variant="link" />
            </div>
        </div>
    </section>

    <!-- ==================== ORIENTATION ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >orientation</code
            > to change the layout direction. Use ←→ for horizontal, ↑↓ for vertical keyboard navigation.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Vertical - Pill</p>
                <Tabs items={iconItems} orientation="vertical" />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Vertical - Link</p>
                <Tabs items={iconItems} orientation="vertical" variant="link" />
            </div>
        </div>
    </section>

    <!-- ==================== DISABLED ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled State</h2>
        <p class="text-sm text-on-surface-variant">
            Disable the entire tabs component or individual items.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Entire tabs disabled</p>
                <Tabs items={basicItems} disabled />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Individual tab disabled</p>
                <Tabs items={disabledItems} />
            </div>
        </div>
    </section>

    <!-- ==================== CONTROLLED ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled Value</h2>
        <p class="text-sm text-on-surface-variant">
            Bind the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >value</code
            > prop to control which tab is active.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm font-medium">
                Active tab: <Badge variant="soft" color="info" label={controlledValue} />
            </p>
            <div class="mb-3 flex gap-2">
                {#each basicItems as item (item.value)}
                    <Button
                        size="xs"
                        variant={controlledValue === item.value ? 'solid' : 'outline'}
                        label={item.label}
                        onclick={() => (controlledValue = item.value ?? '')}
                    />
                {/each}
            </div>
            <Tabs items={basicItems} bind:value={controlledValue} />
        </div>
    </section>

    <!-- ==================== CALLBACK ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Value Change Callback</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onValueChange</code
            > to react to tab changes.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm">
                Last change: <Badge
                    variant="soft"
                    color={lastChange ? 'success' : 'surface'}
                    label={lastChange || 'None'}
                />
            </p>
            <Tabs items={basicItems} onValueChange={(v) => (lastChange = `Switched to: ${v}`)} />
        </div>
    </section>

    <!-- ==================== NO CONTENT ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Navigation Only (No Content)</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >content={'{false}'}</code
            > to render tabs without content panels. Useful for navigation.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs items={manyItems} content={false} />
        </div>
    </section>

    <Separator />

    <!-- ==================== CUSTOM SLOTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use snippets for custom rendering: <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">leading</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">trailing</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">body</code>.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <!-- Leading slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom leading</p>
                <Tabs items={basicItems} variant="link">
                    {#snippet leading({ active })}
                        <div
                            class="flex size-6 items-center justify-center rounded-full {active
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-highest'}"
                        >
                            <Icon name={active ? 'lucide:check' : 'lucide:circle'} size="14" />
                        </div>
                    {/snippet}
                </Tabs>
            </div>

            <!-- Label slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom label</p>
                <Tabs items={basicItems}>
                    {#snippet label({ item })}
                        <span class="flex items-center gap-1.5">
                            {item.label}
                            {#if item.value === 'account'}
                                <Badge size="xs" variant="soft" color="primary" label="New" />
                            {/if}
                        </span>
                    {/snippet}
                </Tabs>
            </div>

            <!-- Trailing slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom trailing</p>
                <Tabs items={basicItems} variant="link">
                    {#snippet trailing({ item })}
                        {#if item.value === 'notifications'}
                            <Badge size="xs" variant="soft" color="error" label="3" />
                        {/if}
                    {/snippet}
                </Tabs>
            </div>

            <!-- Body slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom body</p>
                <Tabs items={basicItems}>
                    {#snippet body({ item })}
                        <div class="flex items-start gap-3 rounded-lg bg-surface-container p-4">
                            <Icon
                                name="lucide:info"
                                size="18"
                                class="mt-0.5 shrink-0 text-primary"
                            />
                            <div>
                                <p class="text-sm font-medium">{item.label}</p>
                                <p class="text-sm text-on-surface-variant">{item.content}</p>
                            </div>
                        </div>
                    {/snippet}
                </Tabs>
            </div>
        </div>
    </section>

    <Separator />

    <!-- ==================== UI OVERRIDES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Prop (Style Overrides)</h2>
        <p class="text-sm text-on-surface-variant">
            Override slot styles via the <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code
            >
            prop. Available slots: root, list, indicator, trigger, content, label, leadingIcon.
        </p>

        <div class="grid gap-4 lg:grid-cols-2">
            <!-- ui.root -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5">ui.root</code>
                </p>
                <Tabs
                    items={basicItems}
                    ui={{ root: 'border border-outline-variant rounded-xl p-3' }}
                />
            </div>

            <!-- ui.list -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5">ui.list</code>
                </p>
                <Tabs
                    items={basicItems}
                    ui={{ list: 'bg-surface-container-highest rounded-xl' }}
                />
            </div>

            <!-- ui.indicator -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5"
                        >ui.indicator</code
                    >
                </p>
                <Tabs items={basicItems} ui={{ indicator: 'rounded-full' }} />
            </div>

            <!-- ui.trigger -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5"
                        >ui.trigger</code
                    >
                </p>
                <Tabs items={basicItems} ui={{ trigger: 'font-bold uppercase tracking-wide' }} />
            </div>

            <!-- ui.leadingIcon -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5"
                        >ui.leadingIcon</code
                    >
                </p>
                <Tabs items={iconItems} ui={{ leadingIcon: 'size-6 text-warning' }} />
            </div>

            <!-- ui.label -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5">ui.label</code
                    >
                </p>
                <Tabs items={basicItems} ui={{ label: 'italic underline' }} />
            </div>

            <!-- ui.content -->
            <div class="rounded-lg bg-surface-container-high p-4 lg:col-span-2">
                <p class="mb-2 text-xs font-medium">
                    <code class="rounded bg-surface-container-highest px-1.5 py-0.5"
                        >ui.content</code
                    >
                </p>
                <Tabs
                    items={basicItems}
                    ui={{
                        content:
                            'mt-3 p-4 bg-surface-container rounded-lg border border-outline-variant'
                    }}
                />
            </div>
        </div>
    </section>

    <!-- ==================== PER-ITEM OVERRIDES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Per-Item Style Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Each item can have its own <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">class</code>
            overrides.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs
                items={[
                    { label: 'Normal', content: 'Standard tab styling.', value: 'normal' },
                    {
                        label: 'Highlighted',
                        content: 'This tab has custom styling.',
                        value: 'highlight',
                        class: 'font-bold'
                    },
                    {
                        label: 'Custom',
                        content: 'Another custom styled tab.',
                        value: 'custom',
                        ui: { trigger: 'italic' }
                    }
                ]}
                variant="link"
            />
        </div>
    </section>

    <Separator />

    <!-- ==================== REAL WORLD: SETTINGS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Settings Page</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-4">
                <h3 class="font-semibold text-on-surface">Settings</h3>
                <p class="text-sm text-on-surface-variant">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Tabs items={iconItems} variant="link" color="primary">
                {#snippet body({ item })}
                    <div class="space-y-4 rounded-lg bg-surface-container p-4">
                        {#if item.value === 'profile'}
                            <div class="flex items-center gap-4">
                                <div
                                    class="flex size-16 items-center justify-center rounded-full bg-primary/10"
                                >
                                    <Icon name="lucide:user" size="32" class="text-primary" />
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold">John Doe</h4>
                                    <p class="text-sm text-on-surface-variant">
                                        john.doe@example.com
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leadingIcon="lucide:pencil"
                                    label="Edit"
                                />
                            </div>
                        {:else if item.value === 'security'}
                            <div class="space-y-3">
                                <div
                                    class="flex items-center justify-between rounded-lg bg-surface-container-highest p-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon
                                            name="lucide:shield-check"
                                            size="20"
                                            class="text-success"
                                        />
                                        <div>
                                            <p class="text-sm font-medium">
                                                Two-Factor Authentication
                                            </p>
                                            <p class="text-xs text-on-surface-variant">
                                                Add an extra layer of security
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="soft"
                                        color="success"
                                        size="xs"
                                        label="Enabled"
                                    />
                                </div>
                                <div
                                    class="flex items-center justify-between rounded-lg bg-surface-container-highest p-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon name="lucide:key" size="20" class="text-warning" />
                                        <div>
                                            <p class="text-sm font-medium">Password</p>
                                            <p class="text-xs text-on-surface-variant">
                                                Last changed 30 days ago
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="xs" variant="outline" label="Change" />
                                </div>
                            </div>
                        {:else if item.value === 'billing'}
                            <div class="grid grid-cols-3 gap-3">
                                <div
                                    class="rounded-lg bg-surface-container-highest p-3 text-center"
                                >
                                    <p class="text-2xl font-bold text-primary">Pro</p>
                                    <p class="text-xs text-on-surface-variant">Current Plan</p>
                                </div>
                                <div
                                    class="rounded-lg bg-surface-container-highest p-3 text-center"
                                >
                                    <p class="text-2xl font-bold text-success">$29</p>
                                    <p class="text-xs text-on-surface-variant">Monthly</p>
                                </div>
                                <div
                                    class="rounded-lg bg-surface-container-highest p-3 text-center"
                                >
                                    <p class="text-2xl font-bold text-on-surface">Mar 15</p>
                                    <p class="text-xs text-on-surface-variant">Next Billing</p>
                                </div>
                            </div>
                        {:else}
                            <div class="space-y-2">
                                <div
                                    class="flex items-center justify-between rounded-lg bg-surface-container-highest p-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon name="lucide:github" size="20" />
                                        <span class="text-sm font-medium">GitHub</span>
                                    </div>
                                    <Badge
                                        variant="soft"
                                        color="success"
                                        size="xs"
                                        label="Connected"
                                    />
                                </div>
                                <div
                                    class="flex items-center justify-between rounded-lg bg-surface-container-highest p-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon name="lucide:slack" size="20" />
                                        <span class="text-sm font-medium">Slack</span>
                                    </div>
                                    <Button size="xs" variant="outline" label="Connect" />
                                </div>
                            </div>
                        {/if}
                    </div>
                {/snippet}
            </Tabs>
        </div>
    </section>

    <!-- ==================== REAL WORLD: DASHBOARD ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Dashboard Tabs</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs
                items={[
                    { label: 'Overview', icon: 'lucide:layout-dashboard', value: 'overview' },
                    { label: 'Analytics', icon: 'lucide:bar-chart-3', value: 'analytics' },
                    { label: 'Reports', icon: 'lucide:file-text', value: 'reports' }
                ]}
                variant="pill"
                color="primary"
            >
                {#snippet body({ item })}
                    {#if item.value === 'overview'}
                        <div class="grid gap-3 sm:grid-cols-3">
                            <div class="rounded-lg bg-surface-container p-4">
                                <div class="flex items-center gap-2">
                                    <Icon name="lucide:users" size="18" class="text-primary" />
                                    <span class="text-sm text-on-surface-variant">Users</span>
                                </div>
                                <p class="mt-2 text-2xl font-bold">12,345</p>
                                <p class="text-xs text-success">+12.5% from last month</p>
                            </div>
                            <div class="rounded-lg bg-surface-container p-4">
                                <div class="flex items-center gap-2">
                                    <Icon
                                        name="lucide:dollar-sign"
                                        size="18"
                                        class="text-success"
                                    />
                                    <span class="text-sm text-on-surface-variant">Revenue</span>
                                </div>
                                <p class="mt-2 text-2xl font-bold">$48,290</p>
                                <p class="text-xs text-success">+8.2% from last month</p>
                            </div>
                            <div class="rounded-lg bg-surface-container p-4">
                                <div class="flex items-center gap-2">
                                    <Icon
                                        name="lucide:shopping-cart"
                                        size="18"
                                        class="text-warning"
                                    />
                                    <span class="text-sm text-on-surface-variant">Orders</span>
                                </div>
                                <p class="mt-2 text-2xl font-bold">1,890</p>
                                <p class="text-xs text-error">-3.1% from last month</p>
                            </div>
                        </div>
                    {:else if item.value === 'analytics'}
                        <div
                            class="flex flex-col items-center justify-center rounded-lg bg-surface-container p-8"
                        >
                            <Icon
                                name="lucide:bar-chart-3"
                                size="48"
                                class="text-on-surface-variant/30"
                            />
                            <p class="mt-3 text-sm text-on-surface-variant">
                                Analytics charts would be rendered here
                            </p>
                        </div>
                    {:else}
                        <div class="space-y-2">
                            {#each ['Monthly Revenue Report', 'User Growth Report', 'Conversion Funnel Report'] as report (report)}
                                <div
                                    class="flex items-center justify-between rounded-lg bg-surface-container p-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <Icon
                                            name="lucide:file-text"
                                            size="18"
                                            class="text-on-surface-variant"
                                        />
                                        <span class="text-sm">{report}</span>
                                    </div>
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        leadingIcon="lucide:download"
                                        label="Download"
                                    />
                                </div>
                            {/each}
                        </div>
                    {/if}
                {/snippet}
            </Tabs>
        </div>
    </section>

    <!-- ==================== REAL WORLD: VERTICAL SIDEBAR ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Vertical Settings</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs
                items={[
                    {
                        label: 'General',
                        icon: 'lucide:settings',
                        value: 'general',
                        content:
                            'Configure general application settings like language, timezone, and display preferences.'
                    },
                    {
                        label: 'Appearance',
                        icon: 'lucide:palette',
                        value: 'appearance',
                        content:
                            'Customize the look and feel of the application including themes, fonts, and layout.'
                    },
                    {
                        label: 'Privacy',
                        icon: 'lucide:lock',
                        value: 'privacy',
                        content:
                            'Control your privacy settings, data sharing preferences, and cookie consent.'
                    },
                    {
                        label: 'Notifications',
                        icon: 'lucide:bell',
                        value: 'notifications',
                        content: 'Manage email, push, and in-app notification preferences.'
                    }
                ]}
                orientation="vertical"
                variant="pill"
                color="primary"
            />
        </div>
    </section>
</div>
