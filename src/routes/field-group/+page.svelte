<script lang="ts">
    import { Button, Input, FieldGroup } from '$lib/index.js'

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">FieldGroup</h1>
        <p class="text-on-surface-variant">
            Group multiple button-like elements together with seamless borders.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Wrap multiple <code class="rounded bg-surface-container-highest px-1">Button</code>
            within a <code class="rounded bg-surface-container-highest px-1">FieldGroup</code> to group
            them together.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <FieldGroup>
                <Button label="Action" />
                <Button label="Action" />
                <Button label="Action" />
            </FieldGroup>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">orientation</code> prop to
            change the layout direction.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="space-y-2">
                <span class="text-xs text-on-surface-variant">horizontal</span>
                <FieldGroup orientation="horizontal">
                    <Button label="Left" />
                    <Button label="Center" />
                    <Button label="Right" />
                </FieldGroup>
            </div>
            <div class="space-y-2">
                <span class="text-xs text-on-surface-variant">vertical</span>
                <FieldGroup orientation="vertical">
                    <Button label="Top" />
                    <Button label="Middle" />
                    <Button label="Bottom" />
                </FieldGroup>
            </div>
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to set the
            size of all child components.
        </p>
        <div class="flex flex-wrap items-end gap-6 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex flex-col items-center gap-2">
                    <FieldGroup {size}>
                        <Button label="Action" />
                        <Button label="Action" />
                        <Button label="Action" />
                    </FieldGroup>
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Variants</h2>
        <p class="text-sm text-on-surface-variant">
            FieldGroup works with different button variants.
        </p>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <FieldGroup>
                <Button variant="outline" color="surface" label="Left" />
                <Button variant="outline" color="surface" label="Center" />
                <Button variant="outline" color="surface" label="Right" />
            </FieldGroup>

            <FieldGroup>
                <Button variant="soft" label="Left" />
                <Button variant="soft" label="Center" />
                <Button variant="soft" label="Right" />
            </FieldGroup>

            <FieldGroup>
                <Button variant="subtle" label="Left" />
                <Button variant="subtle" label="Center" />
                <Button variant="subtle" label="Right" />
            </FieldGroup>
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Icons</h2>
        <div class="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-high p-4">
            <FieldGroup>
                <Button icon="lucide:align-left" variant="outline" color="surface" />
                <Button icon="lucide:align-center" variant="outline" color="surface" />
                <Button icon="lucide:align-right" variant="outline" color="surface" />
                <Button icon="lucide:align-justify" variant="outline" color="surface" />
            </FieldGroup>

            <FieldGroup>
                <Button icon="lucide:bold" variant="outline" color="surface" />
                <Button icon="lucide:italic" variant="outline" color="surface" />
                <Button icon="lucide:underline" variant="outline" color="surface" />
                <Button icon="lucide:strikethrough" variant="outline" color="surface" />
            </FieldGroup>
        </div>
    </section>

    <!-- Vertical with Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Vertical with Icons</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
            <FieldGroup orientation="vertical">
                <Button icon="lucide:zoom-in" variant="outline" color="surface" />
                <Button icon="lucide:zoom-out" variant="outline" color="surface" />
                <Button icon="lucide:rotate-cw" variant="outline" color="surface" />
            </FieldGroup>

            <FieldGroup orientation="vertical">
                <Button leadingIcon="lucide:home" label="Home" variant="soft" />
                <Button leadingIcon="lucide:settings" label="Settings" variant="soft" />
                <Button leadingIcon="lucide:user" label="Profile" variant="soft" />
            </FieldGroup>
        </div>
    </section>

    <!-- With Input -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Input</h2>
        <p class="text-sm text-on-surface-variant">
            Combine <code class="rounded bg-surface-container-highest px-1">Input</code> and
            <code class="rounded bg-surface-container-highest px-1">Button</code> in a FieldGroup.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
            <FieldGroup>
                <Input leadingIcon="lucide:search" placeholder="Search..." />
                <Button label="Search" />
            </FieldGroup>

            <FieldGroup>
                <Input placeholder="Enter email" type="email" />
                <Button label="Subscribe" variant="solid" color="primary" />
            </FieldGroup>
        </div>
    </section>

    <!-- With Input (Vertical) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Input (Vertical)</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-72">
                <FieldGroup orientation="vertical">
                    <Input placeholder="First name" />
                    <Input placeholder="Last name" />
                    <Input placeholder="Email" type="email" />
                </FieldGroup>
            </div>

            <div class="w-72">
                <FieldGroup orientation="vertical">
                    <Input leadingIcon="lucide:user" placeholder="Username" />
                    <Input leadingIcon="lucide:lock" placeholder="Password" type="password" />
                    <Button label="Sign in" block />
                </FieldGroup>
            </div>
        </div>
    </section>

    <!-- Mixed Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Input + Button Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            FieldGroup propagates the <code class="rounded bg-surface-container-highest px-1"
                >size</code
            >
            prop to all children.
        </p>
        <div class="flex flex-wrap items-end gap-6 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <div class="flex flex-col items-center gap-2">
                    <FieldGroup {size}>
                        <Input placeholder="Search..." />
                        <Button icon="lucide:search" />
                    </FieldGroup>
                    <span class="text-xs text-on-surface-variant">{size}</span>
                </div>
            {/each}
        </div>
    </section>
</div>
