import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import ImageCropper from './ImageCropper.svelte'

describe('ImageCropper SSR', () => {
    it('renders the stage without touching the DOM', () => {
        const { body } = render(ImageCropper, { props: {} })

        expect(body).toContain('aria-label="Image cropper"')
        expect(body).toContain('data-mode="fixed"')
    })

    it('renders the empty placeholder without a source', () => {
        const { body } = render(ImageCropper, { props: {} })

        expect(body).toContain('No image selected')
    })

    it('renders the loading placeholder while a source is pending', () => {
        const { body } = render(ImageCropper, { props: { src: '/photo.png' } })

        expect(body).toContain('Loading image')
        expect(body).not.toContain('No image selected')
    })

    it('renders the toolbar actions', () => {
        const { body } = render(ImageCropper, { props: {} })

        expect(body).toContain('aria-label="Rotate right"')
        expect(body).toContain('aria-label="Flip horizontally"')
    })

    it('hides the toolbar when disabled', () => {
        const { body } = render(ImageCropper, { props: { toolbar: false } })

        expect(body).not.toContain('aria-label="Rotate right"')
    })

    it('reflects the box mode on the root element', () => {
        const { body } = render(ImageCropper, { props: { mode: 'box' } })

        expect(body).toContain('data-mode="box"')
    })
})
