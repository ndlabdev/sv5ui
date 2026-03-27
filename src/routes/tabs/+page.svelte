<script lang="ts">
    import { Tabs, Badge, Button, Icon, Separator } from '$lib/index.js'
    import type { TabsItem } from '$lib/index.js'

    const basicItems: TabsItem[] = [
        {
            label: 'Account',
            content: 'Manage your account settings and preferences.',
            value: 'account'
        },
        {
            label: 'Password',
            content: 'Change your password and security keys.',
            value: 'password'
        },
        {
            label: 'Notifications',
            content: 'Configure notification preferences.',
            value: 'notifications'
        }
    ]

    const iconItems: TabsItem[] = [
        {
            label: 'Profile',
            icon: 'lucide:user',
            content: 'Update your profile information.',
            value: 'profile'
        },
        {
            label: 'Security',
            icon: 'lucide:shield',
            content: 'Manage security settings.',
            value: 'security'
        },
        {
            label: 'Billing',
            icon: 'lucide:credit-card',
            content: 'View invoices and payments.',
            value: 'billing'
        },
        {
            label: 'Integrations',
            icon: 'lucide:plug',
            content: 'Connect third-party services.',
            value: 'integrations'
        }
    ]

    const disabledItems: TabsItem[] = [
        { label: 'General', content: 'General settings.', value: 'general' },
        { label: 'Advanced', content: 'Requires premium.', value: 'advanced', disabled: true },
        { label: 'About', content: 'Version and license info.', value: 'about' }
    ]

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

    let controlledValue = $state('account')
    let lastChange = $state('')
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Tabs</h1>
        <p class="text-on-surface-variant">
            A set of layered panels of content, where only one panel is visible at a time. Built on
            bits-ui Tabs primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs items={basicItems} />
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant</code
            >
            to switch between pill and link styles.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            {#each [{ variant: 'pill' as const, label: 'Pill (default)' }, { variant: 'link' as const, label: 'Link' }] as item (item.variant)}
                <div class="rounded-lg bg-surface-container-high p-4">
                    <p class="mb-3 text-sm font-medium">{item.label}</p>
                    <Tabs items={basicItems} variant={item.variant} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            >
            prop controls the indicator and active text color.
        </p>
        <div class="space-y-4">
            {#each ['pill', 'link'] as variant (variant)}
                <div>
                    <p class="mb-3 text-sm font-medium capitalize">{variant} variant</p>
                    <div class="grid gap-4 md:grid-cols-2">
                        {#each colors as color (color)}
                            <div class="rounded-lg bg-surface-container-high p-4">
                                <p class="mb-2 text-xs font-medium capitalize">{color}</p>
                                <Tabs
                                    items={basicItems}
                                    {color}
                                    variant={variant as 'pill' | 'link'}
                                    content={false}
                                />
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="space-y-4">
            {#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
                <div class="rounded-lg bg-surface-container-high p-4">
                    <p class="mb-2 text-xs font-medium uppercase">{size}</p>
                    <Tabs items={basicItems} {size} content={false} />
                </div>
            {/each}
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Add leading icons via the <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code
            >
            property on each item.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Pill</p>
                <Tabs items={iconItems} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Link</p>
                <Tabs items={iconItems} variant="link" />
            </div>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >orientation="vertical"</code
            >
            for vertical layout.
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

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">All disabled</p>
                <Tabs items={basicItems} disabled />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Individual disabled</p>
                <Tabs items={disabledItems} />
            </div>
        </div>
    </section>

    <!-- Content -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">No Content</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >content={'{false}'}</code
            >
            to use tabs purely for navigation.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs
                items={[
                    { label: 'Overview', value: 'overview' },
                    { label: 'Tasks', value: 'tasks' },
                    { label: 'Files', value: 'files' },
                    { label: 'Members', value: 'members' },
                    { label: 'Settings', value: 'settings' },
                    { label: 'Activity', value: 'activity' }
                ]}
                content={false}
            />
        </div>
    </section>

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Bind <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >value</code
            >
            to control the active tab programmatically.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm font-medium">
                Active: <Badge variant="soft" color="info" label={controlledValue} />
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

    <!-- Callback -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Value Change Callback</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onValueChange</code
            >
            to react to tab changes.
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

    <!-- Custom Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use snippets for custom rendering:
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">leading</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">trailing</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">body</code>.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
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

            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom label with badge</p>
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

    <!-- Per-Item Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Per-Item Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Each item supports
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">class</code>
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code>
            overrides.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Tabs
                items={[
                    { label: 'Normal', content: 'Standard styling.', value: 'normal' },
                    { label: 'Bold', content: 'Custom class.', value: 'bold', class: 'font-bold' },
                    {
                        label: 'Italic',
                        content: 'Custom ui.',
                        value: 'italic',
                        ui: { trigger: 'italic' }
                    }
                ]}
                variant="link"
            />
        </div>
    </section>

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Override slot styles via the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code> prop.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-sm font-medium text-on-surface-variant">
                    Custom list background
                </p>
                <Tabs
                    items={basicItems}
                    ui={{ list: 'bg-surface-container-highest rounded-xl' }}
                    content={false}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Rounded indicator</p>
                <Tabs items={basicItems} ui={{ indicator: 'rounded-full' }} content={false} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Bold triggers</p>
                <Tabs
                    items={basicItems}
                    ui={{ trigger: 'font-bold uppercase tracking-wide' }}
                    content={false}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-2 text-sm font-medium text-on-surface-variant">Custom content</p>
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

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-6">
        <h2 class="text-lg font-semibold">Real World Examples</h2>

        <div class="space-y-4">
            <!-- Settings Page -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Settings Page</p>
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
                                            <Icon
                                                name="lucide:user"
                                                size="32"
                                                class="text-primary"
                                            />
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
                                                <Icon
                                                    name="lucide:key"
                                                    size="20"
                                                    class="text-warning"
                                                />
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
                                        {#each [{ value: 'Pro', label: 'Current Plan', color: 'text-primary' }, { value: '$29', label: 'Monthly', color: 'text-success' }, { value: 'Mar 15', label: 'Next Billing', color: 'text-on-surface' }] as stat (stat.label)}
                                            <div
                                                class="rounded-lg bg-surface-container-highest p-3 text-center"
                                            >
                                                <p class="text-2xl font-bold {stat.color}">
                                                    {stat.value}
                                                </p>
                                                <p class="text-xs text-on-surface-variant">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        {/each}
                                    </div>
                                {:else}
                                    <div class="space-y-2">
                                        {#each [{ name: 'GitHub', icon: 'lucide:github', connected: true }, { name: 'Slack', icon: 'lucide:slack', connected: false }] as svc (svc.name)}
                                            <div
                                                class="flex items-center justify-between rounded-lg bg-surface-container-highest p-3"
                                            >
                                                <div class="flex items-center gap-3">
                                                    <Icon name={svc.icon} size="20" />
                                                    <span class="text-sm font-medium"
                                                        >{svc.name}</span
                                                    >
                                                </div>
                                                {#if svc.connected}
                                                    <Badge
                                                        variant="soft"
                                                        color="success"
                                                        size="xs"
                                                        label="Connected"
                                                    />
                                                {:else}
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        label="Connect"
                                                    />
                                                {/if}
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/snippet}
                    </Tabs>
                </div>
            </div>

            <!-- Dashboard -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Dashboard Tabs</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Tabs
                        items={[
                            {
                                label: 'Overview',
                                icon: 'lucide:layout-dashboard',
                                value: 'overview'
                            },
                            { label: 'Analytics', icon: 'lucide:bar-chart-3', value: 'analytics' },
                            { label: 'Reports', icon: 'lucide:file-text', value: 'reports' }
                        ]}
                        color="primary"
                    >
                        {#snippet body({ item })}
                            {#if item.value === 'overview'}
                                <div class="grid gap-3 sm:grid-cols-3">
                                    {#each [{ label: 'Users', value: '12,345', change: '+12.5%', icon: 'lucide:users', iconColor: 'text-primary', changeColor: 'text-success' }, { label: 'Revenue', value: '$48,290', change: '+8.2%', icon: 'lucide:dollar-sign', iconColor: 'text-success', changeColor: 'text-success' }, { label: 'Orders', value: '1,890', change: '-3.1%', icon: 'lucide:shopping-cart', iconColor: 'text-warning', changeColor: 'text-error' }] as stat (stat.label)}
                                        <div class="rounded-lg bg-surface-container p-4">
                                            <div class="flex items-center gap-2">
                                                <Icon
                                                    name={stat.icon}
                                                    size="18"
                                                    class={stat.iconColor}
                                                />
                                                <span class="text-sm text-on-surface-variant"
                                                    >{stat.label}</span
                                                >
                                            </div>
                                            <p class="mt-2 text-2xl font-bold">{stat.value}</p>
                                            <p class="text-xs {stat.changeColor}">
                                                {stat.change} from last month
                                            </p>
                                        </div>
                                    {/each}
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
            </div>

            <!-- Vertical Settings -->
            <div class="space-y-2">
                <p class="text-sm font-medium">Vertical Settings</p>
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
                                    'Customize the look and feel including themes, fonts, and layout.'
                            },
                            {
                                label: 'Privacy',
                                icon: 'lucide:lock',
                                value: 'privacy',
                                content:
                                    'Control your privacy settings and data sharing preferences.'
                            },
                            {
                                label: 'Notifications',
                                icon: 'lucide:bell',
                                value: 'notifications',
                                content: 'Manage email, push, and in-app notification preferences.'
                            }
                        ]}
                        orientation="vertical"
                        color="primary"
                    />
                </div>
            </div>
        </div>
    </section>
</div>
