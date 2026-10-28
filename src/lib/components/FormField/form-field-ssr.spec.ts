import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import { createRawSnippet } from 'svelte'
import FormField from './FormField.svelte'

const child = createRawSnippet(() => ({ render: () => '<span></span>' }))

const labelTag = (body: string) => body.match(/<label[^>]*>/)?.[0] ?? ''

describe('FormField SSR', () => {
    it('renders the label and description ids from the name', () => {
        const { body } = render(FormField, {
            props: { name: 'email', label: 'Email', description: 'Work', children: child }
        })
        expect(labelTag(body)).toContain('id="form-field-email-label"')
        expect(body).toContain('id="form-field-email-description"')
    })

    it('renders ids from ariaId when it is set', () => {
        const { body } = render(FormField, {
            props: { name: 'email', ariaId: 'signup-email', label: 'Email', children: child }
        })
        expect(labelTag(body)).toContain('id="signup-email-label"')
        expect(body).not.toContain('form-field-email')
    })

    it('renders ids without whitespace for a name that contains it', () => {
        const { body } = render(FormField, {
            props: { name: 'first name', label: 'First name', description: 'D', children: child }
        })
        expect(labelTag(body)).toContain('id="form-field-first-name-label"')
        expect(body).toContain('id="form-field-first-name-description"')
    })

    it('falls back to a generated id for an empty ariaId or a blank name', () => {
        const { body } = render(FormField, {
            props: { name: '  ', ariaId: ' ', label: 'Blank', children: child }
        })
        expect(labelTag(body)).toMatch(/id="[^"\s]+-label"/)
        expect(body).not.toContain('form-field--')
        expect(body).not.toContain('id=" ')
    })

    it('points the label at the field id until a control reports itself on the client', () => {
        const { body } = render(FormField, {
            props: { name: 'email', label: 'Email', children: child }
        })
        expect(labelTag(body)).toContain('for="form-field-email"')
    })
})
