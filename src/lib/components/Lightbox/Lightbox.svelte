<script lang="ts" module>
    import type { LightboxProps } from './lightbox.types.js'

    export type Props = LightboxProps
</script>

<script lang="ts">
    import { Dialog } from 'bits-ui'
    import { untrack } from 'svelte'
    import { SvelteMap, SvelteSet } from 'svelte/reactivity'
    import { lightboxVariants, lightboxDefaults } from './lightbox.variants.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import { useMediaQuery } from '../../hooks/useMediaQuery/useMediaQuery.svelte.js'
    import { useEventListener } from '../../hooks/useEventListener/useEventListener.svelte.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'
    import Tooltip from '../Tooltip/Tooltip.svelte'
    import LightboxSlide from './LightboxSlide.svelte'
    import type {
        LightboxApi,
        LightboxSlide as LightboxSlideItem,
        LightboxToolbarItem
    } from './lightbox.types.js'

    const config = getComponentConfig('lightbox', lightboxDefaults)
    const baseIcons = getComponentConfig('icons', iconsDefaults)

    let {
        slides,
        open = $bindable(false),
        index = $bindable(0),
        api = $bindable(),
        onOpenChange,
        onIndexChange,
        onOpenChangeComplete,
        trapFocus = true,
        preventScroll = true,
        onOpenAutoFocus,
        onCloseAutoFocus,
        loop = true,
        dismissible = true,
        maxScale = 5,
        zoomStep = 0.5,
        zoom = true,
        slideshow = false,
        thumbnails = true,
        counter = true,
        caption = true,
        arrows = true,
        toolbar = true,
        transition = config.defaultVariants.transition ?? 'fade',
        icons,
        ui,
        class: className,
        trigger,
        slide: slideSlot,
        thumbnail: thumbnailSlot,
        captionSlot,
        toolbarExtra
    }: Props = $props()

    const resolvedTransition = $derived(
        transition === false ? 'none' : transition === true ? 'fade' : transition
    )

    const resolvedIcons = $derived({
        prev: icons?.prev ?? baseIcons.chevronLeft,
        next: icons?.next ?? baseIcons.chevronRight,
        close: icons?.close ?? baseIcons.close,
        zoomIn: icons?.zoomIn ?? baseIcons.zoomIn,
        zoomOut: icons?.zoomOut ?? 'lucide:zoom-out',
        zoomReset: icons?.zoomReset ?? 'lucide:maximize',
        rotate: icons?.rotate ?? 'lucide:rotate-cw',
        play: icons?.play ?? 'lucide:play',
        pause: icons?.pause ?? 'lucide:pause',
        fullscreenEnter: icons?.fullscreenEnter ?? 'lucide:expand',
        fullscreenExit: icons?.fullscreenExit ?? 'lucide:shrink',
        download: icons?.download ?? 'lucide:download'
    })

    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    const total = $derived(slides.length)
    const activeSlide = $derived(slides[index])
    const activeType = $derived(activeSlide?.type ?? 'image')
    const canZoom = $derived(zoom && activeType === 'image')

    let scale = $state(1)
    let tx = $state(0)
    let ty = $state(0)
    let rotation = $state(0)
    let swipeX = $state(0)
    let dragging = $state(false)
    let playing = $state(false)
    let isFullscreen = $state(false)
    let downloading = $state(false)

    let stageEl = $state<HTMLElement | null>(null)
    let contentEl = $state<HTMLElement | null>(null)

    const pointers = new SvelteMap<number, { x: number; y: number }>()
    const brokenThumbs = new SvelteSet<string>()
    let pinchStartDist = 0
    let pinchStartScale = 1
    let panStartTx = 0
    let panStartTy = 0
    let gestureStartX = 0
    let gestureStartY = 0
    let didMove = false
    let downOnBackdrop = false
    let rafId = 0

    function resolveThumb(slide: LightboxSlideItem): string | undefined {
        if (slide.thumb) return slide.thumb
        if (slide.poster) return slide.poster
        if ((slide.type ?? 'image') === 'image') return slide.src
        return undefined
    }

    function fallbackIcon(slide: LightboxSlideItem, hadSource: boolean): string {
        if (hadSource) return 'lucide:image-off'
        const type = slide.type ?? 'image'
        if (type === 'video') return 'lucide:circle-play'
        if (type === 'iframe') return 'lucide:play'
        return 'lucide:image-off'
    }

    const slideshowDelay = $derived(
        typeof slideshow === 'object' ? (slideshow.delay ?? 4000) : 4000
    )
    const slideshowOnOpen = $derived(typeof slideshow === 'object' ? !!slideshow.playOnOpen : false)
    const slideshowEnabled = $derived(slideshow !== false && total > 1)

    const defaultToolbar: LightboxToolbarItem[] = [
        'zoomOut',
        'zoomReset',
        'zoomIn',
        'rotate',
        'slideshow',
        'fullscreen',
        'download',
        'close'
    ]

    const toolbarItems = $derived.by(() => {
        if (toolbar === false) return [] as LightboxToolbarItem[]
        const base = toolbar === true ? defaultToolbar : toolbar
        return base.filter((item) => {
            if (item === 'zoomIn' || item === 'zoomOut' || item === 'zoomReset') return canZoom
            if (item === 'rotate') return activeType === 'image'
            if (item === 'slideshow') return slideshowEnabled
            if (item === 'download')
                return activeSlide?.download !== false && activeType !== 'iframe'
            return true
        })
    })

    const showThumbnails = $derived(thumbnails && total > 1)
    const showArrows = $derived(arrows && total > 1)
    const showCounter = $derived(counter && total > 1)

    const transformStyle = $derived.by(() => {
        const base = dragging || reducedMotion.matches ? '' : 'transition: transform 200ms ease;'
        if (scale === 1) {
            const x = swipeX
            return `${base}transform: translate3d(${x}px, 0, 0) rotate(${rotation}deg);`
        }
        return `${base}transform: translate3d(${tx}px, ${ty}px, 0) rotate(${rotation}deg) scale(${scale}); cursor: ${dragging ? 'grabbing' : 'grab'};`
    })

    const variantSlots = $derived(lightboxVariants({ transition: resolvedTransition }))

    const classes = $derived({
        gallery: variantSlots.gallery({ class: [config.slots.gallery, ui?.gallery, className] }),
        galleryItem: variantSlots.galleryItem({
            class: [config.slots.galleryItem, ui?.galleryItem]
        }),
        galleryImage: variantSlots.galleryImage({
            class: [config.slots.galleryImage, ui?.galleryImage]
        }),
        overlay: variantSlots.overlay({ class: [config.slots.overlay, ui?.overlay] }),
        content: variantSlots.content({ class: [config.slots.content, ui?.content] }),
        toolbar: variantSlots.toolbar({ class: [config.slots.toolbar, ui?.toolbar] }),
        counter: variantSlots.counter({ class: [config.slots.counter, ui?.counter] }),
        toolbarSpacer: variantSlots.toolbarSpacer({
            class: [config.slots.toolbarSpacer, ui?.toolbarSpacer]
        }),
        control: variantSlots.control({ class: [config.slots.control, ui?.control] }),
        stage: variantSlots.stage({ class: [config.slots.stage, ui?.stage] }),
        track: variantSlots.track({ class: [config.slots.track, ui?.track] }),
        slide: variantSlots.slide({ class: [config.slots.slide, ui?.slide] }),
        image: variantSlots.image({ class: [config.slots.image, ui?.image] }),
        media: variantSlots.media({ class: [config.slots.media, ui?.media] }),
        arrow: variantSlots.arrow({ class: [config.slots.arrow, ui?.arrow] }),
        arrowPrev: variantSlots.arrowPrev({ class: [config.slots.arrowPrev, ui?.arrowPrev] }),
        arrowNext: variantSlots.arrowNext({ class: [config.slots.arrowNext, ui?.arrowNext] }),
        caption: variantSlots.caption({ class: [config.slots.caption, ui?.caption] }),
        captionTitle: variantSlots.captionTitle({
            class: [config.slots.captionTitle, ui?.captionTitle]
        }),
        captionDescription: variantSlots.captionDescription({
            class: [config.slots.captionDescription, ui?.captionDescription]
        }),
        thumbnails: variantSlots.thumbnails({ class: [config.slots.thumbnails, ui?.thumbnails] }),
        spinner: variantSlots.spinner({ class: [config.slots.spinner, ui?.spinner] })
    })

    function thumbnailClass(active: boolean) {
        return lightboxVariants({ transition: resolvedTransition, active }).thumbnail({
            class: [config.slots.thumbnail, ui?.thumbnail]
        })
    }

    function isWithinWindow(i: number) {
        if (Math.abs(i - index) <= 1) return true
        if (loop && total > 2) {
            if (index === 0 && i === total - 1) return true
            if (index === total - 1 && i === 0) return true
        }
        return false
    }

    function resetTransform() {
        scale = 1
        tx = 0
        ty = 0
        rotation = 0
        swipeX = 0
    }

    function setIndex(next: number) {
        if (next === index) return
        index = next
        onIndexChange?.(next)
    }

    function goTo(i: number) {
        if (total === 0) return
        let next = i
        if (next < 0) next = loop ? total - 1 : 0
        else if (next > total - 1) next = loop ? 0 : total - 1
        resetTransform()
        setIndex(next)
    }

    function next() {
        goTo(index + 1)
    }

    function prev() {
        goTo(index - 1)
    }

    function openViewer(i = 0) {
        resetTransform()
        index = Math.min(Math.max(i, 0), Math.max(total - 1, 0))
        onIndexChange?.(index)
        open = true
    }

    function close() {
        open = false
    }

    function clampScale(value: number) {
        return Math.min(Math.max(value, 1), maxScale)
    }

    function clampPan() {
        if (!stageEl || scale <= 1) {
            tx = 0
            ty = 0
            return
        }
        const rect = stageEl.getBoundingClientRect()
        const maxX = (rect.width * (scale - 1)) / 2
        const maxY = (rect.height * (scale - 1)) / 2
        tx = Math.min(Math.max(tx, -maxX), maxX)
        ty = Math.min(Math.max(ty, -maxY), maxY)
    }

    function zoomTo(nextScale: number, originX?: number, originY?: number) {
        if (!canZoom) return
        const clamped = clampScale(nextScale)
        if (stageEl && originX !== undefined && originY !== undefined) {
            const rect = stageEl.getBoundingClientRect()
            const cx = originX - rect.left - rect.width / 2
            const cy = originY - rect.top - rect.height / 2
            const ratio = clamped / scale
            tx = cx - (cx - tx) * ratio
            ty = cy - (cy - ty) * ratio
        }
        scale = clamped
        if (scale === 1) {
            tx = 0
            ty = 0
        } else {
            clampPan()
        }
    }

    function zoomIn() {
        zoomTo(scale + zoomStep)
    }

    function zoomOut() {
        zoomTo(scale - zoomStep)
    }

    function resetZoom() {
        scale = 1
        tx = 0
        ty = 0
    }

    function rotate() {
        rotation = (rotation + 90) % 360
    }

    function downloadName(slide: LightboxSlideItem, url: string): string {
        try {
            const base = new URL(url, location.href).pathname.split('/').pop()
            if (base && base.includes('.')) return base
        } catch {
            void 0
        }
        const slug = (slide.alt || 'download')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        return slug || 'download'
    }

    function triggerDownload(href: string, name: string, openInTab: boolean) {
        const a = document.createElement('a')
        a.href = href
        a.download = name
        if (openInTab) {
            a.rel = 'noopener'
            a.target = '_blank'
        }
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    async function downloadActive() {
        const slide = activeSlide
        if (!slide || downloading) return
        const url = typeof slide.download === 'string' ? slide.download : slide.src
        if (!url) return
        const name = downloadName(slide, url)
        downloading = true
        try {
            const res = await fetch(url, { mode: 'cors' })
            if (!res.ok) throw new Error('fetch failed')
            const objectUrl = URL.createObjectURL(await res.blob())
            triggerDownload(objectUrl, name, false)
            setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
        } catch {
            triggerDownload(url, name, true)
        } finally {
            downloading = false
        }
    }

    function toggleFullscreen() {
        if (typeof document === 'undefined') return
        if (document.fullscreenElement) {
            document.exitFullscreen?.()
        } else {
            contentEl?.requestFullscreen?.()
        }
    }

    function toggleSlideshow() {
        playing = !playing
    }

    function onDoubleClick(event: MouseEvent) {
        if (!canZoom) return
        if (scale > 1) resetZoom()
        else zoomTo(Math.min(2.5, maxScale), event.clientX, event.clientY)
    }

    function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
        return Math.hypot(a.x - b.x, a.y - b.y)
    }

    function onPointerDown(event: PointerEvent) {
        if (event.button !== 0 && event.pointerType === 'mouse') return
        const target = event.target as HTMLElement
        if (target.closest('button, a, input, video, iframe')) return
        downOnBackdrop = target.dataset.lbBackdrop !== undefined
        ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
        didMove = false
        if (pointers.size === 2) {
            const [p1, p2] = [...pointers.values()]
            pinchStartDist = distance(p1, p2)
            pinchStartScale = scale
        } else {
            gestureStartX = event.clientX
            gestureStartY = event.clientY
            panStartTx = tx
            panStartTy = ty
            dragging = true
        }
    }

    function onPointerMove(event: PointerEvent) {
        if (!pointers.has(event.pointerId)) return
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

        if (pointers.size === 2) {
            const [p1, p2] = [...pointers.values()]
            const dist = distance(p1, p2)
            if (pinchStartDist > 0) {
                const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
                zoomTo((pinchStartScale * dist) / pinchStartDist, mid.x, mid.y)
            }
            didMove = true
            return
        }

        const dx = event.clientX - gestureStartX
        const dy = event.clientY - gestureStartY
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didMove = true

        if (scale > 1) {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                tx = panStartTx + dx
                ty = panStartTy + dy
                clampPan()
                rafId = 0
            })
        } else {
            swipeX = dx
        }
    }

    function handleSwipeEnd(event: PointerEvent) {
        const threshold = stageEl ? Math.min(120, stageEl.clientWidth * 0.2) : 80
        const passed = Math.abs(swipeX) >= threshold && total > 1
        const backdropTap = !didMove && dismissible && downOnBackdrop
        swipeX = 0
        if (passed) {
            if (event.clientX < gestureStartX) next()
            else prev()
        } else if (backdropTap) {
            close()
        }
    }

    function endPointer(event: PointerEvent) {
        if (!pointers.has(event.pointerId)) return
        pointers.delete(event.pointerId)

        if (pointers.size < 2) pinchStartDist = 0
        if (pointers.size > 0) return

        dragging = false
        if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = 0
        }

        if (scale === 1) handleSwipeEnd(event)
        else clampPan()
    }

    function onWheel(event: WheelEvent) {
        if (!canZoom || !open) return
        event.preventDefault()
        const factor = event.deltaY < 0 ? 1 + zoomStep : 1 / (1 + zoomStep)
        zoomTo(scale * factor, event.clientX, event.clientY)
    }

    function onZoomKey(key: string) {
        if (!canZoom) return false
        if (key === '+' || key === '=') zoomIn()
        else if (key === '-') zoomOut()
        else if (key === '0') resetZoom()
        else return false
        return true
    }

    function onKeydown(event: KeyboardEvent) {
        if (!open) return
        if (event.key === 'ArrowRight') next()
        else if (event.key === 'ArrowLeft') prev()
        else if (!onZoomKey(event.key)) return
        event.preventDefault()
    }

    function handleOpenChange(value: boolean) {
        open = value
        onOpenChange?.(value)
    }

    useEventListener(() => stageEl, 'wheel', onWheel as EventListener, { passive: false })
    useEventListener(() => (open ? window : null), 'keydown', onKeydown as EventListener)
    useEventListener(
        () => (typeof document !== 'undefined' ? document : null),
        'fullscreenchange',
        () => {
            isFullscreen = !!document.fullscreenElement
        }
    )

    $effect(() => {
        if (open) {
            playing = untrack(() => (slideshowEnabled && slideshowOnOpen ? true : false))
        } else {
            playing = false
            pointers.clear()
            untrack(() => resetTransform())
        }
    })

    $effect(() => {
        if (!open || !playing || !slideshowEnabled) return
        const id = setInterval(() => next(), slideshowDelay)
        return () => clearInterval(id)
    })

    $effect(() => {
        api = {
            open: openViewer,
            close,
            next,
            prev,
            goTo,
            zoomIn,
            zoomOut,
            resetZoom,
            rotate,
            toggleSlideshow,
            get index() {
                return index
            },
            get scale() {
                return scale
            },
            get isOpen() {
                return open
            }
        } satisfies LightboxApi
    })

    const dismissBehavior = $derived(dismissible ? ('close' as const) : ('ignore' as const))
