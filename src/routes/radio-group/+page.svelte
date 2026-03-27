<script lang="ts">
    import { RadioGroup, FormField, Separator } from '$lib/index.js'
    import type { RadioGroupItem } from '$lib/index.js'

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

    const fruits: RadioGroupItem[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' }
    ]

    const plans: RadioGroupItem[] = [
        { value: 'free', label: 'Free', description: 'Basic features for personal use.' },
        { value: 'pro', label: 'Pro', description: 'Advanced features for professionals.' },
        { value: 'enterprise', label: 'Enterprise', description: 'Full suite for organizations.' }
    ]

    const partialDisabled: RadioGroupItem[] = [
        { value: 'available', label: 'Available' },
        { value: 'unavailable', label: 'Unavailable', disabled: true },
        { value: 'limited', label: 'Limited' }
    ]

    let bindValue = $state('')
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">RadioGroup</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A radio group component for single selection from a list of options.
        </p>
        <RadioGroup items={fruits} />
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >bind:value</code
            > for reactive two-way data binding.
        </p>
        <div class="flex flex-wrap items-start gap-8">
            <RadioGroup items={fruits} bind:value={bindValue} />
            <p class="text-sm text-on-surface-variant">
                Selected: <span class="font-mono text-on-surface">{bindValue || '(none)'}</span>
            </p>
        </div>
    </section>

    <!-- Label & Description -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Label &amp; Description</h2>
        <p class="text-sm text-on-surface-variant">
            Each item supports <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">label</code
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >description</code
            > properties.
        </p>
        <RadioGroup items={plans} />
    </section>

    <!-- Legend -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Legend</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >legend</code
            >
            to add a title above the radio group. Use
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">required</code> to
            show an asterisk.
        </p>
        <div class="flex flex-wrap gap-8">
            <RadioGroup items={fruits} legend="Select a fruit" />
            <RadioGroup items={fruits} legend="Select a fruit" required />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            > to control the checked indicator color.
        </p>
        <div class="flex flex-wrap gap-8">
            {#each colors as color (color)}
                <RadioGroup {color} value="a" items={[{ value: 'a', label: color }]} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to
            control the dimensions.
        </p>
        <div class="flex flex-wrap items-start gap-8">
            {#each sizes as size (size)}
                <RadioGroup {size} value="a" items={[{ value: 'a', label: size }]} />
            {/each}
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >orientation</code
            > to control layout direction.
        </p>
        <div class="flex flex-col gap-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Vertical (default)</p>
                <RadioGroup items={fruits} orientation="vertical" />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Horizontal</p>
                <RadioGroup items={fruits} orientation="horizontal" />
            </div>
        </div>
    </section>

    <!-- Variant -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Variant</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >variant="card"</code
            > to display each item as a bordered card. The border highlights when selected.
        </p>
        <div class="flex flex-col gap-6">
            <div class="max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Vertical cards</p>
                <RadioGroup variant="card" value="pro" items={plans} color="primary" />
            </div>
            <div class="max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">Horizontal cards</p>
                <RadioGroup
                    variant="card"
                    value="apple"
                    items={fruits}
                    orientation="horizontal"
                    color="success"
                />
            </div>
        </div>
    </section>

    <!-- Indicator -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Indicator Position</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >indicator</code
            >
            to control where the radio appears:
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">start</code>,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">end</code>, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">hidden</code>.
        </p>
        <div class="flex flex-wrap gap-8">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Start (default)</p>
                <RadioGroup indicator="start" items={fruits} value="apple" />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">End</p>
                <RadioGroup indicator="end" items={fruits} value="banana" />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Hidden</p>
                <RadioGroup indicator="hidden" items={fruits} value="orange" />
            </div>
        </div>
        <div class="max-w-sm">
            <p class="mb-2 text-xs text-on-surface-variant">Card + end indicator</p>
            <RadioGroup variant="card" indicator="end" items={plans} value="pro" color="primary" />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >disabled</code
            >
            to disable the entire group or individual items via
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >item.disabled</code
            >.
        </p>
        <div class="flex flex-wrap gap-8">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Entire group disabled</p>
                <RadioGroup items={fruits} disabled value="apple" />
            </div>
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Individual item disabled</p>
                <RadioGroup items={partialDisabled} />
            </div>
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >loading</code
            > to show a spinner and disable interaction.
        </p>
        <RadioGroup items={fruits} loading value="apple" />
    </section>

    <!-- Custom Slots -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Custom Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >legendSlot</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">labelSlot</code
            >, and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >descriptionSlot</code
            > for fully custom content.
        </p>
        <div class="flex flex-col gap-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom legend</p>
                <RadioGroup items={fruits} value="apple">
                    {#snippet legendSlot()}
                        <span
                            class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-on-surface"
                        >
                            <span class="inline-block size-2 rounded-full bg-primary"></span>
                            Pick your favorite
                        </span>
                    {/snippet}
                </RadioGroup>
            </div>

            <div class="max-w-sm">
                <p class="mb-2 text-xs text-on-surface-variant">
                    Custom label + description per item
                </p>
                <RadioGroup items={plans} value="pro">
                    {#snippet labelSlot({ item })}
                        <span class="flex items-center gap-2 text-sm font-medium text-on-surface">
                            {item.label}
                            {#if item.value === 'pro'}
                                <span
                                    class="rounded bg-primary-container px-1.5 py-0.5 text-[10px] font-bold text-on-primary-container"
                                    >POPULAR</span
                                >
                            {/if}
                        </span>
                    {/snippet}
                    {#snippet descriptionSlot({ item })}
                        <span class="text-xs text-on-surface-variant">{item.description}</span>
                    {/snippet}
                </RadioGroup>
            </div>
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code
            >, the RadioGroup automatically inherits size and error state.
        </p>
        <div class="max-w-sm space-y-4">
            <FormField label="Subscription Plan" description="Choose the plan that works for you.">
                <RadioGroup items={plans} />
            </FormField>
            <FormField label="Preferred Fruit" error="Please select a fruit.">
                <RadioGroup items={fruits} />
            </FormField>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">
                    Pricing plan selection (card + end)
                </p>
                <div class="max-w-sm space-y-2">
                    <RadioGroup
                        variant="card"
                        indicator="end"
                        value="pro"
                        color="primary"
                        items={[
                            {
                                value: 'starter',
                                label: 'Starter',
                                description: '$9/mo · Up to 3 projects'
                            },
                            {
                                value: 'pro',
                                label: 'Pro',
                                description: '$29/mo · Unlimited projects'
                            },
                            {
                                value: 'enterprise',
                                label: 'Enterprise',
                                description: 'Custom pricing · SSO + security'
                            }
                        ]}
                    />
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">
                    Notification frequency (horizontal + card)
                </p>
                <RadioGroup
                    variant="card"
                    orientation="horizontal"
                    value="daily"
                    color="secondary"
                    items={[
                        { value: 'realtime', label: 'Real-time' },
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'never', label: 'Never' }
                    ]}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">
                    Theme selector (hidden indicator + custom label)
                </p>
                <RadioGroup
                    indicator="hidden"
                    orientation="horizontal"
                    value="system"
                    items={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'system', label: 'System' }
                    ]}
                >
                    {#snippet labelSlot({ item })}
                        <span class="text-sm text-on-surface">{item.label}</span>
                    {/snippet}
                </RadioGroup>
            </div>
        </div>
    </section>
</div>
