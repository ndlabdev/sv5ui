<script lang="ts" module>
    import type {
        CalendarProps,
        CalendarRangeProps,
        CalendarSingleProps,
        CalendarMultipleProps
    } from './calendar.types.js'

    export type Props = CalendarProps
</script>

<script lang="ts">
    import { Calendar, RangeCalendar } from 'bits-ui'
    import { calendarVariants, calendarDefaults } from './calendar.variants.js'
    import { getComponentConfig } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import type { DateValue } from '@internationalized/date'
    import type { Month } from 'bits-ui'

    const config = getComponentConfig('calendar', calendarDefaults)

    let {
        // Value props
        value = $bindable(),
        onValueChange,
        placeholder = $bindable(),
        onPlaceholderChange,

        // Range-specific props
        range = false,

        // Navigation icons
        prevMonthIcon = 'lucide:chevron-left',
        nextMonthIcon = 'lucide:chevron-right',
        prevYearIcon = 'lucide:chevrons-left',
        nextYearIcon = 'lucide:chevrons-right',

        // Controls
        monthControls = true,
        yearControls = false,
        weekNumbers = false,

        // Calendar props
        preventDeselect = false,
        minValue,
        maxValue,
        disabled = false,
        pagedNavigation = false,
        weekStartsOn = 0,
        weekdayFormat = 'short',
        isDateDisabled,
        isDateUnavailable,
        fixedWeeks = false,
        numberOfMonths = 1,
        calendarLabel,
        locale = 'en',
        readonly = false,
        disableDaysOutsideMonth = false,

        // Styling
        color = config.defaultVariants.color ?? 'primary',
        size = config.defaultVariants.size ?? 'md',
        variant = config.defaultVariants.variant ?? 'solid',
        ui,
        class: className,

        // Snippets
        heading: headingSlot,
        day: daySlot,
        weekday: weekdaySlot,

        // Spread remaining props (initialFocus, type, minDays, maxDays, etc.)
        ...restProps
    }: Props = $props()

    // Compute variant classes
    const variantSlots = $derived(calendarVariants({ color, size, variant, weekNumbers }))
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        header: variantSlots.header({ class: [config.slots.header, ui?.header] }),
        body: variantSlots.body({ class: [config.slots.body, ui?.body] }),
        heading: variantSlots.heading({ class: [config.slots.heading, ui?.heading] }),
        navButton: variantSlots.navButton({ class: [config.slots.navButton, ui?.navButton] }),
        navButtonIcon: variantSlots.navButtonIcon({
            class: [config.slots.navButtonIcon, ui?.navButtonIcon]
        }),
        grid: variantSlots.grid({ class: [config.slots.grid, ui?.grid] }),
        gridWeekDaysRow: variantSlots.gridWeekDaysRow({
            class: [config.slots.gridWeekDaysRow, ui?.gridWeekDaysRow]
        }),
        gridBody: variantSlots.gridBody({ class: [config.slots.gridBody, ui?.gridBody] }),
        gridRow: variantSlots.gridRow({ class: [config.slots.gridRow, ui?.gridRow] }),
        headCell: variantSlots.headCell({ class: [config.slots.headCell, ui?.headCell] }),
        headCellWeek: variantSlots.headCellWeek({
            class: [config.slots.headCellWeek, ui?.headCellWeek]
        }),
        cell: variantSlots.cell({ class: [config.slots.cell, ui?.cell] }),
        cellTrigger: variantSlots.cellTrigger({
            class: [config.slots.cellTrigger, ui?.cellTrigger]
        }),
        cellWeek: variantSlots.cellWeek({ class: [config.slots.cellWeek, ui?.cellWeek] })
    })

    // Year navigation helper
    function paginateYear(date: DateValue, years: number): DateValue {
        return date.add({ years })
    }

    // Common calendar props
    const commonProps = $derived({
        placeholder,
        onPlaceholderChange: (val: DateValue) => {
            placeholder = val
            onPlaceholderChange?.(val)
        },
        preventDeselect,
        minValue,
        maxValue,
        disabled,
        pagedNavigation,
        weekStartsOn,
        weekdayFormat,
        isDateDisabled,
        isDateUnavailable,
        fixedWeeks,
        numberOfMonths,
        calendarLabel,
        locale,
        readonly,
        disableDaysOutsideMonth
    })
</script>

