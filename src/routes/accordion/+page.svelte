<script lang="ts">
    import { Accordion, Button, Badge, Icon, Separator } from '$lib/index.js'
    import type { AccordionItem } from '$lib/index.js'

    // --- Basic items ---
    const basicItems: AccordionItem[] = [
        {
            label: 'What is Svelte?',
            content:
                'Svelte is a modern JavaScript compiler that generates highly efficient vanilla JavaScript at build time, resulting in faster runtime performance and smaller bundle sizes.'
        },
        {
            label: 'Why use SvelteKit?',
            content:
                'SvelteKit is the official framework for building Svelte apps. It provides routing, server-side rendering, code splitting, and other production-ready features out of the box.'
        },
        {
            label: 'How does reactivity work?',
            content:
                'Svelte uses a compile-time approach to reactivity. Variables declared with let are automatically reactive, and the compiler generates efficient update code.'
        }
    ]

    // --- Items with icons ---
    const iconItems: AccordionItem[] = [
        {
            label: 'Account Settings',
            icon: 'lucide:user',
            content:
                'Manage your profile information, email preferences, and account security settings.'
        },
        {
            label: 'Notifications',
            icon: 'lucide:bell',
            content:
                'Configure push notifications, email alerts, and in-app notification preferences.'
        },
        {
            label: 'Privacy & Security',
            icon: 'lucide:shield',
            content:
                'Control your privacy settings, two-factor authentication, and data sharing preferences.'
        }
    ]

    // --- Disabled items ---
    const disabledItems: AccordionItem[] = [
        { label: 'Available Feature', content: 'This feature is available for all users.' },
        {
            label: 'Premium Feature',
            content: 'This feature requires a premium subscription.',
            disabled: true
        },
        { label: 'Another Feature', content: 'This feature is also available.' }
    ]

    // --- Custom trailing icons ---
    const trailingItems: AccordionItem[] = [
        { label: 'Add Item', content: 'Click to add a new item.', trailingIcon: 'lucide:plus' },
        { label: 'Edit Item', content: 'Click to edit this item.', trailingIcon: 'lucide:pencil' },
        {
            label: 'Delete Item',
            content: 'Click to delete this item.',
            trailingIcon: 'lucide:trash-2'
        }
    ]

    // --- Controlled value ---
    let singleValue = $state<string>('0')
    let multipleValue = $state<string[]>(['0', '2'])

    // --- Callback demo ---
    let lastChange = $state<string>('')

    // --- FAQ items ---
    const faqItems: AccordionItem[] = [
        {
            label: 'How do I reset my password?',
            content:
                'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your inbox.'
        },
        {
            label: 'Can I change my username?',
            content:
                'Yes, you can change your username once every 30 days from Account Settings > Profile > Edit Username.'
        },
        {
            label: 'What payment methods are accepted?',
            content:
                'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.'
        },
        {
            label: 'How do I cancel my subscription?',
            content:
                'Go to Account Settings > Billing > Cancel Subscription. Your access will continue until the end of your current billing period.'
        },
        {
            label: 'Is my data secure?',
            content:
                'Yes, we use industry-standard encryption (AES-256) and follow SOC 2 compliance guidelines to protect your data.'
        }
    ]

    // --- Slot demo items ---
    const slotItems: AccordionItem[] = [
        {
            label: 'Pro Plan',
            content: 'Access all features with priority support.',
            value: 'pro'
        },
        {
            label: 'Enterprise Plan',
            content: 'Custom solutions with dedicated account manager.',
            value: 'enterprise'
        },
        {
            label: 'Free Plan',
            content: 'Basic features for personal use.',
            value: 'free'
        }
    ]
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Accordion</h1>
        <p class="text-on-surface-variant">
            A vertically stacked set of interactive headings that reveal or hide associated content.
            Built on top of bits-ui Accordion.
        </p>
    </div>

    <!-- ==================== BASIC ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Pass an array of items with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code> properties.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion items={basicItems} />
        </div>
    </section>

    <!-- ==================== SINGLE VS MULTIPLE ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Single vs Multiple</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="single"</code
            >
            to allow only one item open at a time, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="multiple"</code
            >
            for multiple.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Single (default)</p>
                <Accordion type="single" items={basicItems} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Multiple</p>
                <Accordion type="multiple" items={basicItems} />
            </div>
        </div>
    </section>

    <!-- ==================== ICONS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Add leading icons via the <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code
            >
            property on each item.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion type="single" items={iconItems} />
        </div>
    </section>

    <!-- ==================== TRAILING ICON ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Trailing Icon</h2>
        <p class="text-sm text-on-surface-variant">
            Override the default chevron with <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >trailingIcon</code
            >
            globally or per-item.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Global trailing icon</p>
                <Accordion type="single" items={basicItems} trailingIcon="lucide:plus" />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Per-item trailing icons</p>
                <Accordion type="single" items={trailingItems} />
            </div>
        </div>
    </section>

    <!-- ==================== DISABLED ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled State</h2>
        <p class="text-sm text-on-surface-variant">
            Disable the entire accordion or individual items.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Entire accordion disabled</p>
                <Accordion type="single" items={basicItems} disabled />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Individual item disabled</p>
                <Accordion type="single" items={disabledItems} />
            </div>
        </div>
    </section>

    <!-- ==================== CONTROLLED ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled Value</h2>
        <p class="text-sm text-on-surface-variant">
            Bind the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >value</code
            >
            prop to control which items are open.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">
                    Single mode: <Badge variant="soft" color="info" label="value={singleValue}" />
                </p>
                <div class="mb-3 flex gap-2">
                    <Button
                        size="xs"
                        variant={singleValue === '0' ? 'solid' : 'outline'}
                        label="Item 1"
                        onclick={() => (singleValue = '0')}
                    />
                    <Button
                        size="xs"
                        variant={singleValue === '1' ? 'solid' : 'outline'}
                        label="Item 2"
                        onclick={() => (singleValue = '1')}
                    />
                    <Button
                        size="xs"
                        variant={singleValue === '2' ? 'solid' : 'outline'}
                        label="Item 3"
                        onclick={() => (singleValue = '2')}
                    />
                </div>
                <Accordion type="single" items={basicItems} bind:value={singleValue} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">
                    Multiple mode: <Badge
                        variant="soft"
                        color="info"
                        label="value=[{multipleValue.join(',')}]"
                    />
                </p>
                <div class="mb-3 flex gap-2">
                    <Button
                        size="xs"
                        variant={multipleValue.includes('0') ? 'solid' : 'outline'}
                        label="Item 1"
                        onclick={() =>
                            (multipleValue = multipleValue.includes('0')
                                ? multipleValue.filter((v) => v !== '0')
                                : [...multipleValue, '0'])}
                    />
                    <Button
                        size="xs"
                        variant={multipleValue.includes('1') ? 'solid' : 'outline'}
                        label="Item 2"
                        onclick={() =>
                            (multipleValue = multipleValue.includes('1')
                                ? multipleValue.filter((v) => v !== '1')
                                : [...multipleValue, '1'])}
                    />
                    <Button
                        size="xs"
                        variant={multipleValue.includes('2') ? 'solid' : 'outline'}
                        label="Item 3"
                        onclick={() =>
                            (multipleValue = multipleValue.includes('2')
                                ? multipleValue.filter((v) => v !== '2')
                                : [...multipleValue, '2'])}
                    />
                </div>
                <Accordion type="multiple" items={basicItems} bind:value={multipleValue} />
            </div>
        </div>
    </section>

    <!-- ==================== CALLBACK ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Value Change Callback</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >onValueChange</code
            >
            to react to value changes.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm">
                Last change: <Badge
                    variant="soft"
                    color={lastChange ? 'success' : 'surface'}
                    label={lastChange || 'None'}
                />
            </p>
            <Accordion
                type="single"
                items={basicItems}
                onValueChange={(v) => (lastChange = v ? `Opened: ${v}` : 'Closed')}
            />
        </div>
    </section>

    <!-- ==================== CUSTOM VALUES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Item Values</h2>
        <p class="text-sm text-on-surface-variant">
            Assign custom <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >value</code
            >
            to items instead of using index.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="single"
                items={[
                    { label: 'Introduction', content: 'Welcome to the guide.', value: 'intro' },
                    {
                        label: 'Getting Started',
                        content: "Let's begin with the basics.",
                        value: 'start'
                    },
                    {
                        label: 'Advanced Topics',
                        content: 'Deep dive into advanced features.',
                        value: 'advanced'
                    }
                ]}
                value="start"
            />
        </div>
    </section>

    <!-- ==================== LOOP ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Keyboard Navigation (Loop)</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">loop</code> to
            cycle keyboard focus at boundaries.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm text-on-surface-variant">
                Use ↑↓ arrow keys to navigate. Focus cycles from last to first (and vice versa).
            </p>
            <Accordion type="single" items={basicItems} loop />
        </div>
    </section>

    <!-- ==================== ORIENTATION ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >orientation</code
            >
            for keyboard navigation direction. Use ←→ for horizontal, ↑↓ for vertical.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Vertical (default) - ↑↓ keys</p>
                <Accordion type="single" items={basicItems} orientation="vertical" />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Horizontal - ←→ keys</p>
                <Accordion type="single" items={basicItems} orientation="horizontal" />
            </div>
        </div>
    </section>

    <!-- ==================== FORCE MOUNT ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Force Mount</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >forceMount</code
            >
            to keep content in the DOM even when collapsed. Useful for SEO or preserving form state.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Default (unmount on close)</p>
                <p class="mb-3 text-xs text-on-surface-variant">
                    Content is removed from DOM when closed
                </p>
                <Accordion type="single" items={basicItems} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Force mount enabled</p>
                <p class="mb-3 text-xs text-on-surface-variant">
                    Content stays in DOM (inspect element)
                </p>
                <Accordion type="single" items={basicItems} forceMount />
            </div>
        </div>
    </section>

    <Separator />

    <!-- ==================== SLOTS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use snippets for custom rendering: <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">leading</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">trailing</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">body</code>.
        </p>

        <div class="grid gap-4 lg:grid-cols-2">
            <!-- Leading slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom leading</p>
                <Accordion type="single" items={slotItems}>
                    {#snippet leading({ open })}
                        <div
                            class="flex size-8 items-center justify-center rounded-full {open
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-highest'}"
                        >
                            <Icon name={open ? 'lucide:check' : 'lucide:star'} size="16" />
                        </div>
                    {/snippet}
                </Accordion>
            </div>

            <!-- Label slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom label</p>
                <Accordion type="single" items={slotItems}>
                    {#snippet label({ item, open })}
                        <span class="flex items-center gap-2">
                            {item.label}
                            {#if item.value === 'pro'}
                                <Badge size="xs" variant="soft" color="primary" label="Popular" />
                            {/if}
                            {#if open}
                                <Icon name="lucide:eye" size="14" class="text-on-surface-variant" />
                            {/if}
                        </span>
                    {/snippet}
                </Accordion>
            </div>

            <!-- Trailing slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom trailing</p>
                <Accordion type="single" items={slotItems}>
                    {#snippet trailing({ item, open })}
                        <div class="flex items-center gap-2">
                            {#if item.value === 'enterprise'}
                                <Badge
                                    size="xs"
                                    variant="outline"
                                    color="warning"
                                    label="Contact us"
                                />
                            {/if}
                            <Icon
                                name={open ? 'lucide:minus' : 'lucide:plus'}
                                size="18"
                                class="transition-transform"
                            />
                        </div>
                    {/snippet}
                </Accordion>
            </div>

            <!-- Body slot -->
            <div class="rounded-lg bg-surface-container-high p-4">
                <p class="mb-3 text-sm font-medium">Custom body</p>
                <Accordion type="single" items={slotItems}>
                    {#snippet body({ item })}
                        <div class="flex items-start gap-3">
                            <Icon
                                name="lucide:info"
                                size="18"
                                class="mt-0.5 shrink-0 text-primary"
                            />
                            <div>
                                <p class="text-sm">{item.content}</p>
                                <Button
                                    size="xs"
                                    variant="link"
                                    label="Learn more"
                                    class="mt-2 h-auto p-0"
                                />
                            </div>
                        </div>
                    {/snippet}
                </Accordion>
            </div>
        </div>

        <!-- Content slot (full custom) -->
        <div class="rounded-lg bg-surface-container-high p-4">
            <p class="mb-3 text-sm font-medium">Custom content (full control)</p>
            <Accordion type="single" items={slotItems}>
                {#snippet content({ item })}
                    <div class="rounded-lg bg-surface-container p-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                            >
                                <Icon name="lucide:package" size="20" />
                            </div>
                            <div class="flex-1">
                                <p class="font-medium">{item.label}</p>
                                <p class="text-sm text-on-surface-variant">{item.content}</p>
                            </div>
                            <Button size="sm" variant="solid" label="Select" />
                        </div>
                    </div>
                {/snippet}
            </Accordion>
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
            prop. Available slots: root, item, header, trigger, content, body, label, leadingIcon, trailingIcon.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="single"
                items={basicItems}
                ui={{
                    root: 'divide-y divide-outline',
                    item: 'border-none',
                    trigger: 'py-4 hover:bg-surface-container rounded-lg px-3 -mx-3',
                    label: 'text-primary font-semibold',
                    body: 'px-3 text-on-surface-variant'
                }}
            />
        </div>
    </section>

    <!-- ==================== ITEM UI OVERRIDES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Per-Item Style Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Each item can have its own <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">class</code> overrides.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="single"
                items={[
                    { label: 'Normal Item', content: 'Standard styling.' },
                    {
                        label: 'Highlighted Item',
                        content: 'This item has custom styling.',
                        class: 'bg-primary/5 rounded-lg',
                        ui: { trigger: 'text-primary', label: 'font-bold' }
                    },
                    {
                        label: 'Warning Item',
                        content: 'This item indicates a warning.',
                        class: 'bg-warning/5 rounded-lg',
                        ui: { trigger: 'text-warning', trailingIcon: 'text-warning' }
                    },
                    { label: 'Another Normal', content: 'Standard styling again.' }
                ]}
            />
        </div>
    </section>

    <Separator />

    <!-- ==================== REAL WORLD EXAMPLE: FAQ ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: FAQ</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="mb-4 flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon name="lucide:help-circle" size="20" class="text-primary" />
                </div>
                <div>
                    <h3 class="font-semibold text-on-surface">Frequently Asked Questions</h3>
                    <p class="text-sm text-on-surface-variant">Find answers to common questions</p>
                </div>
            </div>
            <Accordion
                type="single"
                items={faqItems}
                ui={{
                    item: 'border-outline-variant/50',
                    trigger: 'py-4',
                    label: 'text-on-surface',
                    body: 'text-on-surface-variant leading-relaxed'
                }}
            />
        </div>
    </section>

    <!-- ==================== REAL WORLD EXAMPLE: SETTINGS ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Settings Sections</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="multiple"
                items={[
                    {
                        label: 'General Settings',
                        icon: 'lucide:settings-2',
                        content: 'Configure language, timezone, and display preferences.',
                        value: 'general'
                    },
                    {
                        label: 'Notification Preferences',
                        icon: 'lucide:bell-ring',
                        content: 'Manage email, push, and SMS notification settings.',
                        value: 'notifications'
                    },
                    {
                        label: 'Security & Privacy',
                        icon: 'lucide:lock',
                        content: 'Set up two-factor authentication and manage privacy controls.',
                        value: 'security'
                    },
                    {
                        label: 'Billing & Subscription',
                        icon: 'lucide:credit-card',
                        content: 'View invoices, update payment methods, and manage your plan.',
                        value: 'billing'
                    }
                ]}
                value={['general']}
                ui={{
                    item: 'bg-surface-container rounded-lg mb-2 last:mb-0 border-none overflow-hidden',
                    header: 'bg-surface-container-low',
                    trigger: 'px-4',
                    body: 'px-4 bg-surface-container-lowest'
                }}
            />
        </div>
    </section>

    <!-- ==================== REAL WORLD EXAMPLE: SIDEBAR NAV ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Sidebar Navigation</h2>
        <div class="max-w-xs rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="multiple"
                items={[
                    {
                        label: 'Dashboard',
                        icon: 'lucide:layout-dashboard',
                        content: '',
                        value: 'dashboard'
                    },
                    {
                        label: 'Products',
                        icon: 'lucide:package',
                        content: '',
                        value: 'products'
                    },
                    {
                        label: 'Analytics',
                        icon: 'lucide:bar-chart-3',
                        content: '',
                        value: 'analytics'
                    }
                ]}
                value={['products']}
                trailingIcon="lucide:chevron-right"
                ui={{
                    root: 'space-y-1',
                    item: 'border-none',
                    trigger: 'py-2 px-3 rounded-lg hover:bg-surface-container',
                    trailingIcon: 'group-data-[state=open]:rotate-90',
                    content: 'pl-6'
                }}
            >
                {#snippet body({ item })}
                    <div class="space-y-1 py-1">
                        {#if item.value === 'products'}
                            <a
                                href="#all"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                All Products
                            </a>
                            <a
                                href="#categories"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                Categories
                            </a>
                            <a
                                href="#inventory"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                Inventory
                            </a>
                        {:else if item.value === 'analytics'}
                            <a
                                href="#overview"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                Overview
                            </a>
                            <a
                                href="#reports"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                Reports
                            </a>
                        {:else}
                            <a
                                href="#home"
                                class="block rounded-md px-3 py-1.5 text-sm hover:bg-surface-container"
                            >
                                Home
                            </a>
                        {/if}
                    </div>
                {/snippet}
            </Accordion>
        </div>
    </section>

    <!-- ==================== REAL WORLD EXAMPLE: FEATURE COMPARISON ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World Example: Feature Comparison</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="single"
                items={[
                    { label: 'Storage', value: 'storage' },
                    { label: 'Users', value: 'users' },
                    { label: 'Support', value: 'support' }
                ]}
                ui={{
                    item: 'border-outline-variant/30',
                    trigger: 'py-3'
                }}
            >
                {#snippet leading({ open })}
                    <div
                        class="flex size-6 items-center justify-center rounded {open
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-highest'}"
                    >
                        <Icon name={open ? 'lucide:minus' : 'lucide:plus'} size="14" />
                    </div>
                {/snippet}
                {#snippet trailing()}
                    <div class="flex gap-8 text-center text-xs">
                        <div class="w-16">
                            <p class="font-medium">Free</p>
                        </div>
                        <div class="w-16">
                            <p class="font-medium text-primary">Pro</p>
                        </div>
                        <div class="w-16">
                            <p class="font-medium">Enterprise</p>
                        </div>
                    </div>
                {/snippet}
                {#snippet body({ item })}
                    <div class="flex justify-end gap-8 text-center text-sm">
                        {#if item.value === 'storage'}
                            <div class="w-16">5 GB</div>
                            <div class="w-16 font-medium text-primary">100 GB</div>
                            <div class="w-16">Unlimited</div>
                        {:else if item.value === 'users'}
                            <div class="w-16">1</div>
                            <div class="w-16 font-medium text-primary">10</div>
                            <div class="w-16">Unlimited</div>
                        {:else}
                            <div class="w-16">Email</div>
                            <div class="w-16 font-medium text-primary">Priority</div>
                            <div class="w-16">24/7 Phone</div>
                        {/if}
                    </div>
                {/snippet}
            </Accordion>
        </div>
    </section>

    <!-- ==================== ADVANCED: UNIQUE UI PER ITEM ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Advanced: Unique UI Per Item</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >body</code
            >
            or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">content</code> snippet
            with conditional rendering to create completely different layouts for each item.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="single"
                items={[
                    { label: 'User Profile', icon: 'lucide:user', value: 'profile' },
                    { label: 'Statistics', icon: 'lucide:bar-chart-2', value: 'stats' },
                    { label: 'Recent Activity', icon: 'lucide:activity', value: 'activity' },
                    { label: 'Quick Actions', icon: 'lucide:zap', value: 'actions' }
                ]}
                ui={{
                    item: 'border-outline-variant/30',
                    trigger: 'py-3'
                }}
            >
                {#snippet body({ item })}
                    {#if item.value === 'profile'}
                        <!-- Profile Card UI -->
                        <div class="flex items-center gap-4 rounded-lg bg-surface-container p-4">
                            <div
                                class="flex size-16 items-center justify-center rounded-full bg-primary/10"
                            >
                                <Icon name="lucide:user" size="32" class="text-primary" />
                            </div>
                            <div class="flex-1">
                                <h4 class="font-semibold">John Doe</h4>
                                <p class="text-sm text-on-surface-variant">john.doe@example.com</p>
                                <div class="mt-2 flex gap-2">
                                    <Badge
                                        size="xs"
                                        variant="soft"
                                        color="success"
                                        label="Active"
                                    />
                                    <Badge
                                        size="xs"
                                        variant="outline"
                                        color="primary"
                                        label="Pro Plan"
                                    />
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                leadingIcon="lucide:pencil"
                                label="Edit"
                            />
                        </div>
                    {:else if item.value === 'stats'}
                        <!-- Statistics Grid UI -->
                        <div class="grid grid-cols-3 gap-3">
                            <div class="rounded-lg bg-surface-container p-3 text-center">
                                <p class="text-2xl font-bold text-primary">1,234</p>
                                <p class="text-xs text-on-surface-variant">Total Views</p>
                            </div>
                            <div class="rounded-lg bg-surface-container p-3 text-center">
                                <p class="text-2xl font-bold text-success">89%</p>
                                <p class="text-xs text-on-surface-variant">Success Rate</p>
                            </div>
                            <div class="rounded-lg bg-surface-container p-3 text-center">
                                <p class="text-2xl font-bold text-warning">42</p>
                                <p class="text-xs text-on-surface-variant">Pending</p>
                            </div>
                        </div>
                    {:else if item.value === 'activity'}
                        <!-- Activity Timeline UI -->
                        <div class="space-y-3">
                            {#each [{ time: '2 min ago', text: 'Updated profile picture', icon: 'lucide:image', color: 'text-primary' }, { time: '1 hour ago', text: 'Completed task #123', icon: 'lucide:check-circle', color: 'text-success' }, { time: '3 hours ago', text: 'Added new comment', icon: 'lucide:message-circle', color: 'text-info' }] as activity (activity.text)}
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container"
                                    >
                                        <Icon
                                            name={activity.icon}
                                            size="16"
                                            class={activity.color}
                                        />
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm">{activity.text}</p>
                                        <p class="text-xs text-on-surface-variant">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else if item.value === 'actions'}
                        <!-- Quick Actions Grid UI -->
                        <div class="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                leadingIcon="lucide:plus"
                                label="New Item"
                                class="justify-start"
                            />
                            <Button
                                variant="outline"
                                leadingIcon="lucide:upload"
                                label="Upload"
                                class="justify-start"
                            />
                            <Button
                                variant="outline"
                                leadingIcon="lucide:download"
                                label="Export"
                                class="justify-start"
                            />
                            <Button
                                variant="outline"
                                leadingIcon="lucide:share-2"
                                label="Share"
                                class="justify-start"
                            />
                        </div>
                    {/if}
                {/snippet}
            </Accordion>
        </div>
    </section>

    <!-- ==================== ADVANCED: MIXED CONTENT TYPES ==================== -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Advanced: Mixed Content Types</h2>
        <p class="text-sm text-on-surface-variant">
            Combine different content types like forms, images, code blocks, and interactive
            elements.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Accordion
                type="multiple"
                items={[
                    { label: 'Contact Form', icon: 'lucide:mail', value: 'form' },
                    { label: 'Image Gallery', icon: 'lucide:image', value: 'gallery' },
                    { label: 'Code Example', icon: 'lucide:code', value: 'code' }
                ]}
                value={['form']}
                ui={{
                    item: 'bg-surface-container rounded-lg mb-2 last:mb-0 border-none overflow-hidden',
                    trigger: 'px-4 py-3',
                    body: 'px-4 pb-4'
                }}
            >
                {#snippet body({ item })}
                    {#if item.value === 'form'}
                        <!-- Form UI -->
                        <div class="space-y-3">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <label class="block">
                                    <span class="mb-1 block text-xs font-medium">Name</span>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    />
                                </label>
                                <label class="block">
                                    <span class="mb-1 block text-xs font-medium">Email</span>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    />
                                </label>
                            </div>
                            <label class="block">
                                <span class="mb-1 block text-xs font-medium">Message</span>
                                <textarea
                                    placeholder="Your message..."
                                    rows="3"
                                    class="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                ></textarea>
                            </label>
                            <Button
                                variant="solid"
                                label="Send Message"
                                leadingIcon="lucide:send"
                            />
                        </div>
                    {:else if item.value === 'gallery'}
                        <!-- Image Gallery UI -->
                        <div class="grid grid-cols-3 gap-2">
                            {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
                                <div
                                    class="flex aspect-square items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-secondary/20"
                                >
                                    <Icon
                                        name="lucide:image"
                                        size="24"
                                        class="text-on-surface-variant/50"
                                    />
                                </div>
                            {/each}
                        </div>
                        <p class="mt-2 text-center text-xs text-on-surface-variant">
                            Click to view full size
                        </p>
                    {:else if item.value === 'code'}
                        <!-- Code Block UI -->
                        <div class="overflow-hidden rounded-lg bg-surface-container-highest">
                            <div
                                class="flex items-center justify-between border-b border-outline-variant/30 px-3 py-2"
                            >
                                <span class="text-xs text-on-surface-variant">accordion.svelte</span
                                >
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    leadingIcon="lucide:copy"
                                    label="Copy"
                                />
                            </div>
                            <pre class="overflow-x-auto p-3 text-xs"><code
                                    class="text-on-surface-variant"
                                    >&lt;Accordion
  type="single"
  items=&#123;items&#125;
  bind:value
&gt;
  &#123;#snippet body(&#123; item &#125;)&#125;
    &lt;p&gt;&#123;item.content&#125;&lt;/p&gt;
  &#123;/snippet&#125;
&lt;/Accordion&gt;</code
                                ></pre>
                        </div>
                    {/if}
                {/snippet}
            </Accordion>
        </div>
    </section>
</div>
