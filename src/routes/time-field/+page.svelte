<script lang="ts">
    import { TimeField, Form, FormField, Button } from '$lib/index.js'
    import type { FormApi } from '$lib/index.js'
    import type { TimeValue } from 'bits-ui'
    import { z } from 'zod'
    import { Time } from '@internationalized/date'

    let basicValue: TimeValue | undefined = $state(undefined)
    let controlledValue: TimeValue | undefined = $state(new Time(9, 30))

    const openTime = new Time(9, 0)
    const closeTime = new Time(17, 0)

    const formSchema = z.object({
        meeting: z.custom<TimeValue>((v) => v !== null && v !== undefined, {
            message: 'Meeting time is required'
        })
    })

    let formState = $state<{ meeting: TimeValue | undefined }>({ meeting: undefined })
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
        <h1 class="text-2xl font-bold">Time Field</h1>
        <p class="text-on-surface-variant">
            A segmented time input built on the bits-ui TimeField primitive. Each part (hour,
            minute, AM/PM) is an individually focusable spinbutton: type digits, use the arrow keys,
            or tab between segments. Pairs with DatePicker via its <code>timeInput</code> prop for datetime
            flows.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <TimeField bind:value={basicValue} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Value: {basicValue ? basicValue.toString() : 'none'}
            </p>
        </div>
    </section>

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Bind <code>value</code> and <code>placeholder</code> for full control. The value is a
            <code>Time</code>, <code>CalendarDateTime</code>, or <code>ZonedDateTime</code>; only
            the time portion is edited.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <TimeField bind:value={controlledValue} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Value: {controlledValue?.toString() ?? 'none'}
            </p>
        </div>
    </section>

    <!-- Granularity & hour cycle -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Granularity &amp; Hour Cycle</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Hour only</p>
                    <TimeField granularity="hour" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">With seconds</p>
                    <TimeField granularity="second" />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">24 hour cycle</p>
                    <TimeField hourCycle={24} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Vietnamese locale</p>
                    <TimeField locale="vi" />
                </div>
            </div>
        </div>
    </section>

    <!-- Restrictions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Restrictions</h2>
        <p class="text-sm text-on-surface-variant">
            Times outside <code>minValue</code>/<code>maxValue</code> mark the field invalid with
            the error ring; <code>validate</code> and <code>onInvalid</code> hook into custom rules.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Office hours (9:00 – 17:00)
                    </p>
                    <TimeField minValue={openTime} maxValue={closeTime} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Full hours only (validate)
                    </p>
                    <TimeField
                        validate={(t) => (t.minute !== 0 ? 'Pick a full hour' : undefined)}
                    />
                </div>
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
                    <TimeField disabled value={new Time(10, 30)} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly</p>
                    <TimeField readonly value={new Time(10, 30)} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly hour segment</p>
                    <TimeField readonlySegments={['hour']} value={new Time(10, 30)} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">No icon</p>
                    <TimeField icon={false} />
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
                    <TimeField {size} />
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
                        <TimeField {variant} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The color applies to the field focus ring and the focused segment tint.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each colors as color (color)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                        <TimeField {color} highlight />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Form integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form Integration</h2>
        <p class="text-sm text-on-surface-variant">
            Wrapped in <code>FormField</code>, the field inherits validation state, error color, and
            aria attributes automatically. With a <code>name</code>, a hidden input submits the ISO
            time string natively.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Form
                bind:api={formApi}
                schema={formSchema}
                bind:state={formState}
                onsubmit={handleSubmit}
                class="max-w-xs space-y-4"
            >
                <FormField
                    name="meeting"
                    label="Meeting time"
                    required
                    help="Pick a time between 9:00 and 17:00"
                >
                    <TimeField
                        bind:value={formState.meeting}
                        minValue={openTime}
                        maxValue={closeTime}
                    />
                </FormField>
                <Button type="submit" loading={formApi?.loading}>Submit</Button>
            </Form>
            {#if submitted}
                <pre class="mt-4 rounded-md bg-surface p-3 text-xs">{submitted}</pre>
            {/if}
        </div>
    </section>
</div>
