<script lang="ts">
    import {
        Form,
        FormField,
        Input,
        Textarea,
        Select,
        Checkbox,
        Switch,
        RadioGroup,
        Slider,
        PinInput,
        Button,
        type FormApi,
        type FormError,
        type FormErrorEvent
    } from '$lib/index.js'
    import { z } from 'zod'
    import * as v from 'valibot'
    import * as yup from 'yup'
    import Joi from 'joi'
    import type { FormSchema } from '$lib/index.js'

    // ============================================================
    // Example 1 — Basic login form with Zod
    // ============================================================
    const basicSchema = z.object({
        email: z.string().min(1, 'Email is required').email('Invalid email format'),
        password: z.string().min(8, 'Password must be at least 8 characters')
    })

    type BasicInput = z.input<typeof basicSchema>
    let basicState = $state<BasicInput>({ email: '', password: '' })
    let basicForm = $state<FormApi<unknown>>()
    let basicSubmitted = $state<string | null>(null)

    function handleBasicSubmit(event: { data: unknown }) {
        basicSubmitted = JSON.stringify(event.data, null, 2)
    }

    // ============================================================
    // Example 2 — Validation with real libraries
    // Same signup form validated by Zod / Valibot / Yup / Joi interchangeably.
    // Zod, Valibot, and Yup implement the Standard Schema spec; Joi has a
    // dedicated adapter. SV5UI's Form accepts all four identically via the
    // `schema` prop — zero adapter code on the user's side.
    // ============================================================
    type SignupInput = {
        name: string
        email: string
        // `age` is typed as `number | undefined` because <Input type="number">
        // binds to a number via Svelte's native coercion. Undefined represents
        // "field is empty" — we can't use 0 as that would look valid.
        age: number | undefined
        country: string
        role: string
        bio: string
        otp: string
        volume: number
        newsletter: boolean
        terms: boolean
    }

    // ---- Zod schema ----
    const zodSignupSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email'),
        age: z.number({ message: 'Age is required' }).min(18, 'You must be at least 18 years old'),
        country: z.string().min(1, 'Please select a country'),
        role: z.string().min(1, 'Please select a role'),
        bio: z.string().min(10, 'Bio must be at least 10 characters'),
        otp: z.string().length(5, 'Please enter the 5-digit code'),
        volume: z.number(),
        newsletter: z.boolean(),
        terms: z.literal(true, { message: 'You must accept the terms' })
    })

    // ---- Valibot schema ----
    const valibotSignupSchema = v.object({
        name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters')),
        email: v.pipe(v.string(), v.email('Please enter a valid email')),
        age: v.pipe(
            v.number('Age is required'),
            v.minValue(18, 'You must be at least 18 years old')
        ),
        country: v.pipe(v.string(), v.minLength(1, 'Please select a country')),
        role: v.pipe(v.string(), v.minLength(1, 'Please select a role')),
        bio: v.pipe(v.string(), v.minLength(10, 'Bio must be at least 10 characters')),
        otp: v.pipe(v.string(), v.length(5, 'Please enter the 5-digit code')),
        volume: v.number(),
        newsletter: v.boolean(),
        terms: v.pipe(v.boolean(), v.literal(true, 'You must accept the terms'))
    })

    // ---- Yup schema ----
    const yupSignupSchema = yup.object({
        name: yup.string().required().min(2, 'Name must be at least 2 characters'),
        email: yup.string().required().email('Please enter a valid email'),
        age: yup
            .number()
            .typeError('Age is required')
            .required('Age is required')
            .min(18, 'You must be at least 18 years old'),
        country: yup.string().required('Please select a country'),
        role: yup.string().required('Please select a role'),
        bio: yup.string().required().min(10, 'Bio must be at least 10 characters'),
        otp: yup.string().required().length(5, 'Please enter the 5-digit code'),
        volume: yup.number().required(),
        newsletter: yup.boolean().required(),
        terms: yup.boolean().oneOf([true], 'You must accept the terms').required()
    })

    // ---- Joi schema ----
    const joiSignupSchema = Joi.object({
        name: Joi.string().min(2).required().messages({
            'string.min': 'Name must be at least 2 characters',
            'string.empty': 'Name must be at least 2 characters',
            'any.required': 'Name must be at least 2 characters'
        }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': 'Please enter a valid email',
                'string.empty': 'Please enter a valid email',
                'any.required': 'Please enter a valid email'
            }),
        age: Joi.number().min(18).required().messages({
            'number.base': 'Age is required',
            'number.min': 'You must be at least 18 years old',
            'any.required': 'Age is required'
        }),
        country: Joi.string().required().messages({
            'string.empty': 'Please select a country',
            'any.required': 'Please select a country'
        }),
        role: Joi.string().required().messages({
            'string.empty': 'Please select a role',
            'any.required': 'Please select a role'
        }),
        bio: Joi.string().min(10).required().messages({
            'string.min': 'Bio must be at least 10 characters',
            'string.empty': 'Bio must be at least 10 characters',
            'any.required': 'Bio must be at least 10 characters'
        }),
        otp: Joi.string().length(5).required().messages({
            'string.length': 'Please enter the 5-digit code',
            'string.empty': 'Please enter the 5-digit code',
            'any.required': 'Please enter the 5-digit code'
        }),
        volume: Joi.number().required(),
        newsletter: Joi.boolean().required(),
        terms: Joi.boolean().valid(true).required().messages({
            'any.only': 'You must accept the terms',
            'any.required': 'You must accept the terms'
        })
    })

    type SchemaLib = 'zod' | 'valibot' | 'yup' | 'joi'
    let activeSchemaLib = $state<SchemaLib>('zod')

    const activeSchema = $derived<FormSchema>(
        activeSchemaLib === 'zod'
            ? zodSignupSchema
            : activeSchemaLib === 'valibot'
              ? valibotSignupSchema
              : activeSchemaLib === 'yup'
                ? yupSignupSchema
                : joiSignupSchema
    )

    let signupState = $state<SignupInput>({
        name: '',
        email: '',
        age: undefined,
        country: '',
        role: '',
        bio: '',
        otp: '',
        volume: 50,
        newsletter: true,
        terms: false
    })
    let signupForm = $state<FormApi<unknown>>()
    let signupSubmitted = $state<string | null>(null)

    const countryItems = [
        { label: 'Vietnam', value: 'vn' },
        { label: 'United States', value: 'us' },
        { label: 'Japan', value: 'jp' },
        { label: 'South Korea', value: 'kr' }
    ]

    const roleItems = [
        { label: 'Developer', value: 'dev', description: 'Write code' },
        { label: 'Designer', value: 'design', description: 'Create experiences' },
        { label: 'Manager', value: 'pm', description: 'Coordinate teams' }
    ]

    function handleSignupSubmit(event: { data: unknown }) {
        signupSubmitted = JSON.stringify(event.data, null, 2)
    }

    let signupErrorCount = $state(0)
    function handleSignupError(event: FormErrorEvent) {
        signupErrorCount = event.errors.length
    }

    // ============================================================
    // Example 3 — Async submit with loading state
    // ============================================================
    let asyncState = $state({ username: '' })
    let asyncForm = $state<FormApi<unknown>>()
    let asyncResult = $state<string | null>(null)

    async function handleAsyncSubmit(event: { data: unknown }) {
        asyncResult = null
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1500))
        asyncResult = `Created user: ${(event.data as { username: string }).username}`
    }

    function validateAsync(raw: unknown): FormError[] {
        const state = raw as typeof asyncState
        if (!state.username) {
            return [{ name: 'username', message: 'Username is required' }]
        }
        if (state.username.length < 3) {
            return [{ name: 'username', message: 'Username must be at least 3 characters' }]
        }
        return []
    }

    // ============================================================
    // Example 4 — Programmatic API (bind:api)
    // ============================================================
    let apiState = $state({ note: '' })
    let apiForm = $state<FormApi<unknown>>()

    function validateApi(raw: unknown): FormError[] {
        const state = raw as typeof apiState
        if (!state.note) return [{ name: 'note', message: 'Note is required' }]
        return []
    }

    // ============================================================
    // Example 5 — Async field validation (username availability)
    // Validates against a "server" via a debounced async validator.
    // ============================================================
    let availabilityState = $state({ username: '' })
    let availabilityForm = $state<FormApi<unknown>>()
    let availabilityResult = $state<string | null>(null)

    // Simulate a server call with a 800ms delay.
    const takenUsernames = new Set(['admin', 'root', 'test', 'user', 'svelte'])
    async function checkUsernameAvailable(username: string): Promise<boolean> {
        await new Promise((r) => setTimeout(r, 800))
        return !takenUsernames.has(username.toLowerCase())
    }

    async function validateAvailability(raw: unknown): Promise<FormError[]> {
        const state = raw as typeof availabilityState
        const errors: FormError[] = []
        if (!state.username || state.username.length < 3) {
            errors.push({ name: 'username', message: 'Username must be at least 3 characters' })
            return errors
        }
        const available = await checkUsernameAvailable(state.username)
        if (!available) {
            errors.push({
                name: 'username',
                message: `"${state.username}" is already taken`
            })
        }
        return errors
    }

    async function handleAvailabilitySubmit(event: { data: unknown }) {
        availabilityResult = `✓ Registered: ${(event.data as { username: string }).username}`
    }

    // ============================================================
    // Example 6 — Array / repeater fields (nested Form per row)
    // Each row is a <Form nested name="guests.{index}"> with its own
    // item schema. FormField inside uses relative names ("name", "email")
    // because validation scope is local to the row. The parent only
    // enforces array-level rules (min length) via custom validate.
    // ============================================================
    const guestItemSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email')
    })

    type GuestItem = z.input<typeof guestItemSchema>
    let guestsState = $state<{ guests: GuestItem[] }>({
        guests: [{ name: '', email: '' }]
    })
    let guestsForm = $state<FormApi<unknown>>()
    let guestsSubmitted = $state<string | null>(null)

    function validateGuestsLength(raw: unknown): FormError[] {
        const state = raw as typeof guestsState
        return state.guests.length === 0 ? [{ message: 'Add at least one guest' }] : []
    }

    function addGuest() {
        guestsState.guests = [...guestsState.guests, { name: '', email: '' }]
    }
    function removeGuest(index: number) {
        guestsState.guests = guestsState.guests.filter((_, i) => i !== index)
    }
    function handleGuestsSubmit(event: { data: unknown }) {
        guestsSubmitted = JSON.stringify(event.data, null, 2)
    }

    // ============================================================
    // Example 7 — Dependent fields (confirm password)
    // All four supported libraries natively handle cross-field validation:
    //   Zod:     z.object({...}).refine((data) => ..., { path: ['confirm'] })
    //   Valibot: v.pipe(v.object({...}), v.forward(v.check(...), ['confirm']))
    //   Yup:     yup.string().oneOf([yup.ref('password')], 'Passwords must match')
    //   Joi:     Joi.any().valid(Joi.ref('password')).messages({...})
    // Demo uses Zod since it's the most idiomatic for object-level refinements.
    // ============================================================
    const passwordSchema = z
        .object({
            password: z.string().min(8, 'Password must be at least 8 characters'),
            confirm: z.string().min(1, 'Please confirm your password')
        })
        .refine((data) => data.password === data.confirm, {
            message: 'Passwords do not match',
            path: ['confirm'] // attach error to the `confirm` field
        })

    type PasswordInput = z.input<typeof passwordSchema>
    let passwordState = $state<PasswordInput>({ password: '', confirm: '' })
    let passwordForm = $state<FormApi<unknown>>()
    let passwordDone = $state(false)

    function handlePasswordSubmit() {
        passwordDone = true
    }

    // ============================================================
    // Example 8 — Nested forms
    // A parent form embeds a child form via <Form nested name="address">.
    // The child attaches on mount; parent.submit() cascades validation
    // and merges the child's state into the parent payload.
    // ============================================================
    const nestedSchema = z.object({
        fullName: z.string().min(2, 'Name must be at least 2 characters')
    })
    const addressSchema = z.object({
        street: z.string().min(3, 'Street must be at least 3 characters'),
        city: z.string().min(2, 'City must be at least 2 characters')
    })

    let nestedState = $state({
        fullName: '',
        address: { street: '', city: '' }
    })
    let nestedForm = $state<FormApi<unknown>>()
    let nestedSubmitted = $state<string | null>(null)

    function handleNestedSubmit(event: { data: unknown }) {
        nestedSubmitted = JSON.stringify(event.data, null, 2)
    }

    // ============================================================
    // Example 9 — Error summary + reset
    // Demonstrates reading `form.errors` reactively to render a
    // summary box at the top, plus the `reset()` method.
    // ============================================================
    const summarySchema = z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        category: z.string().min(1, 'Please select a category')
    })
    type SummaryInput = z.input<typeof summarySchema>
    const initialSummaryState: SummaryInput = { title: '', description: '', category: '' }
    let summaryState = $state<SummaryInput>({ ...initialSummaryState })
    let summaryForm = $state<FormApi<unknown>>()

    function resetSummary() {
        summaryForm?.reset()
        summaryState = { ...initialSummaryState }
    }

    const summaryCategories = [
        { label: 'Bug', value: 'bug' },
        { label: 'Feature', value: 'feature' },
        { label: 'Question', value: 'question' }
    ]
