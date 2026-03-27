<script lang="ts">
    import { Calendar, Button, Popover, Icon, Separator } from '$lib/index.js'
    import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
    import type { DateValue } from '@internationalized/date'
    import type { DateRange } from 'bits-ui'

    let datePickerValue: DateValue | undefined = $state(undefined)
    let datePickerOpen = $state(false)
    let rangeDatePickerValue: DateRange | undefined = $state(undefined)
    let rangeDatePickerOpen = $state(false)
    let singleValue: DateValue | undefined = $state(undefined)
    let multipleValues: DateValue[] | undefined = $state([
        new CalendarDate(2024, 3, 10),
        new CalendarDate(2024, 3, 15),
        new CalendarDate(2024, 3, 20)
    ])
    let rangeValue: DateRange | undefined = $state({
        start: new CalendarDate(2024, 3, 10),
        end: new CalendarDate(2024, 3, 20)
    })

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

    function isWeekend(date: DateValue): boolean {
        const jsDate = date.toDate('UTC')
        const day = jsDate.getDay()
        return day === 0 || day === 6
    }

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
    const variants = ['solid', 'outline', 'soft', 'subtle'] as const
</script>

<div class="space-y-8">
    <div class="space-y-2">
        <h1 class="text-2xl font-bold">Calendar</h1>
        <p class="text-on-surface-variant">
            A date selection component that supports single, multiple, and range selection modes.
            Built on bits-ui Calendar and RangeCalendar primitives.
        </p>
    </div>

    <!-- Date Picker -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Date Picker</h2>
        <p class="text-sm text-on-surface-variant">
            Combine Calendar with Button and Popover to create a date picker.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Single Date</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Popover bind:open={datePickerOpen}>
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
                            <Calendar
                                bind:value={datePickerValue}
                                class="p-2"
                                onValueChange={() => close()}
                            />
                        {/snippet}
                    </Popover>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Date Range</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Popover bind:open={rangeDatePickerOpen}>
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
                            <Calendar
                                range
                                bind:value={rangeDatePickerValue}
                                class="p-2"
                                numberOfMonths={2}
                            />
                        {/snippet}
                    </Popover>
                </div>
            </div>
        </div>
    </section>

    <!-- Basic -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Basic</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
            <Calendar bind:value={singleValue} />
            <div class="text-sm text-on-surface-variant">
                Selected: <code class="text-primary">{singleValue?.toString() ?? 'none'}</code>
            </div>
        </div>
    </section>

    <!-- Colors -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Colors</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Variants</h2>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Sizes</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each ['xs', 'sm', 'md', 'lg', 'xl'] as size (size)}
                {@const calendarSize = size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant uppercase">{size}</p>
                    <div class="rounded-lg bg-surface-container-high p-4">
                        <Calendar size={calendarSize} />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- Multiple Selection -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Multiple Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs"
                >type="multiple"</code
            >
            to allow selecting multiple dates.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Range Selection</h2>
        <p class="text-sm text-on-surface-variant">
            Use
            <code class="rounded bg-surface-container-highest px-1.5 py-0.5 text-xs">range</code>
            prop to enable date range selection.
        </p>
        <div class="flex flex-wrap items-start gap-6 rounded-lg bg-surface-container-high p-4">
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
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Multiple Months</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Calendar numberOfMonths={2} />
        </div>
    </section>

    <!-- Disabled & Unavailable Dates -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Disabled & Unavailable Dates</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Weekends disabled</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Calendar isDateDisabled={isWeekend} />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Holidays unavailable</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Calendar
                        isDateUnavailable={isHoliday}
                        placeholder={new CalendarDate(2024, 3, 1)}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Min/Max range</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Calendar
                        minValue={new CalendarDate(2024, 3, 5)}
                        maxValue={new CalendarDate(2024, 3, 25)}
                        placeholder={new CalendarDate(2024, 3, 1)}
                    />
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-on-surface-variant">Entire calendar disabled</p>
                <div class="rounded-lg bg-surface-container-high p-4">
                    <Calendar disabled />
                </div>
            </div>
        </div>
    </section>

    <!-- Locale -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">Locale</h2>
        <div class="grid gap-4 sm:grid-cols-3">
            {#each [{ locale: 'en', label: 'English' }, { locale: 'vi', label: 'Vietnamese' }, { locale: 'ja', label: 'Japanese' }] as item (item.locale)}
                <div class="space-y-2">
                    <p class="text-sm font-medium text-on-surface-variant">{item.label}</p>
                    <div class="rounded-lg bg-surface-container-high p-4">
                        <Calendar locale={item.locale} size="sm" />
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- UI Slot Overrides -->
    <section class="space-y-3">
        <h2 class="text-lg font-semibold">UI Slot Overrides</h2>
        <div class="rounded-lg bg-surface-container-high p-4">
            <Calendar
                ui={{
                    root: 'shadow-xl rounded-lg bg-surface-container-lowest p-3',
                    heading: 'text-primary',
                    headCell: 'text-primary/60'
                }}
            />
        </div>
    </section>
</div>
