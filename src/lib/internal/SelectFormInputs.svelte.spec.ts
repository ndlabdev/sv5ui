import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import SelectFormInputs from './SelectFormInputs.svelte'

const forms: HTMLFormElement[] = []

const renderInForm = (props: Record<string, unknown> = {}) => {
    const form = document.createElement('form')
    document.body.append(form)
    forms.push(form)
    const onValueChange = vi.fn()
    render(SelectFormInputs, {
        target: form,
        props: {
            name: 'fruit',
            selectedValues: [],
            multiple: false,
            disabled: false,
            required: false,
            isKnownValue: (value: string) => value === 'apple',
            onValueChange,
            ...props
        }
    })
    return { form, onValueChange }
}

const typeInto = (form: HTMLFormElement, value: string) => {
    const input = form.querySelector<HTMLInputElement>('input:not([type="hidden"])')!
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
    return input
}

const flush = () => new Promise((resolve) => setTimeout(resolve))

describe('SelectFormInputs', () => {
    afterEach(() => {
        forms.splice(0).forEach((form) => form.remove())
    })

    it('accepts a known value', () => {
        const { form, onValueChange } = renderInForm()
        typeInto(form, 'apple')
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith('apple')
    })

    it('restores the input after an unknown value', async () => {
        const { form, onValueChange } = renderInForm({ selectedValues: ['apple'] })
        const input = typeInto(form, 'not-an-item')
        await vi.waitFor(() => expect(input.value).toBe('apple'))
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('ignores every typed value with multiple', () => {
        const { form, onValueChange } = renderInForm({ multiple: true })
        typeInto(form, 'apple')
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('reports an empty string when a single selection is reset', async () => {
        const { form, onValueChange } = renderInForm({ selectedValues: ['apple'] })
        form.reset()
        await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledExactlyOnceWith(''))
    })

    it('reports an empty array when a multiple selection is reset', async () => {
        const { form, onValueChange } = renderInForm({
            multiple: true,
            selectedValues: ['apple', 'cherry']
        })
        form.reset()
        await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledExactlyOnceWith([]))
    })

    it.each([false, true])('reports nothing when an empty selection is reset', async (multiple) => {
        const { form, onValueChange } = renderInForm({ multiple })
        form.reset()
        await flush()
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('anchors the validation input at the bottom so a browser message does not cover the control', () => {
        const { form } = renderInForm()
        const input = form.querySelector('input:not([type="hidden"])')!
        expect(input.className).toMatch(/\bbottom-0\b/)
        expect(input.className).toMatch(/\bleft-0\b/)
    })

    it('tells the browser when a required selection changes, without bubbling to the form', async () => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        const onValueChange = vi.fn()
        const formInput = vi.fn()
        form.addEventListener('input', formInput)
        const { rerender } = render(SelectFormInputs, {
            target: form,
            props: {
                name: 'fruit',
                selectedValues: [],
                multiple: false,
                disabled: false,
                required: true,
                isKnownValue: () => true,
                onValueChange
            }
        })
        const input = form.querySelector('input')!
        const inputEvent = vi.fn()
        input.addEventListener('input', inputEvent)
        await rerender({ selectedValues: ['apple'] })
        await vi.waitFor(() => expect(inputEvent).toHaveBeenCalledOnce())
        expect(formInput).not.toHaveBeenCalled()
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('stays silent when a selection that is not required changes', async () => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        const { rerender } = render(SelectFormInputs, {
            target: form,
            props: {
                name: 'fruit',
                selectedValues: [],
                multiple: false,
                disabled: false,
                required: false,
                isKnownValue: () => true,
                onValueChange: vi.fn()
            }
        })
        const inputEvent = vi.fn()
        form.querySelector('input')!.addEventListener('input', inputEvent)
        await rerender({ selectedValues: ['apple'] })
        await flush()
        expect(inputEvent).not.toHaveBeenCalled()
    })

    it('does not name the validation input with multiple', () => {
        const { form } = renderInForm({ multiple: true, selectedValues: ['apple', 'cherry'] })
        expect(new FormData(form).getAll('fruit')).toEqual(['apple', 'cherry'])
        expect(form.querySelector('input:not([type="hidden"])')!.hasAttribute('name')).toBe(false)
    })

    it('skips validation and submission while disabled', () => {
        for (const multiple of [false, true]) {
            const { form } = renderInForm({ multiple, required: true, disabled: true })
            expect(form.checkValidity()).toBe(true)
            expect(new FormData(form).getAll('fruit')).toEqual([])
        }
    })
})
