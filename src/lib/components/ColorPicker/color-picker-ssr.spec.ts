import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import ColorPicker from './ColorPicker.svelte'

describe('ColorPicker SSR', () => {
    it('renders the saturation handle without touching the DOM', () => {
        const { body } = render(ColorPicker, { props: { value: '#3b82f6' } })

        expect(body).toContain('role="slider"')
        expect(body).toContain('aria-label="Saturation and brightness"')
    })

    it('renders the hue track gradient', () => {
        const { body } = render(ColorPicker, { props: { value: '#3b82f6' } })

        expect(body).toContain('linear-gradient')
        expect(body).toContain('aria-label="Hue"')
    })

    it('omits the alpha slider unless enabled', () => {
        expect(render(ColorPicker, { props: {} }).body).not.toContain('aria-label="Alpha"')
        expect(render(ColorPicker, { props: { alpha: true } }).body).toContain('aria-label="Alpha"')
    })

    it('hides the eyedropper button during SSR', () => {
        const { body } = render(ColorPicker, { props: {} })

        expect(body).not.toContain('Pick a color from the screen')
    })

    it('renders the hidden input for form submission', () => {
        const { body } = render(ColorPicker, { props: { name: 'brand', value: '#ff0000' } })

        expect(body).toContain('name="brand"')
        expect(body).toContain('#ff0000')
    })

    it('renders the text field with the serialized value', () => {
        const { body } = render(ColorPicker, { props: { value: 'rgb(255, 0, 0)' } })

        expect(body).toContain('#ff0000')
    })
})
