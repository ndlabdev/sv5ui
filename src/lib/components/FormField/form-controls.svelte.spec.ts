import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet, getContext, mount as mountIn, unmount, type Component } from 'svelte'
import { FORM_FIELD_CONTEXT_KEY, type FormFieldContext } from '../../hooks/useFormField/index.js'
import FormField from './FormField.svelte'
import Input from '../Input/Input.svelte'
import Textarea from '../Textarea/Textarea.svelte'
import InputNumber from '../InputNumber/InputNumber.svelte'
import InputTags from '../InputTags/InputTags.svelte'
import Select from '../Select/Select.svelte'
import SelectMenu from '../SelectMenu/SelectMenu.svelte'
import Checkbox from '../Checkbox/Checkbox.svelte'
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup.svelte'
import RadioGroup from '../RadioGroup/RadioGroup.svelte'
import Switch from '../Switch/Switch.svelte'
import Slider from '../Slider/Slider.svelte'
import Rating from '../Rating/Rating.svelte'
import ColorPicker from '../ColorPicker/ColorPicker.svelte'

type Support = { invalid?: boolean; required?: boolean; labelledBy?: boolean }

type Case = {
    name: string
    component: Component<Record<string, unknown>>
    props?: Record<string, unknown>
    control: string
    support: Support
    focus: 'control' | 'group'
}

const items = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
]

const as = (component: unknown) => component as Component<Record<string, unknown>>

const cases: Case[] = [
    {
        name: 'Input',
        component: as(Input),
        control: 'input',
        support: { invalid: true, required: true },
        focus: 'control'
    },
    {
        name: 'Textarea',
        component: as(Textarea),
        control: 'textarea',
        support: { invalid: true, required: true },
        focus: 'control'
    },
    {
        name: 'InputNumber',
        component: as(InputNumber),
        control: '[role=spinbutton]',
        support: { invalid: true, required: true },
        focus: 'control'
    },
    {
        name: 'InputTags',
        component: as(InputTags),
        control: 'input',
        support: { invalid: true, required: true },
        focus: 'control'
    },
    {
        name: 'Select',
        component: as(Select),
        props: { items },
        control: 'button',
        support: { invalid: true },
        focus: 'control'
    },
    {
        name: 'SelectMenu',
        component: as(SelectMenu),
        props: { items },
        control: '[role=button]',
        support: { invalid: true, labelledBy: true },
        focus: 'control'
    },
    {
        name: 'Rating',
        component: as(Rating),
        control: '[role=slider]',
        support: { invalid: true, labelledBy: true },
        focus: 'control'
    },
    {
        name: 'Checkbox',
        component: as(Checkbox),
        props: { label: 'Accept' },
        control: '[role=checkbox]',
        support: { invalid: true },
        focus: 'control'
    },
    {
        name: 'Switch',
        component: as(Switch),
        props: { label: 'Notify' },
        control: '[role=switch]',
        support: { invalid: true },
        focus: 'control'
    },
    {
        name: 'Slider',
        component: as(Slider),
        control: '[role=slider]',
        support: { invalid: true, labelledBy: true },
        focus: 'control'
    },
    {
        name: 'CheckboxGroup',
        component: as(CheckboxGroup),
        props: { items },
        control: 'fieldset',
        support: { labelledBy: true },
        focus: 'group'
    },
    {
        name: 'RadioGroup',
        component: as(RadioGroup),
        props: { items },
        control: '[role=radiogroup]',
        support: { invalid: true, labelledBy: true },
        focus: 'group'
    },
    {
        name: 'ColorPicker',
        component: as(ColorPicker),
        control: '[role=group]',
        support: { labelledBy: true },
        focus: 'group'
    }
]

const field = (overrides: Partial<FormFieldContext> = {}): FormFieldContext => ({
    name: 'probe',
    size: 'md',
    ariaId: 'probe',
    describedBy: 'probe-description probe-help',
    labelId: 'probe-label',
    ...overrides
})

