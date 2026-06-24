/* eslint-disable @typescript-eslint/no-explicit-any */
import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Table from './Table.svelte'

interface Person {
    id: number
    name: string
    email: string
    age: number
}

const testData: Person[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@test.com', age: 25 },
    { id: 3, name: 'Charlie', email: 'charlie@test.com', age: 35 }
]

const testColumns = [
    { key: 'name' as const, label: 'Name', sortable: true },
    { key: 'email' as const, label: 'Email' },
    { key: 'age' as const, label: 'Age', sortable: true }
]

const getRows = () => document.querySelectorAll('tbody tr')
const getHeaderCells = () => document.querySelectorAll('thead th')
const getCells = (rowIndex: number) => getRows()[rowIndex]?.querySelectorAll('td') ?? []

describe('Table', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a table element', async () => {
            render(Table, { data: testData, columns: testColumns } as any)
            const table = page.getByRole('table')
            await expect.element(table).toBeInTheDocument()
        })

        it('should render header cells from columns', () => {
            render(Table, { data: testData, columns: testColumns } as any)
            const headers = getHeaderCells()
            expect(headers.length).toBe(3)
            expect(headers[0].textContent).toContain('Name')
            expect(headers[1].textContent).toContain('Email')
            expect(headers[2].textContent).toContain('Age')
        })

        it('should render data rows', () => {
            render(Table, { data: testData, columns: testColumns } as any)
            expect(getRows().length).toBe(3)
        })

        it('should render cell values', () => {
            render(Table, { data: testData, columns: testColumns } as any)
            const cells = getCells(0)
            expect(cells[0].textContent).toContain('Alice')
            expect(cells[1].textContent).toContain('alice@test.com')
            expect(cells[2].textContent).toContain('30')
        })

        it('should render caption as sr-only', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                caption: 'User list'
            } as any)
            const caption = document.querySelector('caption')
            expect(caption).not.toBeNull()
            expect(caption!.textContent).toBe('User list')
            expect(caption!.className).toMatch(/sr-only/)
        })

        it('should render null/undefined as non-breaking space', () => {
            const data = [{ name: 'Alice', email: null }]
            const cols = [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' }
            ]
            render(Table, { data, columns: cols } as any)
            const td = getCells(0)[0]
            // name should render fine
            expect(td.textContent).toContain('Alice')
            // email (null) should be non-breaking space
            const emailTd = getCells(0)[1]
            expect(emailTd.textContent).toBe('\u00A0')
        })
    })

    // ==================== AUTO COLUMNS ====================

    describe('auto columns', () => {
        it('should auto-generate columns from data keys', () => {
            render(Table, { data: testData } as any)
            const headers = getHeaderCells()
            expect(headers.length).toBe(4) // id, name, email, age
            expect(headers[0].textContent).toContain('Id')
            expect(headers[1].textContent).toContain('Name')
        })

        it('should render no headers when data is empty and no columns', () => {
            render(Table, { data: [] } as any)
            expect(getHeaderCells().length).toBe(0)
        })
    })

    // ==================== EMPTY STATE ====================

    describe('empty state', () => {
        it('should show default empty text when data is empty', async () => {
            render(Table, { data: [], columns: testColumns } as any)
            const emptyText = page.getByText('No data.')
            await expect.element(emptyText).toBeInTheDocument()
        })

        it('should show custom empty text', async () => {
            render(Table, {
                data: [],
                columns: testColumns,
                empty: 'Nothing here'
            } as any)
            const emptyText = page.getByText('Nothing here')
            await expect.element(emptyText).toBeInTheDocument()
        })

        it('should span full width for empty cell', () => {
            render(Table, { data: [], columns: testColumns } as any)
            const td = getRows()[0]?.querySelector('td')
            expect(td?.getAttribute('colspan')).toBe('3')
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading state', () => {
        it('should show data rows when loading with data', () => {
            render(Table, { data: testData, columns: testColumns, loading: true } as any)
            expect(getRows().length).toBe(3)
        })

        it('should show empty text when loading without loadingSlot', () => {
            render(Table, { data: [], columns: testColumns, loading: true } as any)
            const td = getRows()[0]?.querySelector('td')
            expect(td?.getAttribute('colspan')).toBe('3')
        })
    })

    // ==================== SORTING ====================

    describe('sorting', () => {
        it('should render ascending sorted data', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                sorting: [{ key: 'name', direction: 'asc' }]
            } as any)
            const firstCell = getCells(0)[0]
            expect(firstCell.textContent).toContain('Alice')
        })

        it('should render descending sorted data', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                sorting: [{ key: 'name', direction: 'desc' }]
            } as any)
            const firstCell = getCells(0)[0]
            expect(firstCell.textContent).toContain('Charlie')
        })

        it('should sort numbers correctly', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                sorting: [{ key: 'age', direction: 'asc' }]
            } as any)
            expect(getCells(0)[2].textContent).toContain('25')
            expect(getCells(1)[2].textContent).toContain('30')
            expect(getCells(2)[2].textContent).toContain('35')
        })

        it('should show sort icon on sortable column header', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                sorting: [{ key: 'name', direction: 'asc' }]
            } as any)
            const firstHeader = getHeaderCells()[0]
            expect(firstHeader.querySelector('button')).not.toBeNull()
        })
    })

    // ==================== ROW CLICK ====================

    describe('row click (onRowClick)', () => {
        it('should call onRowClick when row is clicked', () => {
            const onRowClick = vi.fn()
            render(Table, { data: testData, columns: testColumns, onRowClick } as any)
            ;(getRows()[1] as HTMLElement).click()
            expect(onRowClick).toHaveBeenCalledTimes(1)
        })

        it('should set data-selectable on rows', () => {
            const onRowClick = vi.fn()
            render(Table, { data: testData, columns: testColumns, onRowClick } as any)
            expect(getRows()[0].getAttribute('data-selectable')).not.toBeNull()
        })

        it('should set tabindex on selectable rows', () => {
            const onRowClick = vi.fn()
            render(Table, { data: testData, columns: testColumns, onRowClick } as any)
            expect(getRows()[0].getAttribute('tabindex')).toBe('0')
        })

        it('should not set tabindex when not selectable', () => {
            render(Table, { data: testData, columns: testColumns } as any)
            expect(getRows()[0].getAttribute('tabindex')).toBeNull()
        })
    })

    // ==================== ROW SELECTION STATE ====================

    describe('row selection', () => {
        it('should set data-selected on selected rows', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                selection: 'multiple',
                selectedRows: [testData[0]],
                rowKey: 'id'
            } as any)
            expect(getRows()[0].getAttribute('data-selected')).not.toBeNull()
        })

        it('should not set data-selected on unselected rows', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                selection: 'multiple',
                selectedRows: [],
                rowKey: 'id'
            } as any)
            expect(getRows()[0].getAttribute('data-selected')).toBeNull()
        })

        it('should render checkbox column in multiple mode', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                selection: 'multiple',
                selectedRows: [],
                rowKey: 'id'
            } as any)
            // Header has checkbox col + 3 data cols = 4
            expect(getHeaderCells().length).toBe(4)
        })
    })

    // ==================== STRIPED ====================

    describe('striped', () => {
        it('should apply striped class to tbody', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns,
                striped: true
            } as any)
            const tbody = container.querySelector('tbody') as HTMLElement
            expect(tbody.className).toMatch(/nth-child/)
        })
    })

    // ==================== STICKY HEADER ====================

    describe('sticky header', () => {
        it('should apply sticky class to thead', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns,
                sticky: 'header'
            } as any)
            const thead = container.querySelector('thead') as HTMLElement
            expect(thead.className).toMatch(/sticky/)
        })

        it('should not apply sticky class by default', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns
            } as any)
            const thead = container.querySelector('thead') as HTMLElement
            expect(thead.className).not.toMatch(/sticky/)
        })
    })

    // ==================== PAGINATION ====================

    describe('pagination', () => {
        const manyRows = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            name: `User ${i}`,
            email: `user${i}@test.com`,
            age: 20 + i
        }))

        it('should paginate data', () => {
            render(Table, {
                data: manyRows,
                columns: testColumns,
                page: 0,
                pageSize: 10
            } as any)
            expect(getRows().length).toBe(10)
        })

        it('should show second page', () => {
            render(Table, {
                data: manyRows,
                columns: testColumns,
                page: 1,
                pageSize: 10
            } as any)
            expect(getCells(0)[0].textContent).toContain('User 10')
        })

        it('should show last page remainder', () => {
            render(Table, {
                data: manyRows,
                columns: testColumns,
                page: 2,
                pageSize: 10
            } as any)
            expect(getRows().length).toBe(5)
        })
    })

    // ==================== COLUMN VISIBILITY ====================

    describe('column visibility', () => {
        it('should hide columns', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                columnVisibility: { email: false }
            } as any)
            expect(getHeaderCells().length).toBe(2)
            expect(getHeaderCells()[0].textContent).toContain('Name')
            expect(getHeaderCells()[1].textContent).toContain('Age')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns,
                class: 'my-custom'
            } as any)
            expect((container.firstElementChild as HTMLElement).className).toContain('my-custom')
        })

        it('should apply ui.th override', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                ui: { th: 'my-th' }
            } as any)
            expect((getHeaderCells()[0] as HTMLElement).className).toContain('my-th')
        })

        it('should apply ui.td override', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                ui: { td: 'my-td' }
            } as any)
            expect((getCells(0)[0] as HTMLElement).className).toContain('my-td')
        })

        it('should apply ui.thead override', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns,
                ui: { thead: 'my-thead' }
            } as any)
            expect((container.querySelector('thead') as HTMLElement).className).toContain(
                'my-thead'
            )
        })

        it('should apply ui.tbody override', () => {
            const { container } = render(Table, {
                data: testData,
                columns: testColumns,
                ui: { tbody: 'my-tbody' }
            } as any)
            expect((container.querySelector('tbody') as HTMLElement).className).toContain(
                'my-tbody'
            )
        })
    })

    // ==================== VISUAL ====================

    describe('visual', () => {
        it('should render tbody with row transitions', () => {
            const { container } = render(Table, { data: testData, columns: testColumns } as any)
            expect((container.querySelector('tbody') as HTMLElement).className).toMatch(
                /transition/
            )
        })

        it('should render root with rounded border', () => {
            const { container } = render(Table, { data: testData, columns: testColumns } as any)
            expect((container.firstElementChild as HTMLElement).className).toMatch(/rounded/)
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have table role', async () => {
            render(Table, { data: testData, columns: testColumns } as any)
            await expect.element(page.getByRole('table')).toBeInTheDocument()
        })

        it('should not have role on non-selectable rows', () => {
            render(Table, { data: testData, columns: testColumns } as any)
            expect(getRows()[0].getAttribute('role')).toBeNull()
        })
    })

    // ==================== GLOBAL FILTER ====================

    describe('global filter', () => {
        it('should filter data by global filter', () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                globalFilter: 'alice'
            } as any)
            expect(getRows().length).toBe(1)
            expect(getCells(0)[0].textContent).toContain('Alice')
        })

        it('should show empty when filter matches nothing', async () => {
            render(Table, {
                data: testData,
                columns: testColumns,
                globalFilter: 'zzzzz'
            } as any)
            const emptyText = page.getByText('No data.')
            await expect.element(emptyText).toBeInTheDocument()
        })
    })
})
