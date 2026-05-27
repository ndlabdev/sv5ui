<script lang="ts">
    import {
        Stepper,
        Badge,
        Button,
        Icon,
        Separator,
        Form,
        FormField,
        Input,
        Textarea,
        Checkbox,
        type StepperItem,
        type StepperApi,
        type FormApi
    } from '$lib/index.js'

    const basicItems: StepperItem[] = [
        { value: 'address', title: 'Address', description: 'Enter shipping address' },
        { value: 'shipping', title: 'Shipping', description: 'Pick a carrier' },
        { value: 'payment', title: 'Payment', description: 'Add a card' },
        { value: 'review', title: 'Review', description: 'Confirm and place order' }
    ]

    const iconItems: StepperItem[] = [
        { value: 'cart', title: 'Cart', icon: 'lucide:shopping-cart' },
        { value: 'address', title: 'Address', icon: 'lucide:map-pin' },
        { value: 'shipping', title: 'Shipping', icon: 'lucide:truck' },
        { value: 'payment', title: 'Payment', icon: 'lucide:credit-card' },
        { value: 'done', title: 'Done', icon: 'lucide:check' }
    ]

    const compactItems: StepperItem[] = [
        { value: 1, title: 'Plan' },
        { value: 2, title: 'Build' },
        { value: 3, title: 'Ship' }
    ]

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

    // Controlled with bind:value
    let controlledValue = $state<string | number>('address')
    let lastChange = $state('')

    // Imperative API wizard
    let apiValue = $state<string | number>('address')
    let api = $state<StepperApi>()

    // Linear vs free
    let linearValue = $state<string | number>('address')
    let freeValue = $state<string | number>('address')

    // Custom snippet demos
    let snippetValue = $state<string | number>('shipping')

    // -----------------------------------------------------------------
    // Form-driven wizard — each step validates before advancing.
    // -----------------------------------------------------------------
    type WizardData = {
        // step 1
        firstName: string
        lastName: string
        email: string
        // step 2
        address: string
        city: string
        zip: string
        // step 3
        notes: string
        consent: boolean
    }

    const wizardSteps: StepperItem[] = [
        {
            value: 'account',
            title: 'Account',
            description: 'Who is ordering',
            icon: 'lucide:user'
        },
        {
            value: 'shipping',
            title: 'Shipping',
            description: 'Where to deliver',
            icon: 'lucide:map-pin'
        },
        {
            value: 'review',
            title: 'Review',
            description: 'Confirm and submit',
            icon: 'lucide:clipboard-check'
        }
    ]

    const wizardState = $state<WizardData>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        notes: '',
        consent: false
    })

    let wizardValue = $state<string | number>('account')
    let wizardApi = $state<StepperApi>()
    let wizardForm = $state<FormApi<unknown>>()
    let wizardSubmitted = $state<string | null>(null)

    const STEP_FIELDS: Record<string, (keyof WizardData)[]> = {
        account: ['firstName', 'lastName', 'email'],
        shipping: ['address', 'city', 'zip'],
        review: ['consent']
    }

    function validateRequired(field: keyof WizardData) {
        const value = wizardState[field]
        if (typeof value === 'boolean') return value ? null : 'Required'
        if (typeof value === 'string' && value.trim().length === 0) return 'Required'
        if (field === 'email' && typeof value === 'string' && !/.+@.+\..+/.test(value)) {
            return 'Invalid email'
        }
        return null
    }

    function validateCurrentStep(): boolean {
        const fields = STEP_FIELDS[String(wizardValue)] ?? []
        const errors: { name: string; message: string }[] = []
        for (const f of fields) {
            const err = validateRequired(f)
            if (err) errors.push({ name: String(f), message: err })
            else wizardForm?.clear(String(f))
        }
        if (errors.length > 0) {
            wizardForm?.setErrors(errors)
            return false
        }
        return true
    }

    function handleWizardNext() {
        if (!validateCurrentStep()) return
        wizardApi?.next()
    }

    function handleWizardSubmit() {
        if (!validateCurrentStep()) return
        wizardSubmitted = JSON.stringify(wizardState, null, 2)
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Stepper</h1>
        <p class="text-on-surface-variant">
            A wizard-style progress indicator for multi-step flows. Renders a sequential list of
            steps with <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >pending</code
            >
            /
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">active</code> /
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">completed</code
            >
            states. Pure custom build — no bits-ui primitive.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <p class="text-sm text-on-surface-variant">
            Pass <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >items</code
            >
            and the Stepper renders progress with sensible defaults.
        </p>
        <div class="rounded-lg bg-surface-container-high p-6">
            <Stepper items={basicItems} />
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <p class="text-sm text-on-surface-variant">
            Switch between
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >horizontal</code
            >
            (default) and
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">vertical</code> layout.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-4 text-sm font-medium">Horizontal</p>
                <Stepper items={basicItems} value="shipping" content={false} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-4 text-sm font-medium">Vertical</p>
                <Stepper
                    items={basicItems}
                    orientation="vertical"
                    value="shipping"
                    content={false}
                />
            </div>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Five sizes scale indicator and typography together.
        </p>
        <div class="space-y-4">
            {#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
                <div class="rounded-lg bg-surface-container-high p-6">
                    <p class="mb-3 text-xs font-medium tracking-wide uppercase">{size}</p>
                    <Stepper items={compactItems} value={2} {size} content={false} linear={false} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">color</code
            >
            prop tints the indicator, separator, and active title.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
            {#each colors as color (color)}
                <div class="rounded-lg bg-surface-container-high p-6">
                    <p class="mb-3 text-xs font-medium capitalize">{color}</p>
                    <Stepper
                        items={compactItems}
                        value={2}
                        {color}
                        content={false}
                        linear={false}
                    />
                </div>
            {/each}
        </div>
    </section>

    <!-- Icons -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Icons</h2>
        <p class="text-sm text-on-surface-variant">
            Set <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code>
            on an item to replace the default number indicator. Completed steps automatically show a check
            icon when no
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">icon</code> is set.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Per-item icons (horizontal)</p>
                <Stepper items={iconItems} value="shipping" content={false} linear={false} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Per-item icons (vertical)</p>
                <Stepper
                    items={iconItems}
                    value="shipping"
                    content={false}
                    orientation="vertical"
                    linear={false}
                />
            </div>
        </div>
    </section>

    <!-- Linear vs Free -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Linear vs Free Navigation</h2>
        <p class="text-sm text-on-surface-variant">
            By default Stepper is <code
                class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">linear</code
            >: a click can only advance one step ahead. Set
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >linear={'{false}'}</code
            >
            to allow jumping anywhere.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">
                    Linear (default) · Current: <Badge variant="soft" label={String(linearValue)} />
                </p>
                <Stepper items={basicItems} bind:value={linearValue} content={false} />
                <p class="mt-3 text-xs text-on-surface-variant">
                    Click any step — only the immediate next one (and prior ones) responds.
                </p>
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">
                    Free · Current: <Badge variant="soft" color="info" label={String(freeValue)} />
                </p>
                <Stepper items={basicItems} bind:value={freeValue} content={false} linear={false} />
                <p class="mt-3 text-xs text-on-surface-variant">
                    Click any step to jump there directly.
                </p>
            </div>
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled</h2>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">All steps disabled</p>
                <Stepper items={basicItems} disabled content={false} />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Per-item disabled</p>
                <Stepper
                    items={[
                        { value: 'a', title: 'Open', description: 'Free' },
                        {
                            value: 'b',
                            title: 'Locked',
                            description: 'Premium only',
                            disabled: true
                        },
                        { value: 'c', title: 'Open', description: 'Free' }
                    ]}
                    linear={false}
                    content={false}
                />
            </div>
        </div>
    </section>

    <!-- Imperative API -->
    <section class="space-y-3">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold">Imperative API — bind:api</h2>
            <p class="text-xs text-on-surface-variant">
                Drive the Stepper from outside with Back / Next buttons.
            </p>
        </div>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-6">
            <Stepper items={basicItems} bind:api bind:value={apiValue}>
                {#snippet body({ item })}
                    <div
                        class="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container p-4"
                    >
                        <Icon name="lucide:info" size="18" class="mt-0.5 shrink-0 text-primary" />
                        <div>
                            <p class="text-sm font-medium">{item.title}</p>
                            <p class="text-sm text-on-surface-variant">
                                {item.description}
                            </p>
                        </div>
                    </div>
                {/snippet}
            </Stepper>
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    leadingIcon="lucide:chevron-left"
                    label="Back"
                    disabled={!api?.hasPrev}
                    onclick={() => api?.prev()}
                />
                <Button
                    color="primary"
                    size="sm"
                    trailingIcon="lucide:chevron-right"
                    label={api?.hasNext ? 'Next' : 'Done'}
                    disabled={!api?.hasNext}
                    onclick={() => api?.next()}
                />
                <span class="ms-auto text-xs text-on-surface-variant">
                    Step {(api?.activeIndex ?? 0) + 1} of {basicItems.length}
                </span>
            </div>
        </div>
    </section>

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled — bind:value</h2>
        <p class="text-sm text-on-surface-variant">
            Two-way bind to drive Stepper from any UI; useful when navigation lives elsewhere on the
            page.
        </p>
        <div class="space-y-4 rounded-lg bg-surface-container-high p-6">
            <p class="text-sm font-medium">
                Active: <Badge variant="soft" color="info" label={String(controlledValue)} />
            </p>
            <div class="flex flex-wrap gap-2">
                {#each basicItems as item (item.value)}
                    <Button
                        size="xs"
                        variant={controlledValue === item.value ? 'solid' : 'outline'}
                        label={item.title}
                        onclick={() => (controlledValue = item.value ?? '')}
                    />
                {/each}
            </div>
            <Stepper items={basicItems} bind:value={controlledValue} content={false} />
        </div>
    </section>

    <!-- Callback -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">onValueChange Callback</h2>
        <div class="rounded-lg bg-surface-container-high p-6">
            <p class="mb-3 text-sm">
                Last change:
                <Badge
                    variant="soft"
                    color={lastChange ? 'success' : 'surface'}
                    label={lastChange || 'None'}
                />
            </p>
            <Stepper
                items={basicItems}
                onValueChange={(v) => (lastChange = `Switched to: ${v}`)}
                content={false}
            />
        </div>
    </section>

    <!-- Custom Snippets -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Custom Snippets</h2>
        <p class="text-sm text-on-surface-variant">
            Override
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">indicator</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">titleSlot</code
            >,
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >descriptionSlot</code
            >, or
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">body</code> for custom
            rendering.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Custom indicator</p>
                <Stepper items={basicItems} value="shipping" content={false} linear={false}>
                    {#snippet indicator({ number, state })}
                        <span
                            class="inline-flex size-8 items-center justify-center rounded-full text-sm font-bold {state ===
                            'completed'
                                ? 'bg-success text-on-success'
                                : state === 'active'
                                  ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                                  : 'border-2 border-dashed border-outline-variant text-on-surface-variant'}"
                            aria-hidden="true"
                        >
                            {#if state === 'completed'}
                                <Icon name="lucide:check" size="16" />
                            {:else}
                                {number}
                            {/if}
                        </span>
                    {/snippet}
                </Stepper>
            </div>

            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Custom title with badge</p>
                <Stepper items={basicItems} value="shipping" content={false} linear={false}>
                    {#snippet titleSlot({ item, state })}
                        <span class="inline-flex items-center gap-1.5 text-sm font-medium">
                            {item.title}
                            {#if state === 'active'}
                                <Badge size="xs" variant="soft" color="primary" label="Now" />
                            {:else if state === 'completed'}
                                <Badge size="xs" variant="soft" color="success" label="Done" />
                            {/if}
                        </span>
                    {/snippet}
                </Stepper>
            </div>

            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Custom body</p>
                <Stepper items={basicItems} bind:value={snippetValue}>
                    {#snippet body({ item, number })}
                        <div
                            class="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container p-4"
                        >
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                            >
                                <Icon name="lucide:sparkles" size="20" />
                            </div>
                            <div>
                                <p class="text-sm font-semibold">
                                    Step {number}: {item.title}
                                </p>
                                <p class="text-sm text-on-surface-variant">
                                    Body snippet renders anywhere below the progress bar.
                                </p>
                            </div>
                        </div>
                    {/snippet}
                </Stepper>
            </div>

            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Custom description</p>
                <Stepper items={basicItems} value="shipping" content={false} linear={false}>
                    {#snippet descriptionSlot({ item, state })}
                        <span
                            class="text-xs {state === 'pending'
                                ? 'text-on-surface-variant/60 italic'
                                : 'text-on-surface-variant'}"
                        >
                            {state === 'completed' ? '✓ ' : ''}{item.description}
                        </span>
                    {/snippet}
                </Stepper>
            </div>
        </div>
    </section>

    <!-- UI Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Override slot styles via the
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">ui</code> prop,
            or per-item via
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >items[i].ui</code
            >.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Square indicators</p>
                <Stepper
                    items={compactItems}
                    value={2}
                    content={false}
                    linear={false}
                    ui={{ indicator: 'rounded-md' }}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Thicker separator</p>
                <Stepper
                    items={compactItems}
                    value={2}
                    content={false}
                    linear={false}
                    ui={{ separator: 'h-1' }}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Bold titles</p>
                <Stepper
                    items={basicItems}
                    value="shipping"
                    content={false}
                    linear={false}
                    ui={{ title: 'font-bold uppercase tracking-wider' }}
                />
            </div>
            <div class="rounded-lg bg-surface-container-high p-6">
                <p class="mb-3 text-sm font-medium">Per-item override</p>
                <Stepper
                    items={[
                        { value: 'a', title: 'Standard', description: 'Normal item' },
                        {
                            value: 'b',
                            title: 'Spotlight',
                            description: 'Highlighted',
                            ui: { indicator: 'ring-4 ring-warning/40' }
                        },
                        { value: 'c', title: 'Standard', description: 'Normal item' }
                    ]}
                    value="b"
                    content={false}
                    linear={false}
                />
            </div>
        </div>
    </section>

    <Separator />

    <!-- Real World Example: Form Wizard -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World — Form Wizard</h2>
        <p class="text-sm text-on-surface-variant">
            Multi-step form with per-step validation. The Next button calls a custom validator
            before invoking
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >api.next()</code
            >.
        </p>
        <div class="rounded-lg bg-surface-container-high p-6">
            <Stepper
                items={wizardSteps}
                bind:api={wizardApi}
                bind:value={wizardValue}
                color="primary"
            >
                {#snippet body({ item })}
                    <Form
                        bind:api={wizardForm}
                        state={wizardState}
                        onsubmit={handleWizardSubmit}
                        class="space-y-4 rounded-lg border border-outline-variant bg-surface-container p-5"
                    >
                        {#if item.value === 'account'}
                            <div class="space-y-4">
                                <h3 class="text-base font-semibold">Tell us about yourself</h3>
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <FormField name="firstName" label="First name" required>
                                        <Input bind:value={wizardState.firstName} />
                                    </FormField>
                                    <FormField name="lastName" label="Last name" required>
                                        <Input bind:value={wizardState.lastName} />
                                    </FormField>
                                </div>
                                <FormField name="email" label="Email" required>
                                    <Input type="email" bind:value={wizardState.email} />
                                </FormField>
                            </div>
                        {:else if item.value === 'shipping'}
                            <div class="space-y-4">
                                <h3 class="text-base font-semibold">Shipping address</h3>
                                <FormField name="address" label="Street address" required>
                                    <Input bind:value={wizardState.address} />
                                </FormField>
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <FormField name="city" label="City" required>
                                        <Input bind:value={wizardState.city} />
                                    </FormField>
                                    <FormField name="zip" label="ZIP" required>
                                        <Input bind:value={wizardState.zip} />
                                    </FormField>
                                </div>
                                <FormField name="notes" label="Delivery notes (optional)">
                                    <Textarea bind:value={wizardState.notes} rows={2} />
                                </FormField>
                            </div>
                        {:else}
                            <div class="space-y-4">
                                <h3 class="text-base font-semibold">Review</h3>
                                <div
                                    class="space-y-2 rounded-lg bg-surface-container-highest p-3 text-sm"
                                >
                                    <div>
                                        <span class="text-on-surface-variant">Name:</span>
                                        <span class="font-medium"
                                            >{wizardState.firstName}
                                            {wizardState.lastName}</span
                                        >
                                    </div>
                                    <div>
                                        <span class="text-on-surface-variant">Email:</span>
                                        <span class="font-medium">{wizardState.email}</span>
                                    </div>
                                    <div>
                                        <span class="text-on-surface-variant">Address:</span>
                                        <span class="font-medium"
                                            >{wizardState.address}, {wizardState.city}
                                            {wizardState.zip}</span
                                        >
                                    </div>
                                    {#if wizardState.notes}
                                        <div>
                                            <span class="text-on-surface-variant">Notes:</span>
                                            <span class="font-medium">{wizardState.notes}</span>
                                        </div>
                                    {/if}
                                </div>
                                <FormField name="consent" required>
                                    <label class="flex items-start gap-2 text-sm">
                                        <Checkbox bind:checked={wizardState.consent} />
                                        I confirm the details above are correct.
                                    </label>
                                </FormField>
                            </div>
                        {/if}

                        <div class="flex flex-wrap items-center gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                leadingIcon="lucide:chevron-left"
                                label="Back"
                                disabled={!wizardApi?.hasPrev}
                                onclick={() => wizardApi?.prev()}
                            />
                            {#if wizardApi?.hasNext}
                                <Button
                                    color="primary"
                                    size="sm"
                                    trailingIcon="lucide:chevron-right"
                                    label="Next"
                                    onclick={handleWizardNext}
                                />
                            {:else}
                                <Button
                                    color="success"
                                    size="sm"
                                    leadingIcon="lucide:check"
                                    label="Submit"
                                    type="submit"
                                />
                            {/if}
                            <span class="ms-auto text-xs text-on-surface-variant">
                                Step {(wizardApi?.activeIndex ?? 0) + 1} of {wizardSteps.length}
                            </span>
                        </div>
                    </Form>
                {/snippet}
            </Stepper>

            {#if wizardSubmitted}
                <div class="mt-4 rounded-lg border border-success/40 bg-success/10 p-4 text-sm">
                    <div class="mb-2 flex items-center gap-2 font-semibold text-success">
                        <Icon name="lucide:party-popper" size="18" />
                        Submitted!
                    </div>
                    <pre
                        class="overflow-x-auto text-xs whitespace-pre-wrap text-on-surface-variant">{wizardSubmitted}</pre>
                </div>
            {/if}
        </div>
    </section>

    <!-- Real World Example: Onboarding -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Real World — Onboarding Checklist</h2>
        <p class="text-sm text-on-surface-variant">
            Vertical Stepper with rich descriptions and inline actions per step.
        </p>
        <div class="rounded-lg bg-surface-container-high p-6">
            <Stepper
                items={[
                    {
                        value: 'profile',
                        title: 'Complete your profile',
                        description: 'Add a photo and bio so teammates recognize you.',
                        icon: 'lucide:user-circle'
                    },
                    {
                        value: 'team',
                        title: 'Invite your team',
                        description: 'Bring teammates so you can collaborate from day one.',
                        icon: 'lucide:users'
                    },
                    {
                        value: 'integrate',
                        title: 'Connect your tools',
                        description: 'GitHub, Slack, Linear — wire everything in one click.',
                        icon: 'lucide:plug'
                    },
                    {
                        value: 'done',
                        title: 'You are ready',
                        description: 'Explore the dashboard or start your first project.',
                        icon: 'lucide:rocket'
                    }
                ]}
                orientation="vertical"
                value="team"
                color="success"
                linear={false}
            >
                {#snippet body({ item, state, active })}
                    {#if active}
                        <div
                            class="mt-2 flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-3"
                        >
                            <Icon name={item.icon ?? 'lucide:zap'} size="18" class="text-primary" />
                            <span class="text-sm">Continue with this step</span>
                            <Button
                                class="ms-auto"
                                size="xs"
                                color="primary"
                                label={state === 'completed' ? 'Revisit' : 'Continue'}
                            />
                        </div>
                    {/if}
                {/snippet}
            </Stepper>
        </div>
    </section>
</div>
