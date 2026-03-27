<script lang="ts">
    import { Select, FormField, FieldGroup, Separator } from '$lib/index.js'
    import type { SelectItem, SelectItemType } from '$lib/index.js'

    const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
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

    let bindValue = $state('')

    const fruits: SelectItem[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'grape', label: 'Grape' },
        { value: 'orange', label: 'Orange' }
    ]

    const iconItems: SelectItem[] = [
        { value: 'home', label: 'Home', icon: 'lucide:home' },
        { value: 'settings', label: 'Settings', icon: 'lucide:settings' },
        { value: 'profile', label: 'Profile', icon: 'lucide:user' },
        { value: 'notifications', label: 'Notifications', icon: 'lucide:bell' }
    ]

    const avatarItems: SelectItem[] = [
        {
            value: 'alice',
            label: 'Alice',
            avatar: { src: 'https://i.pravatar.cc/120?img=1', alt: 'Alice' }
        },
        {
            value: 'bob',
            label: 'Bob',
            avatar: { src: 'https://i.pravatar.cc/120?img=3', alt: 'Bob' }
        },
        {
            value: 'charlie',
            label: 'Charlie',
            avatar: { src: 'https://i.pravatar.cc/120?img=5', alt: 'Charlie' }
        }
    ]

    const descriptionItems: SelectItem[] = [
        { value: 'standard', label: 'Standard', description: 'Free shipping, 5-7 business days' },
        { value: 'express', label: 'Express', description: 'Paid shipping, 2-3 business days' },
        {
            value: 'overnight',
            label: 'Overnight',
            description: 'Premium shipping, next business day'
        }
    ]

    const groupedItems: SelectItemType[] = [
        { type: 'label', label: 'Fruits' },
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { type: 'separator' },
        { type: 'label', label: 'Vegetables' },
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' }
    ]

    const disabledItems: SelectItem[] = [
        { value: 'active', label: 'Active' },
        { value: 'disabled', label: 'Disabled', disabled: true },
        { value: 'pending', label: 'Pending' }
    ]
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">Select</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A dropdown select component with variants, colors, icons, avatars, and integration with
            FormField and FieldGroup.
        </p>
        <div class="max-w-sm">
            <Select items={fruits} placeholder="Pick a fruit..." />
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:value</code
            > for reactive two-way data binding.
        </p>
        <div class="max-w-sm space-y-3">
            <Select
                bind:value={bindValue}
                items={fruits}
                placeholder="Select a fruit..."
                leadingIcon="lucide:apple"
            />
            <p class="text-sm text-on-surface-variant">
                Value: <span class="font-mono text-on-surface">{bindValue || '(empty)'}</span>
            </p>
        </div>
    </section>

    <!-- Variants × Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variants &times; Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code> to control
            appearance.
        </p>
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant"
                        ></th>
                        {#each colors as color (color)}
                            <th
                                class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr>
                            <td
                                class="px-3 py-2 text-xs font-medium text-on-surface-variant capitalize"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-3 py-2">
                                    <Select {variant} {color} items={fruits} placeholder={color} />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to
            control the dimensions and text size.
        </p>
        <div class="flex flex-wrap items-end gap-4">
            {#each sizes as size (size)}
                <div class="w-48">
                    <Select {size} items={fruits} placeholder="{size} size" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >leadingIcon</code
            > to add an icon before the value.
        </p>
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <Select leadingIcon="lucide:search" items={fruits} placeholder="Search..." />
            </div>
            <div class="w-64">
                <Select leadingIcon="lucide:globe" items={fruits} placeholder="Language" />
            </div>
        </div>
    </section>

    <!-- Items with Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Items with Icons</h2>
        <p class="text-sm text-on-surface-variant">Each item can have its own icon.</p>
        <div class="w-64">
            <Select items={iconItems} placeholder="Choose a page..." />
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >avatar</code
            > on the trigger, or provide avatars on individual items.
        </p>
        <div class="w-64">
            <Select
                avatar={{ src: 'https://i.pravatar.cc/120?img=1', alt: 'User' }}
                items={avatarItems}
                placeholder="Assign to..."
            />
        </div>
    </section>

    <!-- Item Descriptions -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Item Descriptions</h2>
        <p class="text-sm text-on-surface-variant">
            Items can include descriptions shown below the label.
        </p>
        <div class="w-80">
            <Select items={descriptionItems} placeholder="Choose shipping..." />
        </div>
    </section>

    <!-- Grouped Items -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Grouped Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type: 'label'</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type: 'separator'</code
            > to organize items into groups.
        </p>
        <div class="w-64">
            <Select items={groupedItems} placeholder="Pick an item..." />
        </div>
    </section>

    <!-- Disabled Items -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled Items</h2>
        <p class="text-sm text-on-surface-variant">Individual items can be disabled.</p>
        <div class="w-64">
            <Select items={disabledItems} placeholder="Select status..." />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >loading</code
            > to show a loading spinner.
        </p>
        <div class="w-64">
            <Select loading items={fruits} placeholder="Loading..." />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            > to prevent interaction.
        </p>
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <Select disabled items={fruits} placeholder="Disabled" />
            </div>
            <div class="w-64">
                <Select disabled items={fruits} value="apple" />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >highlight</code
            > to emphasize the ring color.
        </p>
        <div class="flex flex-wrap gap-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <Select highlight {color} items={fruits} placeholder={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code
            >, the Select automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="max-w-sm space-y-4">
            <FormField label="Country" description="Select your country of residence." required>
                <Select
                    leadingIcon="lucide:globe"
                    items={[
                        { value: 'us', label: 'United States' },
                        { value: 'uk', label: 'United Kingdom' },
                        { value: 'ca', label: 'Canada' },
                        { value: 'au', label: 'Australia' }
                    ]}
                    placeholder="Choose a country"
                />
            </FormField>

            <FormField label="Role" error="Please select a role.">
                <Select
                    items={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'editor', label: 'Editor' },
                        { value: 'viewer', label: 'Viewer' }
                    ]}
                    placeholder="Choose a role"
                />
            </FormField>
        </div>
    </section>

    <!-- FieldGroup Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FieldGroup Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FieldGroup</code
            >, selects are visually connected.
        </p>
        <FieldGroup orientation="horizontal">
            <Select
                items={[
                    { value: 'mr', label: 'Mr.' },
                    { value: 'mrs', label: 'Mrs.' },
                    { value: 'ms', label: 'Ms.' }
                ]}
                placeholder="Title"
            />
            <Select items={fruits} placeholder="First" />
            <Select items={fruits} placeholder="Last" />
        </FieldGroup>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">User assignment</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <FormField label="Assignee" required>
                        <Select items={avatarItems} placeholder="Select a team member..." />
                    </FormField>

                    <FormField label="Priority">
                        <Select
                            items={[
                                { value: 'low', label: 'Low', icon: 'lucide:arrow-down' },
                                { value: 'medium', label: 'Medium', icon: 'lucide:minus' },
                                { value: 'high', label: 'High', icon: 'lucide:arrow-up' },
                                { value: 'urgent', label: 'Urgent', icon: 'lucide:alert-triangle' }
                            ]}
                            placeholder="Set priority..."
                        />
                    </FormField>
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Shipping options</p>
                <div class="max-w-md">
                    <Select items={descriptionItems} placeholder="Choose shipping method..." />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Grouped categories</p>
                <div class="max-w-sm">
                    <Select
                        items={groupedItems}
                        placeholder="Select category..."
                        leadingIcon="lucide:tag"
                    />
                </div>
            </div>
        </div>
    </section>
</div>
