<script lang="ts">
    import { Card, Button, Icon, Avatar } from '$lib/index.js'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Card</h1>
        <p class="text-on-surface-variant">
            Container component for grouping related content with optional header and footer.
        </p>
    </div>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <Card variant="outline">
                {#snippet header()}
                    <h3 class="font-semibold">Outline (Default)</h3>
                {/snippet}
                <p class="text-on-surface-variant">Card with border and background.</p>
            </Card>

            <Card variant="soft">
                {#snippet header()}
                    <h3 class="font-semibold">Soft</h3>
                {/snippet}
                <p class="text-on-surface-variant">Card with subtle background.</p>
            </Card>

            <Card variant="subtle">
                {#snippet header()}
                    <h3 class="font-semibold">Subtle</h3>
                {/snippet}
                <p class="text-on-surface-variant">Card with background and border.</p>
            </Card>

            <Card variant="solid">
                {#snippet header()}
                    <h3 class="font-semibold">Solid</h3>
                {/snippet}
                <p class="opacity-90">Card with inverted colors.</p>
            </Card>
        </div>
    </section>

    <!-- With Header and Footer -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">With Header & Footer</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <Card>
                {#snippet header()}
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold">Card Title</h3>
                        <Button
                            variant="ghost"
                            color="secondary"
                            icon="lucide:more-horizontal"
                            square
                            size="sm"
                        />
                    </div>
                {/snippet}
                <p class="text-on-surface-variant">
                    This is the card body content. You can put any content here.
                </p>
                {#snippet footer()}
                    <div class="flex justify-end gap-2">
                        <Button variant="ghost" color="secondary" label="Cancel" size="sm" />
                        <Button variant="solid" color="primary" label="Save" size="sm" />
                    </div>
                {/snippet}
            </Card>

            <Card variant="soft">
                {#snippet header()}
                    <div class="flex items-center gap-3">
                        <Avatar src="https://i.pravatar.cc/150?img=5" alt="John Doe" size="md" />
                        <div>
                            <h3 class="font-semibold">John Doe</h3>
                            <p class="text-sm text-on-surface-variant">Software Engineer</p>
                        </div>
                    </div>
                {/snippet}
                <p class="text-on-surface-variant">
                    Building awesome things with Svelte and TypeScript.
                </p>
                {#snippet footer()}
                    <div class="flex gap-2">
                        <Button
                            variant="soft"
                            color="primary"
                            leadingIcon="lucide:mail"
                            label="Contact"
                            size="sm"
                        />
                        <Button
                            variant="ghost"
                            color="secondary"
                            leadingIcon="lucide:user-plus"
                            label="Follow"
                            size="sm"
                        />
                    </div>
                {/snippet}
            </Card>
        </div>
    </section>

    <!-- Body Only -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Body Only</h2>
        <div class="grid gap-4 md:grid-cols-3">
            <Card>
                <div class="text-center">
                    <Icon name="lucide:folder" size="32" class="mx-auto text-primary" />
                    <h4 class="mt-2 font-medium">Documents</h4>
                    <p class="text-sm text-on-surface-variant">24 files</p>
                </div>
            </Card>

            <Card variant="soft">
                <div class="text-center">
                    <Icon name="lucide:image" size="32" class="mx-auto text-success" />
                    <h4 class="mt-2 font-medium">Images</h4>
                    <p class="text-sm text-on-surface-variant">128 files</p>
                </div>
            </Card>

            <Card variant="subtle">
                <div class="text-center">
                    <Icon name="lucide:music" size="32" class="mx-auto text-tertiary" />
                    <h4 class="mt-2 font-medium">Music</h4>
                    <p class="text-sm text-on-surface-variant">56 files</p>
                </div>
            </Card>
        </div>
    </section>

    <!-- Custom Styling -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Styling</h2>
        <div class="grid gap-4 md:grid-cols-2">
            <Card class="border-l-4 border-l-primary">
                {#snippet header()}
                    <h3 class="font-semibold text-primary">Accent Border</h3>
                {/snippet}
                <p class="text-on-surface-variant">Card with left accent border.</p>
            </Card>

            <Card
                class="shadow-lg"
                ui={{ header: 'bg-primary text-on-primary', body: 'bg-primary-container' }}
            >
                {#snippet header()}
                    <h3 class="font-semibold">Custom Slots</h3>
                {/snippet}
                <p class="text-on-primary-container">
                    Card with custom header and body styles via ui prop.
                </p>
            </Card>
        </div>
    </section>

    <!-- As Different Element -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Different Element</h2>
        <Card as="article" variant="soft">
            {#snippet header()}
                <h3 class="font-semibold">Article Card</h3>
                <p class="text-sm text-on-surface-variant">Rendered as &lt;article&gt; element</p>
            {/snippet}
            <p class="text-on-surface-variant">
                Use the <code class="rounded bg-surface-container-highest px-1">as</code> prop to render
                as different HTML elements for better semantics.
            </p>
        </Card>
    </section>
</div>
