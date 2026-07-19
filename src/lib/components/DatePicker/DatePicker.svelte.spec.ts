import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import DatePicker from './DatePicker.svelte'
import DatePickerFormTestWrapper from './DatePickerFormTestWrapper.svelte'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

describe('DatePicker', () => {
    const getRoot = () => document.querySelector('[data-date-field-input]') as HTMLElement | null
    const getSegment = (part: string) =>
        document.querySelector(
            `[data-date-field-segment][data-segment="${part}"]`
        ) as HTMLElement | null
    const getTrigger = () => document.querySelector('[data-popover-trigger]') as HTMLElement | null
    const getContent = () => document.querySelector('[data-popover-content]') as HTMLElement | null
    const getCalendar = () => document.querySelector('[data-calendar-root]') as HTMLElement | null
    const getHeading = () => document.querySelector('[data-calendar-heading]') as HTMLElement | null
    const getDays = () => document.querySelectorAll('[data-calendar-day]')
    const getHeadCells = () => document.querySelectorAll('[data-calendar-head-cell]')
    const getPrevButton = () =>
        document.querySelector('[data-calendar-prev-button]') as HTMLElement | null
    const getNextButton = () =>
        document.querySelector('[data-calendar-next-button]') as HTMLElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(DatePicker)
            expect(container).not.toBeNull()
        })

        it('should render the segmented field', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getRoot()).not.toBeNull()
            })
        })

        it('should render day, month and year segments by default', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getSegment('day')).not.toBeNull()
                expect(getSegment('month')).not.toBeNull()
                expect(getSegment('year')).not.toBeNull()
            })
        })

        it('should render literal separators between segments', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                const literals = document.querySelectorAll('[data-segment="literal"]')
                expect(literals.length).toBeGreaterThan(0)
            })
        })

        it('should render the trigger button', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
        })

        it('should label the trigger for screen readers', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getTrigger()!.getAttribute('aria-label')).toBe('Open calendar')
            })
        })

        it('should not render the popover content when closed', () => {
            render(DatePicker)
            expect(getContent()).toBeNull()
        })

        it('should render time segments with minute granularity', async () => {
            render(DatePicker, {
                value: new CalendarDateTime(2024, 3, 15, 10, 30),
                granularity: 'minute'
            })
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
                expect(getSegment('minute')).not.toBeNull()
            })
        })

        it('should render editable time segments without a value', async () => {
            render(DatePicker, { granularity: 'minute' })
            await vi.waitFor(() => {
                const hour = getSegment('hour')
                const minute = getSegment('minute')
                expect(hour).not.toBeNull()
                expect(minute).not.toBeNull()
                expect(hour!.getAttribute('role')).toBe('spinbutton')
                expect(minute!.getAttribute('role')).toBe('spinbutton')
            })
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should display the provided value in the segments', async () => {
            render(DatePicker, { value: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getSegment('month')!.textContent).toContain('3')
                expect(getSegment('day')!.textContent).toContain('15')
                expect(getSegment('year')!.textContent).toContain('2024')
            })
        })

        it('should render a hidden input when name is provided', async () => {
            render(DatePicker, { name: 'dob', value: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const hidden = document.querySelector('input[name="dob"]') as HTMLInputElement
                expect(hidden).not.toBeNull()
                expect(hidden.value).toBe('2024-03-15')
            })
        })

        it('should call onValueChange when a date is selected', async () => {
            const onValueChange = vi.fn()
            render(DatePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                onValueChange
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalledTimes(1)
                const value = onValueChange.mock.calls[0][0] as DateValue
                expect(value.year).toBe(2024)
                expect(value.month).toBe(3)
            })
        })

        it('should update the segments after selecting a date', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month') && d.textContent?.trim() === '10'
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(getSegment('day')!.textContent).toContain('10')
                expect(getSegment('month')!.textContent).toContain('3')
                expect(getSegment('year')!.textContent).toContain('2024')
            })
        })
    })

    // ==================== OPEN / CLOSE ====================

    describe('open and close', () => {
        it('should open the calendar when the trigger is clicked', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
                expect(getCalendar()).not.toBeNull()
            })
        })

        it('should render the calendar when open is true', async () => {
            render(DatePicker, { open: true })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
                expect(getDays().length).toBeGreaterThan(0)
            })
        })

        it('should call onOpenChange when the trigger is clicked', async () => {
            const onOpenChange = vi.fn()
            render(DatePicker, { onOpenChange })
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(true)
            })
        })

        it('should call onOpenChangeComplete after closing', async () => {
            const onOpenChangeComplete = vi.fn()
            render(DatePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                onOpenChangeComplete
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(onOpenChangeComplete).toHaveBeenCalledWith(false)
            })
        })

        it('should close the popover after selecting a date by default', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(getContent()).toBeNull()
            })
        })

        it('should keep the popover open when closeOnDateSelect is false', async () => {
            render(DatePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                closeOnDateSelect: false
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(day.hasAttribute('data-selected')).toBe(true)
            })
            expect(getContent()).not.toBeNull()
        })
    })

    // ==================== CALENDAR ====================

    describe('calendar', () => {
        it('should show the placeholder month in the heading', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
                expect(heading!.textContent).toContain('March')
                expect(heading!.textContent).toContain('2024')
            })
        })

        it('should render month navigation buttons by default', async () => {
            render(DatePicker, { open: true })
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should hide month controls when monthControls is false', async () => {
            render(DatePicker, { open: true, monthControls: false })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            expect(getPrevButton()).toBeNull()
            expect(getNextButton()).toBeNull()
        })

        it('should render year navigation buttons by default', async () => {
            render(DatePicker, { open: true })
            await vi.waitFor(() => {
                expect(document.querySelector('[aria-label="Previous year"]')).not.toBeNull()
                expect(document.querySelector('[aria-label="Next year"]')).not.toBeNull()
            })
        })

        it('should hide year controls when yearControls is false', async () => {
            render(DatePicker, { open: true, yearControls: false })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            expect(document.querySelector('[aria-label="Previous year"]')).toBeNull()
            expect(document.querySelector('[aria-label="Next year"]')).toBeNull()
        })

        it('should navigate to the next month', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getNextButton()).not.toBeNull()
            })
            getNextButton()!.click()
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('April')
            })
        })

        it('should navigate to the previous year', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            ;(document.querySelector('[aria-label="Previous year"]') as HTMLElement).click()
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('2023')
            })
        })

        it('should render 42 day cells with fixedWeeks by default', async () => {
            render(DatePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getDays().length).toBe(42)
            })
        })

        it('should render two months when numberOfMonths is 2', async () => {
            render(DatePicker, { open: true, numberOfMonths: 2 })
            await vi.waitFor(() => {
                expect(document.querySelectorAll('[data-calendar-grid]').length).toBe(2)
            })
        })

        it('should start the week on Monday when weekStartsOn is 1', async () => {
            render(DatePicker, { open: true, weekStartsOn: 1 })
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(7)
                expect(headCells[0].textContent).toContain('Mo')
            })
        })

        it('should format the heading using the locale', async () => {
            render(DatePicker, {
                open: true,
                locale: 'de',
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('März')
            })
        })

        it('should disable dates matched by isDateDisabled', async () => {
            render(DatePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                isDateDisabled: () => true
            })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect(days[0].hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should render week numbers when weekNumbers is true', async () => {
            render(DatePicker, {
                open: true,
                weekNumbers: true,
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(8)
                expect(headCells[0].textContent).toContain('#')
            })
        })

        it('should mark dates matched by isDateHighlightable', async () => {
            render(DatePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                isDateHighlightable: (date) => date.day === 15
            })
            await vi.waitFor(() => {
                const marked = document.querySelectorAll('[data-calendar-day][data-marked]')
                expect(marked.length).toBeGreaterThan(0)
            })
        })
    })

    // ==================== STATES ====================

    describe('states', () => {
        it('should mark the field as disabled', async () => {
            render(DatePicker, { disabled: true })
            await vi.waitFor(() => {
                expect(getRoot()!.hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should disable the trigger when disabled', async () => {
            render(DatePicker, { disabled: true })
            await vi.waitFor(() => {
                const trigger = getTrigger() as HTMLButtonElement
                expect(trigger).not.toBeNull()
                expect(trigger.disabled || trigger.hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should mark the segments as readonly', async () => {
            render(DatePicker, { readonly: true })
            await vi.waitFor(() => {
                const day = getSegment('day')
                expect(day).not.toBeNull()
                expect(day!.hasAttribute('data-readonly')).toBe(true)
            })
        })

        it('should mark only the listed segments as readonly', async () => {
            render(DatePicker, { readonlySegments: ['year'] })
            await vi.waitFor(() => {
                expect(getSegment('year')!.hasAttribute('data-readonly')).toBe(true)
                expect(getSegment('day')!.hasAttribute('data-readonly')).toBe(false)
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ps-2.5')
                expect(getRoot()!.className).toContain('text-sm')
            })
        })

        it('should apply xs size', async () => {
            render(DatePicker, { size: 'xs' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ps-1.5')
                expect(getRoot()!.className).toContain('text-xs')
            })
        })

        it('should apply sm size', async () => {
            render(DatePicker, { size: 'sm' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ps-2')
            })
        })

        it('should apply lg size', async () => {
            render(DatePicker, { size: 'lg' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ps-3.5')
            })
        })

        it('should apply xl size', async () => {
            render(DatePicker, { size: 'xl' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ps-4.5')
                expect(getRoot()!.className).toContain('text-base')
            })
        })

        it('should scale the calendar with the picker size', async () => {
            render(DatePicker, { open: true, size: 'xl' })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-10')
            })
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply outline variant by default', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ring-outline-variant')
            })
        })

        it('should apply soft variant', async () => {
            render(DatePicker, { variant: 'soft' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('bg-primary-container/50')
            })
        })

        it('should apply subtle variant', async () => {
            render(DatePicker, { variant: 'subtle' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ring-primary/25')
            })
        })

        it('should apply ghost variant', async () => {
            render(DatePicker, { variant: 'ghost' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('bg-transparent')
            })
        })

        it('should apply none variant', async () => {
            render(DatePicker, { variant: 'none' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('focus-within:ring-0')
            })
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should apply primary color by default', async () => {
            render(DatePicker)
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('focus-within:ring-primary')
            })
        })

        it('should apply error color', async () => {
            render(DatePicker, { color: 'error' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('focus-within:ring-error')
            })
        })

        it('should apply success color', async () => {
            render(DatePicker, { color: 'success' })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('focus-within:ring-success')
            })
        })

        it('should apply highlight ring', async () => {
            render(DatePicker, { highlight: true })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('ring-2')
                expect(getRoot()!.className).toContain('ring-primary')
            })
        })

        it('should color the selected day in the calendar', async () => {
            render(DatePicker, {
                open: true,
                value: new CalendarDate(2024, 3, 15),
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                const selected = document.querySelector(
                    '[data-calendar-day][data-selected]'
                ) as HTMLElement
                expect(selected).not.toBeNull()
                expect(selected.className).toContain('data-[selected]:bg-primary')
            })
        })
    })

    // ==================== CUSTOMIZATION ====================

    describe('customization', () => {
        it('should merge a custom class on the root', async () => {
            render(DatePicker, { class: 'custom-root-class' })
            await vi.waitFor(() => {
                expect(getRoot()!.parentElement!.className).toContain('custom-root-class')
            })
        })

        it('should apply ui slot overrides on the field', async () => {
            render(DatePicker, { ui: { field: 'custom-field-class' } })
            await vi.waitFor(() => {
                expect(getRoot()!.className).toContain('custom-field-class')
            })
        })

        it('should apply ui slot overrides on the content', async () => {
            render(DatePicker, { open: true, ui: { content: 'custom-content-class' } })
            await vi.waitFor(() => {
                expect(getContent()!.className).toContain('custom-content-class')
            })
        })

        it('should apply calendar slot overrides', async () => {
            render(DatePicker, {
                open: true,
                ui: { calendarSlots: { heading: 'custom-heading-class' } }
            })
            await vi.waitFor(() => {
                expect(getHeading()!.className).toContain('custom-heading-class')
            })
        })

        it('should set the id on the field', async () => {
            render(DatePicker, { id: 'birthday' })
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('id')).toBe('birthday')
            })
        })
    })

    // ==================== TIME INPUT ====================

    describe('time input', () => {
        const getTimeField = () =>
            document.querySelector('[data-time-field-input]') as HTMLElement | null
        const getTimeSegment = (part: string) =>
            document.querySelector(
                `[data-time-field-input] [data-segment="${part}"]`
            ) as HTMLElement | null

        it('should not render a time field by default', async () => {
            render(DatePicker, { open: true })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            expect(getTimeField()).toBeNull()
        })

        it('should render a time field in the popover when timeInput is set', async () => {
            render(DatePicker, { open: true, timeInput: true })
            await vi.waitFor(() => {
                expect(getTimeField()).not.toBeNull()
                expect(getTimeSegment('hour')).not.toBeNull()
                expect(getTimeSegment('minute')).not.toBeNull()
            })
        })

        it('should imply minute granularity on the main field', async () => {
            render(DatePicker, { timeInput: true })
            await vi.waitFor(() => {
                expect(getSegment('hour')).not.toBeNull()
                expect(getSegment('minute')).not.toBeNull()
            })
        })

        it('should display the time portion of the value', async () => {
            render(DatePicker, {
                open: true,
                timeInput: true,
                value: new CalendarDateTime(2024, 3, 15, 14, 45)
            })
            await vi.waitFor(() => {
                expect(getTimeSegment('hour')!.textContent).toContain('2')
                expect(getTimeSegment('minute')!.textContent).toContain('45')
            })
        })

        it('should keep the popover open after selecting a date', async () => {
            render(DatePicker, {
                open: true,
                timeInput: true,
                placeholder: new CalendarDateTime(2024, 3, 15, 10, 30)
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(day.hasAttribute('data-selected')).toBe(true)
            })
            expect(getContent()).not.toBeNull()
        })

        it('should still close on date select when closeOnDateSelect is true', async () => {
            render(DatePicker, {
                open: true,
                timeInput: true,
                closeOnDateSelect: true,
                placeholder: new CalendarDateTime(2024, 3, 15, 10, 30)
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(getContent()).toBeNull()
            })
        })

        it('should update the value when editing the popover time field', async () => {
            const onValueChange = vi.fn()
            render(DatePicker, {
                open: true,
                timeInput: true,
                value: new CalendarDateTime(2024, 3, 15, 10, 30),
                onValueChange
            })
            await vi.waitFor(() => {
                expect(getTimeSegment('minute')).not.toBeNull()
            })
            const minute = getTimeSegment('minute')!
            minute.focus()
            minute.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
            )
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalled()
                const value = onValueChange.mock.calls.at(-1)![0] as CalendarDateTime
                expect(value.minute).toBe(31)
                expect(value.day).toBe(15)
            })
        })

        it('should sync the main field segments after editing the time', async () => {
            render(DatePicker, {
                open: true,
                timeInput: true,
                value: new CalendarDateTime(2024, 3, 15, 10, 30)
            })
            await vi.waitFor(() => {
                expect(getTimeSegment('hour')).not.toBeNull()
            })
            const hour = getTimeSegment('hour')!
            hour.focus()
            hour.dispatchEvent(
                new KeyboardEvent('keydown', { key: '9', bubbles: true, cancelable: true })
            )
            await vi.waitFor(() => {
                expect(getSegment('hour')!.textContent).toContain('9')
            })
        })

        it('should anchor the date to the placeholder when editing time first', async () => {
            const onValueChange = vi.fn()
            render(DatePicker, {
                open: true,
                timeInput: true,
                placeholder: new CalendarDateTime(2024, 3, 15, 10, 30),
                onValueChange
            })
            await vi.waitFor(() => {
                expect(getTimeSegment('hour')).not.toBeNull()
            })
            for (const part of ['hour', 'minute', 'dayPeriod']) {
                const segment = getTimeSegment(part)!
                segment.focus()
                segment.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp',
                        bubbles: true,
                        cancelable: true
                    })
                )
            }
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenCalled()
                const value = onValueChange.mock.calls.at(-1)![0] as CalendarDateTime
                expect(value.year).toBe(2024)
                expect(value.month).toBe(3)
                expect(value.day).toBe(15)
            })
        })

        it('should keep the selected date after clearing and retyping the time', async () => {
            const onValueChange = vi.fn()
            render(DatePicker, {
                open: true,
                timeInput: true,
                value: new CalendarDateTime(2024, 3, 15, 10, 30),
                onValueChange
            })
            await vi.waitFor(() => {
                expect(getNextButton()).not.toBeNull()
                expect(getTimeSegment('hour')).not.toBeNull()
            })
            getNextButton()!.click()
            getNextButton()!.click()
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('May')
            })
            const hour = getTimeSegment('hour')!
            hour.focus()
            for (const key of ['Backspace', 'Backspace', '9']) {
                hour.dispatchEvent(
                    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
                )
            }
            await vi.waitFor(() => {
                const value = onValueChange.mock.calls.at(-1)![0] as CalendarDateTime
                expect(value.hour).toBe(9)
                expect(value.month).toBe(3)
                expect(value.day).toBe(15)
            })
        })

        it('should apply ui slot overrides on the time area', async () => {
            render(DatePicker, {
                open: true,
                timeInput: true,
                ui: { time: 'custom-time-class', timeField: 'custom-time-field-class' }
            })
            await vi.waitFor(() => {
                expect(getTimeField()!.className).toContain('custom-time-field-class')
                expect(getTimeField()!.closest('.custom-time-class')).not.toBeNull()
            })
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should not validate when opening the calendar', async () => {
            render(DatePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegment('day')).not.toBeNull()
            })
            const daySegment = getSegment('day')!
            daySegment.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(daySegment)
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Birthday is required')
        })

        it('should not show an error after selecting a date', async () => {
            render(DatePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            const day = Array.from(getDays()).find(
                (d) => !d.hasAttribute('data-outside-month')
            ) as HTMLElement
            day.click()
            await vi.waitFor(() => {
                expect(getContent()).toBeNull()
            })
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Birthday is required')
        })

        it('should validate when focus leaves the field empty', async () => {
            render(DatePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegment('day')).not.toBeNull()
            })
            const day = getSegment('day')!
            day.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(day)
            })
            day.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Birthday is required')
            })
        })
    })
})
