import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest'

// Mock svelte-sonner before importing toast
vi.mock('svelte-sonner', () => {
    const fn = Object.assign(vi.fn(), {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        loading: vi.fn(),
        promise: vi.fn(),
        dismiss: vi.fn(),
        custom: vi.fn(),
        message: vi.fn()
    })
    return { toast: fn }
})

// Mock svelte mount/unmount
vi.mock('svelte', async (importOriginal) => {
    const original = await importOriginal<typeof import('svelte')>()
    return {
        ...original,
        mount: vi.fn(() => ({})),
        unmount: vi.fn()
    }
})

import { toast } from './toast.js'
import { toast as sonnerToast } from 'svelte-sonner'

const mockSonner = sonnerToast as unknown as Mock & {
    success: Mock
    error: Mock
    warning: Mock
    info: Mock
    loading: Mock
    promise: Mock
    dismiss: Mock
    custom: Mock
    message: Mock
}

describe('toast wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ==================== BASIC FORWARDING ====================

    describe('basic forwarding', () => {
        it('should forward message and options to sonner', () => {
            toast('Hello')
            expect(mockSonner).toHaveBeenCalledWith('Hello', undefined)
        })

        it('should forward description option', () => {
            toast('Title', { description: 'Desc' })
            expect(mockSonner).toHaveBeenCalledWith(
                'Title',
                expect.objectContaining({ description: 'Desc' })
            )
        })

        it('should forward typed methods', () => {
            toast.success('OK')
            expect(mockSonner.success).toHaveBeenCalledWith('OK', undefined)

            toast.error('Fail')
            expect(mockSonner.error).toHaveBeenCalledWith('Fail', undefined)

            toast.warning('Warn')
            expect(mockSonner.warning).toHaveBeenCalledWith('Warn', undefined)

            toast.info('Info')
            expect(mockSonner.info).toHaveBeenCalledWith('Info', undefined)

            toast.loading('Loading')
            expect(mockSonner.loading).toHaveBeenCalledWith('Loading', undefined)
        })
    })

    // ==================== COLOR ====================

    describe('color option', () => {
        it('should inject sv5ui-color-{color} class', () => {
            toast('Test', { color: 'primary' })
            expect(mockSonner).toHaveBeenCalledWith(
                'Test',
                expect.objectContaining({ class: 'sv5ui-color-primary' })
            )
        })

        it('should preserve existing class alongside color class', () => {
            toast('Test', { color: 'tertiary', class: 'my-class' })
            expect(mockSonner).toHaveBeenCalledWith(
                'Test',
                expect.objectContaining({ class: 'my-class sv5ui-color-tertiary' })
            )
        })

        it('should work with typed methods', () => {
            toast.success('OK', { color: 'secondary' })
            expect(mockSonner.success).toHaveBeenCalledWith(
                'OK',
                expect.objectContaining({ class: 'sv5ui-color-secondary' })
            )
        })

        it('should not add color class when color is not provided', () => {
            toast('Test', { description: 'Desc' })
            const call = mockSonner.mock.calls[0][1]
            expect(call?.class).toBeUndefined()
        })
    })

    // ==================== ICON ====================

    describe('icon option', () => {
        it('should convert string icon to a component', () => {
            toast('Test', { icon: 'lucide:rocket' })
            const call = mockSonner.mock.calls[0][1]
            expect(typeof call?.icon).toBe('function')
        })

        it('should pass null icon through', () => {
            toast.success('Test', { icon: null })
            const call = mockSonner.success.mock.calls[0][1]
            expect(call?.icon).toBeNull()
        })

        it('should not set icon when not provided', () => {
            toast('Test', { description: 'Desc' })
            const call = mockSonner.mock.calls[0][1]
            expect(call?.icon).toBeUndefined()
        })
    })

    // ==================== AVATAR ====================

    describe('avatar option', () => {
        it('should convert avatar to a component in icon slot', () => {
            toast('Test', { avatar: { src: '/img.jpg', alt: 'User' } })
            const call = mockSonner.mock.calls[0][1]
            expect(typeof call?.icon).toBe('function')
        })

        it('should prioritize avatar over icon', () => {
            toast('Test', { avatar: { alt: 'User' }, icon: 'lucide:rocket' })
            const call = mockSonner.mock.calls[0][1]
            expect(typeof call?.icon).toBe('function')
        })
    })

    // ==================== COMBINED ====================

    describe('combined options', () => {
        it('should handle color + icon together', () => {
            toast('Test', { color: 'warning', icon: 'lucide:shield' })
            const call = mockSonner.mock.calls[0][1]
            expect(call?.class).toBe('sv5ui-color-warning')
            expect(typeof call?.icon).toBe('function')
        })

        it('should handle color + avatar together', () => {
            toast('Test', { color: 'info', avatar: { src: '/a.jpg', alt: 'A' } })
            const call = mockSonner.mock.calls[0][1]
            expect(call?.class).toBe('sv5ui-color-info')
            expect(typeof call?.icon).toBe('function')
        })

        it('should strip color/icon/avatar from resolved options', () => {
            toast('Test', { color: 'primary', icon: 'lucide:x', description: 'D' })
            const call = mockSonner.mock.calls[0][1] as Record<string, unknown>
            expect(call).not.toHaveProperty('color')
            expect(call).not.toHaveProperty('avatar')
            expect(call).toHaveProperty('description', 'D')
        })
    })

    // ==================== PASSTHROUGH METHODS ====================

    describe('passthrough methods', () => {
        it('should pass through dismiss', () => {
            toast.dismiss()
            expect(mockSonner.dismiss).toHaveBeenCalled()
        })

        it('should pass through promise', () => {
            const p = Promise.resolve()
            toast.promise(p, { loading: 'L', success: 'S', error: 'E' })
            expect(mockSonner.promise).toHaveBeenCalledWith(p, {
                loading: 'L',
                success: 'S',
                error: 'E'
            })
        })
    })
})
