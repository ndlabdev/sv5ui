<script lang="ts">
    import { Button, Icon } from '$lib/index.js'

    const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const
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
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Button</h1>
        <p class="text-on-surface-variant">
            Use the Button component to trigger actions or navigate with
            <code class="rounded bg-surface-container-highest px-1">href</code>. Supports multiple
            variants, colors, sizes, icons, avatars, and loading states.
        </p>
    </div>

    <!-- Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">label</code> prop or the default
            slot to set the button text.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button label="Button" />
        </div>
    </section>

    <!-- Variant -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variant</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">variant</code> prop to
            change the visual style. Defaults to
            <code class="rounded bg-surface-container-highest px-1">solid</code>.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each variants as variant (variant)}
                <Button {variant} label={variant[0].toUpperCase() + variant.slice(1)} />
            {/each}
        </div>
    </section>

    <!-- Color -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Color</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">color</code> prop to
            change the color scheme. Defaults to
            <code class="rounded bg-surface-container-highest px-1">primary</code>.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each colors as color (color)}
                <Button {color} label={color[0].toUpperCase() + color.slice(1)} />
            {/each}
        </div>
    </section>

    <!-- Variant x Color Matrix -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variant & Color Matrix</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-outline-variant">
                        <th class="px-2 py-3 text-left text-sm font-medium text-on-surface-variant"
                            >Variant</th
                        >
                        {#each colors as color (color)}
                            <th
                                class="px-2 py-3 text-center text-sm font-medium text-on-surface-variant capitalize"
                                >{color}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each variants as variant (variant)}
                        <tr class="border-b border-outline-variant/50">
                            <td
                                class="px-2 py-3 text-sm font-medium text-on-surface-variant capitalize"
                                >{variant}</td
                            >
                            {#each colors as color (color)}
                                <td class="px-2 py-3 text-center">
                                    <Button {variant} {color} label="Button" />
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to
            change the dimensions. Defaults to
            <code class="rounded bg-surface-container-highest px-1">md</code>.
        </p>
        <div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Button {size} label={size.toUpperCase()} />
            {/each}
        </div>
    </section>

    <!-- Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icon</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">icon</code> prop to
            display an icon in the button. By default the icon is placed on the leading side. Use
            the
            <code class="rounded bg-surface-container-highest px-1">trailing</code> prop to move it to
            the trailing side.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button icon="lucide:rocket" label="Launch" />
            <Button icon="lucide:arrow-right" trailing label="Next" />
        </div>
    </section>

    <!-- Leading & Trailing Icon -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Leading & Trailing Icon</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">leadingIcon</code> and
            <code class="rounded bg-surface-container-highest px-1">trailingIcon</code> to display icons
            on both sides simultaneously.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button leadingIcon="lucide:plus" label="Add Item" />
            <Button
                variant="outline"
                color="secondary"
                trailingIcon="lucide:arrow-right"
                label="Next"
            />
            <Button
                variant="soft"
                color="success"
                leadingIcon="lucide:check"
                trailingIcon="lucide:chevron-down"
                label="Confirm"
            />
        </div>
    </section>

    <!-- Square (Icon Only) -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Square</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">square</code> prop to
            force equal width and height — ideal for icon-only buttons. When only
            <code class="rounded bg-surface-container-highest px-1">icon</code> is provided without
            <code class="rounded bg-surface-container-highest px-1">label</code>, the button is
            automatically treated as icon-only.
        </p>
        <div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Button {size} icon="lucide:plus" square />
            {/each}
            <span class="mx-2 text-on-surface-variant">|</span>
            <Button variant="outline" color="secondary" icon="lucide:settings" square />
            <Button variant="soft" color="success" icon="lucide:check" square />
            <Button variant="subtle" color="warning" icon="lucide:alert-triangle" square />
            <Button variant="ghost" color="error" icon="lucide:x" square />
        </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Avatar</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">avatar</code> prop to
            display an avatar before the label. Takes precedence over
            <code class="rounded bg-surface-container-highest px-1">leadingIcon</code>.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="soft"
                avatar={{ src: 'https://i.pravatar.cc/150?img=1', alt: 'John' }}
                label="John Doe"
            />
            <Button
                variant="outline"
                color="secondary"
                avatar={{ src: 'https://i.pravatar.cc/150?img=2', alt: 'Jane' }}
                label="Jane Smith"
            />
            <Button variant="solid" color="tertiary" avatar={{ alt: 'New' }} label="New User" />
            <Button
                variant="ghost"
                color="secondary"
                avatar={{ src: 'https://i.pravatar.cc/150?img=5', alt: 'User' }}
                label="Profile"
                trailingIcon="lucide:chevron-down"
            />
        </div>

        <p class="text-sm text-on-surface-variant">
            The avatar size automatically adapts to the button size.
        </p>
        <div class="flex flex-wrap items-end gap-3 rounded-lg bg-surface-container-high p-4">
            {#each sizes as size (size)}
                <Button
                    variant="soft"
                    {size}
                    avatar={{ src: 'https://i.pravatar.cc/150?img=3', alt: 'User' }}
                    label={size.toUpperCase()}
                />
            {/each}
        </div>
    </section>

    <!-- Loading -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loading</code> prop to
            show a loading spinner and disable the button. The spinner replaces the leading icon by
            default. Use
            <code class="rounded bg-surface-container-highest px-1">trailing</code> to place it on the
            trailing side.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button loading label="Loading..." />
            <Button variant="outline" color="secondary" loading label="Processing" />
            <Button variant="soft" color="success" loading icon="lucide:loader-2" square />
            <Button variant="solid" color="info" loading trailing label="Uploading" />
        </div>
    </section>

    <!-- Loading Auto -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Loading Auto</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">loadingAuto</code> prop
            to automatically show loading state while the
            <code class="rounded bg-surface-container-highest px-1">onclick</code> handler's Promise is
            pending. The button is disabled until the Promise resolves or rejects.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                loadingAuto
                label="Save (2s)"
                leadingIcon="lucide:save"
                onclick={() => new Promise((r) => setTimeout(r, 2000))}
            />
            <Button
                variant="outline"
                color="secondary"
                loadingAuto
                label="Submit (3s)"
                onclick={() => new Promise((r) => setTimeout(r, 3000))}
            />
            <Button
                variant="soft"
                color="error"
                loadingAuto
                label="Delete (1s)"
                leadingIcon="lucide:trash-2"
                onclick={() => new Promise((r) => setTimeout(r, 1000))}
            />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">disabled</code> prop to disable
            the button and prevent interaction.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#each variants as variant (variant)}
                <Button {variant} disabled label="Disabled" />
            {/each}
        </div>
    </section>

    <!-- Block -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Block</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">block</code> prop to stretch
            the button to fill the full width of its container.
        </p>
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <Button block label="Full Width Button" />
            <Button
                variant="outline"
                color="secondary"
                block
                leadingIcon="lucide:mail"
                trailingIcon="lucide:arrow-right"
                label="Send Email"
            />
        </div>
    </section>

    <!-- As Link -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">As Link</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">href</code> prop to
            render as an anchor element. External URLs are auto-detected with
            <code class="rounded bg-surface-container-highest px-1">target="_blank"</code> and
            <code class="rounded bg-surface-container-highest px-1">rel="noopener noreferrer"</code
            >. Use the
            <code class="rounded bg-surface-container-highest px-1">external</code> prop to force this
            behavior on internal paths.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button href="/link" label="Internal Link" />
            <Button
                variant="outline"
                color="secondary"
                href="https://svelte.dev"
                label="External Link"
                trailingIcon="lucide:external-link"
            />
            <Button
                variant="soft"
                color="info"
                href="/button"
                label="Current Page"
                leadingIcon="lucide:link"
            />
            <Button variant="ghost" color="error" href="/about" disabled label="Disabled Link" />
        </div>
    </section>

    <!-- Type -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Type</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">type</code> prop to set
            the button type attribute. Defaults to
            <code class="rounded bg-surface-container-highest px-1">button</code>. Only applies when
            rendering as a &lt;button&gt; element (no
            <code class="rounded bg-surface-container-highest px-1">href</code>).
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button label="Button (default)" />
            <Button variant="outline" color="success" type="submit" label="Submit" />
            <Button variant="ghost" color="secondary" type="reset" label="Reset" />
        </div>
    </section>

    <!-- Active Color & Variant -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Active Color & Variant</h2>
        <p class="text-sm text-on-surface-variant">
            Use
            <code class="rounded bg-surface-container-highest px-1">activeColor</code> and
            <code class="rounded bg-surface-container-highest px-1">activeVariant</code> to change
            the button appearance when
            <code class="rounded bg-surface-container-highest px-1">active</code> is true. Falls
            back to the default
            <code class="rounded bg-surface-container-highest px-1">color</code> and
            <code class="rounded bg-surface-container-highest px-1">variant</code> when inactive.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="ghost"
                color="secondary"
                active
                activeColor="primary"
                activeVariant="solid"
                label="Dashboard"
                leadingIcon="lucide:home"
            />
            <Button
                variant="ghost"
                color="secondary"
                label="Settings"
                leadingIcon="lucide:settings"
            />
            <Button
                variant="ghost"
                color="secondary"
                active
                activeColor="error"
                activeVariant="soft"
                label="Alerts"
                leadingIcon="lucide:bell"
            />
            <Button variant="ghost" color="secondary" label="Profile" leadingIcon="lucide:user" />
        </div>
    </section>

    <!-- Children Slot -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Children</h2>
        <p class="text-sm text-on-surface-variant">
            Use the default slot to render custom content inside the button instead of the
            <code class="rounded bg-surface-container-highest px-1">label</code> prop.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button>
                <Icon name="lucide:sparkles" size="16" />
                <span>Custom Content</span>
            </Button>
            <Button variant="outline" color="tertiary">
                <span class="font-bold">Bold</span>
                <span class="font-light">& Light</span>
            </Button>
        </div>
    </section>

    <!-- Leading & Trailing Slots -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Leading & Trailing Slots</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="rounded bg-surface-container-highest px-1">leadingSlot</code> and
            <code class="rounded bg-surface-container-highest px-1">trailingSlot</code> for fully
            custom leading/trailing content. They take precedence over
            <code class="rounded bg-surface-container-highest px-1">avatar</code> and icon props.
        </p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            {#snippet statusSlot()}
                <span class="relative flex size-2">
                    <span
                        class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
                    ></span>
                    <span class="relative inline-flex size-2 rounded-full bg-success"></span>
                </span>
            {/snippet}
            <Button variant="outline" color="success" leadingSlot={statusSlot} label="Online" />

            {#snippet badgeSlot()}
                <span
                    class="flex size-5 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error"
                    >3</span
                >
            {/snippet}
            <Button
                variant="ghost"
                color="secondary"
                leadingIcon="lucide:bell"
                trailingSlot={badgeSlot}
                label="Notifications"
            />

            {#snippet kbdSlot()}
                <kbd
                    class="rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 font-mono text-xs text-on-surface-variant"
                    >&#8984;K</kbd
                >
            {/snippet}
            <Button
                variant="outline"
                color="secondary"
                leadingIcon="lucide:search"
                trailingSlot={kbdSlot}
                label="Search"
            />
        </div>
    </section>

    <!-- UI -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">ui</code> prop to
            override classes for specific slots:
            <code class="rounded bg-surface-container-highest px-1">base</code>,
            <code class="rounded bg-surface-container-highest px-1">label</code>,
            <code class="rounded bg-surface-container-highest px-1">leadingIcon</code>,
            <code class="rounded bg-surface-container-highest px-1">trailingIcon</code>,
            <code class="rounded bg-surface-container-highest px-1">leadingAvatar</code>.
        </p>

        <p class="text-xs font-medium text-on-surface-variant uppercase">Base slot</p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button label="Pill Button" class="rounded-full" />
            <Button
                color="tertiary"
                label="With Shadow"
                ui={{ base: 'shadow-lg shadow-tertiary/30' }}
            />
            <Button
                label="Gradient"
                ui={{
                    base: 'bg-linear-to-r from-primary to-tertiary hover:from-primary/90 hover:to-tertiary/90'
                }}
            />
            <Button
                variant="outline"
                color="warning"
                label="Dashed Border"
                ui={{ base: 'border-2 border-dashed ring-0' }}
            />
        </div>

        <p class="text-xs font-medium text-on-surface-variant uppercase">Label slot</p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button label="Uppercase" ui={{ label: 'uppercase tracking-wider' }} />
            <Button
                variant="outline"
                color="secondary"
                label="Italic Text"
                ui={{ label: 'italic' }}
            />
            <Button variant="soft" color="success" label="monospace" ui={{ label: 'font-mono' }} />
            <Button
                variant="ghost"
                label="Gradient Text"
                ui={{
                    label: 'bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent'
                }}
            />
        </div>

        <p class="text-xs font-medium text-on-surface-variant uppercase">Icon slots</p>
        <div class="flex flex-wrap items-center gap-3 rounded-lg bg-surface-container-high p-4">
            <Button
                variant="outline"
                color="secondary"
                leadingIcon="lucide:settings"
                label="Hover Rotate"
                ui={{ leadingIcon: 'transition-transform duration-300 group-hover:rotate-90' }}
                class="group"
            />
            <Button
                variant="soft"
                color="success"
                leadingIcon="lucide:bell"
                label="Bouncing"
                ui={{ leadingIcon: 'animate-bounce' }}
            />
            <Button
                variant="outline"
                color="secondary"
                leadingIcon="lucide:heart"
                label="Colored Icon"
                ui={{ leadingIcon: 'text-error' }}
            />
            <Button
                variant="solid"
                color="info"
                trailingIcon="lucide:arrow-right"
                label="Hover Slide"
                ui={{ trailingIcon: 'transition-transform duration-200 group-hover:translate-x-1' }}
                class="group"
            />
        </div>
    </section>

    <!-- Examples -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Examples</h2>

        <!-- Action Bar -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Action bar</p>
            <div class="flex items-center gap-2">
                <Button leadingIcon="lucide:save" label="Save" />
                <Button variant="outline" color="secondary" label="Cancel" />
                <div class="flex-1"></div>
                <Button variant="ghost" color="error" leadingIcon="lucide:trash-2" label="Delete" />
            </div>
        </div>

        <!-- Navigation -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Navigation</p>
            <div class="flex items-center gap-1">
                <Button
                    variant="ghost"
                    color="secondary"
                    active
                    activeColor="primary"
                    activeVariant="soft"
                    href="/button"
                    label="Dashboard"
                    leadingIcon="lucide:home"
                />
                <Button
                    variant="ghost"
                    color="secondary"
                    href="/link"
                    label="Links"
                    leadingIcon="lucide:link"
                />
                <Button
                    variant="ghost"
                    color="secondary"
                    href="/settings"
                    label="Settings"
                    leadingIcon="lucide:settings"
                />
            </div>
        </div>

        <!-- Social Buttons -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Social buttons</p>
            <div class="flex items-center gap-2">
                <Button variant="soft" color="info" leadingIcon="mdi:twitter" label="Tweet" />
                <Button variant="soft" leadingIcon="mdi:facebook" label="Share" />
                <Button variant="soft" color="tertiary" leadingIcon="mdi:linkedin" label="Post" />
            </div>
        </div>

        <!-- Pagination -->
        <div class="space-y-2 rounded-lg bg-surface-container-high p-4">
            <p class="text-xs font-medium text-on-surface-variant uppercase">Pagination</p>
            <div class="flex items-center gap-1">
                <Button variant="ghost" color="secondary" icon="lucide:chevron-left" square />
                <Button variant="ghost" color="secondary" label="1" />
                <Button variant="solid" label="2" />
                <Button variant="ghost" color="secondary" label="3" />
                <Button variant="ghost" color="secondary" label="..." />
                <Button variant="ghost" color="secondary" label="10" />
                <Button variant="ghost" color="secondary" icon="lucide:chevron-right" square />
            </div>
        </div>
    </section>
</div>
