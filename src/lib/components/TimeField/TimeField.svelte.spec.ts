import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import TimeField from './TimeField.svelte'
import TimeFieldFormTestWrapper from './TimeFieldFormTestWrapper.svelte'
import { CalendarDateTime, Time } from '@internationalized/date'
import type { TimeValue } from 'bits-ui'

describe('TimeField', () => {
    const getField = () => document.querySelector('[data-time-field-input]') as HTMLElement | null
    const getSegment = (part: string) =>
        document.querySelector(
            `[data-time-field-input] [data-segment="${part}"]`
        ) as HTMLElement | null

    const pressKey = (el: HTMLElement, key: string) =>
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(TimeField)
            expect(container).not.toBeNull()
        })

        it('should render the segmented field', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getField()).not.toBeNull()
            })
        })

        it('should render hour, minute and dayPeriod segments by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
                expect(getSegment('minute')).not.toBeNull()
                expect(getSegment('dayPeriod')).not.toBeNull()
            })
        })

        it('should render literal separators between segments', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                const literals = document.querySelectorAll(
                    '[data-time-field-input] [data-segment="literal"]'
                )
                expect(literals.length).toBeGreaterThan(0)
            })
        })

        it('should render editable segments as spinbuttons', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getSegment('hour')!.getAttribute('role')).toBe('spinbutton')
                expect(getSegment('minute')!.getAttribute('role')).toBe('spinbutton')
            })
        })

        it('should render the clock icon by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                const icon = getField()!.parentElement!.querySelector('.pointer-events-none')
                expect(icon).not.toBeNull()
            })
        })

        it('should hide the icon when icon is false', async () => {
            render(TimeField, { icon: false })
            await vi.waitFor(() => {
                expect(getField()).not.toBeNull()
            })
            expect(getField()!.parentElement!.querySelector('.pointer-events-none')).toBeNull()
        })
    })

    // ==================== GRANULARITY ====================

    describe('granularity', () => {
        it('should not render a second segment by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getSegment('minute')).not.toBeNull()
            })
            expect(getSegment('second')).toBeNull()
        })

        it('should render a second segment with second granularity', async () => {
            render(TimeField, { granularity: 'second' })
            await vi.waitFor(() => {
                expect(getSegment('second')).not.toBeNull()
            })
        })

        it('should render only the hour segment with hour granularity', async () => {
            render(TimeField, { granularity: 'hour' })
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            expect(getSegment('minute')).toBeNull()
        })

        it('should hide the dayPeriod segment with a 24 hour cycle', async () => {
            render(TimeField, { hourCycle: 24 })
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            expect(getSegment('dayPeriod')).toBeNull()
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should display the provided value in the segments', async () => {
            render(TimeField, { value: new Time(10, 30) })
            await vi.waitFor(() => {
                expect(getSegment('hour')!.textContent).toContain('10')
                expect(getSegment('minute')!.textContent).toContain('30')
                expect(getSegment('dayPeriod')!.textContent).toContain('AM')
            })
        })

        it('should display a 12 hour value for afternoon times', async () => {
            render(TimeField, { value: new Time(15, 5) })
            await vi.waitFor(() => {
                expect(getSegment('hour')!.textContent).toContain('3')
                expect(getSegment('dayPeriod')!.textContent).toContain('PM')
            })
        })

        it('should accept a CalendarDateTime value', async () => {
            render(TimeField, { value: new CalendarDateTime(2024, 3, 15, 10, 30) })
            await vi.waitFor(() => {
                expect(getSegment('hour')!.textContent).toContain('10')
                expect(getSegment('minute')!.textContent).toContain('30')
            })
        })

        it('should render a hidden input when name is provided', async () => {
            render(TimeField, { name: 'meeting', value: new Time(10, 30) })
            await vi.waitFor(() => {
                const hidden = document.querySelector('input[name="meeting"]') as HTMLInputElement
                expect(hidden).not.toBeNull()
                expect(hidden.value).toBe('10:30:00')
            })
        })

        it('should not render a hidden input without a name', async () => {
            render(TimeField, { value: new Time(10, 30) })
            await vi.waitFor(() => {
                expect(getField()).not.toBeNull()
            })
            expect(document.querySelector('input[type="hidden"]')).toBeNull()
        })

        it('should call onValueChange when typing into a segment', async () => {
            const onValueChange = vi.fn()
            render(TimeField, { value: new Time(10, 30), onValueChange })
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            const hour = getSegment('hour')!
            hour.focus()
            pressKey(hour, '9')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalled()
                const value = onValueChange.mock.calls.at(-1)![0] as TimeValue
                expect(value.hour).toBe(9)
                expect(value.minute).toBe(30)
            })
        })

        it('should increment a segment with ArrowUp', async () => {
            const onValueChange = vi.fn()
            render(TimeField, { value: new Time(10, 30), onValueChange })
            await vi.waitFor(() => {
                expect(getSegment('minute')).not.toBeNull()
            })
            const minute = getSegment('minute')!
            minute.focus()
            pressKey(minute, 'ArrowUp')
            await vi.waitFor(() => {
                const value = onValueChange.mock.calls.at(-1)![0] as TimeValue
                expect(value.minute).toBe(31)
            })
        })

        it('should not call onValueChange again for an equal value', async () => {
            const onValueChange = vi.fn()
            render(TimeField, { value: new Time(10, 30), onValueChange })
            await vi.waitFor(() => {
                expect(getSegment('minute')).not.toBeNull()
            })
            const minute = getSegment('minute')!
            minute.focus()
            pressKey(minute, 'ArrowUp')
            pressKey(minute, 'ArrowDown')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledTimes(2)
            })
            const value = onValueChange.mock.calls.at(-1)![0] as TimeValue
            expect(value.minute).toBe(30)
        })
    })

    // ==================== VALIDATION ====================

    describe('validation', () => {
        it('should mark the field invalid when below minValue', async () => {
            render(TimeField, { value: new Time(8, 0), minValue: new Time(9, 0) })
            await vi.waitFor(() => {
                expect(getField()!.hasAttribute('data-invalid')).toBe(true)
            })
        })

        it('should mark the field invalid when above maxValue', async () => {
            render(TimeField, { value: new Time(18, 0), maxValue: new Time(17, 0) })
            await vi.waitFor(() => {
                expect(getField()!.hasAttribute('data-invalid')).toBe(true)
            })
        })

        it('should not mark the field invalid inside the bounds', async () => {
            render(TimeField, {
                value: new Time(12, 0),
                minValue: new Time(9, 0),
                maxValue: new Time(17, 0)
            })
            await vi.waitFor(() => {
                expect(getField()).not.toBeNull()
            })
            expect(getField()!.hasAttribute('data-invalid')).toBe(false)
        })
    })

    // ==================== LOCALE ====================

    describe('locale', () => {
        it('should format the segments using the locale', async () => {
            render(TimeField, { locale: 'de', value: new Time(15, 5) })
            await vi.waitFor(() => {
                expect(getSegment('hour')!.textContent).toContain('15')
            })
            expect(getSegment('dayPeriod')).toBeNull()
        })
    })

    // ==================== STATES ====================

    describe('states', () => {
        it('should mark the field as disabled', async () => {
            render(TimeField, { disabled: true })
            await vi.waitFor(() => {
                expect(getField()!.hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should mark the segments as readonly', async () => {
            render(TimeField, { readonly: true })
            await vi.waitFor(() => {
                const hour = getSegment('hour')
                expect(hour).not.toBeNull()
                expect(hour!.hasAttribute('data-readonly')).toBe(true)
            })
        })

        it('should mark only the listed segments as readonly', async () => {
            render(TimeField, { readonlySegments: ['hour'] })
            await vi.waitFor(() => {
                expect(getSegment('hour')!.hasAttribute('data-readonly')).toBe(true)
                expect(getSegment('minute')!.hasAttribute('data-readonly')).toBe(false)
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('px-2.5')
                expect(getField()!.className).toContain('text-sm')
            })
        })

        it('should apply xs size', async () => {
            render(TimeField, { size: 'xs' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('px-1.5')
                expect(getField()!.className).toContain('text-xs')
            })
        })

        it('should apply sm size', async () => {
            render(TimeField, { size: 'sm' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('px-2')
            })
        })

        it('should apply lg size', async () => {
            render(TimeField, { size: 'lg' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('px-3.5')
            })
        })

        it('should apply xl size', async () => {
            render(TimeField, { size: 'xl' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('px-4.5')
                expect(getField()!.className).toContain('text-base')
            })
        })

        it('should reserve icon padding only when the icon is shown', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('pe-10')
            })
        })

        it('should drop the icon padding when icon is false', async () => {
            render(TimeField, { icon: false })
            await vi.waitFor(() => {
                expect(getField()!.className).not.toContain('pe-10')
            })
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply outline variant by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-outline-variant')
            })
        })

        it('should apply soft variant', async () => {
            render(TimeField, { variant: 'soft' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('bg-primary-container/50')
            })
        })

        it('should apply subtle variant', async () => {
            render(TimeField, { variant: 'subtle' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-primary/25')
            })
        })

        it('should apply ghost variant', async () => {
            render(TimeField, { variant: 'ghost' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('bg-transparent')
            })
        })

        it('should apply none variant', async () => {
            render(TimeField, { variant: 'none' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-0')
            })
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should apply primary color by default', async () => {
            render(TimeField)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-primary')
            })
        })

        it('should apply error color', async () => {
            render(TimeField, { color: 'error' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-error')
            })
        })

        it('should apply success color', async () => {
            render(TimeField, { color: 'success' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-success')
            })
        })

        it('should apply highlight ring', async () => {
            render(TimeField, { highlight: true })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-2')
                expect(getField()!.className).toContain('ring-primary')
            })
        })
    })

    // ==================== CUSTOMIZATION ====================

    describe('customization', () => {
        it('should merge a custom class on the root', async () => {
            render(TimeField, { class: 'custom-root-class' })
            await vi.waitFor(() => {
                expect(getField()!.parentElement!.className).toContain('custom-root-class')
            })
        })

        it('should apply ui slot overrides on the field', async () => {
            render(TimeField, { ui: { field: 'custom-field-class' } })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('custom-field-class')
            })
        })

        it('should set the id on the field', async () => {
            render(TimeField, { id: 'meeting-time' })
            await vi.waitFor(() => {
                expect(getField()!.getAttribute('id')).toBe('meeting-time')
            })
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should validate when focus leaves the field empty', async () => {
            render(TimeFieldFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            const hour = getSegment('hour')!
            hour.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(hour)
            })
            hour.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Meeting time is required')
            })
        })

        it('should not validate while moving between segments', async () => {
            render(TimeFieldFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            const hour = getSegment('hour')!
            hour.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(hour)
            })
            getSegment('minute')!.focus()
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Meeting time is required')
        })

        it('should not show an error after entering a time', async () => {
            render(TimeFieldFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
            })
            const hour = getSegment('hour')!
            hour.focus()
            pressKey(hour, 'ArrowUp')
            const minute = getSegment('minute')!
            minute.focus()
            pressKey(minute, 'ArrowUp')
            const dayPeriod = getSegment('dayPeriod')!
            dayPeriod.focus()
            pressKey(dayPeriod, 'ArrowUp')
            dayPeriod.blur()
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Meeting time is required')
        })
    })
})
