<script lang="ts">
    import { DateRangePicker, Form, FormField, Button } from '$lib/index.js'
    import type { FormApi } from '$lib/index.js'
    import { z } from 'zod'
    import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
    import type { DateValue } from '@internationalized/date'
    import type { DateRange } from 'bits-ui'

    let basicValue: DateRange | undefined = $state(undefined)
    let controlledOpen = $state(false)
    let controlledValue: DateRange | undefined = $state({
        start: new CalendarDate(2024, 3, 10),
        end: new CalendarDate(2024, 3, 20)
    })

    const todayDate = today(getLocalTimeZone())
    const minDate = todayDate.subtract({ days: 7 })
    const maxDate = todayDate.add({ days: 60 })

    const markedDays = new Set([1, 7, 14, 23])
    const isDayMarked = (d: DateValue) => markedDays.has(d.day)

    function isWeekend(date: DateValue): boolean {
        const day = date.toDate('UTC').getDay()
        return day === 0 || day === 6
    }

    const formSchema = z.object({
        stay: z.custom<DateRange>((v) => {
            const range = v as DateRange | undefined
            return range?.start !== undefined && range?.end !== undefined
        }, 'A complete stay range is required')
    })

    let formState = $state<{ stay: DateRange | undefined }>({ stay: undefined })
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

    function formatRange(range: DateRange | undefined): string {
        const start = range?.start?.toString()
        const end = range?.end?.toString()
        if (!start && !end) return 'none'
        return `${start ?? '…'} to ${end ?? '…'}`
    }
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Date Range Picker</h1>
        <p class="text-on-surface-variant">
            Two segmented date inputs with a shared range calendar popover. Built on the bits-ui
            DateRangePicker primitive, combining DateRangeField, Popover, and RangeCalendar in a
            single accessible component.
        </p>
    </div>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-sm">
                <DateRangePicker bind:value={basicValue} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Selected: {formatRange(basicValue)}
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
            <div class="max-w-sm">
                <DateRangePicker bind:value={controlledValue} bind:open={controlledOpen} />
            </div>
            <p class="mt-2 text-sm text-on-surface-variant">
                Open: {controlledOpen} · Value: {formatRange(controlledValue)}
            </p>
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="flex max-w-sm flex-col gap-3">
                {#each sizes as size (size)}
                    <DateRangePicker {size} />
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
                        <DateRangePicker {variant} />
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            The color applies to the field focus ring, the selection endpoints, and the range band
            in the calendar.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each colors as color (color)}
                    <div class="space-y-1">
                        <p class="text-sm font-medium text-on-surface-variant">{color}</p>
                        <DateRangePicker {color} highlight />
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
                    <DateRangePicker
                        disabled
                        value={{
                            start: new CalendarDate(2024, 3, 10),
                            end: new CalendarDate(2024, 3, 20)
                        }}
                    />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Readonly</p>
                    <DateRangePicker
                        readonly
                        value={{
                            start: new CalendarDate(2024, 3, 10),
                            end: new CalendarDate(2024, 3, 20)
                        }}
                    />
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
                        Min / max (±7 to +60 days)
                    </p>
                    <DateRangePicker minValue={minDate} maxValue={maxDate} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">
                        Between 2 and 7 nights
                    </p>
                    <DateRangePicker minDays={3} maxDays={8} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Weekends disabled</p>
                    <DateRangePicker isDateDisabled={isWeekend} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Marked days</p>
                    <DateRangePicker isDateHighlightable={isDayMarked} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Keep open on select</p>
                    <DateRangePicker closeOnRangeSelect={false} />
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
                    <DateRangePicker locale="vi" weekStartsOn={1} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Single month</p>
                    <DateRangePicker numberOfMonths={1} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Week numbers</p>
                    <DateRangePicker weekNumbers />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Date &amp; time</p>
                    <DateRangePicker granularity="minute" hourCycle={24} />
                </div>
                <div class="space-y-1">
                    <p class="text-sm font-medium text-on-surface-variant">Soft calendar variant</p>
                    <DateRangePicker calendarVariant="soft" />
                </div>
            </div>
        </div>
    </section>

    <!-- Time input -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Time Input</h2>
        <p class="text-sm text-on-surface-variant">
            <code>timeInput</code> adds start and end time fields below the calendar and keeps the
            popover open after picking a range. It implies <code>granularity="minute"</code> and
            follows <code>hourCycle</code> and <code>locale</code>.
        </p>
        <div class="rounded-lg bg-surface-container-high p-4">
            <div class="max-w-md">
                <DateRangePicker timeInput hourCycle={24} />
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
                class="max-w-sm space-y-4"
            >
                <FormField name="stay" label="Stay" required help="Pick check-in and check-out">
                    <DateRangePicker bind:value={formState.stay} minValue={todayDate} />
                </FormField>
                <Button type="submit" loading={formApi?.loading}>Submit</Button>
            </Form>
            {#if submitted}
                <pre class="mt-4 rounded-md bg-surface p-3 text-xs">{submitted}</pre>
            {/if}
        </div>
    </section>
</div>
