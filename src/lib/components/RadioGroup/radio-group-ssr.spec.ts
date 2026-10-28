import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import RadioGroup from './RadioGroup.svelte'

const items = [
    { value: 'a', label: 'Option A' },
    { value: 'extra cheese', label: 'Extra cheese' }
]

const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]+)"`))?.[1]

const pairs = (body: string) => ({
    controls: (body.match(/<button[^>]*>/g) ?? [])
        .filter((tag) => attribute(tag, 'role') === 'radio')
        .map((tag) => attribute(tag, 'id')),
    labels: (body.match(/<label[^>]*>/g) ?? []).map((tag) => attribute(tag, 'for'))
})

describe('RadioGroup SSR', () => {
    it('points every item label at its own control', () => {
        const { controls, labels } = pairs(render(RadioGroup, { props: { items } }).body)
        expect(controls).toHaveLength(2)
        expect(labels).toEqual(controls)
        expect(controls.every((id) => id && !/\s/.test(id))).toBe(true)
    })

    it('renders the same item ids on every request', () => {
        const first = pairs(render(RadioGroup, { props: { items } }).body).controls
        const second = pairs(render(RadioGroup, { props: { items } }).body).controls
        expect(second).toEqual(first)
    })

    it('keeps the group id from the id prop', () => {
        const { body } = render(RadioGroup, { props: { items, id: 'plan' } })
        expect(body).toContain('id="plan"')
    })
})
