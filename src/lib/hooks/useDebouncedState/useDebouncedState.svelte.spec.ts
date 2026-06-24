import { flushSync } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { useDebouncedState } from './useDebouncedState.svelte.js'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('useDebouncedState', () => {
    it('updates current immediately and debounced after the delay', async () => {
        let s: ReturnType<typeof useDebouncedState<string>>
        const cleanup = $effect.root(() => {
            s = useDebouncedState('', 30)
        })
        flushSync()

        s!.current = 'a'
        flushSync()
        expect(s!.current).toBe('a')
        expect(s!.debounced).toBe('')

        await vi.waitFor(() => {
            flushSync()
            expect(s!.debounced).toBe('a')
        })
        cleanup()
    })

    it('coalesces rapid writes into the latest debounced value', async () => {
        let s: ReturnType<typeof useDebouncedState<string>>
        const cleanup = $effect.root(() => {
            s = useDebouncedState('', 30)
        })
        flushSync()

        s!.current = 'a'
        s!.current = 'ab'
        s!.current = 'abc'
        flushSync()
        expect(s!.current).toBe('abc')
        expect(s!.debounced).toBe('')

        await vi.waitFor(() => {
            flushSync()
            expect(s!.debounced).toBe('abc')
        })
        cleanup()
    })

    it('setImmediate sets both now and cancels a pending update', async () => {
        let s: ReturnType<typeof useDebouncedState<string>>
        const cleanup = $effect.root(() => {
            s = useDebouncedState('', 30)
        })
        flushSync()

        s!.current = 'typed'
        flushSync()
        s!.setImmediate('')
        flushSync()
        expect(s!.current).toBe('')
        expect(s!.debounced).toBe('')

        await wait(50)
        flushSync()
        expect(s!.debounced).toBe('')
        cleanup()
    })

    it('does not update debounced after teardown (no leak)', async () => {
        let s: ReturnType<typeof useDebouncedState<string>>
        const cleanup = $effect.root(() => {
            s = useDebouncedState('', 30)
        })
        flushSync()

        s!.current = 'x'
        cleanup()

        await wait(50)
        expect(s!.debounced).toBe('')
    })
})
