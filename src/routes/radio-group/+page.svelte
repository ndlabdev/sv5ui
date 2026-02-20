<script lang="ts">
    import { RadioGroup, FormField } from '$lib/index.js'
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
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">RadioGroup</h1>
        <p class="text-on-surface-variant">
            A radio group component for single-selection from a list of options with customizable
            colors, sizes, orientation, and FormField integration.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={fruits} />
        </div>
    </section>

    <!-- Two-way Binding -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Two-way Binding</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">bind:value</code> for reactive
            two-way data binding.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={fruits} bind:value={bindValue} />
            <p class="text-sm text-on-surface-variant">
                Selected: <span class="font-mono text-on-surface">{bindValue || '(none)'}</span>
            </p>
        </div>
    </section>

    <!-- With Label & Description -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Label & Description</h2>
        <p class="text-sm text-on-surface-variant">
            Each item supports <code class="rounded bg-surface-container-highest px-1">label</code>
            and
            <code class="rounded bg-surface-container-highest px-1">description</code> properties.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={plans} />
        </div>
    </section>

    <!-- Legend -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Legend</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">legend</code> prop to add
            a title above the radio group.
        </p>
        <div class="flex flex-col gap-4 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={fruits} legend="Select a fruit" />
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap gap-8 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <RadioGroup {color} value="a" items={[{ value: 'a', label: color }]} />
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to control
            the dimensions.
        </p>
        <div class="flex flex-wrap items-start gap-8 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <RadioGroup {size} value="a" items={[{ value: 'a', label: size }]} />
            {/each}
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">orientation</code> prop to
            control layout direction.
        </p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
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

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <p class="text-sm text-on-surface-variant">Disable the entire group or individual items.</p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to show
            a loading state and disable interaction.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={fruits} loading value="apple" />
        </div>
    </section>

    <!-- Required -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Required</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <RadioGroup items={fruits} required legend="Choose a fruit" />
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            >, the RadioGroup automatically inherits size and error state.
        </p>
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField
                    label="Subscription Plan"
                    description="Choose the plan that works for you."
                >
                    <RadioGroup items={plans} />
                </FormField>
            </div>

            <div class="w-full max-w-sm">
                <FormField label="Preferred Fruit" error="Please select a fruit.">
                    <RadioGroup items={fruits} />
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
        <div class="flex flex-col gap-6 rounded-lg bg-surface-container-high p-4">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom label & description</p>
                <RadioGroup
                    items={plans}
                    value="pro"
                    ui={{
                        label: 'font-bold text-primary',
                        description: 'italic text-tertiary'
                    }}
                />
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Custom spacing</p>
                <RadioGroup
                    items={fruits}
                    ui={{
                        fieldset: 'gap-6',
                        wrapper: 'ms-4'
                    }}
                />
            </div>
        </div>
    </section>
</div>
