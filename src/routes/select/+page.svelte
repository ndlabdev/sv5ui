<script lang="ts">
    import { Select, FormField, FieldGroup } from '$lib/index.js'
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
        {
            value: 'standard',
            label: 'Standard',
            description: 'Free shipping, 5-7 business days'
        },
        {
            value: 'express',
            label: 'Express',
            description: 'Paid shipping, 2-3 business days'
        },
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
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Select</h1>
        <p class="text-on-surface-variant">
            A dropdown select component with variants, colors, icons, avatars, and integration with
            FormField and FieldGroup.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <Select items={fruits} placeholder="Pick a fruit..." />
            </div>
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">bind:value</code> for reactive
            two-way data binding.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-3">
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
        </div>
    </section>

    <!-- Variants × Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants &times; Colors</h2>
        <div class="overflow-x-auto rounded-lg bg-surface-container-high p-4">
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
                                    <Select
                                        {variant}
                                        {color}
                                        items={fruits}
                                        placeholder={color}
                                    />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to control
            the dimensions and text size.
        </p>
        <div class="flex flex-wrap items-end gap-4 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="w-48">
                    <Select {size} items={fruits} placeholder="{size} size" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">leadingIcon</code> to add an
            icon before the value.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select leadingIcon="lucide:search" items={fruits} placeholder="Search..." />
            </div>
            <div class="w-64">
                <Select leadingIcon="lucide:globe" items={fruits} placeholder="Language" />
            </div>
        </div>
    </section>

    <!-- Items with Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Items with Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Each item can have its own icon.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select items={iconItems} placeholder="Choose a page..." />
            </div>
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">avatar</code> prop on the
            trigger, or provide avatars on individual items.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select
                    avatar={{ src: 'https://i.pravatar.cc/120?img=1', alt: 'User' }}
                    items={avatarItems}
                    placeholder="Assign to..."
                />
            </div>
        </div>
    </section>

    <!-- Item Descriptions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Item Descriptions</h2>
        <p class="text-sm text-on-surface-variant">
            Items can include descriptions shown below the label.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-80">
                <Select items={descriptionItems} placeholder="Choose shipping..." />
            </div>
        </div>
    </section>

    <!-- Grouped Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Grouped Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">type: 'label'</code> and
            <code class="rounded bg-surface-container-highest px-1">type: 'separator'</code> to organize
            items into groups.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select items={groupedItems} placeholder="Pick an item..." />
            </div>
        </div>
    </section>

    <!-- Disabled Items -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled Items</h2>
        <p class="text-sm text-on-surface-variant">
            Individual items can be disabled.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select items={disabledItems} placeholder="Select status..." />
            </div>
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to show
            a loading spinner.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select loading items={fruits} placeholder="Loading..." />
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Select disabled items={fruits} placeholder="Disabled" />
            </div>
            <div class="w-64">
                <Select disabled items={fruits} value="apple" />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">highlight</code> prop to
            emphasize the ring color.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <Select highlight {color} items={fruits} placeholder={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1">FormField</code>,
            the Select automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-4">
                <FormField
                    label="Country"
                    description="Select your country of residence."
                    required
                >
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
        </div>
    </section>

    <!-- Custom UI -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom UI</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to override
            classes on specific slots.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-72">
                <p class="mb-2 text-xs text-on-surface-variant">Custom trigger & content</p>
                <Select
                    items={fruits}
                    placeholder="Pick a fruit..."
                    leadingIcon="lucide:apple"
                    ui={{
                        base: 'rounded-full shadow-md',
                        content: 'rounded-xl shadow-2xl',
                        item: 'rounded-lg',
                        placeholder: 'italic'
                    }}
                />
            </div>

            <div class="w-72">
                <p class="mb-2 text-xs text-on-surface-variant">Custom leading & trailing icons</p>
                <Select
                    items={iconItems}
                    placeholder="Choose a page..."
                    ui={{
                        leadingIcon: 'text-primary',
                        trailingIcon: 'text-primary',
                        value: 'font-semibold'
                    }}
                />
            </div>

            <div class="w-80">
                <p class="mb-2 text-xs text-on-surface-variant">Custom item label & description</p>
                <Select
                    items={descriptionItems}
                    placeholder="Choose shipping..."
                    ui={{
                        itemLabel: 'font-medium text-primary',
                        itemDescription: 'italic',
                        itemIndicator: 'text-success'
                    }}
                />
            </div>
        </div>
    </section>

    <!-- FieldGroup Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FieldGroup Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1">FieldGroup</code
            >, selects are visually connected.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="space-y-4">
                <div>
                    <p class="mb-2 text-xs text-on-surface-variant">Horizontal</p>
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
                </div>
            </div>
        </div>
    </section>
</div>
