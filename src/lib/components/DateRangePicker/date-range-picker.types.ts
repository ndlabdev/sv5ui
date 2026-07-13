import type { Snippet } from 'svelte'
import type { DateValue } from '@internationalized/date'
import type { ClassNameValue } from 'tailwind-merge'
import type {
    DateRangePickerSlots,
    DateRangePickerVariantProps
} from './date-range-picker.variants.js'
import type { CalendarSlots, CalendarVariantProps } from '../Calendar/calendar.variants.js'
import type {
    CalendarHeadingSlotProps,
    CalendarDaySlotProps,
    CalendarWeekDaySlotProps
} from '../Calendar/calendar.types.js'
import type { DateMatcher, DateOnInvalid, DateRange, DateRangeValidator } from 'bits-ui'

type OnChangeFn<T> = (value: T) => void

type EditableSegmentPart = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod'

type Granularity = 'day' | 'hour' | 'minute' | 'second'

export interface DateRangePickerProps {
    /**
     * Bindable reference to the field container element.
     */
    ref?: HTMLElement | null
    /**
     * The selected date range (`{ start, end }`).
     */
    value?: DateRange
    onValueChange?: OnChangeFn<DateRange | undefined>
    /**
     * Called when the start date changes, including while the range is still
     * incomplete. Useful for cosmetic updates; `onValueChange` only reflects
     * committed ranges.
     */
    onStartValueChange?: OnChangeFn<DateValue | undefined>
    /**
     * Called when the end date changes, including while the range is still
     * incomplete.
     */
    onEndValueChange?: OnChangeFn<DateValue | undefined>
    /**
     * The date used to anchor the empty field format and the calendar view.
     * @default the current date
     */
    placeholder?: DateValue
    onPlaceholderChange?: OnChangeFn<DateValue>
    /**
     * The open state of the calendar popover.
     * @default false
     */
    open?: boolean
    onOpenChange?: OnChangeFn<boolean>
    /**
     * Called when the open/close animation of the popover finishes.
     *
     * Note: with the current bits-ui version this reliably fires on close;
     * on open the content is not mounted yet when the animation check runs,
     * so the `true` call may be skipped (upstream limitation).
     */
    onOpenChangeComplete?: OnChangeFn<boolean>
    /**
     * The HTML `id` attribute for the start input element. Used by a parent
     * `<FormField>` so the label's `for` attribute can target the picker.
     */
    id?: string
    /**
     * Base name for the hidden input elements, enabling native form
     * submission as `{name}-start` and `{name}-end`. Also used by a parent
     * `<Form>` to look up validation state.
     */
    name?: string
    /** @default false */
    required?: boolean
    /** @default false */
    disabled?: boolean
    /** @default false */
    readonly?: boolean
    /**
     * Segment names that should be readonly while the rest stay editable.
     */
    readonlySegments?: EditableSegmentPart[]
    /**
     * Which segments the inputs render. Defaults to `'day'` for plain dates
     * and `'minute'` for date-time values (or when `timeInput` is set).
     */
    granularity?: Granularity
    hourCycle?: 12 | 24
    /** @default false */
    hideTimeZone?: boolean
    /** @default 'en' */
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    /**
     * The minimum number of days that can be selected in a range.
     */
    minDays?: number
    /**
     * The maximum number of days that can be selected in a range.
     */
    maxDays?: number
    /**
     * Clear the whole range when a date inside it becomes disabled.
     * @default false
     */
    excludeDisabled?: boolean
    /**
     * Returns a string (or array of strings) of validation errors when the
     * range is invalid, or nothing when valid.
     */
    validate?: DateRangeValidator
    /**
     * Called when the entered range fails validation. Use it to surface an
     * error message to the user.
     */
    onInvalid?: DateOnInvalid
    isDateDisabled?: DateMatcher
    isDateUnavailable?: DateMatcher
    /**
     * Predicate that returns `true` for dates that should be visually marked
     * (e.g. holidays, events). Marked dates remain selectable; the calendar
     * cell gets a `data-marked` attribute rendered as a small dot indicator.
     *
     * Called for every visible cell, so keep it cheap and pure.
     */
    isDateHighlightable?: DateMatcher
    /**
     * Close the popover after a complete range is selected.
     * @default true — false when `timeInput` is set, so the popover stays
     * open for time entry
     */
    closeOnRangeSelect?: boolean
    /**
     * Show segmented start and end time fields inside the popover, below the
     * calendar. Implies `granularity: 'minute'` unless a time granularity is
     * provided. Editing a time before its date is picked anchors the date
     * portion to `placeholder`.
     * @default false
     */
    timeInput?: boolean
    /**
     * Icon shown next to the popover time fields.
     * @default 'lucide:clock'
     */
    timeIcon?: string
    /** @default false */
    preventDeselect?: boolean
    /** @default 0 */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** @default 'short' */
    weekdayFormat?: Intl.DateTimeFormatOptions['weekday']
    /** @default true */
    fixedWeeks?: boolean
    /** @default 2 */
    numberOfMonths?: number
    /** @default false */
    pagedNavigation?: boolean
    calendarLabel?: string
    /** @default false */
    disableDaysOutsideMonth?: boolean
    /** @default false */
    weekNumbers?: boolean
    /** @default true */
    monthControls?: boolean
    /** @default true */
    yearControls?: boolean
    /** @default 'lucide:chevron-left' */
    prevMonthIcon?: string
    /** @default 'lucide:chevron-right' */
    nextMonthIcon?: string
    /** @default 'lucide:chevrons-left' */
    prevYearIcon?: string
    /** @default 'lucide:chevrons-right' */
    nextYearIcon?: string
    /**
     * Icon shown in the popover trigger button.
     * @default 'lucide:calendar'
     */
    icon?: string
    /**
     * Icon rendered between the start and end inputs.
     * @default 'lucide:minus'
     */
    separatorIcon?: string
    /** @default 'bottom' */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** @default 8 */
    sideOffset?: number
    /** @default 'start' */
    align?: 'start' | 'center' | 'end'
    /** @default 0 */
    alignOffset?: number
    /**
     * Render the popover content in a portal.
     * @default true
     */
    portal?: boolean
    /**
     * Animate the popover content.
     * @default true
     */
    transition?: boolean
    /** @default 'primary' */
    color?: NonNullable<DateRangePickerVariantProps['color']>
    /** @default 'md' */
    size?: NonNullable<DateRangePickerVariantProps['size']>
    /**
     * Visual style of the field, mirroring `<Input>` variants.
     * @default 'outline'
     */
    variant?: NonNullable<DateRangePickerVariantProps['variant']>
    /**
     * Visual style of the calendar inside the popover, mirroring
     * `<Calendar>` variants.
     * @default 'solid'
     */
    calendarVariant?: NonNullable<CalendarVariantProps['variant']>
    /**
     * Force the focus ring, e.g. to reflect an external error state.
     * @default false
     */
    highlight?: boolean
    class?: ClassNameValue
    ui?: Partial<Record<DateRangePickerSlots, ClassNameValue>> & {
        calendarSlots?: Partial<Record<CalendarSlots, ClassNameValue>>
    }
    heading?: Snippet<[CalendarHeadingSlotProps]>
    day?: Snippet<[CalendarDaySlotProps]>
    weekDay?: Snippet<[CalendarWeekDaySlotProps]>
}
