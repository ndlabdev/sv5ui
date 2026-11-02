import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import type { Component } from 'svelte'
import Select from '../components/Select/Select.svelte'
import SelectMenu from '../components/SelectMenu/SelectMenu.svelte'

const unassigned = { value: '', label: 'Unassigned' }
const alice = { value: 'user-1', label: 'Alice' }
const bob = { value: 'user-2', label: 'Bob' }
const placeholder = 'Select an assignee'

const forms: HTMLFormElement[] = []

const flush = () => new Promise((resolve) => setTimeout(resolve, 100))

const controls = [
    { name: 'Select', component: Select as Component, keyTarget: '[data-select-trigger]' },
    {
        name: 'SelectMenu',
        component: SelectMenu as Component,
        keyTarget: 'input[role="combobox"]'
    }
]

describe.each(controls)('$name with an empty string option', ({ component, keyTarget }) => {
    const renderInForm = (props: Record<string, unknown>) => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        const result = render(component, {
            target: form,
            props: { name: 'assignee', placeholder, portal: false, ...props }
        })
        return { form, ...result }
    }

    const trigger = (form: HTMLFormElement) =>
        form.querySelector<HTMLElement>('[data-select-trigger],[data-combobox-trigger]')!

    const shown = (form: HTMLFormElement) => trigger(form).textContent?.trim()

    const submitted = (form: HTMLFormElement) => new FormData(form).getAll('assignee')

    const highlighted = (form: HTMLFormElement) =>
        [...form.querySelectorAll('[role="option"][data-highlighted]')].map((option) =>
            option.textContent?.trim()
        )

    const option = (form: HTMLFormElement, label: string) =>
        page.elementLocator(form).getByRole('option', { name: label, exact: true })

    afterEach(() => {
        forms.splice(0).forEach((form) => form.remove())
    })

    it('shows the label of the option when the value is an empty string', () => {
        const { form } = renderInForm({ value: '', items: [unassigned, alice] })
        expect(shown(form)).toBe('Unassigned')
        expect(submitted(form)).toEqual([''])
    })

    it('shows the placeholder when no option has an empty string value', () => {
        const { form } = renderInForm({ value: '', items: [alice] })
        expect(shown(form)).toBe(placeholder)
        expect(submitted(form)).toEqual([''])
    })

    it('shows the placeholder while there is no value', () => {
        const { form } = renderInForm({ items: [unassigned, alice] })
        expect(shown(form)).toBe(placeholder)
    })

    it('selects the option on click', async () => {
        const { form } = renderInForm({
            value: alice.value,
            items: [unassigned, alice],
            open: true
        })
        await option(form, 'Unassigned').click()
        await vi.waitFor(() => expect(shown(form)).toBe('Unassigned'))
        expect(submitted(form)).toEqual([''])
    })

    it('selects the option with the keyboard', async () => {
        const { form } = renderInForm({ value: alice.value, items: [unassigned, alice] })
        form.querySelector<HTMLElement>(keyTarget)!.focus()
        await userEvent.keyboard('{ArrowDown}')
        await vi.waitFor(() => expect(highlighted(form)).toEqual(['Alice']))
        await userEvent.keyboard('{ArrowUp}')
        await vi.waitFor(() => expect(highlighted(form)).toEqual(['Unassigned']))
        await userEvent.keyboard('{Enter}')
        await vi.waitFor(() => expect(shown(form)).toBe('Unassigned'))
        expect(submitted(form)).toEqual([''])
    })

    it('moves from the option to another value', async () => {
        const { form } = renderInForm({ value: '', items: [unassigned, alice], open: true })
        await option(form, 'Alice').click()
        await vi.waitFor(() => expect(shown(form)).toBe('Alice'))
        expect(submitted(form)).toEqual([alice.value])
    })

    it('marks and highlights the option when the list opens', async () => {
        const { form } = renderInForm({ value: '', items: [alice, bob, unassigned], open: true })
        await vi.waitFor(() => expect(highlighted(form)).toEqual(['Unassigned']))
        const selected = [...form.querySelectorAll('[role="option"][data-selected]')]
        expect(selected.map((item) => item.textContent?.trim())).toEqual(['Unassigned'])
    })

    it('keeps the option selected when it is clicked again', async () => {
        const { form } = renderInForm({ value: '', items: [unassigned, alice], open: true })
        await option(form, 'Unassigned').click()
        await flush()
        expect(shown(form)).toBe('Unassigned')
        expect(submitted(form)).toEqual([''])
    })

    it('still counts as empty for native required validation', () => {
        const { form } = renderInForm({ value: '', required: true, items: [unassigned, alice] })
        expect(shown(form)).toBe('Unassigned')
        expect(form.checkValidity()).toBe(false)
    })

    it('shows the option after a form reset', async () => {
        const { form } = renderInForm({ value: alice.value, items: [unassigned, alice] })
        form.reset()
        await vi.waitFor(() => expect(shown(form)).toBe('Unassigned'))
        expect(submitted(form)).toEqual([''])
    })

    it('follows options that load or disappear later', async () => {
        const { form, rerender } = renderInForm({ value: '', items: [] })
        expect(shown(form)).toBe(placeholder)
        await rerender({ items: [unassigned, alice] })
        await vi.waitFor(() => expect(shown(form)).toBe('Unassigned'))
        await rerender({ items: [alice] })
        await vi.waitFor(() => expect(shown(form)).toBe(placeholder))
    })

    it('supports the option with multiple', async () => {
        const { form } = renderInForm({ multiple: true, value: [''], items: [unassigned, alice] })
        expect(shown(form)).toBe('Unassigned')
        expect(submitted(form)).toEqual([''])
        form.reset()
        await vi.waitFor(() => expect(shown(form)).toBe(placeholder))
        expect(submitted(form)).toEqual([])
    })

    it('adds to and removes the option with multiple', async () => {
        const { form } = renderInForm({
            multiple: true,
            value: [alice.value],
            items: [unassigned, alice],
            open: true
        })
        await option(form, 'Unassigned').click()
        await vi.waitFor(() => expect(submitted(form)).toEqual([alice.value, '']))
        await option(form, 'Unassigned').click()
        await vi.waitFor(() => expect(submitted(form)).toEqual([alice.value]))
    })

    it('never exposes an internal value', async () => {
        const { form } = renderInForm({
            value: alice.value,
            items: [unassigned, alice],
            open: true
        })
        await option(form, 'Unassigned').click()
        await vi.waitFor(() => expect(shown(form)).toBe('Unassigned'))
        const input = form.querySelector<HTMLInputElement>('input[name="assignee"]')!
        expect(input.value).toBe('')
    })
})

describe('Select with an empty string option', () => {
    afterEach(() => {
        forms.splice(0).forEach((form) => form.remove())
    })

    it('closes when the selected option is clicked', async () => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        render(Select, {
            target: form,
            props: { value: '', placeholder, portal: false, open: true, items: [unassigned, alice] }
        })
        await page.elementLocator(form).getByRole('option', { name: 'Unassigned' }).click()
        const trigger = form.querySelector('[data-select-trigger]')!
        await vi.waitFor(() => expect(trigger.getAttribute('data-state')).toBe('closed'))
    })

    it('marks the trigger as a placeholder only while nothing is selected', () => {
        render(Select, { value: '', placeholder, items: [unassigned, alice] })
        const trigger = document.querySelector('[data-select-trigger]')!
        expect(trigger.hasAttribute('data-placeholder')).toBe(false)
    })
})
