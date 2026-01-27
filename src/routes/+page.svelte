<script>
	import { Icon, Button } from "$lib/index.js";
	import { mode, setMode } from "mode-watcher";

    const currentMode = $derived(mode.current ?? 'light')

    let loading = $state(false)
</script>

<div class="p-8 space-y-12">
    <!-- Dark Mode Toggle -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Dark Mode (mode-watcher)</h2>
        <p class="text-sm text-on-surface-variant">
            Current mode: <strong class="text-on-surface">{currentMode}</strong>
        </p>
        <div class="flex gap-2">
            <Button variant="outline" onclick={() => setMode('light')} iconLeading="lucide:sun">Light</Button>
            <Button variant="outline" onclick={() => setMode('dark')} iconLeading="lucide:moon">Dark</Button>
        </div>
    </section>

    <hr class="border-outline-variant" />

    <!-- ==================== BUTTON COMPONENT DEMO ==================== -->
    <h1 class="text-2xl font-bold text-on-surface">Button Component Demo</h1>

    <!-- Variants -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Variants</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="solid">Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="elevated">Elevated</Button>
            <Button variant="link">Link</Button>
        </div>
    </section>

    <!-- Ghost Variant -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Ghost Variant</h2>
        <p class="text-sm text-on-surface-variant">Subtle hover effect, perfect for toolbars and secondary actions.</p>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="ghost" color="primary">Primary</Button>
            <Button variant="ghost" color="secondary">Secondary</Button>
            <Button variant="ghost" color="error">Error</Button>
            <Button variant="ghost" color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Icon Buttons -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Icon Buttons</h2>
        <p class="text-sm text-on-surface-variant">Square buttons for icon-only actions.</p>
        <div class="flex flex-wrap items-center gap-3">
            <Button size="icon-sm" variant="ghost" color="neutral" iconLeading="lucide:heart"></Button>
            <Button size="icon" variant="ghost" color="neutral" iconLeading="lucide:bookmark"></Button>
            <Button size="icon-lg" variant="ghost" color="neutral" iconLeading="lucide:share"></Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button size="icon" variant="solid" iconLeading="lucide:plus"></Button>
            <Button size="icon" variant="soft" iconLeading="lucide:edit"></Button>
            <Button size="icon" variant="outline" iconLeading="lucide:trash-2" color="error"></Button>
            <Button size="icon" variant="ghost" iconLeading="lucide:more-horizontal" color="neutral"></Button>
        </div>
    </section>

    <!-- Link Variant -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Link Variant</h2>

        <!-- All colors -->
        <div class="flex flex-wrap items-center gap-4">
            <Button variant="link" color="primary">Primary</Button>
            <Button variant="link" color="secondary">Secondary</Button>
            <Button variant="link" color="tertiary">Tertiary</Button>
            <Button variant="link" color="error">Error</Button>
            <Button variant="link" color="success">Success</Button>
            <Button variant="link" color="warning">Warning</Button>
            <Button variant="link" color="neutral">Neutral</Button>
        </div>

        <!-- Inline usage -->
        <p class="text-on-surface-variant">
            This is a paragraph with <Button variant="link">inline link</Button> that
            blends naturally with text. You can also have
            <Button variant="link" color="error">error links</Button> or
            <Button variant="link" color="success">success links</Button> inline.
        </p>

        <!-- With icons -->
        <div class="flex flex-wrap items-center gap-4">
            <Button variant="link" iconLeading="lucide:external-link">External Link</Button>
            <Button variant="link" iconTrailing="lucide:arrow-right">Learn More</Button>
            <Button variant="link" color="error" iconLeading="lucide:trash-2">Delete Account</Button>
        </div>

        <!-- In context -->
        <div class="p-4 rounded-lg bg-surface-container-low max-w-md text-sm text-on-surface-variant">
            By clicking "Sign Up", you agree to our
            <Button variant="link" size="sm">Terms of Service</Button> and
            <Button variant="link" size="sm">Privacy Policy</Button>.
        </div>
    </section>

    <!-- Semantic Colors - Solid -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors (Solid)</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="tertiary">Tertiary</Button>
            <Button color="error">Error</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Semantic Colors - Soft -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors (Soft)</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="soft" color="primary">Primary</Button>
            <Button variant="soft" color="secondary">Secondary</Button>
            <Button variant="soft" color="tertiary">Tertiary</Button>
            <Button variant="soft" color="error">Error</Button>
            <Button variant="soft" color="success">Success</Button>
            <Button variant="soft" color="warning">Warning</Button>
            <Button variant="soft" color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Semantic Colors - Outline -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors (Outline)</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" color="primary">Primary</Button>
            <Button variant="outline" color="secondary">Secondary</Button>
            <Button variant="outline" color="tertiary">Tertiary</Button>
            <Button variant="outline" color="error">Error</Button>
            <Button variant="outline" color="success">Success</Button>
            <Button variant="outline" color="warning">Warning</Button>
            <Button variant="outline" color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Semantic Colors - Ghost -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors (Ghost)</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="ghost" color="primary">Primary</Button>
            <Button variant="ghost" color="secondary">Secondary</Button>
            <Button variant="ghost" color="tertiary">Tertiary</Button>
            <Button variant="ghost" color="error">Error</Button>
            <Button variant="ghost" color="success">Success</Button>
            <Button variant="ghost" color="warning">Warning</Button>
            <Button variant="ghost" color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Semantic Colors - Elevated -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors (Elevated)</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="elevated" color="primary">Primary</Button>
            <Button variant="elevated" color="secondary">Secondary</Button>
            <Button variant="elevated" color="tertiary">Tertiary</Button>
            <Button variant="elevated" color="error">Error</Button>
            <Button variant="elevated" color="success">Success</Button>
            <Button variant="elevated" color="warning">Warning</Button>
            <Button variant="elevated" color="neutral">Neutral</Button>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="xs">Extra Small</Button>
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="outline" size="md">Medium</Button>
            <Button variant="outline" size="lg">Large</Button>
            <Button variant="outline" size="xl">Extra Large</Button>
        </div>
    </section>

    <!-- With Icons -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">With Icons</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button iconLeading="lucide:plus">Add Item</Button>
            <Button iconTrailing="lucide:arrow-right">Continue</Button>
            <Button iconLeading="lucide:download" iconTrailing="lucide:chevron-down">Download</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="soft" color="success" iconLeading="lucide:check">Confirm</Button>
            <Button variant="outline" color="error" iconLeading="lucide:trash-2">Delete</Button>
            <Button variant="ghost" iconLeading="lucide:edit">Edit</Button>
        </div>
    </section>

    <!-- States -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">States</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline">Normal</Button>
            <Button variant="outline" disabled>Disabled</Button>
            <Button variant="outline" loading>Loading</Button>
        </div>
        <div class="flex items-center gap-3">
            <Button
                loading={loading}
                onclick={() => { loading = true; setTimeout(() => loading = false, 2000) }}
                iconLeading="lucide:send"
            >
                Click to Load
            </Button>
            <span class="text-sm text-on-surface-variant">Click to see loading state</span>
        </div>
    </section>

    <!-- Full Width -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Full Width</h2>
        <div class="max-w-md space-y-3">
            <Button fullWidth iconLeading="lucide:log-in">Sign In</Button>
            <Button fullWidth variant="outline">Create Account</Button>
            <Button fullWidth variant="ghost">Forgot Password?</Button>
        </div>
    </section>

    <!-- Real-world Examples -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Real-world Examples</h2>

        <!-- Form Actions -->
        <div class="space-y-2">
            <h3 class="text-sm font-medium text-on-surface-variant">Form Actions</h3>
            <div class="flex gap-3 justify-end max-w-sm">
                <Button variant="ghost" color="neutral">Cancel</Button>
                <Button variant="outline">Save Draft</Button>
                <Button>Submit</Button>
            </div>
        </div>

        <!-- Card Actions -->
        <div class="p-4 rounded-xl bg-surface-container-low max-w-sm">
            <h3 class="font-medium text-on-surface mb-2">Card Title</h3>
            <p class="text-sm text-on-surface-variant mb-4">Some description text goes here.</p>
            <div class="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" color="neutral">Share</Button>
                <Button variant="soft" size="sm">Buy Now</Button>
            </div>
        </div>

        <!-- Destructive Confirmation -->
        <div class="p-4 rounded-xl bg-error-container max-w-md">
            <div class="flex items-start gap-3">
                <span class="text-on-error-container"><Icon name="lucide:alert-circle" size={24} /></span>
                <div class="flex-1">
                    <h3 class="font-medium text-on-error-container">Delete Item?</h3>
                    <p class="text-sm text-on-error-container/80 mb-3">This action cannot be undone.</p>
                    <div class="flex gap-2">
                        <Button variant="outline" color="neutral" size="sm">Cancel</Button>
                        <Button color="error" size="sm">Delete</Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hero Section -->
        <div class="space-y-2">
            <h3 class="text-sm font-medium text-on-surface-variant">Hero CTA</h3>
            <div class="flex gap-4 flex-wrap">
                <Button size="xl">Get Started</Button>
                <Button size="xl" variant="outline" color="neutral">Learn More</Button>
            </div>
        </div>

        <!-- Toolbar -->
        <div class="space-y-2">
            <h3 class="text-sm font-medium text-on-surface-variant">Toolbar</h3>
            <div class="inline-flex gap-1 p-1 rounded-lg bg-surface-container">
                <Button variant="ghost" size="icon-sm" color="neutral" iconLeading="lucide:bold"></Button>
                <Button variant="ghost" size="icon-sm" color="neutral" iconLeading="lucide:italic"></Button>
                <Button variant="ghost" size="icon-sm" color="neutral" iconLeading="lucide:underline"></Button>
                <Button variant="ghost" size="icon-sm" color="neutral" iconLeading="lucide:link"></Button>
            </div>
        </div>

        <!-- Alert Actions -->
        <div class="space-y-2">
            <h3 class="text-sm font-medium text-on-surface-variant">Alert Actions</h3>
            <div class="bg-warning-container text-on-warning-container p-4 rounded-lg max-w-md">
                <p class="text-sm">Your session is about to expire.</p>
                <div class="flex gap-2 mt-3">
                    <Button variant="ghost" color="warning" size="sm">Sign Out</Button>
                    <Button variant="soft" color="warning" size="sm">Stay Signed In</Button>
                </div>
            </div>
        </div>
    </section>

    <hr class="border-outline-variant" />

    <!-- ==================== ICON COMPONENT DEMO ==================== -->
    <h1 class="text-2xl font-bold text-on-surface">Icon Component Demo</h1>

    <!-- Primary, Secondary, Tertiary -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Brand Colors</h2>
        <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-2">
                <span class="text-primary"><Icon name="lucide:star" size={28} /></span>
                <span class="text-sm text-on-surface-variant">primary</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-secondary"><Icon name="lucide:bookmark" size={28} /></span>
                <span class="text-sm text-on-surface-variant">secondary</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-tertiary"><Icon name="lucide:sparkles" size={28} /></span>
                <span class="text-sm text-on-surface-variant">tertiary</span>
            </div>
        </div>

        <!-- Containers with icons -->
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container">
                <span class="text-on-primary-container"><Icon name="lucide:home" size={20} /></span>
                <span class="text-sm text-on-primary-container">primary-container</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-container">
                <span class="text-on-secondary-container"><Icon name="lucide:user" size={20} /></span>
                <span class="text-sm text-on-secondary-container">secondary-container</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-tertiary-container">
                <span class="text-on-tertiary-container"><Icon name="lucide:heart" size={20} /></span>
                <span class="text-sm text-on-tertiary-container">tertiary-container</span>
            </div>
        </div>
    </section>

    <!-- Status Colors -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Status Colors</h2>
        <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-2">
                <span class="text-success"><Icon name="lucide:circle-check" size={28} /></span>
                <span class="text-sm text-on-surface-variant">success</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-error"><Icon name="lucide:circle-x" size={28} /></span>
                <span class="text-sm text-on-surface-variant">error</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-warning"><Icon name="lucide:triangle-alert" size={28} /></span>
                <span class="text-sm text-on-surface-variant">warning</span>
            </div>
        </div>

        <!-- Status Containers -->
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-success-container">
                <span class="text-on-success-container"><Icon name="lucide:check" size={20} /></span>
                <span class="text-sm text-on-success-container">Success!</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container">
                <span class="text-on-error-container"><Icon name="lucide:x" size={20} /></span>
                <span class="text-sm text-on-error-container">Error!</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning-container">
                <span class="text-on-warning-container"><Icon name="lucide:alert-triangle" size={20} /></span>
                <span class="text-sm text-on-warning-container">Warning!</span>
            </div>
        </div>
    </section>

    <!-- Surface & Outline -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Surface & Outline</h2>
        <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-2">
                <span class="text-on-surface"><Icon name="lucide:layout" size={28} /></span>
                <span class="text-sm text-on-surface-variant">on-surface</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-on-surface-variant"><Icon name="lucide:settings" size={28} /></span>
                <span class="text-sm text-on-surface-variant">on-surface-variant</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-outline"><Icon name="lucide:minus" size={28} /></span>
                <span class="text-sm text-on-surface-variant">outline</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-outline-variant"><Icon name="lucide:grip-horizontal" size={28} /></span>
                <span class="text-sm text-on-surface-variant">outline-variant</span>
            </div>
        </div>

        <!-- Surface Containers -->
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant">
                <span class="text-on-surface"><Icon name="lucide:layers" size={20} /></span>
                <span class="text-xs text-on-surface-variant">lowest</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low">
                <span class="text-on-surface"><Icon name="lucide:layers" size={20} /></span>
                <span class="text-xs text-on-surface-variant">low</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container">
                <span class="text-on-surface"><Icon name="lucide:layers" size={20} /></span>
                <span class="text-xs text-on-surface-variant">container</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high">
                <span class="text-on-surface"><Icon name="lucide:layers" size={20} /></span>
                <span class="text-xs text-on-surface-variant">high</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest">
                <span class="text-on-surface"><Icon name="lucide:layers" size={20} /></span>
                <span class="text-xs text-on-surface-variant">highest</span>
            </div>
        </div>
    </section>

    <!-- Inverse -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Inverse Colors</h2>
        <div class="inline-flex items-center gap-4 px-6 py-4 rounded-xl bg-inverse-surface">
            <span class="text-inverse-on-surface"><Icon name="lucide:moon" size={24} /></span>
            <span class="text-inverse-on-surface">inverse-surface</span>
            <span class="text-inverse-primary"><Icon name="lucide:star" size={24} /></span>
            <span class="text-inverse-primary">inverse-primary</span>
        </div>
    </section>

    <!-- Icon Sizes -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Icon Sizes</h2>
        <div class="flex flex-wrap items-end gap-6 text-primary">
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={16} />
                <span class="text-xs text-on-surface-variant">16</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={20} />
                <span class="text-xs text-on-surface-variant">20</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={24} />
                <span class="text-xs text-on-surface-variant">24</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={32} />
                <span class="text-xs text-on-surface-variant">32</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={48} />
                <span class="text-xs text-on-surface-variant">48</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:heart" size={64} />
                <span class="text-xs text-on-surface-variant">64</span>
            </div>
        </div>
    </section>

    <!-- Multiple Icon Sets -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Multiple Icon Sets</h2>
        <div class="flex flex-wrap items-center gap-6 text-on-surface">
            <div class="flex flex-col items-center gap-1">
                <Icon name="lucide:github" size={28} />
                <span class="text-xs text-on-surface-variant">lucide</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="mdi:github" size={28} />
                <span class="text-xs text-on-surface-variant">mdi</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="tabler:brand-github" size={28} />
                <span class="text-xs text-on-surface-variant">tabler</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="ph:github-logo" size={28} />
                <span class="text-xs text-on-surface-variant">ph</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="carbon:logo-github" size={28} />
                <span class="text-xs text-on-surface-variant">carbon</span>
            </div>
            <div class="flex flex-col items-center gap-1">
                <Icon name="ri:github-fill" size={28} />
                <span class="text-xs text-on-surface-variant">ri</span>
            </div>
        </div>
    </section>
</div>
