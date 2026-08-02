import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import SidebarTrigger from './SidebarTrigger.svelte'

describe('SidebarTrigger', () => {
    it('should render a button', async () => {
        const { container } = render(SidebarTrigger, {})
        expect(container.querySelector('button')).not.toBeNull()
    })

    it('should have an accessible label', async () => {
        const { container } = render(SidebarTrigger, {})
        expect(container.querySelector('button')!.getAttribute('aria-label')).toBe('Toggle sidebar')
    })

    it('should forward a custom label', async () => {
        const { container } = render(SidebarTrigger, { label: 'Menu' })
        expect(container.textContent).toContain('Menu')
    })

    it('should forward button props such as color and variant', async () => {
        const { container } = render(SidebarTrigger, { color: 'primary', variant: 'solid' })
        expect(container.querySelector('button')).not.toBeNull()
    })

    it('should expose aria-expanded from the collapsed prop', async () => {
        const { container } = render(SidebarTrigger, { collapsed: false })
        expect(container.querySelector('button')!.getAttribute('aria-expanded')).toBe('true')
    })

    it('should delegate to the sidebar api when given one', async () => {
        let toggled = 0
        const api = {
            collapsed: false,
            open: false,
            below: false,
            state: 'expanded' as const,
            toggle: () => {
                toggled += 1
            },
            expand: () => {},
            collapse: () => {}
        }
        const { container } = render(SidebarTrigger, { api })
        const button = container.querySelector('button') as HTMLButtonElement
        expect(button.getAttribute('aria-expanded')).toBe('true')
        button.click()
        expect(toggled).toBe(1)
    })
})