</script>

{#snippet control(
    icon: string,
    label: string,
    onclick: () => void,
    disabled = false,
    spinning = false
)}
    <Tooltip
        text={label}
        side="bottom"
        portal={false}
        delayDuration={200}
        ignoreNonKeyboardFocus
        class="inline-flex"
    >
        <button type="button" class={classes.control} aria-label={label} {onclick} {disabled}>
            <Icon name={icon} class={['size-5', spinning && 'animate-spin']} aria-hidden="true" />
        </button>
    </Tooltip>
{/snippet}

{#snippet mediaThumb(slide: LightboxSlideItem, imgClass: string, decorative = false)}
    {@const src = resolveThumb(slide)}
    {#if src && !brokenThumbs.has(src)}
        <img
            {src}
            srcset={src === slide.src ? slide.srcset : undefined}
            sizes={src === slide.src ? slide.sizes : undefined}
            alt={decorative ? '' : slide.alt}
            width={slide.width}
            height={slide.height}
            loading="lazy"
            decoding="async"
            class={imgClass}
            onerror={() => brokenThumbs.add(src)}
        />
    {:else}
        <div
            class={[
                imgClass,
                'flex items-center justify-center bg-surface-container-high text-on-surface-variant'
            ]}
            role="img"
            aria-label={decorative ? undefined : slide.alt}
        >
            <Icon name={fallbackIcon(slide, !!src)} class="size-8 opacity-60" />
        </div>
    {/if}
{/snippet}

{#if trigger}
    {@render trigger({ slides, open: openViewer })}
{:else}
    <div class={classes.gallery}>
        {#each slides as slide, i (i)}
            <button
                type="button"
                class={classes.galleryItem}
                onclick={() => openViewer(i)}
                aria-label={`View ${slide.alt}`}
            >
                {@render mediaThumb(slide, classes.galleryImage)}
            </button>
        {/each}
    </div>
{/if}

<Dialog.Root bind:open onOpenChange={handleOpenChange} {onOpenChangeComplete}>
    <Dialog.Portal>
        <Dialog.Overlay class={classes.overlay} />
        <Dialog.Content
            bind:ref={contentEl}
            {trapFocus}
            {preventScroll}
            {onOpenAutoFocus}
            {onCloseAutoFocus}
            escapeKeydownBehavior={dismissBehavior}
            interactOutsideBehavior="ignore"
            class={classes.content}
        >
            <Dialog.Title class="sr-only">
                {activeSlide?.title ?? activeSlide?.alt ?? 'Media viewer'}
            </Dialog.Title>
            <Dialog.Description class="sr-only">
                {activeSlide?.description ??
                    `Image ${index + 1} of ${total}. Use arrow keys to navigate.`}
            </Dialog.Description>

            {#if toolbarItems.length || showCounter || toolbarExtra}
                <div class={classes.toolbar}>
                    {#if showCounter}
                        <span class={classes.counter}>{index + 1} / {total}</span>
                    {/if}
                    <div class={classes.toolbarSpacer}></div>
                    {#if toolbarExtra}{@render toolbarExtra()}{/if}
                    {#each toolbarItems as item (item)}
                        {#if item === 'zoomOut'}
                            {@render control(
                                resolvedIcons.zoomOut,
                                'Zoom out',
                                zoomOut,
                                scale <= 1
                            )}
                        {:else if item === 'zoomReset'}
                            {@render control(
                                resolvedIcons.zoomReset,
                                'Reset zoom',
                                resetZoom,
                                scale === 1
                            )}
                        {:else if item === 'zoomIn'}
                            {@render control(
                                resolvedIcons.zoomIn,
                                'Zoom in',
                                zoomIn,
                                scale >= maxScale
                            )}
                        {:else if item === 'rotate'}
                            {@render control(resolvedIcons.rotate, 'Rotate', rotate)}
                        {:else if item === 'slideshow'}
                            {@render control(
                                playing ? resolvedIcons.pause : resolvedIcons.play,
                                playing ? 'Pause slideshow' : 'Play slideshow',
                                toggleSlideshow
                            )}
                        {:else if item === 'fullscreen'}
                            {@render control(
                                isFullscreen
                                    ? resolvedIcons.fullscreenExit
                                    : resolvedIcons.fullscreenEnter,
                                isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
                                toggleFullscreen
                            )}
                        {:else if item === 'download'}
                            {@render control(
                                downloading ? baseIcons.loading : resolvedIcons.download,
                                'Download',
                                downloadActive,
                                downloading,
                                downloading
                            )}
                        {:else if item === 'close'}
                            {@render control(resolvedIcons.close, 'Close', close)}
                        {/if}
                    {/each}
                </div>
            {/if}

            <div
                bind:this={stageEl}
                class={classes.stage}
                role="group"
                aria-roledescription="carousel"
                aria-label="Media"
                data-lb-backdrop
                onpointerdown={onPointerDown}
                onpointermove={onPointerMove}
                onpointerup={endPointer}
                onpointercancel={endPointer}
                ondblclick={onDoubleClick}
            >
                {#each slides as slide, i (i)}
                    {#if isWithinWindow(i)}
                        <div
                            class="absolute inset-0 transition-opacity duration-200"
                            style:opacity={i === index ? 1 : 0}
                            style:pointer-events={i === index ? 'auto' : 'none'}
                            style:z-index={i === index ? 1 : 0}
                            data-lb-backdrop
                            inert={i === index ? undefined : true}
                        >
                            {#if slideSlot}
                                {@render slideSlot({ slide, index: i, active: i === index, scale })}
                            {:else}
                                <LightboxSlide
                                    {slide}
                                    active={i === index}
                                    eager={isWithinWindow(i)}
                                    transform={transformStyle}
                                    zoomable={canZoom}
                                    slideClass={classes.slide}
                                    imageClass={classes.image}
                                    mediaClass={classes.media}
                                    spinnerClass={classes.spinner}
                                    loadingIcon={baseIcons.loading}
                                />
                            {/if}
                        </div>
                    {/if}
                {/each}

                {#if showArrows}
                    <Button
                        square
                        size="xl"
                        variant="ghost"
                        color="surface"
                        leadingIcon={resolvedIcons.prev}
                        aria-label="Previous"
                        title="Previous"
                        disabled={!loop && index === 0}
                        onclick={prev}
                        class={[classes.arrow, classes.arrowPrev]}
                    />
                    <Button
                        square
                        size="xl"
                        variant="ghost"
                        color="surface"
                        leadingIcon={resolvedIcons.next}
                        aria-label="Next"
                        title="Next"
                        disabled={!loop && index === total - 1}
                        onclick={next}
                        class={[classes.arrow, classes.arrowNext]}
                    />
                {/if}

                {#if caption && (activeSlide?.title || activeSlide?.description || captionSlot)}
                    <div class={classes.caption}>
                        {#if captionSlot}
                            {@render captionSlot({ slide: activeSlide, index, total })}
                        {:else}
                            {#if activeSlide?.title}
                                <p class={classes.captionTitle}>{activeSlide.title}</p>
                            {/if}
                            {#if activeSlide?.description}
                                <p class={classes.captionDescription}>{activeSlide.description}</p>
                            {/if}
                        {/if}
                    </div>
                {/if}
            </div>

            {#if showThumbnails}
                <div class={classes.thumbnails} role="tablist" aria-label="Thumbnails">
                    {#each slides as slide, i (i)}
                        <button
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            aria-label={slide.alt}
                            class={thumbnailClass(i === index)}
                            onclick={() => goTo(i)}
                        >
                            {#if thumbnailSlot}
                                {@render thumbnailSlot({
                                    slide,
                                    index: i,
                                    active: i === index,
                                    select: () => goTo(i)
                                })}
                            {:else}
                                {@render mediaThumb(slide, 'size-full object-cover', true)}
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