{#snippet calendarContent(months: Month<DateValue>[], weekdays: string[])}
    {#each months as month, monthIndex (monthIndex)}
        <div>
            <Calendar.Header class={classes.header}>
                {#if headingSlot}
                    {@render headingSlot({
                        headingValue: month.value
                            .toDate('UTC')
                            .toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
                        prevMonth: () => {},
                        nextMonth: () => {},
                        prevYear: () => {
                            if (placeholder) placeholder = paginateYear(placeholder, -1)
                        },
                        nextYear: () => {
                            if (placeholder) placeholder = paginateYear(placeholder, 1)
                        }
                    })}
                {:else}
                    <div class="flex items-center gap-1">
                        {#if yearControls}
                            <button
                                type="button"
                                class={classes.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, -1)
                                }}
                                aria-label="Previous year"
                            >
                                <Icon name={prevYearIcon} class={classes.navButtonIcon} />
                            </button>
                        {/if}
                        {#if monthControls}
                            <Calendar.PrevButton class={classes.navButton}>
                                <Icon name={prevMonthIcon} class={classes.navButtonIcon} />
                            </Calendar.PrevButton>
                        {/if}
                    </div>

                    <Calendar.Heading class={classes.heading} />

                    <div class="flex items-center gap-1">
                        {#if monthControls}
                            <Calendar.NextButton class={classes.navButton}>
                                <Icon name={nextMonthIcon} class={classes.navButtonIcon} />
                            </Calendar.NextButton>
                        {/if}
                        {#if yearControls}
                            <button
                                type="button"
                                class={classes.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, 1)
                                }}
                                aria-label="Next year"
                            >
                                <Icon name={nextYearIcon} class={classes.navButtonIcon} />
                            </button>
                        {/if}
                    </div>
                {/if}
            </Calendar.Header>

            <Calendar.Grid class={classes.grid}>
                <Calendar.GridHead>
                    <Calendar.GridRow class={classes.gridWeekDaysRow}>
                        {#if weekNumbers}
                            <Calendar.HeadCell class={classes.headCellWeek}>#</Calendar.HeadCell>
                        {/if}
                        {#each weekdays as wd (wd)}
                            <Calendar.HeadCell class={classes.headCell}>
                                {#if weekdaySlot}
                                    {@render weekdaySlot({ weekday: wd })}
                                {:else}
                                    {wd}
                                {/if}
                            </Calendar.HeadCell>
                        {/each}
                    </Calendar.GridRow>
                </Calendar.GridHead>

                <Calendar.GridBody class={classes.gridBody}>
                    {#each month.weeks as week, weekIndex (weekIndex)}
                        <Calendar.GridRow class={classes.gridRow}>
                            {#if weekNumbers}
                                <td class={classes.cellWeek}>
                                    {weekIndex + 1}
                                </td>
                            {/if}
                            {#each week as date (date.toString())}
                                <Calendar.Cell {date} month={month.value} class={classes.cell}>
                                    <Calendar.Day class={classes.cellTrigger}>
                                        {#snippet child({
                                            props,
                                            selected,
                                            disabled: dayDisabled,
                                            unavailable
                                        })}
                                            {#if daySlot}
                                                <span {...props}>
                                                    {@render daySlot({
                                                        date,
                                                        day: date.day.toString(),
                                                        selected,
                                                        disabled: dayDisabled,
                                                        unavailable
                                                    })}
                                                </span>
                                            {:else}
                                                <span {...props}>
                                                    {date.day}
                                                </span>
                                            {/if}
                                        {/snippet}
                                    </Calendar.Day>
                                </Calendar.Cell>
                            {/each}
                        </Calendar.GridRow>
                    {/each}
                </Calendar.GridBody>
            </Calendar.Grid>
        </div>
    {/each}
{/snippet}

{#snippet rangeCalendarContent(months: Month<DateValue>[], weekdays: string[])}
    {#each months as month, monthIndex (monthIndex)}
        <div>
            <RangeCalendar.Header class={classes.header}>
                {#if headingSlot}
                    {@render headingSlot({
                        headingValue: month.value
                            .toDate('UTC')
                            .toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
                        prevMonth: () => {},
                        nextMonth: () => {},
                        prevYear: () => {
                            if (placeholder) placeholder = paginateYear(placeholder, -1)
                        },
                        nextYear: () => {
                            if (placeholder) placeholder = paginateYear(placeholder, 1)
                        }
                    })}
                {:else}
                    <div class="flex items-center gap-1">
                        {#if yearControls}
                            <button
                                type="button"
                                class={classes.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, -1)
                                }}
                                aria-label="Previous year"
                            >
                                <Icon name={prevYearIcon} class={classes.navButtonIcon} />
                            </button>
                        {/if}
                        {#if monthControls}
                            <RangeCalendar.PrevButton class={classes.navButton}>
                                <Icon name={prevMonthIcon} class={classes.navButtonIcon} />
                            </RangeCalendar.PrevButton>
                        {/if}
                    </div>

                    <RangeCalendar.Heading class={classes.heading} />

                    <div class="flex items-center gap-1">
                        {#if monthControls}
                            <RangeCalendar.NextButton class={classes.navButton}>
                                <Icon name={nextMonthIcon} class={classes.navButtonIcon} />
                            </RangeCalendar.NextButton>
                        {/if}
                        {#if yearControls}
                            <button
                                type="button"
                                class={classes.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, 1)
                                }}
                                aria-label="Next year"
                            >
                                <Icon name={nextYearIcon} class={classes.navButtonIcon} />
                            </button>
                        {/if}
                    </div>
                {/if}
            </RangeCalendar.Header>

            <RangeCalendar.Grid class={classes.grid}>
                <RangeCalendar.GridHead>
                    <RangeCalendar.GridRow class={classes.gridWeekDaysRow}>
                        {#if weekNumbers}
                            <RangeCalendar.HeadCell class={classes.headCellWeek}
                                >#</RangeCalendar.HeadCell
                            >
                        {/if}
                        {#each weekdays as wd (wd)}
                            <RangeCalendar.HeadCell class={classes.headCell}>
                                {#if weekdaySlot}
                                    {@render weekdaySlot({ weekday: wd })}
                                {:else}
                                    {wd}
                                {/if}
                            </RangeCalendar.HeadCell>
                        {/each}
                    </RangeCalendar.GridRow>
                </RangeCalendar.GridHead>

                <RangeCalendar.GridBody class={classes.gridBody}>
                    {#each month.weeks as week, weekIndex (weekIndex)}
                        <RangeCalendar.GridRow class={classes.gridRow}>
                            {#if weekNumbers}
                                <td class={classes.cellWeek}>
                                    {weekIndex + 1}
                                </td>
                            {/if}
                            {#each week as date (date.toString())}
                                <RangeCalendar.Cell {date} month={month.value} class={classes.cell}>
                                    <RangeCalendar.Day class={classes.cellTrigger}>
                                        {#snippet child({
                                            props,
                                            selected,
                                            disabled: dayDisabled,
                                            unavailable
                                        })}
                                            {#if daySlot}
                                                <span {...props}>
                                                    {@render daySlot({
                                                        date,
                                                        day: date.day.toString(),
                                                        selected,
                                                        disabled: dayDisabled,
                                                        unavailable
                                                    })}
                                                </span>
                                            {:else}
                                                <span {...props}>
                                                    {date.day}
                                                </span>
                                            {/if}
                                        {/snippet}
                                    </RangeCalendar.Day>
                                </RangeCalendar.Cell>
                            {/each}
                        </RangeCalendar.GridRow>
                    {/each}
                </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
        </div>
    {/each}
{/snippet}

{#if range}
    {@const rangeProps = restProps as Omit<
        CalendarRangeProps,
        | keyof typeof commonProps
        | 'range'
        | 'value'
        | 'onValueChange'
        | 'color'
        | 'size'
        | 'variant'
        | 'class'
        | 'ui'
        | 'heading'
        | 'day'
        | 'weekday'
        | 'prevMonthIcon'
        | 'nextMonthIcon'
        | 'prevYearIcon'
        | 'nextYearIcon'
        | 'monthControls'
        | 'yearControls'
        | 'weekNumbers'
    >}
    <RangeCalendar.Root
        bind:value={value as CalendarRangeProps['value']}
        onValueChange={onValueChange as CalendarRangeProps['onValueChange']}
        {...commonProps}
        minDays={rangeProps.minDays}
        maxDays={rangeProps.maxDays}
        onStartValueChange={rangeProps.onStartValueChange}
        onEndValueChange={rangeProps.onEndValueChange}
        excludeDisabled={rangeProps.excludeDisabled}
        class={classes.root}
    >
        {#snippet children({ months, weekdays })}
            <div class={classes.body}>
                {@render rangeCalendarContent(months, weekdays)}
            </div>
        {/snippet}
    </RangeCalendar.Root>
{:else}
    {@const calType = (restProps as { type?: 'single' | 'multiple' }).type ?? 'single'}
    {@const calInitialFocus = (restProps as { initialFocus?: boolean }).initialFocus}
    {#if calType === 'multiple'}
        <Calendar.Root
            bind:value={value as CalendarMultipleProps['value']}
            onValueChange={onValueChange as CalendarMultipleProps['onValueChange']}
            {...commonProps}
            type="multiple"
            initialFocus={calInitialFocus}
            class={classes.root}
        >
            {#snippet children({ months, weekdays })}
                <div class={classes.body}>
                    {@render calendarContent(months, weekdays)}
                </div>
            {/snippet}
        </Calendar.Root>
    {:else}
        <Calendar.Root
            bind:value={value as CalendarSingleProps['value']}
            onValueChange={onValueChange as CalendarSingleProps['onValueChange']}
            {...commonProps}
            type="single"
            initialFocus={calInitialFocus}
            class={classes.root}
        >
            {#snippet children({ months, weekdays })}
                <div class={classes.body}>
                    {@render calendarContent(months, weekdays)}
                </div>
            {/snippet}
        </Calendar.Root>
    {/if}
{/if}
