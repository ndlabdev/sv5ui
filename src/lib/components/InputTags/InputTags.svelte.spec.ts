import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import InputTags from './InputTags.svelte'
import InputTagsFormTestWrapper from './InputTagsFormTestWrapper.svelte'

const getInput = () => document.querySelector('input[type="text"]') as HTMLInputElement | null
const getHiddenInputs = () =>
    Array.from(document.querySelectorAll('input[type="hidden"]')) as HTMLInputElement[]
const getTags = () => Array.from(document.querySelectorAll('[data-tag]')) as HTMLElement[]
const getTagTexts = () => getTags().map((tag) => tag.getAttribute('data-tag'))
const getDeleteButtons = () =>
    Array.from(document.querySelectorAll('[data-tag] button')) as HTMLButtonElement[]

const pressKey = (key: string) =>
    getInput()!.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    )

const paste = (text: string) => {
    const data = new DataTransfer()
    data.setData('text/plain', text)
    getInput()!.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
    )
}

describe('InputTags', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a text input', async () => {
            render(InputTags)
            const input = page.getByRole('textbox')
            await expect.element(input).toBeInTheDocument()
        })

        it('should render with id', () => {
            render(InputTags, { id: 'tags-input' })
            expect(getInput()!.id).toBe('tags-input')
        })

        it('should render with placeholder', () => {
            render(InputTags, { placeholder: 'Add a tag' })
            expect(getInput()!.placeholder).toBe('Add a tag')
        })

        it('should render initial tags', () => {
            render(InputTags, { value: ['vue', 'svelte'] })
            expect(getTagTexts()).toEqual(['vue', 'svelte'])
        })

        it('should render a delete button per tag with an accessible label', () => {
            render(InputTags, { value: ['vue', 'svelte'] })
            const buttons = getDeleteButtons()
            expect(buttons).toHaveLength(2)
            expect(buttons[0].getAttribute('aria-label')).toBe('Remove vue')
            expect(buttons[1].getAttribute('aria-label')).toBe('Remove svelte')
        })

        it('should exclude delete buttons from the tab order', () => {
            render(InputTags, { value: ['vue'] })
            expect(getDeleteButtons()[0].tabIndex).toBe(-1)
        })

        it('should not submit forms from delete buttons', () => {
            render(InputTags, { value: ['vue'] })
            expect(getDeleteButtons()[0].type).toBe('button')
        })

        it('should render one hidden input per tag when name is provided', () => {
            render(InputTags, { name: 'tags', value: ['vue', 'svelte'] })
            const hidden = getHiddenInputs()
            expect(hidden).toHaveLength(2)
            expect(hidden.map((input) => input.name)).toEqual(['tags', 'tags'])
            expect(hidden.map((input) => input.value)).toEqual(['vue', 'svelte'])
        })

        it('should not render hidden inputs without a name', () => {
            render(InputTags, { value: ['vue'] })
            expect(getHiddenInputs()).toHaveLength(0)
        })
    })

    // ==================== ADDING ====================

    describe('adding', () => {
        it('should add a tag on Enter and clear the input', async () => {
            const onValueChange = vi.fn()
            render(InputTags, { onValueChange })
            await page.getByRole('textbox').fill('vue')
            pressKey('Enter')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
                expect(getInput()!.value).toBe('')
            })
            expect(onValueChange).toHaveBeenLastCalledWith(['vue'])
        })

        it('should trim whitespace', async () => {
            render(InputTags)
            await page.getByRole('textbox').fill('  vue  ')
            pressKey('Enter')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
            })
        })

        it('should not add whitespace-only input', async () => {
            render(InputTags)
            await page.getByRole('textbox').fill('   ')
            pressKey('Enter')
            expect(getTags()).toHaveLength(0)
        })

        it('should add a tag when the delimiter is typed', async () => {
            render(InputTags)
            await page.getByRole('textbox').fill('vue,')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
                expect(getInput()!.value).toBe('')
            })
        })

        it('should keep the text after the delimiter in the input', async () => {
            render(InputTags)
            await page.getByRole('textbox').fill('vue,sv')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
                expect(getInput()!.value).toBe('sv')
            })
        })

        it('should support a custom delimiter', async () => {
            render(InputTags, { delimiter: ';' })
            await page.getByRole('textbox').fill('vue;svelte;')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue', 'svelte'])
            })
        })

        it('should disable delimiter handling with an empty delimiter', async () => {
            render(InputTags, { delimiter: '' })
            await page.getByRole('textbox').fill('a,b')
            expect(getTags()).toHaveLength(0)
            expect(getInput()!.value).toBe('a,b')
        })

        it('should split pasted text into tags', async () => {
            render(InputTags)
            paste('vue, svelte, react')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue', 'svelte', 'react'])
            })
        })

        it('should split pasted text on newlines', async () => {
            render(InputTags)
            paste('vue\nsvelte\r\nreact')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue', 'svelte', 'react'])
            })
        })

        it('should paste as plain text when addOnPaste is false', async () => {
            render(InputTags, { addOnPaste: false })
            paste('vue, svelte')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTags()).toHaveLength(0)
        })

        it('should add the current text on Tab when addOnTab is set', async () => {
            render(InputTags, { addOnTab: true })
            await page.getByRole('textbox').fill('vue')
            pressKey('Tab')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
            })
        })

        it('should not consume Tab without text', async () => {
            render(InputTags, { addOnTab: true })
            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                cancelable: true
            })
            getInput()!.dispatchEvent(event)
            expect(event.defaultPrevented).toBe(false)
        })

        it('should add the current text on blur when addOnBlur is set', async () => {
            render(InputTags, { addOnBlur: true })
            await page.getByRole('textbox').fill('vue')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
                expect(getInput()!.value).toBe('')
            })
        })

        it('should keep the text on blur by default', async () => {
            render(InputTags)
            await page.getByRole('textbox').fill('vue')
            getInput()!.blur()
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTags()).toHaveLength(0)
            expect(getInput()!.value).toBe('vue')
        })

        it('should reject duplicates and keep the text in the input', async () => {
            const onValueChange = vi.fn()
            render(InputTags, { value: ['vue'], onValueChange })
            await page.getByRole('textbox').fill('vue')
            pressKey('Enter')
            expect(getTagTexts()).toEqual(['vue'])
            expect(getInput()!.value).toBe('vue')
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('should allow duplicates when allowDuplicates is set', async () => {
            render(InputTags, { value: ['vue'], allowDuplicates: true })
            await page.getByRole('textbox').fill('vue')
            pressKey('Enter')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue', 'vue'])
            })
        })

        it('should stop adding at max', async () => {
            render(InputTags, { value: ['a', 'b'], max: 3 })
            paste('c, d, e')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['a', 'b', 'c'])
            })
        })

        it('should reject tags longer than maxLength', async () => {
            render(InputTags, { maxLength: 3 })
            paste('vue, svelte')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
            })
        })

        it('should apply maxLength to the native input', () => {
            render(InputTags, { maxLength: 5 })
            expect(getInput()!.maxLength).toBe(5)
        })

        it('should update the tags when the value prop changes', async () => {
            const { rerender } = render(InputTags, { value: ['vue'] })
            await rerender({ value: ['vue', 'svelte'] })
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue', 'svelte'])
            })
        })
    })

    // ==================== REMOVING ====================

    describe('removing', () => {
        it('should remove a tag when its delete button is clicked', async () => {
            const onValueChange = vi.fn()
            render(InputTags, { value: ['vue', 'svelte'], onValueChange })
            await page.getByRole('button', { name: 'Remove vue' }).click()
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['svelte'])
            })
            expect(onValueChange).toHaveBeenLastCalledWith(['svelte'])
        })

        it('should highlight the last tag on Backspace, then remove it', async () => {
            render(InputTags, { value: ['vue', 'svelte'] })
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTags()[1].hasAttribute('data-highlighted')).toBe(true)
            })
            expect(getTags()).toHaveLength(2)
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['vue'])
            })
        })

        it('should keep removing on repeated Backspace after the first highlight', async () => {
            render(InputTags, { value: ['a', 'b', 'c'] })
            pressKey('Backspace')
            pressKey('Backspace')
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['a'])
            })
        })

        it('should not highlight on Backspace while the input has text', async () => {
            render(InputTags, { value: ['vue'] })
            await page.getByRole('textbox').fill('s')
            pressKey('Backspace')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTags()[0].hasAttribute('data-highlighted')).toBe(false)
        })

        it('should clear the highlight when typing', async () => {
            render(InputTags, { value: ['vue'] })
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(true)
            })
            await page.getByRole('textbox').fill('s')
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(false)
            })
        })

        it('should clear the highlight with Escape', async () => {
            render(InputTags, { value: ['vue'] })
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(true)
            })
            pressKey('Escape')
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(false)
            })
        })

        it('should clear the highlight on blur', async () => {
            render(InputTags, { value: ['vue'] })
            getInput()!.focus()
            pressKey('Backspace')
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(true)
            })
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(getTags()[0].hasAttribute('data-highlighted')).toBe(false)
            })
        })

        it('should navigate the highlight with arrow keys', async () => {
            render(InputTags, { value: ['a', 'b', 'c'] })
            getInput()!.focus()
            pressKey('ArrowLeft')
            pressKey('ArrowLeft')
            await vi.waitFor(() => {
                expect(getTags()[1].hasAttribute('data-highlighted')).toBe(true)
            })
            pressKey('ArrowRight')
            await vi.waitFor(() => {
                expect(getTags()[2].hasAttribute('data-highlighted')).toBe(true)
            })
            pressKey('ArrowRight')
            await vi.waitFor(() => {
                expect(getTags()[2].hasAttribute('data-highlighted')).toBe(false)
            })
        })

        it('should remove the highlighted tag with Delete', async () => {
            render(InputTags, { value: ['a', 'b', 'c'] })
            getInput()!.focus()
            pressKey('ArrowLeft')
            pressKey('ArrowLeft')
            pressKey('ArrowLeft')
            pressKey('Delete')
            await vi.waitFor(() => {
                expect(getTagTexts()).toEqual(['b', 'c'])
            })
        })

        it('should ignore Delete without a highlight', async () => {
            render(InputTags, { value: ['vue'] })
            pressKey('Delete')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTagTexts()).toEqual(['vue'])
        })
    })

    // ==================== STATES ====================

    describe('states', () => {
        it('should disable the input and hide delete buttons when disabled', async () => {
            render(InputTags, { value: ['vue'], disabled: true })
            const input = page.getByRole('textbox')
            await expect.element(input).toBeDisabled()
            expect(getDeleteButtons()).toHaveLength(0)
        })

        it('should hide delete buttons and ignore keys when readonly', async () => {
            render(InputTags, { value: ['vue'], readonly: true })
            expect(getInput()!.readOnly).toBe(true)
            expect(getDeleteButtons()).toHaveLength(0)
            pressKey('Backspace')
            pressKey('Backspace')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTagTexts()).toEqual(['vue'])
        })

        it('should ignore paste when readonly', async () => {
            render(InputTags, { value: ['vue'], readonly: true })
            paste('svelte')
            await new Promise((resolve) => setTimeout(resolve, 50))
            expect(getTagTexts()).toEqual(['vue'])
        })

        it('should mark the input required only while no tags are present', async () => {
            const { rerender } = render(InputTags, { required: true })
            expect(getInput()!.required).toBe(true)
            await rerender({ required: true, value: ['vue'] })
            await vi.waitFor(() => {
                expect(getInput()!.required).toBe(false)
            })
        })
    })

    // ==================== VARIANTS / COLORS / SIZES ====================

    describe('variants, colors and sizes', () => {
        it('should apply outline variant classes to the root by default', () => {
            const { container } = render(InputTags)
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('ring-outline-variant')
            expect(root.className).toContain('focus-within:ring-2')
        })

        it('should apply soft variant classes', () => {
            const { container } = render(InputTags, { variant: 'soft', color: 'primary' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('bg-primary-container/50')
            expect(root.className).toContain('focus-within:bg-primary-container/75')
        })

        it('should apply color classes to the focus ring', () => {
            const { container } = render(InputTags, { color: 'success' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('focus-within:ring-success')
        })

        it('should apply size classes', () => {
            const { container } = render(InputTags, { size: 'xl' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('text-base')
        })

        it('should apply highlight ring and aria-invalid', () => {
            const { container } = render(InputTags, { highlight: true, color: 'error' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('ring-error')
            expect(getInput()!.getAttribute('aria-invalid')).toBe('true')
        })

        it('should render a leading icon with reserved padding', () => {
            const { container } = render(InputTags, { leadingIcon: 'lucide:tag' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('ps-9')
            expect(root.querySelector('span.pointer-events-none')).not.toBeNull()
        })
    })

    // ==================== CUSTOMIZATION ====================

    describe('customization', () => {
        it('should apply custom class to the root element', () => {
            const { container } = render(InputTags, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot overrides', () => {
            const { container } = render(InputTags, {
                value: ['vue'],
                ui: { root: 'my-root-class', base: 'my-base-class', tag: 'my-tag-class' }
            })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
            expect(getInput()!.className).toContain('my-base-class')
            expect(getTags()[0].className).toContain('my-tag-class')
        })

        it('should forward Badge props to the tags', () => {
            render(InputTags, { value: ['vue'], tag: { color: 'primary', variant: 'subtle' } })
            expect(getTags()[0].className).toMatch(/primary/)
        })

        it('should render custom tag content through tagSlot', () => {
            render(InputTags, {
                value: ['vue'],
                tagSlot: createRawSnippet((args: () => { tag: string; index: number }) => ({
                    render: () => `<span data-testid="custom-tag">#${args().tag}</span>`
                }))
            })
            const custom = document.querySelector('[data-testid="custom-tag"]')
            expect(custom).not.toBeNull()
            expect(custom!.textContent).toBe('#vue')
        })

        it('should use a custom delete aria label', () => {
            render(InputTags, { value: ['vue'], deleteAriaLabel: 'Xóa' })
            expect(getDeleteButtons()[0].getAttribute('aria-label')).toBe('Xóa vue')
        })
    })

    // ==================== EVENTS & FOCUS ====================

    describe('events and focus', () => {
        it('should call oninput while typing', async () => {
            const oninput = vi.fn()
            render(InputTags, { oninput })
            await page.getByRole('textbox').fill('v')
            expect(oninput).toHaveBeenCalled()
        })

        it('should call onblur and onfocus', async () => {
            const onblur = vi.fn()
            const onfocus = vi.fn()
            render(InputTags, { onblur, onfocus })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(onfocus).toHaveBeenCalledOnce()
                expect(onblur).toHaveBeenCalledOnce()
            })
        })

        it('should focus the input when the field is clicked', async () => {
            const { container } = render(InputTags)
            const root = container.firstElementChild as HTMLElement
            root.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getInput())
            })
        })

        it('should keep focus on the input after removing a tag by click', async () => {
            render(InputTags, { value: ['vue', 'svelte'] })
            getInput()!.focus()
            await page.getByRole('button', { name: 'Remove vue' }).click()
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getInput())
            })
        })
    })

    // ==================== FORM INTEGRATION ====================

    describe('form integration', () => {
        it('should wire the label to the input through the form field', async () => {
            render(InputTagsFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            const label = document.querySelector('label') as HTMLLabelElement
            expect(label).not.toBeNull()
            expect(label.htmlFor).toBe(getInput()!.id)
            expect(getInput()!.getAttribute('aria-describedby')).not.toBeNull()
        })

        it('should show the error state after blurring with no tags', async () => {
            render(InputTagsFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('At least one skill is required')
                expect(getInput()!.getAttribute('aria-invalid')).toBe('true')
            })
        })

        it('should clear the error after adding a tag', async () => {
            render(InputTagsFormTestWrapper)
            await vi.waitFor(() => {
                expect(getInput()).not.toBeNull()
            })
            getInput()!.focus()
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).toContain('At least one skill is required')
            })
            await page.getByRole('textbox').fill('svelte')
            pressKey('Enter')
            getInput()!.blur()
            await vi.waitFor(() => {
                expect(document.body.textContent).not.toContain('At least one skill is required')
                expect(getInput()!.getAttribute('aria-invalid')).toBeNull()
            })
        })
    })
})
