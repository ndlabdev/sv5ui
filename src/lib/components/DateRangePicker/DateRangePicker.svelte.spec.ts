import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import DateRangePicker from './DateRangePicker.svelte'
import DateRangePickerFormTestWrapper from './DateRangePickerFormTestWrapper.svelte'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import type { DateRange } from 'bits-ui'

describe('DateRangePicker', () => {
    const getInputs = () => document.querySelectorAll('[data-date-field-input]')
    const getStartInput = () => getInputs()[0] as HTMLElement | undefined
    const getField = () => getStartInput()?.parentElement as HTMLElement | null | undefined
    const getSegments = (part: string) =>
        document.querySelectorAll(`[data-date-field-segment][data-segment="${part}"]`)
    const getTrigger = () => document.querySelector('[data-popover-trigger]') as HTMLElement | null
    const getContent = () => document.querySelector('[data-popover-content]') as HTMLElement | null
    const getCalendar = () =>
        document.querySelector('[data-range-calendar-root]') as HTMLElement | null
    const getHeading = () =>
        document.querySelector('[data-range-calendar-heading]') as HTMLElement | null
    const getDays = () => document.querySelectorAll('[data-range-calendar-day]')
    const getHeadCells = () => document.querySelectorAll('[data-range-calendar-head-cell]')
    const getPrevButton = () =>
        document.querySelector('[data-range-calendar-prev-button]') as HTMLElement | null
    const getNextButton = () =>
        document.querySelector('[data-range-calendar-next-button]') as HTMLElement | null

    const findDay = (day: string) =>
        Array.from(getDays()).find(
            (d) => !d.hasAttribute('data-outside-month') && d.textContent?.trim() === day
        ) as HTMLElement

    const sampleRange: DateRange = {
        start: new CalendarDate(2024, 3, 10),
        end: new CalendarDate(2024, 3, 20)
    }

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(DateRangePicker)
            expect(container).not.toBeNull()
        })

        it('should render start and end segmented inputs', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getInputs().length).toBe(2)
            })
        })

        it('should render day, month and year segments in both inputs', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getSegments('day').length).toBe(2)
                expect(getSegments('month').length).toBe(2)
                expect(getSegments('year').length).toBe(2)
            })
        })

        it('should render the trigger button', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
        })

        it('should label the trigger for screen readers', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getTrigger()!.getAttribute('aria-label')).toBe('Open calendar')
            })
        })

        it('should not render the popover content when closed', () => {
            render(DateRangePicker)
            expect(getContent()).toBeNull()
        })

        it('should render time segments with minute granularity', async () => {
            render(DateRangePicker, {
                value: {
                    start: new CalendarDateTime(2024, 3, 10, 9, 0),
                    end: new CalendarDateTime(2024, 3, 20, 17, 30)
                },
                granularity: 'minute'
            })
            await vi.waitFor(() => {
                expect(getSegments('hour').length).toBe(2)
                expect(getSegments('minute').length).toBe(2)
            })
        })

        it('should render editable time segments without a value', async () => {
            render(DateRangePicker, { granularity: 'minute' })
            await vi.waitFor(() => {
                const hours = getSegments('hour')
                expect(hours.length).toBe(2)
                expect(hours[0].getAttribute('role')).toBe('spinbutton')
            })
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should display the provided range in the segments', async () => {
            render(DateRangePicker, { value: sampleRange })
            await vi.waitFor(() => {
                expect(getSegments('day')[0].textContent).toContain('10')
                expect(getSegments('day')[1].textContent).toContain('20')
                expect(getSegments('month')[0].textContent).toContain('3')
                expect(getSegments('year')[0].textContent).toContain('2024')
            })
        })

        it('should render hidden inputs when name is provided', async () => {
            render(DateRangePicker, { name: 'stay', value: sampleRange })
            await vi.waitFor(() => {
                const start = document.querySelector('input[name="stay-start"]') as HTMLInputElement
                const end = document.querySelector('input[name="stay-end"]') as HTMLInputElement
                expect(start).not.toBeNull()
                expect(end).not.toBeNull()
                expect(start.value).toBe('2024-03-10')
                expect(end.value).toBe('2024-03-20')
            })
        })

        it('should call onValueChange with the complete range after selecting both dates', async () => {
            const onValueChange = vi.fn()
            render(DateRangePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                onValueChange
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            findDay('10').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-start]')
                ).not.toBeNull()
            })
            findDay('20').click()
            await vi.waitFor(() => {
                const lastCall = onValueChange.mock.calls.at(-1)![0] as DateRange
                expect(lastCall.start?.day).toBe(10)
                expect(lastCall.end?.day).toBe(20)
                expect(lastCall.start?.month).toBe(3)
                expect(lastCall.start?.year).toBe(2024)
            })
        })

        it('should update the segments after selecting a range', async () => {
            render(DateRangePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            findDay('10').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-start]')
                ).not.toBeNull()
            })
            findDay('20').click()
            await vi.waitFor(() => {
                expect(getSegments('day')[0].textContent).toContain('10')
                expect(getSegments('day')[1].textContent).toContain('20')
            })
        })
    })

    // ==================== OPEN / CLOSE ====================

    describe('open and close', () => {
        it('should open the calendar when the trigger is clicked', async () => {
            render(DateRangePicker)
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
            render(DateRangePicker, { open: true })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
                expect(getDays().length).toBeGreaterThan(0)
            })
        })

        it('should call onOpenChange when the trigger is clicked', async () => {
            const onOpenChange = vi.fn()
            render(DateRangePicker, { onOpenChange })
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(true)
            })
        })

        it('should close the popover after selecting a complete range by default', async () => {
            render(DateRangePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            findDay('10').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-start]')
                ).not.toBeNull()
            })
            findDay('20').click()
            await vi.waitFor(() => {
                expect(getContent()).toBeNull()
            })
        })

        it('should keep the popover open when closeOnRangeSelect is false', async () => {
            render(DateRangePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                closeOnRangeSelect: false
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            findDay('10').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-start]')
                ).not.toBeNull()
            })
            findDay('20').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-end]')
                ).not.toBeNull()
            })
            expect(getContent()).not.toBeNull()
        })
    })

    // ==================== RANGE STATES ====================

    describe('range states', () => {
        it('should mark selection start, end and middle days', async () => {
            render(DateRangePicker, {
                open: true,
                value: sampleRange,
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                const start = document.querySelector(
                    '[data-range-calendar-day][data-selection-start]'
                )
                const end = document.querySelector('[data-range-calendar-day][data-selection-end]')
                const middle = document.querySelectorAll(
                    '[data-range-calendar-day][data-range-middle]'
                )
                expect(start).not.toBeNull()
                expect(end).not.toBeNull()
                expect(start!.textContent).toContain('10')
                expect(end!.textContent).toContain('20')
                expect(middle.length).toBe(9)
            })
        })

        it('should style endpoints solid and middle days tinted', async () => {
            render(DateRangePicker, {
                open: true,
                value: sampleRange,
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                const start = document.querySelector(
                    '[data-range-calendar-day][data-selection-start]'
                ) as HTMLElement
                const middle = document.querySelector(
                    '[data-range-calendar-day][data-range-middle]'
                ) as HTMLElement
                expect(start).not.toBeNull()
                expect(middle).not.toBeNull()
                expect(start.className).toContain(
                    'data-[selected]:not-data-[range-middle]:bg-primary'
                )
                expect(middle.className).toContain('data-[range-middle]:bg-primary/20')
            })
        })
    })

    // ==================== CALENDAR ====================

    describe('calendar', () => {
        it('should render two months by default', async () => {
            render(DateRangePicker, { open: true })
            await vi.waitFor(() => {
                expect(document.querySelectorAll('[data-range-calendar-grid]').length).toBe(2)
            })
        })

        it('should render a single month when numberOfMonths is 1', async () => {
            render(DateRangePicker, { open: true, numberOfMonths: 1 })
            await vi.waitFor(() => {
                expect(document.querySelectorAll('[data-range-calendar-grid]').length).toBe(1)
            })
        })

        it('should show the placeholder month in the heading', async () => {
            render(DateRangePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
                expect(heading!.textContent).toContain('March')
                expect(heading!.textContent).toContain('2024')
            })
        })

        it('should render month navigation buttons by default', async () => {
            render(DateRangePicker, { open: true })
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should hide month controls when monthControls is false', async () => {
            render(DateRangePicker, { open: true, monthControls: false })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            expect(getPrevButton()).toBeNull()
            expect(getNextButton()).toBeNull()
        })

        it('should render year navigation buttons by default', async () => {
            render(DateRangePicker, { open: true })
            await vi.waitFor(() => {
                expect(document.querySelector('[aria-label="Previous year"]')).not.toBeNull()
                expect(document.querySelector('[aria-label="Next year"]')).not.toBeNull()
            })
        })

        it('should hide year controls when yearControls is false', async () => {
            render(DateRangePicker, { open: true, yearControls: false })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            expect(document.querySelector('[aria-label="Previous year"]')).toBeNull()
            expect(document.querySelector('[aria-label="Next year"]')).toBeNull()
        })

        it('should navigate to the next month', async () => {
            render(DateRangePicker, {
                open: true,
                numberOfMonths: 1,
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                expect(getNextButton()).not.toBeNull()
            })
            getNextButton()!.click()
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('April')
            })
        })

        it('should navigate to the previous year', async () => {
            render(DateRangePicker, { open: true, placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            ;(document.querySelector('[aria-label="Previous year"]') as HTMLElement).click()
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('2023')
            })
        })

        it('should render 42 day cells per month with fixedWeeks by default', async () => {
            render(DateRangePicker, {
                open: true,
                numberOfMonths: 1,
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                expect(getDays().length).toBe(42)
            })
        })

        it('should start the week on Monday when weekStartsOn is 1', async () => {
            render(DateRangePicker, { open: true, numberOfMonths: 1, weekStartsOn: 1 })
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(7)
                expect(headCells[0].textContent).toContain('Mo')
            })
        })

        it('should format the heading using the locale', async () => {
            render(DateRangePicker, {
                open: true,
                locale: 'de',
                placeholder: new CalendarDate(2024, 3, 15)
            })
            await vi.waitFor(() => {
                expect(getHeading()!.textContent).toContain('März')
            })
        })

        it('should disable dates matched by isDateDisabled', async () => {
            render(DateRangePicker, {
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
            render(DateRangePicker, {
                open: true,
                numberOfMonths: 1,
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
            render(DateRangePicker, {
                open: true,
                placeholder: new CalendarDate(2024, 3, 15),
                isDateHighlightable: (date) => date.day === 15
            })
            await vi.waitFor(() => {
                const marked = document.querySelectorAll('[data-range-calendar-day][data-marked]')
                expect(marked.length).toBeGreaterThan(0)
            })
        })
    })

    // ==================== STATES ====================

    describe('states', () => {
        it('should mark both inputs as disabled', async () => {
            render(DateRangePicker, { disabled: true })
            await vi.waitFor(() => {
                const inputs = getInputs()
                expect(inputs.length).toBe(2)
                expect(inputs[0].hasAttribute('data-disabled')).toBe(true)
                expect(inputs[1].hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should disable the trigger when disabled', async () => {
            render(DateRangePicker, { disabled: true })
            await vi.waitFor(() => {
                const trigger = getTrigger() as HTMLButtonElement
                expect(trigger).not.toBeNull()
                expect(trigger.disabled || trigger.hasAttribute('data-disabled')).toBe(true)
            })
        })

        it('should mark the segments as readonly', async () => {
            render(DateRangePicker, { readonly: true })
            await vi.waitFor(() => {
                const days = getSegments('day')
                expect(days.length).toBe(2)
                expect(days[0].hasAttribute('data-readonly')).toBe(true)
                expect(days[1].hasAttribute('data-readonly')).toBe(true)
            })
        })

        it('should mark only the listed segments as readonly', async () => {
            render(DateRangePicker, { readonlySegments: ['year'] })
            await vi.waitFor(() => {
                expect(getSegments('year')[0].hasAttribute('data-readonly')).toBe(true)
                expect(getSegments('day')[0].hasAttribute('data-readonly')).toBe(false)
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ps-2.5')
                expect(getField()!.className).toContain('text-sm')
            })
        })

        it('should apply xs size', async () => {
            render(DateRangePicker, { size: 'xs' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ps-1.5')
                expect(getField()!.className).toContain('text-xs')
            })
        })

        it('should apply sm size', async () => {
            render(DateRangePicker, { size: 'sm' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ps-2')
            })
        })

        it('should apply lg size', async () => {
            render(DateRangePicker, { size: 'lg' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ps-3.5')
            })
        })

        it('should apply xl size', async () => {
            render(DateRangePicker, { size: 'xl' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ps-4.5')
                expect(getField()!.className).toContain('text-base')
            })
        })

        it('should scale the calendar with the picker size', async () => {
            render(DateRangePicker, { open: true, size: 'xl' })
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
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-outline-variant')
            })
        })

        it('should apply soft variant', async () => {
            render(DateRangePicker, { variant: 'soft' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('bg-primary-container/50')
            })
        })

        it('should apply subtle variant', async () => {
            render(DateRangePicker, { variant: 'subtle' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-primary/25')
            })
        })

        it('should apply ghost variant', async () => {
            render(DateRangePicker, { variant: 'ghost' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('bg-transparent')
            })
        })

        it('should apply none variant', async () => {
            render(DateRangePicker, { variant: 'none' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-0')
            })
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should apply primary color by default', async () => {
            render(DateRangePicker)
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-primary')
            })
        })

        it('should apply error color', async () => {
            render(DateRangePicker, { color: 'error' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-error')
            })
        })

        it('should apply success color', async () => {
            render(DateRangePicker, { color: 'success' })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('focus-within:ring-success')
            })
        })

        it('should apply highlight ring', async () => {
            render(DateRangePicker, { highlight: true })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('ring-2')
                expect(getField()!.className).toContain('ring-primary')
            })
        })
    })

    // ==================== CUSTOMIZATION ====================

    describe('customization', () => {
        it('should merge a custom class on the root', async () => {
            render(DateRangePicker, { class: 'custom-root-class' })
            await vi.waitFor(() => {
                expect(getField()!.parentElement!.className).toContain('custom-root-class')
            })
        })

        it('should apply ui slot overrides on the field', async () => {
            render(DateRangePicker, { ui: { field: 'custom-field-class' } })
            await vi.waitFor(() => {
                expect(getField()!.className).toContain('custom-field-class')
            })
        })

        it('should apply ui slot overrides on the content', async () => {
            render(DateRangePicker, { open: true, ui: { content: 'custom-content-class' } })
            await vi.waitFor(() => {
                expect(getContent()!.className).toContain('custom-content-class')
            })
        })

        it('should apply calendar slot overrides', async () => {
            render(DateRangePicker, {
                open: true,
                ui: { calendarSlots: { heading: 'custom-heading-class' } }
            })
            await vi.waitFor(() => {
                expect(getHeading()!.className).toContain('custom-heading-class')
            })
        })

        it('should set the id on the start input', async () => {
            render(DateRangePicker, { id: 'stay' })
            await vi.waitFor(() => {
                expect(getStartInput()!.getAttribute('id')).toBe('stay')
            })
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should not validate when opening the calendar', async () => {
            render(DateRangePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegments('day').length).toBe(2)
            })
            const daySegment = getSegments('day')[0] as HTMLElement
            daySegment.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(daySegment)
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getCalendar()).not.toBeNull()
            })
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Stay range is required')
        })

        it('should not show an error after selecting a complete range', async () => {
            render(DateRangePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getTrigger()).not.toBeNull()
            })
            getTrigger()!.click()
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            findDay('10').click()
            await vi.waitFor(() => {
                expect(
                    document.querySelector('[data-range-calendar-day][data-selection-start]')
                ).not.toBeNull()
            })
            findDay('20').click()
            await vi.waitFor(() => {
                expect(getContent()).toBeNull()
            })
            await new Promise((resolve) => setTimeout(resolve, 100))
            expect(document.body.textContent).not.toContain('Stay range is required')
        })

        it('should validate when focus leaves the field empty', async () => {
            render(DateRangePickerFormTestWrapper)
            await vi.waitFor(() => {
                expect(getSegments('day').length).toBe(2)
            })
            const day = getSegments('day')[0] as HTMLElement
            day.focus()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(day)
            })
            day.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('Stay range is required')
            })
        })
    })
})
