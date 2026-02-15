<script lang="ts">
    import { FormField } from '$lib/index.js'

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    const inputClass =
        'w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">FormField</h1>
        <p class="text-on-surface-variant">
            A wrapper component for form controls that provides label, description, hint, help text,
            and error handling.
        </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">
            Wrap a form control with <code class="rounded bg-surface-container-highest px-1"
                >FormField</code
            > to add a label.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Email">
                    <input type="email" placeholder="Enter your email" class={inputClass} />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Required -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Required</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">required</code> prop to
            add an asterisk indicator to the label.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Email" required>
                    <input type="email" placeholder="Enter your email" class={inputClass} />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Description -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Description</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">description</code> prop
            to add a description below the label.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField
                    label="Email"
                    description="We'll use this to send you notifications."
                >
                    <input type="email" placeholder="Enter your email" class={inputClass} />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Hint -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Hint</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">hint</code> prop to add
            a hint text next to the label.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Email" hint="Optional">
                    <input type="email" placeholder="Enter your email" class={inputClass} />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Help -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Help</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">help</code> prop to add
            help text below the form control.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm">
                <FormField label="Password" help="Must be at least 8 characters.">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        class={inputClass}
                    />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Error -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Error</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">error</code> prop to
            display an error message. It replaces the help text when present.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-4">
                <FormField label="Email" error="Please enter a valid email address.">
                    <input
                        type="email"
                        value="invalid-email"
                        class="{inputClass} border-error! focus:ring-error!"
                    />
                </FormField>

                <FormField
                    label="Email"
                    help="We'll never share your email."
                    error="This email is already taken."
                >
                    <input
                        type="email"
                        value="taken@example.com"
                        class="{inputClass} border-error! focus:ring-error!"
                    />
                </FormField>
            </div>
        </div>
    </section>

    <!-- Size -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">size</code> prop to
            control the size of the label and text.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full space-y-4">
                {#each sizes as size (size)}
                    <div class="max-w-sm">
                        <FormField
                            label="Email ({size})"
                            description="Enter your email address."
                            hint="Required"
                            {size}
                            required
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                class={inputClass}
                            />
                        </FormField>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="rounded bg-surface-container-highest px-1">orientation</code> prop
            to change the layout direction.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full space-y-6">
                <div class="max-w-sm">
                    <p class="mb-2 text-xs text-on-surface-variant">vertical (default)</p>
                    <FormField label="Email" description="Your primary email." orientation="vertical">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            class={inputClass}
                        />
                    </FormField>
                </div>

                <div class="max-w-lg">
                    <p class="mb-2 text-xs text-on-surface-variant">horizontal</p>
                    <FormField label="Email" description="Your primary email." orientation="horizontal">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            class={inputClass}
                        />
                    </FormField>
                </div>
            </div>
        </div>
    </section>

    <!-- Full Example -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Full Example</h2>
        <p class="text-sm text-on-surface-variant">
            A complete example with all props combined.
        </p>
        <div class="flex flex-wrap gap-6 rounded-lg bg-surface-container-high p-4">
            <div class="w-full max-w-sm space-y-4">
                <FormField
                    label="Username"
                    description="Choose a unique username."
                    hint="Required"
                    help="3-20 characters, letters and numbers only."
                    required
                >
                    <input type="text" placeholder="Enter username" class={inputClass} />
                </FormField>

                <FormField
                    label="Bio"
                    description="Tell us about yourself."
                    hint="Optional"
                    help="Max 280 characters."
                >
                    <textarea
                        placeholder="Write something..."
                        rows="3"
                        class={inputClass}
                    ></textarea>
                </FormField>
            </div>
        </div>
    </section>
</div>