const mount = (c: Case, props: Record<string, unknown> = {}, context?: FormFieldContext) =>
    render(c.component, {
        props: { ...c.props, ...props },
        ...(context ? { context: new Map([[FORM_FIELD_CONTEXT_KEY, context]]) } : {})
    })

const controlOf = (c: Case, container: HTMLElement) => {
    const element = container.querySelector<HTMLElement>(c.control)
    expect(element, `${c.name} control`).not.toBeNull()
    return element as HTMLElement
}

const focusable = (container: HTMLElement) =>
    Array.from(
        container.querySelectorAll<HTMLElement>(
            'input:not([type=hidden]), button, textarea, [tabindex="0"]'
        )
    )

afterEach(() => {
    vi.restoreAllMocks()
})

describe('form controls contract, #236', () => {
    for (const c of cases) {
        describe(c.name, () => {
            it('keeps the user aria-describedby on the control', () => {
                const { container } = mount(c, { 'aria-describedby': 'user-hint' })
                expect(controlOf(c, container).getAttribute('aria-describedby')).toBe('user-hint')
            })

            if (c.support.invalid) {
                it('keeps the user aria-invalid on the control', () => {
                    const { container } = mount(c, { 'aria-invalid': true })
                    expect(controlOf(c, container).getAttribute('aria-invalid')).toBe('true')
                })

                it('marks the control invalid when the field has an error', () => {
                    const { container } = mount(c, {}, field({ error: 'Bad' }))
                    expect(controlOf(c, container).getAttribute('aria-invalid')).toBe('true')
                })
            }

            if (c.name !== 'ColorPicker') {
                it('merges the user ids with the field ids, without duplicates', () => {
                    const { container } = mount(
                        c,
                        { 'aria-describedby': 'user-hint probe-help' },
                        field()
                    )
                    expect(controlOf(c, container).getAttribute('aria-describedby')).toBe(
                        'user-hint probe-help probe-description'
                    )
                })

                it('points only at the ids the field reports', () => {
                    const { container } = mount(c, {}, field({ describedBy: '' }))
                    expect(controlOf(c, container).hasAttribute('aria-describedby')).toBe(false)
                })
            }

            if (c.support.labelledBy) {
                it('is named by the field label', () => {
                    const { container } = mount(c, {}, field())
                    expect(controlOf(c, container).getAttribute('aria-labelledby')).toBe(
                        'probe-label'
                    )
                })

                it('lets a user aria-label take precedence over the field label', () => {
                    const { container } = mount(c, { 'aria-label': 'Own name' }, field())
                    const control = controlOf(c, container)
                    expect(control.getAttribute('aria-label')).toBe('Own name')
                    expect(control.hasAttribute('aria-labelledby')).toBe(false)
                })
            }

            if (c.support.required) {
                it('is exposed as required when the field is required', () => {
                    const { container } = mount(c, {}, field({ required: true }))
                    expect(controlOf(c, container).getAttribute('aria-required')).toBe('true')
                })
            }

            it('reports a user id that it renders to the field', () => {
                const setControlId = vi.fn()
                const { container } = mount(c, { id: 'my-id' }, field({ setControlId }))
                expect(setControlId).toHaveBeenCalledWith('my-id', expect.any(Boolean))
                expect(container.querySelector('#my-id')).not.toBeNull()
            })

            if (c.focus === 'control') {
                it('runs the user onfocus and onblur when the control is focused', () => {
                    const onfocus = vi.fn()
                    const onblur = vi.fn()
                    const { container } = mount(c, { onfocus, onblur })
                    const control = controlOf(c, container)
                    control.focus()
                    control.blur()
                    expect(onfocus).toHaveBeenCalledOnce()
                    expect(onblur).toHaveBeenCalledOnce()
                })
            } else {
                it('runs the user onfocus and onblur once when focus enters and leaves the group', () => {
                    const onfocus = vi.fn()
                    const onblur = vi.fn()
                    const onfocusin = vi.fn()
                    const { container } = mount(c, { onfocus, onblur, onfocusin })
                    const [first, second] = focusable(container)
                    first.focus()
                    second?.focus()
                    if (second) second.blur()
                    else first.blur()
                    expect(onfocus).toHaveBeenCalledOnce()
                    expect(onblur).toHaveBeenCalledOnce()
                    expect(onfocusin.mock.calls.length).toBeGreaterThanOrEqual(second ? 2 : 1)
                })
            }
        })
    }

    const wrapped = cases.filter((c) =>
        ['Checkbox', 'Switch', 'Slider', 'CheckboxGroup', 'RadioGroup'].includes(c.name)
    )

    it.each(wrapped.map((c) => [c.name, c] as const))(
        '%s routes aria-errormessage and aria-details to the control',
        (_name, c) => {
            const { container } = mount(c, {
                'aria-errormessage': 'err-id',
                'aria-details': 'details-id'
            })
            const control = controlOf(c, container)
            expect(control.getAttribute('aria-errormessage')).toBe('err-id')
            expect(control.getAttribute('aria-details')).toBe('details-id')
        }
    )

    it.each(wrapped.map((c) => [c.name, c] as const))(
        '%s keeps aria-hidden and data attributes on the wrapper',
        (_name, c) => {
            const { container } = mount(c, { 'aria-hidden': 'true', 'data-probe': 'root' })
            const root = container.querySelector('[data-probe="root"]')
            expect(root).not.toBeNull()
            expect(root?.getAttribute('aria-hidden')).toBe('true')
            expect(root?.contains(controlOf(c, container))).toBe(true)
            expect(controlOf(c, container).hasAttribute('data-probe')).toBe(false)
        }
    )

    it.each(cases.filter((c) => c.support.required).map((c) => [c.name, c] as const))(
        '%s does not add the native required attribute for a required field',
        (_name, c) => {
            const { container } = mount(c, {}, field({ required: true }))
            expect(controlOf(c, container).hasAttribute('required')).toBe(false)
        }
    )

    it('Checkbox runs the user onclick', () => {
        const onclick = vi.fn()
        const { container } = render(Checkbox, { label: 'Accept', onclick })
        container.querySelector<HTMLElement>('[role=checkbox]')?.click()
        expect(onclick).toHaveBeenCalledOnce()
    })

    it('ColorPicker describes its handle with the field description', () => {
        const { container } = render(ColorPicker, {
            props: {},
            context: new Map([[FORM_FIELD_CONTEXT_KEY, field()]])
        })
        expect(container.querySelector('[role=slider]')?.getAttribute('aria-describedby')).toBe(
            'probe-description probe-help'
        )
    })
})

