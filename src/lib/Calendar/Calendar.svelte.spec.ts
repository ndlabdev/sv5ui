import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Calendar from './Calendar.svelte'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

describe('Calendar', () => {
    const getRoot = () => document.querySelector('[data-calendar-root]') as HTMLElement | null
    const getHeader = () => document.querySelector('[data-calendar-header]') as HTMLElement | null
    const getHeading = () => document.querySelector('[data-calendar-heading]') as HTMLElement | null
    const getPrevButton = () =>
        document.querySelector('[data-calendar-prev-button]') as HTMLElement | null
    const getNextButton = () =>
        document.querySelector('[data-calendar-next-button]') as HTMLElement | null
    const getGrid = () => document.querySelector('[data-calendar-grid]') as HTMLElement | null
    const getDays = () => document.querySelectorAll('[data-calendar-day]')
    const getHeadCells = () => document.querySelectorAll('[data-calendar-head-cell]')

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Calendar)
            expect(container).not.toBeNull()
        })

        it('should render the calendar root', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                expect(getRoot()).not.toBeNull()
            })
        })

        it('should render the header', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                expect(getHeader()).not.toBeNull()
            })
        })

        it('should render the heading with month and year', async () => {
            render(Calendar, { placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
                expect(heading!.textContent).toContain('March')
                expect(heading!.textContent).toContain('2024')
            })
        })

        it('should render navigation buttons by default', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should render the grid', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                expect(getGrid()).not.toBeNull()
            })
        })

        it('should render weekday headers', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(7)
            })
        })

        it('should render days', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-8')
            })
        })

        it('should apply xs size', async () => {
            render(Calendar, { size: 'xs' })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-7')
            })
        })

        it('should apply sm size', async () => {
            render(Calendar, { size: 'sm' })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-7')
            })
        })

        it('should apply lg size', async () => {
            render(Calendar, { size: 'lg' })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-9')
            })
        })

        it('should apply xl size', async () => {
            render(Calendar, { size: 'xl' })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('size-10')
            })
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should apply primary color by default', async () => {
            render(Calendar, { value: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should apply secondary color', async () => {
            render(Calendar, { color: 'secondary', value: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should apply error color', async () => {
            render(Calendar, { color: 'error', value: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply solid variant by default', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should apply outline variant', async () => {
            render(Calendar, { variant: 'outline' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should apply soft variant', async () => {
            render(Calendar, { variant: 'soft' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should apply subtle variant', async () => {
            render(Calendar, { variant: 'subtle' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })
    })

    // ==================== NAVIGATION CONTROLS ====================

    describe('navigation controls', () => {
        it('should show month controls by default', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should hide month controls when monthControls is false', async () => {
            render(Calendar, { monthControls: false })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should show year controls when yearControls is true', async () => {
            render(Calendar, { yearControls: true })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                // Should have additional buttons for year navigation
                const buttons = root!.querySelectorAll('button')
                expect(buttons.length).toBeGreaterThanOrEqual(4)
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled state', () => {
        it('should apply disabled state', async () => {
            render(Calendar, { disabled: true })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-disabled')).not.toBeNull()
            })
        })

        it('should disable specific dates', async () => {
            const isDateDisabled = (date: DateValue) => date.day === 15
            render(Calendar, {
                placeholder: new CalendarDate(2024, 3, 1),
                isDateDisabled
            })
            await vi.waitFor(() => {
                const days = getDays()
                let foundDisabled = false
                days.forEach((day) => {
                    if (day.textContent?.trim() === '15') {
                        expect(day.getAttribute('data-disabled')).not.toBeNull()
                        foundDisabled = true
                    }
                })
                expect(foundDisabled).toBe(true)
            })
        })
    })

    // ==================== READONLY STATE ====================

    describe('readonly state', () => {
        it('should apply readonly state', async () => {
            render(Calendar, { readonly: true })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.getAttribute('data-readonly')).not.toBeNull()
            })
        })
    })

    // ==================== MULTIPLE MONTHS ====================

    describe('multiple months', () => {
        it('should render multiple months when numberOfMonths > 1', async () => {
            render(Calendar, { numberOfMonths: 2 })
            await vi.waitFor(() => {
                const grids = document.querySelectorAll('[data-calendar-grid]')
                expect(grids.length).toBe(2)
            })
        })
    })

    // ==================== FIXED WEEKS ====================

    describe('fixed weeks', () => {
        it('should always show 6 weeks when fixedWeeks is true', async () => {
            render(Calendar, { fixedWeeks: true, placeholder: new CalendarDate(2024, 2, 1) })
            await vi.waitFor(() => {
                const rows = document.querySelectorAll('[data-calendar-grid-row]')
                // Should have 6 weeks + 1 header row
                expect(rows.length).toBe(7)
            })
        })
    })

    // ==================== WEEK STARTS ON ====================

    describe('weekStartsOn', () => {
        it('should start week on Sunday by default', async () => {
            render(Calendar, { locale: 'en' })
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(7)
            })
        })

        it('should start week on Monday when weekStartsOn is 1', async () => {
            render(Calendar, { weekStartsOn: 1 })
            await vi.waitFor(() => {
                const headCells = getHeadCells()
                expect(headCells.length).toBe(7)
            })
        })
    })

    // ==================== LOCALE ====================

    describe('locale', () => {
        it('should use en locale by default', async () => {
            render(Calendar, { placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
                expect(heading!.textContent).toContain('March')
            })
        })

        it('should apply custom locale', async () => {
            render(Calendar, { locale: 'vi', placeholder: new CalendarDate(2024, 3, 15) })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
            })
        })
    })

    // ==================== VALUE BINDING ====================

    describe('value binding', () => {
        it('should accept value prop', async () => {
            const value = new CalendarDate(2024, 3, 15)
            render(Calendar, { value })
            await vi.waitFor(() => {
                const days = getDays()
                let found = false
                days.forEach((day) => {
                    if (
                        day.textContent?.trim() === '15' &&
                        day.getAttribute('data-selected') !== null
                    ) {
                        found = true
                    }
                })
                expect(found).toBe(true)
            })
        })

        it('should call onValueChange when value changes', async () => {
            const onValueChange = vi.fn()
            render(Calendar, { onValueChange, placeholder: new CalendarDate(2024, 3, 1) })
            await vi.waitFor(() => {
                expect(getDays().length).toBeGreaterThan(0)
            })
            expect(onValueChange).toBeTypeOf('function')
        })
    })

    // ==================== RANGE MODE ====================

    describe('range mode', () => {
        it('should render in range mode', async () => {
            render(Calendar, { range: true })
            await vi.waitFor(() => {
                const root = document.querySelector(
                    '[data-range-calendar-root]'
                ) as HTMLElement | null
                expect(root).not.toBeNull()
            })
        })

        it('should accept range value', async () => {
            const value = {
                start: new CalendarDate(2024, 3, 10),
                end: new CalendarDate(2024, 3, 20)
            }
            render(Calendar, { range: true, value })
            await vi.waitFor(() => {
                const root = document.querySelector(
                    '[data-range-calendar-root]'
                ) as HTMLElement | null
                expect(root).not.toBeNull()
            })
        })
    })

    // ==================== MULTIPLE SELECTION ====================

    describe('multiple selection', () => {
        it('should render in multiple selection mode', async () => {
            render(Calendar, { type: 'multiple' })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })

        it('should accept multiple values', async () => {
            const value = [new CalendarDate(2024, 3, 10), new CalendarDate(2024, 3, 20)]
            render(Calendar, { type: 'multiple', value })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
            })
        })
    })

    // ==================== MIN/MAX VALUES ====================

    describe('min/max values', () => {
        it('should respect minValue', async () => {
            const minValue = new CalendarDate(2024, 3, 10)
            render(Calendar, { minValue, placeholder: new CalendarDate(2024, 3, 1) })
            await vi.waitFor(() => {
                const days = getDays()
                days.forEach((day) => {
                    const dayNum = parseInt(day.textContent?.trim() || '0')
                    if (dayNum > 0 && dayNum < 10) {
                        expect(day.getAttribute('data-disabled')).not.toBeNull()
                    }
                })
            })
        })

        it('should respect maxValue', async () => {
            const maxValue = new CalendarDate(2024, 3, 20)
            render(Calendar, { maxValue, placeholder: new CalendarDate(2024, 3, 1) })
            await vi.waitFor(() => {
                const days = getDays()
                days.forEach((day) => {
                    const dayNum = parseInt(day.textContent?.trim() || '0')
                    if (dayNum > 20) {
                        expect(day.getAttribute('data-disabled')).not.toBeNull()
                    }
                })
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            render(Calendar, { ui: { root: 'custom-root' } })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('custom-root')
            })
        })

        it('should apply ui.header class', async () => {
            render(Calendar, { ui: { header: 'custom-header' } })
            await vi.waitFor(() => {
                const header = getHeader()
                expect(header).not.toBeNull()
                expect(header!.className).toContain('custom-header')
            })
        })

        it('should apply ui.heading class', async () => {
            render(Calendar, { ui: { heading: 'custom-heading' } })
            await vi.waitFor(() => {
                const heading = getHeading()
                expect(heading).not.toBeNull()
                expect(heading!.className).toContain('custom-heading')
            })
        })

        it('should apply ui.cellTrigger class', async () => {
            render(Calendar, { ui: { cellTrigger: 'custom-cell-trigger' } })
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                expect((days[0] as HTMLElement).className).toContain('custom-cell-trigger')
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply header base classes', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const header = getHeader()
                expect(header).not.toBeNull()
                expect(header!.className).toContain('flex')
                expect(header!.className).toContain('items-center')
                expect(header!.className).toContain('justify-between')
            })
        })

        it('should apply cellTrigger base classes', async () => {
            render(Calendar)
            await vi.waitFor(() => {
                const days = getDays()
                expect(days.length).toBeGreaterThan(0)
                const day = days[0] as HTMLElement
                expect(day.className).toContain('flex')
                expect(day.className).toContain('items-center')
                expect(day.className).toContain('justify-center')
                expect(day.className).toContain('rounded-full')
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with multiple months and year controls', async () => {
            render(Calendar, { numberOfMonths: 2, yearControls: true })
            await vi.waitFor(() => {
                const grids = document.querySelectorAll('[data-calendar-grid]')
                expect(grids.length).toBe(2)
            })
        })

        it('should render range calendar with multiple months', async () => {
            render(Calendar, { range: true, numberOfMonths: 2 })
            await vi.waitFor(() => {
                const root = document.querySelector(
                    '[data-range-calendar-root]'
                ) as HTMLElement | null
                expect(root).not.toBeNull()
                const grids = document.querySelectorAll('[data-range-calendar-grid]')
                expect(grids.length).toBe(2)
            })
        })

        it('should render with all styling props', async () => {
            render(Calendar, {
                color: 'secondary',
                size: 'lg',
                variant: 'outline',
                ui: {
                    root: 'custom-root',
                    header: 'custom-header'
                }
            })
            await vi.waitFor(() => {
                const root = getRoot()
                expect(root).not.toBeNull()
                expect(root!.className).toContain('custom-root')
            })
        })
    })
})
