import { page } from 'vitest/browser'
import { describe, expect, it, afterEach, vi } from 'vitest'
import { render, cleanup } from 'vitest-browser-svelte'
import { toast } from 'svelte-sonner'
import Toaster from './Toaster.svelte'

async function fireToastAndGetToaster() {
    toast('Test toast')
    // Wait for sonner to render the toaster <ol> into the DOM
    await vi.waitFor(
        () => {
            const el = document.querySelector('[data-sonner-toaster]')
            if (!el) throw new Error('Toaster not found')
            return el
        },
        { timeout: 3000 }
    )
    return page.elementLocator(document.querySelector('[data-sonner-toaster]')!)
}

describe('Toaster', () => {
    afterEach(() => {
        toast.dismiss()
        cleanup()
        document
            .querySelectorAll('[data-sonner-toaster]')
            .forEach((el) => el.closest('section')?.remove())
    })

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the sonner toaster element after a toast is fired', async () => {
            render(Toaster)
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toBeInTheDocument()
        })

        it('should render with default position bottom-right', async () => {
            render(Toaster)
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveAttribute('data-x-position', 'right')
            await expect.element(toaster).toHaveAttribute('data-y-position', 'bottom')
        })
    })

    // ==================== VARIANT CLASS ====================

    describe('variant class', () => {
        it('should apply outline variant class by default', async () => {
            render(Toaster)
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/sv5ui-toast-outline/)
        })

        it('should apply soft variant class', async () => {
            render(Toaster, { variant: 'soft' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/sv5ui-toast-soft/)
        })

        it('should apply subtle variant class', async () => {
            render(Toaster, { variant: 'subtle' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/sv5ui-toast-subtle/)
        })

        it('should apply solid variant class', async () => {
            render(Toaster, { variant: 'solid' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/sv5ui-toast-solid/)
        })

        it('should apply accent variant class', async () => {
            render(Toaster, { variant: 'accent' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/sv5ui-toast-accent/)
        })
    })

    // ==================== POSITION ====================

    describe('position', () => {
        it('should apply top-left position', async () => {
            render(Toaster, { position: 'top-left' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveAttribute('data-x-position', 'left')
            await expect.element(toaster).toHaveAttribute('data-y-position', 'top')
        })

        it('should apply top-center position', async () => {
            render(Toaster, { position: 'top-center' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveAttribute('data-x-position', 'center')
            await expect.element(toaster).toHaveAttribute('data-y-position', 'top')
        })

        it('should apply bottom-left position', async () => {
            render(Toaster, { position: 'bottom-left' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveAttribute('data-x-position', 'left')
            await expect.element(toaster).toHaveAttribute('data-y-position', 'bottom')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class alongside variant class', async () => {
            render(Toaster, { class: 'my-custom-toaster' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveClass(/my-custom-toaster/)
            await expect.element(toaster).toHaveClass(/sv5ui-toast-outline/)
        })
    })

    // ==================== PROPS FORWARDING ====================

    describe('props forwarding', () => {
        it('should forward theme prop', async () => {
            render(Toaster, { theme: 'dark' })
            const toaster = await fireToastAndGetToaster()
            await expect.element(toaster).toHaveAttribute('data-sonner-theme', 'dark')
        })
    })
})
