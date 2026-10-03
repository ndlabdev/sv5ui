import { describe, expect, it } from 'vitest'

Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() {
        throw new DOMException('Storage access denied', 'SecurityError')
    }
})

describe('ThemeMode with storage access denied', () => {
    it('finding 13: importing the module throws', async () => {
        await expect(import('./index.js')).rejects.toThrow('Storage access denied')
    })
})