describe('FormField published ids, #236', () => {
    const text = (value: string) =>
        createRawSnippet(() => ({ render: () => `<span>${value}</span>` }))
    const child = createRawSnippet(() => ({ render: () => '<span>control</span>' }))

    it('gives the label an id', () => {
        render(FormField, { name: 'email', label: 'Email', children: child })
        expect(document.querySelector('label')?.id).toBe('form-field-email-label')
    })

    it.each([
        ['descriptionSlot', 'description'],
        ['helpSlot', 'help']
    ])('wraps %s content in an element carrying the id', (slot, part) => {
        render(FormField, { name: 'email', [slot]: text('slot text'), children: child })
        expect(document.getElementById(`form-field-email-${part}`)?.textContent).toContain(
            'slot text'
        )
    })

    it('wraps errorSlot content in an element carrying the id', () => {
        render(FormField, {
            name: 'email',
            error: 'Bad',
            errorSlot: text('slot error'),
            children: child
        })
        expect(document.getElementById('form-field-email-error')?.textContent).toContain(
            'slot error'
        )
    })

    it('keeps the description next to the error', () => {
        render(FormField, {
            name: 'email',
            description: 'At least 8 characters',
            error: 'Too short',
            children: child
        })
        expect(document.getElementById('form-field-email-description')).not.toBeNull()
        expect(document.getElementById('form-field-email-error')).not.toBeNull()
    })
})

