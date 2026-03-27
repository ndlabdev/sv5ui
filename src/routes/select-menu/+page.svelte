<script lang="ts">
    import { SelectMenu, FormField, FieldGroup, Separator, Icon } from '$lib/index.js'
    import type { SelectMenuItem, SelectMenuItemType } from '$lib/index.js'

    const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
    const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'surface'] as const
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    let bindValue = $state('')

    const fruits: SelectMenuItem[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'grape', label: 'Grape' },
        { value: 'orange', label: 'Orange' }
    ]

    const iconItems: SelectMenuItem[] = [
        { value: 'home', label: 'Home', icon: 'lucide:home' },
        { value: 'settings', label: 'Settings', icon: 'lucide:settings' },
        { value: 'profile', label: 'Profile', icon: 'lucide:user' },
        { value: 'notifications', label: 'Notifications', icon: 'lucide:bell' }
    ]

    const avatarItems: SelectMenuItem[] = [
        { value: 'alice', label: 'Alice', avatar: { src: 'https://i.pravatar.cc/120?img=1', alt: 'Alice' } },
        { value: 'bob', label: 'Bob', avatar: { src: 'https://i.pravatar.cc/120?img=3', alt: 'Bob' } },
        { value: 'charlie', label: 'Charlie', avatar: { src: 'https://i.pravatar.cc/120?img=5', alt: 'Charlie' } }
    ]

    const descriptionItems: SelectMenuItem[] = [
        { value: 'standard', label: 'Standard', description: 'Free shipping, 5-7 business days' },
        { value: 'express', label: 'Express', description: 'Paid shipping, 2-3 business days' },
        { value: 'overnight', label: 'Overnight', description: 'Premium shipping, next business day' }
    ]

    const groupedItems: SelectMenuItemType[] = [
        { type: 'label', label: 'Fruits' },
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { type: 'separator' },
        { type: 'label', label: 'Vegetables' },
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' }
    ]

    const disabledItems: SelectMenuItem[] = [
        { value: 'active', label: 'Active' },
        { value: 'disabled', label: 'Disabled', disabled: true },
        { value: 'pending', label: 'Pending' }
    ]

    const manyItems: SelectMenuItem[] = Array.from({ length: 50 }, (_, i) => ({
        value: `item-${i + 1}`,
        label: `Item ${i + 1}`
    }))

    type StatusItem = SelectMenuItem & { status?: 'active' | 'idle' | 'offline' }
    const statusItems: StatusItem[] = [
        { value: 'alice', label: 'Alice Johnson', description: 'Frontend Engineer', status: 'active', avatar: { src: 'https://i.pravatar.cc/120?img=1', alt: 'Alice' } },
        { value: 'bob', label: 'Bob Smith', description: 'Backend Engineer', status: 'idle', avatar: { src: 'https://i.pravatar.cc/120?img=3', alt: 'Bob' } },
        { value: 'charlie', label: 'Charlie Lee', description: 'Designer', status: 'offline', avatar: { src: 'https://i.pravatar.cc/120?img=5', alt: 'Charlie' } },
        { value: 'diana', label: 'Diana Prince', description: 'Product Manager', status: 'active', avatar: { src: 'https://i.pravatar.cc/120?img=9', alt: 'Diana' } }
    ]

    const statusColor: Record<string, string> = {
        active: 'bg-success',
        idle: 'bg-warning',
        offline: 'bg-on-surface-variant/40'
    }

    const planItems: SelectMenuItem[] = [
        { value: 'free', label: 'Free', description: 'Up to 3 projects' },
        { value: 'pro', label: 'Pro', description: 'Unlimited projects' },
        { value: 'team', label: 'Team', description: 'Collaboration features' },
        { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing' }
    ]

    const planBadge: Record<string, { label: string; class: string }> = {
        free: { label: 'FREE', class: 'bg-surface-container text-on-surface-variant' },
        pro: { label: 'PRO', class: 'bg-primary-container text-on-primary-container' },
        team: { label: 'TEAM', class: 'bg-secondary-container text-on-secondary-container' },
        enterprise: { label: 'ENT', class: 'bg-tertiary-container text-on-tertiary-container' }
    }
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">SelectMenu</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A searchable select dropdown built on bits-ui Combobox. Supports filtering, icons, avatars, groups, and empty states.
        </p>
        <div class="max-w-sm">
            <SelectMenu items={fruits} placeholder="Pick a fruit..." />
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">bind:value</code> for reactive two-way data binding.
        </p>
        <div class="max-w-sm space-y-3">
            <SelectMenu bind:value={bindValue} items={fruits} placeholder="Select a fruit..." leadingIcon="lucide:apple" />
            <p class="text-sm text-on-surface-variant">
                Value: <span class="font-mono text-on-surface">{bindValue || '(empty)'}</span>
            </p>
        </div>
    </section>

    <!-- Variants × Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variants &times; Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">variant</code> and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code> to control appearance.
        </p>
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant"></th>
                        {#each colors as color (color)}
                            <th class="px-3 py-2 text-left text-xs font-medium text-on-surface-variant capitalize">{color}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr>
                            <td class="px-3 py-2 text-xs font-medium text-on-surface-variant capitalize">{variant}</td>
                            {#each colors as color (color)}
                                <td class="px-3 py-2">
                                    <SelectMenu {variant} {color} items={fruits} placeholder={color} />
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
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to control the dimensions and text size.
        </p>
        <div class="flex flex-wrap items-end gap-4">
            {#each sizes as size (size)}
                <div class="w-48">
                    <SelectMenu {size} items={fruits} placeholder="{size} size" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">leadingIcon</code> to add an icon before the value.
        </p>
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <SelectMenu leadingIcon="lucide:search" items={fruits} placeholder="Search..." />
            </div>
            <div class="w-64">
                <SelectMenu leadingIcon="lucide:globe" items={fruits} placeholder="Language" />
            </div>
        </div>
    </section>

    <!-- Items with Icons -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Items with Icons</h2>
        <p class="text-sm text-on-surface-variant">Each item can have its own icon.</p>
        <div class="w-64">
            <SelectMenu items={iconItems} placeholder="Choose a page..." />
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">avatar</code> on the trigger, or provide avatars on individual items.
        </p>
        <div class="w-64">
            <SelectMenu
                avatar={{ src: 'https://i.pravatar.cc/120?img=1', alt: 'User' }}
                items={avatarItems}
                placeholder="Assign to..."
            />
        </div>
    </section>

    <!-- Item Descriptions -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Item Descriptions</h2>
        <p class="text-sm text-on-surface-variant">Items can include descriptions shown below the label.</p>
        <div class="w-80">
            <SelectMenu items={descriptionItems} placeholder="Choose shipping..." />
        </div>
    </section>

    <!-- Grouped Items -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Grouped Items</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">type: 'label'</code> and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">type: 'separator'</code> to organize items into groups.
        </p>
        <div class="w-64">
            <SelectMenu items={groupedItems} placeholder="Pick an item..." />
        </div>
    </section>

    <!-- Disabled Items -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled Items</h2>
        <p class="text-sm text-on-surface-variant">Individual items can be disabled.</p>
        <div class="w-64">
            <SelectMenu items={disabledItems} placeholder="Select status..." />
        </div>
    </section>

    <!-- Filtering -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Filtering</h2>
        <p class="text-sm text-on-surface-variant">
            The dropdown includes a search input. Items are filtered client-side by
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">filterFields</code> (defaults to label and value).
        </p>
        <div class="w-64">
            <SelectMenu items={manyItems} placeholder="Search 50 items..." />
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">loading</code> to show a loading spinner.
        </p>
        <div class="w-64">
            <SelectMenu loading items={fruits} placeholder="Loading..." />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">disabled</code> to prevent interaction.
        </p>
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <SelectMenu disabled items={fruits} placeholder="Disabled" />
            </div>
            <div class="w-64">
                <SelectMenu disabled items={fruits} value="apple" />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">highlight</code> to emphasize the ring color.
        </p>
        <div class="flex flex-wrap gap-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <SelectMenu highlight {color} items={fruits} placeholder={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code>, the SelectMenu automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="max-w-sm space-y-4">
            <FormField label="Country" description="Select your country of residence." required>
                <SelectMenu
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
                <SelectMenu
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
            When used inside a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FieldGroup</code>, select menus are visually connected.
        </p>
        <FieldGroup orientation="horizontal">
            <SelectMenu
                items={[
                    { value: 'mr', label: 'Mr.' },
                    { value: 'mrs', label: 'Mrs.' },
                    { value: 'ms', label: 'Ms.' }
                ]}
                placeholder="Title"
            />
            <SelectMenu items={fruits} placeholder="First" />
            <SelectMenu items={fruits} placeholder="Last" />
        </FieldGroup>
    </section>

    <!-- Custom Slots -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Slots</h2>

        <!-- itemLeading slot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemLeading</code>
                — Custom leading per item (online status dot)
            </p>
            <div class="w-72">
                <SelectMenu items={statusItems} placeholder="Assign to...">
                    {#snippet itemLeading({ item })}
                        {@const s = item as StatusItem}
                        <div class="relative shrink-0">
                            <img
                                src={s.avatar?.src}
                                alt={s.avatar?.alt ?? ''}
                                class="size-7 rounded-full object-cover"
                            />
                            <span class="absolute right-0 bottom-0 size-2 rounded-full ring-1 ring-surface-container-low {statusColor[s.status ?? 'offline']}"></span>
                        </div>
                    {/snippet}
                </SelectMenu>
            </div>
        </div>

        <!-- itemLabel slot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemLabel</code>
                — Custom label with badge
            </p>
            <div class="w-64">
                <SelectMenu items={planItems} placeholder="Choose a plan...">
                    {#snippet itemLabel({ item })}
                        <span class="flex items-center gap-2">
                            <span class="flex-1 text-sm text-on-surface">{item.label}</span>
                            <span class="rounded px-1.5 py-0.5 text-[10px] font-bold {planBadge[item.value]?.class}">
                                {planBadge[item.value]?.label}
                            </span>
                        </span>
                        {#if item.description}
                            <span class="text-xs text-on-surface-variant">{item.description}</span>
                        {/if}
                    {/snippet}
                </SelectMenu>
            </div>
        </div>

        <!-- itemTrailing slot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">itemTrailing</code>
                — Custom trailing (keyboard shortcut)
            </p>
            <div class="w-64">
                <SelectMenu
                    items={[
                        { value: 'cut', label: 'Cut' },
                        { value: 'copy', label: 'Copy' },
                        { value: 'paste', label: 'Paste' },
                        { value: 'select-all', label: 'Select All' }
                    ]}
                    placeholder="Choose action..."
                >
                    {#snippet itemTrailing({ item, selected })}
                        {#if selected}
                            <Icon name="lucide:check" class="size-4 text-primary" />
                        {:else}
                            <span class="text-xs text-on-surface-variant/60">
                                {#if item.value === 'cut'}⌘X
                                {:else if item.value === 'copy'}⌘C
                                {:else if item.value === 'paste'}⌘V
                                {:else if item.value === 'select-all'}⌘A{/if}
                            </span>
                        {/if}
                    {/snippet}
                </SelectMenu>
            </div>
        </div>

        <!-- item slot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">item</code>
                — Fully custom item rendering
            </p>
            <div class="w-80">
                <SelectMenu items={statusItems} placeholder="Select a team member...">
                    {#snippet item({ item, selected })}
                        {@const s = item as StatusItem}
                        <div class="flex items-center gap-3 rounded-md px-2 py-1.5 {selected ? 'bg-primary-container' : 'hover:bg-surface-container-high'} cursor-pointer transition-colors">
                            <div class="relative shrink-0">
                                <img src={s.avatar?.src} alt={s.avatar?.alt ?? ''} class="size-8 rounded-full object-cover" />
                                <span class="absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-surface-container-low {statusColor[s.status ?? 'offline']}"></span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium {selected ? 'text-on-primary-container' : 'text-on-surface'}">{item.label}</p>
                                <p class="truncate text-xs {selected ? 'text-on-primary-container/70' : 'text-on-surface-variant'}">{item.description}</p>
                            </div>
                            <span class="shrink-0 capitalize text-xs {statusColor[s.status ?? 'offline'].replace('bg-', 'text-').replace('bg-on-', 'text-on-')} {s.status === 'offline' ? 'text-on-surface-variant/40' : ''}">
                                {s.status}
                            </span>
                        </div>
                    {/snippet}
                </SelectMenu>
            </div>
        </div>

        <!-- empty slot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">empty</code>
                — Custom empty state
            </p>
            <div class="w-64">
                <SelectMenu items={fruits} placeholder="Search (try 'xyz')...">
                    {#snippet empty({ searchTerm })}
                        <div class="flex flex-col items-center gap-1 py-6 text-center">
                            <Icon name="lucide:search-x" class="size-8 text-on-surface-variant/40" />
                            <p class="text-sm font-medium text-on-surface">No match</p>
                            <p class="text-xs text-on-surface-variant">
                                Nothing found for <span class="font-mono text-primary">"{searchTerm}"</span>
                            </p>
                        </div>
                    {/snippet}
                </SelectMenu>
            </div>
        </div>

        <!-- leadingSlot + trailingSlot -->
        <div class="space-y-2">
            <p class="text-sm font-medium text-on-surface-variant">
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">leadingSlot</code>
                /
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">trailingSlot</code>
                — Custom trigger leading & trailing
            </p>
            <div class="w-72">
                <SelectMenu items={fruits} placeholder="Pick a fruit...">
                    {#snippet leadingSlot()}
                        <span class="text-base">🍎</span>
                    {/snippet}
                    {#snippet trailingSlot()}
                        <Icon name="lucide:chevrons-up-down" class="size-4 text-on-surface-variant/60" />
                    {/snippet}
                </SelectMenu>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">User assignment</p>
                <div class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                    <FormField label="Assignee" required>
                        <SelectMenu items={avatarItems} placeholder="Select a team member..." />
                    </FormField>

                    <FormField label="Priority">
                        <SelectMenu
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
                    <SelectMenu items={descriptionItems} placeholder="Choose shipping method..." />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Large list with search</p>
                <div class="max-w-sm">
                    <SelectMenu items={manyItems} placeholder="Search from 50 items..." leadingIcon="lucide:search" />
                </div>
            </div>
        </div>
    </section>
</div>
