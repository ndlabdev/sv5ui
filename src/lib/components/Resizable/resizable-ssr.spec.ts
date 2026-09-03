import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import Resizable from './Resizable.svelte'

const panes = [{ id: 'left', defaultSize: 30 }, { id: 'right' }]

describe('Resizable SSR', () => {
    it('renders every pane without touching the DOM', () => {
        const { body } = render(Resizable, { props: { panes } })

        expect(body).toContain('data-direction="horizontal"')
        expect(body.match(/flex: /g)).toHaveLength(2)
    })

    it('renders the declared sizes so there is no flash of an even split', () => {
        const { body } = render(Resizable, { props: { panes } })

        expect(body).toContain('flex: 30 1 0px')
        expect(body).toContain('flex: 70 1 0px')
    })

    it('renders one separator between each pair of panes', () => {
        const { body } = render(Resizable, {
            props: { panes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }
        })

        expect(body.match(/role="separator"/g)).toHaveLength(2)
    })

    it('describes the separator for assistive technology', () => {
        const { body } = render(Resizable, { props: { panes } })

        expect(body).toContain('aria-orientation="vertical"')
        expect(body).toContain('aria-label="Resize panes"')
        expect(body).toContain('aria-valuenow="30"')
    })

    it('flips the orientation for a vertical group', () => {
        const { body } = render(Resizable, { props: { panes, direction: 'vertical' } })

        expect(body).toContain('data-direction="vertical"')
        expect(body).toContain('aria-orientation="horizontal"')
    })
})
