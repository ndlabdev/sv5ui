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
})
