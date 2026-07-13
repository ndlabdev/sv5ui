<script lang="ts" module>
    import type { DateRangePickerProps } from './date-range-picker.types.js'

    export type Props = DateRangePickerProps
</script>

<script lang="ts">
    import {
        DateRangePicker,
        Portal,
        TimeField,
        type DateRange,
        type SegmentPart,
        type TimeValue
    } from 'bits-ui'
    import {
        dateRangePickerVariants,
        dateRangePickerDefaults
    } from './date-range-picker.variants.js'
    import { calendarVariants } from '../Calendar/calendar.variants.js'
    import { getComponentConfig } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'
    import {
        type DateValue,
        today,
        now,
        toCalendarDateTime,
        getLocalTimeZone
    } from '@internationalized/date'
    import { useFormField, useFormFieldEmit } from '../../hooks/useFormField/index.js'

    const config = getComponentConfig('dateRangePicker', dateRangePickerDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        onValueChange,
        onStartValueChange,
        onEndValueChange,
        placeholder = $bindable(),
        onPlaceholderChange,
        open = $bindable(false),
        onOpenChange,
        onOpenChangeComplete,
        id,
        name,
        required = false,
        disabled = false,
        readonly = false,
        readonlySegments,
        granularity,
        hourCycle,
        hideTimeZone = false,
        locale = 'en',
        minValue,
        maxValue,
        minDays,
        maxDays,
        excludeDisabled = false,
        validate,
        onInvalid,
        isDateDisabled,
        isDateUnavailable,
        isDateHighlightable,
        closeOnRangeSelect,
        timeInput = false,
        timeIcon = 'lucide:clock',
        preventDeselect = false,
        weekStartsOn = 0,
        weekdayFormat = 'short',
        fixedWeeks = true,
        numberOfMonths = 2,
        pagedNavigation = false,
        calendarLabel,
        disableDaysOutsideMonth = false,
        weekNumbers = false,
        monthControls = true,
        yearControls = true,
        prevMonthIcon = 'lucide:chevron-left',
        nextMonthIcon = 'lucide:chevron-right',
        prevYearIcon = 'lucide:chevrons-left',
        nextYearIcon = 'lucide:chevrons-right',
        icon = 'lucide:calendar',
        separatorIcon = 'lucide:minus',
        side = 'bottom',
        sideOffset = 8,
        align = 'start',
        alignOffset = 0,
        portal = true,
        transition = config.defaultVariants.transition ?? true,
        color = config.defaultVariants.color ?? 'primary',
        size,
        variant = config.defaultVariants.variant ?? 'outline',
        calendarVariant = 'solid',
        highlight = false,
        ui,
        class: className,
        heading: headingSlot,
        day: daySlot,
        weekDay: weekDaySlot
    }: Props = $props()

    function hasTimeGranularity(): boolean {
        return (
            granularity === 'hour' ||
            granularity === 'minute' ||
            granularity === 'second' ||
            (timeInput && granularity === undefined)
        )
    }

    const resolvedGranularity = $derived(
        granularity ?? (timeInput ? ('minute' as const) : undefined)
    )
    const showTimeInput = $derived(
        timeInput &&
            (resolvedGranularity === 'hour' ||
                resolvedGranularity === 'minute' ||
                resolvedGranularity === 'second')
    )

    if (placeholder === undefined) {
        placeholder =
            value?.start ??
            (hasTimeGranularity()
                ? toCalendarDateTime(now(getLocalTimeZone()))
                : today(getLocalTimeZone()))
    }

    const formFieldContext = useFormField()
    const emit = useFormFieldEmit()

    const hasError = $derived(
        formFieldContext?.error !== undefined && formFieldContext?.error !== false
    )
    const resolvedColor = $derived(hasError ? 'error' : color)
    const resolvedSize = $derived(size ?? formFieldContext?.size ?? config.defaultVariants.size)
    const resolvedHighlight = $derived(hasError || highlight)
    const resolvedId = $derived(id ?? formFieldContext?.ariaId)
    const resolvedName = $derived(name ?? formFieldContext?.name)
    const ariaDescribedBy = $derived(
        !formFieldContext
            ? undefined
            : hasError
              ? `${formFieldContext.ariaId}-error`
              : `${formFieldContext.ariaId}-description ${formFieldContext.ariaId}-help`
    )

    const variantSlots = $derived(
        dateRangePickerVariants({
            color: resolvedColor,
            size: resolvedSize,
            variant,
            highlight: resolvedHighlight,
            transition
        })
    )
    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        field: variantSlots.field({ class: [config.slots.field, ui?.field] }),
        input: variantSlots.input({ class: [config.slots.input, ui?.input] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        segment: variantSlots.segment({ class: [config.slots.segment, ui?.segment] }),
        literal: variantSlots.literal({ class: [config.slots.literal, ui?.literal] }),
        trigger: variantSlots.trigger({ class: [config.slots.trigger, ui?.trigger] }),
        triggerIcon: variantSlots.triggerIcon({
            class: [config.slots.triggerIcon, ui?.triggerIcon]
        }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        calendar: variantSlots.calendar({ class: [config.slots.calendar, ui?.calendar] }),
        time: variantSlots.time({ class: [config.slots.time, ui?.time] }),
        timeIcon: variantSlots.timeIcon({ class: [config.slots.timeIcon, ui?.timeIcon] }),
        timeField: variantSlots.timeField({ class: [config.slots.timeField, ui?.timeField] })
    })

    const calendarSlotFns = $derived(
        calendarVariants({
            color: resolvedColor,
            size: resolvedSize,
            variant: calendarVariant,
            weekNumbers
        })
    )
    const calendarClasses = $derived({
        root: calendarSlotFns.root({ class: ui?.calendarSlots?.root }),
        header: calendarSlotFns.header({ class: ui?.calendarSlots?.header }),
        body: calendarSlotFns.body({ class: ui?.calendarSlots?.body }),
        heading: calendarSlotFns.heading({ class: ui?.calendarSlots?.heading }),
        navButton: calendarSlotFns.navButton({ class: ui?.calendarSlots?.navButton }),
        navButtonIcon: calendarSlotFns.navButtonIcon({ class: ui?.calendarSlots?.navButtonIcon }),
        grid: calendarSlotFns.grid({ class: ui?.calendarSlots?.grid }),
        gridWeekDaysRow: calendarSlotFns.gridWeekDaysRow({
            class: ui?.calendarSlots?.gridWeekDaysRow
        }),
        gridBody: calendarSlotFns.gridBody({ class: ui?.calendarSlots?.gridBody }),
        gridRow: calendarSlotFns.gridRow({ class: ui?.calendarSlots?.gridRow }),
        headCell: calendarSlotFns.headCell({ class: ui?.calendarSlots?.headCell }),
        headCellWeek: calendarSlotFns.headCellWeek({ class: ui?.calendarSlots?.headCellWeek }),
        cell: calendarSlotFns.cell({ class: ui?.calendarSlots?.cell }),
        cellTrigger: calendarSlotFns.cellTrigger({ class: ui?.calendarSlots?.cellTrigger }),
        cellWeek: calendarSlotFns.cellWeek({ class: ui?.calendarSlots?.cellWeek })
    })

    function paginateYear(date: DateValue, sign: -1 | 1): DateValue {
        return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 })
    }

    let lastValue: DateRange | undefined = value

    function isSameDate(a: DateValue | undefined, b: DateValue | undefined): boolean {
        if (a === undefined || b === undefined) return a === b
        return a.compare(b) === 0
    }

    function isSameRange(a: DateRange | undefined, b: DateRange | undefined): boolean {
        return isSameDate(a?.start, b?.start) && isSameDate(a?.end, b?.end)
    }

    function handleValueChange(val: DateRange | undefined) {
        if (isSameRange(lastValue, val)) return
        lastValue = val
        onValueChange?.(val)
        emit.onChange()
    }

    const startTimeValue = $derived(
        value?.start !== undefined && 'hour' in value.start ? value.start : undefined
    )
    const endTimeValue = $derived(
        value?.end !== undefined && 'hour' in value.end ? value.end : undefined
    )
    const timePlaceholder = $derived(
        placeholder === undefined
            ? undefined
            : 'hour' in placeholder
              ? placeholder
              : toCalendarDateTime(placeholder)
    )

    function handleTimeChange(edge: 'start' | 'end', val: TimeValue | undefined) {
        if (val === undefined || !('year' in val)) return
        const next: DateRange = {
            start: edge === 'start' ? val : value?.start,
            end: edge === 'end' ? val : value?.end
        }
        value = next
        handleValueChange(next)
    }

    let rootEl = $state<HTMLElement | null>(null)
    let contentEl = $state<HTMLElement | null>(null)

    function handleOpenChange(val: boolean) {
        if (val) emit.onFocus()
        else emit.onBlur()
        onOpenChange?.(val)
    }

    function handleFocusOut(event: FocusEvent) {
        if (open) return
        const next = event.relatedTarget as Node | null
        if (next && (rootEl?.contains(next) || contentEl?.contains(next))) return
        emit.onBlur()
    }
