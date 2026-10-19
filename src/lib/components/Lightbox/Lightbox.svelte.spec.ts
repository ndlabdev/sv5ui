import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Lightbox from './Lightbox.svelte'
import type { LightboxApi, LightboxSlide } from './lightbox.types.js'

const slides: LightboxSlide[] = [
    { src: '/a.jpg', thumb: '/a-t.jpg', alt: 'Alpha', title: 'Alpha title' },
    { src: '/b.jpg', thumb: '/b-t.jpg', alt: 'Bravo', title: 'Bravo title' },
    { src: '/c.jpg', thumb: '/c-t.jpg', alt: 'Charlie', title: 'Charlie title' }
]

describe('Lightbox', () => {
    const getContent = () => document.querySelector('[data-dialog-content]') as HTMLElement | null
    const getOverlay = () => document.querySelector('[data-dialog-overlay]') as HTMLElement | null

    describe('gallery', () => {
        it('should render a gallery thumbnail per slide in document flow', () => {
            render(Lightbox, { slides })
            const imgs = document.querySelectorAll('button > img')
            expect(imgs.length).toBe(slides.length)
        })

        it('should render thumbnails with alt text for SEO', () => {
            render(Lightbox, { slides })
            expect(document.querySelector('img[alt="Alpha"]')).not.toBeNull()
        })

        it('should lazy-load gallery thumbnails', () => {
            render(Lightbox, { slides })
            const img = document.querySelector('button > img') as HTMLImageElement
            expect(img.getAttribute('loading')).toBe('lazy')
        })

        it('should not render the viewer content when closed', () => {
            render(Lightbox, { slides })
            expect(getContent()).toBeNull()
        })
    })

    describe('open state', () => {
        it('should render viewer content when open', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
        })

        it('should render the overlay when open', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => expect(getOverlay()).not.toBeNull())
        })

        it('should show the counter when multiple slides', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByText('1 / 3')).toBeVisible()
        })

        it('should render the active caption title', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => {
                const matches = [...document.querySelectorAll('p')].filter(
                    (el) => el.textContent === 'Alpha title'
                )
                expect(matches.length).toBeGreaterThan(0)
            })
        })
    })

    describe('navigation', () => {
        it('should advance the index via the api', async () => {
            let api = $state<LightboxApi>()
            render(Lightbox, {
                slides,
                open: true,
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api).toBeTruthy())
            api!.next()
            await expect.element(page.getByText('2 / 3')).toBeVisible()
        })

        it('should loop from the last slide to the first by default', async () => {
            let api = $state<LightboxApi>()
            render(Lightbox, {
                slides,
                open: true,
                index: 2,
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api).toBeTruthy())
            api!.next()
            await expect.element(page.getByText('1 / 3')).toBeVisible()
        })

        it('should stay open and advance when clicking the next arrow', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByText('1 / 3')).toBeVisible()
            await page.getByLabelText('Next').click()
            await expect.element(page.getByText('2 / 3')).toBeVisible()
            expect(getContent()).not.toBeNull()
        })

        it('should not loop when loop is false', async () => {
            let api = $state<LightboxApi>()
            render(Lightbox, {
                slides,
                open: true,
                index: 2,
                loop: false,
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api).toBeTruthy())
            api!.next()
            await expect.element(page.getByText('3 / 3')).toBeVisible()
        })
    })

    describe('toolbar', () => {
        it('should render a close control by default', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByLabelText('Close')).toBeVisible()
        })

        it('should hide the toolbar when toolbar is false', async () => {
            render(Lightbox, { slides, open: true, toolbar: false })
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
            expect(page.getByLabelText('Close').query()).toBeNull()
        })

        it('should render zoom controls only when zoom is enabled', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByLabelText('Zoom in')).toBeVisible()
        })

        it('should not render zoom controls when zoom is disabled', async () => {
            render(Lightbox, { slides, open: true, zoom: false })
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
            expect(page.getByLabelText('Zoom in').query()).toBeNull()
        })

        it('should render the download control for image slides', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByLabelText('Download')).toBeVisible()
        })

        it('should hide the download control for iframe slides', async () => {
            render(Lightbox, {
                slides: [{ type: 'iframe', src: 'https://example.com/embed', alt: 'Embed' }],
                open: true
            })
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
            expect(page.getByLabelText('Download').query()).toBeNull()
        })

        it('should render the rotate control for image slides', async () => {
            render(Lightbox, { slides, open: true })
            await expect.element(page.getByLabelText('Rotate')).toBeVisible()
        })

        it('should hide the rotate control for video slides', async () => {
            render(Lightbox, {
                slides: [{ type: 'video', src: '/v.mp4', alt: 'Clip' }],
                open: true
            })
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
            expect(page.getByLabelText('Rotate').query()).toBeNull()
        })
    })

    describe('thumbnails', () => {
        it('should render a thumbnail strip when multiple slides', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => {
                const strip = document.querySelector('[role="tablist"]')
                expect(strip).not.toBeNull()
            })
        })

        it('should scroll the thumbnail strip through a scroll area viewport', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => {
                expect(document.querySelector('[data-scroll-area-viewport]')).not.toBeNull()
            })

            const viewport = document.querySelector<HTMLElement>('[data-scroll-area-viewport]')!
            expect(getComputedStyle(viewport).overflowX).toBe('scroll')
            expect(viewport.querySelector('[role="tablist"]')).not.toBeNull()
        })

        it('should keep the tabs as direct children of the tablist', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => {
                expect(document.querySelector('[role="tablist"]')).not.toBeNull()
            })

            const strip = document.querySelector('[role="tablist"]')!
            const tabs = Array.from(strip.children).filter(
                (el) => el.getAttribute('role') === 'tab'
            )
            expect(tabs.length).toBe(slides.length)
        })

        it('should mark the active thumbnail as selected', async () => {
            render(Lightbox, { slides, open: true })
            await vi.waitFor(() => {
                const selected = document.querySelector('[role="tab"][aria-selected="true"]')
                expect(selected?.getAttribute('aria-label')).toBe('Alpha')
            })
        })
    })

    describe('fallback', () => {
        it('should render an icon placeholder for non-image slides without a thumbnail', () => {
            render(Lightbox, {
                slides: [{ type: 'iframe', src: 'https://example.com/embed', alt: 'Embed' }]
            })
            expect(document.querySelector('img[src="https://example.com/embed"]')).toBeNull()
            const placeholder = document.querySelector('[role="img"][aria-label="Embed"]')
            expect(placeholder).not.toBeNull()
        })

        it('should use the poster as the thumbnail for video slides', () => {
            render(Lightbox, {
                slides: [{ type: 'video', src: '/v.mp4', poster: '/poster.jpg', alt: 'Clip' }]
            })
            expect(document.querySelector('img[src="/poster.jpg"]')).not.toBeNull()
        })
    })

    describe('zoom and pan', () => {
        const portrait = (alt: string): LightboxSlide => ({
            src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200"><rect width="600" height="1200" fill="gray"/></svg>'
            )}`,
            alt,
            title: `${alt} title`,
            width: 600,
            height: 1200
        })
        const portraits = [portrait('One'), portrait('Two'), portrait('Three')]

        async function renderViewer() {
            let api = $state<LightboxApi>()
            render(Lightbox, {
                slides: portraits,
                open: true,
                ui: { track: 'test-track', caption: 'test-caption' },
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            })
            await vi.waitFor(() => {
                expect(api).toBeTruthy()
                expect(document.querySelector('img[data-zoomable]')).not.toBeNull()
            })
            const stage = document.querySelector<HTMLElement>('[aria-roledescription="carousel"]')!
            return { api: () => api!, stage }
        }

        const track = () => document.querySelector<HTMLElement>('.test-track')!
        const caption = () => document.querySelector<HTMLElement>('.test-caption')!
        const captionTitle = () => page.elementLocator(caption().querySelector('p')!)
        const isOpen = () => getContent()?.getAttribute('data-state') === 'open'

        const activeImage = () => document.querySelector<HTMLElement>('img[data-zoomable]')!

        const translateX = () => {
            const match = activeImage().style.transform.match(/translate3d\(([-\d.]+)px/)
            return match ? Number(match[1]) : 0
        }

        function wheelAtRightEdge(stage: HTMLElement, times: number) {
            const rect = stage.getBoundingClientRect()
            for (let i = 0; i < times; i++) {
                stage.dispatchEvent(
                    new WheelEvent('wheel', {
                        deltaY: -120,
                        clientX: rect.right - 10,
                        clientY: rect.top + rect.height / 2,
                        bubbles: true,
                        cancelable: true
                    })
                )
            }
        }

        it('should not zoom when double-clicking the next arrow', async () => {
            const { api } = await renderViewer()
            await userEvent.dblClick(page.getByLabelText('Next'))
            await expect.element(page.getByText('3 / 3')).toBeVisible()
            expect(api().scale).toBe(1)
        })

        it('should keep the arrows and caption outside the gesture track', async () => {
            const { stage } = await renderViewer()
            expect(stage.contains(track())).toBe(true)
            expect(track().contains(activeImage())).toBe(true)
            expect(track().contains(document.querySelector('[aria-label="Next"]'))).toBe(false)
            expect(track().contains(caption())).toBe(false)
        })

        it('should let pointer events and text selection reach the caption text', async () => {
            await renderViewer()
            expect(caption().classList).toContain('pointer-events-none')
            expect(caption().classList).toContain('*:pointer-events-auto')
            expect(caption().classList).toContain('*:select-text')
        })

        it('should not zoom when double-clicking the caption text', async () => {
            const { api } = await renderViewer()
            await userEvent.dblClick(captionTitle())
            expect(api().scale).toBe(1)
        })

        it('should stay open when clicking the caption text', async () => {
            await renderViewer()
            await userEvent.click(captionTitle())
            expect(isOpen()).toBe(true)
        })

        it('should not swipe to another slide when dragging across the caption text', async () => {
            const { api } = await renderViewer()
            await userEvent.dragAndDrop(captionTitle(), page.getByLabelText('Previous'))
            expect(api().index).toBe(0)
        })

        it('should still close when tapping the backdrop', async () => {
            await page.viewport(1280, 800)
            await renderViewer()
            const backdrop = track().querySelector<HTMLElement>('[data-lb-backdrop]')!
            const { width } = backdrop.getBoundingClientRect()
            await userEvent.click(page.elementLocator(backdrop), {
                position: { x: width - 5, y: 5 }
            })
            expect(isOpen()).toBe(false)
        })

        it('should zoom when double-clicking the image', async () => {
            const { api } = await renderViewer()
            const rect = activeImage().getBoundingClientRect()
            activeImage().dispatchEvent(
                new MouseEvent('dblclick', {
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                })
            )
            await vi.waitFor(() => expect(api().scale).toBeGreaterThan(1))
        })

        it('should keep a zoomed image from panning past its own edges', async () => {
            await page.viewport(1280, 800)
            const { api, stage } = await renderViewer()
            wheelAtRightEdge(stage, 8)
            await vi.waitFor(() => expect(api().scale).toBeGreaterThan(1))

            const scale = api().scale
            const limit = Math.max(0, (activeImage().offsetWidth * scale - stage.clientWidth) / 2)
            expect(Math.abs(translateX())).toBeLessThanOrEqual(limit + 0.5)
        })

        it('should use the rotated image width when clamping the pan', async () => {
            await page.viewport(1280, 800)
            const { api, stage } = await renderViewer()
            api().rotate()
            wheelAtRightEdge(stage, 8)
            await vi.waitFor(() => expect(api().scale).toBeGreaterThan(1))

            const scale = api().scale
            const rotatedLimit = (activeImage().offsetHeight * scale - stage.clientWidth) / 2
            const uprightLimit = (activeImage().offsetWidth * scale - stage.clientWidth) / 2
            expect(Math.abs(translateX())).toBeGreaterThan(uprightLimit)
            expect(Math.abs(translateX())).toBeLessThanOrEqual(rotatedLimit + 0.5)
        })
    })

    describe('api', () => {
        it('should expose the imperative api via bind:api', async () => {
            let api = $state<LightboxApi>()
            render(Lightbox, {
                slides,
                get api() {
                    return api
                },
                set api(v) {
                    api = v
                }
            })
            await vi.waitFor(() => expect(api).toBeTruthy())
            expect(api!.isOpen).toBe(false)
            api!.open(1)
            await vi.waitFor(() => expect(getContent()).not.toBeNull())
            expect(api!.index).toBe(1)
        })
    })
})
