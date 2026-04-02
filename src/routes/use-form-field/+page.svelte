<script lang="ts">
    import { FormField, Input, Select, Switch, Checkbox, Badge, Separator } from '$lib/index.js'

    let name = $state('')
    let email = $state('')
    let nameError = $state<string | boolean>(false)
    let emailError = $state<string | boolean>(false)

    function validateName() {
        if (!name) {
            nameError = 'Name is required'
        } else if (name.length < 2) {
            nameError = 'Name must be at least 2 characters'
        } else {
            nameError = false
        }
    }

    function validateEmail() {
        if (!email) {
            emailError = 'Email is required'
        } else if (!email.includes('@')) {
            emailError = 'Please enter a valid email'
        } else {
            emailError = false
        }
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">useFormField</h1>
        <p class="text-on-surface-variant">
            Access the nearest FormField context from any child component. Provides reactive access
            to name, size, error, and ariaId.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Child form controls automatically inherit size, error state, name, and ariaId from the
            parent FormField via <code class="rounded bg-surface-container px-1"
                >useFormField()</code
            >.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <FormField label="Username" name="username" description="Choose a unique username">
                <Input placeholder="Enter username" />
            </FormField>

            <FormField label="Email" name="email" description="We'll never share your email">
                <Input type="email" placeholder="you@example.com" />
            </FormField>
        </div>
    </section>

    <!-- Size Inheritance -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Size Inheritance</h2>
        <p class="text-sm text-on-surface-variant">
            The Input automatically picks up the size from FormField — no need to pass it
            explicitly.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            {#each ['sm', 'md', 'lg'] as size (size)}
                {@const formSize = size as 'sm' | 'md' | 'lg'}
                <FormField label="Size: {formSize}" name="size-{formSize}" size={formSize}>
                    <Input placeholder="Inherits size={formSize}" />
                </FormField>
            {/each}
        </div>
    </section>

    <!-- Error Propagation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Error Propagation</h2>
        <p class="text-sm text-on-surface-variant">
            When FormField has an error, child inputs automatically get error styling and ARIA
            attributes via the shared context.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <FormField label="Name" name="name-validate" error={nameError} required>
                <Input bind:value={name} placeholder="Enter your name" oninput={validateName} />
            </FormField>

            <FormField label="Email" name="email-validate" error={emailError} required>
                <Input
                    bind:value={email}
                    type="email"
                    placeholder="you@example.com"
                    oninput={validateEmail}
                />
            </FormField>

            <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                <Badge
                    label="Name: {nameError || 'valid'}"
                    color={nameError ? 'error' : 'success'}
                    variant="soft"
                    size="sm"
                />
                <Badge
                    label="Email: {emailError || 'valid'}"
                    color={emailError ? 'error' : 'success'}
                    variant="soft"
                    size="sm"
                />
            </div>
        </div>
    </section>

    <!-- Different Form Controls -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Works with All Form Controls</h2>
        <p class="text-sm text-on-surface-variant">
            All form components (Input, Select, Switch, Checkbox, etc.) consume the same FormField
            context via useFormField().
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-4">
            <FormField label="Full Name" name="full-name" help="Your legal full name">
                <Input placeholder="John Doe" />
            </FormField>

            <Separator />

            <FormField label="Country" name="country" help="Select your country">
                <Select
                    placeholder="Choose a country"
                    items={[
                        { label: 'Vietnam', value: 'vn' },
                        { label: 'United States', value: 'us' },
                        { label: 'Japan', value: 'jp' },
                        { label: 'South Korea', value: 'kr' }
                    ]}
                />
            </FormField>

            <Separator />

            <FormField label="Notifications" name="notifications">
                <Switch label="Enable email notifications" />
            </FormField>

            <Separator />

            <FormField label="Terms" name="terms" error="You must accept the terms">
                <Checkbox label="I agree to the terms and conditions" />
            </FormField>
        </div>
    </section>

    <!-- How it works -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">How It Works</h2>
        <div class="space-y-3 rounded-lg bg-surface-container-high p-4">
            <div class="rounded-md bg-surface-container p-4">
                <p class="mb-2 text-sm font-medium">Context Shape</p>
                <pre
                    class="overflow-x-auto rounded bg-surface-container-highest p-3 font-mono text-xs">{`interface FormFieldContext {
  name?: string         // Form field name for submission
  size: 'sm' | 'md' | 'lg'  // Inherited size
  error?: string | boolean   // Error state/message
  ariaId: string        // ARIA ID for accessibility
}`}</pre>
            </div>

            <div class="rounded-md bg-surface-container p-4">
                <p class="mb-2 text-sm font-medium">Usage in Custom Components</p>
                <pre
                    class="overflow-x-auto rounded bg-surface-container-highest p-3 font-mono text-xs">{`import { useFormField } from 'sv5ui'

const formField = useFormField()
// formField?.name    → 'email'
// formField?.size    → 'md'
// formField?.error   → 'Invalid email'
// formField?.ariaId  → 'form-field-email'`}</pre>
            </div>
        </div>
    </section>
</div>