describe('FormField label target', () => {
    const LABELABLE = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'METER', 'OUTPUT', 'PROGRESS']

    const inField = (c: Case) =>
        createRawSnippet(() => {
            const context = getContext<FormFieldContext>(FORM_FIELD_CONTEXT_KEY)
            return {
                render: () => '<div></div>',
                setup: (target) => {
                    const instance = mountIn(c.component, {
                        target,
                        props: { ...c.props },
                        context: new Map([[FORM_FIELD_CONTEXT_KEY, context]])
                    })
                    return () => unmount(instance)
                }
            }
        })

    const labelOf = () => document.getElementById('form-field-probe-label') as HTMLLabelElement

    it.each(cases.map((c) => [c.name, c] as const))(
        '%s leaves no label for pointing at a missing or non-labelable element',
        async (_name, c) => {
            render(FormField, { name: 'probe', label: 'Probe', children: inField(c) })
            await vi.waitFor(() => expect(labelOf()).not.toBeNull())
            await vi.waitFor(() => {
                const target = labelOf().htmlFor
                if (!target) return
                expect(LABELABLE).toContain(document.getElementById(target)?.tagName)
            })
        }
    )

    it('keeps for on the field id when the content does not report a control', () => {
        const child = createRawSnippet(() => ({
            render: () => '<input id="form-field-probe" />'
        }))
        render(FormField, { name: 'probe', label: 'Probe', children: child })
        expect(labelOf().htmlFor).toBe('form-field-probe')
    })

    it('gives the CheckboxGroup fieldset the reported id', async () => {
        const group = cases.find((c) => c.name === 'CheckboxGroup') as Case
        render(FormField, { name: 'probe', label: 'Probe', children: inField(group) })
        await vi.waitFor(() =>
            expect(document.getElementById('form-field-probe')?.tagName).toBe('FIELDSET')
        )
        expect(labelOf().hasAttribute('for')).toBe(false)
    })

    it.each(
        cases
            .filter((c) => ['CheckboxGroup', 'RadioGroup'].includes(c.name))
            .map((c) => [c.name, c] as const)
    )('%s in a second field with the same name selects its own item', async (_name, c) => {
        const first = vi.fn()
        const second = vi.fn()
        const withHandler = (onValueChange: () => void): Case => ({
            ...c,
            props: { ...c.props, onValueChange }
        })
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        render(FormField, { name: 'plan', label: 'A', children: inField(withHandler(first)) })
        const { container } = render(FormField, {
            name: 'plan',
            label: 'B',
            children: inField(withHandler(second))
        })
        await vi.waitFor(() =>
            expect(container.querySelectorAll('label').length).toBeGreaterThan(1)
        )
        const itemLabel = Array.from(container.querySelectorAll('label')).find(
            (label) => label.textContent?.trim() === 'Option B'
        ) as HTMLLabelElement
        itemLabel.click()
        await vi.waitFor(() => expect(second).toHaveBeenCalled())
        expect(first).not.toHaveBeenCalled()
    })

    it.each(cases.map((c) => [c.name, c] as const))(
        '%s reports whether its element can be the target of a label',
        (_name, c) => {
            const setControlId = vi.fn()
            const { container } = mount(c, { id: 'my-id' }, field({ setControlId }))
            const [id, labelable] = setControlId.mock.calls.at(-1) as [string, boolean]
            const tag = container.querySelector(`#${id}`)?.tagName ?? ''
            expect(labelable).toBe(LABELABLE.includes(tag))
        }
    )
})

