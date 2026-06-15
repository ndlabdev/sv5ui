import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useMediaQuery } from './useMediaQuery.svelte.js'

describe('useMediaQuery', () => {
    let originalMatchMedia: typeof window.matchMedia
    let fakeMatches: boolean
    let capturedHandler: ((event: { matches: boolean }) => void) | undefined
    let removed: boolean

    beforeEach(() => {
        originalMatchMedia = window.matchMedia
        fakeMatches = false
        capturedHandler = undefined
        removed = false

        window.matchMedia = ((query: string) => ({
            media: query,
            get matches() {
                return fakeMatches
            },
            addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
                capturedHandler = listener
            },
            removeEventListener: () => {
                removed = true
            }
        })) as unknown as typeof window.matchMedia
    })

    afterEach(() => {
        window.matchMedia = originalMatchMedia
    })

    it('should default to false before the effect runs', () => {
        let api: ReturnType<typeof useMediaQuery>
        const cleanup = $effect.root(() => {
            api = useMediaQuery('(max-width: 640px)')
        })
        expect(api!.matches).toBe(false)
        cleanup()
    })

    it('should respect a custom initialValue', () => {
        let api: ReturnType<typeof useMediaQuery>
        const cleanup = $effect.root(() => {
            api = useMediaQuery('(max-width: 640px)', { initialValue: true })
        })
        expect(api!.matches).toBe(true)
        cleanup()
    })

    it('should reflect the fake matchMedia value after the effect runs', () => {
        fakeMatches = true
        let api: ReturnType<typeof useMediaQuery>
        const cleanup = $effect.root(() => {
            api = useMediaQuery('(max-width: 640px)')
        })
        flushSync()
        expect(api!.matches).toBe(true)
        cleanup()
    })

    it('should update matches when the change listener fires', () => {
        let api: ReturnType<typeof useMediaQuery>
        const cleanup = $effect.root(() => {
            api = useMediaQuery('(max-width: 640px)')
        })
        flushSync()
        expect(api!.matches).toBe(false)

        capturedHandler!({ matches: true })
        flushSync()
        expect(api!.matches).toBe(true)

        capturedHandler!({ matches: false })
        flushSync()
        expect(api!.matches).toBe(false)
        cleanup()
    })

    it('should accept a getter function for the query', () => {
        fakeMatches = true
        let api: ReturnType<typeof useMediaQuery>
        const cleanup = $effect.root(() => {
            api = useMediaQuery(() => '(prefers-color-scheme: dark)')
        })
        flushSync()
        expect(api!.matches).toBe(true)
        cleanup()
    })

    it('should remove the listener on cleanup', () => {
        const cleanup = $effect.root(() => {
            useMediaQuery('(max-width: 640px)')
        })
        flushSync()
        expect(removed).toBe(false)
        cleanup()
        expect(removed).toBe(true)
    })
})
