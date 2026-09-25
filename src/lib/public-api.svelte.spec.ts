import { describe, expect, it } from 'vitest'
import * as sv5ui from './index.js'

describe('public API', () => {
    describe('theme mode', () => {
        it('should expose the theme mode handler component', () => {
            expect(typeof sv5ui.ThemeMode).toBe('function')
        })

        it.each(['toggleMode', 'setMode', 'resetMode'] as const)(
            'should expose %s without requiring a separate package',
            (name) => {
                expect(typeof sv5ui[name]).toBe('function')
            }
        )

        it('should expose the reactive mode state', () => {
            expect(sv5ui.mode).toBeDefined()
            expect('current' in sv5ui.mode).toBe(true)
        })
    })

    describe('configuration', () => {
        it.each(['defineConfig', 'resetConfig'] as const)('should expose %s', (name) => {
            expect(typeof sv5ui[name]).toBe('function')
        })
    })
})
