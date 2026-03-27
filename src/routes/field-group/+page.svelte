<script lang="ts">
    import { Button, Input, FieldGroup, Separator } from '$lib/index.js'

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<div class="space-y-8">
    <h1 class="text-2xl font-bold text-on-surface">FieldGroup</h1>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Wrap multiple <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">Button</code>
            within a <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FieldGroup</code> to group them together.
        </p>
        <FieldGroup>
            <Button label="Action" />
            <Button label="Action" />
            <Button label="Action" />
        </FieldGroup>
    </section>

    <!-- Orientation -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">orientation</code> to change the layout direction.
        </p>
        <div class="flex flex-wrap items-start gap-6">
            <div class="space-y-2">
                <p class="text-xs text-on-surface-variant">horizontal (default)</p>
                <FieldGroup orientation="horizontal">
                    <Button label="Left" />
                    <Button label="Center" />
                    <Button label="Right" />
                </FieldGroup>
            </div>
            <div class="space-y-2">
                <p class="text-xs text-on-surface-variant">vertical</p>
                <FieldGroup orientation="vertical">
                    <Button label="Top" />
                    <Button label="Middle" />
                    <Button label="Bottom" />
                </FieldGroup>
            </div>
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to set the size of all child components.
        </p>
        <div class="flex flex-wrap items-end gap-6">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">With Variants</h2>
        <p class="text-sm text-on-surface-variant">
            FieldGroup works with different button variants.
        </p>
        <div class="flex flex-wrap items-center gap-6">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">With Icons</h2>
        <p class="text-sm text-on-surface-variant">Icon-only button groups for toolbar-style layouts.</p>
        <div class="flex flex-wrap items-center gap-6">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Vertical with Icons</h2>
        <div class="flex flex-wrap items-start gap-6">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">With Input</h2>
        <p class="text-sm text-on-surface-variant">
            Combine <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">Input</code> and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">Button</code> in a FieldGroup.
        </p>
        <div class="flex flex-wrap items-start gap-6">
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
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">With Input (Vertical)</h2>
        <div class="flex flex-wrap items-start gap-6">
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

    <!-- Input + Button Sizes -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Input + Button Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            FieldGroup propagates <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">size</code> to all children.
        </p>
        <div class="flex flex-wrap items-end gap-6">
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

    <Separator />

    <!-- Real World Examples -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Real World Examples</h2>

        <div class="space-y-6">
            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Text editor toolbar</p>
                <div class="flex flex-wrap items-center gap-3">
                    <FieldGroup>
                        <Button icon="lucide:bold" variant="outline" color="surface" size="sm" />
                        <Button icon="lucide:italic" variant="outline" color="surface" size="sm" />
                        <Button icon="lucide:underline" variant="outline" color="surface" size="sm" />
                    </FieldGroup>
                    <FieldGroup>
                        <Button icon="lucide:align-left" variant="outline" color="surface" size="sm" />
                        <Button icon="lucide:align-center" variant="outline" color="surface" size="sm" />
                        <Button icon="lucide:align-right" variant="outline" color="surface" size="sm" />
                    </FieldGroup>
                    <FieldGroup>
                        <Button icon="lucide:list" variant="outline" color="surface" size="sm" />
                        <Button icon="lucide:list-ordered" variant="outline" color="surface" size="sm" />
                    </FieldGroup>
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Login form</p>
                <div class="w-80">
                    <FieldGroup orientation="vertical">
                        <Input leadingIcon="lucide:mail" placeholder="Email" type="email" />
                        <Input leadingIcon="lucide:lock" placeholder="Password" type="password" />
                        <Button label="Sign in" variant="solid" color="primary" block />
                    </FieldGroup>
                </div>
            </div>

            <div>
                <p class="mb-2 text-xs text-on-surface-variant">Search with filter</p>
                <FieldGroup>
                    <Button label="All" variant="outline" color="surface" />
                    <Input leadingIcon="lucide:search" placeholder="Search products..." />
                    <Button icon="lucide:sliders-horizontal" variant="outline" color="surface" />
                </FieldGroup>
            </div>
        </div>
    </section>
</div>