</script>

<div class="space-y-12">
    <div>
        <h1 class="text-2xl font-bold text-on-surface">Form</h1>
        <p class="mt-2 text-sm text-on-surface-variant">
            Centralized form validation and submission. Supports Zod, Valibot, Yup, Joi, and custom
            validators. Errors propagate to
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">FormField</code
            >
            automatically by matching
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">name</code>.
        </p>
    </div>

    <!-- ============================================================ -->
    <!-- Example 1 — Basic login form with Zod                          -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Basic — Login form with Zod</h2>
            <p class="text-sm text-on-surface-variant">
                Simplest usage: pass a Zod schema to the <code
                    class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">schema</code
                >
                prop. Errors propagate to each FormField by matching
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">name</code
                >. Submit is blocked until validation passes.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={basicForm}
                bind:state={basicState}
                schema={basicSchema}
                onsubmit={handleBasicSubmit}
                class="max-w-md space-y-4"
            >
                <FormField name="email" label="Email" required>
                    <Input
                        type="email"
                        bind:value={basicState.email}
                        placeholder="you@example.com"
                    />
                </FormField>

                <FormField
                    name="password"
                    label="Password"
                    required
                    help="Must be at least 8 characters"
                >
                    <Input type="password" bind:value={basicState.password} />
                </FormField>

                <div class="flex items-center gap-3">
                    <Button type="submit" loading={basicForm?.loading}>Sign in</Button>
                    <Button
                        type="button"
                        variant="ghost"
                        color="secondary"
                        onclick={() => basicForm?.clear()}
                    >
                        Clear errors
                    </Button>
                </div>
            </Form>

            {#if basicSubmitted}
                <div
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    <p class="font-medium">Submitted:</p>
                    <pre class="mt-1 text-xs">{basicSubmitted}</pre>
                </div>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 2 — Zod / Valibot / Yup / Joi                          -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">
                Schema validation — Zod / Valibot / Yup / Joi
            </h2>
            <p class="text-sm text-on-surface-variant">
                The same signup form validated by four different libraries. Zod, Valibot, and Yup go
                through the <a
                    href="https://standardschema.dev"
                    target="_blank"
                    rel="noopener"
                    class="text-primary hover:underline">Standard Schema</a
                >
                path; Joi uses a dedicated adapter. In all four cases
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >&lt;Form schema=&#123;...&#125;&gt;</code
                > accepts the schema directly — no wrapping or resolvers on your side. Switch libraries
                with the tabs below.
            </p>
        </div>

        <!-- Schema lib tabs -->
        <div class="flex gap-2">
            {#each ['zod', 'valibot', 'yup', 'joi'] as const as lib (lib)}
                <button
                    type="button"
                    class="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors {activeSchemaLib ===
                    lib
                        ? 'border-primary bg-primary-container text-on-primary-container'
                        : 'border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'}"
                    onclick={() => {
                        activeSchemaLib = lib
                        signupForm?.clear()
                        signupSubmitted = null
                        signupErrorCount = 0
                    }}
                >
                    {lib === 'zod'
                        ? 'Zod'
                        : lib === 'valibot'
                          ? 'Valibot'
                          : lib === 'yup'
                            ? 'Yup'
                            : 'Joi'}
                </button>
            {/each}
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={signupForm}
                bind:state={signupState}
                schema={activeSchema}
                onsubmit={handleSignupSubmit}
                onerror={handleSignupError}
                class="max-w-2xl space-y-4"
            >
                <div class="grid gap-4 sm:grid-cols-2">
                    <FormField name="name" label="Name" required>
                        <Input bind:value={signupState.name} placeholder="Jane Doe" />
                    </FormField>

                    <FormField name="email" label="Email" required>
                        <Input
                            type="email"
                            bind:value={signupState.email}
                            placeholder="jane@example.com"
                        />
                    </FormField>

                    <FormField name="age" label="Age" required help="Must be 18 or older">
                        <Input type="number" bind:value={signupState.age} placeholder="18" />
                    </FormField>

                    <FormField name="country" label="Country" required>
                        <Select
                            bind:value={signupState.country}
                            items={countryItems}
                            placeholder="Select a country"
                        />
                    </FormField>
                </div>

                <FormField name="role" label="Role" required>
                    <RadioGroup bind:value={signupState.role} items={roleItems} />
                </FormField>

                <FormField name="bio" label="Bio" required help="At least 10 characters">
                    <Textarea
                        bind:value={signupState.bio}
                        rows={3}
                        placeholder="Tell us about yourself..."
                    />
                </FormField>

                <FormField name="otp" label="Verification code" required help="5-digit code">
                    <PinInput bind:value={signupState.otp} length={5} />
                </FormField>

                <FormField name="volume" label="Notification volume">
                    <Slider bind:value={signupState.volume} min={0} max={100} tooltip />
                </FormField>

                <FormField name="newsletter">
                    <Switch bind:checked={signupState.newsletter} label="Subscribe to newsletter" />
                </FormField>

                <FormField name="terms" required>
                    <Checkbox
                        bind:checked={signupState.terms}
                        label="I accept the terms and conditions"
                    />
                </FormField>

                <div class="flex items-center gap-3 pt-2">
                    <Button type="submit" loading={signupForm?.loading}>Create account</Button>
                    <Button
                        type="button"
                        variant="ghost"
                        color="secondary"
                        onclick={() => signupForm?.clear()}
                    >
                        Clear errors
                    </Button>

                    {#if signupForm?.dirty}
                        <span class="text-xs text-on-surface-variant">
                            {signupForm.dirtyFields.size} field(s) modified
                        </span>
                    {/if}
                </div>
            </Form>

            {#if signupSubmitted}
                <div
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    <p class="font-medium">Submitted:</p>
                    <pre class="mt-1 overflow-x-auto text-xs">{signupSubmitted}</pre>
                </div>
            {:else if signupErrorCount > 0}
                <p class="mt-4 text-sm text-error">
                    {signupErrorCount} validation error(s) — fix the fields above.
                </p>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 3 — Async submit with loading                          -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Async submit — loading state</h2>
            <p class="text-sm text-on-surface-variant">
                When <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >onsubmit</code
                >
                is async,
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >loadingAuto</code
                >
                (default
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">true</code
                >) flips
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >form.loading</code
                > for the duration. Use it to disable buttons or show spinners.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={asyncForm}
                bind:state={asyncState}
                validate={validateAsync}
                onsubmit={handleAsyncSubmit}
                class="max-w-md space-y-4"
            >
                <FormField name="username" label="Username" required>
                    <Input bind:value={asyncState.username} placeholder="johndoe" />
                </FormField>

                <Button type="submit" loading={asyncForm?.loading}>
                    {asyncForm?.loading ? 'Creating...' : 'Create user'}
                </Button>
            </Form>

            {#if asyncResult}
                <p
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    {asyncResult}
                </p>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 4 — Programmatic API                                   -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Programmatic API — bind:api</h2>
            <p class="text-sm text-on-surface-variant">
                Bind the <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >api</code
                >
                prop to control the form from outside: trigger
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >submit()</code
                >,
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >validate()</code
                >,
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >setErrors()</code
                >, read
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >errors</code
                >,
                <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">dirty</code
                >, etc.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={apiForm}
                bind:state={apiState}
                validate={validateApi}
                class="max-w-md space-y-4"
            >
                <FormField name="note" label="Note">
                    <Textarea bind:value={apiState.note} rows={2} />
                </FormField>
            </Form>

            <div class="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" onclick={() => apiForm?.submit()}>submit()</Button>
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() => apiForm?.validate({ silent: true })}
                >
                    validate(silent)
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onclick={() =>
                        apiForm?.setErrors([
                            { name: 'note', message: 'Custom error from outside' }
                        ])}
                >
                    setErrors()
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    color="secondary"
                    onclick={() => apiForm?.clear()}
                >
                    clear()
                </Button>
            </div>

            <dl class="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div>
                    <dt class="text-on-surface-variant">dirty</dt>
                    <dd class="font-mono text-on-surface">{String(apiForm?.dirty ?? false)}</dd>
                </div>
                <div>
                    <dt class="text-on-surface-variant">loading</dt>
                    <dd class="font-mono text-on-surface">{String(apiForm?.loading ?? false)}</dd>
                </div>
                <div>
                    <dt class="text-on-surface-variant">errors</dt>
                    <dd class="font-mono text-on-surface">{apiForm?.errors.length ?? 0}</dd>
                </div>
                <div>
                    <dt class="text-on-surface-variant">touched</dt>
                    <dd class="font-mono text-on-surface">
                        {apiForm?.touchedFields.size ?? 0}
                    </dd>
                </div>
            </dl>
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 5 — Async field validation                             -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Async validation</h2>
            <p class="text-sm text-on-surface-variant">
                The <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                    >validate</code
                >
                prop accepts an async function. Submit blocks until the promise resolves; try usernames
                like
                <code class="rounded bg-surface-container-highest px-1 text-xs">admin</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">root</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">svelte</code>
                to see the "already taken" error.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={availabilityForm}
                bind:state={availabilityState}
                validate={validateAvailability}
                onsubmit={handleAvailabilitySubmit}
                class="max-w-md space-y-4"
            >
                <FormField name="username" label="Username" required help="Try 'admin' or 'svelte'">
                    <Input bind:value={availabilityState.username} placeholder="your-handle" />
                </FormField>

                <Button type="submit" loading={availabilityForm?.loading}>
                    {availabilityForm?.loading ? 'Checking…' : 'Check availability'}
                </Button>
            </Form>

            {#if availabilityResult}
                <p
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    {availabilityResult}
                </p>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 6 — Array / repeater fields (nested Form per row)      -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Array fields (repeater)</h2>
            <p class="text-sm text-on-surface-variant">
                Each row is a <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >&lt;Form nested name="guests.&#123;index&#125;"&gt;</code
                >
                with its own item schema. FormField inside uses relative names (<code
                    class="rounded bg-surface-container-highest px-1 text-xs">name</code
                >,
                <code class="rounded bg-surface-container-highest px-1 text-xs">email</code>) — no
                dotted paths, no regex. Validation scope is local to the row, so blurring row 3 only
                validates row 3. The parent enforces array-level rules (min length) via a small
                custom validator.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={guestsForm}
                bind:state={guestsState}
                validate={validateGuestsLength}
                onsubmit={handleGuestsSubmit}
                class="space-y-4"
            >
                {#each guestsState.guests as guest, index (index)}
                    <div
                        class="grid gap-3 rounded-md border border-outline-variant bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]"
                    >
                        <Form
                            nested
                            name="guests.{index}"
                            schema={guestItemSchema}
                            class="contents"
                        >
                            <FormField name="name" label="Name">
                                <Input bind:value={guest.name} placeholder="Jane Doe" />
                            </FormField>

                            <FormField name="email" label="Email">
                                <Input
                                    type="email"
                                    bind:value={guest.email}
                                    placeholder="jane@example.com"
                                />
                            </FormField>

                            <div class="flex items-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    color="error"
                                    icon="lucide:trash-2"
                                    square
                                    disabled={guestsState.guests.length === 1}
                                    onclick={() => removeGuest(index)}
                                />
                            </div>
                        </Form>
                    </div>
                {/each}

                <div class="flex items-center gap-3">
                    <Button type="button" variant="outline" icon="lucide:plus" onclick={addGuest}>
                        Add guest
                    </Button>
                    <Button type="submit">Submit ({guestsState.guests.length})</Button>
                </div>
            </Form>

            {#if guestsSubmitted}
                <div
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    <p class="font-medium">Submitted:</p>
                    <pre class="mt-1 overflow-x-auto text-xs">{guestsSubmitted}</pre>
                </div>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 7 — Dependent fields (confirm password)                -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Dependent fields</h2>
            <p class="text-sm text-on-surface-variant">
                Zod's <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >.refine()</code
                >
                compares two fields against each other and attaches the error to the
                <code class="rounded bg-surface-container-highest px-1 text-xs">confirm</code> field
                via
                <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >path: ['confirm']</code
                >. Valibot uses
                <code class="rounded bg-surface-container-highest px-1 text-xs">v.forward()</code>,
                Yup uses
                <code class="rounded bg-surface-container-highest px-1 text-xs">yup.ref()</code>,
                Joi uses
                <code class="rounded bg-surface-container-highest px-1 text-xs">Joi.ref()</code> — all
                four libs support this natively, no custom validator needed.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={passwordForm}
                bind:state={passwordState}
                schema={passwordSchema}
                onsubmit={handlePasswordSubmit}
                class="max-w-md space-y-4"
            >
                <FormField name="password" label="Password" required>
                    <Input type="password" bind:value={passwordState.password} />
                </FormField>

                <FormField name="confirm" label="Confirm password" required>
                    <Input type="password" bind:value={passwordState.confirm} />
                </FormField>

                <Button type="submit">Set password</Button>
            </Form>

            {#if passwordDone}
                <p
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    ✓ Password set successfully
                </p>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 8 — Nested forms                                       -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Nested forms</h2>
            <p class="text-sm text-on-surface-variant">
                A child <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >&lt;Form nested name="address"&gt;</code
                >
                attaches to its parent on mount. When the parent submits, it cascades validation to every
                attached child. Child errors are prefixed with the child's
                <code class="rounded bg-surface-container-highest px-1 text-xs">name</code> (e.g.
                <code class="rounded bg-surface-container-highest px-1 text-xs">address.street</code
                >) and merged into the parent payload. Each form uses its own schema.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={nestedForm}
                bind:state={nestedState}
                schema={nestedSchema}
                onsubmit={handleNestedSubmit}
                class="max-w-xl space-y-4"
            >
                <FormField name="fullName" label="Full name" required>
                    <Input bind:value={nestedState.fullName} placeholder="Jane Doe" />
                </FormField>

                <fieldset class="space-y-3 rounded-md border border-outline-variant bg-surface p-4">
                    <legend class="px-2 text-sm font-medium text-on-surface">Address</legend>
                    <Form nested name="address" schema={addressSchema}>
                        <FormField name="street" label="Street" required>
                            <Input
                                bind:value={nestedState.address.street}
                                placeholder="123 Main St"
                            />
                        </FormField>
                        <FormField name="city" label="City" required>
                            <Input bind:value={nestedState.address.city} placeholder="Hanoi" />
                        </FormField>
                    </Form>
                </fieldset>

                <Button type="submit">Submit</Button>
            </Form>

            {#if nestedSubmitted}
                <div
                    class="mt-4 rounded-md border border-primary/20 bg-primary-container p-3 text-sm text-on-primary-container"
                >
                    <p class="font-medium">Submitted (parent + child merged):</p>
                    <pre class="mt-1 overflow-x-auto text-xs">{nestedSubmitted}</pre>
                </div>
            {/if}
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Example 9 — Error summary + reset                              -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <div>
            <h2 class="text-lg font-semibold text-on-surface">Error summary + reset</h2>
            <p class="text-sm text-on-surface-variant">
                Read <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >form.errors</code
                >
                reactively to render a summary of all validation errors at the top of the form. The
                <code class="rounded bg-surface-container-highest px-1 text-xs">reset()</code>
                method clears errors, dirty/touched/blurred sets, and
                <code class="rounded bg-surface-container-highest px-1 text-xs">submitCount</code>
                — you restore
                <code class="rounded bg-surface-container-highest px-1 text-xs">state</code> yourself.
            </p>
        </div>

        <div class="rounded-lg border border-outline-variant bg-surface-container p-6">
            <Form
                bind:api={summaryForm}
                bind:state={summaryState}
                schema={summarySchema}
                class="max-w-xl space-y-4"
            >
                {#if summaryForm && summaryForm.errors.length > 0}
                    <div
                        class="rounded-md border border-error/30 bg-error-container p-3 text-sm text-on-error-container"
                    >
                        <p class="font-medium">
                            Please fix {summaryForm.errors.length} error{summaryForm.errors.length >
                            1
                                ? 's'
                                : ''}:
                        </p>
                        <ul class="mt-1 list-inside list-disc">
                            {#each summaryForm.errors as err (err.name)}
                                <li>
                                    <strong>{err.name}:</strong>
                                    {err.message}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <FormField name="title" label="Title" required>
                    <Input bind:value={summaryState.title} />
                </FormField>

                <FormField name="description" label="Description" required>
                    <Textarea bind:value={summaryState.description} rows={3} />
                </FormField>

                <FormField name="category" label="Category" required>
                    <Select
                        bind:value={summaryState.category}
                        items={summaryCategories}
                        placeholder="Choose…"
                    />
                </FormField>

                <div class="flex flex-wrap items-center gap-3">
                    <Button type="submit">Submit</Button>
                    <Button type="button" variant="ghost" color="secondary" onclick={resetSummary}>
                        Reset
                    </Button>
                    <span class="text-xs text-on-surface-variant">
                        Submitted {summaryForm?.submitCount ?? 0} time(s)
                    </span>
                </div>
            </Form>
        </div>
    </section>

    <!-- ============================================================ -->
    <!-- Features list                                                  -->
    <!-- ============================================================ -->
    <section class="space-y-4">
        <h2 class="text-lg font-semibold text-on-surface">Features</h2>
        <ul class="list-inside list-disc space-y-1 text-sm text-on-surface-variant">
            <li>
                Supported libraries: <strong>Zod 3.24+</strong>, <strong>Valibot 1.0+</strong>,
                <strong>Yup 1.7+</strong> (via Standard Schema), and <strong>Joi 17+</strong>
                (dedicated adapter). User installs whichever they prefer.
            </li>
            <li>
                Custom <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >validate</code
                > function, sync or async (can run alongside schema)
            </li>
            <li>
                Full programmatic API: <code
                    class="rounded bg-surface-container-highest px-1 text-xs">submit</code
                >, <code class="rounded bg-surface-container-highest px-1 text-xs">validate</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">clear</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">reset</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">setErrors</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">getErrors</code>
                + reactive
                <code class="rounded bg-surface-container-highest px-1 text-xs">errors</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">loading</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">dirty</code>,
                <code class="rounded bg-surface-container-highest px-1 text-xs">submitCount</code>
            </li>
            <li>
                Field-level validation on <code
                    class="rounded bg-surface-container-highest px-1 text-xs">input</code
                >
                / <code class="rounded bg-surface-container-highest px-1 text-xs">blur</code> /
                <code class="rounded bg-surface-container-highest px-1 text-xs">change</code>
                / <code class="rounded bg-surface-container-highest px-1 text-xs">focus</code>
            </li>
            <li>Debounced input validation with eager-after-first-blur behavior</li>
            <li>Dirty / touched / blurred field tracking</li>
            <li>
                Auto loading state during async submit (<code
                    class="rounded bg-surface-container-highest px-1 text-xs">loadingAuto</code
                >)
            </li>
            <li>
                Nested forms via <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >nested</code
                >
                + <code class="rounded bg-surface-container-highest px-1 text-xs">name</code> props
            </li>
            <li>
                Schema transform output (e.g. Zod <code
                    class="rounded bg-surface-container-highest px-1 text-xs">.transform()</code
                >)
            </li>
            <li>
                Regex <code class="rounded bg-surface-container-highest px-1 text-xs"
                    >errorPattern</code
                > on FormField for array-style fields
            </li>
            <li>
                Full programmatic API via <code
                    class="rounded bg-surface-container-highest px-1 text-xs">bind:api</code
                >
            </li>
        </ul>
    </section>
</div>
