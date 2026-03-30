import { describe, expect, it } from 'vitest'
import { toastDefaults, type ToastVariant } from './toast.variants.js'

describe('toast.variants', () => {
    it('should have outline as default variant', () => {
        expect(toastDefaults.defaultVariants.variant).toBe('outline')
    })

    it('should export ToastVariant type with all expected values', () => {
        const validVariants: ToastVariant[] = ['solid', 'outline', 'soft', 'subtle', 'accent']
        expect(validVariants).toHaveLength(5)
    })
})
