import type { ClassNameValue } from 'tailwind-merge'
import type { TimeFieldSlots, TimeFieldVariantProps } from './time-field.variants.js'
import type { TimeOnInvalid, TimeValidator, TimeValue } from 'bits-ui'

type OnChangeFn<T> = (value: T) => void

type EditableTimeSegmentPart = 'hour' | 'minute' | 'second' | 'dayPeriod'

type TimeGranularity = 'hour' | 'minute' | 'second'

export interface TimeFieldProps {
    /**
     * Bindable reference to the segmented field element.
     */
    ref?: HTMLElement | null
    /**
     * The selected time. Accepts a `Time`, `CalendarDateTime`, or
     * `ZonedDateTime`; only the time portion is edited, any date portion is
     * preserved.
     */
    value?: TimeValue
    onValueChange?: OnChangeFn<TimeValue | undefined>
    /**
     * The time used to anchor the empty field format.
     * @default the current time
     */
    placeholder?: TimeValue
    onPlaceholderChange?: OnChangeFn<TimeValue | undefined>
    /**
     * The HTML `id` attribute for the field element. Used by a parent
     * `<FormField>` so the label's `for` attribute can target the field.
     */
    id?: string
    /**
     * The name used for the hidden input element, enabling native form
     * submission. Also used by a parent `<Form>` to look up validation state.
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
    readonlySegments?: EditableTimeSegmentPart[]
    /**
     * Which segments the field renders.
     * @default 'minute'
     */
    granularity?: TimeGranularity
    hourCycle?: 12 | 24
    /** @default false */
    hideTimeZone?: boolean
    /** @default 'en' */
    locale?: string
    minValue?: TimeValue
    maxValue?: TimeValue
    /**
     * Returns a string (or array of strings) of validation errors when the
     * time is invalid, or nothing when valid.
     */
    validate?: TimeValidator<TimeValue>
    /**
     * Called when the entered time fails validation. Use it to surface an
     * error message to the user.
     */
    onInvalid?: TimeOnInvalid
    /**
     * Decorative icon shown at the end of the field. Pass `false` to hide it
     * and reclaim the reserved padding.
     * @default 'lucide:clock'
     */
    icon?: string | false
    /** @default 'primary' */
    color?: NonNullable<TimeFieldVariantProps['color']>
    /** @default 'md' */
    size?: NonNullable<TimeFieldVariantProps['size']>
    /**
     * Visual style of the segmented field, mirroring `<Input>` variants.
     * @default 'outline'
     */
    variant?: NonNullable<TimeFieldVariantProps['variant']>
    /**
     * Force the focus ring, e.g. to reflect an external error state.
     * @default false
     */
    highlight?: boolean
    class?: ClassNameValue
    ui?: Partial<Record<TimeFieldSlots, ClassNameValue>>
}
