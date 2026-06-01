import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInfiniteScroll } from './useInfiniteScroll.svelte.js'

describe('useInfiniteScroll', () => {
    let node: HTMLDivElement

    function makeScrollable() {
        const el = document.createElement('div')
        el.style.height = '100px'
        el.style.overflow = 'auto'

        const inner = document.createElement('div')
        inner.style.height = '1000px'
        el.appendChild(inner)

        document.body.appendChild(el)
        return el
    }

    beforeEach(() => {
        node = makeScrollable()
    })

    afterEach(() => {
        node.remove()
    })

    it('should default loading to false', () => {
        let api: ReturnType<typeof useInfiniteScroll>
        const cleanup = $effect.root(() => {
            api = useInfiniteScroll({ onLoad: () => {} })
        })
        expect(api!.loading).toBe(false)
        cleanup()
    })

    it('should call onLoad and toggle loading when scrolled near the bottom', async () => {
        const resolvers: Array<() => void> = []
        const onLoad = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolvers.push(resolve)
                })
        )

        let api: ReturnType<typeof useInfiniteScroll>
        const cleanup = $effect.root(() => {
            api = useInfiniteScroll({ onLoad })
        })
        api!.action(node)

        node.scrollTop = node.scrollHeight - node.clientHeight
        node.dispatchEvent(new Event('scroll'))

        await vi.waitFor(() => {
            expect(onLoad).toHaveBeenCalled()
            expect(api!.loading).toBe(true)
        })

        await vi.waitFor(() => {
            while (resolvers.length) resolvers.shift()!()
            expect(api!.loading).toBe(false)
        })
        cleanup()
    })

    it('should not call onLoad when disabled', async () => {
        const onLoad = vi.fn(async () => {})
        let api: ReturnType<typeof useInfiniteScroll>
        const cleanup = $effect.root(() => {
            api = useInfiniteScroll({ onLoad, enabled: () => false })
        })
        api!.action(node)

        node.scrollTop = node.scrollHeight - node.clientHeight
        node.dispatchEvent(new Event('scroll'))

        await new Promise((resolve) => setTimeout(resolve, 40))
        expect(onLoad).not.toHaveBeenCalled()
        cleanup()
    })

    it('should not re-enter while a slow onLoad is in flight', async () => {
        let resolveLoad: () => void
        const onLoad = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveLoad = resolve
                })
        )

        let api: ReturnType<typeof useInfiniteScroll>
        const cleanup = $effect.root(() => {
            api = useInfiniteScroll({ onLoad })
        })
        api!.action(node)

        node.scrollTop = node.scrollHeight - node.clientHeight
        node.dispatchEvent(new Event('scroll'))
        await vi.waitFor(() => {
            expect(onLoad).toHaveBeenCalledTimes(1)
        })

        node.dispatchEvent(new Event('scroll'))
        await new Promise((resolve) => setTimeout(resolve, 40))
        expect(onLoad).toHaveBeenCalledTimes(1)

        resolveLoad!()
        cleanup()
    })

    it('should not call onLoad when scroll is far from the bottom', async () => {
        const onLoad = vi.fn(async () => {})
        let api: ReturnType<typeof useInfiniteScroll>
        const cleanup = $effect.root(() => {
            api = useInfiniteScroll({ onLoad, threshold: 50 })
        })
        api!.action(node)

        node.scrollTop = 0
        node.dispatchEvent(new Event('scroll'))

        await new Promise((resolve) => setTimeout(resolve, 40))
        expect(onLoad).not.toHaveBeenCalled()
        cleanup()
    })
})
