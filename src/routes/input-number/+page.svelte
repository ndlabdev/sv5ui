<script lang="ts">
    import { InputNumber, Form, FormField, Button } from '$lib/index.js'
    import type { FormApi } from '$lib/index.js'
    import { z } from 'zod'

    let basicValue = $state<number | null>(null)
    let quantityValue = $state<number | null>(1)
    let priceValue = $state<number | null>(19.99)
    let percentValue = $state<number | null>(0.25)
    let localeValue = $state<number | null>(1234.5)
    let verticalValue = $state<number | null>(5)

    const formSchema = z.object({
        seats: z
            .number()
            .min(1, 'At least 1 seat')
            .max(50, 'At most 50 seats')
            .nullable()
            .refine((v) => v !== null, 'Number of seats is required')
    })

    let formState = $state<{ seats: number | null }>({ seats: null })
    let formApi = $state<FormApi<unknown>>()
    let submitted = $state<string | null>(null)

    function handleSubmit(event: { data: unknown }) {
        submitted = JSON.stringify(event.data, null, 2)
    }

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
    const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Input Number</h1>
        <p class="text-on-surface-variant">
            A numeric input with increment/decrement controls, locale-aware formatting and parsing,
            min/max clamping, and step snapping. Hold a stepper to repeat, use the arrow keys, or
            scroll while focused.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <InputNumber bind:value={basicValue} placeholder="Enter a number" />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Value: {basicValue ?? 'null'}
            </p>
        </div>
    </section>

    <!-- Min / max / step -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Min / Max / Step</h2>
        <p class="text-sm text-on-surface-variant">
            Typed values are clamped on commit; stepper, keyboard, and wheel operations snap to the
            step grid and the steppers disable at the boundaries.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Quantity (1–10)</p>
                    <InputNumber bind:value={quantityValue} min={1} max={10} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Step 0.5</p>
                    <InputNumber min={0} max={5} step={0.5} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Step 5, no snapping</p>
                    <InputNumber step={5} stepSnapping={false} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Negative range</p>
                    <InputNumber min={-100} max={100} step={10} />
                </div>
            </div>
        </div>
    </section>

    <!-- Format options -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Format Options</h2>
        <p class="text-sm text-on-surface-variant">
            Any <code>Intl.NumberFormat</code> options are supported; input is parsed back through the
            same format.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Currency (USD)</p>
                    <InputNumber
                        bind:value={priceValue}
                        formatOptions={{ style: 'currency', currency: 'USD' }}
                        min={0}
                        step={0.01}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Percent</p>
                    <InputNumber
                        bind:value={percentValue}
                        formatOptions={{ style: 'percent' }}
                        min={0}
                        max={1}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Fixed decimals</p>
                    <InputNumber
                        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Unit (kilometers)</p>
                    <InputNumber formatOptions={{ style: 'unit', unit: 'kilometer' }} />
                </div>
            </div>
        </div>
    </section>

    <!-- Locale -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Locale</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">German (de-DE)</p>
                    <InputNumber bind:value={localeValue} locale="de-DE" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Vietnamese (vi-VN, VND)
                    </p>
                    <InputNumber
                        locale="vi-VN"
                        formatOptions={{ style: 'currency', currency: 'VND' }}
                        step={1000}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Orientation -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Orientation</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Horizontal (default)</p>
                    <InputNumber value={5} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Vertical</p>
                    <InputNumber bind:value={verticalValue} orientation="vertical" />
                </div>
            </div>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex max-w-xs flex-col gap-3">
                {#each sizes as size (size)}
                    <InputNumber {size} value={42} />
                {/each}
            </div>
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each variants as variant (variant)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{variant}</p>
                        <InputNumber {variant} value={42} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each colors as color (color)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                        <InputNumber {color} highlight value={42} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- States -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">States</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Disabled</p>
                    <InputNumber disabled value={42} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly</p>
                    <InputNumber readonly value={42} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">No wheel change</p>
                    <InputNumber disableWheelChange value={42} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Custom icons</p>
                    <InputNumber
                        incrementIcon="lucide:chevron-right"
                        decrementIcon="lucide:chevron-left"
                        value={42}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Custom stepper buttons
                    </p>
                    <InputNumber
                        increment={{ variant: 'soft', color: 'primary' }}
                        decrement={{ variant: 'soft', color: 'error' }}
                        ui={{ increment: 'end-1 inset-y-1', decrement: 'start-1 inset-y-1' }}
                        value={42}
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Form integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form Integration</h2>
        <p class="text-sm text-on-surface-variant">
            Wrapped in <code>FormField</code>, the field inherits validation state, error color, and
            aria attributes automatically. A hidden input carries the raw numeric value for native
            form submission.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Form
                bind:api={formApi}
                schema={formSchema}
                bind:state={formState}
                onsubmit={handleSubmit}
                class="max-w-xs space-y-4"
            >
                <FormField name="seats" label="Seats" required help="Between 1 and 50">
                    <InputNumber bind:value={formState.seats} min={1} max={50} />
                </FormField>
                <Button type="submit" loading={formApi?.loading}>Submit</Button>
            </Form>
            {#if submitted}
                <pre class="mt-4 rounded-md bg-surface p-3 text-xs">{submitted}</pre>
            {/if}
        </div>
    </section>
</div>
