<script lang="ts">
    import { Input, FormField, FieldGroup, Separator } from '$lib/index.js'

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
    <h1 class="text-2xl font-bold text-on-surface">Input</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            A form input component with variants, colors, icons, and integration with FormField and
            FieldGroup.
        </p>
        <div class="max-w-sm">
            <Input placeholder="Enter text..." />
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
            <Input
                bind:value={bindValue}
                leadingIcon="lucide:pencil"
                placeholder="Type something..."
            />
            <p class="text-sm text-on-surface-variant">
                Value: <span class="font-mono text-on-surface">{bindValue || '(empty)'}</span>
            </p>
            <p class="text-sm text-on-surface-variant">
                Length: <span class="font-mono text-on-surface">{bindValue.length}</span>
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
                                    <Input {variant} {color} placeholder={color} />
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
                    <Input {size} placeholder="{size} size" />
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
            >
            and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >trailingIcon</code
            > to add icons.
        </p>
        <div class="flex flex-wrap gap-4">
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

    <!-- Icon (with trailing) -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Icon (with trailing)</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            with
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">trailing</code> to
            position it.
        </p>
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <Input icon="lucide:user" placeholder="Leading icon" />
            </div>
            <div class="w-64">
                <Input icon="lucide:user" trailing placeholder="Trailing icon" />
            </div>
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >avatar</code
            > to display an avatar before the input.
        </p>
        <div class="w-64">
            <Input
                avatar={{ src: 'https://i.pravatar.cc/120?img=1', alt: 'User' }}
                placeholder="With avatar"
            />
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
        <div class="flex flex-wrap gap-4">
            <div class="w-64">
                <Input loading placeholder="Loading (leading)..." />
            </div>
            <div class="w-64">
                <Input loading trailing placeholder="Loading (trailing)..." />
            </div>
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
                <Input disabled placeholder="Disabled" />
            </div>
            <div class="w-64">
                <Input disabled value="Disabled with value" />
            </div>
        </div>
    </section>

    <!-- Highlight -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Highlight</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >highlight</code
            > to emphasize the ring color like a focus state.
        </p>
        <div class="flex flex-wrap gap-4">
            {#each colors as color (color)}
                <div class="w-48">
                    <Input highlight {color} placeholder={color} />
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
            >, the Input automatically inherits size, error state, and accessibility attributes.
        </p>
        <div class="max-w-sm space-y-4">
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
    </section>

    <!-- FieldGroup Integration -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">FieldGroup Integration</h2>
        <p class="text-sm text-on-surface-variant">
            When used inside a <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FieldGroup</code
            >, inputs are visually connected.
        </p>
        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">horizontal (default)</p>
                <FieldGroup orientation="horizontal">
                    <Input placeholder="First name" />
                    <Input placeholder="Last name" />
                    <Input placeholder="Email" />
                </FieldGroup>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">vertical</p>
                <div class="max-w-sm">
                    <FieldGroup orientation="vertical">
                        <Input placeholder="Street address" />
                        <Input placeholder="City" />
                        <Input placeholder="Zip code" />
                    </FieldGroup>
                </div>
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Search bar</p>
                <div class="max-w-md">
                    <FieldGroup>
                        <Input leadingIcon="lucide:search" placeholder="Search products..." />
                        <Input placeholder="Location" leadingIcon="lucide:map-pin" />
                    </FieldGroup>
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Login form</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <FormField label="Email" required>
                        <Input
                            leadingIcon="lucide:mail"
                            placeholder="john@example.com"
                            type="email"
                        />
                    </FormField>

                    <FormField label="Password" required help="Must be at least 8 characters.">
                        <Input
                            leadingIcon="lucide:lock"
                            placeholder="Enter your password"
                            type="password"
                        />
                    </FormField>
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Validation states</p>
                <div
                    class="max-w-sm space-y-4 rounded-lg border border-outline-variant bg-surface-container-low p-4"
                >
                    <FormField label="Username" error="Username is already taken.">
                        <Input value="admin" color="error" leadingIcon="lucide:user" />
                    </FormField>

                    <FormField label="Email" help="Looks good!">
                        <Input
                            type="email"
                            value="valid@example.com"
                            color="success"
                            leadingIcon="lucide:mail"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    </section>
</div>
