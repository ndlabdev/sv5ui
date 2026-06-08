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
    import { type DateValue, today, getLocalTimeZone } from '@internationalized/date'
    import type { Month } from 'bits-ui'
    import { useFormField, useFormFieldEmit } from '../hooks/useFormField.svelte.js'

    const config = getComponentConfig('calendar', calendarDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        onValueChange,
        placeholder = $bindable(),
        onPlaceholderChange,
        id,
        name,
        range = false,
        prevMonthIcon = 'lucide:chevron-left',
        nextMonthIcon = 'lucide:chevron-right',
        prevYearIcon = 'lucide:chevrons-left',
        nextYearIcon = 'lucide:chevrons-right',
        monthControls = true,
        yearControls = true,
        weekNumbers = false,
        preventDeselect = false,
        minValue,
        maxValue,
        disabled = false,
        pagedNavigation = false,
        weekStartsOn = 0,
        weekdayFormat = 'short',
        isDateDisabled,
        isDateUnavailable,
        isDateHighlightable,
        fixedWeeks = true,
        numberOfMonths = 1,
        calendarLabel,
        locale = 'en',
        readonly = false,
        disableDaysOutsideMonth = false,
        color = config.defaultVariants.color ?? 'primary',
        size = config.defaultVariants.size ?? 'md',
        variant = config.defaultVariants.variant ?? 'solid',
        ui,
        class: className,
        heading: headingSlot,
        day: daySlot,
        weekDay: weekDaySlot,
        ...restProps
    }: Props = $props()

    function firstDateOf(val: unknown): DateValue | undefined {
        if (!val) return undefined
        if (Array.isArray(val)) return val[0] as DateValue | undefined
        if (typeof val === 'object' && 'start' in val) {
            return (val as { start?: DateValue }).start
        }
        return val as DateValue
    }

    if (placeholder === undefined) {
        placeholder = firstDateOf(value) ?? today(getLocalTimeZone())
    }

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedSize = $derived(size ?? formFieldContext?.size)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    // Only Cell and Day differ between Calendar & RangeCalendar
    const CalCell = $derived(range ? RangeCalendar.Cell : Calendar.Cell)
    const CalDay = $derived(range ? RangeCalendar.Day : Calendar.Day)

    const variantSlots = $derived(
        calendarVariants({ color: resolvedColor, size: resolvedSize, variant, weekNumbers })
    )
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

    function paginateYear(date: DateValue, sign: -1 | 1): DateValue {
        return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 })
    }

    const commonProps = $derived({
        id: resolvedId,
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
        disableDaysOutsideMonth,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': hasError ? true : undefined,
        'data-name': resolvedName,
        onfocusin: () => emit.onFocus(),
        onfocusout: () => emit.onBlur()
    })

    function handleValueChange(val: unknown) {
        ;(onValueChange as ((value: unknown) => void) | undefined)?.(val)
        emit.onChange()
    }
</script>

{#snippet calendarContent(months: Month<DateValue>[], weekdays: string[])}
    <Calendar.Header class={classes.header}>
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

        <Calendar.Heading class={classes.heading}>
            {#snippet child({ props, headingValue })}
                <div {...props}>
                    {#if headingSlot}
                        {@render headingSlot({ value: headingValue })}
                    {:else}
                        {headingValue}
                    {/if}
                </div>
            {/snippet}
        </Calendar.Heading>

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
    </Calendar.Header>

    <div class={classes.body}>
        {#each months as month (month.value.toString())}
            <Calendar.Grid class={classes.grid}>
                <Calendar.GridHead>
                    <Calendar.GridRow class={classes.gridWeekDaysRow}>
                        {#if weekNumbers}
                            <Calendar.HeadCell class={classes.headCellWeek}>#</Calendar.HeadCell>
                        {/if}
                        {#each weekdays as day (day)}
                            <Calendar.HeadCell class={classes.headCell}>
                                {#if weekDaySlot}
                                    {@render weekDaySlot({ day })}
                                {:else}
                                    {day}
                                {/if}
                            </Calendar.HeadCell>
                        {/each}
                    </Calendar.GridRow>
                </Calendar.GridHead>

                <Calendar.GridBody class={classes.gridBody}>
                    {#each month.weeks as week, weekIndex (weekIndex)}
                        <Calendar.GridRow class={classes.gridRow}>
                            {#if weekNumbers}
                                <td class={classes.cellWeek}>{weekIndex + 1}</td>
                            {/if}
                            {#each week as date (date.toString())}
                                <CalCell {date} month={month.value} class={classes.cell}>
                                    <CalDay class={classes.cellTrigger}>
                                        {#snippet child({ props })}
                                            <span
                                                {...props}
                                                data-marked={isDateHighlightable?.(date)
                                                    ? ''
                                                    : undefined}
                                            >
                                                {#if daySlot}
                                                    {@render daySlot({ day: date })}
                                                {:else}
                                                    {date.day}
                                                {/if}
                                            </span>
                                        {/snippet}
                                    </CalDay>
                                </CalCell>
                            {/each}
                        </Calendar.GridRow>
                    {/each}
                </Calendar.GridBody>
            </Calendar.Grid>
        {/each}
    </div>
{/snippet}

{#if range}
    {@const rp = restProps as Omit<
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
        | 'weekDay'
        | 'prevMonthIcon'
        | 'nextMonthIcon'
        | 'prevYearIcon'
        | 'nextYearIcon'
        | 'monthControls'
        | 'yearControls'
        | 'weekNumbers'
    >}
    <RangeCalendar.Root
        bind:ref
        bind:value={value as CalendarRangeProps['value']}
        onValueChange={handleValueChange as CalendarRangeProps['onValueChange']}
        {...commonProps}
        minDays={rp.minDays}
        maxDays={rp.maxDays}
        onStartValueChange={rp.onStartValueChange}
        onEndValueChange={rp.onEndValueChange}
        excludeDisabled={rp.excludeDisabled}
        class={classes.root}
    >
        {#snippet children({ months, weekdays })}
            {@render calendarContent(months, weekdays)}
        {/snippet}
    </RangeCalendar.Root>
{:else}
    {@const calType = (restProps as { type?: 'single' | 'multiple' }).type ?? 'single'}
    {@const calInitialFocus = (restProps as { initialFocus?: boolean }).initialFocus}
    {#if calType === 'multiple'}
        {@const calMaxDays = (restProps as { maxDays?: number }).maxDays}
        <Calendar.Root
            bind:ref
            bind:value={value as CalendarMultipleProps['value']}
            onValueChange={handleValueChange as CalendarMultipleProps['onValueChange']}
            {...commonProps}
            type="multiple"
            maxDays={calMaxDays}
            initialFocus={calInitialFocus}
            class={classes.root}
        >
            {#snippet children({ months, weekdays })}
                {@render calendarContent(months, weekdays)}
            {/snippet}
        </Calendar.Root>
    {:else}
        <Calendar.Root
            bind:ref
            bind:value={value as CalendarSingleProps['value']}
            onValueChange={handleValueChange as CalendarSingleProps['onValueChange']}
            {...commonProps}
            type="single"
            initialFocus={calInitialFocus}
            class={classes.root}
        >
            {#snippet children({ months, weekdays })}
                {@render calendarContent(months, weekdays)}
            {/snippet}
        </Calendar.Root>
    {/if}
{/if}
