import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import HookContextProbe from './HookContextProbe.svelte'
import HookContextProvider from './HookContextProvider.svelte'
import HookEmitProbe from './HookEmitProbe.svelte'

describe('useFormField', () => {
    it('should return undefined when used outside a FormField', async () => {
        render(HookContextProbe)
        const probe = page.getByText('probe')
        await expect.element(probe).toHaveAttribute('data-has', 'false')
        await expect.element(probe).toHaveAttribute('data-name', 'none')
    })

    it('should expose the context when used inside a provider', async () => {
        render(HookContextProvider)
        const probe = page.getByText('probe')
        await expect.element(probe).toHaveAttribute('data-has', 'true')
        await expect.element(probe).toHaveAttribute('data-name', 'email')
    })
})

describe('useFormFieldEmit', () => {
    it('should provide emit methods that are safe no-ops outside a Form', async () => {
        render(HookEmitProbe)
        const button = page.getByTestId('fire')
        await expect.element(button).toBeInTheDocument()
        await expect(button.click()).resolves.toBeUndefined()
    })
})
