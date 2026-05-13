import { page } from 'vitest/browser'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-svelte'
import FileUpload from './FileUpload.svelte'

const makeFile = (name: string, type = 'text/plain', size = 1024) =>
    new File(['x'.repeat(size)], name, { type })

const makeImageFile = (name = 'photo.png') => makeFile(name, 'image/png', 2048)

const getInput = () => document.querySelector('input[type="file"]') as HTMLInputElement
const getArea = () => document.querySelector('[role="button"]') as HTMLElement | null

async function simulateFileInput(files: File[]) {
    const input = getInput()
    Object.defineProperty(input, 'files', {
        configurable: true,
        get: () => ({
            length: files.length,
            item: (i: number) => files[i] ?? null,
            [Symbol.iterator]: function* () {
                yield* files
            }
        })
    })
    input.dispatchEvent(new Event('change', { bubbles: true }))
}

function fireDrop(target: HTMLElement, files: File[]) {
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    target.dispatchEvent(
        new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt })
    )
    target.dispatchEvent(
        new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })
    )
}

describe('FileUpload', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a hidden file input', () => {
            render(FileUpload)
            const input = getInput()
            expect(input).not.toBeNull()
            expect(input.type).toBe('file')
        })

        it('should render area variant by default', () => {
            render(FileUpload)
            expect(getArea()).not.toBeNull()
        })

        it('should render button variant', async () => {
            render(FileUpload, { variant: 'button' })
            expect(getArea()).toBeNull()
            const btn = page.getByRole('button')
            await expect.element(btn).toBeInTheDocument()
        })

        it('should render label text', async () => {
            render(FileUpload, { label: 'Upload your files' })
            await expect.element(page.getByText('Upload your files')).toBeInTheDocument()
        })

        it('should render description text', async () => {
            render(FileUpload, { description: 'Max 10MB' })
            await expect.element(page.getByText('Max 10MB')).toBeInTheDocument()
        })

        it('should not render file list when value is empty', () => {
            render(FileUpload)
            expect(document.querySelector('[aria-label^="Remove"]')).toBeNull()
        })

        it('should render file list when value has files', async () => {
            const file = makeFile('document.pdf')
            render(FileUpload, { value: [file] })
            await expect.element(page.getByText('document.pdf')).toBeInTheDocument()
        })
    })

    // ==================== INPUT ATTRIBUTES ====================

    describe('input attributes', () => {
        it('should set accept attribute', () => {
            render(FileUpload, { accept: 'image/*' })
            expect(getInput().accept).toBe('image/*')
        })

        it('should set multiple attribute', () => {
            render(FileUpload, { multiple: true })
            expect(getInput().multiple).toBe(true)
        })

        it('should not set multiple by default', () => {
            render(FileUpload)
            expect(getInput().multiple).toBe(false)
        })

        it('should set name attribute', () => {
            render(FileUpload, { name: 'avatar' })
            expect(getInput().name).toBe('avatar')
        })

        it('should set required attribute', () => {
            render(FileUpload, { required: true })
            expect(getInput().required).toBe(true)
        })

        it('should disable the input when disabled', () => {
            render(FileUpload, { disabled: true })
            expect(getInput().disabled).toBe(true)
        })

        it('should disable the input when loading', () => {
            render(FileUpload, { loading: true })
            expect(getInput().disabled).toBe(true)
        })
    })

    // ==================== FILE ADDITION ====================

    describe('file addition', () => {
        it('should add a file via input change', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { onValueChange })
            await simulateFileInput([makeFile('test.txt')])
            await vi.waitFor(() =>
                expect(onValueChange).toHaveBeenCalledWith(
                    expect.arrayContaining([expect.objectContaining({ name: 'test.txt' })])
                )
            )
        })

        it('should replace file in single mode', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { onValueChange })
            await simulateFileInput([makeFile('first.txt')])
            await simulateFileInput([makeFile('second.txt')])
            await vi.waitFor(() => {
                const last = onValueChange.mock.lastCall?.[0] as File[]
                expect(last).toHaveLength(1)
                expect(last[0].name).toBe('second.txt')
            })
        })

        it('should accumulate files in multiple mode', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, onValueChange })
            await simulateFileInput([makeFile('a.txt')])
            await simulateFileInput([makeFile('b.txt')])
            await vi.waitFor(() => {
                const last = onValueChange.mock.lastCall?.[0] as File[]
                expect(last).toHaveLength(2)
            })
        })

        it('should deduplicate identical files', async () => {
            const onValueChange = vi.fn()
            const file = makeFile('dup.txt')
            render(FileUpload, { multiple: true, onValueChange })
            await simulateFileInput([file])
            await simulateFileInput([file])
            await vi.waitFor(() => {
                const last = onValueChange.mock.lastCall?.[0] as File[]
                expect(last).toHaveLength(1)
            })
        })

        it('should not add files when disabled', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { disabled: true, onValueChange })
            await simulateFileInput([makeFile('test.txt')])
            expect(onValueChange).not.toHaveBeenCalled()
        })
    })

    // ==================== ACCEPT FILTER ====================

    describe('accept filter', () => {
        it('should accept files matching mime type', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { accept: 'image/*', onValueChange })
            await simulateFileInput([makeImageFile()])
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalled())
        })

        it('should reject files not matching accept', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { accept: 'image/*', onValueChange })
            await simulateFileInput([makeFile('doc.pdf', 'application/pdf')])
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should accept files matching extension', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { accept: '.pdf', onValueChange })
            await simulateFileInput([makeFile('doc.pdf', 'application/pdf')])
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalled())
        })

        it('should accept files matching exact mime type', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { accept: 'text/plain', onValueChange })
            await simulateFileInput([makeFile('note.txt', 'text/plain')])
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalled())
        })

        it('should filter mixed batch and add only accepted files', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, accept: 'image/*', onValueChange })
            await simulateFileInput([makeImageFile('a.png'), makeFile('b.pdf', 'application/pdf')])
            await vi.waitFor(() => {
                const files = onValueChange.mock.lastCall?.[0] as File[]
                expect(files).toHaveLength(1)
                expect(files[0].name).toBe('a.png')
            })
        })
    })

    // ==================== FILE REMOVAL ====================

    describe('file removal', () => {
        it('should remove a file when clicking remove button', async () => {
            const file = makeFile('remove-me.txt')
            const onValueChange = vi.fn()
            render(FileUpload, { value: [file], onValueChange })
            const removeBtn = page.getByRole('button', { name: 'Remove remove-me.txt' })
            await removeBtn.click()
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith([]))
        })

        it('should remove only the targeted file when multiple are present', async () => {
            const files = [makeFile('keep.txt'), makeFile('remove.txt')]
            const onValueChange = vi.fn()
            render(FileUpload, { value: files, multiple: true, onValueChange })
            const removeBtn = page.getByRole('button', { name: 'Remove remove.txt' })
            await removeBtn.click()
            await vi.waitFor(() => {
                const remaining = onValueChange.mock.lastCall?.[0] as File[]
                expect(remaining).toHaveLength(1)
                expect(remaining[0].name).toBe('keep.txt')
            })
        })

        it('should clear all files via clear all button', async () => {
            const files = [makeFile('a.txt'), makeFile('b.txt')]
            const onValueChange = vi.fn()
            render(FileUpload, { value: files, multiple: true, onValueChange })
            const clearBtn = page.getByRole('button', { name: /clear all/i })
            await clearBtn.click()
            await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledWith([]))
        })
    })

    // ==================== DRAG AND DROP ====================

    describe('drag and drop', () => {
        it('should accept dropped files', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { onValueChange })
            const area = getArea()!
            fireDrop(area, [makeFile('dropped.txt')])
            await vi.waitFor(() =>
                expect(onValueChange).toHaveBeenCalledWith(
                    expect.arrayContaining([expect.objectContaining({ name: 'dropped.txt' })])
                )
            )
        })

        it('should not accept drops when dropzone=false', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { dropzone: false, onValueChange })
            const area = getArea()!
            fireDrop(area, [makeFile('nope.txt')])
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should not accept drops when disabled', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { disabled: true, onValueChange })
            const area = getArea()!
            fireDrop(area, [makeFile('nope.txt')])
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should set dragging state on dragenter', async () => {
            render(FileUpload)
            const area = getArea()!
            area.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true }))
            await vi.waitFor(() => expect(area.dataset.dragging).toBe(''))
        })

        it('should clear dragging state on drop', async () => {
            render(FileUpload)
            const area = getArea()!
            area.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true }))
            area.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true }))
            await vi.waitFor(() => expect(area.dataset.dragging).toBeUndefined())
        })
    })

    // ==================== PREVIEW ====================

    describe('preview', () => {
        it('should show file list when preview=true (default)', async () => {
            render(FileUpload, { value: [makeFile('visible.txt')] })
            await expect.element(page.getByText('visible.txt')).toBeInTheDocument()
        })

        it('should hide file list when preview=false', async () => {
            render(FileUpload, { value: [makeFile('hidden.txt')], preview: false })
            expect(document.querySelector('[aria-label^="Remove"]')).toBeNull()
        })

        it('should show image thumbnail for image files in list layout', async () => {
            render(FileUpload, { value: [makeImageFile('photo.png')], layout: 'list' })
            await vi.waitFor(() => {
                const img = document.querySelector('img[alt="photo.png"]')
                expect(img).not.toBeNull()
            })
        })

        it('should show file size in list layout', async () => {
            render(FileUpload, { value: [makeFile('sized.txt', 'text/plain', 1024)] })
            await expect.element(page.getByText('1.0 KB')).toBeInTheDocument()
        })
    })

    // ==================== DISABLED / LOADING ====================

    describe('disabled and loading', () => {
        it('should set aria-disabled on area when disabled', () => {
            render(FileUpload, { disabled: true })
            expect(getArea()?.getAttribute('aria-disabled')).toBe('true')
        })

        it('should set aria-disabled on area when loading', () => {
            render(FileUpload, { loading: true })
            expect(getArea()?.getAttribute('aria-disabled')).toBe('true')
        })

        it('should not have tabindex on area when disabled', () => {
            render(FileUpload, { disabled: true })
            expect(getArea()?.getAttribute('tabindex')).toBeNull()
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should mark file input as aria-hidden', () => {
            render(FileUpload)
            expect(getInput().getAttribute('aria-hidden')).toBe('true')
        })

        it('should set aria-label on area equal to label', () => {
            render(FileUpload, { label: 'Upload avatar' })
            expect(getArea()?.getAttribute('aria-label')).toBe('Upload avatar')
        })

        it('should set role=button on interactive area', () => {
            render(FileUpload)
            expect(getArea()?.getAttribute('role')).toBe('button')
        })

        it('should not set role on non-interactive area', () => {
            render(FileUpload, { interactive: false })
            expect(document.querySelector('[role="button"]')).toBeNull()
        })

        it('should have aria-label on remove buttons', async () => {
            render(FileUpload, { value: [makeFile('doc.txt')] })
            const btn = page.getByRole('button', { name: 'Remove doc.txt' })
            await expect.element(btn).toBeInTheDocument()
        })
    })

    // ==================== LAYOUT ====================

    describe('layout', () => {
        it('should render list layout by default', async () => {
            const file = makeFile('list.txt')
            render(FileUpload, { value: [file] })
            await expect.element(page.getByText('list.txt')).toBeInTheDocument()
        })

        it('should render grid layout', async () => {
            const files = [makeFile('a.txt'), makeFile('b.txt')]
            render(FileUpload, { value: files, multiple: true, layout: 'grid' })
            const removeButtons = document.querySelectorAll('[aria-label^="Remove"]')
            expect(removeButtons.length).toBeGreaterThanOrEqual(2)
        })
    })

    // ==================== FORMATFILESIZE ====================

    describe('formatFileSize', () => {
        it('should display 0 B for empty file', async () => {
            render(FileUpload, { value: [makeFile('empty.txt', 'text/plain', 0)] })
            await expect.element(page.getByText('0 B')).toBeInTheDocument()
        })

        it('should display KB for 1024 byte file', async () => {
            render(FileUpload, { value: [makeFile('kb.txt', 'text/plain', 1024)] })
            await expect.element(page.getByText('1.0 KB')).toBeInTheDocument()
        })

        it('should display MB for large file', async () => {
            render(FileUpload, { value: [makeFile('big.txt', 'text/plain', 1024 * 1024)] })
            await expect.element(page.getByText('1.0 MB')).toBeInTheDocument()
        })
    })

    // ==================== COMBINED ====================

    describe('combined', () => {
        it('should filter accept and show accepted files in list', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, accept: '.txt', onValueChange })
            await simulateFileInput([makeFile('ok.txt'), makeFile('bad.png', 'image/png')])
            await vi.waitFor(() => {
                const files = onValueChange.mock.lastCall?.[0] as File[]
                expect(files[0].name).toBe('ok.txt')
                expect(files).toHaveLength(1)
            })
        })

        it('should remain empty after clearAll', async () => {
            const files = [makeFile('x.txt'), makeFile('y.txt')]
            const onValueChange = vi.fn()
            render(FileUpload, { value: files, multiple: true, onValueChange })
            const clearBtn = page.getByRole('button', { name: /clear all/i })
            await clearBtn.click()
            await vi.waitFor(() => {
                expect(document.querySelector('[aria-label^="Remove"]')).toBeNull()
            })
        })

        it('should not show clear all button when preview=false', async () => {
            render(FileUpload, { value: [makeFile('x.txt')], preview: false })
            expect(document.querySelector('[aria-label^="Remove"]')).toBeNull()
        })
    })

    // ==================== MAX SIZE ====================

    describe('maxSize', () => {
        it('should accept files at or below the limit', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, maxSize: 1024, onValueChange })
            await simulateFileInput([makeFile('ok.txt', 'text/plain', 1024)])
            expect(onValueChange).toHaveBeenCalledTimes(1)
            expect(onValueChange.mock.calls[0][0]).toHaveLength(1)
        })

        it('should reject files larger than the limit', async () => {
            const onValueChange = vi.fn()
            const onReject = vi.fn()
            render(FileUpload, { multiple: true, maxSize: 1024, onValueChange, onReject })
            await simulateFileInput([makeFile('big.txt', 'text/plain', 2048)])
            expect(onValueChange).not.toHaveBeenCalled()
            expect(onReject).toHaveBeenCalledTimes(1)
            expect(onReject.mock.calls[0][0]).toEqual([
                expect.objectContaining({ reason: 'maxSize' })
            ])
        })

        it('should accept files when maxSize is undefined (no limit)', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, onValueChange })
            await simulateFileInput([makeFile('huge.bin', 'application/octet-stream', 10_000_000)])
            expect(onValueChange).toHaveBeenCalledTimes(1)
        })

        it('should mix accepted and rejected files in one input', async () => {
            const onValueChange = vi.fn()
            const onReject = vi.fn()
            render(FileUpload, { multiple: true, maxSize: 1024, onValueChange, onReject })
            await simulateFileInput([
                makeFile('ok.txt', 'text/plain', 512),
                makeFile('big.txt', 'text/plain', 4096)
            ])
            expect(onValueChange).toHaveBeenCalledTimes(1)
            expect(onValueChange.mock.calls[0][0]).toHaveLength(1)
            expect(onValueChange.mock.calls[0][0][0].name).toBe('ok.txt')
            expect(onReject).toHaveBeenCalledTimes(1)
            expect(onReject.mock.calls[0][0]).toHaveLength(1)
            expect(onReject.mock.calls[0][0][0].file.name).toBe('big.txt')
        })
    })

    // ==================== MAX FILES ====================

    describe('maxFiles', () => {
        it('should accept files within the limit', async () => {
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, maxFiles: 3, onValueChange })
            await simulateFileInput([makeFile('a.txt'), makeFile('b.txt')])
            expect(onValueChange).toHaveBeenCalledTimes(1)
            expect(onValueChange.mock.calls[0][0]).toHaveLength(2)
        })

        it('should reject files exceeding the limit', async () => {
            const onReject = vi.fn()
            const onValueChange = vi.fn()
            render(FileUpload, { multiple: true, maxFiles: 2, onReject, onValueChange })
            await simulateFileInput([makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')])
            expect(onValueChange.mock.calls[0][0]).toHaveLength(2)
            expect(onReject).toHaveBeenCalledTimes(1)
            expect(onReject.mock.calls[0][0]).toHaveLength(1)
            expect(onReject.mock.calls[0][0][0]).toEqual(
                expect.objectContaining({ reason: 'maxFiles' })
            )
            expect(onReject.mock.calls[0][0][0].file.name).toBe('c.txt')
        })

        it('should reject everything when value is already at the limit', async () => {
            const onReject = vi.fn()
            const onValueChange = vi.fn()
            render(FileUpload, {
                multiple: true,
                maxFiles: 2,
                value: [makeFile('a.txt'), makeFile('b.txt')],
                onReject,
                onValueChange
            })
            await simulateFileInput([makeFile('c.txt')])
            expect(onValueChange).not.toHaveBeenCalled()
            expect(onReject).toHaveBeenCalledTimes(1)
            expect(onReject.mock.calls[0][0]).toEqual([
                expect.objectContaining({ reason: 'maxFiles' })
            ])
        })

        it('should expose data-full attribute when limit is reached', async () => {
            const { container } = render(FileUpload, {
                multiple: true,
                maxFiles: 2,
                value: [makeFile('a.txt'), makeFile('b.txt')]
            })
            const root = container.querySelector('[data-full]') as HTMLElement
            expect(root).not.toBeNull()
        })

        it('should not expose data-full attribute below the limit', async () => {
            const { container } = render(FileUpload, {
                multiple: true,
                maxFiles: 5,
                value: [makeFile('a.txt')]
            })
            expect(container.querySelector('[data-full]')).toBeNull()
        })
    })

    // ==================== ON REJECT ====================

    describe('onReject', () => {
        it('should not fire when no files are rejected', async () => {
            const onReject = vi.fn()
            render(FileUpload, { multiple: true, onReject })
            await simulateFileInput([makeFile('a.txt')])
            expect(onReject).not.toHaveBeenCalled()
        })

        it('should report accept rejection reason', async () => {
            const onReject = vi.fn()
            render(FileUpload, { multiple: true, accept: 'image/*', onReject })
            await simulateFileInput([makeFile('a.txt', 'text/plain')])
            expect(onReject).toHaveBeenCalledTimes(1)
            expect(onReject.mock.calls[0][0]).toEqual([
                expect.objectContaining({ reason: 'accept' })
            ])
        })

        it('should mix multiple rejection reasons in a single call', async () => {
            const onReject = vi.fn()
            render(FileUpload, {
                multiple: true,
                accept: 'image/*',
                maxSize: 1024,
                maxFiles: 1,
                onReject
            })
            await simulateFileInput([
                makeFile('text.txt', 'text/plain', 100),
                makeFile('big.png', 'image/png', 4096),
                makeFile('small1.png', 'image/png', 500),
                makeFile('small2.png', 'image/png', 500)
            ])
            expect(onReject).toHaveBeenCalledTimes(1)
            const reasons = onReject.mock.calls[0][0].map((r: { reason: string }) => r.reason)
            expect(reasons).toContain('accept')
            expect(reasons).toContain('maxSize')
            expect(reasons).toContain('maxFiles')
        })
    })

    // ==================== FORMFIELD / ARIA ====================

    describe('formfield + aria', () => {
        it('should put id on the focusable area (variant=area)', () => {
            render(FileUpload, { id: 'upload-1' })
            const area = getArea()
            expect(area?.id).toBe('upload-1')
        })

        it('should put id on the button (variant=button)', () => {
            render(FileUpload, { id: 'upload-btn', variant: 'button', label: 'Upload' })
            const btn = document.querySelector('button[id="upload-btn"]')
            expect(btn).not.toBeNull()
        })

        it('should set aria-invalid when highlight is true', () => {
            render(FileUpload, { highlight: true })
            const area = getArea()
            expect(area?.getAttribute('aria-invalid')).toBe('true')
        })

        it('should not set aria-invalid when highlight is false', () => {
            render(FileUpload, {})
            const area = getArea()
            expect(area?.getAttribute('aria-invalid')).toBeNull()
        })

        it('should pass name through to hidden file input', () => {
            render(FileUpload, { name: 'avatar' })
            expect(getInput().name).toBe('avatar')
        })
    })
})
