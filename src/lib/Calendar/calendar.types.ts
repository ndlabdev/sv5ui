import type { Snippet } from 'svelte'
import type { DateValue } from '@internationalized/date'
import type { ClassNameValue } from 'tailwind-merge'
import type { CalendarSlots, CalendarVariantProps } from './calendar.variants.js'
import type { CalendarDaySnippetProps, CalendarHeadingSnippetProps } from 'bits-ui'
import type { DateRange, DateMatcher } from 'bits-ui'

type OnChangeFn<T> = (value: T) => void

// ============================================================================
// Value Types
// ============================================================================

export type CalendarSingleValue = DateValue | undefined
export type CalendarMultipleValue = DateValue[] | undefined
export type CalendarRangeValue = DateRange | undefined
export type CalendarValue = CalendarSingleValue | CalendarMultipleValue | CalendarRangeValue

// ============================================================================
// Slot Props Types
// ============================================================================

export interface CalendarHeadingSlotProps extends CalendarHeadingSnippetProps {
    prevMonth: () => void
    nextMonth: () => void
    prevYear: () => void
    nextYear: () => void
}

export interface CalendarDaySlotProps extends CalendarDaySnippetProps {
    date: DateValue
}

export interface CalendarWeekdaySlotProps {
    weekday: string
}

// ============================================================================
// Shared Calendar Root Props
// ============================================================================

type SharedCalendarRootProps = {
    /**
     * The placeholder date, used to control the view of the
     * calendar when no value is present.
     * @default the current date
     */
    placeholder?: DateValue

    /**
     * A callback function called when the placeholder value changes.
     */
    onPlaceholderChange?: OnChangeFn<DateValue>

    /**
     * Whether or not users can deselect a date once selected.
     * @default false
     */
    preventDeselect?: boolean

    /**
     * The minimum date that can be selected.
     */
    minValue?: DateValue

    /**
     * The maximum date that can be selected.
     */
    maxValue?: DateValue

    /**
     * Whether or not the calendar is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Controls paged navigation when numberOfMonths > 1.
     * @default false
     */
    pagedNavigation?: boolean

    /**
     * The day of the week to start on (0=Sunday, 6=Saturday).
     * @default 0
     */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

    /**
     * Weekday format: 'narrow', 'short', or 'long'.
     * @default 'short'
     */
    weekdayFormat?: Intl.DateTimeFormatOptions['weekday']

    /**
     * A function that returns true if a date should be disabled.
     */
    isDateDisabled?: DateMatcher

    /**
     * A function that returns true if a date should be marked unavailable.
     */
    isDateUnavailable?: DateMatcher

    /**
     * Always display 6 weeks per month.
     * @default false
     */
    fixedWeeks?: boolean

    /**
     * Number of months to display simultaneously.
     * @default 1
     */
    numberOfMonths?: number

    /**
     * Accessibility label for the calendar.
     */
    calendarLabel?: string

    /**
     * Locale for date formatting.
     * @default 'en'
     */
    locale?: string

    /**
     * Whether the calendar is readonly.
     * @default false
     */
    readonly?: boolean

    /**
     * Whether to disable days outside the current month.
     * @default false
     */
    disableDaysOutsideMonth?: boolean
}

// ============================================================================
// Base UI Props (shared across all modes)
// ============================================================================

type BaseCalendarProps = {
    /**
     * Icon for navigating to the previous month.
     * @default 'lucide:chevron-left'
     */
    prevMonthIcon?: string

    /**
     * Icon for navigating to the next month.
     * @default 'lucide:chevron-right'
     */
    nextMonthIcon?: string

    /**
     * Icon for navigating to the previous year.
     * @default 'lucide:chevrons-left'
     */
    prevYearIcon?: string

    /**
     * Icon for navigating to the next year.
     * @default 'lucide:chevrons-right'
     */
    nextYearIcon?: string

    /**
     * Whether to show month navigation controls in the header.
     * @default true
     */
    monthControls?: boolean

    /**
     * Whether to show year navigation controls in the header.
     * @default false
     */
    yearControls?: boolean

    /**
     * Whether to display week numbers alongside the calendar.
     * @default false
     */
    weekNumbers?: boolean

    /**
     * Color variant for the calendar.
     * @default 'primary'
     */
    color?: NonNullable<CalendarVariantProps['color']>

    /**
     * Size variant for the calendar.
     * @default 'md'
     */
    size?: NonNullable<CalendarVariantProps['size']>

    /**
     * Visual style variant for the calendar.
     * @default 'solid'
     */
    variant?: NonNullable<CalendarVariantProps['variant']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific calendar slots.
     */
    ui?: Partial<Record<CalendarSlots, ClassNameValue>>

    /**
     * Custom heading snippet for rendering the month/year display.
     */
    heading?: Snippet<[CalendarHeadingSlotProps]>

    /**
     * Custom day snippet for rendering individual calendar days.
     */
    day?: Snippet<[CalendarDaySlotProps]>

    /**
     * Custom weekday snippet for rendering weekday headers.
     */
    weekday?: Snippet<[CalendarWeekdaySlotProps]>
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for single date selection Calendar.
 */
export type CalendarSingleProps = SharedCalendarRootProps &
    BaseCalendarProps & {
        range?: false
        type?: 'single'
        value?: DateValue
        onValueChange?: OnChangeFn<DateValue | undefined>
        initialFocus?: boolean
    }

/**
 * Props for multiple date selection Calendar.
 */
export type CalendarMultipleProps = SharedCalendarRootProps &
    BaseCalendarProps & {
        range?: false
        type: 'multiple'
        value?: DateValue[]
        onValueChange?: OnChangeFn<DateValue[]>
        initialFocus?: boolean
        maxDays?: number
    }

/**
 * Props for date range selection Calendar.
 */
export type CalendarRangeProps = SharedCalendarRootProps &
    BaseCalendarProps & {
        range: true
        value?: DateRange
        onValueChange?: OnChangeFn<DateRange>
        minDays?: number
        maxDays?: number
        onStartValueChange?: OnChangeFn<DateValue | undefined>
        onEndValueChange?: OnChangeFn<DateValue | undefined>
        excludeDisabled?: boolean
    }

/**
 * Props for the Calendar component.
 *
 * @example
 * ```svelte
 * <!-- Single date selection -->
 * <Calendar bind:value={selectedDate} />
 *
 * <!-- Multiple date selection -->
 * <Calendar type="multiple" bind:value={selectedDates} />
 *
 * <!-- Date range selection -->
 * <Calendar range bind:value={dateRange} />
 * ```
 *
 * @see https://bits-ui.com/docs/components/calendar
 */
export type CalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps
