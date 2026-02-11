import type { Snippet } from 'svelte'
import type { DateValue } from '@internationalized/date'
import type { ClassNameValue } from 'tailwind-merge'
import type { CalendarSlots, CalendarVariantProps } from './calendar.variants.js'
import type { DateRange, DateMatcher } from 'bits-ui'

type OnChangeFn<T> = (value: T) => void

export interface CalendarHeadingSlotProps {
    value: string
}

export interface CalendarDaySlotProps {
    day: DateValue
}

export interface CalendarWeekDaySlotProps {
    day: string
}

type SharedCalendarRootProps = {
    /** @default the current date */
    placeholder?: DateValue
    onPlaceholderChange?: OnChangeFn<DateValue>
    /** @default false */
    preventDeselect?: boolean
    minValue?: DateValue
    maxValue?: DateValue
    /** @default false */
    disabled?: boolean
    /** @default false */
    pagedNavigation?: boolean
    /** @default 0 */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** @default 'short' */
    weekdayFormat?: Intl.DateTimeFormatOptions['weekday']
    isDateDisabled?: DateMatcher
    isDateUnavailable?: DateMatcher
    /** @default true */
    fixedWeeks?: boolean
    /** @default 1 */
    numberOfMonths?: number
    calendarLabel?: string
    /** @default 'en' */
    locale?: string
    /** @default false */
    readonly?: boolean
    /** @default false */
    disableDaysOutsideMonth?: boolean
}

type BaseCalendarProps = {
    /** @default 'lucide:chevron-left' */
    prevMonthIcon?: string
    /** @default 'lucide:chevron-right' */
    nextMonthIcon?: string
    /** @default 'lucide:chevrons-left' */
    prevYearIcon?: string
    /** @default 'lucide:chevrons-right' */
    nextYearIcon?: string
    /** @default true */
    monthControls?: boolean
    /** @default true */
    yearControls?: boolean
    /** @default false */
    weekNumbers?: boolean
    /** @default 'primary' */
    color?: NonNullable<CalendarVariantProps['color']>
    /** @default 'md' */
    size?: NonNullable<CalendarVariantProps['size']>
    /** @default 'solid' */
    variant?: NonNullable<CalendarVariantProps['variant']>
    class?: ClassNameValue
    ui?: Partial<Record<CalendarSlots, ClassNameValue>>
    heading?: Snippet<[CalendarHeadingSlotProps]>
    day?: Snippet<[CalendarDaySlotProps]>
    weekDay?: Snippet<[CalendarWeekDaySlotProps]>
}

export type CalendarSingleProps = SharedCalendarRootProps &
    BaseCalendarProps & {
        range?: false
        type?: 'single'
        value?: DateValue
        onValueChange?: OnChangeFn<DateValue | undefined>
        initialFocus?: boolean
    }

export type CalendarMultipleProps = SharedCalendarRootProps &
    BaseCalendarProps & {
        range?: false
        type: 'multiple'
        value?: DateValue[]
        onValueChange?: OnChangeFn<DateValue[]>
        initialFocus?: boolean
        maxDays?: number
    }

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

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps
