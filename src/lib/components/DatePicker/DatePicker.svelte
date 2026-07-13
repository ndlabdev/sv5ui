<script lang="ts" module>
    import type { DatePickerProps } from './date-picker.types.js'

    export type Props = DatePickerProps
</script>

<script lang="ts">
    import { DatePicker, TimeField, type TimeValue } from 'bits-ui'
    import { datePickerVariants, datePickerDefaults } from './date-picker.variants.js'
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

    const config = getComponentConfig('datePicker', datePickerDefaults)

    let {
        ref = $bindable(null),
        value = $bindable(),
        onValueChange,
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
        validate,
        onInvalid,
        isDateDisabled,
        isDateUnavailable,
        isDateHighlightable,
        closeOnDateSelect,
        timeInput = false,
        timeIcon = 'lucide:clock',
        initialFocus = true,
        preventDeselect = false,
        weekStartsOn = 0,
        weekdayFormat = 'short',
        fixedWeeks = true,
        numberOfMonths = 1,
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
            value ??
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
        datePickerVariants({
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

    let lastValue: DateValue | undefined = value

    function isSameDate(a: DateValue | undefined, b: DateValue | undefined): boolean {
        if (a === undefined || b === undefined) return a === b
        return a.compare(b) === 0
    }

    function handleValueChange(val: DateValue | undefined) {
        if (isSameDate(lastValue, val)) return
        lastValue = val
        onValueChange?.(val)
        emit.onChange()
    }

    const timeValue = $derived(value !== undefined && 'hour' in value ? value : undefined)
    const timePlaceholder = $derived(
        placeholder === undefined
            ? undefined
            : 'hour' in placeholder
              ? placeholder
              : toCalendarDateTime(placeholder)
    )

    function handleTimeChange(val: TimeValue | undefined) {
        if (val === undefined || !('year' in val)) return
        value = val
        handleValueChange(val)
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

{#snippet pickerContentEl()}
    <DatePicker.Content
        {side}
        {sideOffset}
        {align}
        {alignOffset}
        collisionPadding={8}
        bind:ref={contentEl}
        class={classes.content}
    >
        <DatePicker.Calendar class={[calendarClasses.root, classes.calendar]}>
            {#snippet children({ months, weekdays })}
                <DatePicker.Header class={calendarClasses.header}>
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
                            <DatePicker.PrevButton class={calendarClasses.navButton}>
                                <Icon name={prevMonthIcon} class={calendarClasses.navButtonIcon} />
                            </DatePicker.PrevButton>
                        {/if}
                    </div>

                    <DatePicker.Heading class={calendarClasses.heading}>
                        {#snippet child({ props, headingValue })}
                            <div {...props}>
                                {#if headingSlot}
                                    {@render headingSlot({ value: headingValue })}
                                {:else}
                                    {headingValue}
                                {/if}
                            </div>
                        {/snippet}
                    </DatePicker.Heading>

                    <div class="flex items-center gap-1">
                        {#if monthControls}
                            <DatePicker.NextButton class={calendarClasses.navButton}>
                                <Icon name={nextMonthIcon} class={calendarClasses.navButtonIcon} />
                            </DatePicker.NextButton>
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
                </DatePicker.Header>

                <div class={calendarClasses.body}>
                    {#each months as month (month.value.toString())}
                        <DatePicker.Grid class={calendarClasses.grid}>
                            <DatePicker.GridHead>
                                <DatePicker.GridRow class={calendarClasses.gridWeekDaysRow}>
                                    {#if weekNumbers}
                                        <DatePicker.HeadCell class={calendarClasses.headCellWeek}>
                                            #
                                        </DatePicker.HeadCell>
                                    {/if}
                                    {#each weekdays as day (day)}
                                        <DatePicker.HeadCell class={calendarClasses.headCell}>
                                            {#if weekDaySlot}
                                                {@render weekDaySlot({ day })}
                                            {:else}
                                                {day}
                                            {/if}
                                        </DatePicker.HeadCell>
                                    {/each}
                                </DatePicker.GridRow>
                            </DatePicker.GridHead>

                            <DatePicker.GridBody class={calendarClasses.gridBody}>
                                {#each month.weeks as week, weekIndex (weekIndex)}
                                    <DatePicker.GridRow class={calendarClasses.gridRow}>
                                        {#if weekNumbers}
                                            <td class={calendarClasses.cellWeek}>
                                                {weekIndex + 1}
                                            </td>
                                        {/if}
                                        {#each week as date (date.toString())}
                                            <DatePicker.Cell
                                                {date}
                                                month={month.value}
                                                class={calendarClasses.cell}
                                            >
                                                <DatePicker.Day class={calendarClasses.cellTrigger}>
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
                                                </DatePicker.Day>
                                            </DatePicker.Cell>
                                        {/each}
                                    </DatePicker.GridRow>
                                {/each}
                            </DatePicker.GridBody>
                        </DatePicker.Grid>
                    {/each}
                </div>
            {/snippet}
        </DatePicker.Calendar>

        {#if showTimeInput}
            <div class={classes.time}>
                <Icon name={timeIcon} class={classes.timeIcon} />
                <TimeField.Root
                    value={timeValue}
                    onValueChange={handleTimeChange}
                    placeholder={timeValue ?? timePlaceholder}
                    granularity={resolvedGranularity as 'hour' | 'minute' | 'second'}
                    {hourCycle}
                    {hideTimeZone}
                    {locale}
                    {disabled}
                    {readonly}
                >
                    <TimeField.Input class={classes.timeField} aria-label="Time">
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
            </div>
        {/if}
    </DatePicker.Content>
{/snippet}

<DatePicker.Root
    bind:value
    bind:placeholder
    bind:open
    onValueChange={handleValueChange}
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
    {validate}
    {onInvalid}
    {isDateDisabled}
    {isDateUnavailable}
    closeOnDateSelect={closeOnDateSelect ?? !showTimeInput}
    {initialFocus}
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
        <DatePicker.Input
            bind:ref
            id={resolvedId}
            name={resolvedName}
            class={classes.field}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError ? true : undefined}
        >
            {#snippet children({ segments })}
                {#each segments as segment, i (segment.part + i)}
                    {#if segment.part === 'literal'}
                        <DatePicker.Segment part={segment.part} class={classes.literal}>
                            {segment.value}
                        </DatePicker.Segment>
                    {:else}
                        <DatePicker.Segment part={segment.part} class={classes.segment}>
                            {segment.value}
                        </DatePicker.Segment>
                    {/if}
                {/each}
            {/snippet}
        </DatePicker.Input>

        <DatePicker.Trigger {disabled} class={classes.trigger} aria-label="Open calendar">
            <Icon name={icon} class={classes.triggerIcon} />
        </DatePicker.Trigger>
    </div>

    {#if portal}
        <DatePicker.Portal>
            {@render pickerContentEl()}
        </DatePicker.Portal>
    {:else}
        {@render pickerContentEl()}
    {/if}
</DatePicker.Root>
