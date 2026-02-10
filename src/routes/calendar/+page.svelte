<script lang="ts">
    import { Calendar, Button, Popover, Icon } from '$lib/index.js'
    import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
    import type { DateValue } from '@internationalized/date'
    import type { DateRange } from 'bits-ui'

    // Date picker (Button + Popover)
    let datePickerValue: DateValue | undefined = $state(undefined)
    let datePickerOpen = $state(false)

    // Range date picker
    let rangeDatePickerValue: DateRange | undefined = $state(undefined)
    let rangeDatePickerOpen = $state(false)

    function formatDate(date: DateValue | undefined): string {
        if (!date) return 'Pick a date'
        return date.toDate('UTC').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    function formatRange(range: DateRange | undefined): string {
        if (!range?.start) return 'Pick a date range'
        const start = range.start
            .toDate('UTC')
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (!range.end) return `${start} - ...`
        const end = range.end
            .toDate('UTC')
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return `${start} - ${end}`
    }

    // Single value
    let singleValue: DateValue | undefined = $state(undefined)

    // Multiple values
    let multipleValues: DateValue[] | undefined = $state([
        new CalendarDate(2024, 3, 10),
        new CalendarDate(2024, 3, 15),
        new CalendarDate(2024, 3, 20)
    ])

    // Range value
    let rangeValue: DateRange | undefined = $state({
        start: new CalendarDate(2024, 3, 10),
        end: new CalendarDate(2024, 3, 20)
    })

    // Disabled dates (weekends)
    function isWeekend(date: DateValue): boolean {
        const jsDate = date.toDate('UTC')
        const day = jsDate.getDay()
        return day === 0 || day === 6
    }

    // Unavailable dates
    function isHoliday(date: DateValue): boolean {
        return date.month === 3 && (date.day === 25 || date.day === 26)
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
    const variants = ['solid', 'outline', 'soft', 'subtle'] as const
</script>

<div class="space-y-12">
    <header>
        <h1 class="text-3xl font-bold text-on-surface">Calendar</h1>
        <p class="mt-2 text-on-surface-variant">
            A date selection component that supports single, multiple, and range selection modes.
            Built on bits-ui Calendar and RangeCalendar primitives.
        </p>
    </header>

    <!-- Date Picker (Button + Popover) -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Date Picker</h2>
        <p class="text-sm text-on-surface-variant">
            Combine <code class="text-primary">Calendar</code> with
            <code class="text-primary">Button</code> and
            <code class="text-primary">Popover</code> to create a date picker.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Single Date</p>
                <Popover
                    bind:open={datePickerOpen}
                >
                    <Button variant="outline" color="surface" class="w-56 justify-start">
                        <span class="flex items-center gap-2">
                            <Icon name="lucide:calendar" class="size-4" />
                            <span
                                class={datePickerValue
                                    ? 'text-on-surface'
                                    : 'text-on-surface-variant'}
                            >
                                {formatDate(datePickerValue)}
                            </span>
                        </span>
                    </Button>
                    {#snippet content({ close })}
                        <Calendar bind:value={datePickerValue} class="p-2" onValueChange={() => close()} />
                    {/snippet}
                </Popover>
            </div>

            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Date Range</p>
                <Popover
                    bind:open={rangeDatePickerOpen}
                >
                    <Button variant="outline" color="surface" class="w-72 justify-start">
                        <span class="flex items-center gap-2">
                            <Icon name="lucide:calendar" class="size-4" />
                            <span
                                class={rangeDatePickerValue?.start
                                    ? 'text-on-surface'
                                    : 'text-on-surface-variant'}
                            >
                                {formatRange(rangeDatePickerValue)}
                            </span>
                        </span>
                    </Button>
                    {#snippet content()}
                        <Calendar range bind:value={rangeDatePickerValue} numberOfMonths={2} />
                    {/snippet}
                </Popover>
            </div>
        </div>
    </section>

    <!-- Basic Usage -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Basic Usage</h2>
        <p class="text-sm text-on-surface-variant">A simple calendar with single date selection.</p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar bind:value={singleValue} />
            <div class="text-sm text-on-surface-variant">
                <p>
                    Selected: <code class="text-primary">{singleValue?.toString() ?? 'none'}</code>
                </p>
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Colors</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="text-primary">color</code> prop to change the selected day color.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            {#each colors as color (color)}
                <div class="space-y-2">
                    <p class="text-center text-xs font-medium text-on-surface-variant capitalize">
                        {color}
                    </p>
                    <Calendar {color} value={today(getLocalTimeZone())} size="xs" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Variants -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Variants</h2>
        <p class="text-sm text-on-surface-variant">
            Use the <code class="text-primary">variant</code> prop to change the visual style.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            {#each variants as variant (variant)}
                <div class="space-y-2">
                    <p class="text-center text-xs font-medium text-on-surface-variant capitalize">
                        {variant}
                    </p>
                    <Calendar {variant} value={today(getLocalTimeZone())} size="sm" />
                </div>
            {/each}
        </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Sizes</h2>
        <p class="text-sm text-on-surface-variant">
            Control the calendar size with the <code class="text-primary">size</code> prop.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            {#each sizes as size (size)}
                <div class="space-y-2">
                    <p class="text-center text-xs font-medium text-on-surface-variant uppercase">
                        {size}
                    </p>
                    <Calendar {size} />
                </div>
            {/each}
        </div>
    </section>

    <!-- Multiple Selection -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Multiple Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">type="multiple"</code> to allow selecting multiple dates.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar
                type="multiple"
                bind:value={multipleValues}
                placeholder={new CalendarDate(2024, 3, 1)}
            />
            <div class="text-sm text-on-surface-variant">
                <p class="font-medium">Selected dates:</p>
                {#if multipleValues?.length}
                    <ul class="mt-1 list-inside list-disc">
                        {#each multipleValues as date (date.toString())}
                            <li><code class="text-primary">{date.toString()}</code></li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-on-surface-variant/60">No dates selected</p>
                {/if}
            </div>
        </div>
    </section>

    <!-- Range Selection -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Range Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">range</code> prop to enable date range selection.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar
                range
                bind:value={rangeValue}
                placeholder={new CalendarDate(2024, 3, 1)}
                numberOfMonths={2}
            />
            <div class="text-sm text-on-surface-variant">
                <p>
                    Start: <code class="text-primary"
                        >{rangeValue?.start?.toString() ?? 'none'}</code
                    >
                </p>
                <p>
                    End: <code class="text-primary">{rangeValue?.end?.toString() ?? 'none'}</code>
                </p>
            </div>
        </div>
    </section>

    <!-- Multiple Months -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Multiple Months</h2>
        <p class="text-sm text-on-surface-variant">
            Display multiple months with the <code class="text-primary">numberOfMonths</code> prop.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar numberOfMonths={2} />
        </div>
    </section>

    <!-- Year Navigation -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Year Navigation</h2>
        <p class="text-sm text-on-surface-variant">
            Enable year navigation controls with <code class="text-primary">yearControls</code>.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar yearControls />
        </div>
    </section>

    <!-- Fixed Weeks -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Fixed Weeks</h2>
        <p class="text-sm text-on-surface-variant">
            Always display 6 weeks with <code class="text-primary">fixedWeeks</code> for consistent height.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Fixed Weeks</p>
                <Calendar fixedWeeks />
            </div>
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Default</p>
                <Calendar />
            </div>
        </div>
    </section>

    <!-- Disabled Dates -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled Dates</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">isDateDisabled</code> to disable specific dates (weekends in
            this example).
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar isDateDisabled={isWeekend} />
        </div>
    </section>

    <!-- Unavailable Dates -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Unavailable Dates</h2>
        <p class="text-sm text-on-surface-variant">
            Use <code class="text-primary">isDateUnavailable</code> to mark dates as unavailable (users
            can still focus them).
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar isDateUnavailable={isHoliday} placeholder={new CalendarDate(2024, 3, 1)} />
        </div>
    </section>

    <!-- Min/Max Values -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Min/Max Values</h2>
        <p class="text-sm text-on-surface-variant">
            Restrict selection to a date range with <code class="text-primary">minValue</code> and
            <code class="text-primary">maxValue</code>.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar
                minValue={new CalendarDate(2024, 3, 5)}
                maxValue={new CalendarDate(2024, 3, 25)}
                placeholder={new CalendarDate(2024, 3, 1)}
            />
        </div>
    </section>

    <!-- Disabled -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Disabled</h2>
        <p class="text-sm text-on-surface-variant">
            Disable the entire calendar with the <code class="text-primary">disabled</code> prop.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar disabled />
        </div>
    </section>

    <!-- Readonly -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Readonly</h2>
        <p class="text-sm text-on-surface-variant">
            Make the calendar readonly (navigable but not selectable) with <code
                class="text-primary">readonly</code
            >.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar readonly value={today(getLocalTimeZone())} />
        </div>
    </section>

    <!-- Locale -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Locale</h2>
        <p class="text-sm text-on-surface-variant">
            Change the locale with the <code class="text-primary">locale</code> prop.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">English (default)</p>
                <Calendar locale="en" size="sm" />
            </div>
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Vietnamese</p>
                <Calendar locale="vi" size="sm" />
            </div>
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Japanese</p>
                <Calendar locale="ja" size="sm" />
            </div>
        </div>
    </section>

    <!-- Week Starts On -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">Week Starts On</h2>
        <p class="text-sm text-on-surface-variant">
            Control the first day of the week with <code class="text-primary">weekStartsOn</code>.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Sunday (0)</p>
                <Calendar weekStartsOn={0} size="sm" />
            </div>
            <div class="space-y-2">
                <p class="text-xs font-medium text-on-surface-variant">Monday (1)</p>
                <Calendar weekStartsOn={1} size="sm" />
            </div>
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold text-on-surface">UI Slot Overrides</h2>
        <p class="text-sm text-on-surface-variant">
            Customize individual parts with the <code class="text-primary">ui</code> prop.
        </p>
        <div
            class="flex flex-wrap items-start gap-6 rounded-lg border border-outline-variant bg-surface-container-low p-6"
        >
            <Calendar
                ui={{
                    root: 'shadow-xl',
                    heading: 'text-primary',
                    headCell: 'text-primary/60'
                }}
            />
        </div>
    </section>
</div>