</script>

{#snippet inputSegments(segments: Array<{ part: SegmentPart; value: string }>)}
    {#each segments as segment, i (segment.part + i)}
        {#if segment.part === 'literal'}
            <DateRangePicker.Segment part={segment.part} class={classes.literal}>
                {segment.value}
            </DateRangePicker.Segment>
        {:else}
            <DateRangePicker.Segment part={segment.part} class={classes.segment}>
                {segment.value}
            </DateRangePicker.Segment>
        {/if}
    {/each}
{/snippet}

{#snippet timeField(edge: 'start' | 'end')}
    <TimeField.Root
        value={edge === 'start' ? startTimeValue : endTimeValue}
        onValueChange={(val) => handleTimeChange(edge, val)}
        placeholder={(edge === 'start' ? startTimeValue : endTimeValue) ?? timePlaceholder}
        granularity={resolvedGranularity as 'hour' | 'minute' | 'second'}
        {hourCycle}
        {hideTimeZone}
        {locale}
        {disabled}
        {readonly}
    >
        <TimeField.Input
            class={classes.timeField}
            aria-label={edge === 'start' ? 'Start time' : 'End time'}
        >
            {#snippet children({ segments })}
                {#each segments as segment, i (segment.part + i)}
                    {#if segment.part === 'literal'}
                        <TimeField.Segment part={segment.part} class={classes.literal}>
                            {segment.value}
                        </TimeField.Segment>
                    {:else}
                        <TimeField.Segment part={segment.part} class={classes.segment}>
                            {segment.value}
                        </TimeField.Segment>
                    {/if}
                {/each}
            {/snippet}
        </TimeField.Input>
    </TimeField.Root>
{/snippet}

{#snippet pickerContentEl()}
    <DateRangePicker.Content
        {side}
        {sideOffset}
        {align}
        {alignOffset}
        collisionPadding={8}
        bind:ref={contentEl}
        class={classes.content}
    >
        <DateRangePicker.Calendar class={[calendarClasses.root, classes.calendar]}>
            {#snippet children({ months, weekdays })}
                <DateRangePicker.Header class={calendarClasses.header}>
                    <div class="flex items-center gap-1">
                        {#if yearControls}
                            <button
                                type="button"
                                class={calendarClasses.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, -1)
                                }}
                                aria-label="Previous year"
                            >
                                <Icon name={prevYearIcon} class={calendarClasses.navButtonIcon} />
                            </button>
                        {/if}
                        {#if monthControls}
                            <DateRangePicker.PrevButton class={calendarClasses.navButton}>
                                <Icon name={prevMonthIcon} class={calendarClasses.navButtonIcon} />
                            </DateRangePicker.PrevButton>
                        {/if}
                    </div>

                    <DateRangePicker.Heading class={calendarClasses.heading}>
                        {#snippet child({ props, headingValue })}
                            <div {...props}>
                                {#if headingSlot}
                                    {@render headingSlot({ value: headingValue })}
                                {:else}
                                    {headingValue}
                                {/if}
                            </div>
                        {/snippet}
                    </DateRangePicker.Heading>

                    <div class="flex items-center gap-1">
                        {#if monthControls}
                            <DateRangePicker.NextButton class={calendarClasses.navButton}>
                                <Icon name={nextMonthIcon} class={calendarClasses.navButtonIcon} />
                            </DateRangePicker.NextButton>
                        {/if}
                        {#if yearControls}
                            <button
                                type="button"
                                class={calendarClasses.navButton}
                                onclick={() => {
                                    if (placeholder) placeholder = paginateYear(placeholder, 1)
                                }}
                                aria-label="Next year"
                            >
                                <Icon name={nextYearIcon} class={calendarClasses.navButtonIcon} />
                            </button>
                        {/if}
                    </div>
                </DateRangePicker.Header>

                <div class={calendarClasses.body}>
                    {#each months as month (month.value.toString())}
                        <DateRangePicker.Grid class={calendarClasses.grid}>
                            <DateRangePicker.GridHead>
                                <DateRangePicker.GridRow class={calendarClasses.gridWeekDaysRow}>
                                    {#if weekNumbers}
                                        <DateRangePicker.HeadCell
                                            class={calendarClasses.headCellWeek}
                                        >
                                            #
                                        </DateRangePicker.HeadCell>
                                    {/if}
                                    {#each weekdays as day (day)}
                                        <DateRangePicker.HeadCell class={calendarClasses.headCell}>
                                            {#if weekDaySlot}
                                                {@render weekDaySlot({ day })}
                                            {:else}
                                                {day}
                                            {/if}
                                        </DateRangePicker.HeadCell>
                                    {/each}
                                </DateRangePicker.GridRow>
                            </DateRangePicker.GridHead>

                            <DateRangePicker.GridBody class={calendarClasses.gridBody}>
                                {#each month.weeks as week, weekIndex (weekIndex)}
                                    <DateRangePicker.GridRow class={calendarClasses.gridRow}>
                                        {#if weekNumbers}
                                            <td class={calendarClasses.cellWeek}>
                                                {weekIndex + 1}
                                            </td>
                                        {/if}
                                        {#each week as date (date.toString())}
                                            <DateRangePicker.Cell
                                                {date}
                                                month={month.value}
                                                class={calendarClasses.cell}
                                            >
                                                <DateRangePicker.Day
                                                    class={calendarClasses.cellTrigger}
                                                >
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
                                                </DateRangePicker.Day>
                                            </DateRangePicker.Cell>
                                        {/each}
                                    </DateRangePicker.GridRow>
                                {/each}
                            </DateRangePicker.GridBody>
                        </DateRangePicker.Grid>
                    {/each}
                </div>
            {/snippet}
        </DateRangePicker.Calendar>

        {#if showTimeInput}
            <div class={classes.time}>
                <Icon name={timeIcon} class={classes.timeIcon} />
                {@render timeField('start')}
                <Icon name={separatorIcon} class={classes.separator} />
                {@render timeField('end')}
            </div>
        {/if}
    </DateRangePicker.Content>
{/snippet}

<DateRangePicker.Root
    bind:value
    bind:placeholder
    bind:open
    onValueChange={handleValueChange}
    {onStartValueChange}
    {onEndValueChange}
    onPlaceholderChange={(val) => onPlaceholderChange?.(val)}
    onOpenChange={handleOpenChange}
    {onOpenChangeComplete}
    {required}
    {disabled}
    {readonly}
    {readonlySegments}
    granularity={resolvedGranularity}
    {hourCycle}
    {hideTimeZone}
    {locale}
    {minValue}
    {maxValue}
    {minDays}
    {maxDays}
    {excludeDisabled}
    {validate}
    {onInvalid}
    {isDateDisabled}
    {isDateUnavailable}
    closeOnRangeSelect={closeOnRangeSelect ?? !showTimeInput}
    {preventDeselect}
    {weekStartsOn}
    {weekdayFormat}
    {fixedWeeks}
    {numberOfMonths}
    {pagedNavigation}
    {calendarLabel}
    {disableDaysOutsideMonth}
>
    <div
        bind:this={rootEl}
        class={classes.root}
        onfocusin={() => emit.onFocus()}
        onfocusout={handleFocusOut}
    >
        <div bind:this={ref} class={classes.field}>
            <DateRangePicker.Input
                type="start"
                id={resolvedId}
                name={resolvedName ? `${resolvedName}-start` : undefined}
                class={classes.input}
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasError ? true : undefined}
            >
                {#snippet children({ segments })}
                    {@render inputSegments(segments)}
                {/snippet}
            </DateRangePicker.Input>

            <Icon name={separatorIcon} class={classes.separator} />

            <DateRangePicker.Input
                type="end"
                name={resolvedName ? `${resolvedName}-end` : undefined}
                class={classes.input}
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasError ? true : undefined}
            >
                {#snippet children({ segments })}
                    {@render inputSegments(segments)}
                {/snippet}
            </DateRangePicker.Input>
        </div>

        <DateRangePicker.Trigger {disabled} class={classes.trigger} aria-label="Open calendar">
            <Icon name={icon} class={classes.triggerIcon} />
        </DateRangePicker.Trigger>
    </div>

    {#if portal}
        <Portal>
            {@render pickerContentEl()}
        </Portal>
    {:else}
        {@render pickerContentEl()}
    {/if}
</DateRangePicker.Root>