describe('FormField ids', () => {
    const input = cases.find((c) => c.name === 'Input') as Case

    const inputIn = (scope: Element) => {
        const element = scope.querySelector('input')
        expect(element).not.toBeNull()
        return element as HTMLInputElement
    }

    const resolves = (list: string | null) =>
        (list ?? '')
            .split(/\s+/)
            .filter(Boolean)
            .every((id) => !!document.getElementById(id))

    const inputField = (props: Record<string, unknown>) =>
        createRawSnippet(() => {
            const context = getContext<FormFieldContext>(FORM_FIELD_CONTEXT_KEY)
            return {
                render: () => '<div></div>',
                setup: (target) => {
                    const instance = mountIn(input.component, {
                        target,
                        props,
                        context: new Map([[FORM_FIELD_CONTEXT_KEY, context]])
                    })
                    return () => unmount(instance)
                }
            }
        })

    it('uses ariaId as the base of every published id', async () => {
        const { container } = render(FormField, {
            name: 'email',
            ariaId: 'signup-email',
            label: 'Email',
            description: 'Work address',
            children: inputField({})
        })
        await vi.waitFor(() => expect(inputIn(container).id).toBe('signup-email'))
        const label = container.querySelector('label') as HTMLLabelElement
        expect(label.id).toBe('signup-email-label')
        expect(label.htmlFor).toBe('signup-email')
        expect(inputIn(container).getAttribute('aria-describedby')).toBe('signup-email-description')
        expect(resolves(inputIn(container).getAttribute('aria-describedby'))).toBe(true)
    })

    it('keeps two fields with the same name apart when their ariaId differs', async () => {
        const login = render(FormField, {
            name: 'email',
            ariaId: 'login-email',
            label: 'Login email',
            children: inputField({})
        })
        const signup = render(FormField, {
            name: 'email',
            ariaId: 'signup-email',
            label: 'Signup email',
            children: inputField({})
        })
        await vi.waitFor(() => expect(inputIn(signup.container).labels).toHaveLength(1))
        expect(inputIn(signup.container).labels?.[0].textContent?.trim()).toBe('Signup email')
        expect(inputIn(login.container).labels?.[0].textContent?.trim()).toBe('Login email')
    })

    it('replaces whitespace in an id derived from the name', async () => {
        const { container } = render(FormField, {
            name: ' first  name ',
            label: 'First name',
            description: 'As on your passport',
            children: inputField({})
        })
        await vi.waitFor(() => expect(inputIn(container).id).toBe('form-field-first-name'))
        expect(resolves(inputIn(container).getAttribute('aria-describedby'))).toBe(true)
        expect(inputIn(container).labels).toHaveLength(1)
    })

    it('warns once when a second field publishes the same ids', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        render(FormField, { name: 'dup-warn', label: 'One', children: inputField({}) })
        render(FormField, { name: 'dup-warn', label: 'Two', children: inputField({}) })
        render(FormField, { name: 'dup-warn', label: 'Three', children: inputField({}) })
        await vi.waitFor(() => expect(warn).toHaveBeenCalled())
        const messages = warn.mock.calls.map(([message]) => String(message))
        expect(messages.filter((m) => m.includes('"form-field-dup-warn"'))).toHaveLength(1)
        expect(messages.filter((m) => m.includes('"form-field-dup-warn-label"'))).toHaveLength(1)
        expect(messages[0]).toContain('ariaId')
    })

    it('does not warn when fields that share a name have distinct ariaId', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { container } = render(FormField, {
            name: 'shared',
            ariaId: 'shared-one',
            label: 'One',
            children: inputField({})
        })
        render(FormField, {
            name: 'shared',
            ariaId: 'shared-two',
            label: 'Two',
            children: inputField({})
        })
        await vi.waitFor(() => expect(inputIn(container).id).toBe('shared-one'))
        expect(warn).not.toHaveBeenCalled()
    })

    it('follows a new ariaId on re-render', async () => {
        const { container, rerender } = render(FormField, {
            ariaId: 'first',
            label: 'Field',
            description: 'Help',
            children: inputField({})
        })
        await vi.waitFor(() => expect(inputIn(container).id).toBe('first'))
        await rerender({ ariaId: 'second' })
        await vi.waitFor(() => expect(inputIn(container).id).toBe('second'))
        const label = container.querySelector('label') as HTMLLabelElement
        expect(label.id).toBe('second-label')
        expect(label.htmlFor).toBe('second')
        expect(resolves(inputIn(container).getAttribute('aria-describedby'))).toBe(true)
    })
})
