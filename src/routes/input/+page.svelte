<script lang="ts">
    import { Input, FormField, FieldGroup } from '$lib/index.js'

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
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Input</h1>
        <p class="text-on-surface-variant">
            A form input component with variants, colors, icons, and integration with FormField and
            FieldGroup.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <Input placeholder="Enter text..." />
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
                <Input bind:value={bindValue} leadingIcon="lucide:pencil" placeholder="Type something..." />
                <p class="text-sm text-on-surface-variant">
                    Value: <span class="font-mono text-on-surface">{bindValue || '(empty)'}</span>
                </p>
                <p class="text-sm text-on-surface-variant">
                    Length: <span class="font-mono text-on-surface">{bindValue.length}</span>
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
                                    <Input {variant} {color} placeholder={color} />
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
                    <Input {size} placeholder="{size} size" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">leadingIcon</code> and
            <code class="rounded bg-surface-container-highest px-1">trailingIcon</code> to add icons.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Input leadingIcon="lucide:search" placeholder="Search..." />
            </div>
            <div class="w-64">
                <Input trailingIcon="lucide:eye" placeholder="Password" type="password" />
            </div>
            <div class="w-64">
                <Input
                    leadingIcon="lucide:mail"
                    trailingIcon="lucide:check"
                    placeholder="Email"
                    type="email"
                />
            </div>
        </div>
    </section>

    <!-- Icon prop with trailing -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon (with trailing)</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">icon</code> prop with
            <code class="rounded bg-surface-container-highest px-1">trailing</code> to position it.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Input icon="lucide:user" placeholder="Leading icon" />
            </div>
            <div class="w-64">
                <Input icon="lucide:user" trailing placeholder="Trailing icon" />
            </div>
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">avatar</code> prop to display
            an avatar before the input.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Input
                    avatar={{ src: 'https://i.pravatar.cc/120?img=1', alt: 'User' }}
                    placeholder="With avatar"
                />
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
                <Input loading placeholder="Loading (leading)..." />
            </div>
            <div class="w-64">
                <Input loading trailing placeholder="Loading (trailing)..." />
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            <div class="w-64">
                <Input disabled placeholder="Disabled" />
            </div>
            <div class="w-64">
                <Input disabled value="Disabled with value" />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">highlight</code> prop to emphasize
            the ring color.
        </p>
        <div class="flex flex-wrap gap-4 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <Input highlight {color} placeholder={color} />
                </div>
            {/each}
        </div>
    </section>

    <!-- FormField Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FormField Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            >, the Input automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-4">
                <FormField
                    label="Email"
                    description="We'll use this to send you notifications."
                    required
                >
                    <Input leadingIcon="lucide:mail" placeholder="Enter your email" type="email" />
                </FormField>

                <FormField
                    label="Password"
                    help="Must be at least 8 characters."
                    error="Password is too short."
                >
                    <Input
                        trailingIcon="lucide:eye"
                        placeholder="Enter your password"
                        type="password"
                    />
                </FormField>
            </div>
        </div>
    </section>

    <!-- FieldGroup Integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">FieldGroup Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code class="rounded bg-surface-container-highest px-1"
                >FieldGroup</code
            >, inputs are visually connected.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="space-y-4">
                <div>
                    <p class="mb-2 text-xs text-on-surface-variant">Horizontal</p>
                    <FieldGroup orientation="horizontal">
                        <Input placeholder="First name" />
                        <Input placeholder="Last name" />
                        <Input placeholder="Email" />
                    </FieldGroup>
                </div>

                <div>
                    <p class="mb-2 text-xs text-on-surface-variant">Vertical</p>
                    <FieldGroup orientation="vertical">
                        <Input placeholder="Street address" />
                        <Input placeholder="City" />
                        <Input placeholder="Zip code" />
                    </FieldGroup>
                </div>
            </div>
        </div>
    </section>
</div>
