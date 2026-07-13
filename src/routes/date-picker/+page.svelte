<script lang="ts">
    import { DatePicker, Form, FormField, Button } from '$lib/index.js'
    import type { FormApi } from '$lib/index.js'
    import { z } from 'zod'
    import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
    import type { DateValue } from '@internationalized/date'

    let basicValue: DateValue | undefined = $state(undefined)
    let controlledOpen = $state(false)
    let controlledValue: DateValue | undefined = $state(new CalendarDate(2024, 3, 15))

    const todayDate = today(getLocalTimeZone())
    const minDate = todayDate.subtract({ days: 7 })
    const maxDate = todayDate.add({ days: 30 })

    const markedDays = new Set([1, 7, 14, 23])
    const isDayMarked = (d: DateValue) => markedDays.has(d.day)

    function isWeekend(date: DateValue): boolean {
        const day = date.toDate('UTC').getDay()
        return day === 0 || day === 6
    }

    const formSchema = z.object({
        birthday: z.custom<DateValue>((v) => v !== null && v !== undefined, {
            message: 'Birthday is required'
        })
    })

    let formState = $state<{ birthday: DateValue | undefined }>({ birthday: undefined })
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
        <h1 class="text-2xl font-bold">Date Picker</h1>
        <p class="text-on-surface-variant">
            A segmented date input with a calendar popover. Built on the bits-ui DatePicker
            primitive, combining DateField, Popover, and Calendar in a single accessible component.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <DatePicker bind:value={basicValue} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Selected: {basicValue ? basicValue.toString() : 'none'}
            </p>
        </div>
    </section>

    <!-- Controlled -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Controlled</h2>
        <p class="text-sm text-on-surface-variant">
            Bind <code>value</code>, <code>open</code>, and <code>placeholder</code> for full control.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-xs">
                <DatePicker bind:value={controlledValue} bind:open={controlledOpen} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Open: {controlledOpen} · Value: {controlledValue?.toString() ?? 'none'}
            </p>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex max-w-xs flex-col gap-3">
                {#each sizes as size (size)}
                    <DatePicker {size} />
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
                        <DatePicker {variant} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The color applies to the field focus ring and the calendar selection.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each colors as color (color)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                        <DatePicker {color} highlight />
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
                    <DatePicker disabled value={new CalendarDate(2024, 3, 15)} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly</p>
                    <DatePicker readonly value={new CalendarDate(2024, 3, 15)} />
                </div>
            </div>
        </div>
    </section>

    <!-- Restrictions -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Restrictions</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Min / max (±7 to +30 days)
                    </p>
                    <DatePicker minValue={minDate} maxValue={maxDate} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Weekends disabled</p>
                    <DatePicker isDateDisabled={isWeekend} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Marked days</p>
                    <DatePicker isDateHighlightable={isDayMarked} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Keep open on select</p>
                    <DatePicker closeOnDateSelect={false} />
                </div>
            </div>
        </div>
    </section>

    <!-- Localization & layout -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Localization &amp; Layout</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Vietnamese locale</p>
                    <DatePicker locale="vi" weekStartsOn={1} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Two months</p>
                    <DatePicker numberOfMonths={2} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Week numbers</p>
                    <DatePicker weekNumbers />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Date &amp; time</p>
                    <DatePicker granularity="minute" hourCycle={24} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Soft calendar variant</p>
                    <DatePicker calendarVariant="soft" />
                </div>
            </div>
        </div>
    </section>

    <!-- Time input -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Time Input</h2>
        <p class="text-sm text-on-surface-variant">
            <code>timeInput</code> adds a segmented time field below the calendar and keeps the
            popover open after picking a date. It implies <code>granularity="minute"</code> and
            follows <code>hourCycle</code> and <code>locale</code>.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Date &amp; time</p>
                    <DatePicker timeInput />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        24 hour cycle, seconds
                    </p>
                    <DatePicker timeInput granularity="second" hourCycle={24} />
                </div>
            </div>
        </div>
    </section>

    <!-- Form integration -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Form Integration</h2>
        <p class="text-sm text-on-surface-variant">
            Wrapped in <code>FormField</code>, the picker inherits validation state, error color,
            and aria attributes automatically.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Form
                bind:api={formApi}
                schema={formSchema}
                bind:state={formState}
                onsubmit={handleSubmit}
                class="max-w-xs space-y-4"
            >
                <FormField name="birthday" label="Birthday" required help="Pick your birth date">
                    <DatePicker
                        bind:value={formState.birthday}
                        maxValue={todayDate}
                        initialFocus={false}
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
